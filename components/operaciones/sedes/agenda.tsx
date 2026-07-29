"use client";

import PanelRecurso, { type CampoPanel, type MetricaPanel } from "@/components/operaciones/sedes/panel-recurso";
import type { ModuloSedeProps } from "@/lib/sede-modulos";

const CAMPOS: CampoPanel[] = [
  { clave: "Fecha", titulo: "Fecha", tipo: "fecha" },
  { clave: "HoraInicio", titulo: "Inicio", tipo: "hora" },
  { clave: "HoraFin", titulo: "Fin", tipo: "hora" },
  { clave: "Nombre", titulo: "Actividad", requerido: true },
  { clave: "Tipo", titulo: "Tipo", tipo: "select", opciones: ["Operativa", "Administrativa", "Mantenimiento", "Capacitacion"], badge: true },
  { clave: "Area", titulo: "Area", tipo: "select", opciones: ["Operaciones", "Finanzas", "Calidad", "RRHH", "Compras"] },
  { clave: "Prioridad", titulo: "Prioridad", tipo: "select", opciones: ["Alta", "Media", "Baja"], badge: true },
  { clave: "Estado", titulo: "Estado", tipo: "select", opciones: ["Programada", "En curso", "Completada", "Cancelada"], badge: true },
  { clave: "Responsable", titulo: "Responsable" },
  { clave: "Codigo", titulo: "Codigo", enTabla: false },
];

const METRICAS: MetricaPanel[] = [
  { titulo: "Actividades", calcular: (items) => String(items.length) },
  {
    titulo: "Programadas",
    calcular: (items) => String(items.filter((i) => String(i.Estado ?? "") === "Programada").length),
  },
  {
    titulo: "Prioridad alta",
    calcular: (items) => String(items.filter((i) => String(i.Prioridad ?? "") === "Alta").length),
  },
  {
    titulo: "Proxima fecha",
    calcular: (items) => {
      const fechas = items.map((i) => String(i.Fecha ?? "")).filter(Boolean).sort();
      return fechas.length ? fechas[0] : "Sin programar";
    },
  },
];

export function Agenda({ sedeId }: ModuloSedeProps) {
  return (
    <PanelRecurso
      recurso="actividades"
      sedeId={sedeId}
      titulo="Agenda de la sede"
      descripcion="Actividades programadas para esta sede."
      etiquetaNuevo="Nueva actividad"
      vacioMensaje="No hay actividades programadas para esta sede."
      campos={CAMPOS}
      metricas={METRICAS}
    />
  );
}

export default Agenda;
