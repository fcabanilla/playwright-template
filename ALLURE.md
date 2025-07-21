# Allure Reports Integration

Configuración completa de Allure Reporter para generar reportes HTML hermosos y detallados.

## 🎯 Setup Completo

### Prerrequisitos
- **Java 11+**: Requerido para Allure CLI
- **Allure CLI**: Se instala automáticamente en pipeline

### Verificar Java
```bash
java -version
# Si falla, Java se configura automáticamente en el script
```

## 🚀 Ejecutar y Generar Reportes

### Opción 1: Script Automatizado (Recomendado)
```bash
.\run-tests-with-allure.ps1
```
**Hace todo**: Configura Java → Ejecuta tests → Genera reporte → Pregunta si abrir

### Opción 2: Comandos Individuales
```bash
# 1. Ejecutar tests (genera allure-results)
npm run test:navbar

# 2. Generar reporte HTML
npx allure generate allure-results --clean -o allure-report

# 3. Abrir reporte
npx allure open allure-report
```

## 📁 Estructura de Archivos

```
├── allure-results/          # Datos raw de tests (JSON)
├── allure-report/           # Reporte HTML generado
│   ├── index.html          # Página principal del reporte
│   ├── data/               # Datos del reporte
│   └── widgets/            # Gráficos y widgets
└── run-tests-with-allure.ps1  # Script automatizado
```

## 📊 Características del Reporte

### Información Incluida
- ✅ **Resumen ejecutivo**: Pass/Fail, duración, tendencias
- ✅ **Tests por suites**: Organizados por archivos
- ✅ **Screenshots**: Solo en fallos
- ✅ **Videos**: Solo en fallos  
- ✅ **Logs detallados**: Pasos de cada test
- ✅ **Timeline**: Ejecución paralela visualizada
- ✅ **Categorías**: Tipos de errores agrupados

### Widgets Disponibles
- **Overview**: Estadísticas generales
- **Categories**: Fallos por categoría
- **Suites**: Tests por archivo
- **Graphs**: Gráficos de tendencia
- **Timeline**: Línea temporal de ejecución
- **Behaviors**: Tests por funcionalidad

## 🔧 Configuración

### En playwright.config.ts
```typescript
reporter: [
  [
    'allure-playwright',
    {
      detail: false,
      outputFolder: 'allure-results',
      suiteTitle: false,
    }
  ]
]
```

### En Azure DevOps Pipeline
El pipeline automáticamente:
1. **Instala Java**: `JavaToolInstaller@0`
2. **Instala Allure CLI**: `npm install -g allure-commandline`
3. **Genera reporte**: `allure generate allure-results --clean -o allure-report`
4. **Publica artefactos**: Ambos `allure-results` y `allure-report`

## 📋 Comandos Útiles

```bash
# Ver reporte existente
Start-Process ".\allure-report\index.html"

# Limpiar resultados anteriores
Remove-Item allure-results -Recurse -Force
Remove-Item allure-report -Recurse -Force

# Solo generar reporte (sin ejecutar tests)
npx allure generate allure-results --clean -o allure-report

# Generar y abrir automáticamente
npx allure serve allure-results
```

## 🔍 Troubleshooting

### Error: JAVA_HOME not set
**Solución**: Ejecutar `.\run-tests-with-allure.ps1` (configura Java automáticamente)

### Error: allure command not found
**Solución**: 
```bash
npm install -g allure-commandline
```

### Reporte vacío o sin datos
**Causa**: No hay archivos en `allure-results/`  
**Solución**: Ejecutar tests primero (`npm run test:navbar`)
