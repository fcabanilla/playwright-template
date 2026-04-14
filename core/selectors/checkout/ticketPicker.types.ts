/**
 * Shared TicketPicker types — Cinesa checkout step 3 (Entradas).
 */

export interface TicketTypeInfo {
  name: string;
  price: string;
  currentQuantity: number;
  maxQuantity: number;
  isAvailable: boolean;
}
