-- RLS policies to allow anonymous frontend operations
-- Public read already exists; add insert/update/delete as needed

-- Sorteos: allow insert and update by anon
CREATE POLICY anon_insert_sorteos ON public.sorteos
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY anon_update_sorteos ON public.sorteos
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

-- Participantes: allow insert, delete, and update by anon
CREATE POLICY anon_insert_participantes ON public.participantes
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY anon_delete_participantes ON public.participantes
  FOR DELETE TO anon
  USING (true);

CREATE POLICY anon_update_participantes ON public.participantes
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

-- Asignaciones: allow insert and update by anon
CREATE POLICY anon_insert_asignaciones ON public.asignaciones
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY anon_update_asignaciones ON public.asignaciones
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

-- Optional: ensure RLS is enabled (should already be true)
ALTER TABLE public.sorteos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asignaciones ENABLE ROW LEVEL SECURITY;
