import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { nanoid } from 'nanoid';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './strategies/jwt.strategy';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokensService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  /** Issues an access/refresh pair and persists a hash of the refresh token. */
  async issueTokens(user: Pick<User, 'id' | 'role' | 'phone'>): Promise<TokenPair> {
    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
      phone: user.phone,
    };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_TTL ?? '15m',
    });

    // Opaque refresh token; only its hash is stored.
    const refreshToken = `${user.id}.${nanoid(48)}`;
    const tokenHash = await argon2.hash(refreshToken);
    const ttlDays = this.parseDays(process.env.JWT_REFRESH_TTL ?? '30d');

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  /** Validates a refresh token, rotates it, and returns a fresh pair. */
  async rotate(refreshToken: string): Promise<TokenPair> {
    const userId = refreshToken.split('.')[0];
    if (!userId) throw new Error('Malformed refresh token');

    const candidates = await this.prisma.refreshToken.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
      include: { user: true },
    });

    for (const record of candidates) {
      if (await argon2.verify(record.tokenHash, refreshToken)) {
        await this.prisma.refreshToken.update({
          where: { id: record.id },
          data: { revokedAt: new Date() },
        });
        return this.issueTokens(record.user);
      }
    }
    throw new Error('Invalid refresh token');
  }

  async revokeAll(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private parseDays(ttl: string): number {
    const match = /^(\d+)d$/.exec(ttl);
    return match ? Number(match[1]) : 30;
  }
}
