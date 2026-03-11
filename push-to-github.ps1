# Script untuk push project ke GitHub
# Script ini akan membantu Anda dari awal sampai push ke GitHub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Push Project ke GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Cek apakah Git tersedia
$gitExe = $null
$gitPaths = @(
    "git",  # Cek di PATH
    "C:\Program Files\Git\bin\git.exe",
    "C:\Program Files (x86)\Git\bin\git.exe",
    "$env:USERPROFILE\AppData\Local\Programs\Git\bin\git.exe",
    "$env:ProgramFiles\Git\cmd\git.exe",
    "D:\Tools\Git\bin\git.exe",
    "C:\Tools\Git\bin\git.exe"
)

foreach ($path in $gitPaths) {
    if ($path -eq "git") {
        $gitCmd = Get-Command git -ErrorAction SilentlyContinue
        if ($gitCmd) {
            $gitExe = "git"
            break
        }
    } else {
        if (Test-Path $path) {
            $gitExe = $path
            break
        }
    }
}

if (-not $gitExe) {
    Write-Host "❌ Git tidak ditemukan di sistem!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Pilih opsi:" -ForegroundColor Yellow
    Write-Host "1. Install Git Portable (Recommended - tidak perlu admin)" -ForegroundColor White
    Write-Host "2. Download Git dari git-scm.com (perlu admin)" -ForegroundColor White
    Write-Host ""
    Write-Host "Untuk install Git Portable, jalankan:" -ForegroundColor Cyan
    Write-Host "   .\install-git-portable.ps1" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✅ Git ditemukan: $gitExe" -ForegroundColor Green
Write-Host ""

# Fungsi untuk menjalankan git command
function Invoke-Git {
    param([string[]]$Arguments)
    if ($gitExe -eq "git") {
        & git $Arguments
    } else {
        & $gitExe $Arguments
    }
}

# Cek apakah sudah ada repository Git
if (-not (Test-Path .git)) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    Invoke-Git @("init")
    Write-Host "✅ Repository initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git repository sudah ada" -ForegroundColor Green
}

Write-Host ""

# Setup remote
Write-Host "Setting up remote repository..." -ForegroundColor Yellow
$remoteUrl = "https://github.com/ditodimas13/Creative-Analyzer.git"

# Cek remote yang ada
$existingRemote = Invoke-Git @("remote", "get-url", "origin") 2>$null
if ($existingRemote) {
    Write-Host "Remote origin sudah ada: $existingRemote" -ForegroundColor Cyan
    $update = Read-Host "Update remote ke $remoteUrl? (y/n)"
    if ($update -eq "y" -or $update -eq "Y") {
        Invoke-Git @("remote", "remove", "origin")
        Invoke-Git @("remote", "add", "origin", $remoteUrl)
        Write-Host "✅ Remote updated" -ForegroundColor Green
    }
} else {
    Invoke-Git @("remote", "add", "origin", $remoteUrl)
    Write-Host "✅ Remote added" -ForegroundColor Green
}

Write-Host ""
Write-Host "Remote configuration:" -ForegroundColor Cyan
Invoke-Git @("remote", "-v")
Write-Host ""

# Cek status
Write-Host "Checking repository status..." -ForegroundColor Yellow
$status = Invoke-Git @("status", "--short")
if ($status) {
    Write-Host "Files yang akan di-commit:" -ForegroundColor Cyan
    Invoke-Git @("status", "--short")
    Write-Host ""
    
    # Add semua file
    Write-Host "Adding files to staging..." -ForegroundColor Yellow
    Invoke-Git @("add", ".")
    Write-Host "✅ Files added" -ForegroundColor Green
    Write-Host ""
    
    # Commit
    $commitMessage = Read-Host "Masukkan commit message (atau tekan Enter untuk 'Initial commit')"
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        $commitMessage = "Initial commit"
    }
    
    Write-Host "Committing changes..." -ForegroundColor Yellow
    Invoke-Git @("commit", "-m", $commitMessage)
    Write-Host "✅ Changes committed" -ForegroundColor Green
} else {
    Write-Host "✅ Tidak ada perubahan yang perlu di-commit" -ForegroundColor Green
}

Write-Host ""

# Set branch ke main
Write-Host "Setting branch to main..." -ForegroundColor Yellow
$currentBranch = Invoke-Git @("branch", "--show-current") 2>$null
if ($currentBranch -and $currentBranch.Trim() -ne "main") {
    Invoke-Git @("branch", "-M", "main")
    Write-Host "✅ Branch set to main" -ForegroundColor Green
} else {
    Write-Host "✅ Already on main branch" -ForegroundColor Green
}

Write-Host ""

# Push ke GitHub
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Ready to push to GitHub!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Repository: $remoteUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  PENTING: Saat push, Anda akan diminta:" -ForegroundColor Yellow
Write-Host "   - Username: ditodimas13" -ForegroundColor White
Write-Host "   - Password: Masukkan Personal Access Token (bukan password GitHub!)" -ForegroundColor White
Write-Host ""
Write-Host "Jika belum punya token, buat di:" -ForegroundColor Yellow
Write-Host "   https://github.com/settings/tokens" -ForegroundColor Cyan
Write-Host ""

$proceed = Read-Host "Push ke GitHub sekarang? (y/n)"
if ($proceed -eq "y" -or $proceed -eq "Y") {
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    Write-Host "(Anda akan diminta username dan token)" -ForegroundColor Gray
    Write-Host ""
    
    try {
        Invoke-Git @("push", "-u", "origin", "main")
        Write-Host ""
        Write-Host "✅ Push berhasil!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Repository Anda sekarang tersedia di:" -ForegroundColor Cyan
        Write-Host "   https://github.com/ditodimas13/Creative-Analyzer" -ForegroundColor White
    } catch {
        Write-Host ""
        Write-Host "❌ Push gagal. Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Kemungkinan penyebab:" -ForegroundColor Yellow
        Write-Host "1. Token tidak valid atau expired" -ForegroundColor White
        Write-Host "2. Repository belum dibuat di GitHub" -ForegroundColor White
        Write-Host "3. Tidak ada permission untuk push" -ForegroundColor White
        Write-Host ""
        Write-Host "Coba manual:" -ForegroundColor Yellow
        Write-Host "   git push -u origin main" -ForegroundColor White
    }
} else {
    Write-Host ""
    Write-Host "Push dibatalkan. Untuk push manual, jalankan:" -ForegroundColor Yellow
    Write-Host "   git push -u origin main" -ForegroundColor White
}

Write-Host ""

