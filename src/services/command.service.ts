import { Injectable } from '@nestjs/common';
import { KeyboardService } from './keyboard.service';
import { ScreenshotService } from './screenshot.service';

@Injectable()
export class CommandService {
  constructor(
    private readonly keyboardService: KeyboardService,
    private readonly screenshotService: ScreenshotService
  ) {}

  async executeCommand(command: string): Promise<any> {
    command = command.toLowerCase().trim();

    switch (command) {
      case 'left':
      case 'right':
      case 'up':
      case 'down':
      case 'a':
      case 'b':
      case 'start':
      case 'select':
      case 'l':
      case 'r':
        await this.keyboardService.pressKey(command);
        return { message: `Pressed key: ${command}` };

      default:
        throw new Error(`Unknown command: ${command}`);
    }
  }

  async takeScreenshot(): Promise<string> {
    return await this.screenshotService.takeScreenshot();
  }
} 