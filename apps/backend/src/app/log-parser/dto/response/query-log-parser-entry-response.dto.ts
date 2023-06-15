import { IsDateString, IsEnum, IsMongoId, IsString } from 'class-validator';
import { Levels, LogParserEntryResponse } from '@log-parser/common';
import { Expose, Transform, TransformFnParams } from 'class-transformer';

export class QueryLogParserEntryResponseDto implements LogParserEntryResponse {
  @Expose({ name: '_id' })
  @IsMongoId()
  @Transform(
    ({ obj: { _id, id } }: TransformFnParams) => (_id || id).toString()
    // the conditional toString is because when running the controller spec test
    // the expected output specifies id and not _id like at runtime.
  )
  public id: string;

  @Expose()
  @IsMongoId()
  public correlationId: string;

  @Expose()
  @IsString()
  public content: string;

  @Expose()
  @IsEnum(Levels)
  public level: Levels;

  @Expose()
  @IsString()
  public timestamp: string;

  @Expose()
  @IsDateString()
  @Transform(({ value }) =>
    value instanceof Date ? value.toISOString() : value
  )
  public createdAt: string;

  @Expose()
  @IsDateString()
  @Transform(({ value }) =>
    value instanceof Date ? value.toISOString() : value
  )
  public updatedAt: string;
}
