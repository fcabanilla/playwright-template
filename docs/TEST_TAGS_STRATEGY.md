# 🏷️ Test Tags Strategy - UCI Cinemas

## Overview

Esta documentación define la estrategia de tags para organizar y filtrar tests de manera eficiente en el proyecto UCI Cinemas.

## Tag Categories

### 🧩 **Component Tags**

Identifican el componente o sección específica siendo testeada:

- `@navbar` - Tests del componente de navegación
- `@movies` - Tests relacionados con películas/cartelera
- `@cinemas` - Tests de selección de cines
- `@seatpicker` - Tests del selector de asientos
- `@booking` - Tests del proceso de reserva
- `@payment` - Tests del proceso de pago
- `@profile` - Tests del perfil de usuario
- `@modal` - Tests de modales y popups
- `@forms` - Tests de formularios

### ⚡ **Performance Tags**

Clasifican la velocidad de ejecución:

- `@fast` - Tests que ejecutan en < 10 segundos
- `@slow` - Tests que ejecutan en > 10 segundos

### 🎯 **Test Type Tags**

Definen el tipo de testing:

- `@smoke` - Tests críticos básicos que deben pasar siempre
- `@regression` - Tests de regresión completos
- `@integration` - Tests de integración entre componentes
- `@navigation` - Tests específicos de navegación
- `@api` - Tests de API
- `@visual` - Tests de regresión visual

### 🔴 **Priority Tags**

Indican la prioridad del test:

- `@critical` - Funcionalidad crítica (bloqueantes)
- `@high` - Alta prioridad
- `@medium` - Prioridad media
- `@low` - Baja prioridad

### 🌐 **Environment Tags**

Especifican el entorno o namespace:

- `@uci` - Tests específicos de UCI Cinemas
- `@cinesa` - Tests específicos de Cinesa
- `@crossbrowser` - Tests que requieren múltiples navegadores
- `@mobile` - Tests para dispositivos móviles
- `@desktop` - Tests para desktop

## Usage Examples

### 🚀 **Quick Smoke Tests**

```bash
# Solo tests críticos y rápidos
npx playwright test --grep "@smoke.*@fast"

# Tests críticos de navbar únicamente
npx playwright test --grep "(?=.*@navbar)(?=.*@critical)"
```

### 🔄 **Regression Suites**

```bash
# Regresión completa de UCI
npx playwright test --grep "@uci.*@regression"

# Todos los tests de navegación
npx playwright test --grep "@navigation"

# Tests críticos y de alta prioridad
npx playwright test --grep "@critical|@high"
```

### 🎯 **Component-Specific Testing**

```bash
# Solo tests del navbar
npx playwright test --grep "@navbar"

# Tests rápidos del navbar
npx playwright test --grep "(?=.*@navbar)(?=.*@fast)"

# Excluir tests lentos
npx playwright test --grep-invert "@slow"
```

### 🚫 **Exclusion Patterns**

```bash
# Excluir tests de baja prioridad
npx playwright test --grep-invert "@low"

# Solo tests que NO son de API
npx playwright test --grep-invert "@api"

# Excluir tests lentos Y de baja prioridad
npx playwright test --grep-invert "@slow|@low"
```

## Implementation Guidelines

### ✅ **Best Practices**

1. **Always tag by component**: Cada test debe tener al menos un tag de componente
2. **Include priority**: Todos los tests deben tener una prioridad asignada
3. **Mark performance**: Usar @fast/@slow basado en tiempo de ejecución real
4. **Group related tests**: Use describe blocks con tags compartidos

### 📝 **Tag Naming Convention**

- Tags deben empezar con `@`
- Usar lowercase
- Ser descriptivos pero concisos
- Evitar espacios (usar guiones si es necesario)

### 🎨 **Example Test Structure**

```typescript
test.describe(
  'UCI Movies Component',
  {
    tag: ['@movies', '@uci'],
  },
  () => {
    test('should display movie list @smoke @fast @critical', async ({
      page,
    }) => {
      // Basic smoke test
    });

    test(
      'should filter movies by genre',
      {
        tag: ['@filtering', '@slow', '@high'],
      },
      async ({ page }) => {
        // Complex filtering test
      }
    );
  }
);
```

## CI/CD Integration

### 🏗️ **Pipeline Stages**

```yaml
# Ejemplo de configuración CI/CD
stages:
  - name: 'Smoke Tests'
    command: "npx playwright test --grep '@smoke.*@fast'"

  - name: 'Component Tests'
    command: "npx playwright test --grep '@critical|@high'"

  - name: 'Full Regression'
    command: "npx playwright test --grep '@regression'"
    when: 'weekly'
```

### 📊 **Reporting Benefits**

- Filtrar reportes por componente
- Análisis de performance por tags
- Tracking de flaky tests por prioridad
- Métricas de cobertura por feature

## Future Considerations

- Agregar tags temporales (@wip, @skip) para desarrollo
- Tags de feature flags (@feature-x) para A/B testing
- Tags de browser-specific (@chrome-only, @safari-bug)
- Tags de data dependencies (@requires-user, @requires-movies)
