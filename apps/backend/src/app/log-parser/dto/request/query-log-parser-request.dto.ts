import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  Correlation,
  Mimetype,
  Name,
  OriginalName,
  Size,
} from '@log-parser/common';

export class QueryLogParserRequestDto
  implements Name, OriginalName, Mimetype, Size, Correlation
{
  @IsOptional()
  @IsMongoId()
  public correlation?: string;

  @IsOptional()
  @IsString()
  public mimetype?: string;

  @IsOptional()
  @IsString()
  public name?: string;

  @IsOptional()
  @IsString()
  public originalName?: string;

  @IsOptional()
  @IsNumber()
  public size?: number;
}
