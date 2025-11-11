# Script to enable Windows Long Path Support
# Run this as Administrator to fix the 260 character path limit issue

Write-Host "Checking if Long Path Support is enabled..." -ForegroundColor Yellow

$registryPath = "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem"
$propertyName = "LongPathsEnabled"
$propertyValue = Get-ItemProperty -Path $registryPath -Name $propertyName -ErrorAction SilentlyContinue

if ($propertyValue.LongPathsEnabled -eq 1) {
    Write-Host "Long Path Support is already enabled!" -ForegroundColor Green
} else {
    Write-Host "Long Path Support is disabled. Enabling now..." -ForegroundColor Yellow
    
    # Check if running as administrator
    $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    
    if (-not $isAdmin) {
        Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
        Write-Host "Right-click PowerShell and select 'Run as Administrator', then run this script again." -ForegroundColor Yellow
        exit 1
    }
    
    try {
        Set-ItemProperty -Path $registryPath -Name $propertyName -Value 1 -Type DWord
        Write-Host "Long Path Support has been enabled successfully!" -ForegroundColor Green
        Write-Host "You may need to restart your computer for the changes to take effect." -ForegroundColor Yellow
    } catch {
        Write-Host "ERROR: Failed to enable Long Path Support: $_" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`nAfter enabling (and restarting if needed), try building again with:" -ForegroundColor Cyan
Write-Host "  cd android" -ForegroundColor White
Write-Host "  .\gradlew clean" -ForegroundColor White
Write-Host "  .\gradlew assembleRelease" -ForegroundColor White


