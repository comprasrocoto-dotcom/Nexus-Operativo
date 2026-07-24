// lib/sede-modulos.ts — Registro data-driven de los módulos (pestañas) de la Ficha de Sede.
// Cada módulo del ERP se declara aquí una sola vez. La página de detalle NO conoce
// los módulos: solo itera este registro. Para añadir un módulo futuro basta con:
//   1) crear su componente en components/operaciones/sedes/<clave>.tsx
//   2) registrar una entrada aquí (o activarlo desde Op_Modulos en el backend).
//
// Este registro local es el FALLBACK: si Op_Modulos existe en el backend, se puede
// fusionar/override por clave (ver hooks/useModulos.ts).

import type { ComponentType } from "react";
import type { ClaveModulo } from "@/lib/eventos";

// Props que recibe todo componente de módulo de la ficha. Contrato único y estable:
// así cualquier módulo futuro encaja sin cambiar la arquitectura.
export type ModuloSedeProps = {
  sedeId: string;
  // Datos base de la sede (evita refetch en cada pestaña).
  sedeNombre?: string;
};

export type DefinicionModulo = {
  clave: ClaveModulo | "general" | "actividad";
  etiqueta: string;
  icono: string;      // nombre de icono lucide-react
  emoji?: string;     // acento visual opcional en el tab
  descripcion?: string;
  // Carga diferida del componente (code-splitting por pestaña).
  cargar: () => Promise<{ default: ComponentType<ModuloSedeProps> }>;
  // Roles con acceso (placeholder; se sincroniza con Op_Modulos.Roles / matriz de permisos).
  roles?: string[];
  // Permite ocultar sin borrar (se puede sobreescribir desde Op_Modulos.Activo).
  activo?: boolean;
  orden: number;
};

// Orden y contenido de las pestañas de la Ficha de Sede.
export const MODULOS_SEDE: DefinicionModulo[] = [
  { clave: "general",       etiqueta: "Información General", emoji: "📍", icono: "Info",          orden: 10, activo: true, cargar: () => import("@/components/operaciones/sedes/general") },
  { clave: "equipo",        etiqueta: "Equipo",             emoji: "👥", icono: "Users",         orden: 20, activo: true, cargar: () => import("@/components/operaciones/sedes/equipo") },
  { clave: "agenda",        etiqueta: "Agenda",             emoji: "📅", icono: "CalendarDays",  orden: 30, activo: true, cargar: () => import("@/components/operaciones/sedes/agenda") },
  { clave: "inventarios",   etiqueta: "Inventarios",        emoji: "📦", icono: "Package",       orden: 40, activo: true, cargar: () => import("@/components/operaciones/sedes/inventarios") },
  { clave: "auditorias",    etiqueta: "Auditorías",         emoji: "✅", icono: "ClipboardCheck", orden: 50, activo: true, cargar: () => import("@/components/operaciones/sedes/auditorias") },
  { clave: "compras",       etiqueta: "Compras",            emoji: "💰", icono: "ShoppingCart",  orden: 60, activo: true, cargar: () => import("@/components/operaciones/sedes/compras") },
  { clave: "indicadores",   etiqueta: "Indicadores",        emoji: "📈", icono: "BarChart3",     orden: 70, activo: true, cargar: () => import("@/components/operaciones/sedes/indicadores") },
  { clave: "evidencias",    etiqueta: "Evidencias",         emoji: "📁", icono: "FolderOpen",    orden: 80, activo: true, cargar: () => import("@/components/operaciones/sedes/evidencias") },
  { clave: "observaciones", etiqueta: "Observaciones",      emoji: "📝", icono: "MessageSquare", orden: 90, activo: true, cargar: () => import("@/components/operaciones/sedes/observaciones") },
  { clave: "actividad",     etiqueta: "Actividad",          emoji: "📜", icono: "History",       orden: 95, activo: true, cargar: () => import("@/components/operaciones/sedes/actividad") },
  { clave: "configuracion", etiqueta: "Configuración",      emoji: "⚙️", icono: "Settings",      orden: 100, activo: true, cargar: () => import("@/components/operaciones/sedes/configuracion") },
];

export function modulosVisibles(): DefinicionModulo[] {
  return MODULOS_SEDE.filter((m) => m.activo !== false).sort((a, b) => a.orden - b.orden);
}

export function moduloPorClave(clave: string): DefinicionModulo | undefined {
  return MODULOS_SEDE.find((m) => m.clave === clave);
}

// Clave por defecto al abrir la ficha.
export const MODULO_INICIAL = "general";
