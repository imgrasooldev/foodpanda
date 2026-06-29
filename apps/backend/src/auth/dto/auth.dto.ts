import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class RequestOtpDto {
  @ApiProperty({ example: '+923001234567' })
  @IsPhoneNumber()
  phone!: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '+923001234567' })
  @IsPhoneNumber()
  phone!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6)
  code!: string;

  @ApiProperty({
    enum: UserRole,
    required: false,
    description: 'Role to register as on first login. Defaults to CUSTOMER.',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class RefreshDto {
  @ApiProperty()
  @IsString()
  refreshToken!: string;
}
