export interface PostmarkInboundWebhook {
  FromName: string;
  From: string;
  FromFull: {
    Email: string;
    Name: string;
  };
  To: string;
  ToFull: Array<{
    Email: string;
    Name: string;
  }>;
  Subject: string;
  TextBody: string;
  HtmlBody: string;
  MessageID: string;
  Date: string;
  MailboxHash: string;
  Tag: string;
  Headers: Array<{
    Name: string;
    Value: string;
  }>;
} 
