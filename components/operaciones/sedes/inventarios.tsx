"use client";

import PanelRecurso, { type CampoPanel, type MetricaPanel } from "@/components/operaciones/sedes/panel-recurso";
import type { ModuloSedeProps } from "@/lib/sede-modulos";

const CAMPOS: CampoPanel[] = [
  { clave: "Codigo", titulo: "Codigo" },
  { clave: "Nombre", titulo: "Articulo", requerido: true },
  { clave: "Cantidad", titulo: "Cantidad", tipo: "numero" },
  { clave: "Unidad", titulo: "Unidad", tipo: "select", opciones: ["und", "kg", "lt", "bulto", "caja"] },
  { clave: "Estado", titulo: "Estado", tipo: "select", opciones: ["Disponible", "Bajo stock", "Agotado"], badge: true },
  { clave: "Responsable", titulo: "Responsable" },
];

const METRICAS: MetricaPanel[] = [
  { titulo: "Articulos registrados", calcular: (items) => String(items.length) },
  {
    titulo: "Bajo stock",
    calcular: (items) => String(items.filter((i) => String(i.Estado ?? "") === "Bajo stock").length),
  },
  {
    titulo: "Unidades totales",
    calcular: (items) => String(items.reduce((a, i) => a + (Number(i.Cantidad) || 0), 0)),
  },
];

export function Inventarios({ sedeId }: ModuloSedeProps) {
  return (
    <PanelRecurso
      recurso="inventarios"
      sedeId={sedeId}
      titulo="Inventarios de la sede"
      descripcion="Articulos e insumos controlados en esta sede."
      etiquetaNuevo="Nuevo articulo"
      vacioMensaje="Aun no hay inventarios registrados para esta sede."
      campos={CAMPOS}
      metricas={METRICAS}
    />
  );
}

export default Inventarios;
