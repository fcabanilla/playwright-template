export interface LivingTicketSelectors {
  rootContainer: string;
  heroContainer: string;
  countdownBadge: string;
  qrImage: string;
  qrReference: string;
  cinemaName: string;
  heroDetailItems: string;
  roomLabel: string;
  roomValue: string;
  areaLabel: string;
  areaValue: string;
  seatRowLabel: string;
  seatRowValue: string;
  changeSeatsButton: string;
  returnTicketsButton: string;
  googleWalletButton: string;
  shareTicketsLink: string;
  addToCalendarLink: string;
  webloyaltyOverlayContainer: string;
  webloyaltyOverlayCloseButton: string;
  countdownContainer: string;
  countdownHeader: string;
  countdownValues: string;
  countdownLabels: string;
  transactionSummaryContainer: string;
  transactionId: string;
  moviePoster: string;
  movieTitle: string;
  sessionInfo: string;
  ticketLineLabel: string;
  ticketLinePrice: string;
  totalPrice: string;
  managementFee: string;
  savings: string;
  pageBody: string;
}

export const livingTicketSelectors: LivingTicketSelectors = {
  rootContainer:
    '.v-journey-summary, .review-ticket-page, [class*="review-ticket"], main:has(.movie-detailed-resume)',
  heroContainer:
    '.v-journey-summary-hero-banner, .v-journey-summary-details, .online-ticket, .ticket-online, .living-ticket-card, .review-ticket-page',
  countdownBadge:
    '.v-journey-summary-countdown, .ticket-online__counter, .ticket-online .badge, .showtime-countdown-timer .description',
  qrImage:
    '.v-barcode__qr-code, .v-barcode img[alt*="qr" i], .ticket-online img[alt*="qr" i], .ticket-online img[src*="qr" i], .ticket-online canvas, .ticket-online img, .online-ticket img[alt*="qr" i], .online-ticket img[src*="qr" i], .online-ticket canvas, .online-ticket img',
  qrReference:
    '.v-barcode__label, .ticket-online .code, .ticket-online__code, .online-ticket .code, .online-ticket .qr-code-text, .ticket-online [class*="code"], .online-ticket [class*="code"]',
  cinemaName:
    '.v-journey-summary-details__site-name, .ticket-online .cinema, .ticket-online .cinema-name, .online-ticket .cinema-name',
  heroDetailItems:
    '.v-journey-summary-showtime-detail, .v-journey-summary-showtime li, .ticket-online li, .online-ticket li, .living-ticket-card li, .review-ticket-page li, .ticket-online [role="listitem"], .online-ticket [role="listitem"], .living-ticket-card [role="listitem"], .review-ticket-page [role="listitem"]',
  roomLabel:
    '.ticket-online :text("SALA"), .online-ticket :text("SALA"), .ticket-online :text("ROOM"), .online-ticket :text("ROOM")',
  roomValue:
    '.v-journey-summary-showtime-detail--screen-name .v-display-text-part, .ticket-online .room, .ticket-online .room-value, .online-ticket .room-value, .ticket-online [class*="room"], .online-ticket [class*="room"]',
  areaLabel:
    '.ticket-online :text("ÁREA"), .online-ticket :text("ÁREA"), .ticket-online :text("AREA"), .online-ticket :text("AREA")',
  areaValue:
    '.v-journey-summary-showtime-detail--areas-summary .v-display-text-part, .ticket-online .area, .ticket-online .area-value, .online-ticket .area-value, .ticket-online [class*="area"], .online-ticket [class*="area"]',
  seatRowLabel:
    '.ticket-online :text("FILA-BUTACAS"), .online-ticket :text("FILA-BUTACAS"), .ticket-online :text("ROW"), .online-ticket :text("ROW")',
  seatRowValue:
    '.v-journey-summary-showtime-detail--seats-summary .v-display-text-part, .ticket-online .seat-row, .ticket-online .seat-value, .online-ticket .seat-value, .ticket-online [class*="seat"], .online-ticket [class*="seat"]',
  changeSeatsButton:
    '.v-journey-action-button-swap-seats button, button.v-journey-action-button-swap-seats, button:has-text("Cambiar asientos"), a:has-text("Cambiar asientos")',
  returnTicketsButton:
    '.c-journey-summary-refund button, button:has-text("Devolver entradas"), a:has-text("Devolver entradas")',
  googleWalletButton:
    '.google-wallet-button button, button:has-text("Google Wallet"), [class*="google-wallet"] button',
  shareTicketsLink:
    'a:has-text("Compartir Entradas"), button:has-text("Compartir Entradas")',
  addToCalendarLink:
    'a:has-text("añadir la sesión en tu calendario"), button:has-text("añadir la sesión en tu calendario"), .add-to-calendar',
  webloyaltyOverlayContainer:
    '[id^="WLS_popup_block_"]:not([style*="display: none"]), [id^="WLS_modal_"]:not([style*="display: none"])',
  webloyaltyOverlayCloseButton:
    '[id^="WLS_popup_block_"] #WL_xout, #WL_xout, [id^="WL_xout"]',
  countdownContainer: '.showtime-countdown-timer',
  countdownHeader:
    '.v-journey-summary-countdown .v-display-text-part, .showtime-countdown-timer .description, .showtime-countdown-timer, .ticket-online__counter, .ticket-online .badge',
  countdownValues: '.showtime-countdown-timer .part .number',
  countdownLabels: '.showtime-countdown-timer .part .text',
  transactionSummaryContainer:
    '.journey-wrapper__details, .v-journey-details, .v-journey-summary, .movie-detailed-resume, .transaction-summary',
  transactionId:
    '.v-journey-details__transaction-number, .v-journey-summary :text("Identificador de la transacción")',
  moviePoster: '.movie-detailed-resume img, .transaction-summary img',
  movieTitle:
    '.v-journey-details-showtime__wrapper .v-film-title__text, .v-film-title__text',
  sessionInfo: '.v-journey-details-showtime__summary',
  ticketLineLabel: '.v-order-ticket__description',
  ticketLinePrice: '.v-order-ticket__price',
  totalPrice: '.v-journey-details-total-base__total-cost .v-order-line__price',
  managementFee:
    '.v-journey-details-total-base__included-booking-fee .v-order-line__price',
  savings:
    '.movie-detailed-resume :text("Te has ahorrado"), .transaction-summary :text("Te has ahorrado"), .movie-detailed-resume :text("You saved"), .transaction-summary :text("You saved")',
  pageBody: 'body',
} as const;
