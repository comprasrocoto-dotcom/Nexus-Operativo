// hooks/useModulos.ts — Resuelve qué módulos (pestañas) mostrar en la Ficha de Sede.
// Fusiona el registro local (fallback) con Op_Modulos del backend, permitiendo
// activar/desactivar módulos y filtrar por rol SIN tocar código (data-driven).

"use client";

import { useEffect, useMemo, useState } from "react";
import type { Modulo } from "@/lib/operaciones";
import { modulosVisibles, type DefinicionModulo } from "@/lib/sede-modulos";

// Aplica overrides de Op_Modulos (Activo, Orden, Roles) sobre el registro local por clave.
function fusionar(base: DefinicionModulo[], remotos: Modulo[]): DefinicionModulo[] {
  if (!remotos.length) return base;
  const porClave = new Map(remotos.map((m) => [m.Clave, m]));
  return base
    .map((mod) => {
      const r = porClave.get(mod.clave);
      if (!r) return mod;
      return {
        ...mod,
        activo: r.Activo !== false && mod.activo !== false,
        orden: typeof r.Orden === "number" ? r.Orden : mod.orden,
        etiqueta: r.Nombre || mod.etiqueta,
        roles: r.Roles ? String(r.Roles).split(",").map((s) => s.trim()) : mod.roles,
      };
    })
    .filter((m) => m.activo !== false)
    .sort((a, b) => a.orden - b.orden);
}

function permitidoPorRol(mod: DefinicionModulo, rol?: string): boolean {
  if (!mod.roles || !mod.roles.length) return true;
  if (!rol) return true; // sin rol conocido, no ocultamos (placeholder de permisos)
  return mod.roles.map((r) => r.toLowerCase()).includes(rol.toLowerCase());
}

export function useModulos(rol?: string) {
  const base = useMemo(() => modulosVisibles(), []);
  const [remotos, setRemotos] = useState<Modulo[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        const res = await fetch("/api/operaciones?recurso=modulos", { cache: "no-store" });
        const json = await res.json().catch(() => null);
        if (vivo && json && json.ok && Array.isArray(json.data)) setRemotos(json.data as Modulo[]);
      } catch { /* fallback al registro local */ }
      if (vivo) setCargando(false);
    })();
    return () => { vivo = false; };
  }, []);

  const modulos = useMemo(
    () => fusionar(base, remotos).filter((m) => permitidoPorRol(m, rol)),
    [base, remotos, rol]
  );

  return { modulos, cargando };
}
