import { HttpStatus, mixin } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { ResponseMessageEnum } from '../enum/response.enum';

type Constructor<T = object> = new (...args: any[]) => T;

export function withBaseResponse<TBase extends Constructor>(
  Base: TBase,
  exampleData: {
    statusCode: HttpStatus;
    message: string;
  },
  options?: ApiPropertyOptions | undefined,
) {
  class ResponseDto {
    @ApiProperty({ example: exampleData.statusCode })
    @IsNumber()
    statusCode: HttpStatus;

    @ApiProperty({ example: exampleData.message })
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

export function withBaseErrorResponse(exampleData: {
  statusCode: HttpStatus;
  message: string;
}) {
  class ErrorResponseDto {
    @ApiProperty({ example: exampleData.statusCode })
    @IsNumber()
    statusCode: HttpStatus;

    @ApiProperty({
      properties: {
        message: {
          oneOf: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } },
          ],
          example: exampleData.message,
        },
      },
    } as ApiPropertyOptions)
    error: {
      message: string | string[];
    };
  }

  return mixin(ErrorResponseDto);
}

export class InternalServerErrorResponseDto extends withBaseErrorResponse({
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  message: ResponseMessageEnum.INTERNAL_SERVER_ERROR,
}) {}

export class ForbiddenResponseDto extends withBaseErrorResponse({
  statusCode: HttpStatus.FORBIDDEN,
  message: ResponseMessageEnum.FORBIDDEN,
}) {}
