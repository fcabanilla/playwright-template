/**
 * Test data for Login tests
 * Contains test credentials and expected values
 */

export const loginTestData = {
  validCredentials: {
    email: process.env.TEST_USER_EMAIL || 'federico.cabanilla@gmail.com',
    password: process.env.TEST_USER_PASSWORD || 'Cinesa123!',
  },
  invalidCredentials: {
    email: 'invalid@test.com',
    password: 'wrongpassword',
  },
  expectedMessages: {
    invalidLogin: 'Credenciales incorrectas',
    emailRequired: 'El email es obligatorio',
    passwordRequired: 'La contraseña es obligatoria',
  },
};
