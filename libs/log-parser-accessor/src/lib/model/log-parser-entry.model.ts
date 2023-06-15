import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Levels, LogParserEntry } from '@log-parser/common';

export type LogParserEntryDocument = Document<LogParserEntryModel>;

@Schema({
  collection: 'log-parser-entry',
  toJSON: { getters: true, virtuals: true },
  toObject: { getters: true, virtuals: true },
  collation: { locale: 'en', strength: 1 },
  timestamps: true,
  strict: true,
})
export class LogParserEntryModel implements LogParserEntry {
  @Prop({ type: String, required: true })
  timestamp: string;

  @Prop({ type: Types.ObjectId, required: true })
  correlationId: string;

  @Prop({ type: String, enum: Levels, required: true })
  level: Levels;

  @Prop({ type: String })
  content: string;
}

export const LogParserEntrySchema =
  SchemaFactory.createForClass(LogParserEntryModel);

LogParserEntrySchema.index({ timestamp: 1, level: 1, content: 1 });
