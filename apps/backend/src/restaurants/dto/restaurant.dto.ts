import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Burger Lab' })
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Shop 12, Tariq Road' })
  @IsString()
  addressLine!: string;

  @ApiProperty({ example: 'Karachi' })
  @IsString()
  city!: string;

  @ApiProperty({ example: 24.8607 })
  @IsLatitude()
  latitude!: number;

  @ApiProperty({ example: 67.0011 })
  @IsLongitude()
  longitude!: number;

  @ApiProperty({ example: '+922134567890' })
  @IsString()
  phone!: string;

  @ApiPropertyOptional({ type: [String], description: 'Cuisine names' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cuisines?: string[];

  @ApiPropertyOptional({ example: 99 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  deliveryFee?: number;

  @ApiPropertyOptional({ example: 300 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderAmount?: number;
}

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  @ApiPropertyOptional()
  @IsOptional()
  isOpen?: boolean;
}

export class BrowseRestaurantsDto {
  @ApiPropertyOptional({ description: 'Customer latitude for nearby search' })
  @IsOptional()
  @Type(() => Number)
  @IsLatitude()
  lat?: number;

  @ApiPropertyOptional({ description: 'Customer longitude for nearby search' })
  @IsOptional()
  @Type(() => Number)
  @IsLongitude()
  lng?: number;

  @ApiPropertyOptional({ description: 'Search by name' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ description: 'Filter by cuisine name' })
  @IsOptional()
  @IsString()
  cuisine?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;
}
