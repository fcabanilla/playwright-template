export interface LegendData {
  expectedLegendItems: string[];
}

export interface SeatData {
  seatIdentifier: string;
  expectedState: boolean;
  seatType: 'normal' | 'vip' | 'wheelchair';
}

export const seatTestData: SeatData[] = [
  { seatIdentifier: 'A1', expectedState: true, seatType: 'normal' },
  // { seatIdentifier: 'B2', expectedState: false, seatType: 'vip' },
  // ...otros casos...
];

export const legendData: LegendData = {
  expectedLegendItems: [
    'Seleccionada',
    'No disponible',
    'VIP',
    'Espacio Silla Ruedas',
    'Acompañante',
    'Bloqueada',
  ],
};

/**
 * Re-export centralized cinema configuration
 * All cinema-related configuration is managed in config/cinemas.config.ts
 */
export type { CinemaConfig } from '../../../config/cinemas.config';
export {
  AVAILABLE_CINEMAS,
  getCinemasForEnvironment,
} from '../../../config/cinemas.config';
