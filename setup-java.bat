@echo off
REM Configuración de variables de entorno para Java
echo === Configurando Java para Allure ===

REM Establecer JAVA_HOME
set "JAVA_HOME=C:\Program Files\Microsoft\jdk-11.0.27.6-hotspot"

REM Agregar Java al PATH
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Java configurado correctamente
java -version

echo.
echo Variables configuradas:
echo JAVA_HOME=%JAVA_HOME%
echo PATH incluye: %JAVA_HOME%\bin

echo.
echo === Listo para usar Allure ===
