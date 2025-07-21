# Script para verificar estado de Azure Playwright Testing
# PowerShell script to check Azure Playwright Testing features status

Write-Host "=== Verificando Estado de Azure Playwright Testing ===" -ForegroundColor Green

try {
    # Obtener token de acceso
    Write-Host "Obteniendo token de acceso..." -ForegroundColor Yellow
    $token = (az account get-access-token --query accessToken -o tsv)
    
    if (-not $token) {
        Write-Host "Error: No se pudo obtener token. Ejecuta 'az login' primero." -ForegroundColor Red
        exit 1
    }

    # Configurar headers
    $headers = @{ Authorization = "Bearer $token" }
    
    # Consultar estado del servicio
    Write-Host "Consultando estado del workspace..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "https://westeurope.api.playwright.microsoft.com/accounts/westeurope_1f9793c4-7905-4e6a-b9aa-b9d47e97333c" -Headers $headers
    
    Write-Host "`n=== ESTADO ACTUAL ===" -ForegroundColor Cyan
    Write-Host "Workspace: $($response.name)" -ForegroundColor White
    Write-Host "ID: $($response.id)" -ForegroundColor White
    Write-Host "Estado: $($response.state)" -ForegroundColor White
    Write-Host "Ubicación: $($response.location)" -ForegroundColor White
    
    Write-Host "`n=== FEATURES DISPONIBLES ===" -ForegroundColor Cyan
    
    # Regional Affinity
    $regionalStatus = if ($response.regionalAffinity -eq "Enabled") { "✅ HABILITADO" } else { "❌ DESHABILITADO" }
    Write-Host "Regional Affinity: $regionalStatus" -ForegroundColor $(if ($response.regionalAffinity -eq "Enabled") { "Green" } else { "Red" })
    
    # Scalable Execution (Cloud Browsers)
    $scalableStatus = if ($response.scalableExecution -eq "Enabled") { "✅ HABILITADO" } else { "❌ DESHABILITADO" }
    Write-Host "Scalable Execution (Grant): $scalableStatus" -ForegroundColor $(if ($response.scalableExecution -eq "Enabled") { "Green" } else { "Red" })
    
    # Reporting
    $reportingStatus = if ($response.reporting -eq "Enabled") { "✅ HABILITADO" } else { "❌ DESHABILITADO" }
    Write-Host "Reporting: $reportingStatus" -ForegroundColor $(if ($response.reporting -eq "Enabled") { "Green" } else { "Red" })
    
    # Local Auth (Cloud Browsers)
    $localAuthStatus = if ($response.localAuth -eq "Enabled") { "✅ HABILITADO" } else { "❌ DESHABILITADO" }
    Write-Host "Local Auth (Cloud Browsers): $localAuthStatus" -ForegroundColor $(if ($response.localAuth -eq "Enabled") { "Green" } else { "Red" })
    
    Write-Host "`n=== INTERPRETACIÓN ===" -ForegroundColor Magenta
    
    if ($response.scalableExecution -eq "Enabled" -and $response.reporting -eq "Enabled") {
        Write-Host "✅ GRANT APROBADO: Puedes usar hosted agents en Azure DevOps" -ForegroundColor Green
    }
    
    if ($response.localAuth -eq "Enabled") {
        Write-Host "✅ CLOUD BROWSERS: Puedes usar navegadores en la nube" -ForegroundColor Green
        Write-Host "   Comando: npm run test:azure:navbar" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  CLOUD BROWSERS: Aún no disponibles (localAuth: Disabled)" -ForegroundColor Yellow
        Write-Host "   Solución: Usar local browsers + Azure reporting" -ForegroundColor Cyan
        Write-Host "   Comando: npm run test:navbar" -ForegroundColor Cyan
    }
    
    if ($response.reporting -eq "Enabled") {
        Write-Host "✅ AZURE REPORTING: Resultados se suben a Azure automáticamente" -ForegroundColor Green
        Write-Host "   Dashboard: https://playwright.microsoft.com/workspaces/$($response.id)" -ForegroundColor Cyan
    }
    
    Write-Host "`n=== PRÓXIMOS PASOS ===" -ForegroundColor Magenta
    
    if ($response.scalableExecution -eq "Enabled") {
        Write-Host "1. ✅ Usar Azure DevOps con hosted agents (vmImage: windows-latest)" -ForegroundColor Green
    } else {
        Write-Host "1. ⏳ Esperar aprobación del grant de Microsoft" -ForegroundColor Yellow
    }
    
    if ($response.localAuth -eq "Disabled") {
        Write-Host "2. ⏳ Esperar habilitación de cloud browsers" -ForegroundColor Yellow
        Write-Host "   (Puede tardar adicional después del grant)" -ForegroundColor Gray
    } else {
        Write-Host "2. ✅ Usar cloud browsers con test:azure:navbar" -ForegroundColor Green
    }
    
    Write-Host "3. ✅ Continuar usando local browsers + Azure reporting" -ForegroundColor Green
    
} catch {
    Write-Host "Error al verificar estado: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== COMANDOS ÚTILES ===" -ForegroundColor Cyan
Write-Host "Ver este estado: .\check-azure-features.ps1" -ForegroundColor White
Write-Host "Tests locales + Azure reporting: npm run test:navbar" -ForegroundColor White
Write-Host "Tests con cloud browsers: npm run test:azure:navbar" -ForegroundColor White
