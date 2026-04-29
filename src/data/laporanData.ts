// Tipe & helper data laporan murid (sumber data: Supabase).

export type Level = "Pra-Tahsin" | "Tahsin" | "Tahfizh";

export interface SkillScore {
  pengucapan: number;
  kelancaran: number;
  tajwid: number;
  tartil: number;
}

export interface SuratHafalan {
  nomor: number;
  nama: string;
  ayat: number;
  /** 0-100 */
  kelancaran: number;
}

export interface JuzHafalan {
  nomor: number;
  surat: SuratHafalan[];
}

export interface RiwayatPekanan {
  id?: string;
  tanggal: string;
  pekan: string;
  materi: string;
  catatan: string;
  fokus: string[];
}

export interface ProgresPoint {
  id?: string;
  pekan: string;
  urutan?: number;
  pengucapan: number;
  kelancaran: number;
  tajwid: number;
  tartil: number;
}

export interface Murid {
  id?: string;
  slug: string;
  nama: string;
  panggilan: string;
  level: Level;
  pengajar: string;
  mulaiBelajar: string;
  jadwal: string;
  totalPertemuan: number;
  targetSaatIni: string;
  skill: SkillScore;
  hafalan: JuzHafalan[];
  riwayat: RiwayatPekanan[];
  progres: ProgresPoint[];
}

// Acuan nama-nama surat Juz 30 (untuk seed cepat di admin).
export const JUZ_30_SURAT: { nomor: number; nama: string; ayat: number }[] = [
  { nomor: 78, nama: "An-Naba'", ayat: 40 },
  { nomor: 79, nama: "An-Nazi'at", ayat: 46 },
  { nomor: 80, nama: "'Abasa", ayat: 42 },
  { nomor: 81, nama: "At-Takwir", ayat: 29 },
  { nomor: 82, nama: "Al-Infithar", ayat: 19 },
  { nomor: 83, nama: "Al-Muthaffifin", ayat: 36 },
  { nomor: 84, nama: "Al-Insyiqaq", ayat: 25 },
  { nomor: 85, nama: "Al-Buruj", ayat: 22 },
  { nomor: 86, nama: "Ath-Thariq", ayat: 17 },
  { nomor: 87, nama: "Al-A'la", ayat: 19 },
  { nomor: 88, nama: "Al-Ghasyiyah", ayat: 26 },
  { nomor: 89, nama: "Al-Fajr", ayat: 30 },
  { nomor: 90, nama: "Al-Balad", ayat: 20 },
  { nomor: 91, nama: "Asy-Syams", ayat: 15 },
  { nomor: 92, nama: "Al-Lail", ayat: 21 },
  { nomor: 93, nama: "Adh-Dhuha", ayat: 11 },
  { nomor: 94, nama: "Asy-Syarh", ayat: 8 },
  { nomor: 95, nama: "At-Tin", ayat: 8 },
  { nomor: 96, nama: "Al-'Alaq", ayat: 19 },
  { nomor: 97, nama: "Al-Qadr", ayat: 5 },
  { nomor: 98, nama: "Al-Bayyinah", ayat: 8 },
  { nomor: 99, nama: "Az-Zalzalah", ayat: 8 },
  { nomor: 100, nama: "Al-'Adiyat", ayat: 11 },
  { nomor: 101, nama: "Al-Qari'ah", ayat: 11 },
  { nomor: 102, nama: "At-Takatsur", ayat: 8 },
  { nomor: 103, nama: "Al-'Ashr", ayat: 3 },
  { nomor: 104, nama: "Al-Humazah", ayat: 9 },
  { nomor: 105, nama: "Al-Fil", ayat: 5 },
  { nomor: 106, nama: "Quraisy", ayat: 4 },
  { nomor: 107, nama: "Al-Ma'un", ayat: 7 },
  { nomor: 108, nama: "Al-Kautsar", ayat: 3 },
  { nomor: 109, nama: "Al-Kafirun", ayat: 6 },
  { nomor: 110, nama: "An-Nashr", ayat: 3 },
  { nomor: 111, nama: "Al-Lahab", ayat: 5 },
  { nomor: 112, nama: "Al-Ikhlas", ayat: 4 },
  { nomor: 113, nama: "Al-Falaq", ayat: 5 },
  { nomor: 114, nama: "An-Nas", ayat: 6 },
];

/** Bangun struktur 30 juz dari array surat hafalan (DB). Juz tanpa data → kosong. */
export function build30JuzFromRows(
  rows: { juz: number; nomor_surat: number; nama_surat: string; jumlah_ayat: number; kelancaran: number }[],
): JuzHafalan[] {
  const map = new Map<number, SuratHafalan[]>();
  for (let i = 1; i <= 30; i++) map.set(i, []);
  for (const r of rows) {
    const arr = map.get(r.juz) ?? [];
    arr.push({
      nomor: r.nomor_surat,
      nama: r.nama_surat,
      ayat: r.jumlah_ayat,
      kelancaran: r.kelancaran,
    });
    map.set(r.juz, arr);
  }
  const result: JuzHafalan[] = [];
  for (let i = 1; i <= 30; i++) {
    const arr = (map.get(i) ?? []).slice().sort((a, b) => a.nomor - b.nomor);
    result.push({ nomor: i, surat: arr });
  }
  return result;
}

export function rataRataJuz(juz: JuzHafalan): number {
  if (juz.surat.length === 0) return 0;
  const total = juz.surat.reduce((s, x) => s + x.kelancaran, 0);
  return Math.round(total / juz.surat.length);
}

export function totalMutqin(murid: Murid): number {
  return murid.hafalan.reduce(
    (s, j) => s + j.surat.filter((x) => x.kelancaran === 100).length,
    0,
  );
}

export function totalSedangDihafal(murid: Murid): number {
  return murid.hafalan.reduce(
    (s, j) => s + j.surat.filter((x) => x.kelancaran > 0 && x.kelancaran < 100).length,
    0,
  );
}
