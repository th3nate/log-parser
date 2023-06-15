import { EventEmitter2 } from '@nestjs/event-emitter';
import es from 'event-stream';
import { Readable } from 'stream';
import moment from 'moment';
import { Injectable, Logger } from '@nestjs/common';
import { LogParserEntry as Log } from '@log-parser/common';
import { Parser } from './interfaces';
import { LogCreatedEvent } from '../events';
import { Events } from '../types';

const INVALID_DATE = 'Invalid date';
const timestampFormat = process.env['TIMESTAMP_FORMAT'];

@Injectable()
export class LogParser implements Parser {
  logPayload: Log[] = [];

  constructor(private logger: Logger, private eventEmitter: EventEmitter2) {}

  parseLine(line: string): void {
    const timestamp: string = moment(line, timestampFormat).format(
      timestampFormat
    );
    const logLevelRegex = /(\w+?:)\s(.+)/;
    const logLevelMatch = line.match(logLevelRegex);
    const level: string = logLevelMatch
      ? logLevelMatch[1].replace(':', '')
      : '';
    const content: string = logLevelMatch ? logLevelMatch[2] : '';
    if (logLevelMatch && timestamp !== INVALID_DATE) {
      const log: Log = { timestamp, level, content } as Log;
      this.logPayload.push(log);
      return;
    }
    this.addToPreviousLine(line);
  }

  addToPreviousLine(line: string): void {
    const prevLineIndex: number = this.logPayload.length - 1;
    const prevLine: Log = this.logPayload[prevLineIndex];
    const log: Log = {
      ...prevLine,
      content: prevLine.content + line,
    };
    this.logPayload.splice(prevLineIndex, 1, log);
  }

  async initStream(file: Buffer, correlation: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      Readable.from([file])
        .pipe(es.split())
        .pipe(
          es.map((line: string, cb: (...args: any) => void): void => {
            cb(null, this.parseLine(line));
          })
        )
        .on('end', () => {
          const logCreatedEvent = new LogCreatedEvent();
          logCreatedEvent.logs = this.logPayload;
          logCreatedEvent.correlationId = correlation;
          this.eventEmitter.emit(Events.LogCreated, logCreatedEvent);
          this.logger.log(`Emitted ${Events.LogCreated} event`);
          resolve(true);
        })
        .on('error', () => reject(false));
    });
  }
}
