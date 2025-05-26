import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as postmark from 'postmark';

@Injectable()
export class PostmarkService {
  private client: postmark.ServerClient;
  private readonly fromEmail: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.getOrThrow('POSTMARK_API_KEY');

    this.fromEmail = this.configService.getOrThrow('POSTMARK_FROM_EMAIL');
    this.client = new postmark.ServerClient(apiKey);
  }

  async sendTemplateEmail(to: string, templateAlias: string, templateData: any) {
    await this.client.sendEmailWithTemplate({
      From: this.fromEmail,
      To: to,
      TemplateAlias: templateAlias,
      TemplateModel: templateData
    });
  }
} 