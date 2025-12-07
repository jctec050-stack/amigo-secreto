-- Tabla Sorteos
CREATE TABLE sorteos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completado')),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_sorteo TIMESTAMP WITH TIME ZONE
);

-- Crear índices para sorteos
CREATE INDEX idx_sorteos_estado ON sorteos(estado);
CREATE INDEX idx_sorteos_fecha_creacion ON sorteos(fecha_creacion DESC);

-- Tabla Participantes
CREATE TABLE participantes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sorteo_id UUID REFERENCES sorteos(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    token_acceso UUID DEFAULT gen_random_uuid(),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para participantes
CREATE INDEX idx_participantes_sorteo_id ON participantes(sorteo_id);
CREATE INDEX idx_participantes_token ON participantes(token_acceso);

-- Tabla Asignaciones
CREATE TABLE asignaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participante_id UUID REFERENCES participantes(id) ON DELETE CASCADE,
    amigo_asignado_id UUID REFERENCES participantes(id) ON DELETE CASCADE,
    notificado BOOLEAN DEFAULT false,
    fecha_asignacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para asignaciones
CREATE INDEX idx_asignaciones_participante ON asignaciones(participante_id);
CREATE INDEX idx_asignaciones_amigo ON asignaciones(amigo_asignado_id);

-- Restricción única para evitar duplicados en asignaciones
CREATE UNIQUE INDEX idx_asignaciones_unicas ON asignaciones(participante_id);

-- Políticas de seguridad RLS
-- Permitir lectura pública de sorteos
CREATE POLICY "Sorteos públicos" ON sorteos
    FOR SELECT USING (true);

-- Permitir lectura pública de participantes con token
CREATE POLICY "Participantes con token" ON participantes
    FOR SELECT USING (true);

-- Permitir lectura pública de asignaciones
CREATE POLICY "Asignaciones públicas" ON asignaciones
    FOR SELECT USING (true);

-- Habilitar RLS en todas las tablas
ALTER TABLE sorteos ENABLE ROW LEVEL SECURITY;
ALTER TABLE participantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE asignaciones ENABLE ROW LEVEL SECURITY;

-- Otorgar permisos a los roles
GRANT SELECT ON sorteos TO anon;
GRANT ALL PRIVILEGES ON sorteos TO authenticated;

GRANT SELECT ON participantes TO anon;
GRANT ALL PRIVILEGES ON participantes TO authenticated;

GRANT SELECT ON asignaciones TO anon;
GRANT ALL PRIVILEGES ON asignaciones TO authenticated;