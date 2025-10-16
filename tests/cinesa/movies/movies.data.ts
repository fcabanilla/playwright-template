import { getCinesaConfig, CinesaEnvironment } from '../../../config/environments';

const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
const config = getCinesaConfig(env);

export const MOVIES_URL = `${config.baseUrl}/peliculas/`;
