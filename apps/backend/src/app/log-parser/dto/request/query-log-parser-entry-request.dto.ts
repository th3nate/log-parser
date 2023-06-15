import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Content, Level, Levels, Timestamp } from '@log-parser/common';

export class QueryLogParserEntryRequestDto
  implements Timestamp, Level, Content
{
  @IsOptional()
  @IsString()
  public content?: string;

  @IsOptional()
  @IsEnum(Levels)
  public level?: Levels;

  @IsOptional()
  @IsString()
  public timestamp?: string;
}
