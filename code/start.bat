@echo off
cd /d "%~dp0"
echo ========================================================
echo   LA BONITA JOYERIA - Servidor Local
echo ========================================================
if exist "..\Nueva carpeta\Luxury_jewelry_video_loop_4K_20260915233606.mp4" (
    echo [Video 4K] Sincronizando video de fondo del Hero...
    copy /Y "..\Nueva carpeta\Luxury_jewelry_video_loop_4K_20260915233606.mp4" "assets\Luxury_jewelry_video_loop_4K_20260915233606.mp4" >nul 2>&1
    copy /Y "..\Nueva carpeta\Luxury_jewelry_video_loop_4K_20260915233606.mp4" "assets\luxury-jewelry-hero-film.mp4" >nul 2>&1
    echo [Video 4K] Sincronizacion completada con exito.
)
echo Abriendo en: http://localhost:5173
echo ========================================================
start http://localhost:5173
node server.js
pause

