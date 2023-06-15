import {Test, TestingModule} from '@nestjs/testing';
import {HttpStatus, INestApplication, Logger} from '@nestjs/common';
import * as request from 'supertest';
import {LogParser, LogParserManagerService} from '../libs/log-parser-manager/src';
import {LogParserAccessorService} from '../libs/log-parser-accessor/src';
import {LogParserController} from '../apps/backend/src/app/log-parser';

// Mock the Logger to prevent unnecessary console output during tests
jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  Logger: jest.fn(() => ({
    log: jest.fn(),
    error: jest.fn(),
  })),
}));

// Mock the LogParser to prevent actual file parsing during tests
jest.mock('./parser', () => ({
  LogParser: jest.fn().mockImplementation(() => ({
    initStream: jest.fn(),
  })),
}));

describe('LogParserController (e2e)', () => {
  let app: INestApplication;
  let logParserManager: LogParserManagerService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [LogParserController],
      providers: [
        LogParserManagerService,
        LogParserAccessorService,
        LogParser,
        Logger,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logParserManager = moduleFixture.get<LogParserManagerService>(
      LogParserManagerService
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/logs (GET)', () => {
    it('should return an array of log parser responses', async () => {
      const response = await request(app.getHttpServer())
        .get('/logs')
        .query({
          /* provide valid query parameters */
        })
        .expect(HttpStatus.OK);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      // Additional assertions for the response body
    });
  });

  describe('/log/:correlationId (GET)', () => {
    it('should return an array of log parser entry responses', async () => {
      const correlationId = '12345'; // Provide a valid correlationId

      const response = await request(app.getHttpServer())
        .get(`/log/${correlationId}`)
        .query({
          /* provide valid query parameters */
        })
        .expect(HttpStatus.OK);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      // Additional assertions for the response body
    });
  });

  describe('/log-file (POST)', () => {
    it('should create a log file and return a log parser response', async () => {
      const response = await request(app.getHttpServer())
        .post('/log-file')
        .attach('file', 'path/to/test-file.log')
        .field('name', 'Test Log File')
        .expect(HttpStatus.OK);

      expect(response.body).toBeDefined();
      // Additional assertions for the response body
    });
  });
});
