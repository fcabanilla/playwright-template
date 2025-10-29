/**
 * Test data for Login tests
 * Contains test credentials and expected values
 */

export const loginTestData = {
  validCredentials: {
    email: 'matiasslpknt08@gmail.com',
    password: 'EstoEsUnaPrueba.1'
  },
  invalidCredentials: {
    email: 'invalid@test.com',
    password: 'wrongpassword'
  },
  expectedMessages: {
    invalidLogin: 'Credenciales incorrectas',
    emailRequired: 'El email es obligatorio',
    passwordRequired: 'La contraseña es obligatoria'
  }
};