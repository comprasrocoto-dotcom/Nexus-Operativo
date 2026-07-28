"use client";

import PanelRecurso, { type CampoPanel, type MetricaPanel } from "@/components/operaciones/sedes/panel-recurso";
import type { ModuloSedeProps } from "@/lib/sede-modulos";

const CAMPOS: CampoPanel[] = [
  { clave: "Codigo", titulo: "Orden" },
  { clave: "Nombre", titulo: "Concepto", requerido: true },
  { clave: "Proveedor", titulo: "Proveedor" },
  { clave: "Monto", titulo: "Monto", tipo: "numero" },
  { clave: "Fecha", titulo: "Fecha", tipo: "fecha" },
  { clave: "Estado", titulo: "Estado", tipo: "select", opciones: ["Pendiente", "Aprobada", "Recibida", "Anulada"], badge: true },
];

const fmt = (n: number) => "$ " + n.toLocaleString("es-CO");

const METRICAS: MetricaPanel[] = [
  {
    titulo: "Gasto acumulado",
    calcular: (items) => fmt(items.reduce((a, i) => a + (Number(i.Monto) || 0), 0)),
  },
  {
    titulo: "Ordenes pendientes",
    calcular: (items) => String(items.filter((i) => String(i.Estado ?? "") === "Pendiente").length),
  },
  { titulo: "Ordenes totales", calcular: (items) => String(items.length) },
];

export function Compras({ sedeId }: ModuloSedeProps) {
  return (
    <PanelRecurso
      recurso="compras"
      sedeId={sedeId}
      titulo="Compras de la sede"
      descripcion="Ordenes de compra asociadas a esta sede."
      etiquetaNuevo="Nueva compra"
      vacioMensaje="Aun no hay compras registradas para esta sede."
      campos={CAMPOS}
      metricas={METRICAS}
    />
  );
}

export default Compras;
