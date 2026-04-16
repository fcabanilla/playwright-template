# ADR-0014: Persistencia de Consentimiento de Cookies con storageState y Consent Seeds

**Status:** Accepted  
**Date:** 2025-11-11  
**Authors:** @fcabanilla  
**Reviewers:** @cinema-qa-team

---

## Context

Los tests E2E muestran banners de cookies en la primera visita por sesión/contexto. Repetir "Aceptar" degrada el tiempo total de suite, introduce flakiness por animaciones/i18n y agrega ruido a los reportes.

### Observaciones Actuales

1. **Overhead de tiempo:** Cada test ejecuta `cookieBanner.acceptAllCookies()` que toma **3s (detección) + 5s (desaparición banner) + 10s (desaparición overlay) = ~18s** por ejecución
2. **Flakiness:** Animaciones de OneTrust, variantes A/B de modales, cambios de i18n causan timeouts intermitentes
3. **Ruido en reportes:** Categoría "Cookie Banner Handling" representa ~8% de fallos en producción (ver `.allure/categories.json`)

### Arquitectura Existente (Favorable)

El proyecto ya promueve manejo de estado de sesión y separación de capas:

- **Fixtures con DI:** `fixtures/cinesa/playwright.fixtures.ts` inyecta dependencias automáticamente
- **Page Objects sin acceso directo a `page`:** Solo vía `WebActions` (ver `docs/adrs/0009-page-object-architecture-rules.md`)
- **Multi-entorno:** `TEST_ENV` + `config/environments.ts` para preprod/lab/production
- **Session state:** Ya existe patrón con `storageState` para autenticación (ver `config/projects/storageState.helper.ts`)

Esto habilita una solución estandarizada para sembrar el consentimiento **una sola vez** y reutilizarlo.

---

## Forces at Play

### Performance

- Eliminar ~18s × N tests de overhead de interacción con banners
- Suite completa (269 tests) podría ahorrar **~81 minutos** (269 tests × 18s ÷ 60)

### Confiabilidad

- Reducir flakiness por animaciones, A/B testing, cambios de i18n de OneTrust
- Evitar race conditions con overlays dinámicos

### Escalabilidad

- Soportar múltiples hosts por región/entorno (www.cinesa.es, www.ucicinemas.it, etc.)
- Adaptarse a rotación de cookies cuando CMP cambia versión

### Mantenibilidad

- Respetar capas arquitectónicas (POs sin `page`, WebActions único punto de acceso)
- Compatibilidad con fixture system y multi-entorno existente

---

## Decision

**Adoptar estrategia híbrida de persistencia de consentimiento:**

### Mecanismos Complementarios

#### 1. storageState por Host/Entorno (Golden Consent State)

Generar **una vez** (por entorno/host) archivos `state/consented.<env>.<region>.json` que capturen cookies/localStorage tras aceptar banner:

```typescript
// Ejemplo de estructura generada
{
  "cookies": [
    {
      "name": "OptanonConsent",
      "value": "groups=C0001:1,C0002:1,C0003:1...",
      "domain": ".cinesa.es",
      "path": "/",
      "expires": 1735689600,
      "httpOnly": false,
      "secure": true,
      "sameSite": "Lax"
    }
  ],
  "origins": [
    {
      "origin": "https://www.cinesa.es",
      "localStorage": [
        { "name": "OptanonAlertBoxClosed", "value": "2024-11-11T10:00:00.000Z" }
      ]
    }
  ]
}
```

**API Utilizada:** [`browserContext.storageState({ path })`](https://playwright.dev/docs/api/class-browsercontext#browser-context-storage-state)

#### 2. Consent Seeds (Pre-siembra de Cookies)

Para hosts adicionales del mismo entorno (subdominios, CDNs, cross-site flows), inyectar cookies mínimas **antes de `page.goto()`**:

```typescript
// core/consent/consentSeeds.ts
export const consentSeeds: Record<string, Cookie[]> = {
  'www.cinesa.es': [
    {
      name: 'OptanonConsent',
      value: 'groups=C0001:1,C0002:1,C0003:1,C0004:1&datestamp=...',
      domain: '.cinesa.es',
      path: '/',
      expires: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, // 1 año
      httpOnly: false,
      secure: true,
      sameSite: 'Lax',
    },
  ],
  'www.ucicinemas.it': [
    {
      name: 'OptanonConsent',
      value: 'groups=C0001:1,C0002:1,C0003:1,C0004:1&datestamp=...',
      domain: '.ucicinemas.it',
      path: '/',
      expires: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
      httpOnly: false,
      secure: true,
      sameSite: 'Lax',
    },
  ],
};
```

**API Utilizada:** [`page.context().addCookies(cookies)`](https://playwright.dev/docs/api/class-browsercontext#browser-context-add-cookies)

#### 3. Fallback Controlado

Mantener `CookieBannerPage.acceptIfPresent()` idempotente para:

- Casos no cubiertos por seeds/storageState (nuevo entorno, host desconocido)
- Cuando CMP cambia versión y nombres/valores de cookies cambian
- **NO** ejecutarlo por defecto en `beforeEach` global

---

## Chosen Option

**"Hybrid Persisted Consent":** storageState primario por host/entorno + seeds de cookies para hosts secundarios.

### Justificación

| Criterio                        | Solo storageState                | Solo Consent Seeds                  | **Híbrido (Elegido)**             |
| ------------------------------- | -------------------------------- | ----------------------------------- | --------------------------------- |
| **Tiempo de setup inicial**     | Alto (generar por entorno)       | Bajo (cookies hardcodeadas)         | Alto (una vez por entorno)        |
| **Velocidad de ejecución**      | Muy rápida (0s overhead)         | Ultra-rápida (0s overhead)          | Muy rápida (0s overhead)          |
| **Soporte multi-host**          | Frágil (1 storageState = 1 host) | Excelente (mapeo flexible)          | Excelente (combinación)           |
| **Mantenimiento CMP**           | Medio (regenerar state)          | Alto (actualizar mapas manualmente) | Medio (regenerar + ajustar seeds) |
| **Resiliencia**                 | Media (sin fallback UI)          | Baja (sin fallback UI)              | **Alta (fallback UI opcional)**   |
| **Compatibilidad arquitectura** | Alta (ya existe patrón)          | Media (nuevo patrón)                | **Alta (extiende existente)**     |

**Decisión:** El híbrido minimiza interacciones UI, mantiene el flujo en capas (fixtures/WebActions) y escala a múltiples regiones sin duplicar lógica.

---

## Considered Alternatives

### A) Click de aceptación en cada `beforeEach`

**Rechazado por:**

- ❌ Lento: ~18s × N tests = ~81min overhead total
- ❌ Flaky: Dependiente de UI, animaciones, A/B tests
- ❌ Ruido en reportes: Categoría "Cookie Banner Handling" con 8% de fallos

### B) Solo storageState único por entorno

**Rechazado por:**

- ❌ Frágil: No cubre múltiples hosts en mismo flujo (e.g., www.cinesa.es + cdn.cinesa.es)
- ❌ Cross-origin iframes: OneTrust puede cargar desde diferente dominio

### C) Solo "Consent Seeds"

**Rechazado por:**

- ❌ Alto mantenimiento: Rotación manual cuando CMP cambia versión
- ❌ Sin red de seguridad: Si seeds desactualizados, banner aparece sin fallback

---

## Consequences

### Positive

✅ **Reducción del tiempo de suite:** Eliminar ~81min de overhead (18s × 269 tests)  
✅ **Menos flakiness:** Evitar race conditions con animaciones de OneTrust  
✅ **Encaja con arquitectura:** Extiende patrón existente de fixtures, WebActions y config por entorno  
✅ **Escalabilidad multi-región:** Cinesa (ES), UCI (IT), con seeds adaptados

### Negative

⚠️ **Gestión de versiones:** state/ por entorno/host requiere control de versiones  
⚠️ **Mantenimiento:** `ConsentSeedRegistry` requiere actualizaciones cuando CMP cambia cookies  
⚠️ **CI/CD caching:** Complejidad añadida para cachear `state/` con key apropiada

### Neutral

ℹ️ **Setup inicial:** Script de bootstrap para "grabar" consentimiento  
ℹ️ **Fallback permanece:** `CookieBannerPage.acceptIfPresent()` sigue disponible

---

## Implementation

### Implementation Plan

#### 1. Estados Base por Entorno/Host (Playwright Setup Test)

**Implementado en `tests/setup/auth.setup.ts`:**

Este archivo se ejecuta automáticamente como proyecto de setup antes de los tests principales.
Ver implementación completa en el archivo fuente para detalles.

```typescript
import { chromium, BrowserContext } from '@playwright/test';
import { CookieBannerPage } from '../pageObjectsManagers/cinesa/cookies/cookieBanner.page';
import { WebActions } from '../core/webactions/webActions';
import { getCinesaConfig, getUCIConfig } from '../config/environments';
import * as fs from 'fs';
import * as path from 'path';

interface ConsentConfig {
  platform: 'cinesa' | 'uci';
  env: 'production' | 'lab' | 'preprod';
  baseUrl: string;
  outputPath: string;
}

const CONSENT_CONFIGS: ConsentConfig[] = [
  {
    platform: 'cinesa',
    env: 'production',
    baseUrl: getCinesaConfig('production').baseUrl,
    outputPath: 'state/consented.production.es.json',
  },
  {
    platform: 'cinesa',
    env: 'preprod',
    baseUrl: getCinesaConfig('preprod').baseUrl,
    outputPath: 'state/consented.preprod.es.json',
  },
  {
    platform: 'uci',
    env: 'production',
    baseUrl: getUCIConfig('production').baseUrl,
    outputPath: 'state/consented.production.it.json',
  },
];

async function bootstrapConsent(config: ConsentConfig): Promise<void> {
  console.log(
    `📝 Bootstrapping consent for ${config.platform}/${config.env}...`
  );

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  const webActions = new WebActions(page);
  const cookieBanner = new CookieBannerPage(webActions);

  try {
    // Navigate to base URL
    await page.goto(config.baseUrl);

    // Accept cookies using existing Page Object
    await cookieBanner.acceptAllCookies();

    // Wait for consent SDK to finalize (OneTrust specific)
    await page.waitForTimeout(2000);

    // Save storageState
    const stateDir = path.dirname(config.outputPath);
    if (!fs.existsSync(stateDir)) {
      fs.mkdirSync(stateDir, { recursive: true });
    }

    await context.storageState({ path: config.outputPath });

    console.log(`✅ Saved consent state to ${config.outputPath}`);

    // Log cookies for manual seed extraction
    const cookies = await context.cookies();
    const relevantCookies = cookies.filter(
      (c) => c.name.includes('Optanon') || c.name.includes('consent')
    );
    console.log(`📋 Relevant cookies (${relevantCookies.length}):`);
    relevantCookies.forEach((c) =>
      console.log(`  - ${c.name}: ${c.value.substring(0, 50)}...`)
    );
  } catch (error) {
    console.error(
      `❌ Failed to bootstrap ${config.platform}/${config.env}:`,
      error
    );
    throw error;
  } finally {
    await browser.close();
  }
}

async function main() {
  for (const config of CONSENT_CONFIGS) {
    await bootstrapConsent(config);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Cool-down
  }
  console.log('✅ All consent states bootstrapped successfully!');
}

main().catch(console.error);
```

**Ejecutar setup automáticamente:**

```bash
# Se ejecuta automáticamente antes de los tests vía project dependencies
npx playwright test

# O manualmente solo el setup:
npx playwright test --project=setup
```

#### 2. ConsentSeedRegistry

**Crear `core/consent/consentSeeds.ts`:**

```typescript
/**
 * Consent Seeds Registry
 *
 * Maps hostname → cookies for OneTrust consent pre-seeding.
 * Extracted from bootstrapped storageState files.
 *
 * @see docs/adrs/0014-cookie-consent-persistence-with-storage-state.md
 */

export interface ConsentCookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number; // Unix timestamp in seconds
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'Strict' | 'Lax' | 'None';
}

export const consentSeeds: Record<string, ConsentCookie[]> = {
  // Cinesa Spain (Production)
  'www.cinesa.es': [
    {
      name: 'OptanonConsent',
      value:
        'groups=C0001:1,C0002:1,C0003:1,C0004:1&datestamp=Sun+Nov+10+2024+10:00:00+GMT+0100+(Central+European+Standard+Time)&version=6.33.0&isIABGlobal=false&hosts=&consentId=...&interactionCount=1&landingPath=NotLandingPage&AwaitingReconsent=false',
      domain: '.cinesa.es',
      path: '/',
      expires: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
      httpOnly: false,
      secure: true,
      sameSite: 'Lax',
    },
    {
      name: 'OptanonAlertBoxClosed',
      value: new Date().toISOString(),
      domain: '.cinesa.es',
      path: '/',
      expires: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
      httpOnly: false,
      secure: true,
      sameSite: 'Lax',
    },
  ],

  // UCI Cinemas Italy (Production)
  'www.ucicinemas.it': [
    {
      name: 'OptanonConsent',
      value:
        'groups=C0001:1,C0002:1,C0003:1,C0004:1&datestamp=Sun+Nov+10+2024+10:00:00+GMT+0100+(Central+European+Standard+Time)&version=6.33.0&isIABGlobal=false&hosts=&consentId=...&interactionCount=1&landingPath=NotLandingPage&AwaitingReconsent=false',
      domain: '.ucicinemas.it',
      path: '/',
      expires: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
      httpOnly: false,
      secure: true,
      sameSite: 'Lax',
    },
    {
      name: 'OptanonAlertBoxClosed',
      value: new Date().toISOString(),
      domain: '.ucicinemas.it',
      path: '/',
      expires: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
      httpOnly: false,
      secure: true,
      sameSite: 'Lax',
    },
  ],
};

/**
 * Get consent cookies for a given URL
 *
 * @param url - Full URL or hostname
 * @returns Consent cookies array, or undefined if no seeds for this host
 */
export function getConsentSeedsFor(url: string): ConsentCookie[] | undefined {
  try {
    const hostname = new URL(url).hostname;
    return consentSeeds[hostname];
  } catch {
    // If URL parsing fails, assume it's already a hostname
    return consentSeeds[url];
  }
}
```

#### 3. Nueva WebAction: `applyConsentSeedsFor()`

**Actualizar `core/webactions/webActions.ts`:**

````typescript
import { allure } from 'allure-playwright';
import { getConsentSeedsFor, ConsentCookie } from '../consent/consentSeeds';

export class WebActions {
  // ... existing code ...

  /**
   * Apply consent cookies for a given URL before navigation.
   * Uses ConsentSeedRegistry to inject OneTrust consent cookies.
   *
   * @param {string} url - Target URL to apply consent cookies for
   * @param {string} stepMessage - Optional custom message for Allure report step
   * @returns {Promise<void>} Resolves when cookies are applied (or skipped if no seeds)
   *
   * @throws {Error} When cookie injection fails
   *
   * @example
   * ```typescript
   * // Before navigation
   * await webActions.applyConsentSeedsFor('https://www.cinesa.es');
   * await webActions.navigateTo('https://www.cinesa.es');
   * ```
   *
   * @since 1.0.0
   * @see docs/adrs/0014-cookie-consent-persistence-with-storage-state.md
   */
  async applyConsentSeedsFor(url: string, stepMessage?: string): Promise<void> {
    const message = stepMessage || `Apply consent seeds for ${url}`;

    await allure.step(message, async () => {
      const seeds = getConsentSeedsFor(url);

      if (!seeds || seeds.length === 0) {
        await allure.parameter('Status', 'No seeds found for this host');
        return;
      }

      await allure.parameter('Seeds Count', seeds.length.toString());
      await allure.parameter('Host', new URL(url).hostname);

      try {
        // Convert our ConsentCookie format to Playwright's Cookie format
        const playwrightCookies = seeds.map((seed: ConsentCookie) => ({
          name: seed.name,
          value: seed.value,
          domain: seed.domain,
          path: seed.path,
          expires: seed.expires,
          httpOnly: seed.httpOnly,
          secure: seed.secure,
          sameSite: seed.sameSite,
        }));

        // Inject cookies via BrowserContext API
        await this.page.context().addCookies(playwrightCookies);

        await allure.parameter('Status', 'Seeds applied successfully');
      } catch (error) {
        await allure.parameter('Status', 'Failed to apply seeds');
        throw new Error(`Failed to apply consent seeds: ${error}`);
      }
    });
  }

  /**
   * Navigate to URL with automatic consent seed application.
   * Wraps navigateTo() with consent pre-seeding logic.
   *
   * @param {string} url - The target URL to navigate to
   * @param {string} stepMessage - Optional custom message for Allure report step
   * @returns {Promise<void>} Resolves when navigation is complete
   *
   * @example
   * ```typescript
   * // Automatically applies consent seeds if available for host
   * await webActions.navigateToWithConsent('https://www.cinesa.es/peliculas');
   * ```
   *
   * @since 1.0.0
   */
  async navigateToWithConsent(
    url: string,
    stepMessage?: string
  ): Promise<void> {
    await this.applyConsentSeedsFor(url);
    await this.navigateTo(url, stepMessage);
  }
}
````

#### 4. Configurar `playwright.config.ts` con storageState

**Actualizar `playwright.config.ts`:**

```typescript
import { defineConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const env = (process.env.TEST_ENV || 'production') as string;
const region = env.includes('it') ? 'it' : 'es'; // Simplificación

// Determinar storageState path dinámicamente
function getStorageStatePath(env: string, region: string): string | undefined {
  const statePath = path.resolve(
    __dirname,
    `state/consented.${env}.${region}.json`
  );
  if (fs.existsSync(statePath)) {
    console.log(`✅ Using consent storageState: ${statePath}`);
    return statePath;
  } else {
    console.warn(
      `⚠️  No storageState found at ${statePath}, will use consent seeds fallback`
    );
    return undefined;
  }
}

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'https://www.cinesa.es',

    // Apply storageState if available
    storageState: getStorageStatePath(env, region),

    // ... otras opciones
  },

  projects: [
    {
      name: 'Cinesa (Production with Consent)',
      use: {
        storageState: getStorageStatePath('production', 'es'),
      },
    },
    {
      name: 'Cinesa (Preprod with Consent)',
      use: {
        storageState: getStorageStatePath('preprod', 'es'),
      },
    },
    {
      name: 'UCI (Production with Consent)',
      use: {
        storageState: getStorageStatePath('production', 'it'),
      },
    },
  ],
});
```

#### 5. Fixture de Sesión

**Actualizar `fixtures/cinesa/playwright.fixtures.ts`:**

```typescript
import { test as base } from '@playwright/test';
import { WebActions } from '../../core/webactions/webActions';
import { CookieBannerPage } from '../../pageObjectsManagers/cinesa/cookies/cookieBanner.page';

type CustomFixtures = {
  webActions: WebActions;
  cookieBanner: CookieBannerPage;
  // ... otros fixtures
};

export const test = base.extend<CustomFixtures>({
  webActions: async ({ page }, use) => {
    const webActions = new WebActions(page);

    // Aplicar consent seeds si NO hay storageState configurado
    if (!page.context()['_options'].storageState) {
      const baseUrl = process.env.BASE_URL || 'https://www.cinesa.es';
      await webActions.applyConsentSeedsFor(baseUrl);
    }

    await use(webActions);
  },

  cookieBanner: async ({ webActions }, use) => {
    // cookieBanner está disponible pero NO se ejecuta automáticamente
    // Solo para tests específicos de consentimiento
    await use(new CookieBannerPage(webActions));
  },
});
```

#### 6. CI/CD & Caching

**Añadir a `.github/workflows/playwright.yml` (si existe):**

```yaml
- name: Cache Consent States
  uses: actions/cache@v3
  with:
    path: state/
    key: consent-states-${{ hashFiles('tests/setup/auth.setup.ts') }}-${{ env.CMP_VERSION }}
    restore-keys: |
      consent-states-${{ hashFiles('tests/setup/auth.setup.ts') }}-
      consent-states-

- name: Run Setup Tests (generates consent if cache miss)
  run: npx playwright test --project=setup
```

#### 7. Fallback Controlado

**Flag para forzar UI flow:**

```bash
# Variable de entorno para debug/troubleshooting
FORCE_ACCEPT_COOKIES=true npm test
```

**Actualizar `CookieBannerPage`:**

```typescript
export class CookieBannerPage {
  /**
   * Accept cookies IF banner is present (idempotent fallback).
   * Only executes if FORCE_ACCEPT_COOKIES=true OR banner detected.
   */
  async acceptIfPresent(): Promise<void> {
    if (process.env.FORCE_ACCEPT_COOKIES === 'true') {
      await this.acceptAllCookies();
      return;
    }

    const bannerVisible = await this.webActions
      .isVisible(this.selectors.banner, { timeout: 2000 })
      .catch(() => false);

    if (bannerVisible) {
      await this.acceptAllCookies();
    }
  }
}
```

---

## Success Criteria

### Quantitative Metrics

| Metric                             | Baseline (Before)              | Target (After)                      | Measurement Method       |
| ---------------------------------- | ------------------------------ | ----------------------------------- | ------------------------ |
| **Tiempo de suite completo**       | ~120min (269 tests × ~27s avg) | **~40min** (269 tests × ~9s avg)    | CI/CD pipeline duration  |
| **Overhead de cookies por test**   | ~18s (3s + 5s + 10s)           | **≤1s** (seeds injection)           | Individual test timing   |
| **Flakiness rate (Cookie Banner)** | ~8% (22/269 tests)             | **<2%** (5/269 tests)               | Allure Categories report |
| **Tests sin interacción UI**       | 0% (269/269 aceptan cookies)   | **≥95%** (256/269 usan seeds/state) | Código + Allure steps    |

### Qualitative Validations

✅ **Cero interacciones UI durante 2 semanas consecutivas** (solo semanas de estabilidad, no regressions masivas)  
✅ **Seeds funcionan en 3+ entornos** (production, preprod, lab)  
✅ **Fixture system integrado** sin cambios en tests existentes  
✅ **Fallback UI ejecutable** con flag `FORCE_ACCEPT_COOKIES=true`

---

## Rollback Plan

### Fase 1: Deshabilitación Temporal (Immediate)

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    storageState:
      process.env.USE_CONSENT_STATES === 'false'
        ? undefined
        : getStorageStatePath(env, region),
  },
});
```

```bash
# Deshabilitar estados de consentimiento
USE_CONSENT_STATES=false npm test
```

### Fase 2: Reactivación de beforeEach (1 día)

```typescript
// fixtures/cinesa/playwright.fixtures.ts
test.beforeEach(async ({ cookieBanner }) => {
  if (process.env.USE_CONSENT_STATES === 'false') {
    await cookieBanner.acceptIfPresent();
  }
});
```

### Fase 3: Limpieza de state/ (1 semana)

```bash
rm -rf state/
git restore config/projects/storageState.helper.ts
```

---

## Notes

### Related Links

- [ADR Template](_template.md) - Template usado para esta decisión
- [Session State Management](../../SESSION_STATE_MANAGEMENT.md) - Base para storageState
- [Multi-Environment Config](../../config/environments.ts) - TEST_ENV, baseUrl
- [Fixture System](../../fixtures/cinesa/playwright.fixtures.ts) - Punto de extensión para seeds/estado
- [Page Object Architecture Rules](0009-page-object-architecture-rules.md) - No `page` en POs
- [Playwright BrowserContext.addCookies()](https://playwright.dev/docs/api/class-browsercontext#browser-context-add-cookies) - API oficial de cookies
- [Playwright BrowserContext.storageState()](https://playwright.dev/docs/api/class-browsercontext#browser-context-storage-state) - API oficial de storageState

### Update

- **Last review:** 2025-11-11 by @fcabanilla
- **Next review:** 2026-01-15 (o al cambiar versión de CMP OneTrust)
- **Implementation status:** In Progress (ADR accepted, awaiting implementation)

---

## Implementation Checklist

- [x] **ADR-0014 aprobado por equipo**
- [x] Crear `tests/setup/auth.setup.ts` (reemplaza script manual)
- [x] Ejecutar setup para production/preprod/lab (Cinesa + UCI)
- [ ] Crear `core/consent/consentSeeds.ts` con seeds extraídos (opcional)
- [ ] Implementar `WebActions.applyConsentSeedsFor()` (opcional)
- [ ] Implementar `WebActions.navigateToWithConsent()` (opcional)
- [x] Actualizar `playwright.config.ts` con `getStorageStatePath()`
- [x] Actualizar `fixtures/cinesa/playwright.fixtures.ts` con setup automático
- [ ] Añadir flag `FORCE_ACCEPT_COOKIES` a `CookieBannerPage.acceptIfPresent()` (si necesario)
- [ ] Configurar caching CI/CD para `state/`
- [ ] Ejecutar suite completa y validar success criteria
- [x] Documentar en código con TSDoc (`tests/setup/auth.setup.ts`)
- [ ] Revisión de código (2+ reviewers)
- [ ] Merge a `main`

**Nota:** `scripts/bootstrap-consent.ts` fue removido - ahora todo se maneja vía `tests/setup/auth.setup.ts`

```

```
