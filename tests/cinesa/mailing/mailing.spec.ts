import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { recipientEmail } from './mailing.data';
import { assertEmailSenderAndSubject } from './mailing.assertions';

test.describe('Mailing', () => {

  test('Send and validate Outlook email to self', async ({
    mailing
  }) => {
    const subject = 'Test Playwright Outlook';
    const body = 'This is an automated test email sent and validated.';
    const email = await mailing.sendAndValidateEmail(subject, body, recipientEmail);
    if (email === null) {
      throw new Error("Email is null");
    }
    await assertEmailSenderAndSubject(email, mailing.user, subject);
  });
});


