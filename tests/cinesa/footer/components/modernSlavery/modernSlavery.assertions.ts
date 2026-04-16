import { expect, Page, Download, TestInfo } from '@playwright/test';
import { allure } from 'allure-playwright';
import { takeScreenshot } from '../../../../../pageObjectsManagers/cinesa/generic/generic';

export async function assertModernSlaveryNavigation(
  page: Page,
  expectedUrl: string
): Promise<void> {
  await allure.step(
    'Validating Modern Slavery Declaration page URL',
    async () => {
      await expect(page).toHaveURL(expectedUrl);
    }
  );
}

export async function assertModernSlaveryPDFDownload(
  download: Download
): Promise<void> {
  await allure.step('Validating Modern Slavery PDF download', async () => {
    const fileName = download.suggestedFilename();
    const url = download.url();

    await allure.parameter('Download Method', 'Direct Download');
    await allure.parameter('File Name', fileName);

    expect(fileName).toContain('modernslavery');
    expect(url).toContain('/media/1b5fgcfo/modernslavery_es.pdf');
  });
}

export async function assertModernSlaveryPDFPopup(
  popup: Page,
  testInfo: TestInfo
): Promise<void> {
  await allure.step('Validating Modern Slavery PDF in popup', async () => {
    await popup.waitForLoadState('networkidle');
    await takeScreenshot(
      popup,
      testInfo,
      'Modern Slavery Declaration display and layout'
    );
  });
}
