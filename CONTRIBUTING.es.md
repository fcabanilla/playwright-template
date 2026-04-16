# 🤝 Guía de Contribución

Gracias por tu interés en contribuir al **Cinema Multi-Platform Test Automation Framework**. Esta guía te ayudará a entender nuestro proceso de contribución y las mejores prácticas del proyecto.

## 🎯 Tipos de Contribuciones Bienvenidas

- **🐛 Corrección de bugs** en tests existentes
- **✨ Nuevos test cases** para funcionalidades no cubiertas
- **🏗️ Mejoras en Page Objects** y arquitectura
- **📝 Mejoras en documentación**
- **🚀 Optimizaciones de rendimiento**
- **🔧 Herramientas de desarrollo** y automatización

## 🌊 Flujo de Pull Requests

### 1. Preparación

```bash
# Fork del repositorio y clonar tu fork
git clone https://github.com/TU-USUARIO/playwright-template.git
cd playwright-template

# Configurar upstream
git remote add upstream https://github.com/fcabanilla/playwright-template.git

# Instalar dependencias
npm install
npx playwright install
```

### 2. Crear Rama de Funcionalidad

```bash
# Crear rama desde main actualizado
git checkout main
git pull upstream main
git checkout -b feature/nombre-descriptivo

# O para bugs
git checkout -b fix/descripcion-del-bug

# O para documentación
git checkout -b docs/area-mejorada
```

### 3. Convenciones de Ramas

| Tipo | Prefijo | Ejemplo | Descripción |
|------|---------|---------|-------------|
| Funcionalidad | `feature/` | `feature/uci-payment-flow` | Nueva funcionalidad |
| Corrección | `fix/` | `fix/navbar-selector-update` | Corrección de bugs |
| Documentación | `docs/` | `docs/api-testing-guide` | Mejoras de documentación |
| Refactor | `refactor/` | `refactor/page-object-structure` | Reestructuración de código |
| Performance | `perf/` | `perf/test-execution-speed` | Optimizaciones |
| Chore | `chore/` | `chore/update-dependencies` | Tareas de mantenimiento |

### 4. Desarrollo

#### Tamaño de PRs
- **Máximo 400 líneas** de cambios por PR
- **Un concepto por PR** - no mezclar funcionalidades
- **Tests incluidos** para toda nueva funcionalidad

#### Estructura de Commits
Seguimos **Conventional Commits** para mensajes claros y automatzación:

```
<tipo>[scope opcional]: <descripción>

[cuerpo opcional]

[footer opcional]
```

#### Ejemplos de Commits

```bash
# Funcionalidades
feat(cinesa): agregar test de flujo de pago completo
feat(uci): implementar page object para selección de asientos
feat(core): agregar manejo de overlays en WebActions

# Correcciones
fix(navbar): actualizar selectores después de rediseño
fix(seatpicker): corregir timeout en selección múltiple
fix(config): resolver configuración de entorno preprod

# Documentación
docs(readme): actualizar guía de instalación
docs(contributing): agregar ejemplos de page objects
docs(adr): documentar decisión de uso de Allure 3

# Refactoring
refactor(fixtures): simplificar inyección de dependencias
refactor(assertions): mover aserciones a clases dedicadas

# Performance
perf(tests): reducir tiempo de ejecución en 30%
perf(selectors): optimizar estrategias de wait

# Chores
chore(deps): actualizar Playwright a v1.50.1
chore(lint): configurar ESLint para TypeScript estricto
```

### 5. Checks Locales Antes del PR

#### Tests y Linting

```bash
# 1. Ejecutar linting
npm run lint

# 2. Ejecutar tests relevantes
npm run test:cinesa:navbar  # Para cambios en navbar
npm run test:uci:smoke      # Para cambios en UCI

# 3. Ejecutar suite completa (recomendado)
npm run test:cinesa
npm run test:uci

# 4. Generar reporte
npm run report:generate
```

#### Verificaciones Obligatorias

```bash
# Verificar que no hay errores de TypeScript
npx tsc --noEmit

# Verificar que los tests pasan
npm test

# Verificar formato de código
npm run lint
```

### 6. Crear Pull Request

#### Template de PR

```markdown
## 📋 Descripción

Descripción clara y concisa de los cambios realizados.

## 🎯 Tipo de Cambio

- [ ] 🐛 Bug fix (cambio que corrige un problema)
- [ ] ✨ Nueva funcionalidad (cambio que agrega funcionalidad)
- [ ] 💥 Breaking change (fix o feature que causa cambios incompatibles)
- [ ] 📝 Documentación (cambios solo en documentación)
- [ ] 🎨 Refactoring (cambios que no agregan funcionalidad ni corrigen bugs)
- [ ] ⚡ Performance (cambios que mejoran rendimiento)
- [ ] 🧪 Tests (agregar tests faltantes o corregir existentes)

## 🧪 Tests Realizados

- [ ] Tests unitarios pasan
- [ ] Tests de integración pasan
- [ ] Tests manuales realizados (describir cuáles)
- [ ] Reporte Allure generado y revisado

## 📝 Checklist

- [ ] Mi código sigue las convenciones del proyecto
- [ ] He realizado self-review de mi código
- [ ] He comentado código complejo cuando es necesario
- [ ] He actualizado documentación relevante
- [ ] Mis cambios no generan nuevos warnings
- [ ] He agregado tests que prueban mi fix/feature
- [ ] Tests nuevos y existentes pasan localmente

## 🔗 Issues Relacionados

Closes #(issue)

## 📷 Screenshots (si aplica)

Si hay cambios visuales, incluir screenshots del antes/después.

## 📚 Documentación Adicional

Enlaces a documentación relevante o explicaciones adicionales.
```

#### Etiquetas de PR

- `scope:cinesa` - Cambios específicos de Cinesa
- `scope:uci` - Cambios específicos de UCI
- `scope:core` - Cambios en funcionalidades centrales
- `type:feature` - Nueva funcionalidad
- `type:bugfix` - Corrección de error
- `type:docs` - Cambios en documentación
- `priority:high` - Alta prioridad
- `priority:medium` - Prioridad media
- `priority:low` - Baja prioridad

### 7. Revisión de Código

#### Criterios de Aprobación

- **2 approvals mínimos** para cambios en `main`
- **1 approval mínimo** para cambios en `develop`
- **Owner approval requerido** para cambios arquitecturales

#### Proceso de Review

1. **Automated checks** deben pasar (linting, tests)
2. **Code review** por al menos un maintainer
3. **Testing verification** en entorno de pruebas
4. **Documentation review** si hay cambios en docs

## 🚨 Política de Issues

### Crear un Issue

#### Bug Report

```markdown
**🐛 Descripción del Bug**
Descripción clara y concisa del problema.

**🔄 Pasos para Reproducir**
1. Ir a '...'
2. Hacer click en '...'
3. Ver error

**📋 Comportamiento Esperado**
Descripción de lo que debería pasar.

**📷 Screenshots**
Si aplica, agregar screenshots.

**🖥️ Entorno**
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]

**📝 Contexto Adicional**
Cualquier otra información relevante.
```

#### Feature Request

```markdown
**✨ Descripción de la Funcionalidad**
Descripción clara de la funcionalidad propuesta.

**🎯 Problema que Resuelve**
Explicar qué problema soluciona esta funcionalidad.

**💡 Solución Propuesta**
Descripción de cómo debería funcionar.

**🔄 Alternativas Consideradas**
Otras alternativas que consideraste.

**📋 Criterios de Aceptación**
- [ ] Criterio 1
- [ ] Criterio 2
- [ ] Criterio 3
```

### Triage de Issues

#### Etiquetas de Prioridad

- 🔥 `priority:critical` - Bloquea funcionalidad principal
- ⚠️ `priority:high` - Afecta funcionalidad importante
- 📋 `priority:medium` - Mejora general
- 💡 `priority:low` - Nice to have

#### Etiquetas de Tipo

- 🐛 `type:bug` - Error en código existente
- ✨ `type:enhancement` - Nueva funcionalidad
- 📝 `type:documentation` - Mejoras en documentación
- ❓ `type:question` - Pregunta sobre el proyecto
- 🏗️ `type:architecture` - Cambios arquitecturales

#### Etiquetas de Estado

- 🔍 `status:investigating` - Investigando el problema
- 📋 `status:planned` - Planificado para desarrollo
- 🔄 `status:in-progress` - En desarrollo activo
- ⏳ `status:blocked` - Bloqueado por dependencias
- ✅ `status:ready-for-review` - Listo para revisión

## 🎯 Convenciones de Código

### TypeScript

```typescript
// ✅ Bueno: Interfaces claras y tipos explícitos
interface MovieSelectors {
  readonly movieCard: string;
  readonly movieTitle: string;
  readonly movieRating: string;
}

// ✅ Bueno: Documentación JSDoc
/**
 * Handles movie selection and validation for cinema platforms
 * @param movieId - Unique identifier for the movie
 * @returns Promise resolving to movie details
 */
async selectMovie(movieId: string): Promise<MovieDetails> {
  // Implementation
}

// ❌ Malo: Tipos any y falta de documentación
async selectMovie(movieId: any) {
  // Implementation
}
```

### Page Objects

```typescript
// ✅ Bueno: Page Object bien estructurado
export class MoviePage {
  constructor(private page: Page) {}

  private readonly selectors = {
    movieCard: '[data-testid="movie-card"]',
    movieTitle: '.movie-title',
    bookButton: '.book-button',
  } as const;

  async selectMovie(movieTitle: string): Promise<void> {
    await this.page
      .locator(this.selectors.movieCard)
      .filter({ hasText: movieTitle })
      .click();
  }
}
```

### Tests

```typescript
// ✅ Bueno: Tests descriptivos con pasos claros
test.describe('Movie Selection Flow', () => {
  test('should select movie and proceed to seat selection', async ({
    page,
    moviePage,
    seatPage
  }) => {
    await test.step('Navigate to movies page', async () => {
      await moviePage.navigate();
    });

    await test.step('Select specific movie', async () => {
      await moviePage.selectMovie('Avengers: Endgame');
    });

    await test.step('Verify seat selection page loads', async () => {
      await expect(seatPage.seatMap).toBeVisible();
    });
  });
});
```

## 🔧 Herramientas de Desarrollo

### Setup Local

```bash
# Verificar setup
npm run lint          # Verificar código
npm run test          # Ejecutar tests
npm run report        # Ver reporte

# Herramientas útiles
npm run ui            # Playwright UI para debug
npm run codegen       # Generar selectores automáticamente
```

### Debugging

```typescript
// Debug con pausa
await page.pause();

// Debug con screenshots
await page.screenshot({ path: 'debug.png' });

// Debug con logs
console.log('Current URL:', page.url());
```

## 📋 Standards de Calidad

### Code Coverage

- **Mínimo 80%** de cobertura para nuevos Page Objects
- **Tests obligatorios** para toda nueva funcionalidad
- **Regression tests** para fixes de bugs

### Performance

- **Tests deben ejecutar** en menos de 5 minutos
- **Page Objects optimizados** con estrategias de wait eficientes
- **Selectores robustos** que no dependan de implementación

### Documentation

- **JSDoc obligatorio** para métodos públicos
- **README actualizado** para nuevas funcionalidades
- **ADRs documentados** para decisiones arquitecturales

## 🆘 Obtener Ayuda

### Canales de Comunicación

- **GitHub Issues** - Para bugs y feature requests
- **GitHub Discussions** - Para preguntas generales
- **Pull Request Comments** - Para feedback específico

### Contactos

- **Maintainer Principal**: @fcabanilla
- **Team Cinesa**: @team-cinesa
- **Team UCI**: @team-uci

### Recursos Útiles

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://conventionalcommits.org/)
- [Allure Framework](https://docs.qameta.io/allure/)

---

## 🏆 Reconocimientos

Agradecemos a todos los contribuidores que hacen posible este proyecto:

- Seguimiento de contribuciones en [Contributors](../../graphs/contributors)
- Wall of fame en releases importantes

---

**¡Gracias por contribuir! 🎉** Tu ayuda hace que este framework sea cada vez mejor para toda la comunidad de testing de cines.