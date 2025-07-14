@echo off
echo 🔄 Test SSH automatique pour TalkKin OVH
echo ==========================================

:loop
echo.
echo [%time%] Test SSH activation...
timeout /t 1 >nul 2>&1
ssh -o ConnectTimeout=3 talkkij@ssh.cluster100.hosting.ovh.net -p 22 "echo SSH_OK" 2>nul
if %errorlevel% equ 0 (
    echo ✅ SSH ACTIVÉ ! Vous pouvez maintenant vous connecter !
    echo ssh talkkij@ssh.cluster100.hosting.ovh.net -p 22
    pause
    goto end
) else (
    echo ❌ SSH pas encore activé - nouvelle tentative dans 5 minutes...
    timeout /t 300 >nul
    goto loop
)

:end
