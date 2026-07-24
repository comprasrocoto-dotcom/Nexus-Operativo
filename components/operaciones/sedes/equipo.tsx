"use client";

import { Card, Badge, Button } from "@/components/ui";
import { UserPlus, X, Users, Shield, ClipboardCheck, Wrench } from "lucide-react";

interface MiembroEquipo {
  id: string;
  nombre: string;
  rol: "Administrador" | "Supervisor" | "Auditor" | "Auxiliar";
}

interface EquipoProps {
  sedeId: string;
  miembros?: MiembroEquipo[];
  onAgregar?: (rol: MiembroEquipo["rol"]) => void;
  onQuitar?: (id: string) => void;
}

const GRUPOS: { rol: MiembroEquipo["rol"]; titulo: string; icono: React.ElementType }[] = [
  { rol: "Administrador", titulo: "Administradores", icono: Shield },
  { rol: "Supervisor", titulo: "Supervisores", icono: Users },
  { rol: "Auditor", titulo: "Auditores", icono: ClipboardCheck },
  { rol: "Auxiliar", titulo: "Auxiliares", icono: Wrench },
];

/** Pestana Equipo. Se conectara al modulo Usuarios via SedeID. */
export function Equipo({ miembros = [], onAgregar, onQuitar }: EquipoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {GRUPOS.map((g) => {
        const Icono = g.icono;
        const lista = miembros.filter((m) => m.rol === g.rol);
        return (
          <Card key={g.rol} className="p-5 rounded-2xl shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-slate-700">
                <Icono className="h-4 w-4 text-primary" />
                <span className="font-medium">{g.titulo}</span>
                <Badge>{lista.length}</Badge>
              </div>
              {onAgregar && (
                <button onClick={() => onAgregar(g.rol)} className="p-1.5 rounded-lg hover:bg-primary/10 text-primary" title="Agregar">
                  <UserPlus className="h-4 w-4" />
                </button>
              )}
            </div>
            {lista.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">Sin asignaciones.</p>
            ) : (
              <ul className="space-y-1.5">
                {lista.map((m) => (
                  <li key={m.id} className="flex items-center justify-between text-sm bg-slate-50 rounded-xl px-3 py-2">
                    <span className="text-slate-700">{m.nombre}</span>
                    {onQuitar && (
                      <button onClick={() => onQuitar(m.id)} className="p-1 rounded-lg hover:bg-danger/10 text-danger" title="Quitar">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        );
      })}
    </div>
  );
}

export default Equipo;
