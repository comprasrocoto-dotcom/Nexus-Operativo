"use client";

import PanelRecurso, { type CampoPanel, type MetricaPanel } from "@/components/operaciones/sedes/panel-recurso";
import type { ModuloSedeProps } from "@/lib/sede-modulos";

const CAMPOS: CampoPanel[] = [
  { clave: "Codigo", titulo: "Codigo" },
  { clave: "Nombre", titulo: "Indicador", requerido: true },
  { clave: "Valor", titulo: "Valor", tipo: "numero" },
  { clave: "Meta", titulo: "Meta", tipo: "numero" },
  { clave: "Unidad", titulo: "Unidad", tipo: "select", opciones: ["COP", "%", "und", "min", "hrs"] },
  { clave: "Estado", titulo: "Estado", tipo: "select", opciones: ["En seguimiento", "Cumplido", "En riesgo"], badge: true },
];

const METRICAS: MetricaPanel[] = [
  { titulo: "Indicadores activos", calcular: (items) => String(items.length) },
  {
    titulo: "Cumplimiento promedio",
    calcular: (items) => {
      const validos = items.filter((i) => Number(i.Meta) > 0);
      if (!validos.length) return "-";
      const suma = validos.reduce(
        (a, i) => a + (Number(i.Valor) || 0) / (Number(i.Meta) || 1),
        0,
      );
      return Math.round((suma / validos.length) * 100) + "%";
    },
  },
  {
    titulo: "En riesgo",
    calcular: (items) => String(items.filter((i) => String(i.Estado ?? "") === "En riesgo").length),
  },
];

export function Indicadores({ sedeId }: ModuloSedeProps) {
  return (
    <PanelRecurso
      recurso="indicadores"
      sedeId={sedeId}
      titulo="Indicadores de la sede"
      descripcion="KPIs operativos medidos en esta sede."
      etiquetaNuevo="Nuevo indicador"
      vacioMensaje="Aun no hay indicadores registrados para esta sede."
      campos={CAMPOS}
      metricas={METRICAS}
    />
  );
}

export default Indicadores;
