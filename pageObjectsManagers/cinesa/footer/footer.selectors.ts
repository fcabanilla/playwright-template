export interface FooterSelectors {
  goToTopButton: string;
  quienesSomosLink: string;
  trabajaConNosotrosLink: string;
  cinesaBusinessLink: string;
  atencionAlClienteLink: string;
  transparenciaLink: string;
  eventosLink: string;
  cinesaLuxeLink: string;
  salasPremiumLink: string;
  infantilYColegiosLink: string;
  ciclosLink: string;
  blogDeCinesaLink: string;
  blogDeCinesaLinkProd?: string; // Selector específico para producción
  blogDeCinesaLinkPreprod?: string; // Selector específico para preprod
  avisoLegalLink: string;
  condicionesCompraLink: string;
  condicionesUnlimitedLink: string;
  politicaPrivacidadLink: string;
  politicaCookiesLink: string;
  esclavitudModernaLink: string;
  codigoConductaLink: string;
  politicaDenunciaLink: string;
  androidAppLink: string;
  appleAppLink: string;
  facebookLink: string;
  twitterLink: string;
  instagramLink: string;
  linkedinLink: string;
  tiktokLink: string;
  youtubeLink: string;
}

export const footerSelectors: FooterSelectors = {
  goToTopButton: '.go-to-top button',
  quienesSomosLink: 'a[href="/quienes-somos/"]',
  trabajaConNosotrosLink:
    'a[href="https://cinesa-uci.jobtrain.co.uk/cinesajobs/Home/Job"]',
  cinesaBusinessLink: 'a[href="http://www.cinesabusiness.es/"]',
  atencionAlClienteLink: 'a[href="http://ayuda.cinesa.es/"]',
  transparenciaLink: 'a[href="/quienes-somos/transparencia/"]',
  eventosLink: 'a[href="/eventos/"]',
  cinesaLuxeLink: 'a[href="/experiencias/luxe/"]',
  salasPremiumLink: 'a[href="/salas-premium/"]',
  infantilYColegiosLink: 'a[href="/infantil/"]',
  ciclosLink: 'a[href="/ciclos/"]',
  blogDeCinesaLink: 'a[href="/blog-cinesa/"]',
  blogDeCinesaLinkProd: 'a[href="/blog-cinesa/"]', // Producción
  blogDeCinesaLinkPreprod: 'a[href="/blog-cinesa/"]', // Preprod (por ahora igual, lo ajustaremos según errores)
  avisoLegalLink: 'a[href="/documentos-legales/aviso-legal"]',
  condicionesCompraLink: 'a[href="/documentos-legales/condiciones-compra/"]',
  condicionesUnlimitedLink:
    'a[href="/documentos-legales/condiciones-unlimited/"]',
  politicaPrivacidadLink: 'a[href="/documentos-legales/politica-privacidad/"]',
  politicaCookiesLink: 'a[href="/documentos-legales/cookies"]',
  esclavitudModernaLink: 'a[href*="modernslavery"]',
  codigoConductaLink:
    'a[href="/quienes-somos/codigo-de-conducta-y-etica-empresariales"]',
  politicaDenunciaLink: 'a[href*="whistleblowing-policy"]',
  androidAppLink:
    'a[href="https://play.google.com/store/apps/details?id=nz.co.vista.android.movie.cinesa"]',
  appleAppLink:
    'a[href="https://apps.apple.com/es/app/cinesa-app/id6444631578?l=ca"]',
  facebookLink: 'a[href="https://www.facebook.com/cinesa.es"]',
  twitterLink: 'a[href="https://twitter.com/Cinesa"]',
  instagramLink: 'a[href="https://www.instagram.com/cinesa.es/"]',
  linkedinLink: 'a[href="https://www.linkedin.com/company/98547"]',
  tiktokLink: 'a[href="https://www.tiktok.com/@cinesa.es?lang=es"]',
  youtubeLink: 'a[href="https://www.youtube.com/c/cinesa/featured"]',
};
