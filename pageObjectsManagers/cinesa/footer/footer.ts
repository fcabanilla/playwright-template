import { Page } from '@playwright/test';
import * as allure from 'allure-playwright';
import { FooterSelectors, footerSelectors } from './footer.selectors';

export class Footer {
  private readonly page: Page;
  public selectors: FooterSelectors;
  private readonly url: string = 'https://www.cinesa.es/';
  constructor(page: Page) {
    this.page = page;
    this.selectors = footerSelectors;
  }

  async navigateToHome(): Promise<void> {
    await allure.test.step('Navigating to Cinesa home', async () => {
      await this.page.goto(this.url);
    });
  }

  async clickGoToTop(): Promise<void> {
    await allure.test.step('Clicking Go to Top button', async () => {
      await this.page.click(this.selectors.goToTopButton);
    });
  }

  async clickQuienesSomos(): Promise<void> {
    await allure.test.step('Clicking Quiénes Somos link', async () => {
      await this.page.click(this.selectors.quienesSomosLink);
    });
  }

  async clickTrabajaConNosotros(): Promise<void> {
    await allure.test.step('Clicking Trabaja con Nosotros link', async () => {
      await this.page.click(this.selectors.trabajaConNosotrosLink);
    });
  }

  async clickCinesaBusiness(): Promise<void> {
    await allure.test.step('Clicking Cinesa Business link', async () => {
      await this.page.click(this.selectors.cinesaBusinessLink);
    });
  }

  async clickAtencionAlCliente(): Promise<void> {
    await allure.test.step('Clicking Atención al Cliente link', async () => {
      await this.page.click(this.selectors.atencionAlClienteLink);
    });
  }

  async clickApoyoInstitucional(): Promise<void> {
    await allure.test.step('Clicking Apoyo Institucional link', async () => {
      await this.page.click(this.selectors.apoyoInstitucionalLink);
    });
  }

  async clickTransparencia(): Promise<void> {
    await allure.test.step('Clicking Transparencia link', async () => {
      await this.page.click(this.selectors.transparenciaLink);
    });
  }

  async clickEventos(): Promise<void> {
    await allure.test.step('Clicking Eventos link', async () => {
      await this.page.click(this.selectors.eventosLink);
    });
  }

  async clickCinesaLuxe(): Promise<void> {
    await allure.test.step('Clicking Cinesa LUXE link', async () => {
      await this.page.click(this.selectors.cinesaLuxeLink);
    });
  }

  async clickSalasPremium(): Promise<void> {
    await allure.test.step('Clicking Salas Premium link', async () => {
      await this.page.click(this.selectors.salasPremiumLink);
    });
  }

  async clickInfantilYColegios(): Promise<void> {
    await allure.test.step('Clicking Infantil y Colegios link', async () => {
      await this.page.click(this.selectors.infantilYColegiosLink);
    });
  }

  async clickCiclos(): Promise<void> {
    await allure.test.step('Clicking Ciclos link', async () => {
      await this.page.click(this.selectors.ciclosLink);
    });
  }

  async clickBlogDeCinesa(): Promise<void> {
    await allure.test.step('Clicking Blog de Cinesa link', async () => {
      await this.page.click(this.selectors.blogDeCinesaLink);
    });
  }

  async clickAvisoLegal(): Promise<void> {
    await allure.test.step('Clicking Aviso Legal link', async () => {
      await this.page.click(this.selectors.avisoLegalLink);
    });
  }

  async clickCondicionesCompra(): Promise<void> {
    await allure.test.step('Clicking Condiciones de Compra link', async () => {
      await this.page.click(this.selectors.condicionesCompraLink);
    });
  }

  async clickCondicionesUnlimited(): Promise<void> {
    await allure.test.step('Clicking Condiciones del Programa Unlimited Card link', async () => {
      await this.page.click(this.selectors.condicionesUnlimitedLink);
    });
  }

  async clickPoliticaPrivacidad(): Promise<void> {
    await allure.test.step('Clicking Política de Privacidad link', async () => {
      await this.page.click(this.selectors.politicaPrivacidadLink);
    });
  }

  async clickPoliticaCookies(): Promise<void> {
    await allure.test.step('Clicking Política de Cookies link', async () => {
      await this.page.click(this.selectors.politicaCookiesLink);
    });
  }

  async clickEsclavitudModerna(): Promise<void> {
    await allure.test.step('Clicking Declaración de Esclavitud Moderna link', async () => {
      await this.page.click(this.selectors.esclavitudModernaLink);
    });
  }

  async clickCodigoConducta(): Promise<void> {
    await allure.test.step('Clicking Código de Conducta link', async () => {
      await this.page.click(this.selectors.codigoConductaLink);
    });
  }

  async clickPoliticaDenuncia(): Promise<void> {
    await allure.test.step('Clicking Política de Denuncia link', async () => {
      await this.page.click(this.selectors.politicaDenunciaLink);
    });
  }

  async clickAndroidApp(): Promise<void> {
    await allure.test.step('Clicking Android App link', async () => {
      await this.page.click(this.selectors.androidAppLink);
    });
  }

  async clickAppleApp(): Promise<void> {
    await allure.test.step('Clicking Apple App link', async () => {
      await this.page.click(this.selectors.appleAppLink);
    });
  }

  async clickFacebook(): Promise<void> {
    await allure.test.step('Clicking Facebook link', async () => {
      await this.page.click(this.selectors.facebookLink);
    });
  }

  async clickTwitter(): Promise<void> {
    await allure.test.step('Clicking Twitter link', async () => {
      await this.page.click(this.selectors.twitterLink);
    });
  }

  async clickInstagram(): Promise<void> {
    await allure.test.step('Clicking Instagram link', async () => {
      await this.page.click(this.selectors.instagramLink);
    });
  }

  async clickLinkedin(): Promise<void> {
    await allure.test.step('Clicking Linkedin link', async () => {
      await this.page.click(this.selectors.linkedinLink);
    });
  }

  async clickTiktok(): Promise<void> {
    await allure.test.step('Clicking Tiktok link', async () => {
      await this.page.click(this.selectors.tiktokLink);
    });
  }

  async clickYoutube(): Promise<void> {
    await allure.test.step('Clicking Youtube link', async () => {
      await this.page.click(this.selectors.youtubeLink);
    });
  }
}
