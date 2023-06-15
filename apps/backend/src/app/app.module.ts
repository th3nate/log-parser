import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { LogParserController, LogParserModule } from './log-parser';

@Module({
  imports: [
    LogParserModule,
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
  ],
  controllers: [LogParserController],
})
export class AppModule {}
