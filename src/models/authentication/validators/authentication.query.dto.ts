import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator';

export class AuthenticationLoginQuery {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  code: string;
}
