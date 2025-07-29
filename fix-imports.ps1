# Fix import statements after refactoring
Write-Host "Fixing import statements..." -ForegroundColor Green

# Update import statements in key files
$importFixes = @{
    "src/components/layout/Navbar.tsx" = @{
        "import DarkModeToggle from `"./DarkModeToggle`";" = "import DarkModeToggle from `"../common/DarkModeToggle`";"
        "import { LanguageSelector } from `"./LanguageSelector`";" = "import { LanguageSelector } from `"../common/LanguageSelector`";"
        "import { Logo } from `"./Logo`";" = "import { Logo } from `"../common/Logo`";"
        "import Login from `"./Auth/Login`";" = "import Login from `"../features/auth/Login`";"
        "import Signup from `"./Auth/Signup`";" = "import Signup from `"../features/auth/Signup`";"
        "import { useAuth } from `"../hooks/useContext`";" = "import { useAuth } from `"../../hooks/useContext`";"
        "import { useFavorites } from `"../hooks/useFavorites`";" = "import { useFavorites } from `"../../hooks/useFavorites`";"
        "import { useLanguage } from `"../hooks/useContext`";" = "import { useLanguage } from `"../../hooks/useContext`";"
        "import { hasPermission } from `"../utils/authUtils`";" = "import { hasPermission } from `"../../utils/authUtils`";"
    }
    
    "src/components/HomePage.tsx" = @{
        "import { AdvancedSearchDashboard } from `"./search/AdvancedSearchDashboard`";" = "import { AdvancedSearchDashboard } from `"./features/search/AdvancedSearchDashboard`";"
        "import { MiracleCard } from `"./MiracleCard`";" = "import { MiracleCard } from `"./features/miracles/MiracleCard`";"
        "import PaginationButton from `"./PaginationButton`";" = "import PaginationButton from `"./common/PaginationButton`";"
        "import { QuranDashboard } from `"./QuranDashboard`";" = "import { QuranDashboard } from `"./features/quran/QuranDashboard`";"
        "import { HadithDashboard } from `"./HadithDashboard`";" = "import { HadithDashboard } from `"./features/hadith/HadithDashboard`";"
    }
    
    "src/pages/Favorites.tsx" = @{
        "import Breadcrumb from `"../components/Breadcrumb`";" = "import Breadcrumb from `"../components/common/Breadcrumb`";"
        "import { MiracleCard } from `"../components/MiracleCard`";" = "import { MiracleCard } from `"../components/features/miracles/MiracleCard`";"
    }
    
    "src/pages/Profile.tsx" = @{
        "import Breadcrumb from `"../components/Breadcrumb`";" = "import Breadcrumb from `"../components/common/Breadcrumb`";"
    }
}

foreach ($file in $importFixes.Keys) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $updated = $false
        
        foreach ($fix in $importFixes[$file].GetEnumerator()) {
            if ($content -match [regex]::Escape($fix.Key)) {
                $content = $content -replace [regex]::Escape($fix.Key), $fix.Value
                $updated = $true
                Write-Host "Fixed import in $file" -ForegroundColor Yellow
            }
        }
        
        if ($updated) {
            Set-Content $file $content
        }
    }
}

Write-Host "Import fixes completed!" -ForegroundColor Green