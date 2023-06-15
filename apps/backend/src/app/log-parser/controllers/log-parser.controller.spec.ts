import {Test, TestingModule} from '@nestjs/testing';
import {LogParserController} from './log-parser.controller';
import {LogParser, LogParserManagerService} from '@log-parser/log-parser-manager';
import {
  CreateLogParserRequestDto,
  CreateLogParserResponseDto,
  QueryLogParserEntryRequestDto,
  QueryLogParserEntryResponseDto,
  QueryLogParserRequestDto,
  QueryLogParserResponseDto,
} from '../dto';

// Mock the LogParser to prevent actual file parsing during tests
jest.mock(
  '../../../../../../libs/log-parser-manager/src/lib/parser/log-parser',
  () => ({
    LogParser: jest.fn().mockImplementation(() => ({
      initStream: jest.fn(),
    })),
  })
);

jest.mock(
  '../../../../../../libs/log-parser-manager/src/lib/services/log-parser-manager.service',
  () => ({
    LogParserManagerService: jest.fn().mockImplementation(() => ({
      createLogFile: jest.fn(),
      createLogEntry: jest.fn(),
      queryLogEntry: jest.fn(),
      queryLog: jest.fn(),
      onLogCreated: jest.fn(),
    })),
  })
);

describe('LogParserController', () => {
  let controller: LogParserController;
  let logParserManager: LogParserManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogParserController],
      providers: [LogParserManagerService, LogParser],
    }).compile();

    controller = module.get<LogParserController>(LogParserController);
    logParserManager = module.get<LogParserManagerService>(
      LogParserManagerService
    );
  });

  describe('queryLogs', () => {
    it('should return an array of log parser responses', async () => {
      const query: QueryLogParserRequestDto = {};
      const expectedResponse: QueryLogParserResponseDto[] = [
        {
          id: '649d185a69647c03c0ca10b7',
          correlation: '6489d9858603242e6e81b325',
          name: 'my-log-file',
          size: 2680,
          mimetype: 'text/plain',
          originalName: 'input.txt',
          createdAt: '2023-06-14T15:15:17.142Z',
          updatedAt: '2023-06-14T15:15:17.142Z',
        },
        {
          id: '649d185a69647c03c0ca10b8',
          correlation: '6489d9898603242e6e81b342',
          name: 'my-log-file',
          size: 2680,
          mimetype: 'text/plain',
          originalName: 'input.txt',
          createdAt: '2023-06-14T15:15:21.547Z',
          updatedAt: '2023-06-14T15:15:21.547Z',
        },
        {
          id: '649d185a69647c03c0ca10b9',
          correlation: '6489dd01b063f191e753cd6b',
          name: 'my-log-file',
          size: 2680,
          mimetype: 'text/plain',
          originalName: 'input.txt',
          createdAt: '2023-06-14T15:30:09.650Z',
          updatedAt: '2023-06-14T15:30:09.650Z',
        },
      ];

      jest
        .spyOn(logParserManager, 'queryLog')
        .mockResolvedValue(expectedResponse);

      const result = await controller.queryLogs(query);
      expect(result).toEqual(expectedResponse);
      expect(logParserManager.queryLog).toHaveBeenCalledWith(query);
    });
  });

  describe('queryLogEntry', () => {
    it('should return an array of log parser entry responses', async () => {
      const correlationId = 'example-correlation-id';
      const query: QueryLogParserEntryRequestDto = {
        /* provide the required data for queryLogEntry test */
      };
      const expectedResponse: QueryLogParserEntryResponseDto[] = [
        {
          id: '649d18bc37530a4681839780',
          correlationId: '6489dd3771f3c63118e813f9',
          content: 'saved: 42 items',
          level: 'debug',
          timestamp: '2023-01-01 10:00:00',
          createdAt: '2023-06-14T15:31:03.573Z',
          updatedAt: '2023-06-14T15:31:03.573Z',
        },
        {
          id: '649d18bc37530a4681839783',
          correlationId: '6489dd3771f3c63118e813f9',
          content: '🚀 App listening on the port 3000',
          level: 'info',
          timestamp: '2023-01-01 10:00:32',
          createdAt: '2023-06-14T15:31:03.592Z',
          updatedAt: '2023-06-14T15:31:03.592Z',
        },
        {
          id: '649d18bc37530a4681839786',
          correlationId: '6489dd3771f3c63118e813f9',
          content: '======= ENV: development =======',
          level: 'info',
          timestamp: '2023-01-01 12:14:21',
          createdAt: '2023-06-14T15:31:03.600Z',
          updatedAt: '2023-06-14T15:31:03.600Z',
        },
        {
          id: '649d18bc37530a4681839787',
          correlationId: '6489dd3771f3c63118e813f9',
          content: '🚀 App listening on the port 3000',
          level: 'info',
          timestamp: '2023-01-01 12:14:21',
          createdAt: '2023-06-14T15:31:03.603Z',
          updatedAt: '2023-06-14T15:31:03.603Z',
        },
      ] as QueryLogParserEntryResponseDto[];

      jest
        .spyOn(logParserManager, 'queryLogEntry')
        .mockResolvedValue(expectedResponse);

      const result = await controller.queryLogEntry(correlationId, query);

      expect(result).toEqual(expectedResponse);
      expect(logParserManager.queryLogEntry).toHaveBeenCalledWith({
        ...query,
        correlationId,
      });
    });
  });

  describe('createLogFile', () => {
    it('should return a log parser response', async () => {
      const body: CreateLogParserRequestDto = {
        name: 'meow',
      };
      const file: Express.Multer.File = {
        destination: '',
        encoding: '',
        fieldname: '',
        filename: '',
        path: '',
        stream: undefined,
        originalname: 'input.txt',
        size: 5360,
        mimetype: 'application/octet-stream',
        buffer: Buffer.from('example file content'),
      };
      const expectedResponse: CreateLogParserResponseDto = {
        id: '649d185a69647c03c0ca10c3',
        correlation: '6496b485568601eea6824c0d',
        name: 'meow',
        size: 5360,
        mimetype: 'application/octet-stream',
        originalName: 'input.txt',
        createdAt: '2023-06-24T09:16:53.556Z',
        updatedAt: '2023-06-24T09:16:53.556Z',
      };

      jest
        .spyOn(logParserManager, 'createLogFile')
        .mockResolvedValue(expectedResponse);

      const result = await controller.createLogFile(body, file);

      expect(result).toEqual(expectedResponse);
      expect(logParserManager.createLogFile).toHaveBeenCalledWith({
        correlation: expect.any(String),
        name: body.name,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        file: file.buffer,
      });
    });
  });
});
