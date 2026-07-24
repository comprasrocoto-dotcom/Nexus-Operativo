// components/timeline/timeline.tsx — Timeline GENÉRICO del ERP.
// NO es específico de Sedes: se alimenta de Op_Eventos y sirve para cualquier entidad
// (Sede, Usuario, Compra, Inventario, Auditoría, Documento, Proveedor...).
// Se le pasan filtros (sedeId / entidad / entidadId / modulo) y él resuelve todo.

"use client";

import * as Icons from "lucide-react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useEventos, type FiltroEventos } from "@/hooks/useEventos";
import { metaEvento, claseColorEvento } from "@/lib/eventos";
import type { Evento } from "@/lib/operaciones";

type IconoLucide = React.ComponentType<{ className?: string }>;

function Icono({ nombre, className }: { nombre: string; className?: string }) {
  const Comp = (Icons as unknown as Record<string, IconoLucide>)[nombre] || Icons.Circle;
  return <Comp className={className} />;
}

function fechaHora(ev: Evento): string {
  const base = ev.Fecha ? new Date(ev.Fecha) : null;
  if (base && !isNaN(base.getTime())) {
    const f = base.toLocaleDateString();
    return ev.Hora ? f + " · " + ev.Hora : f;
  }
  return [ev.Fecha, ev.Hora].filter(Boolean).join(" · ") || "—";
}

export function Timeline({
  filtros,
  titulo = "Actividad",
  vacioTexto = "Aún no hay actividad registrada.",
}: {
  filtros: FiltroEventos;
  titulo?: string;
  vacioTexto?: string;
}) {
  const { eventos, cargando } = useEventos(filtros);

  if (cargando) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100 dark:bg-slate-800/60" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!eventos.length) {
    return (
      <Card className="flex flex-col items-center justify-center gap-2 py-14 text-center">
        <Icons.History className="h-10 w-10 text-slate-300" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Sin actividad todavía</p>
        <p className="max-w-sm text-xs text-slate-400">{vacioTexto}</p>
      </Card>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-800" aria-hidden />
      <ol className="space-y-5">
        {eventos.map((ev) => {
          const meta = metaEvento(ev.TipoEvento);
          const color = claseColorEvento(ev.Color || meta.color);
          const icono = ev.Icono || meta.icono;
          return (
            <li key={ev.ID} className="relative flex gap-4 pl-0">
              <span
                className={cn(
                  "z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-900",
                  color.bg
                )}
              >
                <Icono nombre={icono} className={cn("h-4 w-4", color.text)} />
              </span>
              <div className="flex-1 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {meta.etiqueta}
                  </span>
                  <span className="text-xs text-slate-400">{fechaHora(ev)}</span>
                </div>
                {ev.Descripcion && (
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{ev.Descripcion}</p>
                )}
                {ev.Usuario && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                    <Icons.User className="h-3 w-3" /> {ev.Usuario}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
