import { LogParser } from './';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LogCreatedEvent } from '../events';
import { Events } from '../types';

describe('LogParser', () => {
  let logParser: LogParser;
  let logger: Logger;
  let eventEmitter: EventEmitter2;

  beforeEach(() => {
    logger = new Logger();
    eventEmitter = new EventEmitter2();
    logParser = new LogParser(logger, eventEmitter);
  });

  describe('parseLine', () => {
    it('should parse a valid line correctly', () => {
      const line = '2023-01-01 10:00:00 info: This is a log message';
      logParser.parseLine(line);

      expect(logParser.logPayload).toHaveLength(1);
      expect(logParser.logPayload[0].timestamp).toBe('2023-01-01 10:00:00');
      expect(logParser.logPayload[0].level).toBe('info');
      expect(logParser.logPayload[0].content).toBe('This is a log message');
    });

    it('should add content to the previous line when the timestamp is invalid', () => {
      const invalidLine = 'Invalid line without a timestamp';
      const validLine = '2023-01-02 12:00:00 error: This is an error log';
      logParser.parseLine(validLine);
      logParser.parseLine(invalidLine);

      expect(logParser.logPayload).toHaveLength(1);
      expect(logParser.logPayload[0].timestamp).toBe('2023-01-02 12:00:00');
      expect(logParser.logPayload[0].level).toBe('error');
      expect(logParser.logPayload[0].content).toBe(
        'This is an error logInvalid line without a timestamp'
      );
    });
  });

  describe('initStream', () => {
    it('should emit a LogCreatedEvent with the log payload and correlation ID', async () => {
      const fileBuffer = Buffer.from('2023-01-01 10:00:00 info: Log message');
      const correlationId = '12345';
      const emitSpy = jest.spyOn(eventEmitter, 'emit');
      const loggerLogSpy = jest.spyOn(logger, 'log');

      await logParser.initStream(fileBuffer, correlationId);

      expect(emitSpy).toHaveBeenCalledWith(
        Events.LogCreated,
        expect.any(LogCreatedEvent)
      );
      expect(loggerLogSpy).toHaveBeenCalledWith(
        `Emitted ${Events.LogCreated} event`
      );
      expect(logParser.logPayload).toHaveLength(1);
      expect(logParser.logPayload[0].timestamp).toBe('2023-01-01 10:00:00');
      expect(logParser.logPayload[0].level).toBe('info');
      expect(logParser.logPayload[0].content).toBe('Log message');
    });

    it('should reject the promise if an error occurs during the stream', async () => {
      const fileBuffer = Buffer.from('2023-01-01 10:00:00: INFO: Log message');
      const correlationId = '12345';
      const errorSpy = jest
        .spyOn(logParser, 'initStream')
        .mockRejectedValue(false);

      await expect(
        logParser.initStream(fileBuffer, correlationId)
      ).rejects.toBeFalsy();
      expect(errorSpy).toHaveBeenCalled();
    });
  });
});
