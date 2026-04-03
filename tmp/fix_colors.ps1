$files = Get-ChildItem -Path "d:\WORK\final SSSLM\app_frontend\src" -Filter *.jsx -Recurse
foreach ($file in $files) {
    Write-Host "Processing $($file.FullName)..."
    $content = Get-Content $file.FullName -Raw
    $content = $content -replace 'text-gray-900', 'text-[var(--color-text-primary)]'
    $content = $content -replace 'text-gray-800', 'text-[var(--color-text-primary)]'
    $content = $content -replace 'text-gray-700', 'text-[var(--color-text-secondary)]'
    $content = $content -replace 'text-gray-600', 'text-[var(--color-text-secondary)]'
    $content = $content -replace 'text-gray-500', 'text-[var(--color-text-muted)]'
    $content = $content -replace 'text-black', 'text-[var(--color-text-primary)]'
    $content = $content -replace 'bg-white', 'bg-[var(--color-surface)]'
    $content = $content -replace 'bg-gray-50', 'bg-[var(--color-surface-2)]'
    $content = $content -replace 'bg-gray-100', 'bg-[var(--color-surface-2)]'
    $content = $content -replace 'border-gray-200', 'border-[var(--color-border)]'
    $content = $content -replace 'border-gray-100', 'border-[var(--color-border)]'
    Set-Content -Path $file.FullName -Value $content -Encoding utf8
}
Write-Host "Finished fixing colors."
