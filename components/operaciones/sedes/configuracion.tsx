"use client";

import { useModulos } from "@/hooks/useModulos";
import { Card, Badge } from "@/components/ui";
import type { ModuloSedeProps } from "@/lib/sede-modulos";
import { Settings, ToggleLeft, ToggleRight } from "lucide-react";

/**
 * Pestana Configuracion. Configuracion propia de la sede.
 * Se apoya en Op_Modulos (registro data-driven, via useModulos) para
 * activar/desactivar modulos por sede y controlarlos por rol.
 */
export function Configuracion(_props: ModuloSedeProps) {
  const { modulos, cargando } = useModulos();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-slate-700">
        <Settings className="h-4 w-4 text-primary" />
        <span className="font-medium">Configuracion de la sede</span>
      </div>

      <Card className="p-5 rounded-2xl shadow-soft">
        <h4 className="text-sm font-medium text-slate-700 mb-3">Modulos habilitados</h4>
        {cargando ? (
          <div className="space-y-2">{[0,1,2].map((i)=><div key={i} className="h-10 rounded-xl bg-slate-100 animate-pulse" />)}</div>
        ) : modulos.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">No hay modulos registrados.</div>
        ) : (
          <ul className="space-y-2">
            {modulos.map((m) => {
              const activo = m.activo !== false;
              return (
                <li key={m.clave} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-700">{m.etiqueta}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{activo ? "Activo" : "Inactivo"}</Badge>
                    {activo ? <ToggleRight className="h-5 w-5 text-success" /> : <ToggleLeft className="h-5 w-5 text-slate-400" />}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card className="p-5 rounded-2xl shadow-soft">
        <h4 className="text-sm font-medium text-slate-700 mb-2">Preferencias</h4>
        <div className="py-8 text-center text-slate-400 text-sm">Configuracion avanzada disponible proximamente.</div>
      </Card>
    </div>
  );
}

export default Configuracion;
