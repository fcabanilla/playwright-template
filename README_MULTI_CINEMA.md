# Playwright Multi-Cinema Testing Framework

Este proyecto contiene tests automatizados para múltiples cadenas de cines utilizando Playwright.

## Estructura del Proyecto

El proyecto está organizado en namespaces separados para cada cadena de cines:

### Cinesa (España)

- **URL**: https://www.cinesa.es/
- **Page Objects**: `pageObjectsManagers/cinesa/`
- **Tests**: `tests/cinesa/`
- **Fixtures**: `fixtures/cinesa/`

### UCI Cinemas (Italia)

- **URL**: https://www.ucicinemas.it/
- **Page Objects**: `pageObjectsManagers/uci/`
- **Tests**: `tests/uci/`
- **Fixtures**: `fixtures/uci/`

## Comandos de Testing

### Cinesa

```bash
npm run test:navbar          # Tests del navbar de Cinesa
npm run test:footer          # Tests del footer de Cinesa
npm run test:movies          # Tests de películas de Cinesa
npm run test:cinemas         # Tests de cines de Cinesa
# ... más comandos específicos de Cinesa
```

### UCI Cinemas

```bash
npm run test:uci             # Todos los tests de UCI
npm run test:uci:navbar      # Tests del navbar de UCI
npm run test:uci:footer      # Tests del footer de UCI
```

### Generación de Código

```bash
npm run codegen             # Code generation para Cinesa
npm run codegen:uci         # Code generation para UCI
```

## Configuración

Los tests están configurados para ejecutarse con las siguientes características:

- Modo headless desactivado (visual)
- Screenshots en fallos
- Videos habilitados
- Reportes con Allure

## Próximos Pasos

1. **Actualizar selectores**: Los selectores de UCI son placeholders y necesitan ser actualizados según la estructura real del sitio web.
2. **Completar Page Objects**: Agregar más page objects según las funcionalidades necesarias.
3. **Expandir tests**: Crear tests más específicos para cada funcionalidad.
4. **Configuración por entorno**: Parametrizar configuraciones para diferentes entornos de testing.

## Notas Importantes

- Los selectores de UCI contienen TODOs que indican que necesitan ser actualizados
- La estructura está preparada para ser escalable a más cadenas de cines
- Los tests básicos están implementados como ejemplo, pero requieren adaptación a la estructura real de cada sitio web
