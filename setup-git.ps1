# Script untuk menghubungkan project dengan GitHub repository
# Pastikan Git sudah terinstall sebelum menjalankan script ini

Write-Host "Setting up Git repository..." -ForegroundColor Green

# Inisialisasi Git repository jika belum ada
if (-not (Test-Path .git)) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
} else {
    Write-Host "Git repository already initialized." -ForegroundColor Green
}

# Tambahkan remote origin
Write-Host "Adding remote repository..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/ditodimas13/Creative-Analyzer.git

# Verifikasi remote
Write-Host "`nRemote configuration:" -ForegroundColor Cyan
git remote -v

Write-Host "`nGit repository setup complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. git add ." -ForegroundColor White
Write-Host "2. git commit -m 'Initial commit'" -ForegroundColor White
Write-Host "3. git branch -M main" -ForegroundColor White
Write-Host "4. git push -u origin main" -ForegroundColor White

