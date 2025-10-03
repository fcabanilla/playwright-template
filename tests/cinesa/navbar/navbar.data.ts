import { NavbarSelectors } from '../../../pageObjectsManagers/cinesa/navbar/navbar.selectors';
import { getCinesaConfig, CinesaEnvironment } from '../../../config/environments';

// Interfaz para representar un elemento de navegación y su URL esperada
export interface NavItem {
  selectorKey: keyof NavbarSelectors;
  expectedUrl: string;
}

// Get the current environment configuration
const env = process.env.TEST_ENV as CinesaEnvironment || 'production';
const config = getCinesaConfig(env);
const cleanBaseUrl = config.baseUrl.endsWith('/') ? config.baseUrl.slice(0, -1) : config.baseUrl;

// URL base del sitio (dinámica según el entorno)
export const baseUrl = cleanBaseUrl;

// Elementos de navegación interna (URLs dinámicas según el entorno)
export const internalNavItems: NavItem[] = [
  { selectorKey: 'cines', expectedUrl: `${cleanBaseUrl}/cines/` },
  { selectorKey: 'peliculas', expectedUrl: `${cleanBaseUrl}/peliculas/` },
  { selectorKey: 'promociones', expectedUrl: `${cleanBaseUrl}/promociones/` },
  { selectorKey: 'experiencias', expectedUrl: `${cleanBaseUrl}/experiencias/` },
  { selectorKey: 'programas', expectedUrl: `${cleanBaseUrl}/programas/` },
];

// Elemento de navegación externa
export const externalNavItem: NavItem = {
  selectorKey: 'bonos',
  expectedUrl: 'https://www.cinesabusiness.es/promociones.html',
};
