# JatinangorAman

Peta interaktif pemetaan **keamanan dan kelayakan daerah kos/hunian di Jatinangor** untuk mahasiswa dan warga, berbasis output *paper* mata kuliah **Decision Support System (DSS)**.

---

## Tentang Proyek
**JatinangorAman** dibuat agar hasil analisis DSS mengenai tingkat keamanan dan kelayakan wilayah di Jatinangor dapat dilihat secara visual dan praktis oleh pencari kos. Alih-alih membaca tabel skor yang kompleks, pengguna cukup membuka peta interaktif untuk melihat pembagian zona secara langsung.

Fokus utama web ini **hanya pada peta interaktif zona**, tanpa fitur berlebih seperti login, booking, atau marketplace kos.

---

## Klasifikasi Zona
Setiap wilayah/blok di Jatinangor diklasifikasikan ke dalam 3 status berdasarkan skor evaluasi DSS:

| Status | Warna | Keterangan Singkat |
| :--- | :--- | :--- |
| **Aman** | Hijau | Lingkungan relatif aman, penerangan & akses baik, layak untuk hunian/kos. |
| **Kurang Aman** | Kuning / Oranye | Perlu kewaspadaan ekstra (misal penerangan minim di jam tertentu atau akses terbatas). |
| **Tidak Aman** | Merah | Memiliki tingkat kerawanan tinggi atau kondisi lingkungan kurang layak untuk kos. |

---

## Fitur Utama
1. **Peta Interaktif Jatinangor** — Zoom, geser, dan fokus area Jatinangor.
2. **Filter Zona** — Saring peta berdasarkan kategori (`Semua`, `Aman`, `Kurang Aman`, `Tidak Aman`).
3. **Detail Zona (Klik / Popup)** — Menampilkan nama daerah, status zona, skor DSS dari paper, dan ringkasan faktor penilaian.
4. **Legenda & Pencarian Daerah** — Memudahkan navigasi ke daerah tertentu di Jatinangor (misal: Hegarmanah, Cikeruh, Sayang, Cibeusi, Cipacing, dll.).

---

## Dokumen Terkait
- [PRD.md](./PRD.md) — *Product Requirements Document* lengkap (tujuan, scope, user flow, kebutuhan fungsional, dan skema data GeoJSON).

---

## Rencana Struktur Data (`GeoJSON`)
Data zona disimpan secara statis (misalnya `data/zones.geojson`) dengan atribut output DSS:
- `name`: Nama daerah/blok
- `status`: `"aman"` | `"kurang_aman"` | `"tidak_aman"`
- `dssScore`: Skor akhir hasil perhitungan DSS dari paper
- `summary`: Ringkasan kondisi keamanan & kelayakan
- `factors`: Detail kriteria penilaian dari paper (misal keamanan, penerangan, aksesibilitas, lingkungan)

---

## Status Proyek
Saat ini berada pada tahap **dokumentasi & perancangan awal** (`PRD.md` dan `README.md`). Langkah berikutnya adalah:
1. Memasukkan koordinat poligon wilayah dan skor final dari *paper* DSS ke format `GeoJSON`.
2. Membangun antarmuka peta interaktif (disarankan menggunakan Vite/Next.js + Leaflet/MapLibre).
