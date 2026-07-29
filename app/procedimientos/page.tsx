"use client";

import PanelRecurso, { type CampoPanel, type MetricaPanel } from "@/components/operaciones/sedes/panel-recurso";

const CAMPOS: CampoPanel[] = [
  { clave: "Codigo", titulo: "Codigo" },
  { clave: "Nombre", titulo: "Procedimiento", requerido: true },
  { clave: "Area", titulo: "Area", tipo: "select", opciones: ["Operaciones", "Finanzas", "Calidad", "RRHH", "Compras"] },
  { clave: "Version", titulo: "Version" },
  { clave: "Responsable", titulo: "Responsable" },
  { clave: "Estado", titulo: "Estado", tipo: "select", opciones: ["Borrador", "Vigente", "En revision", "Obsoleto"], badge: true },
  { clave: "Descripcion", titulo: "Alcance", tipo: "textarea", enTabla: false },
];

const METRICAS: MetricaPanel[] = [
  { titulo: "Procedimientos", calcular: (items) => String(items.length) },
  {
    titulo: "Vigentes",
    calcular: (items) => String(items.filter((i) => String(i.Estado ?? "") === "Vigente").length),
  },
  {
    titulo: "En revision",
    calcular: (items) => String(items.filter((i) => String(i.Estado ?? "") === "En revision").length),
  },
];

export default function ProcedimientosPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Procedimientos</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Paso a paso de cada operacion de la compania.
        </p>
      </div>
      <PanelRecurso
        recurso="procedimientos"
        titulo="Listado de procedimientos"
        descripcion="Crear, editar, consultar y dar de baja procedimientos."
        etiquetaNuevo="Nuevo procedimiento"
        vacioMensaje="Aun no hay procedimientos registrados."
        campos={CAMPOS}
        metricas={METRICAS}
      />
    </div>
  );
}
