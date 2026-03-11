# Script untuk download Git Portable ke drive selain C
# Script ini akan membantu download dan extract Git Portable

param(
    [string]$InstallPath = "D:\Tools\Git",
    [string]$Drive = "D"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Git Portable Downloader & Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Cek apakah drive tersedia
$drivePath = "$Drive`:"
if (-not (Test-Path $drivePath)) {
    Write-Host "Error: Drive $Drive tidak ditemukan!" -ForegroundColor Red
    Write-Host "Available drives:" -ForegroundColor Yellow
    Get-WmiObject -Class Win32_LogicalDisk | Where-Object {$_.DriveType -eq 3} | ForEach-Object {
        Write-Host "  - $($_.DeviceID) ($([math]::Round($_.FreeSpace/1GB,2)) GB free)" -ForegroundColor White
    }
    exit 1
}

# Buat folder jika belum ada
$parentFolder = Split-Path -Parent $InstallPath
if (-not (Test-Path $parentFolder)) {
    Write-Host "Creating folder: $parentFolder" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $parentFolder -Force | Out-Null
}

Write-Host "Install Path: $InstallPath" -ForegroundColor Green
Write-Host ""

# URL untuk download Git Portable (latest release)
$gitRepo = "https://api.github.com/repos/git-for-windows/git/releases/latest"
Write-Host "Mengambil informasi release terbaru..." -ForegroundColor Yellow

try {
    $release = Invoke-RestMethod -Uri $gitRepo
    $portableAsset = $release.assets | Where-Object { $_.name -like "*PortableGit-*-64-bit.7z.exe" } | Select-Object -First 1
    
    if (-not $portableAsset) {
        Write-Host "Error: Portable version tidak ditemukan" -ForegroundColor Red
        Write-Host "Silakan download manual dari: https://github.com/git-for-windows/git/releases" -ForegroundColor Yellow
        exit 1
    }
    
    $downloadUrl = $portableAsset.browser_download_url
    $fileName = $portableAsset.name
    $downloadPath = "$env:TEMP\$fileName"
    
    Write-Host "Found: $fileName" -ForegroundColor Green
    Write-Host "Size: $([math]::Round($portableAsset.size/1MB,2)) MB" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Downloading..." -ForegroundColor Yellow
    Write-Host "URL: $downloadUrl" -ForegroundColor Gray
    
    # Download file
    $ProgressPreference = 'Continue'
    Invoke-WebRequest -Uri $downloadUrl -OutFile $downloadPath -UseBasicParsing
    
    Write-Host "✓ Download selesai" -ForegroundColor Green
    Write-Host ""
    Write-Host "Extracting ke $InstallPath..." -ForegroundColor Yellow
    
    # Extract menggunakan 7-Zip atau built-in Expand-Archive
    # PortableGit biasanya self-extracting, jadi kita jalankan dulu
    $extractPath = "$env:TEMP\GitExtract"
    if (Test-Path $extractPath) {
        Remove-Item -Path $extractPath -Recurse -Force
    }
    New-Item -ItemType Directory -Path $extractPath -Force | Out-Null
    
    # Jalankan self-extractor
    Write-Host "Running extractor..." -ForegroundColor Yellow
    Start-Process -FilePath $downloadPath -ArgumentList "-o`"$extractPath`" -y" -Wait -NoNewWindow
    
    # Cari folder Git yang sudah di-extract
    $gitFolder = Get-ChildItem -Path $extractPath -Directory | Where-Object { $_.Name -like "*Git*" -or $_.Name -like "*git*" } | Select-Object -First 1
    
    if ($gitFolder) {
        # Pindahkan ke lokasi final
        if (Test-Path $InstallPath) {
            Remove-Item -Path $InstallPath -Recurse -Force
        }
        Move-Item -Path $gitFolder.FullName -Destination $InstallPath -Force
        Write-Host "✓ Git berhasil di-extract ke $InstallPath" -ForegroundColor Green
    } else {
        Write-Host "Warning: Struktur folder tidak seperti yang diharapkan" -ForegroundColor Yellow
        Write-Host "Silakan extract manual dari: $downloadPath" -ForegroundColor Yellow
        Write-Host "Ke folder: $InstallPath" -ForegroundColor Yellow
    }
    
    # Cleanup
    Remove-Item -Path $downloadPath -Force -ErrorAction SilentlyContinue
    Remove-Item -Path $extractPath -Recurse -Force -ErrorAction SilentlyContinue
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Setup Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Git Portable Location: $InstallPath" -ForegroundColor Green
    Write-Host ""
    Write-Host "Langkah selanjutnya:" -ForegroundColor Yellow
    Write-Host "1. Tambahkan Git ke PATH dengan menjalankan:" -ForegroundColor White
    Write-Host "   .\add-git-to-path.ps1 -GitPath `"$InstallPath\bin`"" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. Atau gunakan Git langsung dengan full path:" -ForegroundColor White
    Write-Host "   `"$InstallPath\bin\git.exe`" --version" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "3. Setelah Git di PATH, jalankan:" -ForegroundColor White
    Write-Host "   .\setup-git-with-token.ps1" -ForegroundColor Cyan
    
} catch {
    Write-Host ""
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternatif: Download manual dari:" -ForegroundColor Yellow
    Write-Host "https://github.com/git-for-windows/git/releases/latest" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Cari file: PortableGit-*-64-bit.7z.exe" -ForegroundColor White
    Write-Host "Extract ke: $InstallPath" -ForegroundColor White
}

