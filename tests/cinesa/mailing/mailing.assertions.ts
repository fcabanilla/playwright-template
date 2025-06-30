import { expect } from '@playwright/test';

export async function assertEmailSenderAndSubject(
  email: { from: string; subject: string },
  expectedSender: string,
  expectedSubject: string
): Promise<void> {
  expect(
    email.from,
    `Expected sender to include "${expectedSender}", but got "${email.from}"`
  ).toContain(expectedSender);

  expect(
    email.subject,
    `Expected subject to be "${expectedSubject}", but got "${email.subject}"`
  ).toBe(expectedSubject);
}
