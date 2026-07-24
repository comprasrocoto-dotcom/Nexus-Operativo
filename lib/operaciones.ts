// lib/operaciones.ts — Conector del Centro de Operaciones (Grupo DASHI S.A.S.)
// Núcleo entidad-céntrico del ERP. Todas las tablas siguen la estructura ERP
// estándar y todo se relaciona con la Sede mediante SedeID.
// Patrón: POST al backend GAS con { recurso, _method, apiKey, token, payload, filtros, usuario }.
// Diseñado para crecer: agregar un módulo nuevo = registrar su recurso, sin tocar el núcleo.

const TOKEN = "nexus-server-interno";

// ─── Campos base estándar (comunes a todos los módulos ERP) ───
export type BaseEntidad = {
  ID: string;
  Codigo?: string;
  Nombre: string;
  Descripcion?: string;
  Estado?: string;
  Responsable?: string;
  FechaCreacion?: string;
  FechaModificacion?: string;
  UsuarioCreador?: string;
  UltimoEditor?: string;
  Activo?: boolean;
};

// ─── Sede (ficha completa: entidad principal del ERP) ───
export type Sede = BaseEntidad & {
  Direccion?: string;
  Telefono?: string;
  Administrador?: string;
  totalActividades?: number;
};

export type SedeInput = {
  nombre: string;
  codigo?: string;
  descripcion?: string;
  estado?: string;
  responsable?: string;
  activo?: boolean;
  direccion?: string;
  telefono?: string;
  administrador?: string;
};

// ─── Actividad (reutilizada por Agenda y por el Timeline) ───
export type Actividad = BaseEntidad & {
  Tipo?: string;
  Area?: string;
  Sedes?: string;
  SedeID?: string;
  Fecha?: string;
  HoraInicio?: string;
  HoraFin?: string;
  Prioridad?: string;
  Observaciones?: string;
  Repeticion?: string;
  Recordatorio?: string;
  RutaDrive?: string;
};

export type ActividadInput = {
  nombre: string;
  codigo?: string;
  descripcion?: string;
  estado?: string;
  responsable?: string;
  activo?: boolean;
  tipo?: string;
  area?: string;
  sedes?: string[] | string;
  sedeId?: string;
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  prioridad?: string;
  observaciones?: string;
  repeticion?: string;
  recordatorio?: string;
};

// ─── Evento (Op_Eventos): base para Timeline, bitácora, notificaciones y trazabilidad ───
export type NivelEvento = "info" | "exito" | "advertencia" | "error" | "critico";

export type Evento = {
  ID: string;
  Fecha?: string;
  Hora?: string;
  Usuario?: string;
  Modulo?: string;
  Entidad?: string;
  EntidadID?: string;
  SedeID?: string;
  TipoEvento?: string;
  Descripcion?: string;
  DatosAnteriores?: string;
  DatosNuevos?: string;
  Nivel?: NivelEvento;
  Icono?: string;
  Color?: string;
};

export type EventoInput = {
  usuario?: string;
  modulo: string;
  entidad?: string;
  entidadId?: string;
  sedeId?: string;
  tipoEvento: string;
  descripcion?: string;
  datosAnteriores?: unknown;
  datosNuevos?: unknown;
  nivel?: NivelEvento;
  icono?: string;
  color?: string;
};

// ─── Módulo (Op_Modulos): registro data-driven de módulos del ERP ───
export type Modulo = {
  ID: string;
  Clave: string;
  Nombre: string;
  Icono?: string;
  Color?: string;
  Estado?: string;
  Orden?: number;
  Roles?: string;
  Activo?: boolean;
};

export type Usuario = { nombre?: string; rol?: string };

type Resp<T> = { ok: boolean; data?: T; error?: string };

// ─── Núcleo de peticiones (única fuente; NO duplicar en módulos) ───
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

// Expuesto para servicios/hooks que necesiten un recurso genérico (CRUD reutilizable).
export const pedirRecurso = pedir;

// ─── Sedes ───
export const fetchSedes = (filtros?: Record<string, unknown>) =>
  pedir<Sede[]>("sedes", "GET", { filtros, tags: ["sedes"] });

// Ficha de una sede (con fallback en cliente: filtra por ID si el backend no soporta el filtro).
export const fetchSede = async (id: string): Promise<Resp<Sede>> => {
  const r = await pedir<Sede[]>("sedes", "GET", { filtros: { id, incluirInactivas: true }, tags: ["sedes", "sede-" + id] });
  if (!r.ok) return { ok: false, error: r.error };
  const lista = Array.isArray(r.data) ? r.data : [];
  const sede = lista.find((s) => s.ID === id) ?? lista[0];
  return sede ? { ok: true, data: sede } : { ok: false, error: "Sede no encontrada" };
};

export const crearSede = (sede: SedeInput, usuario?: Usuario) =>
  pedir<{ id: string }>("sedes", "POST", { payload: sede as unknown as Record<string, unknown>, usuario });

export const actualizarSede = (id: string, sede: Partial<SedeInput>, usuario?: Usuario) =>
  pedir<{ id: string }>("sedes", "PUT", { payload: { id, ...sede }, usuario });

export const eliminarSede = (id: string, usuario?: Usuario) =>
  pedir("sedes", "DELETE", { payload: { id }, usuario });

export const desactivarSede = eliminarSede;

export const reactivarSede = (id: string, usuario?: Usuario) =>
  actualizarSede(id, { activo: true, estado: "Activa" }, usuario);

// ─── Actividades (Agenda) ───
export const fetchActividades = (filtros?: Record<string, unknown>) =>
  pedir<Actividad[]>("actividades", "GET", { filtros, tags: ["actividades"] });

// Actividades de una sede concreta (reutiliza el mismo recurso; NO lógica duplicada).
export const fetchActividadesDeSede = (sedeId: string) =>
  pedir<Actividad[]>("actividades", "GET", { filtros: { sedeId }, tags: ["actividades", "actividades-sede-" + sedeId] });

export const crearActividad = (act: ActividadInput, usuario?: Usuario) =>
  pedir<{ id: string }>("actividades", "POST", { payload: act as unknown as Record<string, unknown>, usuario });

export const actualizarActividad = (id: string, act: Partial<ActividadInput>, usuario?: Usuario) =>
  pedir<{ id: string }>("actividades", "PUT", { payload: { id, ...act }, usuario });

export const eliminarActividad = (id: string, usuario?: Usuario) =>
  pedir("actividades", "DELETE", { payload: { id }, usuario });

export const desactivarActividad = eliminarActividad;

// ─── Eventos (Op_Eventos) — base de Timeline, bitácora, notificaciones, trazabilidad ───
// Fallback elegante: si el backend aún no expone "eventos", devolvemos lista vacía sin romper.
export const fetchEventos = async (filtros?: Record<string, unknown>): Promise<Resp<Evento[]>> => {
  const r = await pedir<Evento[]>("eventos", "GET", { filtros, tags: ["eventos"] });
  if (!r.ok) return { ok: true, data: [] };
  return { ok: true, data: Array.isArray(r.data) ? r.data : [] };
};

export const fetchEventosDeSede = (sedeId: string) =>
  fetchEventos({ sedeId });

// Registrar un evento. No lanza: si el backend no lo soporta, se ignora silenciosamente.
export const registrarEvento = async (evento: EventoInput, usuario?: Usuario): Promise<Resp<{ id: string }>> => {
  const payload = {
    ...evento,
    datosAnteriores: evento.datosAnteriores !== undefined ? JSON.stringify(evento.datosAnteriores) : undefined,
    datosNuevos: evento.datosNuevos !== undefined ? JSON.stringify(evento.datosNuevos) : undefined,
  };
  const r = await pedir<{ id: string }>("eventos", "POST", { payload: payload as unknown as Record<string, unknown>, usuario });
  return r.ok ? r : { ok: true, data: { id: "" } };
};

// ─── Módulos (Op_Modulos) — registro data-driven; con fallback al registro local ───
export const fetchModulos = async (filtros?: Record<string, unknown>): Promise<Resp<Modulo[]>> => {
  const r = await pedir<Modulo[]>("modulos", "GET", { filtros, tags: ["modulos"] });
  if (!r.ok) return { ok: true, data: [] };
  return { ok: true, data: Array.isArray(r.data) ? r.data : [] };
};
