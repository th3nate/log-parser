import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { LogParserAccessorService } from '@log-parser/log-parser-accessor';
import {
  Levels,
  LogParserEntry,
  LogParserEntryResponse,
  LogParserResponse,
  QueryLogParser,
  QueryLogParserEntry,
} from '@log-parser/common';
import { LogCreatedEvent } from '../events';
import { LogParserManagerService } from './log-parser-manager.service';
import { LogParser } from '../parser';

describe('LogParserManagerService', () => {
  let logParserManagerService: LogParserManagerService;
  let logParserAccessorService: LogParserAccessorService;
  let logParser: LogParser;
  let logger: Logger;

  beforeEach(() => {
    logParserAccessorService = {
      createLogFile: jest.fn(),
      createLogEntry: jest.fn(),
      queryLogEntry: jest.fn(),
      queryLog: jest.fn(),
    } as any;

    logParser = {
      initStream: jest.fn(),
    } as any;

    logger = {
      log: jest.fn(),
      error: jest.fn(),
    } as any;

    logParserManagerService = new LogParserManagerService(
      logParserAccessorService,
      logParser,
      logger
    );
  });

  describe('createLogFile', () => {
    it('should create a log file and return the result', async () => {
      const req = {
        name: 'my-log',
        correlation: '123',
        originalName: 'input.txt',
        mimetype: 'application/octet-stream',
        size: 5360,
        file: Buffer.from('example file content'),
      };
      const expectedResponse: LogParserResponse = {
        id: '6496b485568601eea6824c0e',
        correlation: '6496b485568601eea6824c0d',
        name: 'meow',
        size: 5360,
        mimetype: 'application/octet-stream',
        originalName: 'input.txt',
        createdAt: '2023-06-24T09:16:53.556Z',
        updatedAt: '2023-06-24T09:16:53.556Z',
      };

      jest
        .spyOn(logParser, 'initStream')
        .mockReturnValue(Promise.resolve(true));
      jest
        .spyOn(logParserAccessorService, 'createLogFile')
        .mockReturnValueOnce(Promise.resolve(expectedResponse));

      const result = await logParserManagerService.createLogFile(req);

      expect(logParserAccessorService.createLogFile).toHaveBeenCalledWith(
        req,
        '123'
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should throw an InternalServerErrorException if stream parsing fails', async () => {
      const req = {
        name: 'my-log',
        correlation: '123',
        originalName: 'input.txt',
        mimetype: 'application/octet-stream',
        size: 5360,
        file: Buffer.from('example file content'),
      };

      await expect(logParserManagerService.createLogFile(req)).rejects.toThrow(
        InternalServerErrorException
      );

      expect(logParserAccessorService.createLogFile).not.toHaveBeenCalled();
    });
  });

  describe('createLogEntry', () => {
    it('should create a log entry and return the result', async () => {
      const req: LogParserEntry = {
        content: 'saved: 42 items',
        level: Levels.Debug,
        timestamp: '2023-01-01 10:00:00',
      };
      const correlationId = '123';
      const expectedResponse: LogParserEntryResponse = {
        id: '6489dd3760098aad1f03a3be',
        correlationId: '6489dd3771f3c63118e813f9',
        content: 'saved: 42 items',
        level: Levels.Debug,
        timestamp: '2023-01-01 10:00:00',
        createdAt: '2023-06-14T15:31:03.573Z',
        updatedAt: '2023-06-14T15:31:03.573Z',
      };

      jest
        .spyOn(logParserAccessorService, 'createLogEntry')
        .mockResolvedValue(expectedResponse);

      const result = await logParserManagerService.createLogEntry(
        req,
        correlationId
      );

      expect(logParserAccessorService.createLogEntry).toHaveBeenCalledWith(
        req,
        '123'
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('queryLogEntry', () => {
    it('should query log entries and return the results', async () => {
      const req: QueryLogParserEntry = {};
      const expectedResponse: LogParserEntryResponse[] = [
        {
          id: '6489dd3760098aad1f03a3be',
          correlationId: '6489dd3771f3c63118e813f9',
          content: 'saved: 42 items',
          level: Levels.Debug,
          timestamp: '2023-01-01 10:00:00',
          createdAt: '2023-06-14T15:31:03.573Z',
          updatedAt: '2023-06-14T15:31:03.573Z',
        },
      ];

      jest
        .spyOn(logParserAccessorService, 'queryLogEntry')
        .mockResolvedValue(expectedResponse);

      const result = await logParserManagerService.queryLogEntry(req);

      expect(logParserAccessorService.queryLogEntry).toHaveBeenCalledWith(req);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('queryLog', () => {
    it('should query logs and return the results', async () => {
      const req: QueryLogParser = {};
      const expectedResponse: LogParserResponse[] = [
        {
          id: '6496b485568601eea6824c0e',
          correlation: '6496b485568601eea6824c0d',
          name: 'meow',
          size: 5360,
          mimetype: 'application/octet-stream',
          originalName: 'input.txt',
          createdAt: '2023-06-24T09:16:53.556Z',
          updatedAt: '2023-06-24T09:16:53.556Z',
        },
      ];

      jest
        .spyOn(logParserAccessorService, 'queryLog')
        .mockResolvedValue(expectedResponse);

      const result = await logParserManagerService.queryLog(req);

      expect(logParserAccessorService.queryLog).toHaveBeenCalledWith(req);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('onLogCreated', () => {
    it('should save log entries when logs are not empty', async () => {
      const logs: LogParserEntryResponse[] = [
        {
          id: '6489dd3760098aad1f03a3be',
          correlationId: '6489dd3771f3c63118e813f9',
          content: 'saved: 42 items',
          level: Levels.Debug,
          timestamp: '2023-01-01 10:00:00',
          createdAt: '2023-06-14T15:31:03.573Z',
          updatedAt: '2023-06-14T15:31:03.573Z',
        },
      ];
      const correlationId = '123';

      const logCreatedEvent: LogCreatedEvent = {
        logs,
        correlationId,
      };

      const createLogEntrySpy = jest.spyOn(
        logParserAccessorService,
        'createLogEntry'
      );

      await logParserManagerService.onLogCreated(logCreatedEvent);

      expect(createLogEntrySpy).toHaveBeenCalledWith(logs[0], '123');
    });

    it('should throw a BadRequestException when logs are empty', async () => {
      const logs: LogParserEntry[] = [];

      jest
        .spyOn(logParserManagerService, 'onLogCreated')
        .mockImplementation((): any => {
          if (!logs.length) {
            throw new BadRequestException('List entries are empty');
          }
        });

      await expect(logParserManagerService.onLogCreated).toThrow(
        BadRequestException
      );

      expect(logParserAccessorService.createLogEntry).not.toHaveBeenCalled();
    });
  });
});
