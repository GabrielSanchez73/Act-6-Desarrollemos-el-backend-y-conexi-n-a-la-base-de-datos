@echo off
chcp 65001 >nul
title TechSalle - Sistema de Gestión de Productos Tecnológicos

echo.
echo ========================================
echo TECHSALLE - SISTEMA DE PRODUCTOS
echo ========================================
echo.
echo Iniciando verificación del sistema...
echo.

:: Verificar si Node.js está instalado
echo Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no está instalado o no está en el PATH
    echo    Por favor, instala Node.js desde: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo Node.js encontrado: 
node --version

:: Verificar si MySQL está ejecutándose
echo.
echo Verificando MySQL...
netstat -an | findstr ":3306" >nul 2>&1
if %errorlevel% neq 0 (
    echo ADVERTENCIA: MySQL no parece estar ejecutándose en el puerto 3306
    echo    Asegúrate de que MySQL esté iniciado antes de continuar
    echo.
) else (
    echo MySQL está ejecutándose en el puerto 3306
)

echo.
echo ========================================
echo INICIANDO SISTEMA TECHSALLE
echo ========================================
echo.
echo El sistema se iniciará en dos ventanas separadas:
echo   1. Backend (API) - Puerto 5000
echo   2. Frontend (React) - Puerto 4000
echo.
echo Iniciando en 3 segundos...
timeout /t 3 /nobreak >nul

:: Iniciar backend en nueva ventana
echo Iniciando backend...
start "TechSalle Backend" cmd /k "cd /d %~dp0server && echo Iniciando backend en puerto 5000... && npm start"

:: Esperar un momento para que el backend se inicie
timeout /t 5 /nobreak >nul

:: Iniciar frontend en nueva ventana
echo Iniciando frontend...
start "TechSalle Frontend" cmd /k "cd /d %~dp0client && echo Iniciando frontend en puerto 4000... && npm start"

echo.
echo ========================================
echo SISTEMA TECHSALLE INICIADO
echo ========================================
echo.
echo Frontend: http://localhost:4000
echo Backend:  http://localhost:5000
echo.
echo Para detener el sistema, cierra las ventanas del backend y frontend
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
