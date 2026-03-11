# Data yang Dibutuhkan untuk Menghubungkan Project dengan GitHub

## Informasi Repository (Sudah Diketahui)

✅ **Repository URL**: `https://github.com/ditodimas13/Creative-Analyzer.git`
✅ **Username**: `ditodimas13`
✅ **Repository Name**: `Creative-Analyzer`

## Data yang Dibutuhkan dari Anda

### 1. **GitHub Credentials (Wajib untuk Push)**

#### Opsi A: Personal Access Token (PAT) - **Recommended**
- **Apa itu?** Token khusus untuk autentikasi Git operations
- **Cara membuat:**
  1. Login ke GitHub
  2. Buka: https://github.com/settings/tokens
  3. Klik "Generate new token" → "Generate new token (classic)"
  4. Beri nama: `meta-ads-analyzer-access`
  5. Pilih scope/permissions:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (jika menggunakan GitHub Actions)
  6. Klik "Generate token"
  7. **COPY TOKEN SEKARANG** (hanya ditampilkan sekali!)
  8. Simpan token dengan aman

- **Cara menggunakan:**
  - Saat `git push`, username = `ditodimas13`
  - Password = **token yang sudah dibuat**

#### Opsi B: SSH Key (Alternatif)
- Jika sudah setup SSH key di GitHub, bisa menggunakan SSH URL
- URL: `git@github.com:ditodimas13/Creative-Analyzer.git`

### 2. **Informasi Branch (Opsional - akan auto-detect)**

- **Branch utama**: Biasanya `main` atau `master`
- Script akan otomatis mendeteksi dan menggunakan `main`

### 3. **Status Repository GitHub**

Perlu diketahui:
- ✅ Apakah repository sudah ada file di GitHub?
  - Jika **YA**: Perlu `git pull` dulu dengan `--allow-unrelated-histories`
  - Jika **KOSONG**: Langsung push saja

### 4. **Informasi Project Lokal**

✅ **Project Name**: `meta-ads-analyzer` (dari package.json)
✅ **Git Ignore**: Sudah ada (`.gitignore`)
✅ **File Structure**: Sudah siap

## Checklist Sebelum Setup

- [ ] Git sudah terinstall di sistem
- [ ] GitHub account sudah login
- [ ] Personal Access Token sudah dibuat (untuk push)
- [ ] Repository GitHub sudah dibuat (sudah ada)
- [ ] File `.gitignore` sudah ada (sudah ada)

## Data Minimal yang Dibutuhkan

**Hanya 1 hal yang benar-benar dibutuhkan:**
1. ✅ **Personal Access Token** dari GitHub

Semua informasi lainnya sudah tersedia atau bisa auto-detect.

## Langkah Selanjutnya

Setelah Anda punya Personal Access Token:

1. Install Git (jika belum)
2. Jalankan script: `.\setup-git.ps1`
3. Saat diminta password, masukkan **token** (bukan password GitHub)

Atau ikuti panduan lengkap di: `cursor-docs/git-setup.md`

