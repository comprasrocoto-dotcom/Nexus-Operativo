"use client";

// sedes-tabla.tsx — Tabla de sedes del Centro de Operaciones. Solo presentacion.
// La fecha se formatea con fechaCorta (sin new Date) para no desfasar la zona horaria.

import { CalendarDays, Pencil, Power, RotateCcw, User } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import type { Sede } from "@/lib/operaciones";
import { fechaCorta } from "./campo-tipos";

export type SedeFila = Sede & { totalActividades?: number; creada?: string };

export function sedeActiva(s: Sede): boolean {
  return s.Activo !== false && String(s.Estado).toLowerCase() !== "inactiva";
}

export interface SedesTablaProps {
  sedes: SedeFila[];
  onEditar: (s: SedeFila) => void;
  onAlternar: (s: SedeFila) => void;
}

const COLUMNAS = ["Sede", "Responsable", "Actividades", "Estado", "Creada"];

export function SedesTabla({ sedes, onEditar, onAlternar }: SedesTablaProps) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500 dark:bg-slate-800/50">
            <tr>
              {COLUMNAS.map((c) => (
                <th key={c} className="px-4 py-3 font-medium">
                  {c}
                </th>
              ))}
              <th className="px-4 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sedes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  No hay sedes que coincidan.
                </td>
              </tr>
            )}
            {sedes.map((s) => {
              const activa = sedeActiva(s);
              return (
                <tr key={s.ID} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900 dark:text-white">{s.Nombre}</div>
                    <div className="text-xs text-slate-400">{s.Codigo}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      {s.Responsable || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                      {s.totalActividades ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={activa ? "success" : "muted"}>
                      {activa ? "Activa" : "Inactiva"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {s.creada ? fechaCorta(s.creada) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditar(s)}
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onAlternar(s)}
                        title={activa ? "Desactivar" : "Reactivar"}
                      >
                        {activa ? (
                          <Power className="h-4 w-4 text-danger" />
                        ) : (
                          <RotateCcw className="h-4 w-4 text-success" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default SedesTabla;
