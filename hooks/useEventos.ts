// hooks/useEventos.ts — Lectura de eventos (Op_Eventos) para el Timeline genérico.
// Enruta por el DataProvider activo: Demo (localStorage) o Gas (API real).

"use client";

import { useCallback, useEffect, useState } from "react";
import type { Evento } from "@/lib/operaciones";
import { dataRequest, esProveedorLocal } from "@/lib/data/client";

export type FiltroEventos = {
  sedeId?: string;
  entidad?: string;
  entidadId?: string;
  modulo?: string;
  tipoEvento?: string;
  limite?: number;
};

type Estado = {
  eventos: Evento[];
  cargando: boolean;
  error: string | null;
};

function construirQuery(filtros: FiltroEventos): string {
  const params = new URLSearchParams({ recurso: "eventos" });
  Object.entries(filtros).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
  });
  return params.toString();
}

export function useEventos(filtros: FiltroEventos = {}) {
  const [estado, setEstado] = useState<Estado>({ eventos: [], cargando: true, error: null });
  const clave = JSON.stringify(filtros);

  const recargar = useCallback(async () => {
    setEstado((s) => ({ ...s, cargando: true, error: null }));
    try {
      let eventos: Evento[] = [];
      if (esProveedorLocal()) {
        const { limite, ...resto } = filtros;
        const res = await dataRequest<Evento[]>("eventos", "GET", {
          filtros: resto,
          ordenarPor: "Fecha",
          orden: "desc",
          porPagina: limite,
        });
        eventos = res && res.ok && Array.isArray(res.data) ? (res.data as Evento[]) : [];
      } else {
        const res = await fetch("/api/operaciones?" + construirQuery(filtros), { cache: "no-store" });
        const json = await res.json().catch(() => null);
        eventos = json && json.ok && Array.isArray(json.data) ? (json.data as Evento[]) : [];
      }
      setEstado({ eventos, cargando: false, error: null });
    } catch {
      setEstado({ eventos: [], cargando: false, error: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave]);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  return { ...estado, recargar };
}
