import { HttpStatus } from '@nestjs/common';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class DefaultResponseDto {
  @IsNotEmpty()
  @IsNumber()
  status: HttpStatus;

  @IsOptional()
  @IsString()
  message?: string;
}
