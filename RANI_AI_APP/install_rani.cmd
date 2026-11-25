@echo off
rem ============================================================
rem  RANI — one-click install
rem  1) pip se RANI install/upgrade
rem  2) Windows startup ON  (PC start/restart par RANI orb ke saath khud chalu)
rem  3) RANI abhi background mein chalu (screen par mini orb)
rem ============================================================
title RANI install
echo.
echo  [1/2] RANI install ho rahi hai...
python -m pip install --upgrade rani-ai-assistant
if errorlevel 1 (
    echo.
    echo  [X] pip install fail hua. Internet / Python (3.10+) check karo.
    pause
    exit /b 1
)
echo.
echo  [2/2] Startup set ho raha hai aur RANI chalu ho rahi hai...
python -m rani install
echo.
echo  Done! RANI ka orb screen par aa jayega. Orb par click karke controls dekho,
echo  double-click karke RANI kholo. Band karna ho to:  python -m rani uninstall
echo.
pause
