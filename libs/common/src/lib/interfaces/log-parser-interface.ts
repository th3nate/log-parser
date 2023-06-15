import { Levels } from '../types';

export interface LogParser {
  name: string;
  correlation: string;
  originalName: string;
  mimetype: string;
  size: number;
  file: Buffer;
}

export interface LogParserResponse {
  id: string;
  name: string;
  correlation: string;
  originalName: string;
  mimetype: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface LogParserEntry {
  timestamp: string;
  level: Levels;
  content: string;
}

export interface LogParserEntryResponse {
  id: string;
  correlationId: string;
  timestamp: string;
  level: Levels;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CorrelationId {
  correlationId?: string;
}

export interface Timestamp {
  timestamp?: string;
}

export interface Level {
  level?: Levels;
}

export interface Content {
  content?: string;
}

export type QueryLogParserEntry = Timestamp & Level & Content & CorrelationId;

export interface Correlation {
  correlation?: string;
}

export interface Name {
  name?: string;
}

export interface OriginalName {
  originalName?: string;
}

export interface Mimetype {
  mimetype?: string;
}

export interface Size {
  size?: number;
}

export type QueryLogParser = Name &
  OriginalName &
  Mimetype &
  Size &
  Correlation;
