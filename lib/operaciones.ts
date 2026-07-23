// lib/operaciones.ts — Conector del Centro de Operaciones (Grupo DASHI S.A.S.)
// Sigue el mismo patrón que lib/gas.ts: POST al backend GAS con recurso + _method.
// El backend (Código.gs) lee la petición como { recurso, _method, apiKey, token,
// payload, filtros, usuario }, por eso aquí anidamos los datos en esas claves.

const TOKEN = "nexus-server-interno";

// ─── Tipos ───
export type Sede = {
  id: string;
  nombre: string;
  codigo?: string;
  direccion?: string;
  responsable?: string;
  telefono?: string;
  activa?: boolean;
};

export type SedeInput = {
  nombre: string;
  codigo?: string;
  direccion?: string;
  responsable?: string;
  telefono?: string;
  activa?: boolean;
};

export type Actividad = {
  id: string;
  nombre: string;
  descripcion?: string;
  tipo: string;
  area?: string;
  sedes?: string[];
  responsable?: string;
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  prioridad?: string;
  estado?: string;
  observaciones?: string;
  repeticion?: string;
  recordatorio?: string;
};

export type ActividadInput = Omit<Actividad, "id"> & { id?: string };

export type Usuario = { nombre?: string; rol?: string };

type Resp<T> = { ok: boolean; data?: T; error?: string };

// ─── Núcleo de peticiones ───
async function pedir<T = unknown>(
  recurso: string,
  metodo: "GET" | "POST" | "PUT" | "DELETE",
  opts: {
    payload?: Record<string, unknown>;
    filtros?: Record<string, unknown>;
    usuario?: Usuario;
    tags?: string[];
    revalidate?: number;
  } = {}
): Promise<Resp<T>> {
  const execUrl = process.env.GAS_EXEC_URL;
  const apiKey = process.env.GAS_API_KEY;
  if (!execUrl || !apiKey) return { ok: false, error: "Backend no configurado" };

  try {
    const res = await fetch(execUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        recurso,
        _method: metodo,
        apiKey,
        token: TOKEN,
        payload: opts.payload ?? {},
        filtros: opts.filtros ?? {},
        usuario: opts.usuario ?? {},
      }),
      ...(metodo === "GET"
        ? { next: { tags: opts.tags ?? [recurso], revalidate: opts.revalidate ?? 120 } }
        : { cache: "no-store" as const }),
    });

    const json = await res.json();
    if (!json.ok) {
      const msg = typeof json.error === "object" ? json.error?.mensaje : json.error;
      return { ok: false, error: msg || "Error desconocido" };
    }
    return { ok: true, data: json.data as T };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ─── Sedes ───
export const fetchSedes = (filtros?: Record<string, unknown>) =>
  pedir<Sede[]>("sedes", "GET", { filtros, tags: ["sedes"] });

export const crearSede = (sede: SedeInput, usuario?: Usuario) =>
  pedir<{ id: string }>("sedes", "POST", { payload: sede as unknown as Record<string, unknown>, usuario });

export const actualizarSede = (id: string, sede: Partial<SedeInput>, usuario?: Usuario) =>
  pedir<{ id: string }>("sedes", "PUT", { payload: { id, ...sede }, usuario });

export const eliminarSede = (id: string, usuario?: Usuario) =>
  pedir("sedes", "DELETE", { payload: { id }, usuario });

// ─── Actividades ───
export const fetchActividades = (filtros?: Record<string, unknown>) =>
  pedir<Actividad[]>("actividades", "GET", { filtros, tags: ["actividades"] });

export const crearActividad = (act: ActividadInput, usuario?: Usuario) =>
  pedir<{ id: string }>("actividades", "POST", { payload: act as unknown as Record<string, unknown>, usuario });

export const actualizarActividad = (id: string, act: Partial<ActividadInput>, usuario?: Usuario) =>
  pedir<{ id: string }>("actividades", "PUT", { payload: { id, ...act }, usuario });

export const eliminarActividad = (id: string, usuario?: Usuario) =>
  pedir("actividades", "DELETE", { payload: { id }, usuario });
