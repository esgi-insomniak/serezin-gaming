import { HttpStatus, mixin } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

type Constructor<T = object> = new (...args: any[]) => T;

export function withBaseResponse<TBase extends Constructor>(
  Base: TBase,
  options?: ApiPropertyOptions | undefined,
) {
  class ResponseDto {
    @ApiProperty({ enum: HttpStatus, example: 200 })
    @IsNumber()
    statusCode: HttpStatus;

    @ApiProperty({ example: 'Success' })
    @IsString()
    message: string;

    @ApiProperty({
      type: Base,
      ...options,
    })
    @Type(() => Base)
    @ValidateNested({ each: true })
    data: InstanceType<TBase>;

    @ApiProperty()
    @ValidateNested({ each: true })
    meta: { [key: string]: any };
  }
  return mixin(ResponseDto);
}
