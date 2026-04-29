-- ============ ENUM ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.murid_level AS ENUM ('Pra-Tahsin', 'Tahsin', 'Tahfizh');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- ============ TIMESTAMP TRIGGER ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ AUTO PROFILE ON SIGNUP ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ MURID ============
CREATE TABLE public.murid (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  nama TEXT NOT NULL,
  panggilan TEXT NOT NULL,
  level public.murid_level NOT NULL DEFAULT 'Tahsin',
  pengajar TEXT NOT NULL DEFAULT '',
  mulai_belajar TEXT NOT NULL DEFAULT '',
  jadwal TEXT NOT NULL DEFAULT '',
  total_pertemuan INTEGER NOT NULL DEFAULT 0,
  target_saat_ini TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.murid ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view murid" ON public.murid FOR SELECT USING (true);
CREATE POLICY "Admins can insert murid" ON public.murid FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update murid" ON public.murid FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete murid" ON public.murid FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_murid_updated_at
  BEFORE UPDATE ON public.murid
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SKILL SCORE (1-1 dengan murid, terkini) ============
CREATE TABLE public.skill_score (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  murid_id UUID NOT NULL UNIQUE REFERENCES public.murid(id) ON DELETE CASCADE,
  pengucapan INTEGER NOT NULL DEFAULT 0 CHECK (pengucapan BETWEEN 0 AND 100),
  kelancaran INTEGER NOT NULL DEFAULT 0 CHECK (kelancaran BETWEEN 0 AND 100),
  tajwid INTEGER NOT NULL DEFAULT 0 CHECK (tajwid BETWEEN 0 AND 100),
  tartil INTEGER NOT NULL DEFAULT 0 CHECK (tartil BETWEEN 0 AND 100),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.skill_score ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view skill" ON public.skill_score FOR SELECT USING (true);
CREATE POLICY "Admins can insert skill" ON public.skill_score FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update skill" ON public.skill_score FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete skill" ON public.skill_score FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_skill_updated_at
  BEFORE UPDATE ON public.skill_score
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SURAT HAFALAN ============
CREATE TABLE public.surat_hafalan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  murid_id UUID NOT NULL REFERENCES public.murid(id) ON DELETE CASCADE,
  juz INTEGER NOT NULL CHECK (juz BETWEEN 1 AND 30),
  nomor_surat INTEGER NOT NULL CHECK (nomor_surat BETWEEN 1 AND 114),
  nama_surat TEXT NOT NULL,
  jumlah_ayat INTEGER NOT NULL DEFAULT 0,
  kelancaran INTEGER NOT NULL DEFAULT 0 CHECK (kelancaran BETWEEN 0 AND 100),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (murid_id, nomor_surat)
);
ALTER TABLE public.surat_hafalan ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_surat_hafalan_murid ON public.surat_hafalan(murid_id, juz);

CREATE POLICY "Public can view hafalan" ON public.surat_hafalan FOR SELECT USING (true);
CREATE POLICY "Admins can insert hafalan" ON public.surat_hafalan FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update hafalan" ON public.surat_hafalan FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete hafalan" ON public.surat_hafalan FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_hafalan_updated_at
  BEFORE UPDATE ON public.surat_hafalan
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ RIWAYAT PEKANAN ============
CREATE TABLE public.riwayat_pekanan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  murid_id UUID NOT NULL REFERENCES public.murid(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL,
  pekan TEXT NOT NULL,
  materi TEXT NOT NULL,
  catatan TEXT NOT NULL DEFAULT '',
  fokus TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.riwayat_pekanan ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_riwayat_murid_tgl ON public.riwayat_pekanan(murid_id, tanggal DESC);

CREATE POLICY "Public can view riwayat" ON public.riwayat_pekanan FOR SELECT USING (true);
CREATE POLICY "Admins can insert riwayat" ON public.riwayat_pekanan FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update riwayat" ON public.riwayat_pekanan FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete riwayat" ON public.riwayat_pekanan FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ PROGRES PEKANAN ============
CREATE TABLE public.progres_pekanan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  murid_id UUID NOT NULL REFERENCES public.murid(id) ON DELETE CASCADE,
  pekan TEXT NOT NULL,
  urutan INTEGER NOT NULL DEFAULT 0,
  pengucapan INTEGER NOT NULL DEFAULT 0 CHECK (pengucapan BETWEEN 0 AND 100),
  kelancaran INTEGER NOT NULL DEFAULT 0 CHECK (kelancaran BETWEEN 0 AND 100),
  tajwid INTEGER NOT NULL DEFAULT 0 CHECK (tajwid BETWEEN 0 AND 100),
  tartil INTEGER NOT NULL DEFAULT 0 CHECK (tartil BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.progres_pekanan ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_progres_murid_urut ON public.progres_pekanan(murid_id, urutan);

CREATE POLICY "Public can view progres" ON public.progres_pekanan FOR SELECT USING (true);
CREATE POLICY "Admins can insert progres" ON public.progres_pekanan FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update progres" ON public.progres_pekanan FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete progres" ON public.progres_pekanan FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ REALTIME ============
ALTER PUBLICATION supabase_realtime ADD TABLE public.murid;
ALTER PUBLICATION supabase_realtime ADD TABLE public.skill_score;
ALTER PUBLICATION supabase_realtime ADD TABLE public.surat_hafalan;
ALTER PUBLICATION supabase_realtime ADD TABLE public.riwayat_pekanan;
ALTER PUBLICATION supabase_realtime ADD TABLE public.progres_pekanan;

ALTER TABLE public.murid REPLICA IDENTITY FULL;
ALTER TABLE public.skill_score REPLICA IDENTITY FULL;
ALTER TABLE public.surat_hafalan REPLICA IDENTITY FULL;
ALTER TABLE public.riwayat_pekanan REPLICA IDENTITY FULL;
ALTER TABLE public.progres_pekanan REPLICA IDENTITY FULL;