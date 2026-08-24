import { TaskItem } from '../types';

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Mempelajari State Management & Hooks Modern di React',
    category: 'Pemrograman',
    priority: 'tinggi',
    status: 'in_progress',
    dueDate: '2026-08-25',
    estimatedMinutes: 45,
    readingContent: `### Pengantar React Hooks & State Management

React Hooks memungkinkan kita menggunakan state dan fitur React lainnya tanpa harus menulis class component. Dalam arsitektur aplikasi modern, pengelolaan state yang bersih sangat penting untuk performa dan kemudahan pemeliharaan.

#### Poin-Poin Utama yang Perlu Dipahami:
1. **useState & useReducer**: Gunakan \`useState\` untuk state sederhana yang berdiri sendiri. Gunakan \`useReducer\` jika alur perubahan state kompleks dan saling bergantung.
2. **useEffect & Cleanup**: Hindari *side-effect* yang berjalan terus-menerus. Selalu sediakan fungsi cleanup jika ada listener atau subscription.
3. **Custom Hooks**: Ekstraksi logika yang berulang ke dalam custom hooks agar komponen UI tetap ringkas dan fokus pada presentasi.
4. **Optimasi Render**: Gunakan \`useMemo\` dan \`useCallback\` secara bijak hanya ketika terjadi kalkulasi berat atau perbandingan referensi props.

*Tips Praktis:* Jaga struktur state tetap flat (datar) dan hindari menyalin props ke dalam state lokal kecuali benar-benar diperlukan.`,
    subtasks: [
      { id: 'sub-1', title: 'Baca dokumentasi resmi React Hooks', completed: true },
      { id: 'sub-2', title: 'Praktik implementasi useReducer untuk form multi-langkah', completed: true },
      { id: 'sub-3', title: 'Buat 1 custom hook reusable (useLocalStorage)', completed: false }
    ],
    referenceLinks: [
      { title: 'Dokumentasi React.dev Hooks', url: 'https://react.dev/reference/react' },
      { title: 'Best Practices State Management', url: 'https://kentcdodds.com/blog' }
    ],
    notes: 'Perhatikan perbedaan dependency array kosong [] vs tanpa array.',
    createdAt: '2026-08-20'
  },
  {
    id: 'task-2',
    title: 'Membaca Bab 3: Desain Hierarki Visual & Tipografi UI',
    category: 'Membaca',
    priority: 'sedang',
    status: 'pending',
    dueDate: '2026-08-26',
    estimatedMinutes: 30,
    readingContent: `### Rangkuman Bab 3: Hierarki Visual yang Efektif

Hierarki visual adalah susunan elemen dalam desain sedemikian rupa sehingga pengguna dapat menangkap urutan kepentingan secara intuitif tanpa perlu berpikir keras.

#### Prinsip Penting:
- **Kontras Ukuran & Bobot**: Judul (Heading) harus memiliki bobot tebal dan kontras proporsional terhadap teks isi (Body text) minimal 1.25x skala rasio.
- **Whitespace (Ruang Negatif)**: Berikan ruang bernapas antar elemen. Jarak yang lapang membuat konten terlihat profesional dan tidak melelahkan mata pembaca.
- **Scanning Pattern (Pola F & Z)**: Pengguna digital jarang membaca kata demi kata; mereka memindai dari kiri atas ke kanan lalu ke bawah. Gunakan poin-poin tegas untuk memudahkan pemindaian.
- **Konsistensi Skala Warna**: Gunakan maksimal 1 warna aksen dominan untuk aksi utama (CTA), didukung warna netral dengan tingkat kontras yang memenuhi standar aksesibilitas WCAG.`,
    subtasks: [
      { id: 'sub-4', title: 'Membaca materi prinsip kontras & whitespace', completed: false },
      { id: 'sub-5', title: 'Menandai kutipan penting tentang tipografi', completed: false }
    ],
    referenceLinks: [
      { title: 'Refactoring UI Book by Adam Wathan', url: 'https://www.refactoringui.com/' }
    ],
    notes: 'Fokus pada penerapan rasio modular font 1.25 (Major Third).',
    createdAt: '2026-08-21'
  },
  {
    id: 'task-3',
    title: 'Menyusun Laporan & Dokumentasi Proyek Akhir',
    category: 'Tugas Kuliah',
    priority: 'tinggi',
    status: 'completed',
    dueDate: '2026-08-22',
    estimatedMinutes: 60,
    readingContent: `### Panduan Struktur Laporan Proyek Akhir

Laporan harus terstruktur rapi dengan sistematika penulisan yang jelas dan ringkas:

1. **Bab 1: Pendahuluan**: Latar belakang masalah, rumusan masalah, dan tujuan aplikasi.
2. **Bab 2: Landasan Teori**: Kajian pustaka ringkas mengenai teknologi yang digunakan.
3. **Bab 3: Metodologi & Desain Sistem**: Diagram alur data (flowchart), perancangan UI, dan skema basis data.
4. **Bab 4: Implementasi & Pengujian**: Bukti fungsionalitas fitur utama dan hasil pengujian pengguna.
5. **Bab 5: Kesimpulan & Saran**: Ringkasan capaian dan rekomendasi perbaikan untuk versi mendatang.`,
    subtasks: [
      { id: 'sub-6', title: 'Selesaikan Bab 1 & Bab 2', completed: true },
      { id: 'sub-7', title: 'Lengkapi diagram arsitektur sistem di Bab 3', completed: true },
      { id: 'sub-8', title: 'Kompilasi lampiran screenshot pengujian', completed: true }
    ],
    createdAt: '2026-08-18',
    completedAt: '2026-08-22'
  },
  {
    id: 'task-4',
    title: 'Review Sintaks TypeScript Utility Types (Omit, Pick, Partial)',
    category: 'Belajar',
    priority: 'rendah',
    status: 'pending',
    dueDate: '2026-08-28',
    estimatedMinutes: 20,
    readingContent: `### Ringkasan TypeScript Utility Types

TypeScript menyediakan utility types bawaan untuk memfasilitasi transformasi tipe secara praktis:

- \`Partial<T>\`: Mengubah semua properti dalam \`T\` menjadi opsional (\`?\`).
- \`Required<T>\`: Mengubah semua properti opsional menjadi wajib diisi.
- \`Pick<T, K>\`: Mengambil subset properti tertentu \`K\` dari tipe \`T\`.
- \`Omit<T, K>\`: Menghapus properti \`K\` dari tipe \`T\`.
- \`Record<K, T>\`: Membuat tipe objek dengan kumpulan key \`K\` bertipe \`T\`.
- \`Readonly<T>\`: Menjadikan semua properti tipe \`T\` hanya bisa dibaca (immutable).`,
    subtasks: [
      { id: 'sub-9', title: 'Coba contoh kasus Omit vs Pick di TypeScript Playground', completed: false }
    ],
    referenceLinks: [
      { title: 'TS Handbook: Utility Types', url: 'https://www.typescriptlang.org/docs/handbook/utility-types.html' }
    ],
    createdAt: '2026-08-21'
  }
];
