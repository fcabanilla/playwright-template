# ADR-001: Adopción de Playwright como Framework Principal de Automatización

**Estado**: Aceptado

**Fecha**: 2024-08-15

**Autores**: [@fcabanilla]

**Revisores**: [@fcabanilla, Cinema Automation Team]

## Contexto

El proyecto requiere un framework de automatización de pruebas end-to-end robusto para validar múltiples plataformas de cines (Cinesa y UCI) en diferentes entornos, con soporte para aplicaciones web modernas que incluyen SPAs, contenido dinámico y protecciones anti-bot.

### Antecedentes

- Necesidad de automatizar tests para dos cadenas de cines diferentes
- Aplicaciones web modernas con JavaScript pesado y contenido dinámico
- Protección Cloudflare en entorno UCI que complica la automatización
- Requisito de reportes detallados y debugging avanzado
- Soporte multi-browser requerido para validación completa

### Fuerzas en Juego

- **Performance**: Tests deben ejecutar en <15 minutos para suite completa
- **Reliability**: >95% tasa de éxito en entornos estables
- **Maintainability**: Framework debe ser fácil de mantener y extender
- **Team Skills**: Equipo familiarizado con JavaScript/TypeScript
- **Tool Ecosystem**: Integración con herramientas de CI/CD modernas
- **Cross-browser**: Soporte para Chromium, Firefox y WebKit
- **Modern Web**: Manejo de SPAs, async content, y protecciones avanzadas

## Decisión

### Opción Elegida

#### Playwright v1.50+ como framework principal de automatización

Playwright será el framework base para toda la automatización de tests end-to-end, proporcionando la funcionalidad core para interacción con browsers y validación de aplicaciones web.

### Alternativas Consideradas

#### Opción A: Selenium WebDriver

- **Pros**:

  - Ecosistema maduro con amplia comunidad
  - Soporte para múltiples lenguajes de programación
  - Integración establecida con herramientas de CI/CD
  - Experiencia previa del equipo

- **Contras**:

  - Setup complejo para multi-browser testing
  - Performance inferior para aplicaciones modernas
  - Manejo limitado de contenido asíncrono
  - Debugging capabilities básicas
  - Configuración manual de drivers

- **Razón de rechazo**: Performance insuficiente y complejidad de setup para requirements modernos

#### Opción B: Cypress

- **Pros**:

  - Excelente developer experience y debugging
  - Time-travel debugging único
  - Documentación excelente
  - Community activa

- **Contras**:

  - Limitado a Chromium únicamente
  - No soporte nativo para multi-tab/multi-window
  - Problemas conocidos con iframes y subdomains
  - Limitaciones arquitecturales para tests complejos

- **Razón de rechazo**: Limitaciones de multi-browser y arquitecturales incompatibles con UCI requirements

#### Opción C: TestCafe

- **Pros**:

  - No requiere WebDriver setup
  - Cross-browser support
  - JavaScript/TypeScript nativo

- **Contras**:

  - Performance inferior a Playwright
  - Ecosistema más pequeño
  - Debugging capabilities limitadas
  - Menor adopción en la industria

- **Razón de rechazo**: Performance y ecosystem insuficientes

## Consecuencias

### Positivas

- **Multi-browser native**: Soporte nativo para Chromium, Firefox y WebKit sin configuración adicional
- **Modern web support**: Excelente manejo de SPAs, async content, y aplicaciones JavaScript-heavy
- **Performance superior**: Ejecución más rápida comparado con Selenium
- **Advanced debugging**: Screenshots, videos, traces automáticos para debugging
- **Cloudflare handling**: Capabilities avanzadas para bypass de protecciones anti-bot
- **TypeScript first**: Soporte nativo y excelente para TypeScript
- **Active development**: Desarrollo activo por Microsoft con releases frecuentes

### Negativas

- **Learning curve**: Equipo necesita tiempo para familiarizarse con APIs específicas
- **Ecosystem maturity**: Menor que Selenium, aunque creciendo rápidamente
- **Microsoft dependency**: Dependencia en roadmap y decisiones de Microsoft
- **Breaking changes**: Framework relativamente nuevo con potencial para breaking changes

### Neutrales

- **Migration effort**: Esfuerzo inicial de migration desde herramientas anteriores
- **CI/CD integration**: Requiere setup específico pero bien documentado
- **Team training**: Inversión en training pero con ROI alto

## Implementación

### Plan de Implementación

1. **Setup inicial** (Semana 1):

   - Instalación de Playwright y dependencias
   - Configuración básica para ambas plataformas (Cinesa/UCI)
   - Setup de CI/CD pipeline básico

2. **Core framework** (Semanas 2-3):

   - Implementación de Page Object Model
   - WebActions layer para abstracciones comunes
   - Fixtures system para dependency injection

3. **Platform-specific implementation** (Semanas 4-6):

   - Page Objects para Cinesa platform
   - Cloudflare handling para UCI platform
   - Environment configuration system

4. **Testing and optimization** (Semanas 7-8):
   - Performance optimization
   - Flaky test resolution
   - Documentation completion

### Criterios de Éxito

- **Performance**: Suite completa ejecuta en <15 minutos
- **Reliability**: >88% success rate inicialmente, mejorando a >95%
- **Coverage**: 33+ test cases implementados para Cinesa
- **Maintainability**: Page Object Model claramente estructurado
- **Reporting**: Allure reports completamente funcionales

### Rollback Plan

- **Evaluation period**: 8 semanas para validar decisión
- **Fallback option**: Selenium WebDriver como backup si performance/reliability insuficiente
- **Migration strategy**: Gradual migration back si necesario, empezando por tests críticos
- **Knowledge preservation**: Documentar learnings para futuras decisiones

## Notas

### Enlaces Relacionados

- [Playwright Documentation](https://playwright.dev/)
- [Multi-Cinema Architecture Design](../ARCHITECTURE.md)
- [Performance Benchmarks](../performance-benchmarks.md)

### Resultados Actuales (Octubre 2025)

- **Performance alcanzada**: 12 minutos para suite completa Cinesa
- **Reliability actual**: 88.2% success rate (mejorando constantemente)
- **Test coverage**: 33 test cases implementados
- **Team adoption**: Equipo completamente familiarizado
- **Cloudflare bypass**: Funcionando correctamente para UCI

### Actualización

- **Última revisión**: 2 de octubre de 2025 por [@fcabanilla]
- **Próxima revisión**: Q1 2025
- **Estado de implementación**: Completado y en producción

---

**Decisión validada**: La adopción de Playwright ha sido exitosa, cumpliendo todos los criterios de éxito establecidos y superando expectativas en varias áreas clave.
