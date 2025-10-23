@echo off
REM =====================================================
REM Script de Configuración - TechSalle Backend (Windows)
REM =====================================================

echo Iniciando configuración de TechSalle Backend...
echo.

REM Verificar si Node.js está instalado
echo [INFO] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado
    echo [INFO] Instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [SUCCESS] Node.js encontrado: %NODE_VERSION%
)

REM Verificar si npm está instalado
echo [INFO] Verificando npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm no está instalado
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo [SUCCESS] npm encontrado: %NPM_VERSION%
)

REM Verificar si MySQL está instalado
echo [INFO] Verificando MySQL...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] MySQL no encontrado en PATH
    echo [INFO] Asegúrate de tener MySQL instalado y accesible
) else (
    for /f "tokens=*" %%i in ('mysql --version') do set MYSQL_VERSION=%%i
    echo [SUCCESS] MySQL encontrado: %MYSQL_VERSION%
)

echo.

REM Instalar dependencias
echo [INFO] Instalando dependencias de Node.js...
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Error al instalar dependencias
    pause
    exit /b 1
) else (
    echo [SUCCESS] Dependencias instaladas correctamente
)

echo.

REM Crear archivo .env si no existe
if not exist .env (
    echo [INFO] Creando archivo .env...
    if exist env.example (
        copy env.example .env >nul
        echo [SUCCESS] Archivo .env creado desde env.example
        echo [WARNING] IMPORTANTE: Edita el archivo .env con tus configuraciones
    ) else (
        echo [ERROR] Archivo env.example no encontrado
        pause
        exit /b 1
    )
) else (
    echo [WARNING] Archivo .env ya existe, no se sobrescribirá
)

REM Crear directorio de logs
echo [INFO] Creando directorio de logs...
if not exist logs (
    mkdir logs
    echo [SUCCESS] Directorio logs creado
) else (
    echo [INFO] Directorio logs ya existe
)

echo.

REM Configurar base de datos
echo [INFO] Configurando base de datos...
if not exist src\database\schema.sql (
    echo [ERROR] Archivo src\database\schema.sql no encontrado
    pause
    exit /b 1
)

echo [INFO] Para configurar la base de datos, ejecuta los siguientes comandos:
echo.
echo 1. Conectar a MySQL:
echo    mysql -u root -p
echo.
echo 2. Crear base de datos:
echo    CREATE DATABASE techsalle_db;
echo.
echo 3. Salir de MySQL y ejecutar:
echo    mysql -u root -p techsalle_db ^< src\database\schema.sql
echo.
echo 4. (Opcional) Insertar datos de ejemplo:
echo    mysql -u root -p techsalle_db ^< src\database\seeders\sample_data.sql
echo.

set /p DB_CONFIG="¿Has configurado la base de datos? (y/n): "
if /i not "%DB_CONFIG%"=="y" (
    echo [WARNING] Configura la base de datos antes de continuar
)

echo.

REM Verificar configuración
echo [INFO] Verificando configuración...

if exist package.json (
    echo [SUCCESS] package.json encontrado
) else (
    echo [ERROR] package.json no encontrado
    pause
    exit /b 1
)

if exist .env (
    echo [SUCCESS] Archivo .env encontrado
) else (
    echo [ERROR] Archivo .env no encontrado
    pause
    exit /b 1
)

if exist src (
    echo [SUCCESS] Directorio src encontrado
) else (
    echo [ERROR] Directorio src no encontrado
    pause
    exit /b 1
)

if exist logs (
    echo [SUCCESS] Directorio logs encontrado
) else (
    echo [ERROR] Directorio logs no encontrado
    pause
    exit /b 1
)

echo.
echo [SUCCESS] ¡Configuración completada!
echo.
echo Próximos pasos:
echo 1. Edita el archivo .env con tus configuraciones
echo 2. Configura la base de datos siguiendo las instrucciones
echo 3. Ejecuta 'npm run dev' para iniciar el servidor
echo.
echo Para más información, consulta:
echo - README.md - Documentación general
echo - INSTALACION.md - Guía detallada de instalación
echo - API_DOCUMENTATION.md - Documentación de la API
echo.
echo [SUCCESS] ¡Disfruta desarrollando con TechSalle! 🚀
echo.
pause
