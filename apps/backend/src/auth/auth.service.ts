import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TokensService, TokenPair } from './tokens.service';

const MAX_OTP_ATTEMPTS = 5;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokens: TokensService,
  ) {}

  /** Generates and "sends" a 6-digit OTP. In dev mode the code is returned. */
  async requestOtp(phone: string): Promise<{ sent: true; devCode?: string }> {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await argon2.hash(code);
    const ttl = Number(process.env.OTP_TTL_SECONDS ?? 300);

    await this.prisma.otpChallenge.create({
      data: {
        phone,
        codeHash,
        expiresAt: new Date(Date.now() + ttl * 1000),
      },
    });

    const devMode = process.env.OTP_DEV_MODE === 'true';
    if (devMode) {
      this.logger.warn(`[DEV OTP] ${phone} -> ${code}`);
      return { sent: true, devCode: code };
    }
    // TODO: integrate SMS provider (Twilio / local PK gateway) here.
    return { sent: true };
  }

  async verifyOtp(
    phone: string,
    code: string,
    role: UserRole = UserRole.CUSTOMER,
  ): Promise<TokenPair & { isNewUser: boolean }> {
    const challenge = await this.prisma.otpChallenge.findFirst({
      where: { phone, consumedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!challenge) {
      throw new BadRequestException('No active OTP. Please request a new code.');
    }
    if (challenge.attempts >= MAX_OTP_ATTEMPTS) {
      throw new BadRequestException('Too many attempts. Request a new code.');
    }

    const valid = await argon2.verify(challenge.codeHash, code);
    if (!valid) {
      await this.prisma.otpChallenge.update({
        where: { id: challenge.id },
        data: { attempts: { increment: 1 } },
      });
      throw new UnauthorizedException('Incorrect code.');
    }

    await this.prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: { consumedAt: new Date() },
    });

    const existing = await this.prisma.user.findUnique({ where: { phone } });
    const isNewUser = !existing;

    const user =
      existing ??
      (await this.prisma.user.create({
        data: { phone, role },
      }));

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active.');
    }

    const tokens = await this.tokens.issueTokens(user);
    return { ...tokens, isNewUser };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    try {
      return await this.tokens.rotate(refreshToken);
    } catch {
      throw new UnauthorizedException('Could not refresh session.');
    }
  }

  async logout(userId: string): Promise<{ success: true }> {
    await this.tokens.revokeAll(userId);
    return { success: true };
  }
}
