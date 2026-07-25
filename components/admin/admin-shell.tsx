// components/admin/admin-shell.tsx — Shell del modulo Administracion del Sistema.
// Tabs 100% data-driven (SECCIONES_ADMIN). Cada seccion resuelve a: dashboard de
// widgets, CRUD generico de un recurso, o el Timeline de eventos. Agregar una
// seccion nueva = agregar una entrada en lib/admin.ts, sin tocar este componente.
"use client";

import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SECCIONES_ADMIN,
  RECURSOS_ADMIN,
  WIDGETS_ADMIN,
  type SeccionAdmin,
} from "@/lib/admin";
import CrudGenerico from "@/components/admin/crud-generico";
import { DashboardWidgets } from "@/components/admin/widget-metrica";
import Timeline from "@/components/timeline/timeline";

function resolverIcono(nombre?: string) {
  const set = Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  return (nombre && set[nombre]) || Icons.Circle;
}

export default function AdminShell({ usuario }: { usuario?: string }) {
  const secciones = useMemo(
    () => [...SECCIONES_ADMIN].sort((a, b) => 0),
    [],
  );
  const [activa, setActiva] = useState<string>(secciones[0]?.clave ?? "dashboard");
  const seccion = secciones.find((s) => s.clave === activa) ?? secciones[0];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary text-2xl">
          <Icons.Settings className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-tight">Administracion del Sistema</h1>
          <p className="text-sm text-muted-foreground">
            Centro de configuracion del ERP. Todo administrable desde la web.
          </p>
        </div>
      </header>

      <nav className="flex flex-wrap gap-1 border-b">
        {secciones.map((s) => {
          const Icono = resolverIcono(s.icono);
          const on = s.clave === activa;
          return (
            <button
              key={s.clave}
              onClick={() => setActiva(s.clave)}
              className={cn(
                "flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                on
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <Icono className="h-4 w-4" />
              <span>{s.titulo}</span>
            </button>
          );
        })}
      </nav>

      <section className="pt-2">
        <Seccion seccion={seccion} usuario={usuario} />
      </section>
    </div>
  );
}

function Seccion({ seccion, usuario }: { seccion?: SeccionAdmin; usuario?: string }) {
  if (!seccion) return null;

  if (seccion.tipo === "dashboard") {
    return (
      <div className="space-y-4">
        <DashboardWidgets widgets={WIDGETS_ADMIN} />
      </div>
    );
  }

  if (seccion.tipo === "eventos") {
    return (
      <Timeline
        filtros={{}}
        titulo="Bitacora del sistema"
        vacioTexto="Aun no hay eventos registrados."
      />
    );
  }

  // tipo === "crud"
  const def = seccion.recurso ? RECURSOS_ADMIN[seccion.recurso] : undefined;
  if (!def) {
    return <div className="text-sm text-muted-foreground">Recurso no configurado.</div>;
  }
  return <CrudGenerico definicion={def} usuario={usuario} />;
}
