-- SST: roles en tabla propia, vista inicial por rol y seguridad por filas (RLS).
-- ATENCIÓN: borra las tablas actuales (roles, usuarios y soportes) y sus datos.
DROP TABLE IF EXISTS soportes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre TEXT UNIQUE NOT NULL,
    descripcion TEXT,
    vista_inicial TEXT NOT NULL  -- pantalla a la que entra ese rol: usuarios | dashboard | mis
);

INSERT INTO roles (nombre, descripcion, vista_inicial) VALUES
    ('Administrador', 'Gestiona usuarios y roles; ve todos los soportes', 'usuarios'),
    ('Coordinador',   'Jefe TIC: registra, asigna y supervisa soportes',   'dashboard'),
    ('Tecnico',       'Atiende los soportes que le asignan',               'mis'),
    ('Aprendiz',      'Reporta fallos y consulta sus solicitudes',         'mis');

CREATE TABLE usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    documento TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    rol_id INT NOT NULL REFERENCES roles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE soportes (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    prioridad TEXT NOT NULL CHECK (prioridad IN ('Baja', 'Media', 'Alta', 'Urgente')),
    estado TEXT NOT NULL DEFAULT 'Pendiente'
        CHECK (estado IN ('Pendiente', 'En Proceso', 'Resuelto')),
    tecnico_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    creado_por UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Nombre del rol del usuario autenticado (SECURITY DEFINER evita recursión en RLS)
CREATE FUNCTION public.mi_rol() RETURNS TEXT
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS
$$ SELECT r.nombre FROM usuarios u JOIN roles r ON r.id = u.rol_id WHERE u.id = auth.uid() $$;

-- Perfil automático al registrarse: la primera persona queda como Administrador
-- y todas las demás como Aprendiz. El rol enviado desde el cliente se ignora.
CREATE FUNCTION public.crear_perfil() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS
$$
DECLARE v_rol INT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM usuarios) THEN
        SELECT id INTO v_rol FROM roles WHERE nombre = 'Administrador';
    ELSE
        SELECT id INTO v_rol FROM roles WHERE nombre = 'Aprendiz';
    END IF;
    INSERT INTO usuarios (id, documento, nombre, email, rol_id)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'documento',
            NEW.raw_user_meta_data->>'nombre', NEW.email, v_rol);
    RETURN NEW;
END
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.crear_perfil();

-- Nadie puede cambiarse su propio rol (evita que el administrador se quede sin acceso)
CREATE FUNCTION public.proteger_usuario() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS
$$
BEGIN
    IF NEW.rol_id IS DISTINCT FROM OLD.rol_id AND NEW.id = auth.uid() THEN
        RAISE EXCEPTION 'No puedes cambiar tu propio rol';
    END IF;
    RETURN NEW;
END
$$;

CREATE TRIGGER usuarios_proteger
BEFORE UPDATE ON usuarios
FOR EACH ROW EXECUTE FUNCTION public.proteger_usuario();

-- Quien no es jefe solo puede cambiar el estado de un soporte
CREATE FUNCTION public.proteger_soporte() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS
$$
BEGIN
    IF mi_rol() NOT IN ('Administrador', 'Coordinador')
       AND (NEW.titulo, NEW.descripcion, NEW.prioridad, NEW.tecnico_id, NEW.creado_por)
           IS DISTINCT FROM
           (OLD.titulo, OLD.descripcion, OLD.prioridad, OLD.tecnico_id, OLD.creado_por) THEN
        RAISE EXCEPTION 'Solo puedes cambiar el estado del soporte';
    END IF;
    RETURN NEW;
END
$$;

CREATE TRIGGER soportes_proteger
BEFORE UPDATE ON soportes
FOR EACH ROW EXECUTE FUNCTION public.proteger_soporte();

-- Seguridad por filas (RLS)
ALTER TABLE roles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE soportes ENABLE ROW LEVEL SECURITY;

CREATE POLICY roles_ver ON roles FOR SELECT TO authenticated USING (true);

CREATE POLICY usuarios_ver ON usuarios FOR SELECT TO authenticated USING (
    id = auth.uid()
    OR mi_rol() IN ('Administrador', 'Coordinador')
    OR rol_id <> (SELECT id FROM roles WHERE nombre = 'Aprendiz')
    OR EXISTS (SELECT 1 FROM soportes s
               WHERE s.creado_por = usuarios.id AND s.tecnico_id = auth.uid())
);
CREATE POLICY usuarios_admin_actualiza ON usuarios FOR UPDATE TO authenticated
    USING (mi_rol() = 'Administrador') WITH CHECK (mi_rol() = 'Administrador');

CREATE POLICY soportes_ver ON soportes FOR SELECT TO authenticated USING (
    mi_rol() IN ('Administrador', 'Coordinador')
    OR tecnico_id = auth.uid()
    OR creado_por = auth.uid()
);
CREATE POLICY soportes_crear ON soportes FOR INSERT TO authenticated WITH CHECK (
    creado_por = auth.uid()
    AND (mi_rol() IN ('Administrador', 'Coordinador')
         OR (mi_rol() = 'Aprendiz' AND tecnico_id IS NULL
             AND prioridad = 'Media' AND estado = 'Pendiente'))
);
CREATE POLICY soportes_actualizar ON soportes FOR UPDATE TO authenticated
    USING (mi_rol() IN ('Administrador', 'Coordinador') OR tecnico_id = auth.uid())
    WITH CHECK (mi_rol() IN ('Administrador', 'Coordinador') OR tecnico_id = auth.uid());
CREATE POLICY soportes_borrar ON soportes FOR DELETE TO authenticated
    USING (mi_rol() = 'Administrador');
