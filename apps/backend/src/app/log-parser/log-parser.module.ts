import { Module } from '@nestjs/common';
import { LogParserController } from './controllers/log-parser.controller';
import { LogParserManagerModule } from '@log-parser/log-parser-manager';

@Module({
  imports: [LogParserManagerModule],
  controllers: [LogParserController],
  exports: [LogParserManagerModule],
})
export class LogParserModule {}
