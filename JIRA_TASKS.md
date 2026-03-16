# Tablero Kanban - Sprint Azure & Core Hardening

## 🚀 DONE

### **(MAINTENANCE) Documentation: Standardize playwright.config comments to English**
**ID**: `TIM-1271`
**Status**: ✅ DONE
**Comentarios**:
- Se han traducido y estandarizado todos los comentarios en `playwright.config.ts` y `playwright.service.config.ts`.
- Alineado con la política de "English-only codebase".

### **(CORE) Remote browsers pillar breakdown: Playwright Service execution model**
**ID**: `TIM-1266`
**Status**: ✅ DONE
**Comentarios**:
- Created `docs/REMOTE_EXECUTION_STRATEGY.md` covering architecture, artifacts, and backlog.
- Verified entrypoints in `playwright.service.config.ts` and `package.json`.
- Aligned User Agent strategy with the documented Cloudflare bypass plan.

---

## 🏗 IN PROGRESS -> MOVING TO DONE

### **(CORE) Configuration: Parameterize Cloudflare User-Agent bypass via Environment Variables**
**ID**: `TIM-1269`
**Status**: ✅ DONE (Ready for Review)
**Assignee**: GitHub Copilot
**Comentarios**:
- Implemented dynamic UserAgent injection in `fixtures/cinesa/playwright.fixtures.ts`.
- Added `USER_AGENT_SUFFIX` support in `playwright.service.config.ts`.
- Validated via local diagnostic test.

---

# Descripciones para Jira - Framework Multi-Cinema UCI

## 🏆 ÉPICA PRINCIPAL

**Título**: Implementación Completa Framework Multi-Cinema UCI Cinemas

**Tipo**: Epic

**Descripción**:
Implementar un framework de testing completo para UCI Cinemas Italia que replique toda la funcionalidad existente del namespace Cinesa, manteniendo la misma arquitectura Page Object Model, patrones de separación de responsabilidades y calidad de código.

**Objetivo de Negocio**:

- Expandir la capacidad de testing automatizado a UCI Cinemas Italia
- Mantener consistencia arquitectónica entre namespaces (Cinesa/UCI)
- Asegurar calidad en todos los flujos críticos de UCI
- Facilitar mantenimiento futuro con código reutilizable y bien estructurado

**Criterios de Aceptación**:

- [x] ✅ Sistema de configuración centralizado implementado
- [x] ✅ Navbar UCI completamente funcional con tests
- [x] ✅ Sistema de modal promocional y cookies
- [ ] 🔄 Todos los componentes core implementados (Movies, Cinemas, SeatPicker)
- [ ] 🔄 Proceso de compra end-to-end funcional
- [ ] 🔄 Sistema de autenticación y registro
- [ ] 🔄 Cobertura de tests superior al 80%
- [ ] 🔄 Documentación completa y actualizada

**Valor de Negocio**: Alto - Permite testing automatizado completo en mercado italiano

**Complejidad**: Alta - 18 componentes, múltiples integraciones, diferentes idiomas/monedas

**Esfuerzo Estimado**: 7-9 semanas

**Dependencias**:

- Configuración de entornos UCI (staging/production)
- Acceso a APIs UCI para testing
- Coordinación con equipo UCI para validaciones

---

## 🔥 FASE 1: Componentes Core (Prioridad Alta)

### 1.1 Movies & Movie - Sistema de Catálogo de Películas UCI

**Título**: Implementar Page Objects para Catálogo de Películas UCI

**Tipo**: Story

**Descripción**:
Desarrollar los page objects necesarios para la navegación, visualización y selección de películas en UCI Cinemas, replicando la funcionalidad existente en el namespace Cinesa pero adaptado a la estructura y diseño específico de UCI.

**Contexto Técnico**:
El sistema debe manejar tanto la vista de lista de películas como los detalles individuales de cada película, incluyendo horarios, formatos disponibles (2D, 3D, IMAX, etc.) y información detallada como sinopsis, duración, clasificación, etc.

**Tareas Técnicas**:

1. **MovieList Page Object**:

   - Crear `pageObjectsManagers/uci/movies/movies.page.ts`
   - Implementar navegación por carrusel de películas destacadas
   - Funcionalidad de filtrado y búsqueda
   - Obtención de listas de películas (destacadas vs todas)
   - Navegación a detalles de película individual

2. **Movie Detail Page Object**:

   - Crear `pageObjectsManagers/uci/movie/movie.page.ts`
   - Visualización de información completa de película
   - Selección de horarios y formatos
   - Integración con selección de cines
   - Botones de acción (comprar entradas, favoritos)

3. **Selectors y Data**:

   - Crear selectores específicos UCI en archivos separados
   - Configurar URLs y datos de test
   - Integrar con sistema de configuración centralizado

4. **Tests Completos**:
   - Tests de navegación entre películas
   - Validación de información mostrada
   - Tests de filtros y búsqueda
   - Separación spec/assertions/data siguiendo patrón Cinesa

**Criterios de Aceptación**:

- [ ] Page object MovieList implementado con todas las funcionalidades
- [ ] Page object Movie detail implementado
- [ ] Selectores específicos UCI funcionando correctamente
- [ ] Tests completos con separación de responsabilidades
- [ ] Integración con configuración centralizada de URLs
- [ ] Documentación JSDoc en inglés
- [ ] Cobertura de tests > 90%

**Definición de Completado**:

- Código revisado y aprobado
- Tests pasando en CI/CD
- Documentación actualizada
- Sin deuda técnica pendiente

**Complejidad**: Media
**Prioridad**: Alta
**Esfuerzo**: 1-1.5 semanas
**Componente**: movies/, movie/

---

### 1.2 Cinemas - Sistema de Selección de Cines UCI

**Título**: Implementar Page Objects para Selección y Gestión de Cines UCI

**Tipo**: Story

**Descripción**:
Desarrollar el sistema completo de selección de cines UCI, incluyendo lista de cines, búsqueda geográfica, filtros por características (IMAX, 3D, etc.) y vista detallada de cada cine con sus salas y características específicas.

**Contexto Técnico**:
El sistema debe manejar la geolocalización, filtrado por características de cines, y la transición fluida entre selección de cine y selección de película/horario. Debe adaptarse a la estructura específica de UCI Italia con sus cines distribuidos por el país.

**Tareas Técnicas**:

1. **Cinema List Page Object**:

   - Crear `pageObjectsManagers/uci/cinemas/cinema.page.ts`
   - Lista y búsqueda de cines por ubicación
   - Filtrado por características (IMAX, Premium, etc.)
   - Geolocalización y "cines cercanos"
   - Selección de cine específico

2. **Cinema Detail Page Object**:

   - Crear `pageObjectsManagers/uci/cinemas/cinemaDetail.page.ts`
   - Información detallada del cine seleccionado
   - Lista de películas disponibles en ese cine
   - Horarios específicos por sala
   - Características y servicios del cine

3. **Integración con Sistema de URLs**:

   - URLs específicas para cada cine
   - Configuración de cines de test por entorno
   - Datos de cines para testing automatizado

4. **Tests de Funcionalidad**:
   - Tests de búsqueda y filtrado
   - Validación de información de cines
   - Tests de selección y navegación
   - Integración con selección de películas

**Criterios de Aceptación**:

- [ ] Lista de cines navegable y filtrable implementada
- [ ] Detalles de cine individual funcionales
- [ ] Búsqueda geográfica operativa
- [ ] Integración con selección de películas
- [ ] Tests automatizados completos
- [ ] Configuración por entornos implementada
- [ ] Manejo de errores y casos edge

**Definición de Completado**:

- Funcionalidad completa verificada manualmente
- Suite de tests automatizados pasando
- Integración con otros componentes validada
- Rendimiento optimizado

**Complejidad**: Media
**Prioridad**: Alta  
**Esfuerzo**: 1-1.5 semanas
**Componente**: cinemas/

---

### 1.3 SeatPicker - Sistema de Selección de Asientos UCI

**Título**: Implementar Sistema Completo de Selección de Asientos UCI

**Tipo**: Story

**Descripción**:
Desarrollar el componente más complejo del sistema: la selección interactiva de asientos en las salas de UCI. Debe manejar diferentes tipos de salas, asientos especiales (wheelchair, premium, couple), restricciones de selección y validación en tiempo real de disponibilidad.

**Contexto Técnico**:
Este es el componente de mayor complejidad técnica ya que involucra interacciones complejas con mapas de asientos dinámicos, validaciones en tiempo real, diferentes tipos de asientos con precios variables, y lógica de negocio específica (ej: no dejar asientos solos entre selecciones).

**Tareas Técnicas**:

1. **SeatPicker Core**:

   - Crear `pageObjectsManagers/uci/seatPicker/seatPicker.page.ts`
   - Renderizado e interpretación del mapa de asientos
   - Lógica de selección múltiple de asientos
   - Validación de disponibilidad en tiempo real
   - Cálculo automático de precios

2. **Tipos de Asientos**:

   - Asientos estándar, premium, wheelchair accessible
   - Asientos de pareja (loveseat)
   - Asientos con restricciones especiales
   - Manejo de precios diferenciados

3. **Validaciones de Negocio**:

   - Máximo de asientos seleccionables
   - Prevención de "asientos huérfanos"
   - Validación de tipos de entrada vs asientos
   - Timeouts de reserva temporal

4. **Tests Avanzados**:
   - Tests de selección en diferentes configuraciones de sala
   - Validación de todas las reglas de negocio
   - Tests de rendimiento con salas grandes
   - Manejo de errores y reconexión

**Criterios de Aceptación**:

- [ ] Mapa de asientos interactivo completamente funcional
- [ ] Todos los tipos de asientos manejados correctamente
- [ ] Validaciones de negocio implementadas y testeadas
- [ ] Cálculo de precios automático y preciso
- [ ] Manejo robusto de errores de conexión/disponibilidad
- [ ] Tests de regresión para todos los escenarios
- [ ] Rendimiento optimizado para salas grandes

**Definición de Completado**:

- Validación manual en múltiples tipos de sala
- Suite completa de tests automatizados
- Documentación de reglas de negocio
- Optimización de rendimiento completada

**Complejidad**: Alta
**Prioridad**: Alta
**Esfuerzo**: 2-2.5 semanas  
**Componente**: seatPicker/

---

## 🛒 FASE 2: Proceso de Compra (Prioridad Alta)

### 2.1 TicketPicker - Sistema de Selección de Entradas UCI

**Título**: Implementar Selección de Tipos y Cantidades de Entradas UCI

**Tipo**: Story

**Descripción**:
Desarrollar el sistema de selección de tipos de entradas (adulto, niño, senior, estudiante, etc.) con sus respectivos precios y promociones aplicables, integrado con el sistema de asientos y validación de elegibilidad.

**Tareas Técnicas**:

- Crear page object para selección de entradas
- Implementar lógica de precios y descuentos UCI
- Validación de elegibilidad por tipo de entrada
- Integración con selección de asientos
- Tests de cálculos y validaciones

**Criterios de Aceptación**:

- [ ] Selección de tipos de entrada funcional
- [ ] Cálculos de precios correctos
- [ ] Aplicación de descuentos automática
- [ ] Validaciones de elegibilidad implementadas
- [ ] Tests de todos los escenarios de precios

**Complejidad**: Media
**Prioridad**: Alta
**Esfuerzo**: 1 semana

---

### 2.2 Bar - Sistema de Productos Adicionales UCI

**Título**: Implementar Sistema de Productos de Bar/Concesiones UCI

**Tipo**: Story

**Descripción**:
Desarrollar el sistema de selección de productos adicionales (snacks, bebidas, menús) con configuración de opciones, cantidades y cálculo de precios integrado con el proceso de compra principal.

**Tareas Técnicas**:

- Page object para productos de bar UCI
- Sistema de menús y opciones configurables
- Cálculo de precios y combos
- Integración con flujo de compra
- Tests de selección y precios

**Criterios de Aceptación**:

- [ ] Catálogo de productos navegable
- [ ] Selección de opciones y cantidades
- [ ] Cálculo de precios y combos correcto
- [ ] Integración fluida con compra de entradas
- [ ] Tests de todos los productos y combinaciones

**Complejidad**: Media
**Prioridad**: Media
**Esfuerzo**: 1 semana

---

### 2.3 PurchaseSummary - Resumen Final de Compra UCI

**Título**: Implementar Resumen y Validación Final de Compra UCI

**Tipo**: Story

**Descripción**:
Desarrollar la página de resumen final que consolida todos los elementos seleccionados (entradas, asientos, productos) con cálculo total, aplicación de descuentos finales y validación previa al pago.

**Tareas Técnicas**:

- Page object para resumen de compra
- Validación de totales y cálculos
- Aplicación de códigos promocionales
- Términos y condiciones UCI
- Tests de validación de resumen

**Criterios de Aceptación**:

- [ ] Resumen completo y detallado de compra
- [ ] Cálculos totales precisos
- [ ] Aplicación de promociones funcional
- [ ] Aceptación de términos implementada
- [ ] Tests de validación de todos los cálculos

**Complejidad**: Media
**Prioridad**: Alta
**Esfuerzo**: 1 semana

---

### 2.4 PaymentPage - Proceso de Pago UCI

**Título**: Implementar Sistema de Pago UCI (Testing sin transacciones reales)

**Tipo**: Story

**Descripción**:
Desarrollar el page object para el proceso de pago UCI, enfocado en testing de interfaz y validaciones sin realizar transacciones reales. Incluye manejo de diferentes métodos de pago y validación de formularios.

**Tareas Técnicas**:

- Page object para formularios de pago
- Validación de métodos de pago UCI
- Manejo de errores de pago (simulados)
- Tests de validación de formularios
- Integración con ambiente de testing

**Criterios de Aceptación**:

- [ ] Formularios de pago completamente validados
- [ ] Manejo de diferentes métodos de pago
- [ ] Validaciones de seguridad implementadas
- [ ] Tests de todos los flujos de pago (sin transacciones)
- [ ] Manejo robusto de errores

**Complejidad**: Alta
**Prioridad**: Alta
**Esfuerzo**: 1-1.5 semanas

---

## 👤 FASE 3: Gestión de Usuarios (Prioridad Media)

### 3.1 Login & Authentication - Sistema de Autenticación UCI

**Título**: Implementar Sistema de Login y Autenticación UCI

**Tipo**: Story

**Descripción**:
Desarrollar el sistema completo de autenticación UCI incluyendo login, logout, manejo de sesiones y integración con el flujo de compra para usuarios registrados.

**Complejidad**: Media
**Esfuerzo**: 1 semana

---

### 3.2 Signup - Sistema de Registro UCI

**Título**: Implementar Registro de Nuevos Usuarios UCI

**Tipo**: Story

**Descripción**:
Desarrollar el flujo completo de registro de nuevos usuarios UCI con validación de formularios, verificación de email y creación de cuentas.

**Complejidad**: Media  
**Esfuerzo**: 1 semana

---

### 3.3 Programs - Programas de Fidelización UCI

**Título**: Implementar Testing de Programas de Membresía UCI

**Tipo**: Story

**Descripción**:
Desarrollar tests para los programas de fidelización y membresía UCI, incluyendo validación de beneficios y aplicación de descuentos.

**Complejidad**: Baja
**Esfuerzo**: 3-4 días

---

## 📄 FASE 4: Contenido y Footer (Prioridad Baja)

### 4.1 Footer & Enlaces Institucionales UCI

**Título**: Implementar Footer y Validación de Enlaces Institucionales UCI

**Tipo**: Story

**Descripción**:
Desarrollar page object para footer UCI y tests de validación de todos los enlaces institucionales, políticas de privacidad, términos de servicio, etc.

**Complejidad**: Baja
**Esfuerzo**: 3-4 días

---

### 4.2 Blog UCI (Condicional)

**Título**: Investigar e Implementar Blog UCI si aplica

**Tipo**: Investigation + Story

**Descripción**:
Investigar si UCI tiene sistema de blog similar a Cinesa e implementar testing correspondiente si es necesario.

**Complejidad**: Baja
**Esfuerzo**: 2-3 días

---

## 📊 FASE 5: Utilidades y Análisis (Prioridad Baja)

### 5.1 Analytics & Mailing UCI

**Título**: Implementar Testing de Analytics y Newsletter UCI

**Tipo**: Story

**Descripción**:
Desarrollar validaciones para sistemas de tracking, analytics y newsletter de UCI Cinemas.

**Complejidad**: Baja
**Esfuerzo**: 3-4 días

---

### 5.2 Generic Components UCI

**Título**: Implementar Componentes Genéricos Reutilizables UCI

**Tipo**: Story

**Descripción**:
Desarrollar componentes y utilidades genéricas reutilizables específicas para UCI que no estén cubiertas por otros componentes.

**Complejidad**: Baja
**Esfuerzo**: 2-3 días

---

## 📋 RESUMEN PARA JIRA

**Total de Historias**: 15 stories principales
**Esfuerzo Total**: 7-9 semanas
**Prioridades**:

- 🔴 Alta: 7 stories (Fases 1 y 2)
- 🟡 Media: 3 stories (Fase 3)
- 🟢 Baja: 5 stories (Fases 4 y 5)

**Dependencias Críticas**:

1. Configuración de entornos UCI completa
2. Acceso a ambiente de staging UCI
3. Documentación de APIs UCI
4. Coordinación con equipo UCI para validaciones

**Riesgos Identificados**:

- Cambios en estructura de UCI durante desarrollo
- Complejidad del sistema de asientos mayor a estimada
- Limitaciones de acceso a ambiente de testing UCI
- Diferencias culturales/idioma en validaciones
