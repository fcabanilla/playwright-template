/**
 * Shared Login selectors — Cinesa checkout step 2 (Registro).
 *
 * MCP-verified from lab + preprod `/compra/inicio-de-sesion/`.
 */

export interface LoginSelectors {
  /** Page heading "Inicia sesión" */
  readonly heading: string;
  /** Email input */
  readonly emailInput: string;
  /** Password input */
  readonly passwordInput: string;
  /** Show/hide password toggle button */
  readonly showPasswordButton: string;
  /** "Recuérdame" checkbox */
  readonly rememberMeCheckbox: string;
  /** "Entrar" submit button */
  readonly loginButton: string;
  /** "Recuperar contraseña" link */
  readonly forgotPasswordLink: string;
  /** "¡Regístrate ahora!" button */
  readonly registerButton: string;
  /** "Continuar como invitado" button */
  readonly guestCheckoutButton: string;
  /** Checkout timer display */
  readonly timer: string;
  /** Active stepper step */
  readonly activeStep: string;
}

export const loginSelectors: LoginSelectors = {
  heading: 'h1',
  emailInput: 'input[type="email"], input[name="email"]',
  passwordInput: 'input[type="password"], input[name="password"]',
  showPasswordButton: 'button[aria-label="Show password"]',
  rememberMeCheckbox: 'input[type="checkbox"]',
  loginButton: 'button:has-text("Entrar")',
  forgotPasswordLink: 'a:has-text("Recuperar contraseña")',
  registerButton: 'button:has-text("Regístrate ahora")',
  guestCheckoutButton: 'button:has-text("Continuar como invitado")',
  timer: '.checkout-timer, [class*="timer"]',
  activeStep: '.v-stepper-step--active, [class*="stepper"][class*="active"]',
} as const;
