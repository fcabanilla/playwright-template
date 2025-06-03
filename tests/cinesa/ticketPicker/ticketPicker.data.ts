export interface TicketTypeMapping {
  seatType: 'regular' | 'dbox';
  expectedTicketText: string[];
}

export const ticketTypeMappings: TicketTypeMapping[] = [
  {
    seatType: 'regular',
    expectedTicketText: [
      '-Normal Luxe',
      'Fiesta del cine Luxe'
    ],
  },
  {
    seatType: 'dbox',
    expectedTicketText: [
      '-Normal D-BOX',
      'Fiesta del cine DBOX'
    ],
  },
];
