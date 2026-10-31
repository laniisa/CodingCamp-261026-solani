# Expense & Budget Visualizer

Aplikasi pencatatan dan visualisasi pengeluaran sederhana menggunakan HTML, CSS, dan Vanilla JavaScript.

## Fitur
- Menambah transaksi dengan nama item, nominal, dan kategori (Food, Transport, Fun).
- Validasi input dan penghapusan transaksi.
- Total seluruh pengeluaran dan ringkasan pengeluaran bulan berjalan.
- Diagram lingkaran pengeluaran berdasarkan kategori.
- Penyimpanan data menggunakan Local Storage.
- Batas anggaran bulanan dengan indikator penggunaan.
- Mode terang dan gelap.

## Teknologi
- HTML5
- CSS3
- Vanilla JavaScript
- Browser Local Storage

## Struktur folder
```text
expense-budget-visualizer/
├── .kiro/
│   └── steering/
│       └── project.md
├── css/
│   └── style.css
├── js/
│   └── script.js
├── index.html
└── README.md
```

## Menjalankan aplikasi
1. Buka folder proyek di Kiro.
2. Buka `index.html`.
3. Jalankan menggunakan browser (klik kanan `index.html` lalu pilih Open in Default Browser, atau gunakan ekstensi Live Server jika tersedia).
4. Tambahkan transaksi untuk melihat ringkasan dan diagram berubah otomatis.

Tidak membutuhkan instalasi package atau backend.

## Catatan
- Data tersimpan di Local Storage browser/perangkat yang digunakan.
- Menghapus data browser dapat menghapus data transaksi yang tersimpan.
- Ringkasan bulanan menggunakan bulan dan tahun lokal perangkat.
- Folder `.kiro` berisi panduan proyek untuk membantu konteks kerja Kiro.
