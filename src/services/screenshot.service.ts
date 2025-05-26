import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { KeyboardService } from './keyboard.service';

@Injectable()
export class ScreenshotService {
  private screenshotDir: string;
  private readonly retroarchScreenshotDir: string;

  constructor(
    private readonly keyboardService: KeyboardService,
    private readonly configService: ConfigService
  ) {
    this.screenshotDir = path.join(process.cwd(), 'public', 'screenshots');
    this.retroarchScreenshotDir = this.configService.getOrThrow('RETROARCH_SCREENSHOT_DIR');

    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateScreenshotFilename(): string {
    const date = new Date();
    const timestamp = date.toISOString().split('T')[0];
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${random}.png`;
  }

  private findScreenshotFile(): string | null {
    try {
      const files = fs.readdirSync(this.retroarchScreenshotDir);
      if (files.length === 0) {
        return null;
      }

      const screenshotFile = files[0];
      return path.join(this.retroarchScreenshotDir, screenshotFile);
    } catch (error) {
      console.warn(`Failed to read directory ${this.retroarchScreenshotDir}:`, error.message);
      return null;
    }
  }

  async takeScreenshot(): Promise<string> {
    try {
      await this.keyboardService.takeScreenshot();
      
      await this.delay(500);

      const screenshotPath = this.findScreenshotFile();
      
      const filename = this.generateScreenshotFilename();
      const outputPath = path.join(this.screenshotDir, filename);
      fs.copyFileSync(screenshotPath, outputPath);

      fs.unlinkSync(screenshotPath);

      return `/public/screenshots/${filename}`;
    } catch (error) {
      console.error('Failed to take screenshot:', error);
      throw new Error(`Failed to take screenshot: ${error.message}`);
    }
  }
} 