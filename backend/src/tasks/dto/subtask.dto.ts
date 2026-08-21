import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PRIORITIES } from '../../common/constants';

export class CreateSubtaskDto {
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsIn(PRIORITIES)
  priority?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  memberIds?: string[];

  @IsOptional()
  @IsISO8601()
  dueDate?: string | null;

  @IsOptional()
  @IsBoolean()
  done?: boolean;
}

export class UpdateSubtaskDto extends PartialType(CreateSubtaskDto) {}
