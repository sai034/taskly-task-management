import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { ACTIVITY_KINDS } from '../../common/constants';

export class CreateActivityDto {
  @IsOptional()
  @IsString()
  authorId?: string;

  @IsIn(ACTIVITY_KINDS)
  kind!: string;

  @IsOptional()
  @IsString()
  field?: string;

  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;
}
