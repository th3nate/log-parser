import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { LogParser } from '@log-parser/common';

export type LogParserDocument = Document<LogParserModel>;

@Schema({
  collection: 'log-parser',
  toJSON: { getters: true, virtuals: true },
  toObject: { getters: true, virtuals: true },
  collation: { locale: 'en', strength: 1 },
  timestamps: true,
  strict: true,
})
export class LogParserModel implements Omit<LogParser, 'file'> {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Types.ObjectId, required: true, unique: true })
  correlation: string;

  @Prop({ type: String, required: true })
  originalName: string;

  @Prop({ type: Number, required: true })
  size: number;

  @Prop({ type: String, required: true })
  mimetype: string;
}

export const LogParserSchema = SchemaFactory.createForClass(LogParserModel);
