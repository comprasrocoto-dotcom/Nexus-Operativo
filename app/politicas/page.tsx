"use client";

import PanelRecurso, { type CampoPanel, type MetricaPanel } from "@/components/operaciones/sedes/panel-recurso";

const CAMPOS: CampoPanel[] = [
  { clave: "Codigo", titulo: "Codigo" },
  { clave: "Nombre", titulo: "Politica", requerido: true },
  { clave: "Categoria", titulo: "Categoria", tipo: "select", opciones: ["Calidad", "SST", "Operaciones", "Talento humano", "Financiera"] },
  { clave: "Version", titulo: "Version" },
  { clave: "Responsable", titulo: "Responsable" },
  { clave: "Estado", titulo: "Estado", tipo: "select", opciones: ["Borrador", "En revision", "Publicada", "Obsoleta"], badge: true },
  { clave: "Descripcion", titulo: "Objetivo", tipo: "textarea", enTabla: false },
];

const METRICAS: MetricaPanel[] = [
  { titulo: "Politicas", calcular: (items) => String(items.length) },
  {
    titulo: "Publicadas",
    calcular: (items) => String(items.filter((i) => String(i.Estado ?? "") === "Publicada").length),
  },
  {
    titulo: "En revision",
    calcular: (items) => String(items.filter((i) => String(i.Estado ?? "") === "En revision").length),
  },
];

export default function PoliticasPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Politicas</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Politicas corporativas del Grupo DASHI, administrables desde la web.
        </p>
      </div>
      <PanelRecurso
        recurso="politicas"
        titulo="Listado de politicas"
        descripcion="Crear, editar, consultar y dar de baja politicas."
        etiquetaNuevo="Nueva politica"
        vacioMensaje="Aun no hay politicas registradas."
        campos={CAMPOS}
        metricas={METRICAS}
      />
    </div>
  );
}
