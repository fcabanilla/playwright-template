import {
  getCinesaConfig,
  CinesaEnvironment,
} from '../../../config/environments';

const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
const config = getCinesaConfig(env);

export const PROGRAMS_URL = `${config.baseUrl}/programas/`;
export const UNLIMITED_PROGRAMS_URL = `${config.baseUrl}/unlimited/informacion/`;
