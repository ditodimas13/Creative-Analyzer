# Script untuk menambahkan Git ke PATH Environment Variable
# Gunakan script ini jika Git di-install ke lokasi custom

param(
    [Parameter(Mandatory=$true)]
    [string]$GitPath
)

Write-Host "Menambahkan Git ke PATH..." -ForegroundColor Yellow

# Validasi path
if (-not (Test-Path $GitPath)) {
    Write-Host "Error: Path tidak ditemukan: $GitPath" -ForegroundColor Red
    exit 1
}

# Cek apakah sudah ada di PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -like "*$GitPath*") {
    Write-Host "Git sudah ada di PATH" -ForegroundColor Green
    exit 0
}

# Tambahkan ke PATH
try {
    $newPath = $currentPath + ";" + $GitPath
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "✓ Git berhasil ditambahkan ke PATH" -ForegroundColor Green
    Write-Host ""
    Write-Host "PENTING: Restart PowerShell atau buka terminal baru untuk menggunakan Git" -ForegroundColor Yellow
} catch {
    Write-Host "Error: Gagal menambahkan ke PATH" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

