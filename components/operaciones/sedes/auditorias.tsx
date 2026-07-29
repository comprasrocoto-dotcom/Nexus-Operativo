"use client";

import PanelRecurso, { type CampoPanel, type MetricaPanel } from "@/components/operaciones/sedes/panel-recurso";
import type { ModuloSedeProps } from "@/lib/sede-modulos";

const CAMPOS: CampoPanel[] = [
  { clave: "Codigo", titulo: "Codigo" },
  { clave: "Nombre", titulo: "Auditoria", requerido: true },
  { clave: "Responsable", titulo: "Auditor" },
  { clave: "Fecha", titulo: "Fecha", tipo: "fecha" },
  { clave: "Estado", titulo: "Estado", tipo: "select", opciones: ["Pendiente", "En proceso", "Aprobada", "Rechazada"], badge: true },
  { clave: "Resultado", titulo: "Resultado" },
];

const METRICAS: MetricaPanel[] = [
  { titulo: "Auditorias registradas", calcular: (items) => String(items.length) },
  {
    titulo: "Aprobadas",
    calcular: (items) => String(items.filter((i) => String(i.Estado ?? "") === "Aprobada").length),
  },
  {
    titulo: "Pendientes",
    calcular: (items) => String(items.filter((i) => String(i.Estado ?? "") === "Pendiente").length),
  },
  {
    titulo: "Ultima auditoria",
    calcular: (items) => {
      const fechas = items.map((i) => String(i.Fecha ?? "")).filter(Boolean).sort();
      return fechas.length ? fechas[fechas.length - 1] : "Sin registros";
    },
  },
];

export function Auditorias({ sedeId }: ModuloSedeProps) {
  return (
    <PanelRecurso
      recurso="auditorias"
      sedeId={sedeId}
      titulo="Auditorias de la sede"
      descripcion="Auditorias internas y externas realizadas en esta sede."
      etiquetaNuevo="Nueva auditoria"
      vacioMensaje="Aun no hay auditorias registradas para esta sede."
      campos={CAMPOS}
      metricas={METRICAS}
    />
  );
}

export default Auditorias;
