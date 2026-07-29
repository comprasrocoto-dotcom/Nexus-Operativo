"use client";

import PanelRecurso, { type CampoPanel, type MetricaPanel } from "@/components/operaciones/sedes/panel-recurso";

const CAMPOS: CampoPanel[] = [
  { clave: "Codigo", titulo: "Codigo" },
  { clave: "Nombre", titulo: "Manual", requerido: true },
  { clave: "Area", titulo: "Area", tipo: "select", opciones: ["Operaciones", "Finanzas", "Calidad", "RRHH", "Compras"] },
  { clave: "Version", titulo: "Version" },
  { clave: "Responsable", titulo: "Responsable" },
  { clave: "Estado", titulo: "Estado", tipo: "select", opciones: ["Borrador", "Publicado", "Obsoleto"], badge: true },
  { clave: "URL", titulo: "Enlace", enTabla: false },
];

const METRICAS: MetricaPanel[] = [
  { titulo: "Manuales", calcular: (items) => String(items.length) },
  {
    titulo: "Publicados",
    calcular: (items) => String(items.filter((i) => String(i.Estado ?? "") === "Publicado").length),
  },
  {
    titulo: "Borradores",
    calcular: (items) => String(items.filter((i) => String(i.Estado ?? "") === "Borrador").length),
  },
];

export default function ManualesPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Manuales</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manuales operativos por area, administrables desde la web.
        </p>
      </div>
      <PanelRecurso
        recurso="manuales"
        titulo="Listado de manuales"
        descripcion="Crear, editar, consultar y dar de baja manuales."
        etiquetaNuevo="Nuevo manual"
        vacioMensaje="Aun no hay manuales registrados."
        campos={CAMPOS}
        metricas={METRICAS}
      />
    </div>
  );
}
