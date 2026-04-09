@echo off
echo === Legend of Helsinki — Build ===
echo.

:: Check for node_modules
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    echo.
)

:: Build portable exe
echo Building portable executable...
call npx electron-builder --win portable

:: Copy to root
echo.
for %%f in (dist\Legend-of-Helsinki-v*.exe) do (
    copy "%%f" . >nul
    echo Built: %%~nxf
)

echo.
echo Done! The .exe is in the current folder.
pause
