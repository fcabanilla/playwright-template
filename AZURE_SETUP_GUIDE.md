# Azure DevOps Pipeline Setup Guide

## ✅ PROBLEMA IDENTIFICADO
Azure DevOps requiere "parallelism grant" para usar hosted agents en proyectos gratuitos.

**Error encontrado:**
```
##[error]No hosted parallelism has been purchased or granted. To request a free parallelism grant, please fill out the following form https://aka.ms/azpipelines-parallelism-request
```

## 🚀 SOLUCIONES

### 1. Solicitar Parallelism Grant Gratuito (RECOMENDADO)

**Pasos:**
1. Ve a: https://aka.ms/azpipelines-parallelism-request
2. Llena el formulario con:
   - **Organization**: cinesaqa
   - **Project**: Automation
   - **Reason**: Playwright E2E testing with Allure reporting
3. Espera aprobación (1-3 días hábiles)

### 2. Mientras tanto: Usar GitHub Actions (YA FUNCIONA)

Tu workflow `.github/workflows/playwright-allure.yml` ya está funcionando perfectamente:
- ✅ Ejecuta tests con Playwright
- ✅ Genera reportes Allure
- ✅ Publica artifacts

**Para usar GitHub Actions:**
```bash
git push origin feature/allure_oficial
```

### 3. Configurar Self-hosted Agent (ALTERNATIVA)

Si necesitas Azure DevOps inmediatamente, puedes configurar un agente local:

```yaml
# En azure-pipelines.yml cambiar:
pool:
  name: 'Default'  # Tu pool de agentes locales
```

## 📊 ESTADO ACTUAL

### ✅ COMPLETADO:
- Azure Playwright Testing configurado
- Pipeline YAML creado correctamente
- Allure Report integración lista
- GitHub Actions funcionando

### ⏳ PENDIENTE:
- Parallelism grant de Azure DevOps
- Primera ejecución exitosa en Azure DevOps

## 🔄 PRÓXIMOS PASOS

1. **Solicitar parallelism grant**
2. **Una vez aprobado, ejecutar:**
   ```bash
   az pipelines run --id 1 --project "Automation" --branch "feature/allure_oficial"
   ```
3. **Verificar reportes Allure en Azure DevOps artifacts**

## 📋 COMANDOS ÚTILES

```bash
# Verificar status del pipeline
az pipelines runs list --project "Automation" --top 5

# Ejecutar pipeline manualmente
az pipelines run --id 1 --project "Automation" --branch "feature/allure_oficial"

# Ver logs detallados
az pipelines runs show --id [BUILD_ID] --project "Automation"
```

## 🎯 RESULTADO ESPERADO

Una vez aprobado el parallelism grant:
- ✅ Pipeline ejecutará tests automáticamente
- ✅ Generará reportes Allure
- ✅ Publicará artifacts en Azure DevOps
- ✅ Integración completa Azure + Allure funcionando
