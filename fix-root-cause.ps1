# ============================================================================
# PERMANENT SOLUTION: Move Project to Shorter Path
# ============================================================================
# This is the BEST solution to fix the Windows 260-character path limit issue
# permanently. Moving the project to a shorter path eliminates all path length
# problems.
#
# Steps:
# 1. Close all terminals, IDEs, and applications using the project
# 2. Move the entire project folder to a shorter path
# 3. Update any IDE/editor workspace paths
# 4. Rebuild
#
# Recommended paths:
#   - C:\evolve          (shortest)
#   - C:\proj\evolve     (if you have multiple projects)
#   - C:\dev\evolve      (if you have multiple projects)
# ============================================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PERMANENT FIX: Move Project Path" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$currentPath = "C:\evolve-main"
$recommendedPaths = @(
    "C:\evolve",
    "C:\proj\evolve",
    "C:\dev\evolve"
)

Write-Host "Current project path: $currentPath" -ForegroundColor Yellow
Write-Host ""
Write-Host "Recommended shorter paths:" -ForegroundColor Green
for ($i = 0; $i -lt $recommendedPaths.Length; $i++) {
    Write-Host "  $($i + 1). $($recommendedPaths[$i])" -ForegroundColor White
}
Write-Host ""

$choice = Read-Host "Enter number (1-3) or custom path"

if ($choice -match '^\d+$' -and [int]$choice -ge 1 -and [int]$choice -le 3) {
    $newPath = $recommendedPaths[[int]$choice - 1]
} else {
    $newPath = $choice
}

if (-not $newPath -or $newPath -eq "") {
    Write-Host "No path selected. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "IMPORTANT: Before moving, ensure:" -ForegroundColor Yellow
Write-Host "  1. All terminals/IDEs are CLOSED" -ForegroundColor White
Write-Host "  2. No processes are using the project folder" -ForegroundColor White
Write-Host "  3. Git is not running any operations" -ForegroundColor White
Write-Host ""
$confirm = Read-Host "Ready to move? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

# Check if target exists
if (Test-Path $newPath) {
    Write-Host "ERROR: Target path already exists: $newPath" -ForegroundColor Red
    Write-Host "Please choose a different path or delete the existing folder." -ForegroundColor Yellow
    exit 1
}

try {
    Write-Host "Moving project from $currentPath to $newPath..." -ForegroundColor Yellow
    Move-Item -Path $currentPath -Destination $newPath -Force
    Write-Host ""
    Write-Host "SUCCESS! Project moved successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Open your IDE/editor and update the workspace path" -ForegroundColor White
    Write-Host "  2. Open terminal in the new location:" -ForegroundColor White
    Write-Host "     cd $newPath\android" -ForegroundColor Gray
    Write-Host "  3. Build the APK:" -ForegroundColor White
    Write-Host "     .\gradlew clean" -ForegroundColor Gray
    Write-Host "     .\gradlew assembleRelease" -ForegroundColor Gray
    Write-Host ""
    Write-Host "The APK will be at: $newPath\android\app\build\outputs\apk\release\app-release.apk" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to move project: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual steps:" -ForegroundColor Yellow
    Write-Host "  1. Close all applications" -ForegroundColor White
    Write-Host "  2. Open File Explorer" -ForegroundColor White
    Write-Host "  3. Cut the folder: $currentPath" -ForegroundColor White
    Write-Host "  4. Paste it to: $newPath" -ForegroundColor White
    exit 1
}
