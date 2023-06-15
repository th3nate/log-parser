import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LogParserEntryModel,
  LogParserEntrySchema,
  LogParserModel,
  LogParserSchema,
} from './model';
import { LogParserAccessorService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LogParserEntryModel.name, schema: LogParserEntrySchema },
      { name: LogParserModel.name, schema: LogParserSchema },
    ]),
  ],
  providers: [LogParserAccessorService],
  exports: [LogParserAccessorService],
})
export class LogParserAccessorModule {}
