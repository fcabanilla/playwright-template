const defaultEmail =
  process.env.TEST_USER_EMAIL || 'federico.cabanilla@gmail.com';
const emailUser = defaultEmail.split('@')[0] || 'federico.cabanilla';
const emailDomain = defaultEmail.split('@')[1] || 'gmail.com';

export const defaultUser = {
  user: process.env.TEST_USER_USERNAME || emailUser,
  domain: emailDomain,
  name: process.env.TEST_USER_FIRST_NAME || 'Federico',
  lastName: process.env.TEST_USER_LAST_NAME || 'Cabanilla',
  birthDate: process.env.TEST_USER_BIRTH_DATE || '11/10/1990',
  phone: process.env.TEST_USER_PHONE || '3517736362',
  favoriteCinema: 'Oasiz',
  id: process.env.TEST_USER_ID || '35572069',
  password: process.env.TEST_USER_PASSWORD || 'Cinesa123!',
};
