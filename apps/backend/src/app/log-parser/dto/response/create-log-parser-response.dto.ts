import { IsDateString, IsMongoId, IsNumber, IsString } from 'class-validator';
import { LogParserResponse } from '@log-parser/common';
import { Expose, Transform, TransformFnParams } from 'class-transformer';

export class CreateLogParserResponseDto implements LogParserResponse {
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
  public correlation: string;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public mimetype: string;

  @Expose()
  @IsString()
  public originalName: string;

  @Expose()
  @IsNumber()
  public size: number;

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
