import { LogParserEntry } from '@log-parser/common';

export class LogCreatedEvent {
  logs: LogParserEntry[];
  correlationId: string;
}
