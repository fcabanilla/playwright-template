import { getCinesaConfig, CinesaEnvironment } from '../../../../../config/environments';

const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
const config = getCinesaConfig(env);

export const expectedUrl = `${config.baseUrl}/media/qxjp2u4p/ocg-whistleblowing-policy-2024-spain-web-version.pdf`;