"use client";

import { Card, Badge, Button } from "@/components/ui";
import { useActividadesSede } from "@/hooks/useActividadesSede";
import { Calendar, Clock, Plus, ExternalLink } from "lucide-react";

interface AgendaProps {
  sedeId: string;
  onVerAgenda?: () => void;
}

/**
 * Pestana Agenda. Muestra SOLO las actividades de esta sede.
 * Reutiliza el mismo modelo de actividades (no crea logica duplicada):
 * el hook useActividadesSede filtra la Agenda Operativa por SedeID.
 */
export function Agenda({ sedeId, onVerAgenda }: AgendaProps) {
  const { actividades, loading, error } = useActividadesSede(sedeId);

  return (
    <Card className="p-5 rounded-2xl shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-700">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="font-medium">Agenda de la sede</span>
        </div>
        {onVerAgenda && (
          <Button variant="secondary" onClick={onVerAgenda} className="gap-1">
            <ExternalLink className="h-4 w-4" /> Ver Agenda
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-3 rounded-xl bg-danger/10 text-danger text-sm px-3 py-2">{error}</div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[0,1,2].map((i) => <div key={i} className="h-14 rounded-xl bg-slate-100 animate-pulse" />)}
        </div>
      ) : actividades.length === 0 ? (
        <div className="py-10 text-center text-slate-400 text-sm">No hay actividades programadas para esta sede.</div>
      ) : (
        <ul className="space-y-2">
          {actividades.map((a) => (
            <li key={a.ID} className="flex items-start justify-between bg-slate-50 rounded-xl px-4 py-3">
              <div>
                <div className="text-sm font-medium text-slate-800">{a.Nombre}</div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{a.Fecha ?? "-"}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{a.HoraInicio ?? "--"} - {a.HoraFin ?? "--"}</span>
                  {a.Area && <Badge>{a.Area}</Badge>}
                </div>
              </div>
              {a.Prioridad && <Badge>{a.Prioridad}</Badge>}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default Agenda;
