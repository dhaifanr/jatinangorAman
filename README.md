# JatinangorAman

Web peta interaktif (*Web-GIS*) untuk memvisualisasikan **keamanan dan kelayakan daerah kos/hunian di kawasan Jatinangor** bagi mahasiswa dan warga, berdasarkan paper:

> **"Pemetaan Literatur dan Perancangan Model Konseptual Decision Support System untuk Smart Living and Safety di Kawasan Jatinangor"**  
> *Program Studi Teknik Informatika, Universitas Padjadjaran*  
> Penulis: Muhammad Andri Firmansyah, Dhaifan Ramadhani Juliawan, Muhammad Haidar Arkan, Muhammad Arkan Bintang Pratama.

---

## Fokus Web
Web ini dibuat **ringkas dan terfokus hanya pada peta interaktif zona**, tanpa fitur tambahan seperti login, iklan kamar kos, atau transaksi booking. Pengguna langsung dapat melihat daerah mana saja yang tergolong **Aman**, **Kurang Aman**, dan **Tidak Aman** beserta metrik hasil model **AHP–TOPSIS** dari paper.

---

## Klasifikasi Zona & Ringkasan Hasil Paper

Model mengevaluasi **5 kriteria** (`C1` Harga Sewa [28%], `C2` Jarak Kampus [22%], `C3` Fasilitas [18%], `C4` Sistem Keamanan [22%], `C5` Kebisingan [10%], dengan `CR = 0,042 <= 0,10`) pada **6 kawasan kos** di Jatinangor menggunakan data simulasi **30 responden**:

| Zona di Peta | Warna | Kawasan | Skor Keamanan (`C4`) | Skor TOPSIS (`V_i`) | Peringkat TOPSIS | Catatan Utama dari Paper |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **Aman** | Hijau | **A2 — GKPN & Kolocokro** | 3,6 | 0,3839 | 5 | Tata ruang teratur, jalan lebar, sistem keamanan mandiri baik, harga tertinggi (`Rp10,30 jt`). |
| **Aman** | Hijau | **A6 — Caringin** | 3,4 | 0,3256 | 6 | Kawasan tenang, jauh dari bising jalan utama, jarak terjauh (`2,11 km`). |
| **Kurang Aman** | Kuning / Oranye | **A3 — Sayang** | 3,2 | 0,4707 | 4 | Dilalui angkot, harga terjangkau (`Rp6,00 jt`), namun bising (`3,6`) & rentan banjir/air bersih. |
| **Kurang Aman** | Kuning / Oranye | **A5 — Hegarmanah** | 3,0 | 0,7189 | 2 | Murah (`Rp6,00 jt`) & dekat (`0,73 km`), namun sepi/minim penerangan & ada riwayat kerawanan. |
| **Kurang Aman** | Kuning / Oranye | **A4 — Cikuda** | 2,8 | 0,7355 | 1 | Peringkat 1 kompromi biaya–jarak–tenang, namun lingkungan sepi & disebut cukup rawan kejahatan. |
| **Tidak Aman** | Merah | **A1 — Ciseke** | 2,2 | 0,6543 | 3 | Paling dekat kampus (`0,46 km`), tetapi skor keamanan terendah, padat, kebisingan tinggi (`3,6`), dan riwayat curanmor. |

> **Catatan Model:** Peringkat teratas TOPSIS (`A4 Cikuda` dan `A5 Hegarmanah`) mencerminkan **kompromi terbaik** atas bobot harga & jarak (50%), bukan kawasan paling aman. Oleh karena itu, warna zona peta dipisahkan berdasarkan tingkat keamanan & kelayakan lingkungan (`C4` + profil risiko) sementara nilai `V_i` tetap ditampilkan di detail kawasan.

---

## Struktur Direktori
```text
jatinangorAman/
├── PRD.md                        # Product Requirements Document (selaras dengan paper)
├── README.md                     # Dokumentasi proyek
└── data/
    ├── kawasan_jatinangor.json   # Dataset agregasi 6 kawasan (Tabel II, IV, V & profil paper)
    └── responden_simulasi.csv    # Dataset mentah 30 responden simulasi (Tabel III paper)
```

---

## Dokumen & Dataset
- [PRD.md](./PRD.md) — Spesifikasi produk lengkap sesuai model konseptual AHP–TOPSIS pada paper.
- [data/kawasan_jatinangor.json](./data/kawasan_jatinangor.json) — Dataset utama siap pakai untuk layer peta interaktif (`A1`–`A6`, bobot AHP, nilai `C1`–`C5`, `D+`, `D-`, `V_i`, peringkat, dan klasifikasi zona).
- [data/responden_simulasi.csv](./data/responden_simulasi.csv) — Data simulasi 30 responden (`R01`–`R30`) sesuai Tabel III paper.
