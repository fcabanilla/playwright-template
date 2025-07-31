# Analytics Tests - Google Analytics DataLayer Validation

Este módulo contiene las pruebas automatizadas para validar los eventos de Google Analytics en el sitio web de Cinesa.

## Estructura de Archivos

Siguiendo la convención del proyecto:

```
tests/cinesa/analytics/
├── analytics.spec.ts           # Tests principales de validación de Google Analytics
├── analytics.assertions.ts     # Funciones de validación y assertions
├── analytics.data.ts          # Datos de test y configuración
├── analytics.steps.ts         # Pasos reutilizables para los tests
└── README.md                  # Este archivo
```

```
pageObjectsManagers/cinesa/analytics/
├── analytics.page.ts          # Page Object para funcionalidades de Google Analytics
└── analytics.selectors.ts     # Selectores DOM para elementos de analytics
```

## Funcionalidad

### Objetivo Principal
Validar que los eventos de Google Analytics (`add_to_cart`, `begin_checkout`) se disparan correctamente durante el flujo de compra de entradas en Cinesa.

### Eventos Monitoreados
- **`add_to_cart`** - Al añadir entradas o productos F&B al carrito
- **`begin_checkout`** - Al iniciar el proceso de checkout/pago
- **`view_promotion`** - Al visualizar promociones

### Validaciones Realizadas
- ✅ Captura exitosa de eventos del dataLayer
- ✅ Estructura correcta de eventos (currency, value, items)
- ✅ Presencia de propiedades requeridas
- ✅ Rangos de precios razonables
- ✅ Identificación de productos (entradas + F&B)

## Ejecución

```bash
# Ejecutar todos los tests de analytics
npx playwright test tests/cinesa/analytics/

# Ejecutar con interfaz visual
npx playwright test tests/cinesa/analytics/ --ui

# Ejecutar test específico
npx playwright test tests/cinesa/analytics/analytics.spec.ts
```

## Funcionalidad

### Eventos Monitoreados

1. **add_to_cart** - Se dispara cuando:
   - Se añade una entrada de cine al carrito
   - Se añaden productos de food & beverage al carrito

2. **begin_checkout** - Se dispara cuando:
   - Se procede al resumen de compra y se muestra el total final

### Validaciones Realizadas

1. **Estructura de Eventos**: Verifica que los eventos tengan la estructura esperada
2. **Precios**: Compara los precios mostrados en la UI con los registrados en analytics
3. **Moneda**: Valida que se use EUR como moneda
4. **Categorías**: Verifica que las categorías sean 'Movie' para entradas y 'F&B' para comida/bebida
5. **Impuestos**: Analiza posibles discrepancias en el manejo de impuestos

### Uso

#### Test Principal
```bash
npx playwright test tests/cinesa/analytics/analytics.spec.ts
```

#### Test de Debug
```bash
npx playwright test tests/cinesa/analytics/analytics-debug.spec.ts
```

#### Con UI (para ver el flujo)
```bash
npx playwright test tests/cinesa/analytics/analytics.spec.ts --headed
```

## Estructura del DataLayer

### add_to_cart Event
```json
{
  "event": "add_to_cart",
  "gtm": {
    "startInTicks": 1753972012063
  },
  "ecommerce": {
    "items": [
      {
        "item_id": "HO00002297",
        "item_name": "Los 4 Fantásticos: Primeros pasos",
        "item_category": "Movie",
        "price": 12.15,
        "quantity": 1,
        "item_variant": "-Normal Luxe",
        "cinema_name": "Oasiz",
        "performance_date": "30/07/2025",
        "performance_time": "17:30"
      }
    ],
    "currency": "EUR"
  }
}
```

### begin_checkout Event
```json
{
  "event": "begin_checkout",
  "gtm": {
    "startInTicks": 1753972301740
  },
  "ecommerce": {
    "items": [
      {
        "item_id": "138-5233",
        "item_name": "MENU TIPOS MALOS VASO CH",
        "item_category": "F&B",
        "price": 17.1,
        "quantity": 1
      },
      {
        "item_id": "HO00002297",
        "item_name": "Los 4 Fantásticos: Primeros pasos",
        "item_category": "Movie",
        "price": 12.15,
        "quantity": 1
      }
    ],
    "currency": "EUR",
    "value": 30.1,
    "transaction_id": "8e8b9648130740558188ef41d5bd054a"
  }
}
```

## Problemas Conocidos

1. **Inconsistencias en Impuestos**: Se han detectado posibles discrepancias entre los impuestos mostrados en la UI y los calculados en analytics
2. **Timing de Eventos**: Los eventos pueden dispararse en momentos ligeramente diferentes dependiendo de la carga de la página
3. **Selectors de UI**: Los selectores para extraer precios de la UI pueden necesitar ajustes según cambios en el frontend

## Próximos Pasos

1. Ampliar la cobertura a otros cines (Grancasa, etc.)
2. Validar otros eventos de analytics (view_promotion, purchase, etc.)
3. Añadir tests para diferentes tipos de entradas (premium, etc.)
4. Implementar tests para múltiples entradas
5. Validar tracking de descuentos y promociones
