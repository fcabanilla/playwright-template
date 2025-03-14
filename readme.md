# Playwright Template

Plantilla base para automatización de pruebas con [Playwright](https://playwright.dev/).

## Requisitos previos

- Node.js (v14+)
- npm o yarn

## Instalación

1. Clona el repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd playwright-template
   ```

2. Instala las dependencias:

   ```bash
   npm install
   # o
   yarn install
   ```

3. Instala los navegadores compatibles con Playwright:

   ```bash
   npx playwright install
   ```

## Estructura del proyecto

```plaintext
playwright-template/
├── tests/                   // Pruebas automatizadas
├── pages/                   // Page Objects
├── fixtures/                // Fixtures y datos de prueba
├── utils/                   // Utilidades y helpers
├── playwright.config.ts     // Configuración de Playwright
└── package.json             // Scripts, dependencias y metadatos
```

## Uso

### Ejecución de pruebas

- Ejecutar todas las pruebas:

  ```bash
  npm test
  # o
  yarn test
  ```

- Ejecutar pruebas específicas:

  ```bash
  npx playwright test <nombre-de-archivo>
  ```

- Abrir modo UI:

  ```bash
  npx playwright test --ui
  ```

- Ejecutar pruebas en un navegador concreto (por ejemplo, Chromium):

  ```bash
  npx playwright test --project=chromium
  ```

### Otros scripts (basado en package.json)

- Ejecutar todas las pruebas:

  ```bash
  npm test
  # o
  yarn test
  ```

- Ejecutar pruebas específicas del navbar:

  ```bash
  npm run navbar
  ```

- Generar y abrir el reporte de Allure:

  ```bash
  npm run report
  ```

- Visualizar el reporte en modo watch:

  ```bash
  npm run watch-report
  ```

## Personalización

La configuración principal se encuentra en `playwright.config.ts` donde se puede ajustar:

- Proyectos y navegadores
- Reportes y tiempos de espera
- Paralelismo en la ejecución de pruebas

## Buenas prácticas

- Emplear el patrón Page Object para mejorar la mantenibilidad
- Escribir pruebas independientes y sin dependencias mutuas
- Utilizar fixtures para la preparación y limpieza de datos

## Contribuir

1. Realiza un fork del repositorio.
2. Crea una rama para tu mejora o nueva funcionalidad.
3. Envía un pull request describiendo los cambios.

## Licencia

[Especificar la licencia]
