# Script untuk install Git Portable ke drive selain C
param(
    [string]$InstallDrive = "D",
    [string]$InstallFolder = "Tools\Git"
)

$InstallPath = "$InstallDrive`:\$InstallFolder"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Git Portable Installer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Target Location: $InstallPath" -ForegroundColor Green
Write-Host ""

# Cek drive
$drivePath = "$InstallDrive`:"
if (-not (Test-Path $drivePath)) {
    Write-Host "Error: Drive $InstallDrive tidak ditemukan!" -ForegroundColor Red
    exit 1
}

# Buat folder
$parentFolder = Split-Path -Parent $InstallPath
if (-not (Test-Path $parentFolder)) {
    Write-Host "Creating folder: $parentFolder" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $parentFolder -Force | Out-Null
}

Write-Host "Downloading Git Portable..." -ForegroundColor Yellow
Write-Host "(Ini mungkin memakan waktu beberapa menit)" -ForegroundColor Gray
Write-Host ""

# Download dari GitHub releases
$downloadUrl = "https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/PortableGit-2.44.0-64-bit.7z.exe"
$fileName = "PortableGit-2.44.0-64-bit.7z.exe"
$downloadPath = "$env:TEMP\$fileName"

try {
    # Download
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $downloadUrl -OutFile $downloadPath -UseBasicParsing
    
    Write-Host "Download selesai" -ForegroundColor Green
    Write-Host ""
    Write-Host "Extracting..." -ForegroundColor Yellow
    
    # Extract ke temp dulu
    $tempExtract = "$env:TEMP\GitTemp"
    if (Test-Path $tempExtract) {
        Remove-Item -Path $tempExtract -Recurse -Force -ErrorAction SilentlyContinue
    }
    New-Item -ItemType Directory -Path $tempExtract -Force | Out-Null
    
    # Jalankan self-extractor (silent mode)
    $process = Start-Process -FilePath $downloadPath -ArgumentList "-o`"$tempExtract`" -y" -Wait -PassThru -NoNewWindow
    
    # Cari folder Git yang punya bin\git.exe
    $sourceDir = $null
    $allDirs = Get-ChildItem -Path $tempExtract -Directory -Recurse -ErrorAction SilentlyContinue
    
    foreach ($dir in $allDirs) {
        $gitExe = Join-Path $dir.FullName "bin\git.exe"
        if (Test-Path $gitExe) {
            $sourceDir = $dir.FullName
            break
        }
    }
    
    if ($sourceDir -and (Test-Path (Join-Path $sourceDir "bin\git.exe"))) {
        # Pindahkan ke lokasi final
        if (Test-Path $InstallPath) {
            Write-Host "Removing existing installation..." -ForegroundColor Yellow
            Remove-Item -Path $InstallPath -Recurse -Force
        }
        
        Move-Item -Path $sourceDir -Destination $InstallPath -Force
        Write-Host "Git berhasil di-install ke $InstallPath" -ForegroundColor Green
    } else {
        Write-Host "Warning: Git executable tidak ditemukan setelah extract" -ForegroundColor Yellow
        Write-Host "Silakan cek folder: $tempExtract" -ForegroundColor Yellow
    }
    
    # Cleanup
    Remove-Item -Path $downloadPath -Force -ErrorAction SilentlyContinue
    Remove-Item -Path $tempExtract -Recurse -Force -ErrorAction SilentlyContinue
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Installation Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Git Location: $InstallPath" -ForegroundColor Green
    Write-Host ""
    Write-Host "Langkah selanjutnya:" -ForegroundColor Yellow
    Write-Host "1. Tambahkan Git ke PATH:" -ForegroundColor White
    Write-Host "   .\add-git-to-path.ps1 -GitPath `"$InstallPath\bin`"" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. Setelah itu, restart PowerShell dan jalankan:" -ForegroundColor White
    Write-Host "   .\setup-git-with-token.ps1" -ForegroundColor Cyan
    
} catch {
    Write-Host ""
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternatif: Download manual" -ForegroundColor Yellow
    Write-Host "1. Buka: https://github.com/git-for-windows/git/releases/latest" -ForegroundColor Cyan
    Write-Host "2. Download: PortableGit-*-64-bit.7z.exe" -ForegroundColor White
    Write-Host "3. Extract ke: $InstallPath" -ForegroundColor White
}
