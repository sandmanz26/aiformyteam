// Semua data di sini adalah MOCK / contoh. Tidak ada backend atau database.

// Kategori tugas + estimasi persentase waktu yang bisa dihemat dengan AI (sample).
export const CATEGORIES = {
  writing:   { label: 'Menulis & konten',        pct: 0.6,  hint: 'Artikel, caption, proposal, email panjang' },
  research:  { label: 'Riset & rangkuman',       pct: 0.65, hint: 'Cari referensi, rangkum dokumen, benchmark' },
  data:      { label: 'Analisis data & laporan', pct: 0.5,  hint: 'Rekap angka, laporan, spreadsheet' },
  admin:     { label: 'Administrasi & email',    pct: 0.5,  hint: 'Balas email, input data, jadwal' },
  code:      { label: 'Coding & teknis',         pct: 0.4,  hint: 'Tulis kode, debug, dokumentasi teknis' },
  design:    { label: 'Desain & kreatif',        pct: 0.35, hint: 'Ide visual, copy desain, variasi aset' },
  meeting:   { label: 'Meeting & notulen',       pct: 0.7,  hint: 'Notulen, action item, ringkasan' },
  support:   { label: 'Layanan pelanggan',       pct: 0.55, hint: 'Balasan tiket, FAQ, template jawaban' },
  translate: { label: 'Terjemahan & editing',    pct: 0.7,  hint: 'Terjemah, proofread, ubah gaya bahasa' },
  other:     { label: 'Lainnya',                 pct: 0.3,  hint: 'Pekerjaan yang tidak masuk kategori lain' },
}

// Jabatan + gaji bulanan umum (sample) + contoh tugas yang bisa diklik cepat.
export const ROLES = [
  { id: 'marketing', name: 'Marketing / Content', salary: 9000000, tasks: [
    { name: 'Menulis artikel & caption', category: 'writing', hoursPer: 2, freq: 10, period: 'minggu' },
    { name: 'Riset kompetitor & tren', category: 'research', hoursPer: 3, freq: 2, period: 'minggu' },
    { name: 'Laporan performa kampanye', category: 'data', hoursPer: 4, freq: 1, period: 'minggu' },
  ] },
  { id: 'admin', name: 'Admin / Operasional', salary: 6000000, tasks: [
    { name: 'Balas email & koordinasi', category: 'admin', hoursPer: 2, freq: 1, period: 'hari' },
    { name: 'Rekap data & laporan harian', category: 'data', hoursPer: 1.5, freq: 1, period: 'hari' },
    { name: 'Notulen meeting', category: 'meeting', hoursPer: 1, freq: 3, period: 'minggu' },
  ] },
  { id: 'finance', name: 'Finance / Akuntansi', salary: 11000000, tasks: [
    { name: 'Rekonsiliasi & rekap transaksi', category: 'data', hoursPer: 3, freq: 3, period: 'minggu' },
    { name: 'Menyusun laporan keuangan bulanan', category: 'data', hoursPer: 12, freq: 1, period: 'bulan' },
    { name: 'Email tagihan & follow-up', category: 'admin', hoursPer: 1, freq: 1, period: 'hari' },
  ] },
  { id: 'hr', name: 'HR / People', salary: 10000000, tasks: [
    { name: 'Screening CV & shortlist', category: 'research', hoursPer: 6, freq: 1, period: 'minggu' },
    { name: 'Menulis job description & kebijakan', category: 'writing', hoursPer: 3, freq: 1, period: 'minggu' },
    { name: 'Notulen & tindak lanjut interview', category: 'meeting', hoursPer: 2, freq: 2, period: 'minggu' },
  ] },
  { id: 'sales', name: 'Sales / Business Dev', salary: 10000000, tasks: [
    { name: 'Menulis proposal & penawaran', category: 'writing', hoursPer: 3, freq: 3, period: 'minggu' },
    { name: 'Riset calon klien', category: 'research', hoursPer: 2, freq: 4, period: 'minggu' },
    { name: 'Email follow-up klien', category: 'admin', hoursPer: 1, freq: 1, period: 'hari' },
  ] },
  { id: 'cs', name: 'Customer Support', salary: 6500000, tasks: [
    { name: 'Membalas tiket pelanggan', category: 'support', hoursPer: 4, freq: 1, period: 'hari' },
    { name: 'Menulis & update FAQ', category: 'writing', hoursPer: 2, freq: 1, period: 'minggu' },
  ] },
  { id: 'dev', name: 'Software Engineer', salary: 18000000, tasks: [
    { name: 'Menulis & review kode', category: 'code', hoursPer: 3, freq: 1, period: 'hari' },
    { name: 'Dokumentasi teknis', category: 'writing', hoursPer: 3, freq: 1, period: 'minggu' },
    { name: 'Debugging & investigasi bug', category: 'code', hoursPer: 1.5, freq: 1, period: 'hari' },
  ] },
  { id: 'designer', name: 'Desainer', salary: 11000000, tasks: [
    { name: 'Riset referensi & moodboard', category: 'research', hoursPer: 3, freq: 2, period: 'minggu' },
    { name: 'Variasi konsep & copy desain', category: 'design', hoursPer: 4, freq: 3, period: 'minggu' },
  ] },
  { id: 'pm', name: 'Product / Project Manager', salary: 16000000, tasks: [
    { name: 'Menulis PRD & spesifikasi', category: 'writing', hoursPer: 4, freq: 2, period: 'minggu' },
    { name: 'Notulen & action item meeting', category: 'meeting', hoursPer: 1, freq: 1, period: 'hari' },
    { name: 'Rangkum feedback pengguna', category: 'research', hoursPer: 3, freq: 1, period: 'minggu' },
  ] },
  { id: 'other', name: 'Lainnya', salary: 8000000, tasks: [] },
]

// Pilihan tool AI + harga per user per bulan (USD, sample).
export const AI_TOOLS = [
  { id: 'chatgpt-plus', name: 'ChatGPT Plus',   vendor: 'OpenAI',    usd: 20, note: 'Asisten serbaguna' },
  { id: 'claude-pro',   name: 'Claude Pro',     vendor: 'Anthropic', usd: 20, note: 'Menulis & analisis dokumen panjang' },
  { id: 'gemini',       name: 'Gemini Advanced',vendor: 'Google',    usd: 20, note: 'Terintegrasi Google Workspace' },
  { id: 'copilot',      name: 'Microsoft Copilot', vendor: 'Microsoft', usd: 30, note: 'Terintegrasi Office 365' },
  { id: 'team',         name: 'Paket Team (ChatGPT/Claude)', vendor: 'Team', usd: 30, note: 'Fitur kolaborasi & admin' },
  { id: 'custom',       name: 'AI lain (isi sendiri)', vendor: 'Custom', usd: 0, note: 'Masukkan harga sendiri' },
]

export const SCENARIOS = {
  konservatif: { label: 'Konservatif', factor: 0.6,  desc: 'Hanya 60% dari estimasi' },
  realistis:   { label: 'Realistis',   factor: 1,    desc: 'Sesuai estimasi' },
  optimis:     { label: 'Optimis',     factor: 1.25, desc: '125% dari estimasi' },
}

export const DEFAULT_ASSUMPTIONS = {
  kurs: 16500,       // IDR per USD (mock)
  workHours: 173,    // jam kerja per bulan (standar ketenagakerjaan ID)
  overhead: 1,       // pengali biaya penuh karyawan (BPJS, tunjangan, dll)
  scenario: 'realistis',
}

// Data contoh untuk tombol "Isi contoh" — mengikuti kasus nyata:
// hemat ~5 jam/bulan (~Rp 400 rb) sudah menutup langganan AI.
export const DEMO = {
  employees: [
    { id: 'd1', name: 'Rina', role: 'marketing', salary: 14000000, tasks: [
      { id: 't1', name: 'Menulis artikel & caption', category: 'writing', hoursPer: 2, freq: 5, period: 'minggu' },
      { id: 't2', name: 'Riset kompetitor & tren', category: 'research', hoursPer: 3, freq: 2, period: 'minggu' },
      { id: 't3', name: 'Laporan performa kampanye', category: 'data', hoursPer: 4, freq: 1, period: 'minggu' },
    ] },
    { id: 'd2', name: 'Dimas', role: 'admin', salary: 7000000, tasks: [
      { id: 't4', name: 'Balas email & koordinasi', category: 'admin', hoursPer: 2, freq: 1, period: 'hari' },
      { id: 't5', name: 'Notulen meeting', category: 'meeting', hoursPer: 1, freq: 3, period: 'minggu' },
    ] },
  ],
  tools: { 'claude-pro': { selected: true, usd: 20, idr: null } },
}
