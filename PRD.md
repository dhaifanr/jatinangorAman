# Product Requirements Document (PRD) — JatinangorAman

## 1. Ringkasan Produk
**JatinangorAman** adalah aplikasi web peta interaktif (*Web-GIS*) yang memvisualisasikan hasil penelitian pada paper **"Pemetaan Literatur dan Perancangan Model Konseptual Decision Support System untuk Smart Living and Safety di Kawasan Jatinangor"** (Program Studi Teknik Informatika, Universitas Padjadjaran).

Aplikasi ini dirancang dengan antarmuka yang sederhana dan fokus pada **peta interaktif berbasis zona**, sehingga mahasiswa dan warga yang mencari kos atau hunian di Jatinangor dapat langsung melihat pembagian kawasan **Aman**, **Kurang Aman**, dan **Tidak Aman** beserta data pendukung hasil model hibrida **AHP–TOPSIS**.

---

## 2. Latar Belakang & Tujuan
### Latar Belakang
Kawasan Jatinangor menampung puluhan ribu mahasiswa aktif (Unpad, ITB Kampus Jatinangor, IPDN, dan Ikopin University). Pertumbuhan pemukiman kos yang pesat tanpa zonasi tata ruang yang terintegrasi menimbulkan kesenjangan informasi bagi mahasiswa maupun warga dalam menilai biaya sewa, jarak ke kampus, fasilitas, kebisingan, serta risiko keamanan lingkungan (seperti curanmor, pembobolan kos, maupun area minim penerangan).

Paper DSS telah merumuskan model konseptual berbasis **AHP–TOPSIS** terhadap **5 kriteria** pada **6 kawasan kos** di Jatinangor. Web **JatinangorAman** berperan sebagai lapisan keluaran (*output layer*) visual agar hasil model tersebut mudah dibaca secara spasial.

### Tujuan
1. Memvisualisasikan 6 kawasan alternatif dari paper (`Ciseke`, `GKPN`, `Sayang`, `Cikuda`, `Hegarmanah`, dan `Caringin`) ke dalam peta interaktif Jatinangor.
2. Menyajikan klasifikasi zona **Aman**, **Kurang Aman**, dan **Tidak Aman** secara langsung dan mudah dipahami.
3. Menjaga tampilan web tetap ringkas—berfokus hanya pada peta zona dan detail informasi tiap kawasan tanpa fitur tambahan di luar kebutuhan utama.

---

## 3. Target Pengguna
1. **Mahasiswa** (mahasiswa baru maupun aktif di Unpad, ITB Jatinangor, IPDN, Ikopin) yang mencari kos/hunian.
2. **Warga / Pendatang** yang mencari tempat tinggal sewa di kawasan Jatinangor.
3. **Dosen / Penilai Mata Kuliah Decision Support System (DSS)** yang mengevaluasi implementasi Web-GIS dari model konseptual paper.

---

## 4. Ruang Lingkup (Scope)

### Yang Termasuk (In-Scope)
- **Peta Interaktif Kawasan Jatinangor** (zoom, pan, fokus ke 6 kawasan dari paper).
- **Visualisasi 3 Zona Status:**
  - **Aman** (Hijau)
  - **Kurang Aman** (Kuning / Oranye)
  - **Tidak Aman** (Merah)
- **Legenda Peta** yang jelas dan selalu terlihat.
- **Filter Zona** (`Semua`, `Aman`, `Kurang Aman`, `Tidak Aman`).
- **Pencarian / Quick Jump Kawasan** untuk langsung menyorot salah satu dari 6 kawasan (`A1`–`A6`).
- **Panel Detail Kawasan (Popup / Drawer)** saat zona diklik, menampilkan:
  - Kode & nama kawasan (`A1 Ciseke`, `A2 GKPN & Kolocokro`, `A3 Sayang`, `A4 Cikuda`, `A5 Hegarmanah`, `A6 Caringin`)
  - Status zona (`Aman` / `Kurang Aman` / `Tidak Aman`)
  - Skor Keamanan (`C4`, skala 1–5) dan ringkasan kondisi keamanan/lingkungan dari paper
  - Skor Preferensi Kelayakan Keseluruhan (`V_i`) & Peringkat TOPSIS (`1–6`)
  - Rincian 5 nilai kriteria (`C1` harga sewa, `C2` jarak ke kampus, `C3` fasilitas, `C4` keamanan, `C5` kebisingan)
  - Catatan *trade-off* (misalnya kawasan peringkat teratas TOPSIS belum tentu paling aman karena bobot harga & jarak sebesar 50%)

### Yang Tidak Termasuk (Out-of-Scope)
Sesuai batasan kesederhanaan proyek:
- Tidak ada login/register pengguna.
- Tidak ada daftar iklan kamar kos, sistem booking, atau pembayaran.
- Tidak ada fitur komentar, chat, atau pelaporan *real-time* dari pengguna.
- Tidak ada slider ubah bobot AHP yang kompleks di halaman utama (fokus utama tetap pada peta zona hasil model).

---

## 5. Model DSS & Pemetaan Zona dari Paper

### A. Kriteria & Bobot AHP (CR = 0,042 <= 0,10)
| Kode | Kriteria | Satuan | Tipe | Bobot AHP (`w_j`) |
| :--- | :--- | :--- | :--- | :--- |
| **C1** | Harga sewa tahunan | Rupiah (Rp juta) | Cost | `0,28` (28%) |
| **C2** | Jarak ke gerbang kampus | Kilometer (km) | Cost | `0,22` (22%) |
| **C3** | Fasilitas penunjang (air/WiFi) | Skala Likert (1–5) | Benefit | `0,18` (18%) |
| **C4** | Sistem keamanan (CCTV/portal) | Skala Likert (1–5) | Benefit | `0,22` (22%) |
| **C5** | Tingkat kebisingan lingkungan | Skala Likert (1–5) | Cost | `0,10` (10%) |

### B. Dataset 6 Kawasan & Klasifikasi Zona
Berdasarkan **Tabel IV** dan **Tabel V** pada paper (hasil simulasi 30 responden, 5 responden per kawasan):

| Kode | Kawasan | C1 (Rp jt) | C2 (km) | C3 | C4 (Keamanan) | C5 (Bising) | Skor TOPSIS (`V_i`) | Peringkat TOPSIS | Klasifikasi Zona di Peta |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **A2** | GKPN & Kolocokro | 10,30 | 1,72 | 4,8 | **3,6** | 2,0 | 0,3839 | 5 | **Aman** (Hijau) |
| **A6** | Caringin | 7,90 | 2,11 | 3,4 | **3,4** | 2,2 | 0,3256 | 6 | **Aman** (Hijau) |
| **A3** | Sayang | 6,00 | 1,63 | 3,2 | **3,2** | 3,6 | 0,4707 | 4 | **Kurang Aman** (Kuning/Oranye) |
| **A5** | Hegarmanah | 6,00 | 0,73 | 3,0 | **3,0** | 2,2 | 0,7189 | 2 | **Kurang Aman** (Kuning/Oranye) |
| **A4** | Cikuda | 6,10 | 0,66 | 3,2 | **2,8** | 1,8 | 0,7355 | 1 | **Kurang Aman** (Kuning/Oranye) |
| **A1** | Ciseke (Besar & Kecil) | 7,20 | 0,46 | 3,2 | **2,2** | 3,6 | 0,6543 | 3 | **Tidak Aman** (Merah) |

> **Aturan Pemetaan Zona Keamanan (`C4` & Profil Lingkungan Paper):**
> - **Aman (`C4 >= 3,4`)**: `A2` GKPN & Kolocokro (tata ruang teratur, sistem keamanan mandiri baik) dan `A6` Caringin (lingkungan tenang, jauh dari jalan utama).
> - **Kurang Aman (`2,8 <= C4 < 3,4`)**: `A3` Sayang (keamanan sedang namun rentan genangan banjir & kebisingan tinggi `C5 = 3,6`), `A5` Hegarmanah (lingkungan sepi/minim penerangan & catatan insiden kriminalitas), dan `A4` Cikuda (sepi/dekat persawahan & disebut cukup rawan kejahatan meski unggul pada biaya dan jarak).
> - **Tidak Aman (`C4 < 2,8`)**: `A1` Ciseke (skor keamanan terendah `2,2`, padat, jalan sempit, parkir terbatas, serta catatan kasus curanmor di area kos).
>
> **Catatan Penting dari Paper:** Nilai `V_i` tertinggi (`A4 Cikuda` = 0,7355 dan `A5 Hegarmanah` = 0,7189) menunjukkan **kompromi terbaik** berdasarkan bobot harga (28%) dan jarak (22%), **bukan** kawasan yang paling aman. Pemisahan visual antara warna zona keamanan dan info peringkat TOPSIS menjaga pengguna tidak salah menafsirkan hasil.

---

## 6. Alur Pengguna (User Flow)
1. Pengguna membuka web **JatinangorAman**.
2. Peta langsung menampilkan kawasan Jatinangor beserta 6 zona berwarna (**Aman**, **Kurang Aman**, **Tidak Aman**) dan legenda.
3. Pengguna memfilter kategori zona atau memilih nama kawasan (`Ciseke`, `GKPN`, `Sayang`, `Cikuda`, `Hegarmanah`, `Caringin`).
4. Pengguna mengklik salah satu zona untuk membaca status keamanan, nilai 5 kriteria (`C1`–`C5`), skor TOPSIS (`V_i`), serta ringkasan profil kawasan dari paper.

---

## 7. Kebutuhan Fungsional & Non-Fungsional

### Kebutuhan Fungsional
| ID | Fitur | Deskripsi | Prioritas |
| :--- | :--- | :--- | :--- |
| **FR-01** | Peta Interaktif Jatinangor | Peta berpusat di koridor Jalan Raya Jatinangor dengan kontrol zoom dan pan. | Wajib |
| **FR-02** | Layer Zona 6 Kawasan | Menampilkan `A1`–`A6` dengan warna Hijau (`Aman`), Kuning/Oranye (`Kurang Aman`), Merah (`Tidak Aman`). | Wajib |
| **FR-03** | Detail Kawasan | Menampilkan skor `C1`–`C5`, `V_i`, peringkat TOPSIS, serta ringkasan profil lingkungan saat diklik. | Wajib |
| **FR-04** | Filter Zona | Filter tampilan untuk `Semua`, `Aman`, `Kurang Aman`, dan `Tidak Aman`. | Wajib |
| **FR-05** | Legenda & Info Metodologi | Legenda warna zona serta ringkasan singkat bahwa data berasal dari simulasi 30 responden AHP–TOPSIS. | Wajib |
| **FR-06** | Quick Jump Kawasan | Daftar/pencarian cepat untuk mengarahkan peta ke salah satu dari 6 kawasan. | Disarankan |

### Kebutuhan Non-Fungsional
- **Responsif:** Nyaman diakses di layar ponsel maupun desktop.
- **Ringan & Statis:** Menggunakan dataset lokal di `data/kawasan_jatinangor.json` dan `data/responden_simulasi.csv` tanpa ketergantungan backend berat.
- **Transparansi Data:** Mencantumkan disclaimer sesuai paper bahwa dataset awal merupakan data simulasi 30 responden (sebelum survei primer 30–50 sampel indekos pada tahap lanjutan).

---

## 8. Rencana Tech Stack
- **Frontend:** React / Next.js atau Vite + React (TypeScript)
- **Peta:** Leaflet (`react-leaflet`) atau MapLibre GL JS + OpenStreetMap
- **Styling:** Tailwind CSS
- **Dataset:** `data/kawasan_jatinangor.json` & `data/responden_simulasi.csv`
