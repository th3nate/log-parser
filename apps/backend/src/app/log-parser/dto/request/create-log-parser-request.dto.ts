import { IsString } from 'class-validator';

export class CreateLogParserRequestDto {
  @IsString()
  public name: string;
}
