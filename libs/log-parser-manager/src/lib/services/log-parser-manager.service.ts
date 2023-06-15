import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LogParserAccessorService } from '@log-parser/log-parser-accessor';
import {
  LogParser as Log,
  LogParserEntry,
  LogParserEntryResponse,
  LogParserResponse,
  QueryLogParser,
  QueryLogParserEntry,
} from '@log-parser/common';
import { LogParser } from '../parser';
import { LogCreatedEvent } from '../events';
import { Events } from '../types';

@Injectable()
export class LogParserManagerService {
  constructor(
    private readonly logParserAccessor: LogParserAccessorService,
    private readonly logParser: LogParser,
    private readonly logger: Logger
  ) {}

  async createLogFile(req: Log): Promise<LogParserResponse> {
    const parsedStream = await this.logParser.initStream(
      req.file,
      req.correlation
    );
    if (!parsedStream) {
      throw new InternalServerErrorException('Stream parsing failed');
    }
    const result = this.logParserAccessor.createLogFile(req, req.correlation);
    this.logger.log(
      `Log file saved successfully | correlationId: ${req.correlation}`
    );
    return result;
  }

  async createLogEntry(
    req: LogParserEntry,
    correlationId: string
  ): Promise<LogParserEntryResponse> {
    return this.logParserAccessor.createLogEntry(req, correlationId);
  }

  async queryLogEntry(
    req: QueryLogParserEntry
  ): Promise<LogParserEntryResponse[]> {
    return this.logParserAccessor.queryLogEntry(req);
  }

  async queryLog(req: QueryLogParser): Promise<LogParserResponse[]> {
    return this.logParserAccessor.queryLog(req);
  }

  async deleteLog(correlation: string): Promise<void> {
    return this.logParserAccessor.delete(correlation);
  }

  @OnEvent(Events.LogCreated)
  async onLogCreated({ logs, correlationId }: LogCreatedEvent): Promise<void> {
    try {
      if (!logs.length) {
        throw new BadRequestException('List entries are empty');
      }
      this.logger.log(
        `On ${Events.LogCreated} | correlationId: ${correlationId}`
      );
      for (const log of logs) {
        await this.createLogEntry(log, correlationId);
      }
      this.logger.log(
        `Log entries saved successfully | correlationId: ${correlationId}`
      );
    } catch (e) {
      this.logger.error(
        `Failed to save log entries | correlationId: ${correlationId}`,
        e
      );
    }
  }
}
