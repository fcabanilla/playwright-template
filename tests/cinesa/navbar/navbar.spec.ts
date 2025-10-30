import { test } from '../../../fixtures/cinesa/playwright.fixtures';
import { allure } from 'allure-playwright';
import { NavbarAssertions } from './navbar.assertions';
import { getNavbarData } from './navbar.data';

test.describe('Navbar - Navegación Principal', () => {
  let navbarAssertions: NavbarAssertions;

  test.beforeEach(async ({ page, navbar, cookieBanner, promotionalModal }) => {
    await allure.epic('Cinesa Platform');
    await allure.feature('Navbar - Main Navigation');

    navbarAssertions = new NavbarAssertions(page);
    await navbar.navigateToHome();
    await cookieBanner.acceptAllCookies();
    await promotionalModal.closeModalIfVisible();
  });

  test.describe('Visibilidad de Elementos', () => {
    test('should display all navbar elements', async () => {
      await allure.story('Verificar elementos visibles del navbar');
      await allure.parameter(
        'Elements',
        'Cines, Películas, Experiencias, Programas, Promociones'
      );

      await navbarAssertions.expectNavbarElementsVisible();
    });
  });

  test.describe('Navegación Logo', () => {
    test('should click logo and stay on home', async ({ navbar }) => {
      await allure.story('Click en logo mantiene home');
      const { baseUrl } = getNavbarData();

      await allure.parameter('Expected URL', baseUrl);

      await navbar.clickLogo();
      await navbarAssertions.expectHomeUrl(baseUrl);
    });
  });

  test.describe('Navegación Completa - DEMO', () => {
    test('should click each navbar element and navigate accordingly DEMO test', async ({
      navbar,
    }) => {
      await allure.story('Navegación por todos los elementos del navbar');
      const { internalNavItems, externalNavItem } = getNavbarData();

      await allure.parameter(
        'Internal Items',
        internalNavItems.length.toString()
      );
      await allure.parameter('External Items', '1');

      for (const item of internalNavItems) {
        await allure.step(`Navigate to ${item.selectorKey}`, async () => {
          await navbarAssertions.expectNavClick(
            navbar.selectors[item.selectorKey],
            item.expectedUrl
          );
          await navbar.navigateToHome();
        });
      }

      await allure.step('Navigate to external promociones', async () => {
        await navbarAssertions.expectExternalNavClick(
          navbar.selectors[externalNavItem.selectorKey],
          externalNavItem.expectedUrl
        );
      });
    });
  });
});
