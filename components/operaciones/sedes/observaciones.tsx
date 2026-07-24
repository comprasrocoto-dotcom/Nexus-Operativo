"use client";

import { useState } from "react";
import { Card, Button } from "@/components/ui";
import { MessageSquare, Send, User, CalendarClock } from "lucide-react";

export interface Observacion {
  id: string;
  fecha: string;
  usuario: string;
  comentario: string;
}

interface ObservacionesProps {
  sedeId: string;
  observaciones?: Observacion[];
  onRegistrar?: (comentario: string) => Promise<void> | void;
}

/**
 * Pestana Observaciones. Registra observaciones internas de la sede.
 * Guarda fecha, usuario y comentario, y mantiene el historial.
 */
export function Observaciones({ observaciones = [], onRegistrar }: ObservacionesProps) {
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function registrar() {
    if (!texto.trim() || !onRegistrar) return;
    setEnviando(true);
    try {
      await onRegistrar(texto.trim());
      setTexto("");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-5 rounded-2xl shadow-soft">
        <div className="flex items-center gap-2 text-slate-700 mb-3">
          <MessageSquare className="h-4 w-4 text-primary" /> <span className="font-medium">Nueva observacion</span>
        </div>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={3}
          placeholder="Escribe una observacion interna sobre esta sede..."
          className="w-full text-sm rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <div className="flex justify-end mt-2">
          <Button onClick={registrar} disabled={enviando || !texto.trim()} className="gap-1">
            <Send className="h-4 w-4" /> {enviando ? "Registrando..." : "Registrar"}
          </Button>
        </div>
      </Card>

      <Card className="p-5 rounded-2xl shadow-soft">
        <div className="flex items-center gap-2 text-slate-700 mb-3">
          <CalendarClock className="h-4 w-4 text-primary" /> <span className="font-medium">Historial</span>
        </div>
        {observaciones.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-sm">Aun no hay observaciones registradas.</div>
        ) : (
          <ul className="space-y-3">
            {observaciones.map((o) => (
              <li key={o.id} className="bg-slate-50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-1">
                  <span className="inline-flex items-center gap-1"><User className="h-3 w-3" />{o.usuario}</span>
                  <span className="inline-flex items-center gap-1"><CalendarClock className="h-3 w-3" />{o.fecha}</span>
                </div>
                <div className="text-sm text-slate-700">{o.comentario}</div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

export default Observaciones;
