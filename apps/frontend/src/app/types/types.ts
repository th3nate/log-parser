import { ApiGetData } from '../services/api.service';
import { LogParserEntry } from '@log-parser/common';

export enum FilterNames {
  Content = 'content',
  Timestamp = 'timestamp',
  Level = 'level',
}

export interface FiltersState extends Omit<LogParserEntry, 'level'> {
  level: string;
}

export interface LogListApiService extends ApiGetData {
  getData<T>(endpoint: string, params?: Record<string, any>): Promise<T[]>;
}
