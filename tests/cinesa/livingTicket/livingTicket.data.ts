export interface LivingTicketValidationData {
  livingTicketUrlPatterns: RegExp[];
  countdownHeaderPatterns: RegExp[];
  countdownLabelPatterns: RegExp[];
  sessionInfoPatterns: RegExp[];
  qrReferencePattern: RegExp;
  roomPattern: RegExp;
  areaPattern: RegExp;
  seatRowPattern: RegExp;
  currencyPattern: RegExp;
  transactionIdPattern: RegExp;
  requiredTransactionFields: Array<
    'transactionId' | 'movieTitle' | 'sessionInfo' | 'totalPrice'
  >;
  optionalTransactionFields: Array<
    'lineItemPrice' | 'managementFee' | 'savings'
  >;
}

export const livingTicketValidationData: LivingTicketValidationData = {
  livingTicketUrlPatterns: [/revision-de-tu-compra/i, /living-ticket/i],
  countdownHeaderPatterns: [
    /la\s+sesi[oó]n\s+comienza\s+en/i,
    /la\s+sesi[oó]n\s+empieza\s+en/i,
    /la\s+pel[ií]cula\s+empieza\s+en/i,
    /session\s+starts\s+in/i,
    /movie\s+starts\s+in/i,
  ],
  countdownLabelPatterns: [
    /d[ií]as?/i,
    /hours?/i,
    /horas?/i,
    /minutes?/i,
    /minutos?/i,
    /seconds?/i,
    /segundos?/i,
  ],
  sessionInfoPatterns: [
    /(?:lunes|martes|mi[eé]rcoles|jueves|viernes|s[áa]bado|domingo)/i,
    /(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
  ],
  qrReferencePattern: /^[A-Z0-9-]{5,}$/i,
  roomPattern: /^(?:sala|room)?\s*\d{1,3}$/i,
  areaPattern: /[áa]rea|area|luxe|premium|vip/i,
  seatRowPattern: /^[a-z]?\d+\s*[-,]\s*[a-z]?\d+$/i,
  currencyPattern: /^\d+[.,]\d{2}\s*€$|^€\s*\d+[.,]\d{2}$/,
  transactionIdPattern: /identificador\s+de\s+la\s+transacci[oó]n:\s*\d+/i,
  requiredTransactionFields: [
    'transactionId',
    'movieTitle',
    'sessionInfo',
    'totalPrice',
  ],
  optionalTransactionFields: ['lineItemPrice', 'managementFee', 'savings'],
};
