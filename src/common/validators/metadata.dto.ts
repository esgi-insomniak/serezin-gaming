import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class ResponsePaginationMetaDto {
  @ApiProperty()
  @IsNumber()
  currentPage: number;

  @ApiProperty()
  @IsNumber()
  totalPages: number;

  @ApiProperty()
  @IsNumber()
  itemsPerPage: number;

  @ApiProperty()
  @IsNumber()
  totalItems: number;

  @ApiProperty()
  @IsBoolean()
  haveNextPage: boolean;

  @ApiProperty()
  @IsBoolean()
  havePreviousPage: boolean;
}
