# Check Windows Long Path Support Status
Write-Host "Checking Windows Long Path Support..." -ForegroundColor Cyan
Write-Host ""

try {
    $longPathsEnabled = Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -ErrorAction Stop
    $value = $longPathsEnabled.LongPathsEnabled
    
    if ($value -eq 1) {
        Write-Host "✓ Status: ENABLED" -ForegroundColor Green
        Write-Host "  Registry Value: $value" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Long Path Support is enabled in Windows." -ForegroundColor Green
        Write-Host ""
        Write-Host "However, some tools (like ninja/CMake) may still not respect it." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "If builds still fail with path length errors:" -ForegroundColor Yellow
        Write-Host "  1. Restart your computer (required after enabling)" -ForegroundColor White
        Write-Host "  2. Or move project to shorter path: C:\evolve-main -> C:\evolve" -ForegroundColor White
        Write-Host ""
        Write-Host "To verify after restart, run this script again." -ForegroundColor Cyan
    } else {
        Write-Host "✗ Status: DISABLED" -ForegroundColor Red
        Write-Host "  Registry Value: $value" -ForegroundColor Gray
        Write-Host ""
        Write-Host "To enable Long Path Support:" -ForegroundColor Yellow
        Write-Host "  1. Run PowerShell as Administrator" -ForegroundColor White
        Write-Host "  2. Execute:" -ForegroundColor White
        Write-Host "     Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem' -Name 'LongPathsEnabled' -Value 1 -Type DWord" -ForegroundColor Gray
        Write-Host "  3. Restart your computer" -ForegroundColor White
    }
} catch {
    Write-Host "✗ Status: NOT CONFIGURED" -ForegroundColor Red
    Write-Host ""
    Write-Host "The registry key doesn't exist, which means it's disabled by default." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To enable Long Path Support:" -ForegroundColor Yellow
    Write-Host "  1. Run PowerShell as Administrator" -ForegroundColor White
    Write-Host "  2. Execute:" -ForegroundColor White
    Write-Host "     Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem' -Name 'LongPathsEnabled' -Value 1 -Type DWord" -ForegroundColor Gray
    Write-Host "  3. Restart your computer" -ForegroundColor White
}

Write-Host ""
Write-Host "Current project path: C:\evolve-main" -ForegroundColor Cyan
Write-Host "Path length: 13 characters" -ForegroundColor Gray
Write-Host ""
Write-Host "Recommended: Move to C:\evolve for best compatibility" -ForegroundColor Green

