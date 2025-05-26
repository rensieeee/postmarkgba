import { Controller, Post, Body } from '@nestjs/common';
import { CommandService } from '../services/command.service';
import { PostmarkService } from '../services/postmark.service';
import { PostmarkInboundWebhook } from '../types/postmark.types';
import { ConfigService } from '@nestjs/config';

@Controller('api/command')
export class CommandController {
  constructor(
    private readonly commandService: CommandService,
    private readonly postmarkService: PostmarkService,
    private readonly configService: ConfigService,
  ) {}

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  @Post()
  async executeCommand(@Body() webhook: PostmarkInboundWebhook) {
    try {
      const senderEmail = webhook.From;

      const words = (webhook.TextBody || '')
        .replace(/\r?\n/g, ' ')
        .split(' ')
        .filter(word => word.trim())
        .slice(0, 3);

      const results = [];

      for (const word of words) {
        try {
          const result = await this.commandService.executeCommand(word);
          results.push(result);
          await this.delay(1000);
        } catch (error) {
          break;
        }
      }

      if (results.length > 0) {
        await this.delay(1000);
      }

      const screenshotUrl = await this.commandService.takeScreenshot();
      const baseUrl = this.configService.getOrThrow('BASE_URL');

      await this.postmarkService.sendTemplateEmail(
        senderEmail,
        'currentstate',
        {
          processed: results.length > 0 ? 1 : null,
          screenshot: {url: baseUrl + screenshotUrl}
        },
      );

      return {
        processed: results.length > 0 ? 1 : null,
        screenshot: {url: baseUrl + screenshotUrl}
      };
    } catch (error) {
      console.error('Error processing webhook:', error);
    }
  }
} 