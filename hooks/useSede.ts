// hooks/useSede.ts — Estado y acciones de una sede (entidad principal del ERP).
// Enruta por el DataProvider activo: Demo (localStorage) o Gas (API real).

"use client";

import { useCallback, useEffect, useState } from "react";
import type { Sede, SedeInput, Usuario } from "@/lib/operaciones";
import { dataRequest, esProveedorLocal } from "@/lib/data/client";

type Estado = {
  sede: Sede | null;
  cargando: boolean;
  error: string | null;
};

const USUARIO_DEMO = "Administrador Demo";

async function api(metodoRest: "PUT" | "DELETE", body: Record<string, unknown>) {
  if (esProveedorLocal()) {
    const { id, ...payload } = body;
    return dataRequest("sedes", metodoRest, { payload, id: id as string | undefined, usuario: USUARIO_DEMO });
  }
  const res = await fetch("/api/operaciones?recurso=sedes", {
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

async function listarSedes(): Promise<{ ok: boolean; data?: Sede[]; error?: string }> {
  if (esProveedorLocal()) {
    return dataRequest<Sede[]>("sedes", "GET", { incluirInactivas: true });
  }
  const res = await fetch("/api/operaciones?recurso=sedes", { cache: "no-store" }).catch(() => null);
  return res ? await res.json().catch(() => ({ ok: false, error: "Respuesta inválida" })) : { ok: false, error: "Sin respuesta" };
}

async function registrarEvento(body: Record<string, unknown>) {
  try {
    if (esProveedorLocal()) {
      await dataRequest("eventos", "POST", { payload: body, usuario: USUARIO_DEMO });
    } else {
      await fetch("/api/operaciones?recurso=eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
  } catch { /* fallback silencioso */ }
}

export function useSede(sedeId: string, sedeInicial?: Sede | null) {
  const [estado, setEstado] = useState<Estado>({
    sede: sedeInicial ?? null,
    cargando: !sedeInicial,
    error: null,
  });

  const recargar = useCallback(async () => {
    setEstado((s) => ({ ...s, cargando: true, error: null }));
    const json = await listarSedes();
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

  const actualizar = useCallback(
    async (cambios: Partial<SedeInput>, _usuario?: Usuario) => {
      const anterior = estado.sede;
      const res = await api("PUT", { id: sedeId, ...cambios });
      if (res.ok) {
        const cambioResponsable =
          cambios.responsable !== undefined && cambios.responsable !== anterior?.Responsable;
        await registrarEvento({
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
        });
        await recargar();
      }
      return res as { ok: boolean; error?: string };
    },
    [sedeId, estado.sede, recargar]
  );

  const desactivar = useCallback(async () => {
    const res = await api("DELETE", { id: sedeId });
    if (res.ok) {
      await registrarEvento({
        modulo: "sedes", entidad: "Sede", entidadId: sedeId, sedeId,
        tipoEvento: "SEDE_DESACTIVADA", descripcion: "Sede desactivada",
      });
      await recargar();
    }
    return res as { ok: boolean; error?: string };
  }, [sedeId, recargar]);

  const reactivar = useCallback(async () => {
    const res = await api("PUT", { id: sedeId, activo: true, estado: "Activa" });
    if (res.ok) {
      await registrarEvento({
        modulo: "sedes", entidad: "Sede", entidadId: sedeId, sedeId,
        tipoEvento: "SEDE_REACTIVADA", descripcion: "Sede reactivada",
      });
      await recargar();
    }
    return res as { ok: boolean; error?: string };
  }, [sedeId, recargar]);

  return { ...estado, recargar, actualizar, desactivar, reactivar };
}
