# 🎨 Style Guide - Cinema Multi-Platform Test Automation Framework

Esta guía define las convenciones de código, estilo y mejores prácticas para mantener consistencia y calidad en todo el framework de automatización.

## 📋 Tabla de Contenidos

- [Principios Generales](#-principios-generales)
- [Convenciones de Naming](#-convenciones-de-naming)
- [Estructura por Capas](#-estructura-por-capas)
- [TypeScript Guidelines](#-typescript-guidelines)
- [Page Objects Pattern](#-page-objects-pattern)
- [Test Organization](#-test-organization)
- [Documentación (JSDoc)](#-documentación-jsdoc)
- [Logging y Debugging](#-logging-y-debugging)
- [Testing Best Practices](#-testing-best-practices)
- [Ejemplos del Repositorio](#-ejemplos-del-repositorio)

## 🎯 Principios Generales

### Claridad sobre Brevedad
```typescript
// ✅ Bueno: Claro y descriptivo
async function selectMovieAndProceedToSeatSelection(movieTitle: string): Promise<void>

// ❌ Malo: Muy breve, poco claro
async function selMov(title: string): Promise<void>
```

### Consistencia en Patrones
- **Mismo patrón** para componentes similares
- **Misma estructura** de archivos y directorios
- **Mismas convenciones** de naming a través del proyecto

### Mantenibilidad
- **Separación clara** de responsabilidades
- **Reutilización** de componentes comunes
- **Documentación** clara y actualizada

## 🏷️ Convenciones de Naming

### Archivos y Directorios

```
# ✅ Estructura de archivos correcta
pageObjectsManagers/
├── cinesa/
│   ├── navbar/
│   │   ├── navbar.page.ts          # Page Object principal
│   │   ├── navbar.selectors.ts     # Selectores CSS/XPath
│   │   └── navbar.types.ts         # Tipos específicos
│   └── movies/
│       ├── movies.page.ts
│       ├── movies.selectors.ts
│       └── movies.types.ts

tests/
├── cinesa/
│   ├── navbar/
│   │   ├── navbar.spec.ts          # Tests principales
│   │   ├── navbar.data.ts          # Datos de prueba
│   │   └── navbar.assertions.ts    # Aserciones específicas
```

### Convenciones de Nombres

| Tipo | Convención | Ejemplo | Descripción |
|------|------------|---------|-------------|
| **Clases** | PascalCase | `NavbarPage`, `MovieSelectors` | Componentes principales |
| **Métodos** | camelCase | `selectMovie()`, `verifyNavigation()` | Acciones y verificaciones |
| **Variables** | camelCase | `movieTitle`, `seatNumber` | Variables locales |
| **Constantes** | UPPER_SNAKE_CASE | `DEFAULT_TIMEOUT`, `BASE_URL` | Valores constantes |
| **Interfaces** | PascalCase + I | `IMovieData`, `INavbarSelectors` | Contratos de tipos |
| **Enums** | PascalCase | `TestEnvironment`, `CinemaChain` | Enumeraciones |
| **Archivos** | kebab-case | `navbar.page.ts`, `movie-selection.spec.ts` | Archivos del proyecto |
| **Directorios** | kebab-case | `seat-picker/`, `purchase-summary/` | Carpetas del proyecto |

### Naming Específico por Capa

#### Page Objects
```typescript
// ✅ Naming correcto para Page Objects
export class NavbarPage {
  // Métodos de acción
  async clickLogo(): Promise<void>
  async navigateToMovies(): Promise<void>
  async selectCinemaLocation(): Promise<void>
  
  // Métodos de verificación
  async verifyLogoIsVisible(): Promise<void>
  async verifyNavigationItems(): Promise<void>
  
  // Métodos de obtención de datos
  async getNavigationItemsText(): Promise<string[]>
  async getCurrentActiveSection(): Promise<string>
}
```

#### Test Cases
```typescript
// ✅ Naming descriptivo para tests
test.describe('Cinesa Navbar Navigation', () => {
  test('should display logo and navigate to home when clicked', async () => {
    // Test implementation
  });
  
  test('should highlight active navigation section', async () => {
    // Test implementation
  });
  
  test('should open mobile menu on small screens', async () => {
    // Test implementation
  });
});
```

## 🏗️ Estructura por Capas

### Arquitectura en Capas

```
📁 Test Layer (tests/)
    ├── *.spec.ts              # Test cases
    ├── *.data.ts              # Test data
    └── *.assertions.ts        # Custom assertions

📁 Page Object Layer (pageObjectsManagers/)
    ├── *.page.ts              # Page interactions
    ├── *.selectors.ts         # CSS/XPath selectors
    └── *.types.ts             # Type definitions

📁 Core Layer (core/)
    ├── webactions/            # Browser interactions
    ├── assertions/            # Reusable assertions
    ├── base/                  # Base classes
    └── types/                 # Global types

📁 Configuration Layer (config/)
    ├── environments.ts        # Environment configs
    └── urls.ts               # URL mappings

📁 Fixtures Layer (fixtures/)
    └── *.fixtures.ts         # Dependency injection
```

### Responsabilidades por Capa

#### Test Layer - `tests/`
- **Responsabilidad**: Orquestación de tests y validación de comportamiento
- **No debe**: Contener lógica de UI o selectores directos

```typescript
// ✅ Correcto: Test enfocado en comportamiento
test('should complete movie booking flow', async ({ 
  moviePage, 
  seatPage, 
  paymentPage 
}) => {
  await moviePage.selectMovie('Avengers: Endgame');
  await seatPage.selectSeats(2);
  await paymentPage.completePayment('credit-card');
  await expect(paymentPage.confirmationMessage).toBeVisible();
});

// ❌ Incorrecto: Test con lógica de UI
test('should complete booking', async ({ page }) => {
  await page.click('.movie-card[data-title="Avengers"]');
  await page.waitForSelector('.seat-map');
  // Mucha lógica de UI en el test
});
```

#### Page Object Layer - `pageObjectsManagers/`
- **Responsabilidad**: Abstracción de la UI y encapsulación de interacciones
- **No debe**: Contener lógica de testing o aserciones

```typescript
// ✅ Correcto: Page Object bien encapsulado
export class MoviePage {
  constructor(private page: Page) {}
  
  private selectors = {
    movieCard: '[data-testid="movie-card"]',
    movieTitle: '.movie-title',
    bookButton: '.book-now-button'
  };
  
  async selectMovie(title: string): Promise<void> {
    const movieCard = this.page
      .locator(this.selectors.movieCard)
      .filter({ hasText: title });
    await movieCard.click();
  }
}
```

#### Core Layer - `core/`
- **Responsabilidad**: Funcionalidades base reutilizables
- **No debe**: Contener lógica específica de plataforma

```typescript
// ✅ Correcto: WebAction genérica reutilizable
export class WebActions {
  async clickWithOverlayHandling(selector: string): Promise<void> {
    // Lógica genérica para manejar overlays
    await this.handleOverlays();
    await this.page.locator(selector).click();
  }
}
```

## 📝 TypeScript Guidelines

### Tipos Estrictos
```typescript
// ✅ Tipos explícitos y estrictos
interface MovieSelectors {
  readonly movieCard: string;
  readonly movieTitle: string;
  readonly bookButton: string;
}

interface MovieData {
  title: string;
  genre: string;
  duration: number;
  rating?: number;  // Opcional con ?
}

// ❌ Tipos débiles
const selectors: any = {
  movieCard: '[data-testid="movie"]'
};
```

### Interfaces vs Types
```typescript
// ✅ Interfaces para contratos extensibles
interface BasePageSelectors {
  header: string;
  footer: string;
}

interface NavbarSelectors extends BasePageSelectors {
  logo: string;
  menuItems: string;
}

// ✅ Types para uniones y computaciones
type Environment = 'production' | 'staging' | 'development';
type CinemaChain = 'cinesa' | 'uci';
type TestTag = '@smoke' | '@critical' | '@fast';
```

### Generics para Reutilización
```typescript
// ✅ Page Object genérico
abstract class BasePage<TSelectors> {
  constructor(
    protected page: Page,
    protected selectors: TSelectors
  ) {}
  
  abstract navigate(): Promise<void>;
}

class MoviePage extends BasePage<MovieSelectors> {
  async navigate(): Promise<void> {
    await this.page.goto('/movies');
  }
}
```

## 🎭 Page Objects Pattern

### Estructura Estándar
```typescript
// ✅ Estructura completa de Page Object
export class NavbarPage {
  // 1. Dependencias inyectadas
  constructor(private page: Page) {}
  
  // 2. Selectores privados y readonly
  private readonly selectors = {
    logo: '[data-testid="navbar-logo"]',
    menuItems: '.navbar-menu-item',
    loginButton: '[data-testid="login-button"]'
  } as const;
  
  // 3. Métodos de navegación
  async navigate(): Promise<void> {
    await this.page.goto('/');
  }
  
  // 4. Métodos de acción
  async clickLogo(): Promise<void> {
    await this.page.locator(this.selectors.logo).click();
  }
  
  async clickMenuItem(itemText: string): Promise<void> {
    await this.page
      .locator(this.selectors.menuItems)
      .filter({ hasText: itemText })
      .click();
  }
  
  // 5. Métodos de verificación
  async verifyLogoIsVisible(): Promise<void> {
    await expect(this.page.locator(this.selectors.logo)).toBeVisible();
  }
  
  // 6. Métodos de obtención de datos
  async getMenuItemsText(): Promise<string[]> {
    return await this.page.locator(this.selectors.menuItems).allTextContents();
  }
}
```

### Separación de Selectores
```typescript
// ✅ Selectores en archivo separado para componentes complejos
// navbar.selectors.ts
export const NavbarSelectors = {
  container: '[data-testid="navbar"]',
  logo: '[data-testid="navbar-logo"]',
  menuItems: {
    movies: '[data-nav="movies"]',
    cinemas: '[data-nav="cinemas"]',
    promotions: '[data-nav="promotions"]'
  },
  userActions: {
    login: '[data-testid="login-button"]',
    signup: '[data-testid="signup-button"]',
    profile: '[data-testid="user-profile"]'
  }
} as const;

// navbar.page.ts
import { NavbarSelectors } from './navbar.selectors';

export class NavbarPage {
  constructor(private page: Page) {}
  
  async clickMoviesSection(): Promise<void> {
    await this.page.locator(NavbarSelectors.menuItems.movies).click();
  }
}
```

## 🧪 Test Organization

### Estructura de Test Suites
```typescript
// ✅ Organización clara de test suites
test.describe('Cinesa Navbar Component', () => {
  test.beforeEach(async ({ page, navbarPage }) => {
    await navbarPage.navigate();
  });
  
  test.describe('Visual Elements', () => {
    test('should display logo correctly', async ({ navbarPage }) => {
      await navbarPage.verifyLogoIsVisible();
    });
    
    test('should display all navigation items', async ({ navbarPage }) => {
      await navbarPage.verifyAllNavigationItemsVisible();
    });
  });
  
  test.describe('Navigation Functionality', () => {
    test('should navigate to movies section', async ({ navbarPage, moviePage }) => {
      await navbarPage.clickMoviesSection();
      await moviePage.verifyPageLoaded();
    });
  });
  
  test.describe('Responsive Behavior', () => {
    test('should show mobile menu on small screens', async ({ page, navbarPage }) => {
      await page.setViewportSize({ width: 480, height: 800 });
      await navbarPage.verifyMobileMenuVisible();
    });
  });
});
```

### Test Data Management
```typescript
// ✅ Datos de test organizados y tipados
// navbar.data.ts
export const NavbarTestData = {
  navigationItems: [
    { name: 'Películas', url: '/movies', testId: 'nav-movies' },
    { name: 'Cines', url: '/cinemas', testId: 'nav-cinemas' },
    { name: 'Promociones', url: '/promotions', testId: 'nav-promotions' }
  ],
  
  userActions: {
    login: { text: 'Iniciar Sesión', testId: 'login-button' },
    signup: { text: 'Registrarse', testId: 'signup-button' }
  },
  
  expectedUrls: {
    home: 'https://www.cinesa.es/',
    movies: 'https://www.cinesa.es/cartelera',
    cinemas: 'https://www.cinesa.es/cines'
  }
} as const;

// Uso en tests
test('should navigate to all main sections', async ({ navbarPage }) => {
  for (const item of NavbarTestData.navigationItems) {
    await navbarPage.clickNavigationItem(item.name);
    await expect(page).toHaveURL(item.url);
    await navbarPage.navigate(); // Volver a home
  }
});
```

## 📚 Documentación (JSDoc)

### Documentación de Page Objects
```typescript
/**
 * Manages interactions with the Cinesa navbar component.
 * Handles navigation, user actions, and responsive behavior.
 * 
 * @example
 * ```typescript
 * const navbar = new NavbarPage(page);
 * await navbar.navigate();
 * await navbar.clickMoviesSection();
 * ```
 * 
 * @since 1.0.0
 * @author Cinema Automation Team
 */
export class NavbarPage {
  /**
   * Creates a new NavbarPage instance.
   * 
   * @param page - Playwright Page object for browser interactions
   */
  constructor(private page: Page) {}
  
  /**
   * Navigates to a specific section using the navbar.
   * 
   * @param sectionName - Name of the section to navigate to
   * @throws {Error} When section is not found or navigation fails
   * 
   * @example
   * ```typescript
   * await navbar.navigateToSection('Películas');
   * ```
   */
  async navigateToSection(sectionName: string): Promise<void> {
    // Implementation
  }
}
```

### Documentación de Test Cases
```typescript
/**
 * @suite Cinesa Navbar Navigation
 * @description Tests for navbar component functionality across different scenarios
 * @owner @fcabanilla
 * @priority high
 * @tags @smoke @navigation @critical
 */
test.describe('Cinesa Navbar Navigation', () => {
  /**
   * @test Logo Navigation
   * @description Verifies that clicking the logo returns user to home page
   * @severity critical
   * @story Navigate to home via logo
   */
  test('should navigate to home when logo is clicked', async ({ navbarPage }) => {
    // Test implementation
  });
});
```

## 🔍 Logging y Debugging

### Logging Levels
```typescript
// ✅ Logging estructurado con niveles
export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN', 
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

export class Logger {
  static info(message: string, context?: any): void {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, context || '');
  }
  
  static error(message: string, error?: Error): void {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || '');
  }
  
  static debug(message: string, data?: any): void {
    if (process.env.DEBUG) {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, data || '');
    }
  }
}

// Uso en Page Objects
export class MoviePage {
  async selectMovie(title: string): Promise<void> {
    Logger.info(`Selecting movie: ${title}`);
    
    try {
      await this.page.locator(this.selectors.movieCard)
        .filter({ hasText: title })
        .click();
      
      Logger.info(`Successfully selected movie: ${title}`);
    } catch (error) {
      Logger.error(`Failed to select movie: ${title}`, error as Error);
      throw error;
    }
  }
}
```

### Debug Helpers
```typescript
// ✅ Helpers para debugging
export class DebugHelpers {
  static async takeScreenshot(page: Page, name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ 
      path: `debug-screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }
  
  static async logPageInfo(page: Page): Promise<void> {
    const title = await page.title();
    const url = page.url();
    Logger.debug('Page Information', { title, url });
  }
  
  static async waitWithLog(page: Page, selector: string, timeout = 30000): Promise<void> {
    Logger.debug(`Waiting for element: ${selector}`);
    await page.locator(selector).waitFor({ timeout });
    Logger.debug(`Element found: ${selector}`);
  }
}
```

## 🧪 Testing Best Practices

### Pirámide de Testing
```typescript
// ✅ Unit Tests - Tests rápidos y específicos
test.describe('MoviePage Unit Tests', () => {
  test('should format movie duration correctly', () => {
    const moviePage = new MoviePage(mockPage);
    expect(moviePage.formatDuration(120)).toBe('2h 0m');
  });
});

// ✅ Integration Tests - Interacciones entre componentes
test.describe('Movie Selection Integration', () => {
  test('should select movie and proceed to seat selection', async ({ 
    moviePage, 
    seatPage 
  }) => {
    await moviePage.selectMovie('Avengers');
    await seatPage.verifyPageLoaded();
  });
});

// ✅ E2E Tests - Flujos completos de usuario
test.describe('Complete Booking Flow', () => {
  test('should complete full booking journey', async ({ 
    moviePage, 
    seatPage, 
    paymentPage,
    confirmationPage 
  }) => {
    await moviePage.selectMovie('Avengers');
    await seatPage.selectSeats(2);
    await paymentPage.completePayment();
    await confirmationPage.verifyBookingSuccess();
  });
});
```

### Test Fixtures y Setup
```typescript
// ✅ Fixtures bien organizados
// cinesa.fixtures.ts
export const test = base.extend<{
  navbarPage: NavbarPage;
  moviePage: MoviePage;
  seatPage: SeatPage;
  testData: TestDataManager;
}>({
  navbarPage: async ({ page }, use) => {
    const navbarPage = new NavbarPage(page);
    await use(navbarPage);
  },
  
  moviePage: async ({ page }, use) => {
    const moviePage = new MoviePage(page);
    await use(moviePage);
  },
  
  testData: async ({}, use) => {
    const testData = new TestDataManager();
    await testData.initialize();
    await use(testData);
    await testData.cleanup();
  }
});
```

### Cobertura y Métricas
```typescript
// ✅ Tests con métricas y etiquetas
test('should load movie page within performance threshold', async ({ 
  page, 
  moviePage 
}) => {
  const startTime = performance.now();
  
  await moviePage.navigate();
  await moviePage.waitForMoviesLoaded();
  
  const loadTime = performance.now() - startTime;
  
  // Performance assertion
  expect(loadTime).toBeLessThan(3000); // 3 segundos
  
  // Allure reporting
  await allure.attachment('Load Time', `${loadTime}ms`, 'text/plain');
});
```

## 🎨 Ejemplos del Repositorio

### Ejemplo 1: Page Object Bien Estructurado
```typescript
// Extraído de: pageObjectsManagers/cinesa/navbar/navbar.page.ts
export class NavbarPage {
  constructor(private page: Page) {}

  private readonly selectors = {
    logo: '[data-testid="cinesa-logo"]',
    menuItems: '.navbar-menu .menu-item',
    loginButton: '.user-actions .login-btn'
  } as const;

  async navigate(): Promise<void> {
    await this.page.goto('/');
  }

  async clickLogo(): Promise<void> {
    await this.page.locator(this.selectors.logo).click();
  }

  async verifyLogoIsVisible(): Promise<void> {
    await expect(this.page.locator(this.selectors.logo)).toBeVisible();
  }

  async getMenuItemsText(): Promise<string[]> {
    return await this.page.locator(this.selectors.menuItems).allTextContents();
  }
}
```

### Ejemplo 2: Test Case Bien Documentado
```typescript
// Extraído de: tests/cinesa/navbar/navbar.spec.ts
import { test, expect } from '../../fixtures/cinesa/playwright.fixtures';

test.describe('Cinesa Navbar Component', () => {
  test.beforeEach(async ({ navbarPage }) => {
    await navbarPage.navigate();
  });

  test('should display logo and navigate to home when clicked', async ({ 
    page, 
    navbarPage 
  }) => {
    // Verificar que el logo está visible
    await navbarPage.verifyLogoIsVisible();
    
    // Hacer click en el logo
    await navbarPage.clickLogo();
    
    // Verificar navegación a home
    await expect(page).toHaveURL('https://www.cinesa.es/');
  });
});
```

### Ejemplo 3: WebActions Genéricas
```typescript
// Extraído de: core/webactions/webActions.ts
export class WebActions {
  constructor(private page: Page) {}

  async clickWithOverlayHandling(selector: string): Promise<void> {
    // Esperar que el elemento sea visible
    await this.page.locator(selector).waitFor({ state: 'visible' });

    // Manejar overlays comunes
    const overlays = ['.modal-backdrop', '.overlay', '[role="dialog"]'];
    for (const overlay of overlays) {
      try {
        const overlayElement = this.page.locator(overlay).first();
        if (await overlayElement.isVisible({ timeout: 1000 })) {
          await overlayElement.click({ timeout: 2000 });
          await this.page.waitForTimeout(1000);
        }
      } catch {
        // Continuar si el overlay no existe
      }
    }

    // Hacer click con force como fallback
    await this.page.locator(selector).click({ force: true });
  }
}
```

### Ejemplo 4: Configuración de Entornos
```typescript
// Extraído de: config/environments.ts
export const cinesaEnvironments = {
  production: {
    baseUrl: 'https://www.cinesa.es',
    timeouts: {
      pageLoad: 30000,
      element: 10000,
      modal: 15000,
    },
    features: {
      analytics: true,
      promotionalModals: true,
      cookieBanners: true,
    },
  },
  staging: {
    baseUrl: 'https://staging.cinesa.es',
    timeouts: {
      pageLoad: 30000,
      element: 10000,
      modal: 15000,
    },
    features: {
      analytics: false,
      promotionalModals: true,
      cookieBanners: true,
    },
  }
} as const satisfies Record<string, EnvironmentConfig>;
```

## ✅ Checklist de Revisión

### Para Page Objects
- [ ] Métodos descriptivos y bien documentados
- [ ] Selectores privados y constants
- [ ] Separación clara entre acciones y verificaciones
- [ ] Manejo de errores apropiado
- [ ] TypeScript strict mode compliance

### Para Test Cases
- [ ] Nombres descriptivos que explican el comportamiento
- [ ] Uso correcto de fixtures
- [ ] Datos de test externalizados
- [ ] Aserciones claras y específicas
- [ ] Tags apropiados para categorización

### Para Código General
- [ ] Linting rules pasando sin warnings
- [ ] JSDoc para métodos públicos
- [ ] Tipos TypeScript explícitos
- [ ] Convenciones de naming seguidas
- [ ] No código duplicado

### Para Arquitectura
- [ ] Responsabilidades claras por capa
- [ ] Bajo acoplamiento entre componentes
- [ ] Alta cohesión dentro de módulos
- [ ] Principios SOLID aplicados
- [ ] Patrones de diseño consistentes

---

**Última actualización**: 2 de octubre de 2025  
**Versión**: 1.0.0  
**Mantenido por**: @fcabanilla