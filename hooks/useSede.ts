// hooks/useSede.ts — Estado y acciones de una sede (entidad principal del ERP).
// Encapsula TODA la lógica de datos de la sede para que los componentes solo rendericen.
// Registra automáticamente eventos en Op_Eventos ante cambios relevantes.

"use client";

import { useCallback, useEffect, useState } from "react";
import type { Sede, SedeInput, Usuario } from "@/lib/operaciones";

type Estado = {
  sede: Sede | null;
  cargando: boolean;
  error: string | null;
};

async function api(metodo: "PUT" | "DELETE", body: Record<string, unknown>) {
  const res = await fetch("/api/operaciones?recurso=sedes", {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json().catch(() => ({ ok: false, error: "Respuesta inválida" }));
}

export function useSede(sedeId: string, sedeInicial?: Sede | null) {
  const [estado, setEstado] = useState<Estado>({
    sede: sedeInicial ?? null,
    cargando: !sedeInicial,
    error: null,
  });

  const recargar = useCallback(async () => {
    setEstado((s) => ({ ...s, cargando: true, error: null }));
    const res = await fetch("/api/operaciones?recurso=sedes", { cache: "no-store" }).catch(() => null);
    const json = res ? await res.json().catch(() => null) : null;
    if (json?.ok && Array.isArray(json.data)) {
      const sede = (json.data as Sede[]).find((s) => s.ID === sedeId) ?? null;
      setEstado({ sede, cargando: false, error: sede ? null : "Sede no encontrada" });
    } else {
      setEstado((s) => ({ ...s, cargando: false, error: json?.error ?? "No se pudo cargar la sede" }));
    }
  }, [sedeId]);

  useEffect(() => {
    if (!sedeInicial) void recargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sedeId]);

  // Actualiza la sede y registra el evento correspondiente (incluye RESPONSABLE_CAMBIADO).
  const actualizar = useCallback(
    async (cambios: Partial<SedeInput>, usuario?: Usuario) => {
      const anterior = estado.sede;
      const res = await api("PUT", { id: sedeId, ...cambios });
      if (res.ok) {
        try {
          const cambioResponsable =
            cambios.responsable !== undefined && cambios.responsable !== anterior?.Responsable;
          await fetch("/api/operaciones?recurso=eventos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              modulo: "sedes",
              entidad: "Sede",
              entidadId: sedeId,
              sedeId,
              tipoEvento: cambioResponsable ? "RESPONSABLE_CAMBIADO" : "SEDE_ACTUALIZADA",
              descripcion: cambioResponsable
                ? `Responsable: ${anterior?.Responsable ?? "—"} → ${cambios.responsable}`
                : "Datos de la sede actualizados",
              datosAnteriores: anterior,
              datosNuevos: cambios,
            }),
          });
        } catch { /* fallback silencioso */ }
        await recargar();
      }
      return res as { ok: boolean; error?: string };
    },
    [sedeId, estado.sede, recargar]
  );

  const desactivar = useCallback(async () => {
    const res = await api("DELETE", { id: sedeId });
    if (res.ok) await recargar();
    return res as { ok: boolean; error?: string };
  }, [sedeId, recargar]);

  const reactivar = useCallback(async () => {
    const res = await api("PUT", { id: sedeId, activo: true, estado: "Activa" });
    if (res.ok) await recargar();
    return res as { ok: boolean; error?: string };
  }, [sedeId, recargar]);

  return { ...estado, recargar, actualizar, desactivar, reactivar };
}
