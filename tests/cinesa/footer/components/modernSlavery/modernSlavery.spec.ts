import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import {
  assertModernSlaveryNavigation,
  assertModernSlaveryPDFDownload,
  assertModernSlaveryPDFPopup,
} from './modernSlavery.assertions';
import { handlePDFInteraction } from './modernSlavery.helpers';
import { expectedUrl } from './modernSlavery.data';

test.describe('Modern Slavery Declaration Tests', () => {
  test.beforeEach(async ({ cookieBanner, footer }) => {
    await footer.navigateToHome();
    await cookieBanner.acceptAllCookies();
  });

  test(
    'Modern Slavery Declaration display and layout',
    { tag: ['@fix-test'] },
    async ({ webActions, footer }, testInfo) => {
      const { download, popup } = await handlePDFInteraction(
        webActions,
        async () => {
          await footer.clickEsclavitudModerna();
        }
      );

      if (download) {
        await assertModernSlaveryPDFDownload(download);
      } else if (popup) {
        await assertModernSlaveryPDFPopup(popup, testInfo);
        await popup.close();
      }
    }
  );

  test(
    'Modern Slavery Declaration redirection test',
    { tag: ['@fix-test'] },
    async ({ webActions, footer }) => {
      const { download, popup } = await handlePDFInteraction(
        webActions,
        async () => {
          await footer.clickEsclavitudModerna();
        }
      );

      if (download) {
        await assertModernSlaveryPDFDownload(download);
      } else if (popup) {
        await assertModernSlaveryNavigation(popup, expectedUrl);
        await popup.close();
      }
    }
  );
});
