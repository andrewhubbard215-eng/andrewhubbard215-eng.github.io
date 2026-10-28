@echo off
title Lincoln Tech HVAC Allstars
cd /d "%~dp0"

set URL=https://andrewhubbard215-eng.github.io/

echo.
echo  Lincoln Tech HVAC Allstars  —  Windows app window
echo.

where msedge >nul 2>&1
if %ERRORLEVEL%==0 (
  start "HVAC Allstars" msedge --app="%URL%" --window-size=1400,900
  goto :done
)
where chrome >nul 2>&1
if %ERRORLEVEL%==0 (
  start "HVAC Allstars" chrome --app="%URL%" --window-size=1400,900
  goto :done
)

echo  Edge/Chrome not found — opening in default browser.
start "" "%URL%"

:done
echo  Installed as an app: Edge or Chrome address bar → Install HVAC Allstars
echo  Offline: after first load, the PWA works without internet.
echo.
