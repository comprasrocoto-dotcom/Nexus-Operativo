"use client";

import PanelRecurso, { type CampoPanel, type MetricaPanel } from "@/components/operaciones/sedes/panel-recurso";
import type { ModuloSedeProps } from "@/lib/sede-modulos";

const CAMPOS: CampoPanel[] = [
  { clave: "Codigo", titulo: "Codigo" },
  { clave: "Nombre", titulo: "Nombre", requerido: true },
  { clave: "Email", titulo: "Correo" },
  { clave: "Rol", titulo: "Rol", tipo: "select", opciones: ["administrador", "supervisor", "auditor", "operador"], badge: true },
  { clave: "Estado", titulo: "Estado", tipo: "select", opciones: ["Activo", "Inactivo"], badge: true },
];

const METRICAS: MetricaPanel[] = [
  { titulo: "Miembros del equipo", calcular: (items) => String(items.length) },
  {
    titulo: "Supervisores",
    calcular: (items) => String(items.filter((i) => String(i.Rol ?? "") === "supervisor").length),
  },
  {
    titulo: "Administradores",
    calcular: (items) => String(items.filter((i) => String(i.Rol ?? "") === "administrador").length),
  },
];

export function Equipo({ sedeId }: ModuloSedeProps) {
  return (
    <PanelRecurso
      recurso="usuarios"
      sedeId={sedeId}
      titulo="Equipo de la sede"
      descripcion="Usuarios asignados a esta sede y su rol."
      etiquetaNuevo="Nuevo miembro"
      vacioMensaje="Aun no hay usuarios asignados a esta sede."
      campos={CAMPOS}
      metricas={METRICAS}
    />
  );
}

export default Equipo;
