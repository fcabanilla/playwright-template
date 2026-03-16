import { allure } from 'allure-playwright';
import { WebActions } from '../../../core/webactions/webActions';
import { FooterSelectors, footerSelectors } from './footer.selectors';

export class Footer {
  private readonly webActions: WebActions;
  public selectors: FooterSelectors;
  private readonly url: string;
  
  constructor(webActions: WebActions, baseUrl?: string) {
    this.webActions = webActions;
    this.selectors = footerSelectors;
    this.url = baseUrl || 'https://www.cinesa.es/';
  }

  /**
   * Get environment-appropriate selector for blog link
   * Production: Opens in same tab, Preprod: Opens in new tab
   */
  getBlogSelector(): string {
    const currentUrl = this.webActions.getPage().url();
    if (currentUrl?.includes('preprod-web.ocgtest.es') || currentUrl?.includes('lab-web.ocgtest.es')) {
      return this.selectors.blogDeCinesaLinkPreprod || this.selectors.blogDeCinesaLink;
    }
    return this.selectors.blogDeCinesaLinkProd || this.selectors.blogDeCinesaLink;
  }

  async navigateToHome(): Promise<void> {
    await allure.step('Navigating to Cinesa home', async () => {
      await this.webActions.navigateTo(this.url);
    });
  }

  async clickGoToTop(): Promise<void> {
    await allure.step('Clicking Go to Top button', async () => {
      await this.webActions.click(this.selectors.goToTopButton);
    });
  }

  async clickQuienesSomos(): Promise<void> {
    await allure.step('Clicking Quiénes Somos link', async () => {
      await this.webActions.click(this.selectors.quienesSomosLink);
    });
  }

  async clickTrabajaConNosotros(): Promise<void> {
    await allure.step('Clicking Trabaja con Nosotros link', async () => {
      await this.webActions.click(this.selectors.trabajaConNosotrosLink);
    });
  }

  async clickCinesaBusiness(): Promise<void> {
    await allure.step('Clicking Cinesa Business link', async () => {
      await this.webActions.click(this.selectors.cinesaBusinessLink);
    });
  }

  async clickAtencionAlCliente(): Promise<void> {
    await allure.step('Clicking Atención al Cliente link', async () => {
      await this.webActions.click(this.selectors.atencionAlClienteLink);
    });
  }

  async clickTransparencia(): Promise<void> {
    await allure.step('Clicking Transparencia link', async () => {
      await this.webActions.click(this.selectors.transparenciaLink);
    });
  }

  async clickEventos(): Promise<void> {
    await allure.step('Clicking Eventos link', async () => {
      await this.webActions.click(this.selectors.eventosLink);
    });
  }

  async clickCinesaLuxe(): Promise<void> {
    await allure.step('Clicking Cinesa LUXE link', async () => {
      await this.webActions.click(this.selectors.cinesaLuxeLink);
    });
  }

  async clickSalasPremium(): Promise<void> {
    await allure.step('Clicking Salas Premium link', async () => {
      await this.webActions.click(this.selectors.salasPremiumLink);
    });
  }

  async clickInfantilYColegios(): Promise<void> {
    await allure.step('Clicking Infantil y Colegios link', async () => {
      await this.webActions.click(this.selectors.infantilYColegiosLink);
    });
  }

  async clickCiclos(): Promise<void> {
    await allure.step('Clicking Ciclos link', async () => {
      await this.webActions.click(this.selectors.ciclosLink);
    });
  }

  async clickBlogDeCinesa(): Promise<void> {
    await allure.step('Clicking Blog de Cinesa link', async () => {
      const blogSelector = this.getBlogSelector();
      await this.webActions.click(blogSelector);
    });
  }

  async clickAvisoLegal(): Promise<void> {
    await allure.step('Clicking Aviso Legal link', async () => {
      await this.webActions.click(this.selectors.avisoLegalLink);
    });
  }

  async clickCondicionesCompra(): Promise<void> {
    await allure.step('Clicking Condiciones de Compra link', async () => {
      await this.webActions.click(this.selectors.condicionesCompraLink);
    });
  }

  async clickCondicionesUnlimited(): Promise<void> {
    await allure.step('Clicking Condiciones del Programa Unlimited Card link', async () => {
      await this.webActions.click(this.selectors.condicionesUnlimitedLink);
    });
  }

  async clickPoliticaPrivacidad(): Promise<void> {
    await allure.step('Clicking Política de Privacidad link', async () => {
      await this.webActions.click(this.selectors.politicaPrivacidadLink);
    });
  }

  async clickPoliticaCookies(): Promise<void> {
    await allure.step('Clicking Política de Cookies link', async () => {
      await this.webActions.click(this.selectors.politicaCookiesLink);
    });
  }

  async clickEsclavitudModerna(): Promise<void> {
    await allure.step('Clicking Declaración de Esclavitud Moderna link', async () => {
      await this.webActions.click(this.selectors.esclavitudModernaLink);
    });
  }

  async clickCodigoConducta(): Promise<void> {
    await allure.step('Clicking Código de Conducta link', async () => {
      await this.webActions.click(this.selectors.codigoConductaLink);
    });
  }

  async clickPoliticaDenuncia(): Promise<void> {
    await allure.step('Clicking Política de Denuncia link', async () => {
      await this.webActions.click(this.selectors.politicaDenunciaLink);
    });
  }

  async clickAndroidApp(): Promise<void> {
    await allure.step('Clicking Android App link', async () => {
      await this.webActions.click(this.selectors.androidAppLink);
    });
  }

  async clickAppleApp(): Promise<void> {
    await allure.step('Clicking Apple App link', async () => {
      await this.webActions.click(this.selectors.appleAppLink);
    });
  }

  async clickFacebook(): Promise<void> {
    await allure.step('Clicking Facebook link', async () => {
      await this.webActions.click(this.selectors.facebookLink);
    });
  }

  async clickTwitter(): Promise<void> {
    await allure.step('Clicking Twitter link', async () => {
      await this.webActions.click(this.selectors.twitterLink);
    });
  }

  async clickInstagram(): Promise<void> {
    await allure.step('Clicking Instagram link', async () => {
      await this.webActions.click(this.selectors.instagramLink);
    });
  }

  async clickLinkedin(): Promise<void> {
    await allure.step('Clicking Linkedin link', async () => {
      await this.webActions.click(this.selectors.linkedinLink);
    });
  }

  async clickTiktok(): Promise<void> {
    await allure.step('Clicking Tiktok link', async () => {
      await this.webActions.click(this.selectors.tiktokLink);
    });
  }

  async clickYoutube(): Promise<void> {
    await allure.step('Clicking Youtube link', async () => {
      await this.webActions.click(this.selectors.youtubeLink);
    });
  }
}
