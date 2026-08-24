# Product Requirement Document (PRD) — Jejak Tugas

---

## 1. Executive Summary & Project Overview

### 1.1 Ringkasan Produk
**Jejak Tugas** adalah aplikasi manajemen tugas, produktivitas, dan ruang baca materi terintegrasi yang dirancang untuk pelajar, mahasiswa, dan pembelajar mandiri. Aplikasi ini menggabungkan manajemen daftar tugas (*Task Management*), pengatur waktu fokus mendalam (*Pomodoro Focus Timer*), pencatat kilat (*Quick Scratchpad*), ruang baca materi (*Reading Space*), serta sistem gamifikasi (*Streak Counter & Confetti Celebration*) dalam antarmuka modern yang bersih, cepat, dan responsif.

### 1.2 Tujuan Utama
1. **Meningkatkan Fokus & Retensi Belajar**: Menyediakan timer Pomodoro terintegrasi dengan bilah persisten (*persistent focus bar*) yang terus berjalan antar-navigasi.
2. **Menjaga Konsistensi Belajar**: Gamifikasi sederhana melalui *Daily Streak Tracking* dan perayaan visual otomatis saat target harian tuntas 100%.
3. **Sentralisasi Belajar & Membaca**: Menghubungkan tugas langsung dengan catatan modul dan materi bacaan tanpa perlu berpindah aplikasi.
4. **Pengalaman Pengguna Tanpa Hambatan (*Seamless UX*)**: Transisi adaptif antara tampilan desktop (topbar + popover) dan mobile (bottom navigation bar + bottom sheet drawer).

---

## 2. Core User Flow & Architecture

### 2.1 Arsitektur Aplikasi
Aplikasi dibangun sebagai Single Page Application (SPA) berbasis komponen modular dengan arsitektur *offline-first* dan *local persistence*:

```
               ┌────────────────────────────────────────────────────────┐
               │                  React Root Container                  │
               │                   (App.tsx / main.tsx)                 │
               └───────────────────────────┬────────────────────────────┘
                                           │
             ┌─────────────────────────────┴─────────────────────────────┐
             │                                                           │
┌────────────▼──────────────┐                               ┌────────────▼──────────────┐
│  FocusTimerContext        │                               │    App Master State       │
│  - Mode & Countdown       │                               │  - tasks: TaskItem[]      │
│  - isRunning / isPaused   │                               │  - streakData: StreakData │
│  - completedSessions      │                               │  - userName & userInitials│
│  - LocalStorage Sync      │                               │  - currentView & filters  │
└────────────┬──────────────┘                               └────────────┬──────────────┘
             │                                                           │
             ├─────────────────────────────┬─────────────────────────────┤
             │                             │                             │
┌────────────▼──────────────┐ ┌────────────▼──────────────┐ ┌────────────▼──────────────┐
│  Persistent Focus Bar     │ │  View Router / Switcher   │ │  Adaptive Navigation     │
│  (Sticky Floating Bottom) │ │  - Dashboard              │ │  - Mobile: Bottom Nav 4x  │
│                           │ │  - TaskList               │ │  - Desktop: Topbar +      │
│                           │ │  - ReadingSpace           │ │    Profile Popover Card   │
└───────────────────────────┘ └───────────────────────────┘ └───────────────────────────┘
```

### 2.2 Alur Pengguna Utama (*Core User Flow*)
1. **Inisialisasi & Sapaan Adaptif**:
   - Pengguna membuka aplikasi dan langsung melihat *Hero Banner* dengan sapaan kontekstual sesuai waktu lokal (*Pagi/Siang/Sore/Malam*) beserta ringkasan progres harian.
2. **Manajemen Tugas & Pelacakan**:
   - Pengguna menambahkan atau memperbarui tugas (prioritas, kategori, tanggal jatuh tempo, sub-tugas, materi bacaan).
   - Menandai tugas sebagai selesai memperbarui kalkulasi progres harian secara instan.
   - Saat seluruh target tugas tuntas (100%), sistem secara otomatis menembakkan efek perayaan *Dual Side-Cannons Confetti*.
3. **Sesi Belajar Terfokus (Pomodoro Focus)**:
   - Pengguna mengaktifkan timer Pomodoro (25m / 45m / 50m / 5m Break / 15m Long Break).
   - Jika pengguna berpindah ke *Daftar Tugas*, *Ruang Baca*, atau *Profil*, *Persistent Focus Bar* melayang di atas navigasi bawah agar pengguna tetap memantau sisa waktu tanpa interupsi.
4. **Catatan Kilat (*Quick Scratchpad*)**:
   - Menulis memo atau ide sementara yang tersimpan secara *real-time* ke penyimpanan lokal (*auto-save*).
5. **Inspeksi Profil & Statistik Belajar**:
   - Mode Mobile: Membuka *Bottom Sheet Drawer* interaktif.
   - Mode Desktop: Membuka *Popover Dropdown Card* terjangkar di kanan atas.

---

## 3. UI/UX & Responsive Specification

### 3.1 Skema Warna & Tipografi
- **Warna Dasar**: Slate / Stone Neutral (`#0F172A`, `#1E293B`, `#F8FAFC`) berpadu dengan aksen Amber Emas (`#F59E0B`), Emerald Zamrud (`#10B981`), Sky Blue (`#0EA5E9`), dan Coral (`#FB7185`).
- **Tipografi**: Sans-serif bersih dengan angka *tabular mono* untuk timer, streak, dan persentase numerik.

### 3.2 Spesifikasi Responsif Adaptif

| Aspek Layout | Mode Mobile (`< 640px`) | Mode Desktop (`≥ 640px`) |
| :--- | :--- | :--- |
| **Navigasi Utama** | Fixed Bottom Navigation Bar (`grid-cols-4`) | Topbar Navbar Capsule Menu (`Dashboard`, `Tugas`, `Baca`) |
| **Profil & Pengaturan** | Bottom Sheet Drawer (meluncur dari bawah dengan drag handle) | Popover Dropdown Card (terjangkar di bawah avatar pojok kanan) |
| **Pencarian** | Bar pencarian terintegrasi di sub-header tampilan | Search bar responsif di bilah atas |
| **Kartu Hero Dashboard** | Dark Luxury Slate Card ringkas dengan tombol aksi cepat | Kartu Hero penuh dengan progress meter & greeting interaktif |
| **Focus Timer Bar** | Mengambang tepat di atas Mobile Bottom Nav (`bottom-[60px]`) | Mengambang di pojok kanan bawah desktop |

---

## 4. Functional Requirements & Feature Modules

### Modul 1: Dashboard & Gamification Header
- **Dynamic Greeting**: Sapaan dinamis berdasarkan jam pengguna (*"Selamat Pagi / Siang / Sore / Malam, [Nama Pengguna]"*).
- **Daily Streak Engine (`🔥`)**:
  - Menyimpan data `count`, `lastActiveDate`, dan `bestStreak` di LocalStorage.
  - Memverifikasi selisih hari (`diffDays`):
    - Jika aktif di hari yang sama: pertahankan nilai streak.
    - Jika aktif di hari berikutnya: tambahkan `+1` streak.
    - Jika terlewat > 1 hari: reset streak ke `1`.
- **Target Progress Tracker**:
  - Menampilkan persentase selesai (`completedTasks / totalTasks * 100`).
  - Bar progres transisi halus dengan efek kilau *emerald* saat 100%.
- **Automatic Confetti Celebration (`canvas-confetti`)**:
  - *Trigger Condition*: Berjalan otomatis 1 kali (*single celebration blast*) saat transisi dari `< 100%` mencapai tepat `100%` (`totalTasks > 0`).
  - *Side-Cannons Animation*: Dua semburan partikel dari pojok kiri bawah (`angle: 60°`) dan kanan bawah (`angle: 120°`) mengarah ke tengah atas layar.
  - *Status Badge*: Menampilkan pill statis elegan `✨ Semua Target Hari Ini Tercapai (100%)`.

### Modul 2: Pomodoro Focus Timer Widget
- **Preset Sesi Fokus**:
  - *Fokus Standar (25 menit)*
  - *Fokus Mendalam (45 menit)*
  - *Fokus Intensif (50 menit)*
  - *Istirahat Singkat (5 menit)*
  - *Istirahat Panjang (15 menit)*
- **Kontrol & State**: Play, Pause, Resume, Reset, Skip.
- **Persistent Focus Bar**:
  - Komponen sticky yang tetap aktif di seluruh rute / view.
  - Menampilkan nama sesi, countdown waktu digital, indikator status, tombol pause/resume, dan tombol kembali ke widget utama.
- **Audio Feedback**: Notifikasi audio ringan (Web Audio Synth Chime) saat sesi berakhir.

### Modul 3: Task & Reading Management
- **CRUD & Metadata Tugas**:
  - Judul, deskripsi, tanggal batas (*due date*), kategori (*Akademik, Ujian, Tugas, Bacaan, Umum*).
  - Indikator Prioritas dengan *colored priority dots* (Tinggi: Merah, Sedang: Kuning, Rendah: Biru).
  - Sub-tugas checklist (*Subtask progress*).
- **Ruang Baca (*Reading Space*)**:
  - Materi belajar, ringkasan bab, dan catatan markdown terintegrasi di dalam setiap kartu tugas.
  - Estimasi waktu baca (*Reading time indicator*).

### Modul 4: Quick Scratchpad (Catatan Cepat)
- Area teks memo kilat di dashboard untuk menampung ide, rumus sementara, atau daftar belanja buku.
- **Auto-Save Real-Time**: Sinkronisasi instan ke LocalStorage tanpa tombol simpan manual.
- Indikator visual *"Tersimpan otomatis"*.

### Modul 5: Profil & Capaian Belajar (User Profile)
- **Header Identitas**: Avatar inisial kustom (contoh: `JT`), nama pengguna yang dapat disunting inline, dan status aktif.
- **Statistik Belajar (Grid 2x2)**:
  1. 🔥 **Streak Belajar**: Hari aktif saat ini & rekor streak tertinggi.
  2. ⏱️ **Total Waktu Fokus**: Akumulasi total waktu sesi Pomodoro yang diselesaikan (`jam & menit`).
  3. ✅ **Tugas Tuntas**: Jumlah tugas selesai vs total tugas beserta rasio persentase.
  4. 📖 **Ruang Materi**: Total artikel/catatan belajar yang tersedia.
- **Pengaturan Preferensi**:
  - Pilihan default durasi timer Pomodoro (25m / 45m / 50m).
  - Toggle switch notifikasi suara timer.

---

## 5. Tech Stack & State Management Guidelines

### 5.1 Technology Stack
- **Framework**: React 18+ dengan Vite & TypeScript
- **Styling**: Tailwind CSS (Utility-First Design, Modern Gradients & Micro-interactions)
- **Iconography**: `lucide-react`
- **Effects & Particles**: `canvas-confetti` (dengan `@types/canvas-confetti`)
- **State Management**: React `Context API` + Custom Hooks + LocalStorage Sync

### 5.2 Skema Kunci LocalStorage (*Storage Keys Specification*)

| Kunci LocalStorage | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `jejak_tasks_data` | `TaskItem[]` (JSON) | Daftar seluruh data tugas, sub-tugas, dan materi bacaan |
| `jejak_user_name` | `string` | Nama pengguna (Default: *"Sahabat Belajar"*) |
| `jejak_user_initials` | `string` | Inisial avatar profil (Default: *"JT"*) |
| `jejak_streak_data` | `StreakData` (JSON) | Data streak harian (`count`, `lastActiveDate`, `bestStreak`) |
| `jejak_scratchpad_notes` | `string` | Catatan kilat pada widget Scratchpad |
| `jejak_default_timer_mins`| `string` ("25" / "45" / "50") | Durasi fokus default pengguna |
| `jejak_sound_notification`| `string` ("true" / "false") | Status aktif/nonaktif suara dering timer |
| `jejak_completed_focus_sessions` | `number` | Total hitungan sesi fokus yang berhasil diselesaikan |

---

*Dokumen ini merupakan spesifikasi teknis dan fungsional resmi untuk pemeliharaan dan pengembangan aplikasi **Jejak Tugas**.*
