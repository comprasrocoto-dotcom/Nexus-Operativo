// services/crud-recurso.ts — CRUD genérico reutilizable para CUALQUIER recurso del ERP.
// Base común de todos los módulos (Inventarios, Compras, Auditorías, Costos, Documentos...).
// Un módulo nuevo NO reescribe lógica: instancia crudRecurso("<recurso>") y listo.
// Todo se relaciona con la sede mediante sedeId, y cada mutación puede emitir un evento.

"use client";

import { useCallback, useEffect, useState } from "react";

export type RegistroBase = { ID: string; [k: string]: unknown };

export type OpcionesMutacion = {
  // Evento a registrar tras la mutación (alimenta el Timeline). Opcional.
  evento?: {
    modulo: string;
    entidad?: string;
    tipoEvento: string;
    descripcion?: string;
    sedeId?: string;
  };
};

async function llamar(recurso: string, metodo: string, body?: unknown) {
  const res = await fetch("/api/operaciones?recurso=" + encodeURIComponent(recurso), {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
  });
  return res.json().catch(() => ({ ok: false, error: "Respuesta inválida" }));
}

// Registro de evento no bloqueante (fallback silencioso si el backend no lo soporta).
async function emitirEvento(ev: NonNullable<OpcionesMutacion["evento"]>, entidadId?: string) {
  try {
    await llamar("eventos", "POST", { ...ev, entidadId });
  } catch { /* noop */ }
}

// Fábrica de servicio CRUD por recurso. Server-safe y client-safe.
export function crudRecurso<T extends RegistroBase = RegistroBase>(recurso: string) {
  return {
    listar: (filtros: Record<string, string | number | boolean> = {}) => {
      const params = new URLSearchParams({ recurso: String(recurso) });
      Object.entries(filtros).forEach(([k, v]) => params.set(k, String(v)));
      return fetch("/api/operaciones?" + params.toString(), { cache: "no-store" })
        .then((r) => r.json())
        .then((j) => (j && j.ok && Array.isArray(j.data) ? (j.data as T[]) : []))
        .catch(() => [] as T[]);
    },
    crear: async (datos: Record<string, unknown>, opts?: OpcionesMutacion) => {
      const res = await llamar(recurso, "POST", datos);
      if (res.ok && opts?.evento) await emitirEvento(opts.evento, res?.data?.id);
      return res as { ok: boolean; data?: { id?: string }; error?: string };
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

// Hook genérico: estado + CRUD de un recurso filtrado por sede. Reutilizable por todo módulo.
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
