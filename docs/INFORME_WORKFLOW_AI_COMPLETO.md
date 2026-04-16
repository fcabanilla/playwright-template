# Informe: Workflow Completo de AI para la Suite de Automatización

> **Documento interno de capacitación** — No subir al repositorio.  
> Fecha: 16 de abril de 2026

---

## Tabla de Contenidos

1. [Visión General del Ecosistema](#1-visión-general-del-ecosistema)
2. [Mapa de Componentes](#2-mapa-de-componentes)
3. [Cómo Funciona: El Flujo de Contexto](#3-cómo-funciona-el-flujo-de-contexto)
4. [Las 7 Capas del Sistema AI](#4-las-7-capas-del-sistema-ai)
5. [Casos de Uso — Operaciones Diarias](#5-casos-de-uso--operaciones-diarias)
6. [Casos de Uso — Desarrollo de Tests](#6-casos-de-uso--desarrollo-de-tests)
7. [Casos de Uso — Mantenimiento y Refactoring](#7-casos-de-uso--mantenimiento-y-refactoring)
8. [Casos de Uso — Reporting y Diagnóstico](#8-casos-de-uso--reporting-y-diagnóstico)
9. [Casos de Uso — Revisión y Calidad](#9-casos-de-uso--revisión-y-calidad)
10. [Casos de Uso — MCP Browser (Interacción Real con Sitios)](#10-casos-de-uso--mcp-browser-interacción-real-con-sitios)
11. [Casos de Uso — Flujos Combinados (Multi-Agente)](#11-casos-de-uso--flujos-combinados-multi-agente)
12. [Casos de Uso — Administración del Framework](#12-casos-de-uso--administración-del-framework)
13. [Tabla Resumen: Qué Usar y Cuándo](#13-tabla-resumen-qué-usar-y-cuándo)
14. [Errores Comunes y Cómo Evitarlos](#14-errores-comunes-y-cómo-evitarlos)
15. [Glosario](#15-glosario)

---

## 1. Visión General del Ecosistema

El proyecto tiene un **ecosistema de AI configurado a medida** que hace que GitHub Copilot (y otros agentes AI como Codex, Claude Code, Cursor) entiendan las reglas del framework sin que el usuario tenga que repetirlas en cada conversación.

### ¿Qué problema resuelve?

Sin configuración, Copilot genera código genérico que viola las reglas del proyecto:
- Crea Page Objects que acceden a `page` directamente (violación de ADR-0009)
- Pone selectors inline en los métodos (violación de separación)
- Importa `test` de `@playwright/test` en lugar de los fixtures
- Usa Allure 3 API (`allure.test.step()`) en lugar de Allure 2 (`allure.step()`)
- Genera código en español

**Con el ecosistema configurado**, Copilot genera código que cumple todas las reglas automáticamente, porque cada archivo de configuración inyecta las reglas correctas en el momento correcto.

### Analogía

Pensá en el ecosistema como una **cebolla con capas**:
- **Centro**: El modelo AI base (Claude, GPT, etc.)
- **Capa 1**: Instrucciones globales (siempre activas)
- **Capa 2**: Instrucciones por archivo (se activan solo cuando editás ese tipo de archivo)
- **Capa 3**: Agentes especializados (expertos en un dominio)
- **Capa 4**: Skills (procedimientos paso a paso que los agentes ejecutan)
- **Capa 5**: Prompts (workflows guiados one-shot)
- **Capa 6**: Hooks (automatizaciones pre/post acción)
- **Capa 7**: MCP Servers (herramientas externas: browser, GitHub API)

---

## 2. Mapa de Componentes

```
.github/
├── copilot-instructions.md          ← Instrucciones globales (~77 líneas)
├── instructions/                    ← 12 instrucciones por tipo de archivo
│   ├── context-engineering.instructions.md  (aplica a TODOS los archivos)
│   ├── page-objects.instructions.md         (solo *.page.ts)
│   ├── selectors.instructions.md            (solo *.selectors.ts)
│   ├── test-specs.instructions.md           (solo *.spec.ts)
│   ├── assertions.instructions.md           (solo *.assertions.ts)
│   ├── test-data.instructions.md            (solo *.data.ts)
│   ├── webactions.instructions.md           (solo core/webactions/**)
│   ├── fixtures.instructions.md             (solo fixtures/**)
│   ├── config.instructions.md               (solo config/**)
│   ├── uci-platform.instructions.md         (solo **/uci/**)
│   └── jsdoc.instructions.md                (global, convenciones JSDoc)
├── agents/                          ← 8 agentes especializados
│   ├── test-debugger.agent.md
│   ├── test-architect.agent.md
│   ├── pr-reviewer.agent.md
│   ├── page-object-refactorer.agent.md
│   ├── jsdoc-specialist.agent.md
│   ├── docs-auditor.agent.md
│   ├── booking-flow-tester.agent.md
│   └── allure-specialist.agent.md
├── skills/                          ← 8 skills (procedimientos)
│   ├── new-component/SKILL.md
│   ├── add-cinema-config/SKILL.md
│   ├── create-booking-test/SKILL.md
│   ├── add-jsdoc/SKILL.md
│   ├── review-test-coverage/SKILL.md
│   ├── testplan/SKILL.md
│   ├── trace-analysis/SKILL.md
│   └── mcp-cloudflare/SKILL.md
├── prompts/                         ← 5 prompts (workflows guiados)
│   ├── allure-report-workflow.prompt.md
│   ├── create-jira-ticket.prompt.md
│   ├── debug-cloudflare.prompt.md
│   ├── migrate-page-object.prompt.md
│   └── replicate-copilot-ecosystem.prompt.md
└── hooks/                           ← 2 hooks (automatizaciones)
    ├── post-edit-lint.json
    └── block-destructive.json

.vscode/
├── mcp.json                         ← 3 servidores MCP
└── settings.json                    ← Configuraciones de Copilot

AGENTS.md                            ← Contexto para agentes cloud (~81 líneas)
```

---

## 3. Cómo Funciona: El Flujo de Contexto

Cuando abrís Copilot Chat y hacés una pregunta, esto pasa internamente:

### Paso 1: Carga de contexto base
```
copilot-instructions.md  →  Siempre se carga (77 líneas)
AGENTS.md                →  Se carga si usás un agente cloud (Codex, etc.)
```
**Resultado**: Copilot ya sabe que es un framework de Playwright, que los Page Objects usan WebActions, que Allure 2 es la API correcta, etc.

### Paso 2: Carga de contexto por archivo
Si estás editando `pageObjectsManagers/cinesa/navbar/navbar.page.ts`:
```
context-engineering.instructions.md  →  Se carga (aplica a **)
page-objects.instructions.md         →  Se carga (aplica a **/*.page.ts)
```
**Resultado**: Copilot ahora además sabe que no debe usar `page` directamente, que debe inyectar `WebActions`, que los selectors van en archivo separado, etc.

### Paso 3: Selección de agente (si aplica)
Si mencionás `@test-debugger` o Copilot detecta que estás debuggeando:
```
test-debugger.agent.md  →  Se carga la personalidad + workflow del agente
```
**Resultado**: Copilot actúa como un debugger especializado con un workflow de 7 pasos.

### Paso 4: Invocación de skill (si aplica)
Si el agente necesita analizar una traza:
```
trace-analysis/SKILL.md  →  Se carga el procedimiento de 8 pasos
```
**Resultado**: Copilot sigue un procedimiento probado paso a paso.

### Paso 5: Hooks (automáticos)
Después de que Copilot edita un archivo `.ts`:
```
post-edit-lint.json  →  Ejecuta ESLint automáticamente
```
**Resultado**: El código queda linted sin intervención manual.

### Diagrama del flujo completo
```
Usuario escribe mensaje
       │
       ▼
┌──────────────────────────┐
│  copilot-instructions.md │  ← Siempre activo
│  (reglas globales)       │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  *.instructions.md       │  ← Se activa según el archivo abierto
│  (reglas por tipo)       │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  @agente (si se invocó)  │  ← Personalidad + dominio experto
│  tools: [read, edit...]  │
│  handoffs: [→ otro agent]│
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Skill (si el agente la  │  ← Procedimiento paso a paso
│  detecta como relevante) │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  MCP Servers             │  ← Herramientas externas
│  (browser, GitHub API)   │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Hooks (pre/post)        │  ← Automatizaciones silenciosas
│  (lint, block dangerous) │
└──────────────────────────┘
```

---

## 4. Las 7 Capas del Sistema AI

### Capa 1: `copilot-instructions.md` — El Mapa Global

**Qué es**: Un archivo Markdown que Copilot lee SIEMPRE, en cada conversación, en cada acción.

**Qué contiene** (77 líneas):
- Diagrama de arquitectura: `Tests → Page Objects → WebActions → Playwright`
- Las 4 reglas críticas (WebActions-only, separación de selectors, fixtures, assertions)
- Estructura de componentes
- Tabla de plataformas (Cinesa/UCI)
- Reglas de Allure 2 API (el error más común)
- Lista de "Don'ts" críticos
- Tabla de archivos clave

**Por qué es corto**: GitHub recomienda ≤2 páginas. Si es muy largo, Copilot se "desoriente" y mezcla reglas. Es un ÍNDICE, no una enciclopedia.

**Cuándo se activa**: SIEMPRE. Cada vez que Copilot genera código, escribe, o responde.

---

### Capa 2: `*.instructions.md` — Reglas por Tipo de Archivo

**Qué es**: Archivos con un campo `applyTo` que se activan solo cuando editás archivos que coincidan con el patrón.

**Ejemplo**: `page-objects.instructions.md` tiene `applyTo: 'pageObjectsManagers/**/*.page.ts'`

Esto significa que cuando estás editando `navbar.page.ts`, Copilot recibe además las reglas específicas de Page Objects:
- Constructor debe recibir `WebActions`, no `Page`
- Cada método público debe tener `allure.step()`
- Los selectors se importan del archivo `.selectors.ts`

**Lista completa**:

| Instruction | Se activa cuando editás... | Reglas principales |
|---|---|---|
| `context-engineering` | Cualquier archivo (`**`) | Nombres semánticos, tipos explícitos, funciones pequeñas |
| `page-objects` | `*.page.ts` | WebActions-only, constructor pattern, allure.step() |
| `selectors` | `*.selectors.ts` | Interface + const, prioridad data-testid |
| `test-specs` | `*.spec.ts` | Fixture imports, Allure labels, middot naming, tags |
| `assertions` | `*.assertions.ts` | Reciben Page directamente, allure.step() + expect() |
| `test-data` | `*.data.ts` | URLs dinámicas, getCinesaConfig(), exports tipados |
| `webactions` | `core/webactions/**` | Taxonomía [NAV]/[ACT]/[WAIT]/[ASSERT]/[DATA] |
| `fixtures` | `fixtures/**` | Patrón DI, context override chain |
| `config` | `config/**` | Interfaces, getters, multi-market |
| `uci-platform` | `**/uci/**` | URLs italianas, getUCIConfig() |
| `jsdoc` | Global | Convenciones JSDoc en inglés |

---

### Capa 3: Agentes — Expertos Especializados

**Qué es**: Personalidades AI configuradas con un dominio de expertise, herramientas permitidas, y conexiones a otros agentes.

**Cómo se invocan**: 
- En VS Code Chat: escribís `@test-debugger` y empezás a hablar
- En Copilot CLI: se seleccionan por nombre
- Automáticamente: otro agente puede hacer "handoff" a un especialista

**Los 8 agentes**:

| Agente | Expertise | Tools | Puede delegar a | Cuándo usarlo |
|---|---|---|---|---|
| `test-debugger` | Diagnóstico de tests fallidos | read, search, terminal | page-object-refactorer, allure-specialist | "Mi test de navbar falla con timeout" |
| `test-architect` | Diseño de estrategia de tests | read, search, terminal | booking-flow-tester, page-object-refactorer | "Necesito cubrir el componente promotions" |
| `pr-reviewer` | Revisión de PRs (Claude Sonnet 4) | read, search, 9 tools GitHub | page-object-refactorer, jsdoc-specialist | "Revisá el PR #42" |
| `page-object-refactorer` | Migración a WebActions pattern | read, search, edit, create | jsdoc-specialist | "Migrá seatPicker.page.ts" |
| `jsdoc-specialist` | Documentación JSDoc | read, search, terminal, edit | — | "Documentá webActions.ts" |
| `docs-auditor` | Auditoría de documentación | read, search, terminal, edit, create | — | "Revisá toda la documentación" |
| `booking-flow-tester` | Flujo completo de compra | read, search, terminal | test-debugger | "Creá un test E2E para Oasiz" |
| `allure-specialist` | Reporting Allure 2 | read, search, terminal, edit | — | "Los labels no aparecen en el reporte" |

**Propiedad `handoffs`**: Permite que un agente delegue trabajo a otro. Ejemplo: `test-debugger` encuentra que el problema es un Page Object mal migrado → delega a `page-object-refactorer`.

**Propiedad `argument-hint`**: Texto que aparece en el picker de VS Code como placeholder, indicando al usuario qué información proporcionar.

---

### Capa 4: Skills — Procedimientos Probados

**Qué es**: Procedimientos paso a paso que los agentes pueden invocar automáticamente cuando detectan que un skill es relevante. A diferencia de los prompts, los skills tienen archivos bundled, se auto-descubren, y son cross-platform.

**Cómo se invocan**:
- **Auto-discovery**: El agente lee la `description` del skill, y si tiene keywords que matchean con lo que necesita, lo invoca automáticamente
- **Manual**: El usuario puede referenciar un skill con `#` en el chat

**Los 8 skills**:

| Skill | Trigger Keywords | Cuándo se invoca |
|---|---|---|
| `new-component` | scaffold, new page, new component, bootstrap | "Agregá el componente de cupones" |
| `add-cinema-config` | new cinema, onboard cinema, add cinema | "Agregá el cine Arturo Soria" |
| `create-booking-test` | booking test, E2E, purchase flow | "Creá un test de compra para Yelmo" |
| `add-jsdoc` | document, JSDoc, missing docs | "Documentá el archivo bar.page.ts" |
| `review-test-coverage` | coverage, gaps, untested | "¿Qué componentes no tienen tests?" |
| `testplan` | re-run failures, selective, testplan | "Re-ejecutá solo los tests fallidos" |
| `trace-analysis` | trace, trace.zip, DOM snapshot | "Analizá esta traza del test fallido" |
| `mcp-cloudflare` | Cloudflare, blocked, CF bypass | "El browser MCP no pasa Cloudflare" |

---

### Capa 5: Prompts — Workflows Guiados One-Shot

**Qué es**: Plantillas de conversación pre-configuradas para tareas específicas que el usuario ejecuta manualmente.

**Diferencia con Skills**:
- **Skills**: Los agentes los descubren y ejecutan automáticamente
- **Prompts**: El usuario los invoca explícitamente con `#` o desde el picker

**Los 5 prompts restantes**:

| Prompt | Cuándo usarlo |
|---|---|
| `allure-report-workflow` | Necesitás el paso a paso exacto: limpiar resultados → ejecutar → generar reporte |
| `create-jira-ticket` | Querés generar texto estructurado para copiar/pegar en JIRA |
| `debug-cloudflare` | Los tests en preprod/lab fallan por Cloudflare |
| `migrate-page-object` | Tenés un Page Object legacy que usa `page` directo |
| `replicate-copilot-ecosystem` | Querés replicar este ecosistema AI en otro proyecto |

---

### Capa 6: Hooks — Automatizaciones Silenciosas

**Qué es**: Acciones que se ejecutan automáticamente antes o después de que Copilot use una herramienta.

**Los 2 hooks**:

| Hook | Evento | Qué hace |
|---|---|---|
| `post-edit-lint.json` | `PostToolUse` (después de editar .ts) | Ejecuta `npx eslint --fix` automáticamente |
| `block-destructive.json` | `PreToolUse` (antes de ejecutar terminal) | Bloquea `rm -rf`, `git push --force`, `git reset --hard`, `DROP TABLE` |

**Ejemplo de flujo con hooks**:
1. Pedís a Copilot: "Refactorizá el navbar.page.ts"
2. Copilot edita el archivo
3. **Hook post-edit-lint se dispara** → ESLint corrige automáticamente formatting
4. El resultado final ya está linted

---

### Capa 7: MCP Servers — Herramientas Externas

**Qué es**: Servidores que le dan a Copilot acceso a herramientas que no tiene nativamente: un browser real, la API de GitHub, etc.

**Los 3 servidores**:

| Server | Tipo | Capacidad |
|---|---|---|
| `github` | HTTP (remote) | Issues, PRs, branches, file contents vía GitHub API |
| `microsoft/playwright-mcp` | stdio (local) | Browser real: navegar, clickear, screenshots, evaluar JS |
| `playwright-cf` | stdio (local) | Browser con config Cloudflare bypass (preprod/lab) |

---

## 5. Casos de Uso — Operaciones Diarias

### CU-01: Escribir código nuevo en un archivo existente

**Escenario**: Estás en `navbar.page.ts` y necesitás agregar un método `clickUserMenu()`.

**Qué pasa internamente**:
1. `copilot-instructions.md` → Copilot sabe que es un framework de cinema con WebActions
2. `context-engineering.instructions.md` → Copilot usa nombres semánticos
3. `page-objects.instructions.md` → Copilot sabe que debe usar `this.webActions.click()`, no `this.page.click()`

**Lo que escribís en el chat**:
```
Agregá un método clickUserMenu que haga click en el menú de usuario
```

**Lo que Copilot genera** (correcto gracias a las instrucciones):
```typescript
async clickUserMenu(): Promise<void> {
  await allure.step('Click user menu', async () => {
    await this.webActions.click(this.selectors.userMenu, 'userMenu');
  });
}
```

**Sin las instrucciones, Copilot generaría** (incorrecto):
```typescript
async clickUserMenu() {
  await this.page.click('[data-testid="user-menu"]'); // ❌ page directo, selector inline
}
```

---

### CU-02: Autocompletado inline (Tab)

**Escenario**: Estás escribiendo un test en `navbar.spec.ts` y empezás a escribir `test('`.

**Qué pasa internamente**:
1. `copilot-instructions.md` → contexto global
2. `test-specs.instructions.md` → Copilot sabe que el naming usa middot (·), necesita tags, y Allure labels

**Lo que Copilot sugiere al presionar Tab**:
```typescript
test('Navbar · User Menu · Display dropdown on click', 
  { tag: ['@navbar', '@cinesa', '@smoke'] },
  async ({ navbar, cookieBanner }) => {
    await allure.story('Display user menu dropdown');
    // ...
  }
);
```

---

### CU-03: Crear un archivo nuevo desde cero

**Escenario**: Creás `promotions.data.ts` en `tests/cinesa/promotions/`.

**Qué pasa internamente**:
1. `copilot-instructions.md` → contexto global
2. `test-data.instructions.md` → Copilot sabe que debe importar `getCinesaConfig`, construir URLs dinámicas

**Lo que le decís**:
```
Generá el archivo de test data para el componente promotions
```

**Lo que genera**:
```typescript
import { getCinesaConfig, CinesaEnvironment } from '../../../config/environments';

const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
const config = getCinesaConfig(env);
const baseUrl = config.baseUrl.replace(/\/$/, '');

export const getPromotionsData = () => ({
  urls: {
    base: `${baseUrl}/promociones`,
    detail: (slug: string) => `${baseUrl}/promociones/${slug}`,
  },
});
```

---

### CU-04: Commit con mensaje convencional

**Escenario**: Terminaste de agregar tests de promotions y querés commitear.

**Qué pasa** (gracias a `copilot-instructions.md` que dice "Conventional format"):
```
Dame el mensaje de commit para estos cambios
```
```
test: add promotions component smoke tests
```

---

## 6. Casos de Uso — Desarrollo de Tests

### CU-05: Scaffolding de componente nuevo completo

**Escenario**: Necesitás crear todo el componente "coupons" desde cero (6 archivos).

**Cómo lo hacés**: Invocás el skill `new-component`:
```
Creá el componente "coupons" para la plataforma cinesa
```

**Qué pasa internamente**:
1. Copilot detecta el skill `new-component` (keyword: "new component")
2. Lee el SKILL.md que tiene los 6 pasos
3. Crea los 6 archivos en orden:
   - `pageObjectsManagers/cinesa/coupons/coupons.selectors.ts`
   - `pageObjectsManagers/cinesa/coupons/coupons.page.ts`
   - `tests/cinesa/coupons/coupons.data.ts`
   - `tests/cinesa/coupons/coupons.assertions.ts`
   - `tests/cinesa/coupons/coupons.spec.ts`
   - Actualiza `fixtures/cinesa/playwright.fixtures.ts`

**Resultado**: 6 archivos creados, todos cumpliendo las reglas, listos para customizar.

---

### CU-06: Crear test de booking E2E parametrizado

**Escenario**: Querés un test que compre entradas en 3 cines distintos.

**Cómo lo hacés**:
```
@booking-flow-tester Creá un test E2E de compra completa para los cines Oasiz, Plenilunio y La Maquinista
```

**Qué pasa internamente**:
1. Se activa el agente `booking-flow-tester` (especialista en booking flow)
2. El agente conoce la secuencia: Movies → Cinema → Seats → Tickets → Bar → Summary → Payment
3. Detecta y usa el skill `create-booking-test`
4. Genera un test parametrizado usando `getCinemasForEnvironment()` — NO copia/pega el test 3 veces

**El resultado usa el patrón correcto**:
```typescript
const CINEMAS = getCinemasForEnvironment();
for (const cinema of CINEMAS) {
  test(`Booking · Complete Purchase · E2E — ${cinema.name}`, ...);
}
```

---

### CU-07: Agregar un cine nuevo a la configuración

**Escenario**: Se abre un nuevo cine "Arturo Soria" y hay que agregarlo a los tests parametrizados.

**Cómo lo hacés**:
```
Agregá el cine Arturo Soria, disponible en production y preprod
```

**Qué pasa internamente**:
1. Copilot detecta el skill `add-cinema-config`
2. Sigue los 4 pasos del skill:
   - Agrega la entrada en `config/cinemas.config.ts`
   - Agrega el método `selectArturoSoriaCinema()` en el cinema POM
   - Agrega el selector en `cinemas.selectors.ts`
   - Explica cómo verificar

**Los tests existentes que usan `getCinemasForEnvironment()` automáticamente incluyen el nuevo cine** — no hay que tocar ningún test.

---

### CU-08: Diseñar estrategia de tests para componente nuevo

**Escenario**: Van a lanzar un sistema de loyalty points y necesitás planificar qué tests hacer.

**Cómo lo hacés**:
```
@test-architect Diseñá la estrategia de testing para el nuevo componente de loyalty points
```

**Qué pasa internamente**:
1. Se activa `test-architect` (diseñador de estrategia)
2. El agente analiza componentes existentes similares (programs, promotions)
3. Propone:
   - Qué tests crear (nombres con middot)
   - Qué tags usar
   - Qué assertions hacer
   - Qué fixtures necesitan
   - Prioridad (smoke vs regression)

**Si el diseño incluye tests de booking**, el agente puede hacer handoff a `booking-flow-tester` para la implementación.

---

### CU-09: Tests parametrizados por entorno

**Escenario**: Un test debe comportarse diferente en production vs preprod (diferentes URLs, timeouts).

**Lo que decís**:
```
El test de login necesita usar URLs diferentes por entorno
```

**Copilot sabe (por `test-data.instructions.md` + `config.instructions.md`)** que debe:
```typescript
const env = (process.env.TEST_ENV as CinesaEnvironment) || 'production';
const config = getCinesaConfig(env);
// No hardcodear nunca: ❌ 'https://www.cinesa.es/login'
// Usar siempre: ✅ `${config.baseUrl}/login`
```

---

## 7. Casos de Uso — Mantenimiento y Refactoring

### CU-10: Migrar un Page Object legacy

**Escenario**: Encontraste `oldComponent.page.ts` que usa `this.page.click()` directamente.

**Opción A — Prompt**:
```
# migrate-page-object
filePath: pageObjectsManagers/cinesa/oldComponent/oldComponent.page.ts
```

**Opción B — Agente**:
```
@page-object-refactorer Migrá oldComponent.page.ts al patrón WebActions
```

**Qué hace el agente**:
1. Busca violaciones: `this.page.click(`, `this.page.fill(`, selectors inline
2. Extrae selectors a `oldComponent.selectors.ts`
3. Reemplaza `Page` por `WebActions` en constructor
4. Convierte `this.page.click('[selector]')` → `this.webActions.click(this.selectors.key, 'key')`
5. Agrega `allure.step()` a cada método
6. **Hace handoff a `jsdoc-specialist`** para documentar los métodos nuevos

---

### CU-11: Documentar un archivo con JSDoc

**Escenario**: `webActions.ts` tiene métodos sin JSDoc.

**Cómo lo hacés**:
```
@jsdoc-specialist Documentá core/webactions/webActions.ts
```

**El agente sigue 3 fases** (nunca modifica sin permiso):
1. **Audit**: Escanea el archivo, detecta métodos sin JSDoc
2. **Plan**: Muestra un reporte con cada método y el JSDoc propuesto
3. **Execute**: Solo después de que decís "aplicá" → escribe los JSDoc

**Ejemplo de output de la fase Plan**:
```
📋 Audit Report: webActions.ts

| Method | Issue | Proposed Fix |
|--------|-------|-------------|
| click() | Missing JSDoc | /** Clicks element... @param selector... */ |
| fill() | Missing @returns | Add @returns {Promise<void>} |
| navigateTo() | Spanish description | Translate "Navega a..." → "Navigates to..." |

Awaiting approval to apply fixes.
```

---

### CU-12: Auditar documentación del proyecto

**Escenario**: Después de muchos cambios, la documentación puede estar desactualizada.

**Cómo lo hacés**:
```
@docs-auditor Auditá toda la documentación del proyecto
```

**El agente escanea todas las 40+ docs y detecta**:
- Referencias a archivos que ya no existen (ghost references)
- Fechas antiguas ("Last updated: 2024-05-10")
- Contadores incorrectos ("20+ fixtures" cuando hay 30+)
- Versiones incorrectas de dependencias
- Archivos vacíos
- Contenido duplicado entre docs
- TODOs/FIXMEs pendientes
- Inconsistencias entre docs

**Output**: Un reporte estructurado por categoría con tabla de issues y fixes propuestos.

---

### CU-13: Refactorizar selectores

**Escenario**: Los selectors de navbar usan clases CSS en lugar de data-testid.

**Qué pasa cuando editás `navbar.selectors.ts`**:
1. `selectors.instructions.md` se activa (aplica a `*.selectors.ts`)
2. Copilot sabe que debe priorizar `data-testid` sobre clases CSS
3. Le decís: "Refactorizá estos selectors para usar data-testid"
4. Copilot genera:
```typescript
// Antes ❌
logo: '.navbar-logo-class',
// Después ✅  
logo: '[data-testid="navbar-logo"]',
```

---

## 8. Casos de Uso — Reporting y Diagnóstico

### CU-14: Flujo completo de Allure reporting

**Escenario**: Ejecutaste tests y necesitás el reporte.

**Cómo lo hacés**: Invocás el prompt:
```
# allure-report-workflow
```

**Copilot te guía paso a paso**:
```bash
# Paso 1: Limpiar resultados previos (OBLIGATORIO)
npm run report:clean:results

# Paso 2: Ejecutar tests
npx playwright test tests/cinesa/navbar/ --project='Cinesa'

# Paso 3: Generar reporte (preserva historial para gráfico de tendencia)
npm run report
```

**Si te salteás el paso 1**, el reporte mostrará tests de ejecuciones anteriores mezclados.

---

### CU-15: Arreglar labels de Allure incorrectos

**Escenario**: En el reporte, los tests aparecen sin categorizar (sin epic/feature/story).

**Cómo lo hacés**:
```
@allure-specialist Los tests de seatPicker no aparecen categorizados en el reporte
```

**El agente sabe**:
- Que el error más común es usar Allure 3 API (`import * as allure`)
- Que los labels van en `beforeEach` (epic/feature) y por test (story)
- La tabla de Feature Names estandarizados

**Detecta y corrige**:
```typescript
// Antes ❌
import * as allure from 'allure-playwright';
await allure.test.step('...', async () => {});

// Después ✅
import { allure } from 'allure-playwright';
await allure.step('...', async () => {});
```

---

### CU-16: Re-ejecutar solo tests fallidos

**Escenario**: De 100 tests, fallaron 5. No querés re-ejecutar los 100.

**Cómo lo hacés**:
```
Re-ejecutá solo los tests que fallaron en la última ejecución
```

**Copilot detecta el skill `testplan`**:
1. Lee los resultados de `.allure/results/`
2. Genera un testplan JSON con solo los 5 tests fallidos
3. Ejecuta con `ALLURE_TESTPLAN_PATH`
4. Solo esos 5 se ejecutan

---

### CU-17: Analizar una traza de test fallido

**Escenario**: Un test falló y tenés el archivo `trace.zip`.

**Cómo lo hacés**:
```
Analizá la traza del test de seatPicker que falló
```

**Copilot detecta el skill `trace-analysis`**:
1. Localiza el `trace.zip` en `.allure/playwright-artifacts/`
2. Abre `trace.playwright.dev` en el browser MCP
3. Navega acción por acción
4. Inspecciona DOM snapshots en el momento del fallo
5. Identifica: "El selector `[data-testid="seat-A5"]` no matcheó porque el DOM tenía `data-testid="seat-a5"` (minúscula)"

---

### CU-18: Diagnosticar un test que falla intermitentemente

**Escenario**: Un test pasa localmente pero falla en CI.

**Cómo lo hacés**:
```
@test-debugger El test 'Navbar · Visibility · Display logo' falla intermitentemente en CI
```

**El agente sigue su workflow de 7 pasos**:
1. Lee el test
2. Identifica el assertion que falla
3. Verifica el entorno (¿es preprod con Cloudflare?)
4. Traza la cadena: spec → fixture → page object → webActions → selector
5. Revisa selectores
6. Revisa test data (¿URLs correctas para ese entorno?)
7. Propone fix: "Agregar `waitForVisible` antes del assertion — race condition"

**Si detecta que el problema es el Page Object**, hace handoff a `page-object-refactorer`.

---

## 9. Casos de Uso — Revisión y Calidad

### CU-19: Revisión completa de un PR

**Escenario**: Abriste un PR con cambios en 8 archivos.

**Cómo lo hacés**:
```
@pr-reviewer Revisá el PR #42
```

**El agente (Claude Sonnet 4) revisa**:
1. **Correctness**: ¿El código funciona? ¿Hay bugs?
2. **Clean Code**: ¿Naming correcto? ¿Funciones pequeñas?
3. **Design Patterns**: ¿Cumple ADR-0009? ¿Usa WebActions?
4. **Testing**: ¿Hay tests? ¿Tienen assertions?
5. **Security**: ¿Hay vulnerabilidades OWASP?
6. **Performance**: ¿Hay timeouts innecesarios?

**Si encuentra un Page Object que viola las reglas**, hace handoff a `page-object-refactorer`.
**Si encuentra métodos sin JSDoc**, hace handoff a `jsdoc-specialist`.

**Output estructurado**:
```markdown
## Summary
PR adds 3 new navbar tests with proper Allure labels.

## Architectural Compliance ✅
- WebActions-only pattern followed
- Selectors separated correctly

## Issues Found
1. ⚠️ `navbar.spec.ts:45` — Missing @smoke tag
2. 🐛 `navbar.data.ts:12` — Hardcoded URL, should use getCinesaConfig()
```

---

### CU-20: Revisar cobertura de tests

**Escenario**: Antes de un release, necesitás saber qué componentes tienen gaps.

**Cómo lo hacés**:
```
Analizá la cobertura de tests para la plataforma cinesa
```

**Copilot detecta el skill `review-test-coverage`**:
1. Escanea `tests/cinesa/` — cuenta spec files y test cases
2. Verifica que cada spec tenga su .assertions.ts y .data.ts
3. Evalúa tags (@smoke, @critical, @e2e)
4. Genera reporte:

```markdown
| Component       | Tests | Assertions | Data | Tags             | Gaps                    |
|----------------|-------|------------|------|------------------|-------------------------|
| navbar          | 15    | ✅          | ✅    | @smoke @critical | None                    |
| seatPicker      | 30    | ✅          | ✅    | @smoke @e2e      | None (reference model)  |
| coupons         | 0     | ❌          | ❌    | —                | Needs initial tests     |
| promotions      | 3     | ✅          | ✅    | @smoke           | Missing @e2e coverage   |
```

---

## 10. Casos de Uso — MCP Browser (Interacción Real con Sitios)

### CU-21: Generar selectores desde el sitio real

**Escenario**: Necesitás los data-testid del nuevo componente de cupones.

**Cómo lo hacés**:
```
Navegá a cinesa.es/cupones y listame todos los data-testid que encuentres
```

**Copilot usa el MCP server `microsoft/playwright-mcp`**:
1. Abre un browser real
2. Navega a la URL
3. Ejecuta JS: `document.querySelectorAll('[data-testid]')`
4. Lista todos los data-testid encontrados
5. Sugiere el archivo de selectors

---

### CU-22: Verificar un selector en el sitio real

**Escenario**: Un selector no matchea y querés verificar.

**Cómo lo hacés**:
```
Verificá si el selector [data-testid="navbar-logo"] existe en cinesa.es
```

**Copilot usa el browser MCP** para navegar, evaluar el selector, y reportar si existe o sugerir alternativas.

---

### CU-23: Navegar en entorno con Cloudflare (preprod/lab)

**Escenario**: Necesitás verificar algo en preprod, que tiene Cloudflare.

**Cómo lo hacés**:
```
Navegá a preprod-web.ocgtest.es usando el browser con Cloudflare bypass
```

**Copilot usa el MCP server `playwright-cf`** que tiene:
- Config de Cloudflare bypass
- User-agent custom
- Certificados configurados
- `--ignore-https-errors`

Si falla, Copilot detecta el skill `mcp-cloudflare` para troubleshooting.

---

### CU-24: Crear issues en GitHub directamente

**Escenario**: Encontraste un bug y querés crear un issue.

**Copilot usa el MCP server `github`**:
```
Creá un issue en el repo con título "Selector navbar-logo no matchea en preprod" 
y label "bug"
```

También puede:
- Listar PRs abiertos
- Ver el estado de un PR
- Crear branches
- Buscar código en el repo

---

## 11. Casos de Uso — Flujos Combinados (Multi-Agente)

### CU-25: De bug report a fix completo

**Flujo completo**:
1. **Inicio**: "El test de booking en Oasiz falla con timeout en el seat picker"
2. `@test-debugger` diagnostica → "El selector `seat-row-1` cambió en production"
3. **Handoff** → `@page-object-refactorer` actualiza `seatPicker.selectors.ts`
4. **Handoff** → `@jsdoc-specialist` documenta el método nuevo
5. **Hook** `post-edit-lint` → ESLint auto-fix en los archivos editados
6. El fix está listo para commit

---

### CU-26: De diseño a implementación de tests

**Flujo completo**:
1. **Inicio**: "Necesitamos tests para el componente de experiences"
2. `@test-architect` diseña la estrategia → "10 tests: 3 smoke, 5 regression, 2 E2E"
3. **Handoff** → `@booking-flow-tester` implementa los 2 tests E2E
4. El skill `new-component` scaffoldea los archivos
5. El skill `add-jsdoc` documenta el Page Object
6. `@test-architect` valida que todo cumple ADR-0009

---

### CU-27: Review de PR con fixes automáticos

**Flujo completo**:
1. **Inicio**: `@pr-reviewer Revisá el PR #55`
2. El reviewer encuentra: Page Object con `this.page.click()`
3. **Handoff** → `@page-object-refactorer` migra al patrón WebActions
4. **Handoff** → `@jsdoc-specialist` agrega JSDoc a los métodos
5. **Hook** → ESLint auto-fix
6. El reviewer valida el resultado final

---

## 12. Casos de Uso — Administración del Framework

### CU-28: Replicar el ecosistema en otro proyecto

**Escenario**: Otro equipo quiere el mismo setup de AI para su proyecto.

**Cómo lo hacés**:
```
# replicate-copilot-ecosystem
```

**El prompt guía en 4 fases**:
1. Entender el proyecto destino
2. Diseñar qué agentes/skills necesita
3. Generar todos los archivos
4. Documentar el onboarding

---

### CU-29: Crear un ticket de JIRA estructurado

**Escenario**: Necesitás un Epic para el nuevo módulo de loyalty.

**Cómo lo hacés**:
```
# create-jira-ticket
type: Epic
component: Loyalty Points
```

**Genera texto listo para copiar/pegar** con:
- Tipo, Prioridad, Labels
- Descripción, Background
- Criterios de aceptación
- Notas técnicas
- Estrategia de tests
- Definition of Done

---

### CU-30: Entender qué hace la protección destructiva

**Escenario**: Copilot intenta ejecutar `rm -rf .allure/` y querés saber por qué se bloqueó.

**Qué pasa**:
1. Copilot genera el comando
2. **Hook `block-destructive.json`** intercepta (evento `PreToolUse`)
3. El comando se bloquea con mensaje: "Destructive command blocked. Please confirm with the user."
4. Copilot te pregunta si realmente querés ejecutarlo
5. Solo si confirmás, procede

**Comandos bloqueados**: `rm -rf`, `git push --force`, `git reset --hard`, `DROP TABLE`

---

## 13. Tabla Resumen: Qué Usar y Cuándo

| Necesidad | Herramienta | Cómo invocar |
|---|---|---|
| Escribir código que cumpla las reglas | Instrucciones (automático) | Solo editá el archivo — se activan solas |
| Crear componente nuevo completo | Skill `new-component` | "Creá el componente X para cinesa" |
| Agregar cine a la config | Skill `add-cinema-config` | "Agregá el cine X" |
| Test E2E de booking | Agente `booking-flow-tester` | `@booking-flow-tester` + descripción |
| Diagnosticar test fallido | Agente `test-debugger` | `@test-debugger` + error/archivo |
| Diseñar tests nuevos | Agente `test-architect` | `@test-architect` + componente |
| Revisar un PR | Agente `pr-reviewer` | `@pr-reviewer` + PR# |
| Migrar Page Object legacy | Agente `page-object-refactorer` | `@page-object-refactorer` + archivo |
| Documentar con JSDoc | Agente `jsdoc-specialist` | `@jsdoc-specialist` + archivo |
| Auditar documentación | Agente `docs-auditor` | `@docs-auditor` |
| Arreglar Allure labels | Agente `allure-specialist` | `@allure-specialist` + problema |
| Re-ejecutar tests fallidos | Skill `testplan` | "Re-ejecutá los fallidos" |
| Analizar traza | Skill `trace-analysis` | "Analizá esta traza" |
| Troubleshoot Cloudflare | Skill `mcp-cloudflare` | "El browser no pasa CF" |
| Ver cobertura | Skill `review-test-coverage` | "Qué cobertura tenemos?" |
| Generar reporte Allure | Prompt `allure-report-workflow` | `# allure-report-workflow` |
| Crear ticket JIRA | Prompt `create-jira-ticket` | `# create-jira-ticket` |
| Debug Cloudflare | Prompt `debug-cloudflare` | `# debug-cloudflare` |
| Navegar sitio real | MCP Browser | "Navegá a cinesa.es" |
| Crear issue en GitHub | MCP GitHub | "Creá un issue con..." |

---

## 14. Errores Comunes y Cómo Evitarlos

### Error 1: "Copilot me genera código con `this.page.click()`"
**Causa**: Estás usando Copilot inline (Tab) fuera de un archivo `.page.ts`
**Fix**: Asegurate de estar en el archivo correcto — las instrucciones se activan por path

### Error 2: "El reporte Allure muestra tests duplicados"
**Causa**: No limpiaste resultados antes de ejecutar
**Fix**: Siempre: `npm run report:clean:results` ANTES de ejecutar tests

### Error 3: "El agente no sigue las reglas del proyecto"
**Causa**: Usás el chat genérico de Copilot sin `@agente`
**Fix**: Invocá el agente específico: `@test-debugger`, `@test-architect`, etc.

### Error 4: "import * as allure" en vez de "import { allure }"
**Causa**: Copilot auto-completa con el import de Allure 3
**Fix**: Las instrucciones lo cubren, pero si pasa, el hook de lint debería detectarlo

### Error 5: "Los tests nuevos no aparecen en el parametrizado"
**Causa**: No usaste `getCinemasForEnvironment()` en el data file
**Fix**: Usá el skill `add-cinema-config` que lo hace correctamente

### Error 6: "Copilot no detecta el skill que necesito"
**Causa**: Tu mensaje no contiene keywords del skill
**Fix**: Usá las palabras trigger. Ej: "scaffold", "new component", "booking test", "trace", "coverage"

---

## 15. Glosario

| Término | Definición |
|---|---|
| **copilot-instructions.md** | Archivo de instrucciones globales, siempre activo en Copilot Chat |
| **AGENTS.md** | Archivo de contexto para agentes AI cloud (Codex, Jules, etc.) |
| **.instructions.md** | Instrucciones que se activan por tipo de archivo (`applyTo`) |
| **Agent (.agent.md)** | Personalidad AI con expertise, tools, y capacidad de delegar |
| **Skill (SKILL.md)** | Procedimiento paso a paso auto-descubrible por agentes |
| **Prompt (.prompt.md)** | Workflow guiado que el usuario invoca manualmente |
| **Hook (.json)** | Automatización pre/post que ejecuta acciones silenciosamente |
| **MCP Server** | Servidor que da herramientas externas a Copilot (browser, GitHub) |
| **Handoff** | Delegación de un agente a otro especialista |
| **Argument-hint** | Placeholder en el picker que indica qué información dar |
| **WebActions** | Capa única de acceso a Playwright API (ADR-0009) |
| **Fixture** | Inyección de dependencias de Page Objects en tests |
| **ADR** | Architecture Decision Record — documentación de decisiones |
| **Middot (·)** | Carácter separador en nombres de tests: `'Component · Action'` |
| **data-testid** | Atributo HTML prioritario para selectors estables |
| **Allure 2** | Versión de API de reporting usada (`import { allure }`) |

---

*Documento generado el 16 de abril de 2026. Refleja el estado actual del ecosistema AI del proyecto.*
