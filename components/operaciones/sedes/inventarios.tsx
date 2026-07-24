"use client";

import { Card, Badge, Button } from "@/components/ui";
import { Package, Plus, CalendarClock, CheckCircle2, ListTodo, History } from "lucide-react";

interface InventariosProps {
  sedeId: string;
}

const TARJETAS = [
  { titulo: "Proximo inventario", icono: CalendarClock, valor: "Sin programar" },
  { titulo: "Ultimo inventario", icono: CheckCircle2, valor: "Sin registros" },
  { titulo: "Pendientes", icono: ListTodo, valor: "0" },
];

/**
 * Pestana Inventarios. Estructura preparada para el futuro modulo Inventarios (via SedeID).
 * Reutilizara ModuloCrud y el hook generico de recurso cuando el backend exista.
 */
export function Inventarios({ sedeId }: InventariosProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700">
          <Package className="h-4 w-4 text-primary" />
          <span className="font-medium">Inventarios de la sede</span>
        </div>
        <Button className="gap-1"><Plus className="h-4 w-4" /> Nuevo inventario</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TARJETAS.map((t) => {
          const Icono = t.icono;
          return (
            <Card key={t.titulo} className="p-5 rounded-2xl shadow-soft">
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                <Icono className="h-4 w-4 text-primary" /> {t.titulo}
              </div>
              <div className="text-lg font-semibold text-slate-800">{t.valor}</div>
            </Card>
          );
        })}
      </div>

      <Card className="p-5 rounded-2xl shadow-soft">
        <div className="flex items-center gap-2 text-slate-700 mb-3">
          <History className="h-4 w-4 text-primary" /> <span className="font-medium">Historico</span>
        </div>
        <div className="py-10 text-center text-slate-400 text-sm">Aun no hay inventarios registrados para esta sede.</div>
      </Card>
    </div>
  );
}

export default Inventarios;
