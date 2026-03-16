import { expect, Page, Download, TestInfo } from '@playwright/test';
import { allure } from 'allure-playwright';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

export async function assertWhistleblowingNavigation(
  page: Page,
  expectedUrl: string
): Promise<void> {
  await allure.step('Validating Whistleblowing Policy page URL', async () => {
    await expect(page).toHaveURL(expectedUrl);
  });
}

export async function assertWhistleblowingPDFDownload(
  download: Download
): Promise<void> {
  await allure.step(
    'Validating Whistleblowing Policy PDF download',
    async () => {
      const fileName = download.suggestedFilename();
      const url = download.url();

      await allure.parameter('Download Method', 'Direct Download');
      await allure.parameter('File Name', fileName);

      expect(fileName).toContain('whistleblowing');
      expect(url).toContain('whistleblowing-policy');
    }
  );
}

export async function assertWhistleblowingPDFPopup(
  popup: Page,
  testInfo: TestInfo
): Promise<void> {
  await allure.step(
    'Validating Whistleblowing Policy PDF in popup',
    async () => {
      await popup.waitForLoadState('networkidle');
      await takeScreenshot(
        popup,
        testInfo,
        'Whistleblowing Policy display and layout'
      );
    }
  );
}
