export interface TicketTypeMapping {
  seatType: 'regular' | 'dbox' | 'sofa';
  expectedTicketText: string[];
}

export const ticketTypeMappings: TicketTypeMapping[] = [
  {
    seatType: 'regular',
    expectedTicketText: [
      '-Normal Luxe',
      'Fiesta del cine Luxe',
      'Bonificada Senior +65 L',
      '-Menores 12 Luxe',
      '-Carnet Joven Luxe',
      '-Estudiante Luxe',
      '-Paro Luxe',
      '-Discapacitado Luxe',
      'Normal Luxe',
      'Menores 12 Luxe',
      'Carnet Joven Luxe',
      'Estudiante Luxe',
      'Paro Luxe',
      'Discapacitado Luxe',
      '-Pack Familia Luxe',
      '-Mayores 65 Luxe',
      '-Precio MyCinesa Luxe',
      'Adulto',
      'Infantil (<12)'
    ],
  },
  {
    seatType: 'dbox',
    expectedTicketText: [
      '-Normal D-BOX',
      'Fiesta del cine DBOX',
      'Bonificada Senior +65 L',
      '-Menores 12 D-BOX',
      '-Carnet Joven D-BOX',
      '-Estudiante D-BOX',
      '-Paro D-BOX',
      '-Discapacitado D-BOX',
      '-Precio MyCinesa DBOX',
      '-Precio MyCinesa D-BOX',
      'Normal D-BOX',
      'Menores 12 D-BOX',
      'Carnet Joven D-BOX',
      'Estudiante D-BOX',
      'Paro D-BOX',
      'Discapacitado D-BOX',
      '-Pack Familia D-BOX',
      '-Mayores 65 D-BOX',
      'Adulto D-BOX',
      'Infantil (<12) D-BOX'
    ],
  },
  {
    seatType: 'sofa',
    expectedTicketText: [
      '-Normal Sofa',
      'Fiesta del cine Sofa',
      'Bonificada Senior +65 L',
      '-Menores 12 Sofa',
      '-Carnet Joven Sofa',
      '-Estudiante Sofa',
      '-Paro Sofa',
      '-Discapacitado Sofa',
      '-Precio MyCinesa Sofa',
      'Normal Sofa',
      'Menores 12 Sofa',
      'Carnet Joven Sofa',
      'Estudiante Sofa',
      'Paro Sofa',
      'Discapacitado Sofa'
    ],
  },
];
