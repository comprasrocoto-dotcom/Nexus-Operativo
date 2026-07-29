"use client";

import PanelRecurso, { type CampoPanel, type MetricaPanel } from "@/components/operaciones/sedes/panel-recurso";
import type { ModuloSedeProps } from "@/lib/sede-modulos";

const CAMPOS: CampoPanel[] = [
  { clave: "Codigo", titulo: "Codigo" },
  { clave: "Nombre", titulo: "Evidencia", requerido: true },
  { clave: "Tipo", titulo: "Tipo", tipo: "select", opciones: ["Imagen", "PDF", "Excel", "Word", "Video"], badge: true },
  { clave: "RutaDrive", titulo: "Ruta en Drive" },
  { clave: "Estado", titulo: "Estado", tipo: "select", opciones: ["Cargada", "Pendiente", "Rechazada"], badge: true },
  { clave: "Responsable", titulo: "Responsable" },
];

const METRICAS: MetricaPanel[] = [
  { titulo: "Evidencias cargadas", calcular: (items) => String(items.length) },
  {
    titulo: "Imagenes",
    calcular: (items) => String(items.filter((i) => String(i.Tipo ?? "") === "Imagen").length),
  },
  {
    titulo: "Documentos",
    calcular: (items) =>
      String(items.filter((i) => ["PDF", "Excel", "Word"].includes(String(i.Tipo ?? ""))).length),
  },
];

export function Evidencias({ sedeId }: ModuloSedeProps) {
  return (
    <PanelRecurso
      recurso="evidencias"
      sedeId={sedeId}
      titulo="Evidencias de la sede"
      descripcion="Soportes documentales y fotograficos asociados a esta sede."
      etiquetaNuevo="Nueva evidencia"
      vacioMensaje="Aun no hay evidencias registradas para esta sede."
      campos={CAMPOS}
      metricas={METRICAS}
    />
  );
}

export default Evidencias;
