// lib/operaciones.ts — Conector del Centro de Operaciones (Grupo DASHI S.A.S.)
// Sigue el mismo patrón que lib/gas.ts: POST al backend GAS con recurso + _method.

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

type Resp<T> = { ok: boolean; data?: T; error?: string };

// ─── Núcleo de peticiones ───
async function pedir<T = unknown>(
  recurso: string,
  metodo: "GET" | "POST" | "PUT" | "DELETE",
  payload: Record<string, unknown> = {},
  opciones?: { tags?: string[]; revalidate?: number }
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
        ...payload,
      }),
      ...(metodo === "GET"
        ? { next: { tags: opciones?.tags ?? [recurso], revalidate: opciones?.revalidate ?? 120 } }
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
export const fetchSedes = () =>
  pedir<Sede[]>("sedes", "GET", {}, { tags: ["sedes"] });

export const crearSede = (sede: SedeInput) =>
  pedir<Sede>("sedes", "POST", sede as unknown as Record<string, unknown>);

export const actualizarSede = (id: string, sede: Partial<SedeInput>) =>
  pedir<Sede>("sedes", "PUT", { id, ...sede });

export const eliminarSede = (id: string) =>
  pedir("sedes", "DELETE", { id });

// ─── Actividades ───
export const fetchActividades = () =>
  pedir<Actividad[]>("actividades", "GET", {}, { tags: ["actividades"] });

export const crearActividad = (act: ActividadInput) =>
  pedir<Actividad>("actividades", "POST", act as unknown as Record<string, unknown>);

export const actualizarActividad = (id: string, act: Partial<ActividadInput>) =>
  pedir<Actividad>("actividades", "PUT", { id, ...act });

export const eliminarActividad = (id: string) =>
  pedir("actividades", "DELETE", { id });
