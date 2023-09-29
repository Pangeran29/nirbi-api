import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum SortEnum {
  ASC = 'asc',
  DSC = 'desc',
}

export class FindManyRecordDto {
  @ApiProperty({
    description: 'How many record want to skip',
    example: 0,
  })
  @IsNumber()
  @IsOptional()
  skip?: number;

  @ApiProperty({
    description: 'How many record want to take',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  take?: number;

  @ApiProperty({
    description: 'Optional search',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Sort field createdAt',
  })
  @IsOptional()
  @IsEnum(SortEnum)
  sort?: SortEnum;

  @ApiProperty({ example: new Date() })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  createdAtStartDate?: Date;

  @ApiProperty({ example: new Date() })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => {
    const endDate = new Date(value);
    endDate.setDate(endDate.getDate() + 1);
    return endDate;
  })
  createdAtEndDate?: Date;
}
