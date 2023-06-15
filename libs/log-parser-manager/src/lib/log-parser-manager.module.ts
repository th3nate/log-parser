import { Logger, Module } from '@nestjs/common';
import { LogParserManagerService } from './services/log-parser-manager.service';
import { LogParserAccessorModule } from '@log-parser/log-parser-accessor';
import { LogParser } from './parser';

@Module({
  imports: [LogParserAccessorModule],
  providers: [LogParserManagerService, LogParser, Logger],
  exports: [LogParserManagerService],
})
export class LogParserManagerModule {}
