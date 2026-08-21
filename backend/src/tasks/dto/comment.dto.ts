import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsOptional()
  @IsString()
  authorId?: string;

  @IsString()
  @MaxLength(2000)
  body!: string;
}
