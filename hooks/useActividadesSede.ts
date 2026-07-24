// hooks/useActividadesSede.ts — Agenda de la sede reutilizando el modelo Actividad.
// NO duplica el modelo de actividades: consume el mismo recurso /api/operaciones?recurso=actividades
// filtrado por sedeId. Mañana Agenda Operativa usará el mismo endpoint sin cambios.

"use client";

import { useCallback, useEffect, useState } from "react";
import type { Actividad, ActividadInput } from "@/lib/operaciones";

type Estado = {
  actividades: Actividad[];
  cargando: boolean;
  error: string | null;
};

async function api(metodo: "POST" | "PUT" | "DELETE", body: Record<string, unknown>) {
  const res = await fetch("/api/operaciones?recurso=actividades", {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json().catch(() => ({ ok: false, error: "Respuesta inválida" }));
}

export function useActividadesSede(sedeId: string) {
  const [estado, setEstado] = useState<Estado>({ actividades: [], cargando: true, error: null });

  const recargar = useCallback(async () => {
    setEstado((s) => ({ ...s, cargando: true, error: null }));
    try {
      const res = await fetch("/api/operaciones?recurso=actividades&sedeId=" + encodeURIComponent(sedeId), { cache: "no-store" });
      const json = await res.json().catch(() => null);
      const todas = json && json.ok && Array.isArray(json.data) ? (json.data as Actividad[]) : [];
      // Filtro defensivo en cliente por si el backend no aplica el filtro sedeId.
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
