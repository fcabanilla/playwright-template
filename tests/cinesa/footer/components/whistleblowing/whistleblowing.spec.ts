import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import {
  assertWhistleblowingNavigation,
  assertWhistleblowingPDFDownload,
  assertWhistleblowingPDFPopup,
} from './whistleblowing.assertions';
import { handlePDFInteraction } from './whistleblowing.helpers';
import { expectedUrl } from './whistleblowing.data';

test.describe('Whistleblowing Policy Tests', () => {
  test.beforeEach(async ({ cookieBanner, footer }) => {
    await footer.navigateToHome();
    await cookieBanner.acceptAllCookies();
  });

  test(
    'Whistleblowing Policy display and layout',
    { tag: ['@fix-test'] },
    async ({ webActions, footer }, testInfo) => {
      const { download, popup } = await handlePDFInteraction(
        webActions,
        async () => {
          await footer.clickPoliticaDenuncia();
        }
      );

      if (download) {
        await assertWhistleblowingPDFDownload(download);
      } else if (popup) {
        await assertWhistleblowingPDFPopup(popup, testInfo);
        await popup.close();
      }
    }
  );

  test(
    'Whistleblowing Policy redirection test',
    { tag: ['@fix-test'] },
    async ({ webActions, footer }) => {
      const { download, popup } = await handlePDFInteraction(
        webActions,
        async () => {
          await footer.clickPoliticaDenuncia();
        }
      );

      if (download) {
        await assertWhistleblowingPDFDownload(download);
      } else if (popup) {
        await assertWhistleblowingNavigation(popup, expectedUrl);
        await popup.close();
      }
    }
  );
});
