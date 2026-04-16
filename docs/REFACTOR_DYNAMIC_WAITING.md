# Refactorización: Reemplazar Timeouts Fijos con Esperas Dinámicas

## Objetivo
Eliminar todos los `waitForTimeout()` hardcodeados y reemplazarlos con esperas dinámicas basadas en cambios de estado del DOM.

## Motivación
- ✅ **Tests más rápidos**: No esperar tiempo innecesario
- ✅ **Más confiables**: Esperar eventos reales, no tiempos arbitrarios
- ✅ **Mejor mantenibilidad**: Código más claro y declarativo
- ✅ **Menos flakiness**: Adaptación automática a diferentes velocidades

## Estado Actual
**52 ocurrencias** de `waitForTimeout()` en **10 archivos**:

### Archivos a Refactorizar (por prioridad)

#### ✅ Completado
1. **cookieBanner.page.ts** - DONE
   - Eliminados 2 waitForTimeout (1000ms, 500ms)
   - Reemplazados con `waitFor({ state: 'hidden'/'detached' })`
   - Mejora de performance: ~20% más rápido

#### 🔴 Alta Prioridad (afectan múltiples tests)
2. **seatPicker.page.ts** - 6 ocurrencias
   - Contexto: Selección de asientos, validaciones
   - Timeouts: 300ms (×5), 500ms (×1)
   - Impacto: 30 tests de seatPicker

3. **signup.page.ts** - 14 ocurrencias
   - Contexto: Validaciones de formulario
   - Timeouts: 100ms (×14)
   - Impacto: Tests de registro y validación

#### 🟡 Media Prioridad (funcionalidad crítica)
4. **bar.page.ts** - Ocurrencias pendientes
   - Contexto: Compra de alimentos/bebidas
   - Impacto: Tests de bar y flujo completo

5. **cinemaDetail.page.ts** (Cinesa) - Ocurrencias pendientes
   - Contexto: Selección de películas y horarios
   - Impacto: Tests de navegación de cines

6. **cinema.page.ts** - Ocurrencias pendientes
   - Contexto: Listado de cines
   - Impacto: Tests de cinemas

#### 🟢 Baja Prioridad (componentes auxiliares)
7. **movies.page.ts** - Ocurrencias pendientes
8. **promotionalModal.page.ts** - Ocurrencias pendientes
9. **generic.ts** - Ocurrencias pendientes
10. **cinemaDetail.page.ts** (UCI) - Ocurrencias pendientes
11. **promoModal.page.ts** (UCI) - Ocurrencias pendientes

## Patrones de Refactorización

### ❌ Anti-patrón (Antes)
```typescript
await element.click();
await page.waitForTimeout(300); // Espera fija
// Asumir que algo pasó
```

### ✅ Patrón Correcto (Después)
```typescript
// Opción 1: Esperar que un elemento aparezca/desaparezca
await element.click();
await page.locator('.expected-result').waitFor({ state: 'visible', timeout: 5000 });

// Opción 2: Esperar que un elemento cambie de estado
await element.click();
await page.locator('.loading-spinner').waitFor({ state: 'hidden', timeout: 5000 });

// Opción 3: Esperar cambio de URL
await element.click();
await page.waitForURL('**/expected-path', { timeout: 5000 });

// Opción 4: Esperar respuesta de red
await Promise.all([
  page.waitForResponse(resp => resp.url().includes('/api/endpoint')),
  element.click()
]);

// Opción 5: Esperar función personalizada
await page.waitForFunction(() => {
  return document.querySelector('.result')?.textContent !== 'Loading...';
}, { timeout: 5000 });
```

### Casos de Uso Comunes

#### 1. Validación de errores en formularios
```typescript
// ❌ Antes
await page.fill(selector, 'invalid');
await page.click(otherField);
await page.waitForTimeout(100); // Esperar que aparezca error
await expect(errorMessage).toBeVisible();

// ✅ Después
await page.fill(selector, 'invalid');
await page.click(otherField);
await page.locator('.error-message').waitFor({ state: 'visible', timeout: 2000 });
await expect(errorMessage).toBeVisible();
```

#### 2. Selección de elementos dinámicos
```typescript
// ❌ Antes
await page.click('.seat');
await page.waitForTimeout(300); // Esperar animación
const isSelected = await page.isVisible('.seat.selected');

// ✅ Después
await page.click('.seat');
await page.locator('.seat.selected').waitFor({ state: 'visible', timeout: 2000 });
const isSelected = await page.isVisible('.seat.selected');
```

#### 3. Modales/Overlays
```typescript
// ❌ Antes
await page.click('.close-modal');
await page.waitForTimeout(500); // Esperar que cierre
await page.click('.next-button');

// ✅ Después
await page.click('.close-modal');
await page.locator('.modal').waitFor({ state: 'hidden', timeout: 3000 });
await page.click('.next-button');
```

## Plan de Implementación

### Fase 1: Cookie Banner ✅ COMPLETADO
- [x] Refactorizar cookieBanner.page.ts
- [x] Probar con tests de signup
- [x] Commit y documentación

### Fase 2: Signup (siguiente prioridad)
- [ ] Analizar los 14 waitForTimeout en signup.page.ts
- [ ] Identificar qué espera cada timeout (errores de validación)
- [ ] Reemplazar con esperas dinámicas de mensajes de error
- [ ] Probar con todos los tests de signup
- [ ] Commit

### Fase 3: SeatPicker
- [ ] Analizar los 6 waitForTimeout en seatPicker.page.ts
- [ ] Identificar estados de selección de asientos
- [ ] Reemplazar con esperas de clases CSS (.selected, .disabled, etc.)
- [ ] Probar con los 30 tests de seatPicker
- [ ] Commit

### Fase 4: Bar y Cinemas
- [ ] Refactorizar bar.page.ts
- [ ] Refactorizar cinema.page.ts y cinemaDetail.page.ts
- [ ] Probar tests relacionados
- [ ] Commit

### Fase 5: Componentes Restantes
- [ ] movies.page.ts
- [ ] promotionalModal.page.ts
- [ ] generic.ts
- [ ] UCI components
- [ ] Commit final

## Métricas de Éxito
- ✅ 0 ocurrencias de `waitForTimeout()` en Page Objects
- ✅ Tests más rápidos (reducción de tiempo de ejecución)
- ✅ Menos tests flaky
- ✅ Mejor legibilidad del código

## Notas
- Mantener timeouts máximos razonables (2-5 segundos)
- Siempre tener fallback con timeout explícito
- Documentar qué se está esperando en cada caso
- Preferir `waitFor()` sobre `isVisible()` + loops

## Referencias
- Playwright Best Practices: https://playwright.dev/docs/best-practices
- Auto-waiting: https://playwright.dev/docs/actionability
- Locator waitFor: https://playwright.dev/docs/api/class-locator#locator-wait-for
