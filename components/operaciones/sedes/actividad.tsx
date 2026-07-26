"use client";

import { Timeline } from "@/components/timeline/timeline";
import { History } from "lucide-react";

interface ActividadProps {
  sedeId: string;
}

/**
 * Pestana Actividad (Timeline de la sede).
 * Reutiliza el Timeline GENERICO alimentado por Op_Eventos, filtrando por sedeId.
 * El mismo Timeline sirve para Usuarios, Compras, Inventarios, Auditorias, etc.
 */
export function Actividad({ sedeId }: ActividadProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-slate-700">
        <History className="h-4 w-4 text-primary" />
        <span className="font-medium">Historial de actividad</span>
      </div>
      <Timeline filtros={{ sedeId }} />
    </div>
  );
}

export default Actividad;
