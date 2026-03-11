# Setup Git Repository dengan GitHub

## Prerequisites

Pastikan Git sudah terinstall di sistem Anda. Jika belum, download dari [git-scm.com](https://git-scm.com/download/win).

## Cara Menghubungkan Project dengan GitHub

### Metode 1: Menggunakan Script PowerShell (Recommended)

1. Buka PowerShell di folder project
2. Jalankan script:
   ```powershell
   .\setup-git.ps1
   ```
3. Ikuti langkah-langkah yang ditampilkan di terminal

### Metode 2: Manual Setup

1. **Inisialisasi Git repository** (jika belum ada):
   ```bash
   git init
   ```

2. **Tambahkan remote repository**:
   ```bash
   git remote add origin https://github.com/ditodimas13/Creative-Analyzer.git
   ```

3. **Verifikasi remote**:
   ```bash
   git remote -v
   ```

4. **Tambahkan semua file ke staging**:
   ```bash
   git add .
   ```

5. **Commit perubahan**:
   ```bash
   git commit -m "Initial commit"
   ```

6. **Set branch utama ke main**:
   ```bash
   git branch -M main
   ```

7. **Push ke GitHub**:
   ```bash
   git push -u origin main
   ```

## Troubleshooting

### Jika remote sudah ada
```bash
git remote remove origin
git remote add origin https://github.com/ditodimas13/Creative-Analyzer.git
```

### Jika perlu autentikasi
GitHub sekarang menggunakan Personal Access Token (PAT) untuk autentikasi. 
1. Buat token di: https://github.com/settings/tokens
2. Gunakan token sebagai password saat push

### Jika branch sudah ada di remote
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## Repository URL
- **HTTPS**: https://github.com/ditodimas13/Creative-Analyzer.git
- **SSH**: git@github.com:ditodimas13/Creative-Analyzer.git (jika sudah setup SSH key)

