import { Page } from '@playwright/test';
// @ts-ignore
import nodemailer from 'nodemailer';
// @ts-ignore
import { ImapFlow } from 'imapflow';
import * as dotenv from 'dotenv';
import {
  smtpHost,
  smtpPort,
  imapHost,
  imapPort,
} from '../../../tests/cinesa/mailing/mailing.data';

dotenv.config();

export class Mailing {
  readonly page: Page;
  readonly user: string;
  readonly pass: string;

  constructor(page: Page) {
    this.page = page;
    this.user = process.env.OUTLOOK_USER || '';
    this.pass = process.env.OUTLOOK_PASS || '';
  }

  async sendEmail(subject: string, text: string, to: string) {
    console.log(this.user);
    console.log(this.pass);

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      auth: {
        user: this.user,
        pass: this.pass,
      },
    });

    await transporter.sendMail({
      from: this.user,
      to,
      subject,
      text,
    });
  }

  async getLastEmailWithSubject(subject: string, from: string) {
    const client = new ImapFlow({
      host: imapHost,
      port: imapPort,
      secure: true,
      auth: {
        user: this.user,
        pass: this.pass,
      },
    });

    await client.connect();
    let result: { from: string; subject: string } | null = null;
    let lock = await client.getMailboxLock('INBOX');
    try {
      const searchCriteria = [
        ['UNSEEN'],
        ['HEADER', 'SUBJECT', subject],
        ['HEADER', 'FROM', from],
      ];
      // TODO: Fix IMAP library types - searchCriteria needs proper SearchObject type
      // @ts-expect-error - IMAP library types need to be fixed
      const messages = await client.search(searchCriteria, { uid: true });

      if (!messages || typeof messages === 'boolean' || messages.length === 0) {
        return null;
      }
      const messageUid = messages[messages.length - 1];
      for await (let msg of client.fetch(messageUid, { envelope: true })) {
        // Null-safe access to envelope properties
        const from = msg.envelope?.from?.[0]?.address || 'unknown';
        const subject = msg.envelope?.subject || '';
        
        result = {
          from,
          subject,
        };
      }
    } finally {
      lock.release();
      await client.logout();
    }

    return result;
  }

  async sendAndValidateEmail(subject: string, text: string, to: string) {
    await this.sendEmail(subject, text, to);
    await new Promise((res) => setTimeout(res, 10000));
    return await this.getLastEmailWithSubject(subject, this.user);
  }
}
