# Product Requirements Document (PRD) — JatinangorAman (Paper v3)

## 1. Ringkasan Produk
**JatinangorAman** adalah aplikasi web peta interaktif (*Web-GIS*) yang memvisualisasikan hasil penelitian pada paper **"Pemetaan Literatur dan Perancangan Model Konseptual Decision Support System untuk Smart Living and Safety di Kawasan Jatinangor (v3)"** (Program Studi Teknik Informatika, Universitas Padjadjaran).

Aplikasi ini menyajikan peta interaktif kawasan kos di Jatinangor beserta **3 perspektif evaluasi kategori**:
1. **Daerah Paling Aman Berdasarkan Kategori Keamanan (`C4`)** — `Aman`, `Kurang Aman`, `Tidak Aman`.
2. **Daerah Layak / Tidak Layak Berdasarkan Kategori Kelayakan Hunian (`C1, C2, C3, C5`)** — `Layak`, `Cukup Layak`, `Tidak Layak`.
3. **Overall: Aman dan Layak (`AHP–TOPSIS V_i`)** — Evaluasi gabungan seluruh 5 kriteria dari paper v3.

---

## 2. Model DSS & Dataset Paper v3 (Kalibrasi Harga Sewa Daring)

### A. Kriteria & Bobot AHP (`CR = 0,042 <= 0,10`)
| Kode | Kriteria | Satuan | Tipe | Bobot AHP (`w_j`) |
| :--- | :--- | :--- | :--- | :--- |
| **C1** | Harga sewa tahunan (dikalibrasi ke Mamikos & Rukita) | Rupiah (Rp juta) | Cost | `0,28` (28%) |
| **C2** | Jarak ke gerbang kampus | Kilometer (km) | Cost | `0,22` (22%) |
| **C3** | Fasilitas penunjang (air/WiFi) | Skala Likert (1–5) | Benefit | `0,18` (18%) |
| **C4** | Sistem keamanan (CCTV/portal) | Skala Likert (1–5) | Benefit | `0,22` (22%) |
| **C5** | Tingkat kebisingan lingkungan | Skala Likert (1–5) | Cost | `0,10` (10%) |

### B. Matriks Keputusan & Evaluasi 3 Kategori (Tabel IV & V Paper v3)

| Kode | Kawasan | C1 (Rp jt) | C2 (km) | C3 | C4 (Aman) | C5 (Bising) | 1. Kategori Keamanan | 2. Kategori Kelayakan (`L_i`) | 3. Overall AHP-TOPSIS (`V_i`) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- | :--- | :--- |
| **A4** | **Cikuda** | 12,60 | 0,66 | 3,2 | 2,8 | 1,8 | **Kurang Aman** (#5) | **Layak** (#1, `0,7562`) | **#1 Aman & Layak** (`0,7241`) |
| **A5** | **Hegarmanah** | 12,00 | 0,73 | 3,0 | 3,0 | 2,2 | **Kurang Aman** (#4) | **Layak** (#2, `0,7216`) | **#2 Aman & Layak** (`0,7093`) |
| **A1** | **Ciseke** | 14,70 | 0,46 | 3,2 | 2,2 | 3,6 | **Tidak Aman** (#6) | **Layak** (#3, `0,7090`) | **#3 Kompromi: Layak (Rawan)** (`0,6471`) |
| **A2** | **GKPN & Kolocokro** | 20,20 | 1,72 | 4,8 | 3,6 | 2,0 | **Aman** (#1) | **Cukup Layak** (#4, `0,3401`) | **#4 Kompromi: Aman (Mahal)** (`0,3975`) |
| **A3** | **Sayang** | 19,20 | 1,63 | 3,2 | 3,2 | 3,6 | **Kurang Aman** (#3) | **Tidak Layak** (#5, `0,2433`) | **#5 Kurang Optimal** (`0,2997`) |
| **A6** | **Caringin** | 18,90 | 2,11 | 3,4 | 3,4 | 2,2 | **Aman** (#2) | **Tidak Layak** (#6, `0,1682`) | **#6 Kurang Optimal** (`0,2605`) |

---

## 3. Fitur Utama
1. **Peta Interaktif Jatinangor (OpenStreetMap):** Poligon 6 kawasan (`A1`–`A6`) dan 4 kampus (`UNPAD`, `ITB`, `IKOPIN`, `IPDN`) pada koordinat jalan asli Jatinangor.
2. **Switcher 3 Mode Peta & Filter:**
   - **Mode 1 — Paling Aman (`C4`):** Mewarnai dan mengurutkan kawasan dari yang paling aman (`GKPN` -> `Caringin` -> `Sayang` -> `Hegarmanah` -> `Cikuda` -> `Ciseke`).
   - **Mode 2 — Layak / Tidak Layak (`L_i`):** Mewarnai dan mengurutkan kawasan berdasarkan kelayakan huni non-keamanan (`C1, C2, C3, C5`).
   - **Mode 3 — Overall: Aman & Layak (`V_i`):** Mewarnai dan mengurutkan kawasan berdasarkan hasil akhir AHP–TOPSIS Tabel V Paper v3.
3. **Tabel Komparasi 3 Kolom (`CategoryBoardModal`):** Menampilkan 3 kolom berdampingan (**1. Daerah Paling Aman**, **2. Kelayakan Hunian Layak/Tidak**, **3. Overall Aman & Layak**) yang interaktif saat diklik.
4. **Detail Kawasan (`ZoneDetailDrawer`):** Menampilkan badge ke-3 kategori sekaligus, grid KPI 2×2, bar 5 kriteria berbobot, grafik perbandingan `V_i`, dan ringkasan profil paper v3.
