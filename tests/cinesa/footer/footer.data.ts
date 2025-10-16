import { FooterSelectors } from '../../../pageObjectsManagers/cinesa/footer/footer.selectors';
import { getCinesaConfig, CinesaEnvironment } from '../../../config/environments';

const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
const config = getCinesaConfig(env);

// Interfaz para representar un elemento de navegación y su URL esperada
export interface FooterNavItem {
  selectorKey: keyof FooterSelectors;
  expectedUrl: string;
}

// URL base del sitio (dinámica según entorno)
export const baseUrl = config.baseUrl;

// Elementos de navegación interna
export const internalFooterItems: FooterNavItem[] = [
  { selectorKey: 'quienesSomosLink', expectedUrl: `${baseUrl}/quienes-somos/` },
  { selectorKey: 'trabajaConNosotrosLink', expectedUrl: 'https://cinesa-uci.jobtrain.co.uk/cinesajobs/Home/Job' },
  { selectorKey: 'cinesaBusinessLink', expectedUrl: 'https://www.cinesabusiness.es/' },
  { selectorKey: 'atencionAlClienteLink', expectedUrl: 'https://ayuda.cinesa.es/hc/es' },
  { selectorKey: 'apoyoInstitucionalLink', expectedUrl: `${baseUrl}/quienes-somos/apoyo-institucional/` },
  { selectorKey: 'transparenciaLink', expectedUrl: `${baseUrl}/quienes-somos/transparencia/` },
  { selectorKey: 'eventosLink', expectedUrl: `${baseUrl}/eventos/` },
  { selectorKey: 'cinesaLuxeLink', expectedUrl: `${baseUrl}/experiencias/luxe/` },
  { selectorKey: 'salasPremiumLink', expectedUrl: `${baseUrl}/salas-premium/` },
  { selectorKey: 'infantilYColegiosLink', expectedUrl: `${baseUrl}/infantil/` },
  { selectorKey: 'ciclosLink', expectedUrl: `${baseUrl}/ciclos/` },
  { selectorKey: 'blogDeCinesaLink', expectedUrl: `${baseUrl}/blog-cinesa/` },
  { selectorKey: 'avisoLegalLink', expectedUrl: `${baseUrl}/documentos-legales/aviso-legal` },
  { selectorKey: 'condicionesCompraLink', expectedUrl: `${baseUrl}/documentos-legales/condiciones-compra/` },
  { selectorKey: 'condicionesUnlimitedLink', expectedUrl: `${baseUrl}/documentos-legales/condiciones-unlimited/` },
  { selectorKey: 'politicaPrivacidadLink', expectedUrl: `${baseUrl}/documentos-legales/politica-privacidad/` },
  { selectorKey: 'politicaCookiesLink', expectedUrl: `${baseUrl}/documentos-legales/cookies` },
  { selectorKey: 'esclavitudModernaLink', expectedUrl: `${baseUrl}/media/1b5fgcfo/modernslavery_es.pdf#/` },
  { selectorKey: 'codigoConductaLink', expectedUrl: `${baseUrl}/quienes-somos/codigo-de-conducta-y-etica-empresariales` },
  { selectorKey: 'politicaDenunciaLink', expectedUrl: `${baseUrl}/media/qxjp2u4p/ocg-whistleblowing-policy-2024-spain-web-version.pdf` },
  { selectorKey: 'androidAppLink', expectedUrl: 'https://play.google.com/store/apps/details?id=nz.co.vista.android.movie.cinesa' },
  { selectorKey: 'appleAppLink', expectedUrl: 'https://apps.apple.com/es/app/cinesa-app/id6444631578?l=ca' },
  { selectorKey: 'facebookLink', expectedUrl: 'https://www.facebook.com/cinesa.es',}
];