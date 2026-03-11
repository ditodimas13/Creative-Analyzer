# Panduan Install Git ke Drive Selain C

## Opsi 1: Install Git Portable (Recommended - Tidak Perlu Install)

Git Portable bisa dijalankan dari folder manapun tanpa perlu install ke sistem.

### Langkah-langkah:

1. **Download Git Portable:**
   - Buka: https://github.com/git-for-windows/git/releases
   - Download file: `PortableGit-*-64-bit.7z.exe` (versi terbaru)
   - Atau gunakan link langsung: https://github.com/git-for-windows/git/releases/latest

2. **Extract ke Drive Pilihan:**
   - Pilih drive selain C (misalnya D:, E:, dll)
   - Extract ke folder seperti: `D:\Tools\Git` atau `E:\PortableGit`
   - Jangan extract ke folder dengan spasi di nama path

3. **Tambahkan ke PATH (Opsional tapi Recommended):**
   - Buka System Properties → Environment Variables
   - Edit "Path" di User variables
   - Tambahkan path ke `bin` folder Git, contoh: `D:\Tools\Git\bin`
   - Atau gunakan script PowerShell yang sudah disiapkan

## Opsi 2: Install Git dengan Custom Location

Jika ingin install Git biasa tapi ke drive lain:

1. **Download Git Installer:**
   - Download dari: https://git-scm.com/download/win
   - File: `Git-*-64-bit.exe`

2. **Install dengan Custom Location:**
   - Jalankan installer
   - Saat sampai ke "Select Destination Location"
   - Klik "Browse" dan pilih drive lain (misalnya `D:\Program Files\Git`)
   - Lanjutkan install dengan default settings lainnya

3. **Tambahkan ke PATH:**
   - Installer biasanya otomatis menambahkan ke PATH
   - Jika tidak, tambahkan manual: `D:\Program Files\Git\cmd`

## Opsi 3: Menggunakan Chocolatey (Jika Sudah Terinstall)

Jika Anda punya Chocolatey:
```powershell
# Install ke drive D
choco install git.install --params '/DIR=D:\Program Files\Git' -y
```

## Verifikasi Install

Setelah install, buka PowerShell baru dan test:
```powershell
git --version
```

Jika berhasil, akan muncul versi Git.

## Catatan

- **Portable Git**: Tidak perlu install, bisa langsung digunakan
- **Installed Git**: Lebih terintegrasi dengan sistem, auto-update
- **PATH**: Pastikan Git ada di PATH agar bisa dipanggil dari mana saja

