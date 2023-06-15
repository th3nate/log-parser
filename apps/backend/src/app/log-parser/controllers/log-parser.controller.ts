import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { LogParserManagerService } from '@log-parser/log-parser-manager';
import {
  CreateLogParserRequestDto,
  CreateLogParserResponseDto,
  QueryLogParserEntryRequestDto,
  QueryLogParserEntryResponseDto,
  QueryLogParserRequestDto,
  QueryLogParserResponseDto,
} from '../dto';
import {
  LogParser,
  QueryLogParser,
  QueryLogParserEntry,
} from '@log-parser/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadFilePipe } from '../pipes';
import { ObjectId } from 'mongodb';

@Controller('')
export class LogParserController {
  constructor(private readonly logParserManager: LogParserManagerService) {}

  @Get('logs')
  @HttpCode(HttpStatus.OK)
  public async queryLogs(
    @Query() req: QueryLogParserRequestDto
  ): Promise<QueryLogParserResponseDto[]> {
    const request: QueryLogParser = { ...req };
    const response = await this.logParserManager.queryLog(request);
    return plainToInstance(QueryLogParserResponseDto, response, {
      excludeExtraneousValues: true,
    });
  }

  @Get('log/:correlationId')
  @HttpCode(HttpStatus.OK)
  public async queryLogEntry(
    @Param('correlationId') correlationId: string,
    @Query() req: QueryLogParserEntryRequestDto
  ): Promise<QueryLogParserEntryResponseDto[]> {
    const request: QueryLogParserEntry = { ...req, correlationId };
    const response = await this.logParserManager.queryLogEntry(request);
    return plainToInstance(QueryLogParserEntryResponseDto, response, {
      excludeExtraneousValues: true,
    });
  }

  @Delete('log/:correlationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteLog(
    @Param('correlationId') correlationId: string
  ): Promise<void> {
    return await this.logParserManager.deleteLog(correlationId);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('log-file')
  public async createLogFile(
    @Body() body: CreateLogParserRequestDto,
    @UploadedFile(uploadFilePipe)
    file: Express.Multer.File
  ): Promise<CreateLogParserResponseDto> {
    const request: LogParser = {
      correlation: new ObjectId().toString(),
      name: body.name,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      file: file?.buffer,
    };
    const response = await this.logParserManager.createLogFile(request);
    return plainToInstance(CreateLogParserResponseDto, response, {
      excludeExtraneousValues: true,
    });
  }
}
