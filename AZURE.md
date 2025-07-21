# Azure Playwright Testing Integration

Configuración completa de Azure Playwright Testing con Azure DevOps Pipeline.

## 🎯 Estado Actual

### ✅ Funcional
- **Grant aprobado**: `scalableExecution: Enabled`
- **Azure DevOps Pipeline**: Con hosted agents (`vmImage: windows-latest`)
- **Azure Reporting**: Tests reportan automáticamente a Azure Dashboard
- **Allure Integration**: Reportes HTML automáticos en pipeline

### ⏳ Pendiente
- **Cloud Browsers**: `localAuth: Disabled` (esperando activación de Microsoft)

## 🚀 Setup Rápido

### 1. Azure CLI
```bash
az login
```

### 2. Verificar Estado
```bash
.\check-azure-features.ps1
```

### 3. Ejecutar Tests
```bash
# Local browsers + Azure reporting (recomendado)
npm run test:navbar

# Cloud browsers (cuando esté disponible)
npm run test:azure:navbar
```

## 📊 Dashboards

- **Azure Dashboard**: https://playwright.microsoft.com/workspaces/westeurope_1f9793c4-7905-4e6a-b9aa-b9d47e97333c
- **Pipeline Azure DevOps**: https://dev.azure.com/cinesaqa/Automation

## 🔧 Configuraciones

### Local + Azure Reporting (Actual)
```typescript
// playwright.local.config.ts
reporter: [
  ['@azure/microsoft-playwright-testing/reporter']
]
```

### Cloud Browsers (Futuro)
```typescript
// playwright.service.config.ts
useCloudHostedBrowsers: true
```

## 🛠️ Pipeline Azure DevOps

El pipeline (`azure-pipelines.yml`) ejecuta automáticamente en cada push:
1. Instala dependencias
2. Ejecuta tests con browsers locales + Azure reporting
3. Genera reportes Allure
4. Publica artefactos

## 📋 Variables de Entorno

```bash
PLAYWRIGHT_SERVICE_URL=wss://westeurope.api.playwright.microsoft.com/accounts/westeurope_1f9793c4-7905-4e6a-b9aa-b9d47e97333c
```

## 🔍 Troubleshooting

### Error: localAuth Disabled
**Problema**: No se pueden usar cloud browsers  
**Solución**: Usar `npm run test:navbar` (local browsers + Azure reporting)

### Error: No parallelism grant
**Problema**: Pipeline falla en hosted agents  
**Solución**: Grant ya aprobado, usar `vmImage: windows-latest`
