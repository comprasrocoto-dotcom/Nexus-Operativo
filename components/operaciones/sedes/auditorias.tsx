"use client";

import { Card, Badge, Button } from "@/components/ui";
import { ClipboardCheck, Plus, CalendarClock, Award, FileText, History } from "lucide-react";

interface AuditoriasProps {
  sedeId: string;
}

/** Pestana Auditorias. Estructura preparada para el futuro modulo Auditorias (via SedeID). */
export function Auditorias({ sedeId }: AuditoriasProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700">
          <ClipboardCheck className="h-4 w-4 text-primary" />
          <span className="font-medium">Auditorias de la sede</span>
        </div>
        <Button className="gap-1"><Plus className="h-4 w-4" /> Nueva auditoria</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 rounded-2xl shadow-soft">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2"><History className="h-4 w-4 text-primary" /> Ultima auditoria</div>
          <div className="text-lg font-semibold text-slate-800">Sin registros</div>
        </Card>
        <Card className="p-5 rounded-2xl shadow-soft">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2"><CalendarClock className="h-4 w-4 text-primary" /> Proxima auditoria</div>
          <div className="text-lg font-semibold text-slate-800">Sin programar</div>
        </Card>
        <Card className="p-5 rounded-2xl shadow-soft">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2"><Award className="h-4 w-4 text-primary" /> Resultado</div>
          <div className="text-lg font-semibold text-slate-800">-</div>
        </Card>
        <Card className="p-5 rounded-2xl shadow-soft">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2"><FileText className="h-4 w-4 text-primary" /> Observaciones</div>
          <div className="text-lg font-semibold text-slate-800">0</div>
        </Card>
      </div>

      <Card className="p-5 rounded-2xl shadow-soft">
        <div className="flex items-center gap-2 text-slate-700 mb-3"><History className="h-4 w-4 text-primary" /> <span className="font-medium">Historico</span></div>
        <div className="py-10 text-center text-slate-400 text-sm">Aun no hay auditorias registradas para esta sede.</div>
      </Card>
    </div>
  );
}

export default Auditorias;
