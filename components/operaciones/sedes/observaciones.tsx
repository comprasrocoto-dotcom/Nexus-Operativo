"use client";

import PanelRecurso, { type CampoPanel, type MetricaPanel } from "@/components/operaciones/sedes/panel-recurso";
import type { ModuloSedeProps } from "@/lib/sede-modulos";

const CAMPOS: CampoPanel[] = [
  { clave: "Fecha", titulo: "Fecha", tipo: "fecha" },
  { clave: "Nombre", titulo: "Asunto", requerido: true },
  { clave: "Descripcion", titulo: "Observacion", tipo: "textarea" },
  { clave: "Responsable", titulo: "Registrada por" },
  { clave: "Estado", titulo: "Estado", tipo: "select", opciones: ["Abierta", "En gestion", "Cerrada"], badge: true },
];

const METRICAS: MetricaPanel[] = [
  { titulo: "Observaciones", calcular: (items) => String(items.length) },
  {
    titulo: "Abiertas",
    calcular: (items) => String(items.filter((i) => String(i.Estado ?? "") === "Abierta").length),
  },
  {
    titulo: "Cerradas",
    calcular: (items) => String(items.filter((i) => String(i.Estado ?? "") === "Cerrada").length),
  },
];

export function Observaciones({ sedeId }: ModuloSedeProps) {
  return (
    <PanelRecurso
      recurso="observaciones"
      sedeId={sedeId}
      titulo="Observaciones de la sede"
      descripcion="Notas internas y hallazgos registrados sobre esta sede."
      etiquetaNuevo="Nueva observacion"
      vacioMensaje="Aun no hay observaciones registradas para esta sede."
      campos={CAMPOS}
      metricas={METRICAS}
    />
  );
}

export default Observaciones;
