import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  LogParser,
  LogParserEntry,
  LogParserEntryResponse,
  LogParserResponse,
  QueryLogParser,
  QueryLogParserEntry,
} from '@log-parser/common';
import {
  LogParserDocument,
  LogParserEntryDocument,
  LogParserEntryModel,
  LogParserModel,
} from '../model';

@Injectable()
export class LogParserAccessorService {
  constructor(
    @InjectModel(LogParserEntryModel.name)
    private readonly logParserEntryModel: Model<LogParserEntryDocument>,
    @InjectModel(LogParserModel.name)
    private readonly logParserModel: Model<LogParserDocument>
  ) {}

  // Idempotent to avoid recreating existing entries
  async createLogFile(
    { mimetype, size, name, originalName }: LogParser,
    correlation: string
  ): Promise<LogParserResponse> {
    const results = await this.logParserModel.create({
      mimetype,
      size,
      name,
      originalName,
      correlation,
    });
    return results.toJSON();
  }

  // Idempotent to avoid recreating existing entries
  async createLogEntry(
    req: LogParserEntry,
    correlationId: string
  ): Promise<LogParserEntryResponse> {
    return (await this.logParserEntryModel
      .findOneAndUpdate(
        { ...req, correlationId },
        {},
        { upsert: true, new: true }
      )
      .select({ __v: 0 })
      .lean()) as LogParserEntryResponse;
  }

  async queryLogEntry(
    req: QueryLogParserEntry
  ): Promise<LogParserEntryResponse[]> {
    const query: FilterQuery<LogParserEntry> = {
      ...req,
      ...(req.timestamp && {
        timestamp: { $regex: req.timestamp, $options: 'i' },
      }),
      ...(req.content && { content: { $regex: req.content, $options: 'i' } }),
    };
    return (await this.logParserEntryModel
      .find(query, { __v: 0 })
      .lean()) as LogParserEntryResponse[];
  }

  async queryLog(req: QueryLogParser): Promise<LogParserResponse[]> {
    const query: FilterQuery<LogParser> = {
      ...req,
    };
    return (await this.logParserModel
      .find(query, { __v: 0 })
      .lean()) as LogParserResponse[];
  }

  async delete(correlationId: string): Promise<void> {
    const { deletedCount } = await this.logParserModel.deleteOne({
      correlation: correlationId,
    });
    if (deletedCount) {
      await this.logParserEntryModel.deleteMany({
        correlationId,
      });
    }
    return;
  }
}
