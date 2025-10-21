export const cinemasData = {
  oasiz: 'oasiz',
  santander: 'santander',
  grancasa: 'grancasa',
};

import {
  getCinesaConfig,
  CinesaEnvironment,
} from '../../../config/environments';

const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
const config = getCinesaConfig(env);

export const CINEMAS_URL = `${config.baseUrl}/cines/`;
