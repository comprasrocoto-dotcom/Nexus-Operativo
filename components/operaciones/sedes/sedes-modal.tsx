"use client";

// sedes-modal.tsx — Formulario modal de creacion y edicion de sedes.
// Presentacional: recibe estado y callbacks. Sin acceso a datos ni backend.

import { X } from "lucide-react";
import { Button, Card, Input } from "@/components/ui";
import type { SedeInput } from "@/lib/operaciones";

export type FormSede = SedeInput & { id?: string };

export interface SedesModalProps {
  form: FormSede;
  error: string | null;
  cargando: boolean;
  onCambio: (parche: Partial<FormSede>) => void;
  onCerrar: () => void;
  onGuardar: () => void;
}

interface CampoSede {
  clave: keyof FormSede;
  etiqueta: string;
  ancho?: boolean;
  placeholder?: string;
}

const CAMPOS: CampoSede[] = [
  { clave: "nombre", etiqueta: "Nombre *", ancho: true, placeholder: "Nombre de la sede" },
  { clave: "codigo", etiqueta: "Codigo", placeholder: "Se genera si lo dejas vacio" },
  { clave: "telefono", etiqueta: "Telefono" },
  { clave: "responsable", etiqueta: "Responsable" },
  { clave: "administrador", etiqueta: "Administrador" },
  { clave: "direccion", etiqueta: "Direccion", ancho: true },
  { clave: "descripcion", etiqueta: "Descripcion", ancho: true },
];

export function SedesModal(props: SedesModalProps) {
  const { form, error, cargando, onCambio, onCerrar, onGuardar } = props;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <Card className="max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {form.id ? "Editar sede" : "Nueva sede"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCerrar}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CAMPOS.map((c) => (
            <label
              key={String(c.clave)}
              className={
                c.ancho
                  ? "flex flex-col gap-1 text-sm sm:col-span-2"
                  : "flex flex-col gap-1 text-sm"
              }
            >
              <span className="text-slate-600 dark:text-slate-300">{c.etiqueta}</span>
              <Input
                value={String(form[c.clave] ?? "")}
                placeholder={c.placeholder}
                onChange={(e) =>
                  onCambio({ [c.clave]: e.target.value } as Partial<FormSede>)
                }
              />
            </label>
          ))}
        </div>

        {error && <p className="mt-3 text-sm text-danger">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onCerrar} disabled={cargando}>
            Cancelar
          </Button>
          <Button onClick={onGuardar} disabled={cargando}>
            {cargando ? "Guardando..." : form.id ? "Guardar cambios" : "Crear sede"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default SedesModal;
