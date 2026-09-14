import { TaskItem } from '../types';

/**
 * 2 Contoh Tugas Demo Awal untuk Pengguna Baru
 */
export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'demo-task-1',
    title: 'Belajar State Management & Hooks Modern di React',
    category: 'Pemrograman',
    priority: 'tinggi',
    status: 'pending',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estimatedMinutes: 30,
    readingContent: `### Ringkasan Konsep React Hooks & State Management

React Hooks menyederhanakan pengelolaan lifecycle dan state tanpa class component.

#### Poin Kunci:
1. **useState**: Mengelola state lokal komponen sederhana.
2. **useEffect**: Mengelola efek samping (side-effects) seperti subscription atau pemanggilan API.
3. **Custom Hooks**: Memisahkan logika bisnis yang reusable agar UI tetap bersih dan modular.`,
    subtasks: [
      { id: 'sub-demo-1', title: 'Pahami perbedaan useState dan useReducer', completed: false },
      { id: 'sub-demo-2', title: 'Praktik membuat custom hook sederhana', completed: false },
      { id: 'sub-demo-3', title: 'Uji reactivity state pada komponen formulir', completed: false }
    ],
    sourceUrl: 'https://react.dev/reference/react',
    referenceLinks: [
      { id: 'ref-demo-1', title: 'Dokumentasi Resmi React Hooks', url: 'https://react.dev/reference/react' }
    ],
    notes: 'Prioritaskan pemahaman dependency array pada useEffect.',
    createdAt: new Date().toISOString().split('T')[0]
  },
  {
    id: 'demo-task-2',
    title: 'Membaca Bab 1: Prinsip Hierarki Visual & Tipografi Desain UI',
    category: 'Membaca',
    priority: 'sedang',
    status: 'pending',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estimatedMinutes: 25,
    readingContent: `### Rangkuman Bab 1: Desain Hierarki Visual yang Efektif

Hierarki visual memandu perhatian pembaca ke elemen yang paling penting secara bertahap.

#### Prinsip Penting:
- **Kontras Ukuran & Bobot**: Judul harus lebih menonjol dibanding teks isi (body text).
- **Ruang Negatif (Whitespace)**: Berikan jarak bernapas antar elemen agar tampilan bersih dan nyaman dibaca.
- **Konsistensi Aksen Warna**: Gunakan satu warna aksen dominan untuk aksi utama (CTA).`,
    subtasks: [
      { id: 'sub-demo-4', title: 'Baca materi prinsip kontras & whitespace', completed: false },
      { id: 'sub-demo-5', title: 'Tandai kutipan penting tentang tipografi', completed: false }
    ],
    sourceUrl: 'https://www.refactoringui.com/',
    referenceLinks: [
      { id: 'ref-demo-2', title: 'Panduan Desain Refactoring UI', url: 'https://www.refactoringui.com/' }
    ],
    notes: 'Perhatikan rasio kontras warna untuk standar aksesibilitas.',
    createdAt: new Date().toISOString().split('T')[0]
  }
];
