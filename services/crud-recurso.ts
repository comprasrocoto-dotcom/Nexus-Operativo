// services/crud-recurso.ts — CRUD genérico reutilizable para CUALQUIER recurso del ERP.
// Enruta por el DataProvider activo: Demo (localStorage) o Gas (API real), sin cambiar la UI.
// La bitácora (Op_Eventos) se registra SIEMPRE una sola vez: si el provider activo ya
// audita por su cuenta (DemoProvider), este servicio no vuelve a emitir el evento.

"use client";

import { useCallback, useEffect, useState } from "react";
import { dataRequest, esProveedorLocal } from "@/lib/data/client";

export type RegistroBase = { ID: string; [k: string]: unknown };

export type OpcionesMutacion = {
evento?: {
modulo: string;
entidad?: string;
tipoEvento: string;
descripcion?: string;
sedeId?: string;
};
};

const USUARIO_DEMO = "Administrador Demo";

// El DemoProvider ya escribe en la bitácora dentro de la propia mutación.
// Emitir aquí otro evento duplicaría el Timeline, así que se omite.
function providerAuditaSolo(): boolean {
return esProveedorLocal();
}

async function llamar(recurso: string, metodoRest: string, body?: Record<string, unknown>) {
if (esProveedorLocal()) {
const { id, ...payload } = (body ?? {}) as Record<string, unknown>;
return dataRequest(recurso, metodoRest, {
payload,
id: id as string | undefined,
usuario: USUARIO_DEMO,
});
}
const res = await fetch("/api/operaciones?recurso=" + encodeURIComponent(recurso), {
method: metodoRest,
headers: {
"Content-Type": "application/json",
"x-usuario-rol": "administrador",
"x-usuario-nombre": USUARIO_DEMO,
},
...(body ? { body: JSON.stringify(body) } : {}),
cache: "no-store",
});
return res.json().catch(() => ({ ok: false, error: "Respuesta inválida" }));
}

async function emitirEvento(ev: NonNullable<OpcionesMutacion["evento"]>, entidadId?: string) {
if (providerAuditaSolo()) return;
try {
await llamar("eventos", "POST", { ...ev, entidadId });
} catch {
return;
}
}

export function crudRecurso<T extends RegistroBase = RegistroBase>(recurso: string) {
return {
listar: async (filtros: Record<string, string | number | boolean> = {}) => {
if (esProveedorLocal()) {
const res = await dataRequest<T[]>(recurso, "GET", { filtros });
return res && res.ok && Array.isArray(res.data) ? (res.data as T[]) : ([] as T[]);
}
const params = new URLSearchParams({ recurso: String(recurso) });
Object.entries(filtros).forEach(([k, v]) => params.set(k, String(v)));
return fetch("/api/operaciones?" + params.toString(), { cache: "no-store" })
.then((r) => r.json())
.then((j) => (j && j.ok && Array.isArray(j.data) ? (j.data as T[]) : []))
.catch(() => [] as T[]);
},
crear: async (datos: Record<string, unknown>, opts?: OpcionesMutacion) => {
const res = await llamar(recurso, "POST", datos);
if (res.ok && opts?.evento) await emitirEvento(opts.evento, res?.data?.id ?? res?.data?.ID);
return res as { ok: boolean; data?: { id?: string; ID?: string }; error?: string };
},
actualizar: async (id: string, datos: Record<string, unknown>, opts?: OpcionesMutacion) => {
const res = await llamar(recurso, "PUT", { id, ...datos });
if (res.ok && opts?.evento) await emitirEvento(opts.evento, id);
return res as { ok: boolean; error?: string };
},
eliminar: async (id: string, opts?: OpcionesMutacion) => {
const res = await llamar(recurso, "DELETE", { id });
if (res.ok && opts?.evento) await emitirEvento(opts.evento, id);
return res as { ok: boolean; error?: string };
},
};
}

export function useRecursoSede<T extends RegistroBase = RegistroBase>(recurso: string, sedeId: string) {
const servicio = crudRecurso<T>(recurso);
const [items, setItems] = useState<T[]>([]);
const [cargando, setCargando] = useState(true);

const recargar = useCallback(async () => {
setCargando(true);
const data = await servicio.listar({ sedeId });
setItems(data);
setCargando(false);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [recurso, sedeId]);

useEffect(() => { void recargar(); }, [recargar]);

return { items, cargando, recargar, servicio };
}
