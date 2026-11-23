# JatinangorAman

Web peta interaktif (*Web-GIS*) berbasis **Next.js** untuk memvisualisasikan **keamanan dan kelayakan daerah kos/hunian di kawasan Jatinangor** bagi mahasiswa dan warga, berdasarkan paper:

> **"Pemetaan Literatur dan Perancangan Model Konseptual Decision Support System untuk Smart Living and Safety di Kawasan Jatinangor (v5)"**  
> *Program Studi Teknik Informatika, Universitas Padjadjaran*  
> Penulis: Muhammad Andri Firmansyah, Dhaifan Ramadhani Juliawan, Muhammad Haidar Arkan, Muhammad Arkan Bintang Pratama.

---

## Evaluasi 3 Kategori (Paper v5 — Survei 30 Responden Penghuni Kos)

Model mengevaluasi **5 kriteria** (`C1` Harga Sewa [28%], `C2` Jarak Kampus [22%], `C3` Fasilitas [18%], `C4` Sistem Keamanan [22%], `C5` Kebisingan [10%], dengan `CR = 0,042 <= 0,10`) pada **6 kawasan kos** di Jatinangor berdasarkan data survei **30 responden penghuni kos** (5 per kawasan):

| Kawasan | C1 (Rp jt/thn) | C2 (km) | C3 | C4 (Aman) | C5 (Bising) | 1. Kategori Keamanan | 2. Kategori Kelayakan (`L_i`) | 3. Overall: Aman & Layak (`V_i`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- | :--- | :--- |
| **A1 — Ciseke** | 13,80 | 0,42 | 3,8 | 3,2 | 3,2 | **Kurang Aman** (#5) | **Layak** (#1, `0,7969`) | **#1 Layak & Optimal** (`0,7512`) |
| **A5 — Hegarmanah** | 12,70 | 0,69 | 3,4 | 3,4 | 2,0 | **Aman** (#4) | **Layak** (#2, `0,7705`) | **#2 Aman & Layak** (`0,7436`) |
| **A4 — Cikuda** | 13,50 | 0,78 | 2,6 | 2,2 | 2,2 | **Tidak Aman** (#6) | **Layak** (#3, `0,6595`) | **#3 Layak (Tidak Aman)** (`0,5674`) |
| **A2 — GKPN** | 18,80 | 1,62 | 4,6 | 4,2 | 1,8 | **Aman** (#1) | **Cukup Layak** (#4, `0,3595`) | **#4 Aman (Biaya Tinggi)** (`0,4411`) |
| **A3 — Sayang** | 17,80 | 1,54 | 3,6 | 3,6 | 3,0 | **Aman** (#3) | **Tidak Layak** (#5, `0,2921`) | **#5 Aman (Kurang Layak)** (`0,3626`) |
| **A6 — Caringin** | 17,60 | 1,98 | 3,8 | 3,8 | 2,0 | **Aman** (#2) | **Tidak Layak** (#6, `0,2212`) | **#6 Aman (Tidak Layak Jarak/Biaya)** (`0,3148`) |

---

## Fitur Utama
1. **Peta Interaktif 3 Mode:** Beralih antara **1. Paling Aman (`C4`)**, **2. Layak / Tidak Layak (`L_i`)**, dan **3. Overall: Aman & Layak (`V_i`)**.
2. **Matriks Komparasi 3 Kolom:** Tombol **"Lihat 3 Kolom: Paling Aman | Layak | Overall"** menyajikan perbandingan 3 kolom berdampingan secara langsung.
3. **Drawer Detail Kawasan:** Menampilkan status ke-3 kategori, KPI 2×2, bar 5 kriteria berbobot, grafik perbandingan `V_i`, dan ringkasan profil paper v5.

---

## Menjalankan Proyek Secara Lokal
```bash
npm install
npm run dev
```
Buka `http://localhost:3000` di browser.
