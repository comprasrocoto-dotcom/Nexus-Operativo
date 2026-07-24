"use client";

import { Suspense, lazy, useMemo, useState, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import * as Icons from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useSede } from "@/hooks/useSede";
import { useModulos } from "@/hooks/useModulos";
import type { ModuloSedeProps, DefinicionModulo } from "@/lib/sede-modulos";

/**
 * sede-detalle.tsx — Shell (cascaron) de la Ficha de la Sede.
 * SOLO ensambla: cabecera + pestanas data-driven (useModulos) + contenido lazy.
 * NO contiene logica de negocio: cada pestana es un componente independiente
 * que recibe el contrato estable ModuloSedeProps ({ sedeId, sedeNombre }).
 */

function Icono({ nombre, className }: { nombre: string; className?: string }) {
  const Cmp = (Icons as Record<string, ComponentType<{ className?: string }>>)[nombre] ?? Icons.Circle;
  return <Cmp className={className} />;
}

export function SedeDetalle({ sedeId }: { sedeId: string }) {
  const router = useRouter();
  const { sede, cargando, desactivar, reactivar } = useSede(sedeId);
  const { modulos } = useModulos();
  const [activa, setActiva] = useState<string>("general");

  // Mapa de componentes cargados de forma diferida (code-splitting por pestana).
  const lazyMap = useMemo(() => {
    const map: Record<string, ComponentType<ModuloSedeProps>> = {};
    modulos.forEach((m: DefinicionModulo) => { map[m.clave] = lazy(m.cargar); });
    return map;
  }, [modulos]);

  const activo = modulos.find((m) => m.clave === activa) ?? modulos[0];
  const Activo = activo ? lazyMap[activo.clave] : null;
  const inactiva = sede?.Estado?.toLowerCase().includes("inactiv") || sede?.Activo === false;

  return (
    <div className="space-y-5">
      {/* Cabecera */}
      <Card className="p-6 rounded-2xl shadow-soft">
        {cargando && !sede ? (
          <div className="h-24 rounded-xl bg-slate-100 animate-pulse" />
        ) : !sede ? (
          <div className="py-6 text-center text-slate-400">No se encontro la sede solicitada.</div>
        ) : (
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-800">{sede.Nombre}</h1>
                <Badge>{sede.Codigo}</Badge>
                <Badge>{sede.Estado ?? (inactiva ? "Inactiva" : "Activa")}</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1 text-sm text-slate-600 mt-2">
                <span><span className="text-slate-400">Responsable:</span> {sede.Responsable ?? "-"}</span>
                <span><span className="text-slate-400">Administrador:</span> {sede.Administrador ?? "-"}</span>
                <span><span className="text-slate-400">Direccion:</span> {sede.Direccion ?? "-"}</span>
                <span><span className="text-slate-400">Telefono:</span> {sede.Telefono ?? "-"}</span>
                <span><span className="text-slate-400">Creada:</span> {sede.FechaCreacion ?? "-"}</span>
                <span><span className="text-slate-400">Actualizada:</span> {sede.FechaModificacion ?? "-"}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => setActiva("general")} className="gap-1">
                <Icons.Pencil className="h-4 w-4" /> Editar
              </Button>
              {inactiva ? (
                <Button variant="ghost" onClick={() => reactivar()} className="gap-1">
                  <Icons.RotateCcw className="h-4 w-4" /> Reactivar
                </Button>
              ) : (
                <Button variant="ghost" onClick={() => desactivar()} className="gap-1">
                  <Icons.Power className="h-4 w-4" /> Desactivar
                </Button>
              )}
              <Button onClick={() => setActiva("agenda")} className="gap-1">
                <Icons.Calendar className="h-4 w-4" /> Ver Agenda
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Pestanas data-driven */}
      <div className="flex flex-wrap gap-1 border-b border-slate-200">
        {modulos.map((m) => (
          <button
            key={m.clave}
            onClick={() => setActiva(m.clave)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              activa === m.clave
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            <Icono nombre={m.icono} className="h-4 w-4" />
            <span>{m.etiqueta}</span>
          </button>
        ))}
      </div>

      {/* Contenido de la pestana activa */}
      <div>
        <Suspense fallback={<Card className="p-6 rounded-2xl shadow-soft"><div className="h-40 rounded-xl bg-slate-100 animate-pulse" /></Card>}>
          {Activo ? <Activo sedeId={sedeId} sedeNombre={sede?.Nombre} /> : (
            <Card className="p-6 rounded-2xl shadow-soft"><div className="py-10 text-center text-slate-400 text-sm">No hay modulos disponibles.</div></Card>
          )}
        </Suspense>
      </div>
    </div>
  );
}

export default SedeDetalle;
