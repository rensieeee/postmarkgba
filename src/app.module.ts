import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommandController } from './controllers/command.controller';
import { CommandService } from './services/command.service';
import { ScreenshotService } from './services/screenshot.service';
import { KeyboardService } from './services/keyboard.service';
import { PostmarkService } from './services/postmark.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [CommandController],
  providers: [
    CommandService,
    ScreenshotService,
    KeyboardService,
    PostmarkService,
  ],
})
export class AppModule {}
