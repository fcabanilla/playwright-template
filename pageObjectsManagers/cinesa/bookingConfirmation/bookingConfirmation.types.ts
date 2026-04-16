export type WebloyaltyVariant = 'none' | 'overlay' | 'inline' | 'both';

export interface BookingConfirmationSnapshot {
  headingText: string;
  messageText: string;
  primaryCtaText: string;
  primaryCtaHref: string;
}

export interface CountdownSnapshot {
  values: string[];
  labels: string[];
}
