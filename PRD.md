# Product Requirements Document (PRD) — JatinangorAman (Paper v5)

## 1. Ringkasan Produk
**JatinangorAman** adalah aplikasi web peta interaktif (*Web-GIS*) yang memvisualisasikan hasil penelitian pada paper **"Pemetaan Literatur dan Perancangan Model Konseptual Decision Support System untuk Smart Living and Safety di Kawasan Jatinangor (v5)"** (Program Studi Teknik Informatika, Universitas Padjadjaran).

Aplikasi ini menyajikan peta interaktif kawasan kos di Jatinangor beserta **3 perspektif evaluasi kategori**:
1. **Daerah Paling Aman Berdasarkan Kategori Keamanan (`C4`)** — `Aman`, `Kurang Aman`, `Tidak Aman`.
2. **Daerah Layak / Tidak Layak Berdasarkan Kategori Kelayakan Hunian (`C1, C2, C3, C5`)** — `Layak`, `Cukup Layak`, `Tidak Layak`.
3. **Overall: Aman dan Layak (`AHP–TOPSIS V_i`)** — Evaluasi gabungan seluruh 5 kriteria dari paper v5.

---

## 2. Model DSS & Dataset Paper v5 (Survei 30 Responden Penghuni Kos)

### A. Kriteria & Bobot AHP (`CR = 0,042 <= 0,10`)
| Kode | Kriteria | Satuan | Tipe | Bobot AHP (`w_j`) |
| :--- | :--- | :--- | :--- | :--- |
| **C1** | Harga sewa tahunan | Rupiah (Rp juta) | Cost | `0,28` (28%) |
| **C2** | Jarak ke gerbang kampus | Kilometer (km) | Cost | `0,22` (22%) |
| **C3** | Fasilitas penunjang (air/WiFi) | Skala Likert (1–5) | Benefit | `0,18` (18%) |
| **C4** | Sistem keamanan (CCTV/portal) | Skala Likert (1–5) | Benefit | `0,22` (22%) |
| **C5** | Tingkat kebisingan lingkungan | Skala Likert (1–5) | Cost | `0,10` (10%) |

### B. Matriks Keputusan & Evaluasi 3 Kategori (Tabel IV & V Paper v5)

| Kode | Kawasan | C1 (Rp jt) | C2 (km) | C3 | C4 (Aman) | C5 (Bising) | 1. Kategori Keamanan | 2. Kategori Kelayakan (`L_i`) | 3. Overall AHP-TOPSIS (`V_i`) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- | :--- | :--- |
| **A1** | **Ciseke** | 13,80 | 0,42 | 3,8 | 3,2 | 3,2 | **Kurang Aman** (#5) | **Layak** (#1, `0,7969`) | **#1 Layak & Optimal** (`0,7512`) |
| **A5** | **Hegarmanah** | 12,70 | 0,69 | 3,4 | 3,4 | 2,0 | **Aman** (#4) | **Layak** (#2, `0,7705`) | **#2 Aman & Layak** (`0,7436`) |
| **A4** | **Cikuda** | 13,50 | 0,78 | 2,6 | 2,2 | 2,2 | **Tidak Aman** (#6) | **Layak** (#3, `0,6595`) | **#3 Layak (Tidak Aman)** (`0,5674`) |
| **A2** | **GKPN** | 18,80 | 1,62 | 4,6 | 4,2 | 1,8 | **Aman** (#1) | **Cukup Layak** (#4, `0,3595`) | **#4 Aman (Biaya Tinggi)** (`0,4411`) |
| **A3** | **Sayang** | 17,80 | 1,54 | 3,6 | 3,6 | 3,0 | **Aman** (#3) | **Tidak Layak** (#5, `0,2921`) | **#5 Aman (Kurang Layak)** (`0,3626`) |
| **A6** | **Caringin** | 17,60 | 1,98 | 3,8 | 3,8 | 2,0 | **Aman** (#2) | **Tidak Layak** (#6, `0,2212`) | **#6 Aman (Tidak Layak Jarak/Biaya)** (`0,3148`) |

---

## 3. Fitur Utama
1. **Peta Interaktif Jatinangor (OpenStreetMap):** Poligon 6 kawasan (`A1`–`A6`) dan 4 kampus (`UNPAD`, `ITB`, `IKOPIN`, `IPDN`) pada koordinat jalan asli Jatinangor.
2. **Switcher 3 Mode Peta & Filter:**
   - **Mode 1 — Paling Aman (`C4`):** `GKPN` -> `Caringin` -> `Sayang` -> `Hegarmanah` -> `Ciseke` -> `Cikuda`.
   - **Mode 2 — Layak / Tidak Layak (`L_i`):** Kelayakan huni non-keamanan (`C1, C2, C3, C5`).
   - **Mode 3 — Overall: Aman & Layak (`V_i`):** Hasil akhir AHP–TOPSIS Tabel V Paper v5.
3. **Tabel Komparasi 3 Kolom (`CategoryBoardModal`):** Menampilkan 3 kolom berdampingan (**1. Daerah Paling Aman**, **2. Kelayakan Hunian Layak/Tidak**, **3. Overall Aman & Layak**) yang interaktif saat diklik.
4. **Detail Kawasan (`ZoneDetailDrawer`):** Menampilkan badge ke-3 kategori sekaligus, grid KPI 2×2, bar 5 kriteria berbobot, grafik perbandingan `V_i`, dan ringkasan profil paper v5.
