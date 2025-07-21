# Script para ejecutar tests de Playwright y generar reporte de Allure
# PowerShell script to run Playwright tests and generate Allure report

Write-Host "=== Configurando entorno Java ===" -ForegroundColor Green
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-11.0.27.6-hotspot"
$env:PATH += ";$env:JAVA_HOME\bin"

Write-Host "Verificando Java..." -ForegroundColor Yellow
java -version

Write-Host "`n=== Ejecutando tests de Playwright ===" -ForegroundColor Green
npm run test:navbar

Write-Host "`n=== Generando reporte de Allure ===" -ForegroundColor Green
npx allure generate allure-results --clean -o allure-report

Write-Host "`n=== Reporte generado exitosamente ===" -ForegroundColor Green
Write-Host "Para ver el reporte, ejecuta: npx allure open allure-report" -ForegroundColor Cyan
Write-Host "O abre directamente: .\allure-report\index.html" -ForegroundColor Cyan

# Opcional: abrir el reporte automáticamente
$openReport = Read-Host "`n¿Quieres abrir el reporte ahora? (y/n)"
if ($openReport -eq "y" -or $openReport -eq "Y") {
    Start-Process ".\allure-report\index.html"
}
