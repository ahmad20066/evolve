# Script to create a shorter path junction for building APK
# This creates a junction at C:\evolve that points to C:\evolve-main
# This significantly shortens the build paths

Write-Host "Creating junction to shorten build paths..." -ForegroundColor Yellow

$junctionPath = "C:\evolve"
$targetPath = "C:\evolve-main"

# Check if junction already exists
if (Test-Path $junctionPath) {
    Write-Host "Junction already exists at $junctionPath" -ForegroundColor Yellow
    $existingTarget = (Get-Item $junctionPath).Target
    if ($existingTarget -eq $targetPath) {
        Write-Host "Junction is already correctly configured!" -ForegroundColor Green
        Write-Host "`nTo build APK, use:" -ForegroundColor Cyan
        Write-Host "  cd C:\evolve\android" -ForegroundColor White
        Write-Host "  .\gradlew assembleRelease" -ForegroundColor White
        exit 0
    } else {
        Write-Host "Removing existing junction..." -ForegroundColor Yellow
        Remove-Item $junctionPath -Force
    }
}

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator to create a junction!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator', then run this script again." -ForegroundColor Yellow
    Write-Host "`nAlternatively, you can manually create the junction:" -ForegroundColor Cyan
    Write-Host "  mklink /J C:\evolve C:\evolve-main" -ForegroundColor White
    exit 1
}

try {
    # Create the junction
    New-Item -ItemType Junction -Path $junctionPath -Target $targetPath -Force | Out-Null
    Write-Host "Junction created successfully!" -ForegroundColor Green
    Write-Host "  Junction: $junctionPath" -ForegroundColor White
    Write-Host "  Target:   $targetPath" -ForegroundColor White
    
    Write-Host "`nNow build the APK using the shorter path:" -ForegroundColor Cyan
    Write-Host "  cd C:\evolve\android" -ForegroundColor White
    Write-Host "  .\gradlew clean" -ForegroundColor White
    Write-Host "  .\gradlew assembleRelease" -ForegroundColor White
} catch {
    Write-Host "ERROR: Failed to create junction: $_" -ForegroundColor Red
    Write-Host "`nTry creating it manually:" -ForegroundColor Yellow
    Write-Host "  mklink /J C:\evolve C:\evolve-main" -ForegroundColor White
    exit 1
}


