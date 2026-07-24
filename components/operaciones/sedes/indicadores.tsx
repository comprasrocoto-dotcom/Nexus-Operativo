"use client";

import { Card } from "@/components/ui";
import { Gauge, Package, ClipboardCheck, ShoppingCart, Calendar } from "lucide-react";

interface IndicadoresProps {
  sedeId: string;
}

const KPIS = [
  { titulo: "Cumplimiento", icono: Gauge, valor: "-", sufijo: "%", color: "text-success" },
  { titulo: "Inventarios", icono: Package, valor: "0", sufijo: "", color: "text-primary" },
  { titulo: "Auditorias", icono: ClipboardCheck, valor: "0", sufijo: "", color: "text-secondary" },
  { titulo: "Compras", icono: ShoppingCart, valor: "0", sufijo: "", color: "text-primary" },
  { titulo: "Actividades", icono: Calendar, valor: "0", sufijo: "", color: "text-secondary" },
];

/**
 * Pestana Indicadores. Dashboard de KPIs de la sede.
 * Valores vacios por ahora; la arquitectura queda preparada para alimentarse
 * de los modulos (Inventarios, Auditorias, Compras, Agenda) via SedeID.
 */
export function Indicadores({ sedeId }: IndicadoresProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-slate-700">
        <Gauge className="h-4 w-4 text-primary" />
        <span className="font-medium">Indicadores de la sede</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {KPIS.map((k) => {
          const Icono = k.icono;
          return (
            <Card key={k.titulo} className="p-5 rounded-2xl shadow-soft">
              <Icono className={k.color + " h-5 w-5 mb-3"} />
              <div className="text-2xl font-bold text-slate-800">{k.valor}<span className="text-base font-medium text-slate-400">{k.sufijo}</span></div>
              <div className="text-xs text-slate-500 mt-1">{k.titulo}</div>
            </Card>
          );
        })}
      </div>
      <Card className="p-5 rounded-2xl shadow-soft">
        <div className="py-10 text-center text-slate-400 text-sm">Los indicadores se calcularan automaticamente cuando existan datos operativos.</div>
      </Card>
    </div>
  );
}

export default Indicadores;
