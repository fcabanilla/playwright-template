export interface BookingConfirmationSelectors {
  confirmationContainer: string;
  confirmationHeading: string;
  confirmationMessage: string;
  confirmationPrimaryCta: string;
  countdownContainer: string;
  countdownValues: string;
  countdownLabels: string;
  calendarPrompt: string;
  googleWalletButton: string;
  webloyaltyOverlayContainer: string;
  webloyaltyOverlayCloseButton: string;
  webloyaltyOverlayHeading: string;
  webloyaltyOverlayMessage: string;
  webloyaltyOverlayPrimaryCta: string;
  webloyaltyInlineContainer: string;
  webloyaltyInlineHeading: string;
  webloyaltyInlineMessage: string;
  webloyaltyInlinePrimaryCta: string;
  webloyaltyDisclaimer: string;
}

export const bookingConfirmationSelectors: BookingConfirmationSelectors = {
  confirmationContainer:
    '.booking-confirmation, .v-confirmation, [class*="booking-confirmation"], [class*="booking-confirmed"]',
  confirmationHeading:
    '.booking-confirmation__heading, h1:has-text("GRACIAS POR TU COMPRA"), .v-confirmation h1',
  confirmationMessage:
    '.booking-confirmation__message, .booking-confirmation__message.rich-text, .v-confirmation .rich-text',
  confirmationPrimaryCta:
    '.booking-confirmation__button, a[href*="/compra/revision-de-tu-compra/"]',
  countdownContainer: '.showtime-countdown-timer',
  countdownValues: '.showtime-countdown-timer .part .number',
  countdownLabels: '.showtime-countdown-timer .part .text',
  calendarPrompt: '.showtime-countdown-timer .add-to-calendar',
  googleWalletButton:
    '.google-wallet-button button, .apple-wallet-container button',
  webloyaltyOverlayContainer:
    '[id^="WLS_popup_block_"]:not([style*="display: none"]), [id^="WLS_modal_"]:not([style*="display: none"])',
  webloyaltyOverlayCloseButton: '#WL_xout, [id^="WL_xout"]',
  webloyaltyOverlayHeading:
    '[id^="WLS_popup_block_"] [id^="WL_title_"], [id^="WLS_popup_block_"] :text("reembolso")',
  webloyaltyOverlayMessage:
    '[id^="WLS_popup_block_"] [id^="WL_mainText_"], [id^="WLS_popup_block_"] #disclaimerText_2410082250, [id^="WLS_popup_block_"] :text("Haciendo click")',
  webloyaltyOverlayPrimaryCta:
    '[id^="WLS_popup_block_"] [id^="WL_link_"], [id^="WLS_popup_block_"] #WLS_smartButton, [id^="WLS_popup_block_"] a[href*="one-time-offer.com"]',
  webloyaltyInlineContainer:
    '.WLS_gtmBannerWrapper, [id^="WLbanner_"]:has(#buttonContainer_2212021129)',
  webloyaltyInlineHeading:
    '.WLS_gtmBannerWrapper #mainText_2212021129, .WLS_gtmBannerWrapper :text("Tu compra se ha realizado correctamente")',
  webloyaltyInlineMessage:
    '.WLS_gtmBannerWrapper #disclaimerText_2212021129, [id^="disclaimerText_"], .WLS_gtmBannerWrapper :text("Privilegios en Compras de Webloyalty")',
  webloyaltyInlinePrimaryCta:
    '.WLS_gtmBannerWrapper #WLS_smartButton_2212021129, .WLS_gtmBannerWrapper a:has-text("CONTINUAR")',
  webloyaltyDisclaimer:
    '[id^="disclaimerText_"], .WLS_gtmBannerWrapper :text("Privilegios en Compras de Webloyalty")',
} as const;
