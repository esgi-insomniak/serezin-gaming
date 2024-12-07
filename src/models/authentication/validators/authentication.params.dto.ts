import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator';

export class AuthenticationExchangeCodeParam {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  code: string;
}
