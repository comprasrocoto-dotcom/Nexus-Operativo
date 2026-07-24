"use client";

import { Card, Badge, Button } from "@/components/ui";
import { ShoppingCart, Plus, TrendingUp, Clock, History } from "lucide-react";

interface ComprasProps {
  sedeId: string;
}

/** Pestana Compras. Estructura preparada para el futuro modulo Compras (via SedeID). */
export function Compras({ sedeId }: ComprasProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700">
          <ShoppingCart className="h-4 w-4 text-primary" />
          <span className="font-medium">Compras de la sede</span>
        </div>
        <Button className="gap-1"><Plus className="h-4 w-4" /> Nueva compra</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 rounded-2xl shadow-soft">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2"><TrendingUp className="h-4 w-4 text-primary" /> Gasto acumulado</div>
          <div className="text-lg font-semibold text-slate-800">S/ 0.00</div>
        </Card>
        <Card className="p-5 rounded-2xl shadow-soft">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2"><Clock className="h-4 w-4 text-primary" /> Ordenes pendientes</div>
          <div className="text-lg font-semibold text-slate-800">0</div>
        </Card>
        <Card className="p-5 rounded-2xl shadow-soft">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2"><History className="h-4 w-4 text-primary" /> Ultima compra</div>
          <div className="text-lg font-semibold text-slate-800">Sin registros</div>
        </Card>
      </div>

      <Card className="p-5 rounded-2xl shadow-soft">
        <div className="flex items-center gap-2 text-slate-700 mb-3"><History className="h-4 w-4 text-primary" /> <span className="font-medium">Historico de compras</span></div>
        <div className="py-10 text-center text-slate-400 text-sm">Aun no hay compras registradas para esta sede.</div>
      </Card>
    </div>
  );
}

export default Compras;
