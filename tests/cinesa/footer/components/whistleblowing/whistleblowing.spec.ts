import { test } from '../../../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import {
  assertWhistleblowingNavigation,
  assertWhistleblowingPDFDownload,
  assertWhistleblowingPDFPopup,
} from './whistleblowing.assertions';
import { handlePDFInteraction } from './whistleblowing.helpers';
import { expectedUrl } from './whistleblowing.data';

test.describe('Whistleblowing Policy Tests', () => {
  test.beforeEach(async ({ footer }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Footer - Site Navigation');

    await footer.navigateToHome();
  });

  test(
    'Whistleblowing Policy display and layout',
    { tag: ['@fix-test'] },
    async ({ webActions, footer }, testInfo) => {
      await allure.story('Whistleblowing Policy PDF display and layout');
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
      await allure.story(
        'Whistleblowing Policy PDF navigation and URL validation'
      );
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
