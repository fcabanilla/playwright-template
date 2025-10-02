# Architectural Decision Records (ADRs)

Este directorio contiene los registros de decisiones arquitecturales para el Cinema Multi-Platform Test Automation Framework.

## ¿Qué son los ADRs?

Los Architectural Decision Records (ADRs) documentan decisiones importantes de arquitectura, el contexto en el que se tomaron, y las consecuencias de esas decisiones. Ayudan a los equipos a entender por qué se tomaron ciertas decisiones y facilitan futuras decisiones arquitecturales.

## Formato

Todos los ADRs siguen la plantilla definida en [`_template.md`](./_template.md).

## Estado de las Decisiones

- **Propuesto**: Decisión propuesta pero no implementada
- **Aceptado**: Decisión tomada e implementada
- **Rechazado**: Decisión considerada pero rechazada
- **Deprecated**: Decisión que ya no es relevante
- **Sustituido por ADR-XXX**: Decisión reemplazada por otra

## Índice de ADRs

| ADR                                        | Título                                             | Estado   | Fecha      | Autor       |
| ------------------------------------------ | -------------------------------------------------- | -------- | ---------- | ----------- |
| [001](./0001-playwright-framework.md)      | Adopción de Playwright como Framework Principal    | Aceptado | 2024-08-15 | @fcabanilla |
| [002](./0002-typescript-strict-mode.md)    | Implementación de TypeScript en Modo Estricto      | Aceptado | 2024-08-20 | @fcabanilla |
| [003](./0003-multi-cinema-architecture.md) | Arquitectura Multi-Cinema con Namespaces Separados | Aceptado | 2024-08-25 | @fcabanilla |

## Decisiones por Categoría

### Framework y Tecnologías Core

- **ADR-001**: Playwright como framework de automatización principal
- **ADR-002**: TypeScript strict mode para type safety

### Arquitectura del Sistema

- **ADR-003**: Estructura multi-cinema con namespaces separados

### Futuras Decisiones Planificadas

#### Q4 2024 - Q1 2025

- **ADR-004**: Estrategia de CI/CD y pipeline de deployment
- **ADR-005**: Implementación de API testing integration
- **ADR-006**: Visual regression testing approach

#### Q1 2025 - Q2 2025

- **ADR-007**: Mobile testing strategy y responsive validation
- **ADR-008**: Performance testing integration
- **ADR-009**: Test data management y synthetic data generation

## Proceso para Nuevos ADRs

### Cuándo Crear un ADR

Crea un ADR cuando:

- Tomas una decisión arquitectural que será difícil de revertir
- La decisión afecta múltiples componentes del sistema
- Hay múltiples opciones viables con trade-offs significativos
- La decisión requiere justificación para futuras referencias
- Equipos o stakeholders necesitan entender el contexto de la decisión

### Cómo Crear un ADR

1. **Copia la plantilla**: Usa [`_template.md`](./_template.md) como base
2. **Asigna número**: Usa el siguiente número secuencial (ADR-004, ADR-005, etc.)
3. **Completa todas las secciones**: Especialmente contexto, alternativas y consecuencias
4. **Solicita review**: Al menos 2 reviews antes de marcar como "Aceptado"
5. **Actualiza este índice**: Agrega la entrada correspondiente
6. **Comunica la decisión**: Share con el equipo y stakeholders relevantes

### Template de Filename

```
XXXX-brief-decision-title.md
```

Ejemplos:

- `0004-cicd-pipeline-strategy.md`
- `0005-api-testing-integration.md`
- `0006-visual-regression-approach.md`

## Guidelines para Escritura

### Contexto Claro

- Explica **por qué** la decisión es necesaria
- Proporciona suficiente background para que alguien nuevo pueda entender
- Include relevant technical and business constraints

### Alternativas Detalladas

- Lista **todas** las opciones consideradas seriamente
- Explain pros and cons objetivamente
- Provide clear rationale para por qué otras opciones fueron rechazadas

### Consecuencias Honestas

- Include tanto consecuencias positivas como negativas
- Be realistic about trade-offs y limitations
- Consider long-term implications

### Implementación Práctica

- Provide actionable implementation steps
- Define success criteria claramente
- Include rollback plan cuando sea apropiado

## Referencias y Recursos

### Sobre ADRs

- [Documenting Architecture Decisions - Michael Nygard](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions)
- [ADR GitHub Repository](https://github.com/joelparkerhenderson/architecture_decision_record)
- [When to Write an ADR](https://engineering.atspotify.com/2020/04/14/when-should-i-write-an-architecture-decision-record/)

### Tools

- [ADR Tools](https://github.com/npryce/adr-tools) - Command line tools para managing ADRs
- [Log4brains](https://github.com/thomvaill/log4brains) - Web UI para browsing ADRs

---

**Mantenido por**: Cinema Automation Team (@fcabanilla)  
**Última actualización**: 2 de octubre de 2025  
**Próxima revisión**: Q1 2025
