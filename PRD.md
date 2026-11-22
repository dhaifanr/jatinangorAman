# Product Requirements Document (PRD) — JatinangorAman

## 1. Ringkasan Produk
**JatinangorAman** adalah aplikasi web peta interaktif sederhana yang memvisualisasikan output *paper* mata kuliah **Decision Support System (DSS)** mengenai **keamanan dan kelayakan daerah kos/hunian di kawasan Jatinangor**.

Aplikasi ini dirancang khusus untuk menjadi media informasi visual yang cepat, jelas, dan langsung pada intinya: pengguna cukup membuka web, melihat peta Jatinangor, dan langsung mengetahui zona mana saja yang tergolong **Aman**, **Kurang Aman**, dan **Tidak Aman**.

---

## 2. Latar Belakang & Tujuan
### Latar Belakang
Banyak mahasiswa baru maupun warga yang mencari kos di Jatinangor tidak mengetahui kondisi keamanan dan kelayakan tiap daerah/blok (seperti penerangan jalan, kerawanan lingkungan, aksesibilitas, atau kondisi sekitar). Di sisi lain, hasil analisis *paper* DSS menghasilkan pemeringkatan/klasifikasi zona berbasis kriteria terukur, tetapi sulit dibaca secara praktis oleh masyarakat jika hanya berbentuk tabel atau teks di dokumen paper.

### Tujuan
1. Menyajikan hasil evaluasi DSS dari paper ke dalam bentuk **peta interaktif berbasis zona**.
2. Membantu mahasiswa dan warga mengambil keputusan lebih cepat dan aman saat memilih lokasi kos/hunian di Jatinangor.
3. Menjaga antarmuka tetap **ringkas dan fokus** hanya pada peta zona tanpa fitur tambahan yang tidak diperlukan.

---

## 3. Target Pengguna
1. **Mahasiswa** (calon mahasiswa baru maupun mahasiswa aktif di kawasan Jatinangor seperti UNPAD, ITB Jatinangor, IPDN, IKOPIN, dan sekitarnya) yang sedang mencari kos.
2. **Warga / Pendatang** yang mencari hunian atau kontrakan di wilayah Jatinangor.
3. **Dosen / Penguji Mata Kuliah DSS** yang meninjau implementasi visual dari output *paper* DSS.

---

## 4. Ruang Lingkup (Scope)

### Yang Termasuk (In-Scope)
- **Peta Interaktif Wilayah Jatinangor** (zoom, pan, reset view ke area Jatinangor).
- **Visualisasi Zona 3 Kategori:**
  - **Aman** (Hijau)
  - **Kurang Aman** (Kuning / Oranye)
  - **Tidak Aman** (Merah)
- **Legenda Peta** yang selalu terlihat dan mudah dipahami.
- **Filter Zona** (Semua, Aman, Kurang Aman, Tidak Aman).
- **Pencarian / Pilihan Daerah** untuk langsung mengarahkan peta ke wilayah tertentu (misal: Hegarmanah, Cikeruh, Sayang, Cibeusi, Cipacing, dll.).
- **Detail Zona (Popup / Side Panel)** saat zona diklik, menampilkan:
  - Nama daerah / blok
  - Status zona (`Aman` / `Kurang Aman` / `Tidak Aman`)
  - Skor / nilai indeks kelayakan & keamanan (output DSS dari paper)
  - Ringkasan alasan atau kriteria penilaian (misal: tingkat kriminalitas/keamanan, penerangan jalan, akses fasilitas umum, kondisi lingkungan)
  - Catatan singkat untuk pencari kos

### Yang Tidak Termasuk (Out-of-Scope)
Untuk menjaga kesederhanaan sesuai tujuan proyek:
- Tidak ada sistem login/register akun pengguna.
- Tidak ada daftar iklan kos, harga sewa, booking, atau transaksi pembayaran.
- Tidak ada forum komentar, chat, atau pelaporan *crowdsourced* *real-time*.
- Tidak ada backend/database kompleks jika data zona sudah final dari paper (cukup data statis GeoJSON/JSON).

---

## 5. Alur Pengguna (User Flow)
1. Pengguna membuka halaman web **JatinangorAman**.
2. Peta langsung menampilkan wilayah Jatinangor beserta seluruh zona berwarna (Hijau, Kuning/Oranye, Merah) dan legenda.
3. Pengguna dapat:
   - Memfilter kategori zona (misal hanya ingin melihat zona **Aman**).
   - Mencari atau memilih nama daerah tertentu.
   - Mengklik salah satu zona di peta.
4. Sistem menampilkan detail zona (status, skor DSS, ringkasan faktor keamanan & kelayakan).
5. Pengguna menggunakan informasi tersebut sebagai referensi memilih daerah kos.

---

## 6. Kebutuhan Fungsional

| ID | Fitur | Deskripsi | Prioritas |
| :--- | :--- | :--- | :--- |
| **FR-01** | Peta Interaktif Jatinangor | Menampilkan peta dasar (OpenStreetMap / MapTiler) yang terkunci/berpusat di area Jatinangor dengan kontrol zoom & pan. | Wajib |
| **FR-02** | Layer Poligon Zona | Menampilkan batas-batas zona dengan warna sesuai kategori: Hijau (Aman), Kuning/Oranye (Kurang Aman), Merah (Tidak Aman). | Wajib |
| **FR-03** | Detail Informasi Zona | Saat zona diklik atau di-hover, muncul panel/popup berisi nama zona, kategori, skor DSS, dan faktor penentu. | Wajib |
| **FR-04** | Filter Kategori Zona | Tombol/chip filter untuk menyaring tampilan zona (Semua / Aman / Kurang Aman / Tidak Aman). | Wajib |
| **FR-05** | Legenda Warna | Menampilkan keterangan warna dan arti status zona secara jelas di sudut peta. | Wajib |
| **FR-06** | Pencarian / Quick Jump Daerah | Input pencarian atau daftar cepat nama desa/daerah di Jatinangor agar peta otomatis fokus ke lokasi tersebut. | Disarankan |
| **FR-07** | Ringkasan Metodologi DSS | Tombol info ("Tentang Data / Paper") yang menjelaskan secara singkat metode & kriteria penilaian DSS yang digunakan. | Opsional |

---

## 7. Kebutuhan Non-Fungsional
- **Responsif (Mobile & Desktop):** Nyaman dibuka dari HP (saat survei lokasi langsung di Jatinangor) maupun laptop.
- **Ringan & Cepat:** Peta dan data zona dimuat dalam waktu < 2 detik karena menggunakan file GeoJSON statis.
- **Aksesibilitas & Kontras:** Warna zona tetap kontras dengan peta dasar dan disertai label teks/ikon status agar tidak hanya bergantung pada warna.

---

## 8. Struktur Data Zona (Integrasi Output Paper DSS)
Setiap zona direpresentasikan dalam format **GeoJSON** (`FeatureCollection`) dengan properti hasil perhitungan paper DSS:

```json
{
  "type": "Feature",
  "properties": {
    "id": "zona-hegarmanah-utara",
    "name": "Hegarmanah (Sekitar Kampus)",
    "district": "Hegarmanah",
    "status": "aman",
    "dssScore": 0.84,
    "summary": "Penerangan jalan baik, ramai aktivitas mahasiswa, akses angkutan mudah.",
    "factors": {
      "keamanan": "Tinggi",
      "penerangan": "Baik",
      "aksesibilitas": "Sangat Baik",
      "lingkungan": "Layak"
    },
    "recommendation": "Direkomendasikan untuk kos mahasiswa."
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[107.77, -6.92], ...]]
  }
}
```

> **Catatan:** Nilai `status` hanya bernilai `"aman"`, `"kurang_aman"`, atau `"tidak_aman"`. Nilai `dssScore` dan `factors` disesuaikan langsung dengan hasil perhitungan metode DSS pada paper (misal AHP / TOPSIS / SAW / WP).

---

## 9. Rekomendasi Tech Stack (Sederhana & Efisien)
- **Frontend:** React / Next.js atau Vite + React (TypeScript)
- **Library Peta:** Leaflet (`react-leaflet`) atau MapLibre GL JS (gratis, ringan, tanpa perlu billing API key berbayar jika memakai tile OpenStreetMap / Carto)
- **Styling:** Tailwind CSS
- **Data:** File lokal `zones.geojson` (tidak butuh server backend terpisah)
- **Hosting:** Vercel / Netlify / GitHub Pages

---

## 10. Kriteria Keberhasilan
1. Seluruh zona hasil analisis *paper* DSS terpetakan dengan warna status yang sesuai (**Aman**, **Kurang Aman**, **Tidak Aman**).
2. Pengguna dapat mengklik zona mana saja dan langsung membaca alasan/skor kelayakan tanpa kebingungan.
3. Tampilan bersih, tidak penuh elemen yang tidak relevan, dan berjalan lancar di browser desktop maupun mobile.
