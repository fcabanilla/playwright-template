export interface BookingConfirmationValidationData {
  confirmationUrlKeywords: string[];
  headingPatterns: RegExp[];
  messagePatterns: RegExp[];
  primaryCtaPatterns: RegExp[];
  primaryCtaHrefPatterns: RegExp[];
  countdownLabelPatterns: RegExp[];
  webloyaltyHeadingPatterns: RegExp[];
  webloyaltyMessagePatterns: RegExp[];
  webloyaltyPrimaryCtaPatterns: RegExp[];
  webloyaltyTargetPatterns: RegExp[];
}

export const bookingConfirmationValidationData: BookingConfirmationValidationData =
  {
    confirmationUrlKeywords: [
      'confirmacion',
      'confirmation',
      'booking-confirmed',
      'success',
    ],
    headingPatterns: [
      /confirmad/i,
      /compra/i,
      /reserva/i,
      /gracias/i,
      /success/i,
    ],
    messagePatterns: [
      /email/i,
      /correo/i,
      /localizador/i,
      /reserva/i,
      /compra/i,
    ],
    primaryCtaPatterns: [/ver/i, /entrada/i, /productos\s+de\s+bar/i],
    primaryCtaHrefPatterns: [/\/compra\/revision-de-tu-compra\//i],
    countdownLabelPatterns: [/dias/i, /horas/i, /minutos/i, /segundos/i],
    webloyaltyHeadingPatterns: [
      /reembolso/i,
      /compra\s+se\s+ha\s+realizado/i,
      /webloyalty/i,
    ],
    webloyaltyMessagePatterns: [
      /haciendo\s+click/i,
      /privilegios\s+en\s+compras\s+de\s+webloyalty/i,
      /t[ée]rminos\s+y\s+condiciones/i,
    ],
    webloyaltyPrimaryCtaPatterns: [/s[ií]/i, /continu/i, /acept/i, /quiero/i],
    webloyaltyTargetPatterns: [
      /one-time-offer\.com/i,
      /^javascript:void\(0\);?$/i,
    ],
  };
