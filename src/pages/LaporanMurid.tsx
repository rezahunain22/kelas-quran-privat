import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, BookOpenCheck, CalendarDays, Clock, GraduationCap, Loader2,
  Sparkles, Target, TrendingUp, User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  build30JuzFromRows, totalMutqin, totalSedangDihafal,
  type Murid, type Level,
} from "@/data/laporanData";
import { supabase } from "@/integrations/supabase/client";
import { SkillRadar } from "@/components/laporan/SkillRadar";
import { ProgresChart } from "@/components/laporan/ProgresChart";
import { HafalanSection } from "@/components/laporan/HafalanSection";

const SkillBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
    <div className="h-2 rounded-full bg-muted overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  </div>
);

const LaporanMurid = () => {
  const { slug } = useParams<{ slug: string }>();
  const [murid, setMurid] = useState<Murid | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let muridId: string | null = null;

    const load = async () => {
      const { data: m } = await supabase.from("murid").select("*").eq("slug", slug.toLowerCase()).maybeSingle();
      if (!m) { setNotFound(true); setLoading(false); return; }
      muridId = m.id;

      const [skillRes, hafRes, riwRes, progRes] = await Promise.all([
        supabase.from("skill_score").select("*").eq("murid_id", m.id).maybeSingle(),
        supabase.from("surat_hafalan").select("*").eq("murid_id", m.id),
        supabase.from("riwayat_pekanan").select("*").eq("murid_id", m.id).order("tanggal", { ascending: false }),
        supabase.from("progres_pekanan").select("*").eq("murid_id", m.id).order("urutan"),
      ]);

      const skill = skillRes.data ?? { pengucapan: 0, kelancaran: 0, tajwid: 0, tartil: 0 };

      setMurid({
        id: m.id,
        slug: m.slug,
        nama: m.nama,
        panggilan: m.panggilan,
        level: m.level as Level,
        pengajar: m.pengajar,
        mulaiBelajar: m.mulai_belajar,
        jadwal: m.jadwal,
        totalPertemuan: m.total_pertemuan,
        targetSaatIni: m.target_saat_ini,
        skill: {
          pengucapan: skill.pengucapan, kelancaran: skill.kelancaran,
          tajwid: skill.tajwid, tartil: skill.tartil,
        },
        hafalan: build30JuzFromRows(hafRes.data ?? []),
        riwayat: (riwRes.data ?? []).map((r: any) => ({
          id: r.id, tanggal: r.tanggal, pekan: r.pekan, materi: r.materi,
          catatan: r.catatan, fokus: r.fokus ?? [],
        })),
        progres: (progRes.data ?? []).map((p: any) => ({
          id: p.id, pekan: p.pekan, urutan: p.urutan,
          pengucapan: p.pengucapan, kelancaran: p.kelancaran,
          tajwid: p.tajwid, tartil: p.tartil,
        })),
      });
      setLoading(false);
    };

    load();

    // Realtime: subscribe ke perubahan tabel terkait, refetch jika berubah.
    const ch = supabase
      .channel(`laporan-${slug}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "murid" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "skill_score" },
        (payload: any) => { if (!muridId || payload.new?.murid_id === muridId || payload.old?.murid_id === muridId) load(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "surat_hafalan" },
        (payload: any) => { if (!muridId || payload.new?.murid_id === muridId || payload.old?.murid_id === muridId) load(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "riwayat_pekanan" },
        (payload: any) => { if (!muridId || payload.new?.murid_id === muridId || payload.old?.murid_id === muridId) load(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "progres_pekanan" },
        (payload: any) => { if (!muridId || payload.new?.murid_id === muridId || payload.old?.murid_id === muridId) load(); })
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !murid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full">
          <CardHeader><CardTitle>Laporan tidak ditemukan</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Laporan untuk murid <span className="font-mono">"{slug}"</span> belum tersedia.
            </p>
            <Button asChild variant="outline"><Link to="/"><ArrowLeft className="h-4 w-4" />Kembali ke beranda</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mutqin = totalMutqin(murid);
  const sedang = totalSedangDihafal(murid);
  const skor = Math.round(
    (murid.skill.pengucapan + murid.skill.kelancaran + murid.skill.tajwid + murid.skill.tartil) / 4,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/40 via-background to-background pb-16">
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /><span className="hidden sm:inline">Beranda</span>
          </Link>
          <div className="flex items-center gap-2">
            <BookOpenCheck className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm sm:text-base">Laporan Murid</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <main className="container mx-auto px-4 pt-6 sm:pt-10 space-y-6 sm:space-y-8 max-w-6xl">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-6 sm:p-8 text-primary-foreground shadow-[var(--shadow-card)]">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7">
            <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm shrink-0">
              <User className="h-10 w-10 sm:h-12 sm:w-12" />
            </div>
            <div className="flex-1 min-w-0">
              <Badge className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0 mb-2">Level {murid.level}</Badge>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{murid.nama}</h1>
              <p className="text-primary-foreground/80 text-sm sm:text-base mt-1 flex items-center gap-2 flex-wrap">
                <GraduationCap className="h-4 w-4" />Pengajar: {murid.pengajar}
                {murid.mulaiBelajar && <><span className="hidden sm:inline opacity-50">•</span>
                <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" />Mulai {murid.mulaiBelajar}</span></>}
              </p>
            </div>
            <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 shrink-0">
              <div className="text-center sm:text-right">
                <div className="text-3xl sm:text-4xl font-bold">{skor}</div>
                <div className="text-xs text-primary-foreground/80">Skor rata-rata</div>
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 sm:mt-8">
            {[
              { icon: Sparkles, label: "Mutqin", value: mutqin, suffix: "surat" },
              { icon: TrendingUp, label: "Dihafal", value: sedang, suffix: "surat" },
              { icon: Clock, label: "Sisa Pertemuan", value: murid.totalPertemuan, suffix: "kali" },
              { icon: Target, label: "Jadwal", value: murid.jadwal || "-", suffix: "" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/10 backdrop-blur-sm p-3 sm:p-4 border border-white/10">
                <s.icon className="h-4 w-4 mb-1.5 opacity-80" />
                <div className="text-[11px] uppercase tracking-wide opacity-75">{s.label}</div>
                <div className="font-semibold text-sm sm:text-base mt-0.5 leading-tight">
                  {s.value}{s.suffix && <span className="font-normal text-xs opacity-80 ml-1">{s.suffix}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {murid.targetSaatIni && (
          <Card className="rounded-2xl border-primary/20 bg-primary/5">
            <CardContent className="flex items-start gap-3 p-4 sm:p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Target Saat Ini</p>
                <p className="font-semibold text-sm sm:text-base mt-0.5">{murid.targetSaatIni}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <section className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Peta Kemampuan</CardTitle>
              <p className="text-sm text-muted-foreground">4 skill utama dalam pembelajaran Al-Qur'an</p>
            </CardHeader>
            <CardContent><SkillRadar skill={murid.skill} /></CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Detail Skill</CardTitle>
              <p className="text-sm text-muted-foreground">Skor terakhir per kemampuan</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <SkillBar label="Pengucapan Huruf" value={murid.skill.pengucapan} color="hsl(125, 52%, 33%)" />
              <SkillBar label="Kelancaran Tilawah" value={murid.skill.kelancaran} color="hsl(200, 70%, 45%)" />
              <SkillBar label="Pemahaman Tajwid" value={murid.skill.tajwid} color="hsl(35, 85%, 50%)" />
              <SkillBar label="Pembacaan dengan Tartil" value={murid.skill.tartil} color="hsl(280, 55%, 50%)" />
            </CardContent>
          </Card>
        </section>

        <Tabs defaultValue="hafalan" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="hafalan">Hafalan</TabsTrigger>
            <TabsTrigger value="riwayat">Riwayat</TabsTrigger>
            <TabsTrigger value="grafik">Grafik</TabsTrigger>
          </TabsList>

          <TabsContent value="hafalan" className="mt-4 sm:mt-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Status Hafalan</CardTitle>
                <p className="text-sm text-muted-foreground">Klik tiap juz untuk melihat detail surat & kelancaran</p>
              </CardHeader>
              <CardContent><HafalanSection hafalan={murid.hafalan} /></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="riwayat" className="mt-4 sm:mt-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Riwayat Pembelajaran</CardTitle>
                <p className="text-sm text-muted-foreground">Catatan pembelajaran tiap pekan dari pengajar</p>
              </CardHeader>
              <CardContent>
                {murid.riwayat.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Belum ada catatan pekanan.</p>
                ) : (
                <div className="relative space-y-5 sm:pl-6 sm:before:absolute sm:before:left-2 sm:before:top-2 sm:before:bottom-2 sm:before:w-px sm:before:bg-border">
                  {murid.riwayat.map((r, i) => (
                    <div key={r.id ?? r.tanggal} className="relative rounded-2xl border bg-card p-4 sm:p-5 transition-shadow hover:shadow-sm">
                      <span className="hidden sm:block absolute -left-[26px] top-6 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">{r.pekan}</p>
                          <h4 className="font-semibold mt-0.5 text-sm sm:text-base">{r.materi}</h4>
                        </div>
                        {i === 0 && <Badge className="bg-primary/10 text-primary hover:bg-primary/15 border-0">Terbaru</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.catatan}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {r.fokus.map((f) => <Badge key={f} variant="secondary" className="text-[10px] font-medium">{f}</Badge>)}
                      </div>
                    </div>
                  ))}
                </div>)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grafik" className="mt-4 sm:mt-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Grafik Perkembangan</CardTitle>
                <p className="text-sm text-muted-foreground">Perkembangan skor 4 skill dari pekan ke pekan</p>
              </CardHeader>
              <CardContent>
                {murid.progres.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Belum ada titik progres.</p>
                ) : <ProgresChart data={murid.progres} />}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-center text-xs text-muted-foreground pt-4">
          Halaman laporan ini bersifat privat. Data diperbarui pengajar setiap pekan.
        </p>
      </main>
    </div>
  );
};

export default LaporanMurid;