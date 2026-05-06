
CREATE TABLE public.makhraj_huruf (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  murid_id uuid NOT NULL REFERENCES public.murid(id) ON DELETE CASCADE,
  urutan integer NOT NULL,
  huruf text NOT NULL,
  nama_huruf text NOT NULL,
  kelancaran integer NOT NULL DEFAULT 0,
  catatan_perbaikan text NOT NULL DEFAULT '',
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (murid_id, urutan)
);

ALTER TABLE public.makhraj_huruf ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view makhraj" ON public.makhraj_huruf FOR SELECT USING (true);
CREATE POLICY "Admins can insert makhraj" ON public.makhraj_huruf FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update makhraj" ON public.makhraj_huruf FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete makhraj" ON public.makhraj_huruf FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_makhraj_updated_at
BEFORE UPDATE ON public.makhraj_huruf
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.makhraj_huruf REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.makhraj_huruf;
