export interface LivingTicketSelectors {
  rootContainer: string;
  heroContainer: string;
  countdownBadge: string;
  qrImage: string;
  qrReference: string;
  cinemaName: string;
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
}

export const livingTicketSelectors: LivingTicketSelectors = {
  rootContainer:
    '.review-ticket-page, [class*="review-ticket"], main:has(.movie-detailed-resume)',
  heroContainer:
    '.online-ticket, .ticket-online, .living-ticket-card, .review-ticket-page',
  countdownBadge:
    '.ticket-online__counter, .ticket-online .badge, .showtime-countdown-timer .description',
  qrImage:
    '.ticket-online img[alt*="qr" i], .ticket-online img[src*="qr" i], .ticket-online canvas, .ticket-online img, .online-ticket img[alt*="qr" i], .online-ticket img[src*="qr" i], .online-ticket canvas, .online-ticket img',
  qrReference:
    '.ticket-online .code, .ticket-online__code, .online-ticket .code, .online-ticket .qr-code-text, .ticket-online [class*="code"], .online-ticket [class*="code"]',
  cinemaName:
    '.ticket-online .cinema, .ticket-online .cinema-name, .online-ticket .cinema-name',
  roomLabel:
    '.ticket-online :text("SALA"), .online-ticket :text("SALA"), .ticket-online :text("ROOM"), .online-ticket :text("ROOM")',
  roomValue:
    '.ticket-online .room, .ticket-online .room-value, .online-ticket .room-value, .ticket-online [class*="room"], .online-ticket [class*="room"]',
  areaLabel:
    '.ticket-online :text("ÁREA"), .online-ticket :text("ÁREA"), .ticket-online :text("AREA"), .online-ticket :text("AREA")',
  areaValue:
    '.ticket-online .area, .ticket-online .area-value, .online-ticket .area-value, .ticket-online [class*="area"], .online-ticket [class*="area"]',
  seatRowLabel:
    '.ticket-online :text("FILA-BUTACAS"), .online-ticket :text("FILA-BUTACAS"), .ticket-online :text("ROW"), .online-ticket :text("ROW")',
  seatRowValue:
    '.ticket-online .seat-row, .ticket-online .seat-value, .online-ticket .seat-value, .ticket-online [class*="seat"], .online-ticket [class*="seat"]',
  changeSeatsButton:
    'button:has-text("Cambiar asientos"), a:has-text("Cambiar asientos")',
  returnTicketsButton:
    'button:has-text("Devolver entradas"), a:has-text("Devolver entradas")',
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
    '.showtime-countdown-timer .description, .showtime-countdown-timer, .ticket-online__counter, .ticket-online .badge',
  countdownValues: '.showtime-countdown-timer .part .number',
  countdownLabels: '.showtime-countdown-timer .part .text',
  transactionSummaryContainer:
    '.movie-detailed-resume, .transaction-summary, .v-journey-details-section:has-text("Identificador"), .v-journey-details-section:has-text("transaction")',
  transactionId:
    '.movie-detailed-resume :text("Identificador"), .transaction-summary :text("Identificador"), .v-journey-details-section :text("Identificador"), .movie-detailed-resume :text("Transaction")',
  moviePoster: '.movie-detailed-resume img, .transaction-summary img',
  movieTitle:
    '.movie-detailed-resume .movie-title, .transaction-summary .movie-title, .movie-detailed-resume h3, .movie-detailed-resume strong',
  sessionInfo:
    '.movie-detailed-resume .session-info, .transaction-summary .session-info, .movie-detailed-resume [class*="session"], .transaction-summary [class*="session"]',
  ticketLineLabel:
    '.movie-detailed-resume :text("Adult"), .movie-detailed-resume :text("Tus entradas"), .movie-detailed-resume :text("Tickets"), .transaction-summary :text("Tickets")',
  ticketLinePrice:
    '.movie-detailed-resume :text("€"), .transaction-summary :text("€")',
  totalPrice:
    '.movie-detailed-resume :text("Total"), .transaction-summary :text("Total"), .v-journey-details-section :text("Total")',
  managementFee:
    '.movie-detailed-resume :text("Gastos de gestión"), .transaction-summary :text("Gastos de gestión"), .movie-detailed-resume :text("Management fee"), .transaction-summary :text("Management fee")',
  savings:
    '.movie-detailed-resume :text("Te has ahorrado"), .transaction-summary :text("Te has ahorrado"), .movie-detailed-resume :text("You saved"), .transaction-summary :text("You saved")',
} as const;
