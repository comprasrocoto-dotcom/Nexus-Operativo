"use client";

import { useMemo } from "react";
import * as Icons from "lucide-react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useRecurso } from "@/hooks/useRecurso";
import type { DefinicionWidget } from "@/types/admin";

const COLORES: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
};

function resolverIcono(nombre?: string) {
  const set = Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  return (nombre && set[nombre]) || Icons.Circle;
}

export function WidgetMetrica({ widget }: { widget: DefinicionWidget }) {
  const { items, cargando } = useRecurso(widget.recurso ?? "__none__", widget.filtros);
  const Icono = useMemo(() => resolverIcono(widget.icono), [widget.icono]);
  const valor = cargando ? "—" : items.length;

  return (
    <Card className="flex items-center gap-4 p-4">
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", COLORES[widget.color ?? "primary"])}>
        <Icono className="h-6 w-6" />
      </div>
      <div>
        <div className="text-2xl font-bold leading-none">{valor}</div>
        <div className="text-sm text-slate-500 dark:text-slate-400">{widget.titulo}</div>
      </div>
    </Card>
  );
}

export function DashboardWidgets({ widgets }: { widgets: DefinicionWidget[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {widgets.map((w) => <WidgetMetrica key={w.clave} widget={w} />)}
    </div>
  );
}
