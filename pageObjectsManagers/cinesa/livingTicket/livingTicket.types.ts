export interface LivingTicketHeroSnapshot {
  qrReference: string;
  cinemaName: string;
  room: string;
  area: string;
  seatRow: string;
}

export interface LivingTicketCountdownSnapshot {
  headerText: string;
  values: string[];
  labels: string[];
}

export interface LivingTicketTransactionSnapshot {
  transactionId: string;
  movieTitle: string;
  sessionInfo: string;
  lineItemLabel: string;
  lineItemPrice: string;
  totalPrice: string;
  managementFee: string;
  savings: string;
}

export interface LivingTicketSnapshot {
  hero: LivingTicketHeroSnapshot;
  countdown: LivingTicketCountdownSnapshot;
  transaction: LivingTicketTransactionSnapshot;
}
