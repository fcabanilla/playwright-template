# Release Notes v2 — Framework de Automatización Cinema
## Abril 2026

---

### Resumen ejecutivo

Este informe cubre las mejoras implementadas en el ecosistema de personalización de Copilot, los flujos de trabajo recomendados para casos de uso comunes, y la estrategia de migración de la suite Praetor hacia Cinesa. Funciona como complemento del informe de training anterior — no repite lo básico, se enfoca en lo nuevo y los caminos de uso avanzado.

---

## 1. Nuevas mejoras implementadas

### 1.1 Prohibiciones expandidas (`copilot-instructions.md`)

La sección "Critical Don'ts" (6 reglas genéricas) fue reemplazada por **"Prohibitions"** con 2 categorías:

**Arquitectura (10 reglas)**
- Las 6 originales + 4 nuevas:
  - No agregar docstrings/comments/tipos a código que no se modificó
  - No refactorizar más allá de lo solicitado (arreglos menores en archivos afectados están OK)
  - No crear abstracciones para operaciones de un solo uso
  - No usar `any` sin comentario de justificación

**Operacional (5 reglas)**
- **Producción fuera de alcance por defecto** — si `TEST_ENV` no está seteado, el agente DEBE preguntar antes de ejecutar
- No hardcodear credenciales
- No borrar `storage-state` ni `.allure/report/history/`
- No ejecutar tests sin `report:clean:results` primero
- No crear `.spec.ts` sin labels Allure

### 1.2 Hook de protección de producción (`block-production-execution.json`)

Hook `PreToolUse` que intercepta cualquier comando `npx playwright test` o `npm run test` que no incluya `TEST_ENV=preprod` o `TEST_ENV=lab`. Bloquea la ejecución con advertencia explícita.

**Por qué**: `TEST_ENV` por defecto es `production`. Sin este hook, un simple "corré los tests" ejecutaría contra producción.

### 1.3 Protocolo de aprendizaje continuo (`context-engineering.instructions.md`)

Nuevo protocolo que aplica a TODOS los archivos (`applyTo: '**'`). Cuando cualquier agente descubre algo nuevo durante una sesión:

1. Completa la tarea actual primero
2. Al final de la respuesta, agrega un bloque de sugerencia:
   > 💡 **Suggested improvement to project customization**
   > **What was learned**: [Descripción]
   > **Where to apply it**: [Archivos específicos]
   > **Proposed change**: [Texto exacto]
   > _Should I apply this improvement?_
3. Alcance amplio — cualquier descubrimiento (patrones, gotchas, selectores, comportamientos de entorno)
4. El usuario decide — nunca se auto-aplica

### 1.4 Agente de implementación (`implementation.agent.md`)

Nuevo agente dedicado que recibe planes aprobados del `@plan` agent. A diferencia del built-in `copilot`, tiene acceso completo a TODAS las herramientas de edición.

**Flujo actualizado**: `@plan` → "Start Implementation" → `@implementation` (con herramientas completas)

### 1.5 Reglas de AGENTS.md actualizadas

Reglas 6 y 7 agregadas al bloque de Architecture Rules:
- **Regla 6**: Protección de producción
- **Regla 7**: Aprendizaje continuo

---

## 2. Inventario completo del ecosistema

### 2.1 Agentes (10)

| Agente | Rol | Herramientas | Handoffs |
|--------|-----|-------------|----------|
| `@plan` | Análisis y planificación (solo lectura) | búsqueda, lectura, web, MCP Playwright | → `@implementation`, `@test-architect`, `@page-object-refactorer` |
| `@implementation` | Ejecutar planes aprobados | TODAS (sin restricción) | — |
| `@test-architect` | Diseñar estrategia de tests | búsqueda, lectura, terminal | → `@booking-flow-tester`, `@page-object-refactorer` |
| `@page-object-refactorer` | Migrar POMs a WebActions-only | búsqueda, lectura, edición | → `@jsdoc-specialist` |
| `@booking-flow-tester` | E2E checkout completo | búsqueda, lectura, terminal | → `@test-debugger` |
| `@test-debugger` | Diagnosticar tests fallidos | búsqueda, lectura, terminal | → `@page-object-refactorer`, `@allure-specialist` |
| `@allure-specialist` | Reporting Allure 2 | búsqueda, lectura, terminal, edición | — |
| `@jsdoc-specialist` | Documentación JSDoc | búsqueda, lectura, terminal, edición | — |
| `@docs-auditor` | Auditar documentación | búsqueda, lectura, terminal, edición | — |
| `@pr-reviewer` | Revisión de PRs | búsqueda, lectura, GitHub API | → `@page-object-refactorer`, `@jsdoc-specialist` |

### 2.2 Skills (8)

| Skill | Caso de uso |
|-------|------------|
| `new-component` | Scaffolding completo de componente nuevo (6 archivos) |
| `create-booking-test` | Test E2E parametrizado de booking completo |
| `add-cinema-config` | Agregar cine al test matrix |
| `add-jsdoc` | Documentar métodos públicos |
| `review-test-coverage` | Analizar gaps de cobertura |
| `testplan` | Ejecución selectiva vía Allure testplan |
| `trace-analysis` | Analizar traces de Playwright con MCP browser |
| `mcp-cloudflare` | Configurar bypass de Cloudflare para MCP |

### 2.3 Instructions (11)

| Archivo | Se activa en |
|---------|-------------|
| `context-engineering` | `**` (siempre) |
| `assertions` | `tests/**/*.assertions.ts` |
| `config` | `config/**` |
| `fixtures` | `fixtures/**/*.ts` |
| `jsdoc` | `core/webactions/**`, `pageObjectsManagers/**/*.page.ts` |
| `page-objects` | `pageObjectsManagers/**/*.page.ts` |
| `selectors` | `pageObjectsManagers/**/*.selectors.ts` |
| `test-data` | `tests/**/*.data.ts` |
| `test-specs` | `tests/**/*.spec.ts` |
| `uci-platform` | `**/uci/**` |
| `webactions` | `core/webactions/**` |

### 2.4 Hooks (3)

| Hook | Evento | Acción |
|------|--------|--------|
| `post-edit-lint` | PostToolUse (editFiles) | Ejecuta `eslint --fix` automáticamente |
| `block-production-execution` | PreToolUse (terminal) | Bloquea tests sin `TEST_ENV` explícito |
| `block-destructive` | PreToolUse (terminal) | Bloquea `rm -rf`, `git push --force`, `DROP TABLE` |

---

## 3. Caminos sugeridos — Flujos de trabajo paso a paso

### 3.1 "Quiero automatizar un componente nuevo"

**Ejemplo**: Automatizar la página de "Experiencias" para UCI.

**Camino óptimo**:

1. **Planificar** — Invocar `@plan` con: "Quiero automatizar el componente Experiences para UCI"
   - El agente investiga si ya existe algo similar en Cinesa (sí: `tests/cinesa/experiences/`)
   - Propone un plan basado en el patrón existente
   - Referencia el skill `new-component`

2. **Aprobar y ejecutar** — Click en "Start Implementation" → `@implementation`
   - Sigue el skill `new-component` (6 pasos):
     1. Crear `pageObjectsManagers/uci/experiences/experiences.selectors.ts`
     2. Crear `pageObjectsManagers/uci/experiences/experiences.page.ts` (WebActions-only)
     3. Crear `tests/uci/experiences/experiences.data.ts` (con `getUCIConfig()`)
     4. Crear `tests/uci/experiences/experiences.assertions.ts`
     5. Crear `tests/uci/experiences/experiences.spec.ts` (con tags `@uci`, `@experiences`)
     6. Registrar fixture en `fixtures/uci/playwright.fixtures.ts`

3. **Verificar** — Ejecutar `TEST_ENV=preprod npm run test:uci -- --grep "experiences"`

**Atajos**:
- Si el componente ya existe en Cinesa, el `@plan` agent lo detecta y propone copiar la estructura adaptando selectores
- Si solo necesitás los selectores, no es necesario el flujo completo

### 3.2 "Quiero crear un test E2E de booking para un cine nuevo"

**Camino óptimo**:

1. **Agregar el cine** — Usar skill `add-cinema-config`:
   - Agregar entrada en `config/cinemas.config.ts` con `name`, `selectMethod`, `tags`, `availableInEnvironments`
   - Los tests parametrizados con `getCinemasForEnvironment()` lo incluyen automáticamente

2. **Crear test de booking** — Usar skill `create-booking-test`:
   - Genera un `.spec.ts` que usa `runCheckoutFlow()` de `core/testBuilder/checkoutFlow.ts`
   - Configurable: `loginStrategy`, `seatCount`, `stopAfter`, `skipBar`

3. **Setup de showtimes** — Ejecutar `TEST_ENV=preprod npm run test:showtimes-setup` para descubrir sesiones disponibles

4. **Ejecutar** — `TEST_ENV=preprod npm run test:praetor:checkout`

### 3.3 "Un test está fallando y no sé por qué"

**Camino óptimo**:

1. **Generar trace** — Asegurar `trace: 'retain-on-failure'` en config (ya está por defecto)
2. **Invocar `@test-debugger`** — "Diagnosticá el fallo de [test name]"
   - Analiza error logs, screenshots, traces
   - Si necesita inspección visual → usa skill `trace-analysis` con MCP browser
3. **Si es problema de selectores** → handoff a `@page-object-refactorer`
4. **Si es problema de Allure** → handoff a `@allure-specialist`

### 3.4 "Quiero re-ejecutar solo los tests fallidos"

**Camino óptimo** (skill `testplan`):

1. `npm run testplan:failed` — genera `testplan.json` desde `.allure/results/`
2. `ALLURE_TESTPLAN_PATH=testplan.json TEST_ENV=preprod npm run testplan:run:cinesa`
3. `npm run report` — genera reporte preservando historial

### 3.5 "Quiero revisar la cobertura de tests del proyecto"

**Camino óptimo**:

1. Invocar `@test-architect` con skill `review-test-coverage`
2. Analiza: distribución de tags, assertion files, data files, componentes sin tests
3. Output: matriz de cobertura con gaps identificados y prioridades sugeridas

### 3.6 "Quiero validar cambios antes de un PR"

**Camino óptimo**:

1. `npm run lint && npx tsc --noEmit` — lint + type check
2. `npm run report:clean:results` — limpiar resultados anteriores
3. `TEST_ENV=preprod npm run test:es:preprod` — correr suite completa en preprod
4. `npm run report` — generar reporte
5. Invocar `@pr-reviewer` — revisa código, seguridad, arquitectura

---

## 4. Suite Praetor — Estado actual y estrategia de migración

### 4.1 ¿Qué es Praetor?

Praetor NO es una plataforma separada como UCI. Es una **suite especializada de checkout** que corre sobre la misma infraestructura Cinesa, con foco en el flujo completo de compra: Asientos → Login → Tickets → Bar → Resumen → Pago.

**Estado actual**:
- **27 tests** (19 de componente + 6 E2E + 2 authenticated WIP)
- **6 componentes POM**: SeatPicker, Login, TicketPicker, Bar, PurchaseSummary, Payment
- **Innovación clave**: `runCheckoutFlow()` builder en `core/testBuilder/checkoutFlow.ts`
- **Bloqueador**: Checkout autenticado bloqueado por reCAPTCHA

### 4.2 ¿Qué hace Praetor que Cinesa no?

| Capacidad | Cinesa | Praetor |
|-----------|--------|---------|
| Checkout E2E completo | ✅ Parcial (tests aislados) | ✅ Flujo orquestado |
| `runCheckoutFlow()` builder | ❌ | ✅ Configurable |
| Login strategies (guest/skip/login) | ❌ | ✅ 3 estrategias |
| Showtime discovery automático | ❌ Hardcoded | ✅ Setup project |
| D-BOX/ScreenX modal handling | ⚠️ Básico | ✅ Completo |
| Checkout autenticado | ❌ | ⚠️ WIP |
| File semaphore para D-BOX | ❌ | ✅ Lock atómico |

### 4.3 Estrategia de migración: Praetor → Cinesa

La migración no es un "reemplazo" sino una **absorción progresiva** de las innovaciones de Praetor hacia la suite principal Cinesa.

#### Fase 1: Absorber el builder (`runCheckoutFlow`)

**Qué mover**: `core/testBuilder/checkoutFlow.ts` ya está en `core/`, accesible globalmente.

**Acción**: Los tests de checkout de Cinesa (`tests/cinesa/checkout/`) pueden empezar a usar `runCheckoutFlow()` en lugar de orquestar pasos manualmente. Esto ya es posible sin mover archivos.

**Beneficio**: Elimina duplicación de setup en cada E2E test.

#### Fase 2: Migrar POMs de checkout

**Qué**: Los 6 POMs de Praetor (`pageObjectsManagers/praetor/cinesa/checkout/`) tienen implementaciones más maduras que los equivalentes en Cinesa (mejor manejo de modales, estrategias de selección de asientos).

**Estrategia**:
1. Comparar cada POM de Praetor vs Cinesa (ej: `PraetorSeatPicker` vs `SeatPicker`)
2. Identificar métodos superiores en Praetor
3. Migrar métodos a los POMs de Cinesa (no crear duplicados)
4. Actualizar selectores si difieren
5. Eliminar POMs de Praetor una vez migrados

**Herramienta ideal**: `@page-object-refactorer` con instrucciones específicas de migración.

**Archivos afectados**:
- `pageObjectsManagers/cinesa/seatPicker/seatPicker.page.ts` ← absorbe `dismissBlockingModals()`, `selectRandomAvailableSeat()`
- `pageObjectsManagers/cinesa/ticketPicker/ticketPicker.page.ts` ← absorbe `handleGlassesModal()`
- `pageObjectsManagers/cinesa/bar/bar.page.ts` ← absorbe `handleGaliciaModal()`
- `pageObjectsManagers/cinesa/purchaseSummary/purchaseSummary.page.ts` ← absorbe `confirmEmailModal()`, checkbox wrapper fix
- `pageObjectsManagers/cinesa/paymentPage/paymentPage.page.ts` ← absorbe `isRedsysVisible()`, gift card checks

#### Fase 3: Migrar fixtures autenticados

**Qué**: `fixtures/praetor/cinesa/playwright.authenticated.fixtures.ts` introduce el patrón de fixtures con `authStorageStatePath`.

**Estrategia**:
1. Agregar fixture type `authenticatedContext` al `fixtures/cinesa/playwright.fixtures.ts`
2. Crear setup project `auth-login.setup.ts` (ya existe en Praetor)
3. Resolver el bloqueador de reCAPTCHA (path más prometedor: login vía modal del home page)

**Bloqueador actual**: reCAPTCHA en `/compra/inicio-de-sesion/`. Solución propuesta: login vía modal del home page (nunca testeado pero documentado como "most promising path").

#### Fase 4: Migrar tests

**Qué**: Una vez que los POMs y fixtures están unificados, migrar los `.spec.ts` de Praetor a Cinesa.

**Estrategia**:
1. Los tests de Praetor importan de `fixtures/praetor/` → cambiar a `fixtures/cinesa/`
2. Actualizar nombres de fixtures si difieren (ej: `PraetorSeatPicker` → `seatPicker`)
3. Mantener tags `@checkout`, `@e2e` — eliminar `@praetor`
4. Preservar el uso de `runCheckoutFlow()` (ya en `core/`)

#### Fase 5: Eliminar suite Praetor

Una vez migrado todo:
1. Eliminar `pageObjectsManagers/praetor/`
2. Eliminar `tests/praetor/`
3. Eliminar `fixtures/praetor/`
4. Eliminar proyecto `Praetor-Cinesa` de `playwright.config.ts`
5. Mantener `core/testBuilder/checkoutFlow.ts` (es compartido)
6. Mantener `core/semaphore/fileSemaphore.ts` (es compartido)
7. Mantener `core/services/showtimeDiscovery.ts` (es compartido)

### 4.4 ¿Qué facilita la migración?

1. **Misma infraestructura**: Praetor usa `createCinesaContext()`, mismos storage states, misma configuración de entorno
2. **Builder en `core/`**: `runCheckoutFlow()` ya está fuera de Praetor, accesible globalmente
3. **Selectores separados**: Comparar selectores es trivial — son archivos `.selectors.ts` planos
4. **Skill `new-component`**: Si hay que crear componentes faltantes, el scaffolding es automático
5. **`@page-object-refactorer`**: Agente especializado en migrar POMs

### 4.5 ¿Qué complica la migración?

1. **reCAPTCHA**: Checkout autenticado sigue bloqueado — no se puede migrar lo que no funciona
2. **Showtime discovery**: Cinesa actual usa IDs hardcodeados — migrar a discovery requiere setup project
3. **D-BOX semaphore**: Los tests de Cinesa no usan el semáforo — agregarlo requiere actualizar fixtures
4. **Naming differences**: `PraetorSeatPicker` vs `SeatPicker` — hay que decidir qué nombre queda

---

## 5. Casos de uso avanzados

### 5.1 Orquestación multi-agente

**Escenario**: "Necesito agregar soporte para un nuevo cine (Puerto Venecia) con tests E2E completos"

**Flujo recomendado**:
1. `@plan` → investiga qué existe, propone plan de 4 pasos
2. "Start Implementation" → `@implementation`
   - Paso 1: `add-cinema-config` skill → agrega Puerto Venecia a `cinemas.config.ts`
   - Paso 2: `create-booking-test` skill → genera test E2E parametrizado
   - Paso 3: Ejecuta `showtimes-setup` para descubrir sesiones
   - Paso 4: Corre tests en preprod
3. `@pr-reviewer` → revisa el PR antes de merge

**Handoff chain**: `@plan` → `@implementation` → (manual) → `@pr-reviewer`

### 5.2 Debugging con trace analysis

**Escenario**: "El test de checkout falla intermitentemente en CI"

**Flujo recomendado**:
1. Descargar artefactos de CI (traces + screenshots)
2. `@test-debugger` → "Analizá este trace de checkout"
   - Usa skill `trace-analysis` para abrir trace en MCP browser
   - Inspecciona snapshots del DOM en cada paso
   - Identifica race conditions o elementos invisibles
3. Si el problema es un selector frágil → handoff a `@page-object-refactorer`
4. Si es timing → sugiere `waitFor` strategy en WebActions

### 5.3 Ejecución selectiva post-fallo

**Escenario**: "Corrí la regression suite y 12 tests fallaron — quiero re-correr solo esos"

**Flujo** (skill `testplan`):
1. `npm run testplan:failed` → genera `testplan.json` con los 12 tests
2. `ALLURE_TESTPLAN_PATH=testplan.json TEST_ENV=preprod npm run testplan:run:cinesa`
3. `npm run report` → reporte muestra tendencia (antes: 12 failed → ahora: X)

### 5.4 Migración de POM legacy

**Escenario**: "Tengo un POM que accede a `page` directamente — necesito migrarlo a WebActions"

**Flujo**:
1. `@page-object-refactorer` → "Migrá `cinemas/cinema.page.ts` a WebActions-only"
   - Detecta todas las llamadas directas a `page.*`
   - Propone equivalentes en WebActions
   - Extrae selectores inline a `.selectors.ts`
   - Wrappea métodos en `allure.step()`
2. Handoff a `@jsdoc-specialist` → agrega documentación JSDoc

### 5.5 Cloudflare bypass para MCP browser

**Escenario**: "Necesito usar MCP browser en preprod pero Cloudflare me bloquea"

**Flujo** (skill `mcp-cloudflare`):
1. Verificar `.env` tiene `CF_ACCESS_CLIENT_ID_PREPROD` y `CF_ACCESS_CLIENT_SECRET_PREPROD`
2. Ejecutar `node scripts/generate-mcp-config.cjs` → genera config con headers CF
3. Verificar con `node scripts/verify-mcp-config.cjs`
4. Usar MCP browser normalmente — los headers de CF se inyectan automáticamente

---

## 6. Referencia rápida de comandos

### Testing por plataforma
```bash
# Cinesa España
TEST_ENV=preprod npm run test:es:preprod

# Cinesa Portugal  
TEST_ENV=preprod-pt npm run test:pt:preprod

# UCI Italia
TEST_ENV=preprod npm run test:it:preprod

# Praetor checkout
TEST_ENV=preprod npm run test:praetor:preprod
```

### Reporting
```bash
npm run report:clean:results    # SIEMPRE antes de ejecutar tests
npm run report                  # Generar + abrir reporte
npm run report:ci               # Solo generar (sin abrir)
```

### Debugging
```bash
npm run ui                      # UI mode visual
npx playwright test --debug     # Step-by-step debugger
npx playwright show-trace trace.zip  # Ver trace
```

### Validación pre-commit
```bash
npm run lint && npx tsc --noEmit
```

---

## 7. Diagrama de relaciones del ecosistema

```
                    ┌─────────────────────┐
                    │    @plan (R/O)       │
                    │  Investiga + planea  │
                    └──────┬──────────────┘
                           │ handoff
                    ┌──────▼──────────────┐
                    │  @implementation    │
                    │  Ejecuta el plan    │
                    └──────┬──────────────┘
                           │ usa skills
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        new-component  create-booking  add-cinema
              │            │            │
              ▼            ▼            ▼
        ┌─────────────────────────────────┐
        │        Código generado           │
        │  POMs → WebActions → Playwright  │
        └──────────┬──────────────────────┘
                   │ validación
              ┌────▼────┐    ┌──────────────┐
              │  hooks   │    │ instructions  │
              │ (3 hooks)│    │ (11 rules)    │
              └──────────┘    └──────────────┘
                   │               │
                   ▼               ▼
              ┌──────────────────────────┐
              │     Allure 2 Report      │
              │  epic/feature/story      │
              └──────────────────────────┘
```

---

## 8. Roadmap sugerido

### Corto plazo (próximas 2 semanas)
- [ ] Resolver login por modal del home page (desbloquea checkout autenticado)
- [ ] Integrar `runCheckoutFlow()` en tests de checkout Cinesa existentes
- [ ] Eliminar hardcoded waits (`1500ms`) en seat selection

### Medio plazo (próximo mes)
- [ ] Fase 2 de migración Praetor: migrar POMs superiores a Cinesa
- [ ] Agregar Puerto Venecia y Grancasa a `cinemas.config.ts` (TIM-1260)
- [ ] Crear skill de migración Praetor-to-Cinesa para `@page-object-refactorer`

### Largo plazo (próximo trimestre)
- [ ] Completar fases 3-5 de migración Praetor
- [ ] Checkout autenticado completo (guest + logged-in)
- [ ] Coverage de promo codes (selectores ya existen)
- [ ] Optimización de performance: target 2-3 min (actualmente 4.8 min)
