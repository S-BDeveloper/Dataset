# Refactoring script for better code organization
Write-Host "Starting codebase refactoring..." -ForegroundColor Green

# Create new directory structure
$directories = @(
    "src/components/features/miracles",
    "src/components/features/quran", 
    "src/components/features/hadith",
    "src/components/features/auth",
    "src/components/features/search",
    "src/components/features/charts",
    "src/components/layout",
    "src/components/common",
    "src/hooks/domain",
    "src/utils/validation",
    "src/services",
    "src/config"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
        Write-Host "Created directory: $dir" -ForegroundColor Yellow
    }
}

# Move components to feature-based structure
$componentMoves = @{
    "src/components/MiracleCard.tsx" = "src/components/features/miracles/MiracleCard.tsx"
    "src/components/QuranCard.tsx" = "src/components/features/quran/QuranCard.tsx"
    "src/components/QuranDashboard.tsx" = "src/components/features/quran/QuranDashboard.tsx"
    "src/components/HadithCard.tsx" = "src/components/features/hadith/HadithCard.tsx"
    "src/components/HadithDashboard.tsx" = "src/components/features/hadith/HadithDashboard.tsx"
    "src/components/Auth/Login.tsx" = "src/components/features/auth/Login.tsx"
    "src/components/Auth/Signup.tsx" = "src/components/features/auth/Signup.tsx"
    "src/components/search/SmartSearchBar.tsx" = "src/components/features/search/SmartSearchBar.tsx"
    "src/components/search/AdvancedSearchDashboard.tsx" = "src/components/features/search/AdvancedSearchDashboard.tsx"
    "src/components/charts/PropheticStatusChart.tsx" = "src/components/features/charts/PropheticStatusChart.tsx"
    "src/components/charts/SignTypesChart.tsx" = "src/components/features/charts/SignTypesChart.tsx"
    "src/components/Navbar.tsx" = "src/components/layout/Navbar.tsx"
    "src/components/Footer.tsx" = "src/components/layout/Footer.tsx"
    "src/components/ErrorBoundary.tsx" = "src/components/layout/ErrorBoundary.tsx"
    "src/components/LoadingSkeleton.tsx" = "src/components/common/LoadingSkeleton.tsx"
    "src/components/PaginationButton.tsx" = "src/components/common/PaginationButton.tsx"
    "src/components/Breadcrumb.tsx" = "src/components/common/Breadcrumb.tsx"
}

foreach ($move in $componentMoves.GetEnumerator()) {
    if (Test-Path $move.Key) {
        Move-Item $move.Key $move.Value -Force
        Write-Host "Moved: $($move.Key) -> $($move.Value)" -ForegroundColor Cyan
    }
}

# Create index files for features
$features = @("miracles", "quran", "hadith", "auth", "search", "charts", "layout", "common")

foreach ($feature in $features) {
    $indexContent = @"
// $feature feature exports
export * from './$feature';
"@
    Set-Content "src/components/features/$feature/index.ts" $indexContent
    Write-Host "Created index file for $feature feature" -ForegroundColor Yellow
}

Write-Host "Refactoring completed successfully!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update import statements in all files" -ForegroundColor White
Write-Host "2. Run 'npm run build' to check for errors" -ForegroundColor White
Write-Host "3. Update any remaining import paths" -ForegroundColor White