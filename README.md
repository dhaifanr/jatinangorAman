# JatinangorAman

Web peta interaktif (*Web-GIS*) berbasis **Next.js** untuk memvisualisasikan **keamanan dan kelayakan daerah kos/hunian di kawasan Jatinangor** bagi mahasiswa dan warga, berdasarkan paper:

> **"Pemetaan Literatur dan Perancangan Model Konseptual Decision Support System untuk Smart Living and Safety di Kawasan Jatinangor (v3)"**  
> *Program Studi Teknik Informatika, Universitas Padjadjaran*  
> Penulis: Muhammad Andri Firmansyah, Dhaifan Ramadhani Juliawan, Muhammad Haidar Arkan, Muhammad Arkan Bintang Pratama.

---

## Evaluasi 3 Kategori (Paper v3 — Harga Sewa Dikalibrasi ke Survei Daring)

Model mengevaluasi **5 kriteria** (`C1` Harga Sewa [28%], `C2` Jarak Kampus [22%], `C3` Fasilitas [18%], `C4` Sistem Keamanan [22%], `C5` Kebisingan [10%], dengan `CR = 0,042 <= 0,10`) pada **6 kawasan kos** di Jatinangor menggunakan data **30 responden** dengan tarif sewa tahunan (`C1`) yang dikalibrasi ke survei daring Mamikos & Rukita:

| Kawasan | C1 (Rp jt/thn) | C2 (km) | C3 | C4 (Aman) | C5 (Bising) | 1. Kategori Keamanan | 2. Kategori Kelayakan (`L_i`) | 3. Overall: Aman & Layak (`V_i`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- | :--- | :--- |
| **A4 — Cikuda** | 12,60 | 0,66 | 3,2 | 2,8 | 1,8 | **Kurang Aman** (#5) | **Layak** (#1, `0,7562`) | **#1 Aman & Layak** (`0,7241`) |
| **A5 — Hegarmanah** | 12,00 | 0,73 | 3,0 | 3,0 | 2,2 | **Kurang Aman** (#4) | **Layak** (#2, `0,7216`) | **#2 Aman & Layak** (`0,7093`) |
| **A1 — Ciseke** | 14,70 | 0,46 | 3,2 | 2,2 | 3,6 | **Tidak Aman** (#6) | **Layak** (#3, `0,7090`) | **#3 Layak (Rawan Aman)** (`0,6471`) |
| **A2 — GKPN & Kolocokro** | 20,20 | 1,72 | 4,8 | 3,6 | 2,0 | **Aman** (#1) | **Cukup Layak** (#4, `0,3401`) | **#4 Aman (Biaya Tinggi)** (`0,3975`) |
| **A3 — Sayang** | 19,20 | 1,63 | 3,2 | 3,2 | 3,6 | **Kurang Aman** (#3) | **Tidak Layak** (#5, `0,2433`) | **#5 Kurang Aman & Tidak Layak** (`0,2997`) |
| **A6 — Caringin** | 18,90 | 2,11 | 3,4 | 3,4 | 2,2 | **Aman** (#2) | **Tidak Layak** (#6, `0,1682`) | **#6 Aman (Tidak Layak Jarak/Biaya)** (`0,2605`) |

---

## Fitur Utama
1. **Peta Interaktif 3 Mode:** Beralih antara **1. Paling Aman (`C4`)**, **2. Layak / Tidak Layak (`L_i`)**, dan **3. Overall: Aman & Layak (`V_i`)**.
2. **Matriks Komparasi 3 Kolom:** Tombol **"Lihat 3 Kolom: Paling Aman | Layak | Overall"** menyajikan perbandingan 3 kolom berdampingan secara langsung.
3. **Drawer Detail Kawasan:** Menampilkan status ke-3 kategori, KPI 2×2, bar 5 kriteria berbobot, grafik perbandingan `V_i`, dan ringkasan profil paper v3.

---

## Menjalankan Proyek Secara Lokal
```bash
npm install
npm run dev
```
Buka `http://localhost:3000` di browser.
