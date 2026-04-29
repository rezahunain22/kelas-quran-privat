import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  BookOpenCheck, LogOut, Loader2, Plus, Trash2, Pencil, ExternalLink, Save, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { JUZ_30_SURAT, type Level } from "@/data/laporanData";

interface MuridRow {
  id: string;
  slug: string;
  nama: string;
  panggilan: string;
  level: Level;
  pengajar: string;
  mulai_belajar: string;
  jadwal: string;
  total_pertemuan: number;
  target_saat_ini: string;
}

interface SkillRow { murid_id: string; pengucapan: number; kelancaran: number; tajwid: number; tartil: number; }
interface HafalanRow { id: string; murid_id: string; juz: number; nomor_surat: number; nama_surat: string; jumlah_ayat: number; kelancaran: number; }
interface RiwayatRow { id: string; murid_id: string; tanggal: string; pekan: string; materi: string; catatan: string; fokus: string[]; }
interface ProgresRow { id: string; murid_id: string; pekan: string; urutan: number; pengucapan: number; kelancaran: number; tajwid: number; tartil: number; }

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [muridList, setMuridList] = useState<MuridRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isAdmin) return;
    fetchMurid();
    const ch = supabase
      .channel("admin-murid")
      .on("postgres_changes", { event: "*", schema: "public", table: "murid" }, fetchMurid)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, isAdmin]);

  async function fetchMurid() {
    const { data, error } = await supabase.from("murid").select("*").order("created_at", { ascending: false });
    if (error) { toast({ title: "Gagal memuat murid", description: error.message, variant: "destructive" }); return; }
    setMuridList((data ?? []) as MuridRow[]);
    if (data && data.length > 0 && !selectedId) setSelectedId(data[0].id);
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Akses Ditolak</CardTitle>
            <CardDescription>Akun Anda belum memiliki peran admin. Hubungi pemilik proyek untuk diberi akses lewat SQL Editor.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline" onClick={signOut}><LogOut className="h-4 w-4" />Keluar</Button>
            <Button asChild variant="ghost"><Link to="/">Ke Beranda</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedMurid = muridList.find((m) => m.id === selectedId) ?? null;

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b bg-background sticky top-0 z-30">
        <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <BookOpenCheck className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">Admin Laporan</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">{user.email}</span>
            <Button size="sm" variant="outline" onClick={signOut}><LogOut className="h-4 w-4" />Keluar</Button>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-[280px_1fr] gap-4">
        {/* Sidebar daftar murid */}
        <aside className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Murid</h2>
            <MuridFormDialog onSaved={fetchMurid} />
          </div>
          <div className="space-y-1.5">
            {muridList.length === 0 && (
              <p className="text-sm text-muted-foreground p-3 rounded-lg border border-dashed">Belum ada murid. Tambahkan murid pertama.</p>
            )}
            {muridList.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedId(m.id)}
                className={`w-full text-left rounded-xl px-3 py-2.5 border transition-colors ${selectedId === m.id ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-accent"}`}
              >
                <div className="font-medium text-sm">{m.panggilan}</div>
                <div className={`text-[11px] ${selectedId === m.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>/{m.slug} · {m.level}</div>
              </button>
            ))}
          </div>
        </aside>

        {/* Editor murid */}
        <section>
          {selectedMurid ? (
            <MuridEditor key={selectedMurid.id} murid={selectedMurid} onChanged={fetchMurid} onDeleted={() => { setSelectedId(null); fetchMurid(); }} />
          ) : (
            <Card><CardContent className="py-16 text-center text-muted-foreground">Pilih murid di samping atau tambahkan murid baru.</CardContent></Card>
          )}
        </section>
      </main>
    </div>
  );
};

// =================== MURID FORM ===================
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const MuridFormDialog = ({ murid, onSaved, trigger }: { murid?: MuridRow; onSaved: () => void; trigger?: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    slug: murid?.slug ?? "",
    nama: murid?.nama ?? "",
    panggilan: murid?.panggilan ?? "",
    level: (murid?.level ?? "Tahsin") as Level,
    pengajar: murid?.pengajar ?? "",
    mulai_belajar: murid?.mulai_belajar ?? "",
    jadwal: murid?.jadwal ?? "",
    total_pertemuan: murid?.total_pertemuan ?? 0,
    target_saat_ini: murid?.target_saat_ini ?? "",
  });

  const save = async () => {
    if (!form.nama.trim() || !form.panggilan.trim()) {
      toast({ title: "Nama & panggilan wajib diisi", variant: "destructive" }); return;
    }
    const slug = (form.slug || slugify(form.panggilan)).trim();
    if (!slug) { toast({ title: "Slug tidak valid", variant: "destructive" }); return; }
    setBusy(true);
    if (murid) {
      const { error } = await supabase.from("murid").update({ ...form, slug }).eq("id", murid.id);
      setBusy(false);
      if (error) { toast({ title: "Gagal simpan", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Murid diperbarui" });
    } else {
      const { data, error } = await supabase.from("murid").insert({ ...form, slug }).select().single();
      if (error) { setBusy(false); toast({ title: "Gagal tambah", description: error.message, variant: "destructive" }); return; }
      // auto-create skill row
      await supabase.from("skill_score").insert({ murid_id: data.id });
      setBusy(false);
      toast({ title: "Murid ditambahkan" });
    }
    setOpen(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button size="sm"><Plus className="h-4 w-4" />Tambah</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{murid ? "Edit Murid" : "Tambah Murid"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Nama Lengkap</Label><Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} /></div>
            <div><Label>Panggilan</Label><Input value={form.panggilan} onChange={(e) => setForm({ ...form, panggilan: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Slug URL</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="otomatis dari panggilan" /></div>
            <div>
              <Label>Level</Label>
              <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v as Level })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pra-Tahsin">Pra-Tahsin</SelectItem>
                  <SelectItem value="Tahsin">Tahsin</SelectItem>
                  <SelectItem value="Tahfizh">Tahfizh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div><Label>Pengajar</Label><Input value={form.pengajar} onChange={(e) => setForm({ ...form, pengajar: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Mulai Belajar</Label><Input value={form.mulai_belajar} onChange={(e) => setForm({ ...form, mulai_belajar: e.target.value })} placeholder="Januari 2025" /></div>
            <div><Label>Jadwal</Label><Input value={form.jadwal} onChange={(e) => setForm({ ...form, jadwal: e.target.value })} placeholder="Rabu, 18.00 - 19.00 WIB" /></div>
          </div>
          <div><Label>Total Pertemuan</Label><Input type="number" value={form.total_pertemuan} onChange={(e) => setForm({ ...form, total_pertemuan: parseInt(e.target.value) || 0 })} /></div>
          <div><Label>Target Saat Ini</Label><Textarea value={form.target_saat_ini} onChange={(e) => setForm({ ...form, target_saat_ini: e.target.value })} rows={2} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
          <Button onClick={save} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}<Save className="h-4 w-4" />Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// =================== MURID EDITOR ===================
const MuridEditor = ({ murid, onChanged, onDeleted }: { murid: MuridRow; onChanged: () => void; onDeleted: () => void }) => {
  const handleDelete = async () => {
    if (!confirm(`Hapus murid "${murid.panggilan}" beserta semua data laporannya?`)) return;
    const { error } = await supabase.from("murid").delete().eq("id", murid.id);
    if (error) { toast({ title: "Gagal hapus", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Murid dihapus" });
    onDeleted();
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="text-xl">{murid.nama}</CardTitle>
            <CardDescription>
              <Badge variant="secondary" className="mr-2">{murid.level}</Badge>
              <Link to={`/laporan/${murid.slug}`} target="_blank" className="text-primary inline-flex items-center gap-1 text-xs hover:underline">
                /laporan/{murid.slug} <ExternalLink className="h-3 w-3" />
              </Link>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <MuridFormDialog murid={murid} onSaved={onChanged} trigger={<Button size="sm" variant="outline"><Pencil className="h-4 w-4" />Edit</Button>} />
            <Button size="sm" variant="destructive" onClick={handleDelete}><Trash2 className="h-4 w-4" />Hapus</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="skill">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="skill">Skill</TabsTrigger>
            <TabsTrigger value="hafalan">Hafalan</TabsTrigger>
            <TabsTrigger value="riwayat">Riwayat</TabsTrigger>
            <TabsTrigger value="progres">Progres</TabsTrigger>
          </TabsList>
          <TabsContent value="skill" className="mt-4"><SkillEditor muridId={murid.id} /></TabsContent>
          <TabsContent value="hafalan" className="mt-4"><HafalanEditor muridId={murid.id} /></TabsContent>
          <TabsContent value="riwayat" className="mt-4"><RiwayatEditor muridId={murid.id} /></TabsContent>
          <TabsContent value="progres" className="mt-4"><ProgresEditor muridId={murid.id} /></TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// =================== SKILL ===================
const SkillEditor = ({ muridId }: { muridId: string }) => {
  const [skill, setSkill] = useState<SkillRow>({ murid_id: muridId, pengucapan: 0, kelancaran: 0, tajwid: 0, tartil: 0 });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("skill_score").select("*").eq("murid_id", muridId).maybeSingle().then(({ data }) => {
      if (data) setSkill(data as SkillRow);
    });
  }, [muridId]);

  const save = async () => {
    setBusy(true);
    const { error } = await supabase.from("skill_score").upsert({ ...skill, murid_id: muridId }, { onConflict: "murid_id" });
    setBusy(false);
    if (error) { toast({ title: "Gagal simpan", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Skill diperbarui" });
  };

  const fields: { key: keyof Omit<SkillRow, "murid_id">; label: string }[] = [
    { key: "pengucapan", label: "Pengucapan Huruf" },
    { key: "kelancaran", label: "Kelancaran Tilawah" },
    { key: "tajwid", label: "Pemahaman Tajwid" },
    { key: "tartil", label: "Pembacaan dengan Tartil" },
  ];

  return (
    <div className="space-y-4 max-w-xl">
      {fields.map((f) => (
        <div key={f.key}>
          <div className="flex justify-between mb-1.5"><Label>{f.label}</Label><span className="text-sm font-semibold tabular-nums">{skill[f.key]}</span></div>
          <Input type="range" min={0} max={100} value={skill[f.key]} onChange={(e) => setSkill({ ...skill, [f.key]: parseInt(e.target.value) })} />
        </div>
      ))}
      <Button onClick={save} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}<Save className="h-4 w-4" />Simpan Skill</Button>
    </div>
  );
};

// =================== HAFALAN ===================
const HafalanEditor = ({ muridId }: { muridId: string }) => {
  const [rows, setRows] = useState<HafalanRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("surat_hafalan").select("*").eq("murid_id", muridId).order("juz").order("nomor_surat");
    setRows((data ?? []) as HafalanRow[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [muridId]);

  const seedJuz30 = async () => {
    const existing = new Set(rows.filter((r) => r.juz === 30).map((r) => r.nomor_surat));
    const toInsert = JUZ_30_SURAT.filter((s) => !existing.has(s.nomor)).map((s) => ({
      murid_id: muridId, juz: 30, nomor_surat: s.nomor, nama_surat: s.nama, jumlah_ayat: s.ayat, kelancaran: 0,
    }));
    if (toInsert.length === 0) { toast({ title: "Juz 30 sudah lengkap" }); return; }
    const { error } = await supabase.from("surat_hafalan").insert(toInsert);
    if (error) { toast({ title: "Gagal seed", description: error.message, variant: "destructive" }); return; }
    toast({ title: `${toInsert.length} surat ditambahkan` });
    fetchData();
  };

  const updateRow = async (id: string, kelancaran: number) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, kelancaran } : r));
    await supabase.from("surat_hafalan").update({ kelancaran }).eq("id", id);
  };

  const removeRow = async (id: string) => {
    await supabase.from("surat_hafalan").delete().eq("id", id);
    fetchData();
  };

  if (loading) return <Loader2 className="h-5 w-5 animate-spin" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={seedJuz30}><Plus className="h-4 w-4" />Seed Juz 30 (37 surat)</Button>
        <SuratFormDialog muridId={muridId} onSaved={fetchData} />
      </div>
      {rows.length === 0 && <p className="text-sm text-muted-foreground">Belum ada hafalan. Klik "Seed Juz 30" untuk inisialisasi cepat.</p>}

      {Array.from(new Set(rows.map((r) => r.juz))).sort((a, b) => b - a).map((juz) => (
        <div key={juz} className="rounded-xl border">
          <div className="px-4 py-2 bg-muted/40 border-b font-semibold text-sm">Juz {juz}</div>
          <div className="divide-y">
            {rows.filter((r) => r.juz === juz).map((r) => (
              <div key={r.id} className="flex items-center gap-3 p-3 flex-wrap sm:flex-nowrap">
                <div className="w-8 text-xs text-muted-foreground tabular-nums">{r.nomor_surat}</div>
                <div className="flex-1 min-w-[120px]">
                  <div className="font-medium text-sm">{r.nama_surat}</div>
                  <div className="text-[11px] text-muted-foreground">{r.jumlah_ayat} ayat</div>
                </div>
                <Input type="range" min={0} max={100} value={r.kelancaran} onChange={(e) => updateRow(r.id, parseInt(e.target.value))} className="flex-1 min-w-[120px]" />
                <span className="w-10 text-right text-sm tabular-nums font-semibold">{r.kelancaran}%</span>
                <Button size="icon" variant="ghost" onClick={() => removeRow(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const SuratFormDialog = ({ muridId, onSaved }: { muridId: string; onSaved: () => void }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ juz: 30, nomor_surat: 1, nama_surat: "", jumlah_ayat: 0, kelancaran: 0 });
  const save = async () => {
    if (!form.nama_surat.trim()) { toast({ title: "Nama surat wajib", variant: "destructive" }); return; }
    const { error } = await supabase.from("surat_hafalan").insert({ ...form, murid_id: muridId });
    if (error) { toast({ title: "Gagal", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Surat ditambahkan" }); setOpen(false); onSaved();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm" variant="outline"><Plus className="h-4 w-4" />Tambah Surat</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Tambah Surat</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Juz</Label><Input type="number" min={1} max={30} value={form.juz} onChange={(e) => setForm({ ...form, juz: parseInt(e.target.value) || 1 })} /></div>
            <div><Label>Nomor Surat</Label><Input type="number" min={1} max={114} value={form.nomor_surat} onChange={(e) => setForm({ ...form, nomor_surat: parseInt(e.target.value) || 1 })} /></div>
          </div>
          <div><Label>Nama Surat</Label><Input value={form.nama_surat} onChange={(e) => setForm({ ...form, nama_surat: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Jumlah Ayat</Label><Input type="number" value={form.jumlah_ayat} onChange={(e) => setForm({ ...form, jumlah_ayat: parseInt(e.target.value) || 0 })} /></div>
            <div><Label>Kelancaran (0-100)</Label><Input type="number" min={0} max={100} value={form.kelancaran} onChange={(e) => setForm({ ...form, kelancaran: parseInt(e.target.value) || 0 })} /></div>
          </div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Batal</Button><Button onClick={save}>Simpan</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// =================== RIWAYAT ===================
const RiwayatEditor = ({ muridId }: { muridId: string }) => {
  const [rows, setRows] = useState<RiwayatRow[]>([]);
  const fetchData = async () => {
    const { data } = await supabase.from("riwayat_pekanan").select("*").eq("murid_id", muridId).order("tanggal", { ascending: false });
    setRows((data ?? []) as RiwayatRow[]);
  };
  useEffect(() => { fetchData(); }, [muridId]);
  const remove = async (id: string) => { await supabase.from("riwayat_pekanan").delete().eq("id", id); fetchData(); };

  return (
    <div className="space-y-3">
      <RiwayatFormDialog muridId={muridId} onSaved={fetchData} />
      {rows.length === 0 && <p className="text-sm text-muted-foreground">Belum ada catatan pekanan.</p>}
      {rows.map((r) => (
        <Card key={r.id} className="rounded-xl">
          <CardContent className="p-4">
            <div className="flex justify-between items-start gap-3 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="text-xs text-muted-foreground">{r.pekan} · {r.tanggal}</div>
                <div className="font-semibold mt-0.5">{r.materi}</div>
                <p className="text-sm text-muted-foreground mt-1">{r.catatan}</p>
                <div className="flex flex-wrap gap-1 mt-2">{r.fokus.map((f) => <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>)}</div>
              </div>
              <div className="flex gap-1">
                <RiwayatFormDialog muridId={muridId} riwayat={r} onSaved={fetchData} trigger={<Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>} />
                <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const RiwayatFormDialog = ({ muridId, riwayat, onSaved, trigger }: { muridId: string; riwayat?: RiwayatRow; onSaved: () => void; trigger?: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    tanggal: riwayat?.tanggal ?? new Date().toISOString().slice(0, 10),
    pekan: riwayat?.pekan ?? "",
    materi: riwayat?.materi ?? "",
    catatan: riwayat?.catatan ?? "",
    fokus: riwayat?.fokus.join(", ") ?? "",
  });
  const save = async () => {
    if (!form.materi.trim() || !form.pekan.trim()) { toast({ title: "Pekan & materi wajib", variant: "destructive" }); return; }
    const payload = { ...form, fokus: form.fokus.split(",").map((s) => s.trim()).filter(Boolean), murid_id: muridId };
    const { error } = riwayat
      ? await supabase.from("riwayat_pekanan").update(payload).eq("id", riwayat.id)
      : await supabase.from("riwayat_pekanan").insert(payload);
    if (error) { toast({ title: "Gagal", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Tersimpan" }); setOpen(false); onSaved();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button size="sm"><Plus className="h-4 w-4" />Tambah Riwayat</Button>}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{riwayat ? "Edit" : "Tambah"} Riwayat Pekanan</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Tanggal</Label><Input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} /></div>
            <div><Label>Pekan</Label><Input value={form.pekan} onChange={(e) => setForm({ ...form, pekan: e.target.value })} placeholder="Pekan 4 - April 2026" /></div>
          </div>
          <div><Label>Materi</Label><Input value={form.materi} onChange={(e) => setForm({ ...form, materi: e.target.value })} /></div>
          <div><Label>Catatan</Label><Textarea rows={3} value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} /></div>
          <div><Label>Fokus (pisah dengan koma)</Label><Input value={form.fokus} onChange={(e) => setForm({ ...form, fokus: e.target.value })} placeholder="Mad Thabi'i, Ghunnah" /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Batal</Button><Button onClick={save}>Simpan</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// =================== PROGRES ===================
const ProgresEditor = ({ muridId }: { muridId: string }) => {
  const [rows, setRows] = useState<ProgresRow[]>([]);
  const fetchData = async () => {
    const { data } = await supabase.from("progres_pekanan").select("*").eq("murid_id", muridId).order("urutan");
    setRows((data ?? []) as ProgresRow[]);
  };
  useEffect(() => { fetchData(); }, [muridId]);
  const remove = async (id: string) => { await supabase.from("progres_pekanan").delete().eq("id", id); fetchData(); };

  return (
    <div className="space-y-3">
      <ProgresFormDialog muridId={muridId} nextUrutan={rows.length + 1} onSaved={fetchData} />
      {rows.length === 0 && <p className="text-sm text-muted-foreground">Belum ada titik progres.</p>}
      <div className="rounded-xl border divide-y">
        {rows.map((r) => (
          <div key={r.id} className="p-3 flex items-center gap-3 flex-wrap">
            <div className="font-semibold text-sm w-16">{r.pekan}</div>
            <div className="flex gap-3 text-xs flex-1 flex-wrap">
              <span>Pengucapan: <b>{r.pengucapan}</b></span>
              <span>Kelancaran: <b>{r.kelancaran}</b></span>
              <span>Tajwid: <b>{r.tajwid}</b></span>
              <span>Tartil: <b>{r.tartil}</b></span>
            </div>
            <div className="flex gap-1">
              <ProgresFormDialog muridId={muridId} progres={r} nextUrutan={r.urutan} onSaved={fetchData} trigger={<Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>} />
              <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProgresFormDialog = ({ muridId, progres, nextUrutan, onSaved, trigger }: { muridId: string; progres?: ProgresRow; nextUrutan: number; onSaved: () => void; trigger?: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    pekan: progres?.pekan ?? `P${nextUrutan}`,
    urutan: progres?.urutan ?? nextUrutan,
    pengucapan: progres?.pengucapan ?? 0,
    kelancaran: progres?.kelancaran ?? 0,
    tajwid: progres?.tajwid ?? 0,
    tartil: progres?.tartil ?? 0,
  });
  const save = async () => {
    if (!form.pekan.trim()) { toast({ title: "Label pekan wajib", variant: "destructive" }); return; }
    const payload = { ...form, murid_id: muridId };
    const { error } = progres
      ? await supabase.from("progres_pekanan").update(payload).eq("id", progres.id)
      : await supabase.from("progres_pekanan").insert(payload);
    if (error) { toast({ title: "Gagal", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Tersimpan" }); setOpen(false); onSaved();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button size="sm"><Plus className="h-4 w-4" />Tambah Titik Progres</Button>}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{progres ? "Edit" : "Tambah"} Titik Progres</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Label Pekan</Label><Input value={form.pekan} onChange={(e) => setForm({ ...form, pekan: e.target.value })} placeholder="P1, P2, ..." /></div>
            <div><Label>Urutan</Label><Input type="number" value={form.urutan} onChange={(e) => setForm({ ...form, urutan: parseInt(e.target.value) || 0 })} /></div>
          </div>
          {(["pengucapan", "kelancaran", "tajwid", "tartil"] as const).map((k) => (
            <div key={k}>
              <div className="flex justify-between mb-1"><Label className="capitalize">{k}</Label><span className="text-sm tabular-nums font-semibold">{form[k]}</span></div>
              <Input type="range" min={0} max={100} value={form[k]} onChange={(e) => setForm({ ...form, [k]: parseInt(e.target.value) })} />
            </div>
          ))}
        </div>
        <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Batal</Button><Button onClick={save}>Simpan</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Admin;