# Cloudflare Protection Handling

## Problema

Cloudflare es un servicio de protección que detecta tráfico automatizado y presenta desafíos de verificación que impiden que los tests automáticos continúen. Esto es especialmente común en sitios web que utilizan Cloudflare como sistema de protección.

## Síntomas

- Tests que se quedan colgados en la página "Just a moment..."
- Páginas que muestran "Checking your browser before accessing..."
- Desafíos de CAPTCHA que aparecen repetidamente
- Tests que fallan con timeouts en la navegación inicial

## Soluciones Implementadas

### 1. Configuración Mejorada del Navegador

En `playwright.config.ts` se han agregado configuraciones específicas para evadir la detección:

```typescript
// User Agent realista
userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36...'

// Headers que simulan tráfico humano
extraHTTPHeaders: {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9...',
  'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
  // ... más headers
}

// Argumentos del navegador para evadir detección
launchOptions: {
  args: [
    '--disable-blink-features=AutomationControlled',
    '--disable-features=VizDisplayCompositor',
    // ... más argumentos
  ]
}
```

### 2. CloudflareHandler Class

Se ha creado una clase específica para manejar Cloudflare:

```typescript
// Detectar desafío de Cloudflare
await cloudflareHandler.isCloudflareChallenge();

// Esperar resolución automática
await cloudflareHandler.waitForCloudflareResolution(45000);

// Navegar con manejo automático
await cloudflareHandler.navigateWithCloudflareHandling(url);
```

### 3. WebActions Mejorado

Se ha agregado un método específico en WebActions:

```typescript
// Navegación normal
await webActions.navigateTo(url);

// Navegación con protección Cloudflare
await webActions.navigateToWithCloudflareHandling(url);
```

### 4. Métodos en Page Objects

Los page objects ahora tienen métodos específicos para Cloudflare:

```typescript
// Navegación normal
await navbar.navigateToHome();

// Navegación con manejo de Cloudflare
await navbar.navigateToHomeWithCloudflareHandling();
```

## Comandos Específicos

Se han agregado comandos npm específicos para manejar Cloudflare:

```bash
# UCI con configuración Cloudflare
npm run test:uci:cloudflare

# Cinesa con configuración Cloudflare
npm run test:cinesa:cloudflare
```

Estos comandos ejecutan con:

- `--headed`: Modo visual (ayuda con Cloudflare)
- `--workers=1`: Un solo worker (menos detectable)

## Mejores Prácticas

### 1. Usar Modo Headed

Cloudflare es menos agresivo con navegadores visibles:

```bash
npx playwright test --headed
```

### 2. Reducir Paralelización

Menos workers simultáneos reducen la detección:

```bash
npx playwright test --workers=1
```

### 3. Usar Tests Específicos

Para sitios con Cloudflare, usar los tests `-cloudflare.spec.ts`:

```typescript
// tests/uci/navbar/navbar-cloudflare.spec.ts
test.beforeEach(async ({ navbar }) => {
  const success = await navbar.navigateToHomeWithCloudflareHandling();
  if (!success) {
    throw new Error('Failed to navigate past Cloudflare protection');
  }
});
```

### 4. Timeouts Extendidos

Configurar timeouts más largos para dar tiempo a la resolución:

```typescript
test.setTimeout(120000); // 2 minutos
```

## Debugging

### Verificar si hay Cloudflare

```typescript
const isCloudflare = await webActions.cloudflareHandler.isCloudflareChallenge();
console.log('Cloudflare detected:', isCloudflare);
```

### Esperar resolución manual

```typescript
await page.pause(); // Permite intervención manual
```

## Limitaciones

1. **No 100% garantizado**: Cloudflare evoluciona constantemente
2. **Performance**: Los tests son más lentos debido a las verificaciones
3. **Falsos positivos**: Ocasionalmente puede detectar incorrectamente

## Alternativas

Si Cloudflare es demasiado problemático:

1. **Ambiente de Testing**: Usar un ambiente sin Cloudflare
2. **Whitelisting**: Solicitar que las IPs de CI/CD sean permitidas
3. **Mocking**: Usar servicios mock para desarrollo

## Monitoreo

Revisar logs para:

- "Cloudflare challenge detected"
- "Cloudflare challenge resolved successfully"
- "Cloudflare challenge not resolved within timeout"
