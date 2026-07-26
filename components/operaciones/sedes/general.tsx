"use client";

import { useEffect, useState } from "react";
import { Card, Button, Badge, Input } from "@/components/ui";
import { useSede } from "@/hooks/useSede";
import type { Sede, SedeInput } from "@/lib/operaciones";
import type { ModuloSedeProps } from "@/lib/sede-modulos";
import { Save, X, Pencil } from "lucide-react";

// Traduce el formulario (claves de Sede, capitalizadas) al contrato SedeInput (camelCase)
// que espera el backend GAS. Solo incluye los campos definidos para no pisar datos.
function aSedeInput(form: Partial<Sede>): Partial<SedeInput> {
  const input: Partial<SedeInput> = {};
  if (form.Nombre !== undefined) input.nombre = form.Nombre;
  if (form.Codigo !== undefined) input.codigo = form.Codigo;
  if (form.Descripcion !== undefined) input.descripcion = form.Descripcion;
  if (form.Estado !== undefined) input.estado = form.Estado;
  if (form.Responsable !== undefined) input.responsable = form.Responsable;
  if (form.Activo !== undefined) input.activo = form.Activo;
  if (form.Direccion !== undefined) input.direccion = form.Direccion;
  if (form.Telefono !== undefined) input.telefono = form.Telefono;
  if (form.Administrador !== undefined) input.administrador = form.Administrador;
  return input;
}

export function General({ sedeId }: ModuloSedeProps) {
  const { sede, cargando, actualizar } = useSede(sedeId);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState<Partial<Sede>>({});

  useEffect(() => { if (sede) setForm(sede); }, [sede]);

  function set(campo: keyof Sede, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function guardar() {
    setGuardando(true);
    try {
      await actualizar(aSedeInput(form));
      setEditando(false);
    } finally {
      setGuardando(false);
    }
  }

  if (cargando && !sede) {
    return <Card className="p-6 rounded-2xl shadow-soft"><div className="h-40 rounded-xl bg-slate-100 animate-pulse" /></Card>;
  }
  if (!sede) {
    return <Card className="p-6 rounded-2xl shadow-soft"><div className="py-10 text-center text-slate-400 text-sm">No se encontro la sede.</div></Card>;
  }

  const campos: { clave: keyof Sede; etiqueta: string }[] = [
    { clave: "Nombre", etiqueta: "Nombre" },
    { clave: "Codigo", etiqueta: "Codigo" },
    { clave: "Responsable", etiqueta: "Responsable" },
    { clave: "Administrador", etiqueta: "Administrador" },
    { clave: "Direccion", etiqueta: "Direccion" },
    { clave: "Telefono", etiqueta: "Telefono" },
    { clave: "Descripcion", etiqueta: "Descripcion" },
  ];

  return (
    <Card className="p-6 rounded-2xl shadow-soft">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Informacion General</h3>
          <p className="text-sm text-slate-500">Datos base del centro de informacion.</p>
        </div>
        {!editando ? (
          <Button variant="secondary" onClick={() => setEditando(true)} className="gap-1">
            <Pencil className="h-4 w-4" /> Editar
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => { setForm(sede); setEditando(false); }} className="gap-1">
              <X className="h-4 w-4" /> Cancelar
            </Button>
            <Button onClick={guardar} disabled={guardando} className="gap-1">
              <Save className="h-4 w-4" /> {guardando ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campos.map((c) => (
          <div key={c.clave}>
            <label className="block text-xs font-medium text-slate-500 mb-1">{c.etiqueta}</label>
            {editando ? (
              <Input value={String(form[c.clave] ?? "")} onChange={(e) => set(c.clave, e.target.value)} />
            ) : (
              <div className="text-sm text-slate-800 py-2">{String(sede[c.clave] ?? "-")}</div>
            )}
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Estado</label>
          <div className="py-1"><Badge>{sede.Estado ?? "-"}</Badge></div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Fecha creacion</label>
          <div className="text-sm text-slate-800 py-2">{sede.FechaCreacion ?? "-"}</div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Ultima actualizacion</label>
          <div className="text-sm text-slate-800 py-2">{sede.FechaModificacion ?? "-"}</div>
        </div>
      </div>
    </Card>
  );
}

export default General;
