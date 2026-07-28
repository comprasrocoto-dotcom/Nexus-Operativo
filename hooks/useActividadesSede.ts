// hooks/useActividadesSede.ts — Agenda de la sede reutilizando el modelo Actividad.
// Enruta por el DataProvider activo: Demo (localStorage) o Gas (API real).

"use client";

import { useCallback, useEffect, useState } from "react";
import type { Actividad, ActividadInput } from "@/lib/operaciones";
import { dataRequest, esProveedorLocal } from "@/lib/data/client";

type Estado = {
  actividades: Actividad[];
  cargando: boolean;
  error: string | null;
};

const USUARIO_DEMO = "Administrador Demo";

async function api(metodoRest: "POST" | "PUT" | "DELETE", body: Record<string, unknown>) {
  if (esProveedorLocal()) {
    const { id, ...payload } = body;
    return dataRequest("actividades", metodoRest, { payload, id: id as string | undefined, usuario: USUARIO_DEMO });
  }
  const res = await fetch("/api/operaciones?recurso=actividades", {
    method: metodoRest,
    headers: {
      "Content-Type": "application/json",
      "x-usuario-rol": "administrador",
      "x-usuario-nombre": USUARIO_DEMO,
    },
    body: JSON.stringify(body),
  });
  return res.json().catch(() => ({ ok: false, error: "Respuesta inválida" }));
}

async function listarActividades(sedeId: string): Promise<Actividad[]> {
  if (esProveedorLocal()) {
    const res = await dataRequest<Actividad[]>("actividades", "GET", { filtros: { sedeId } });
    return res && res.ok && Array.isArray(res.data) ? (res.data as Actividad[]) : [];
  }
  const res = await fetch(
    "/api/operaciones?recurso=actividades&sedeId=" + encodeURIComponent(sedeId),
    { cache: "no-store" }
  );
  const json = await res.json().catch(() => null);
  return json && json.ok && Array.isArray(json.data) ? (json.data as Actividad[]) : [];
}

export function useActividadesSede(sedeId: string) {
  const [estado, setEstado] = useState<Estado>({ actividades: [], cargando: true, error: null });

  const recargar = useCallback(async () => {
    setEstado((s) => ({ ...s, cargando: true, error: null }));
    try {
      const todas = await listarActividades(sedeId);
      const actividades = todas.filter(
        (a) => a.SedeID === sedeId || (a.Sedes ?? "").includes(sedeId)
      );
      setEstado({ actividades: actividades.length ? actividades : todas, cargando: false, error: null });
    } catch {
      setEstado({ actividades: [], cargando: false, error: null });
    }
  }, [sedeId]);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  const crear = useCallback(
    async (datos: Omit<ActividadInput, "sedeId">) => {
      const res = await api("POST", { ...datos, sedeId });
      if (res.ok) await recargar();
      return res as { ok: boolean; error?: string };
    },
    [sedeId, recargar]
  );

  const actualizar = useCallback(
    async (id: string, datos: Partial<ActividadInput>) => {
      const res = await api("PUT", { id, ...datos });
      if (res.ok) await recargar();
      return res as { ok: boolean; error?: string };
    },
    [recargar]
  );

  const eliminar = useCallback(
    async (id: string) => {
      const res = await api("DELETE", { id });
      if (res.ok) await recargar();
      return res as { ok: boolean; error?: string };
    },
    [recargar]
  );

  return { ...estado, recargar, crear, actualizar, eliminar };
}
