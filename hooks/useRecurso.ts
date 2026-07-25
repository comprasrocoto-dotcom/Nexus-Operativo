// hooks/useRecurso.ts — Hook generico de CRUD para CUALQUIER recurso del ERP.
// Version global (no atada a sede) de useRecursoSede. Reutiliza crudRecurso, asi
// que NO duplica la logica de red. Cualquier gestor admin lo usa igual.
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { crudRecurso, type RegistroBase, type OpcionesMutacion } from "@/services/crud-recurso";

export type EstadoRecurso<T> = {
  items: T[];
  cargando: boolean;
  error: string | null;
  recargar: () => Promise<void>;
  crear: (datos: Record<string, unknown>, opts?: OpcionesMutacion) => Promise<boolean>;
  actualizar: (id: string, datos: Record<string, unknown>, opts?: OpcionesMutacion) => Promise<boolean>;
  eliminar: (id: string, opts?: OpcionesMutacion) => Promise<boolean>;
};

export function useRecurso<T extends RegistroBase = RegistroBase>(
  recurso: string,
  filtros?: Record<string, string | number | boolean>,
): EstadoRecurso<T> {
  const servicio = useMemo(() => crudRecurso<T>(recurso), [recurso]);
  const filtrosKey = JSON.stringify(filtros ?? {});
  const [items, setItems] = useState<T[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await servicio.listar(filtros);
      setItems(Array.isArray(data) ? (data as T[]) : []);
    } catch {
      // Fallback elegante: nunca rompe la vista, solo lista vacia + aviso.
      setItems([]);
      setError("No se pudo cargar la informacion.");
    } finally {
      setCargando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servicio, filtrosKey]);

  useEffect(() => { void recargar(); }, [recargar]);

  const crear = useCallback(
    async (datos: Record<string, unknown>, opts?: OpcionesMutacion) => {
      const res = await servicio.crear(datos, opts);
      if (res && (res as { ok?: boolean }).ok !== false) await recargar();
      return Boolean(res && (res as { ok?: boolean }).ok !== false);
    },
    [servicio, recargar],
  );

  const actualizar = useCallback(
    async (id: string, datos: Record<string, unknown>, opts?: OpcionesMutacion) => {
      const res = await servicio.actualizar(id, datos, opts);
      if (res && (res as { ok?: boolean }).ok !== false) await recargar();
      return Boolean(res && (res as { ok?: boolean }).ok !== false);
    },
    [servicio, recargar],
  );

  const eliminar = useCallback(
    async (id: string, opts?: OpcionesMutacion) => {
      const res = await servicio.eliminar(id, opts);
      if (res && (res as { ok?: boolean }).ok !== false) await recargar();
      return Boolean(res && (res as { ok?: boolean }).ok !== false);
    },
    [servicio, recargar],
  );

  return { items, cargando, error, recargar, crear, actualizar, eliminar };
}

// Hook de catalogos: carga opciones dinamicas para selects del CRUD generico.
// Traduce cualquier recurso a [{ value, label }] sin hardcodear nada.
export function useCatalogo(
  catalogo: string | undefined,
): { opciones: { value: string; label: string; color?: string }[]; cargando: boolean } {
  const activo = Boolean(catalogo);
  const { items, cargando } = useRecurso(activo ? (catalogo as string) : "__none__");
  const opciones = useMemo(() => {
    if (!activo) return [];
    return (items as Record<string, unknown>[]).map((it) => {
      const value = String(it.Clave ?? it.ID ?? it.value ?? "");
      const label = String(it.Nombre ?? it.Etiqueta ?? it.Nombre ?? value);
      const color = it.Color ? String(it.Color) : undefined;
      return { value, label, color };
    });
  }, [items, activo]);
  return { opciones, cargando: activo ? cargando : false };
}
