// lib/eventos.ts — Catálogo central de tipos de evento del ERP.
// Fuente única de verdad para el Timeline genérico, la bitácora, las notificaciones
// y la trazabilidad. Alimentado por la tabla Op_Eventos (ver lib/operaciones.ts).
//
// Cómo crece: para soportar un módulo nuevo (p. ej. Proveedores), se añaden aquí sus
// TipoEvento y su metadata visual. NINGÚN componente necesita cambiar: el Timeline
// resuelve icono/color/etiqueta desde este catálogo.

import type { NivelEvento } from "@/lib/operaciones";

// Claves de módulo del ERP (deben coincidir con Modulo.Clave de Op_Modulos).
export type ClaveModulo =
  | "sedes"
  | "agenda"
  | "equipo"
  | "inventarios"
  | "auditorias"
  | "compras"
  | "costos"
  | "evidencias"
  | "indicadores"
  | "documentos"
  | "politicas"
  | "procedimientos"
  | "manuales"
  | "usuarios"
  | "configuracion";

// Tipos de evento canónicos. Se guardan como string en Op_Eventos.TipoEvento.
export type TipoEvento =
  | "SEDE_CREADA" | "SEDE_ACTUALIZADA" | "SEDE_DESACTIVADA" | "SEDE_REACTIVADA"
  | "RESPONSABLE_CAMBIADO"
  | "ACTIVIDAD_PROGRAMADA" | "ACTIVIDAD_ACTUALIZADA" | "ACTIVIDAD_ELIMINADA" | "ACTIVIDAD_COMPLETADA"
  | "INVENTARIO_CREADO" | "INVENTARIO_REALIZADO"
  | "AUDITORIA_CREADA" | "AUDITORIA_FINALIZADA"
  | "COMPRA_REGISTRADA"
  | "EVIDENCIA_CARGADA" | "EVIDENCIA_ELIMINADA"
  | "DOCUMENTO_PUBLICADO"
  | "POLITICA_MODIFICADA"
  | "PROCEDIMIENTO_MODIFICADO"
  | "MANUAL_PUBLICADO"
  | "USUARIO_CREADO" | "USUARIO_ACTUALIZADO" | "USUARIO_ELIMINADO"
  | "OBSERVACION_REGISTRADA"
  | "CONFIGURACION_ACTUALIZADA"
  | "GENERICO";

export type MetaEvento = {
  etiqueta: string;
  icono: string; // nombre de icono lucide-react
  color: string; // clave de color semántica (ver colorClasses)
  modulo: ClaveModulo;
  nivel: NivelEvento;
};

// Metadata visual por tipo de evento.
export const CATALOGO_EVENTOS: Record<TipoEvento, MetaEvento> = {
  SEDE_CREADA:            { etiqueta: "Sede creada",             icono: "Building2",    color: "success",   modulo: "sedes",          nivel: "exito" },
  SEDE_ACTUALIZADA:       { etiqueta: "Sede actualizada",        icono: "Pencil",       color: "info",      modulo: "sedes",          nivel: "info" },
  SEDE_DESACTIVADA:       { etiqueta: "Sede desactivada",        icono: "Power",        color: "danger",    modulo: "sedes",          nivel: "advertencia" },
  SEDE_REACTIVADA:        { etiqueta: "Sede reactivada",         icono: "RotateCcw",    color: "success",   modulo: "sedes",          nivel: "exito" },
  RESPONSABLE_CAMBIADO:   { etiqueta: "Responsable cambiado",    icono: "UserCog",      color: "info",      modulo: "equipo",         nivel: "info" },
  ACTIVIDAD_PROGRAMADA:   { etiqueta: "Actividad programada",    icono: "CalendarPlus", color: "info",      modulo: "agenda",         nivel: "info" },
  ACTIVIDAD_ACTUALIZADA:  { etiqueta: "Actividad actualizada",   icono: "CalendarClock",color: "info",      modulo: "agenda",         nivel: "info" },
  ACTIVIDAD_ELIMINADA:    { etiqueta: "Actividad eliminada",     icono: "CalendarX",    color: "danger",    modulo: "agenda",         nivel: "advertencia" },
  ACTIVIDAD_COMPLETADA:   { etiqueta: "Actividad completada",    icono: "CalendarCheck",color: "success",   modulo: "agenda",         nivel: "exito" },
  INVENTARIO_CREADO:      { etiqueta: "Inventario creado",       icono: "Package",      color: "info",      modulo: "inventarios",    nivel: "info" },
  INVENTARIO_REALIZADO:   { etiqueta: "Inventario realizado",    icono: "PackageCheck", color: "success",   modulo: "inventarios",    nivel: "exito" },
  AUDITORIA_CREADA:       { etiqueta: "Auditoría creada",        icono: "ClipboardList",color: "info",      modulo: "auditorias",     nivel: "info" },
  AUDITORIA_FINALIZADA:   { etiqueta: "Auditoría finalizada",    icono: "ClipboardCheck",color: "success",  modulo: "auditorias",     nivel: "exito" },
  COMPRA_REGISTRADA:      { etiqueta: "Compra registrada",       icono: "ShoppingCart", color: "info",      modulo: "compras",        nivel: "info" },
  EVIDENCIA_CARGADA:      { etiqueta: "Evidencia cargada",       icono: "ImagePlus",    color: "info",      modulo: "evidencias",     nivel: "info" },
  EVIDENCIA_ELIMINADA:    { etiqueta: "Evidencia eliminada",     icono: "ImageOff",     color: "danger",    modulo: "evidencias",     nivel: "advertencia" },
  DOCUMENTO_PUBLICADO:    { etiqueta: "Documento publicado",     icono: "FileText",     color: "info",      modulo: "documentos",     nivel: "info" },
  POLITICA_MODIFICADA:    { etiqueta: "Política modificada",     icono: "ScrollText",   color: "warning",   modulo: "politicas",      nivel: "advertencia" },
  PROCEDIMIENTO_MODIFICADO:{ etiqueta: "Procedimiento modificado",icono: "ListChecks",  color: "warning",   modulo: "procedimientos", nivel: "advertencia" },
  MANUAL_PUBLICADO:       { etiqueta: "Manual publicado",        icono: "BookOpen",     color: "info",      modulo: "manuales",       nivel: "info" },
  USUARIO_CREADO:         { etiqueta: "Usuario creado",          icono: "UserPlus",     color: "success",   modulo: "usuarios",       nivel: "exito" },
  USUARIO_ACTUALIZADO:    { etiqueta: "Usuario actualizado",     icono: "UserCog",      color: "info",      modulo: "usuarios",       nivel: "info" },
  USUARIO_ELIMINADO:      { etiqueta: "Usuario eliminado",       icono: "UserMinus",    color: "danger",    modulo: "usuarios",       nivel: "advertencia" },
  OBSERVACION_REGISTRADA: { etiqueta: "Observación registrada",  icono: "MessageSquare",color: "info",      modulo: "sedes",          nivel: "info" },
  CONFIGURACION_ACTUALIZADA:{ etiqueta: "Configuración actualizada",icono: "Settings",  color: "info",      modulo: "configuracion",  nivel: "info" },
  GENERICO:               { etiqueta: "Evento",                  icono: "Circle",       color: "muted",     modulo: "sedes",          nivel: "info" },
};

// Metadata segura ante tipos desconocidos (el backend podría emitir tipos futuros).
export function metaEvento(tipo?: string): MetaEvento {
  if (tipo && tipo in CATALOGO_EVENTOS) return CATALOGO_EVENTOS[tipo as TipoEvento];
  return CATALOGO_EVENTOS.GENERICO;
}

// Clases Tailwind por color semántico (punto y anillo del Timeline).
export const colorClasses: Record<string, { dot: string; ring: string; text: string; bg: string }> = {
  success: { dot: "bg-green-500",  ring: "ring-green-500/20",  text: "text-green-600",  bg: "bg-green-50 dark:bg-green-500/10" },
  info:    { dot: "bg-blue-500",   ring: "ring-blue-500/20",   text: "text-blue-600",   bg: "bg-blue-50 dark:bg-blue-500/10" },
  warning: { dot: "bg-yellow-500", ring: "ring-yellow-500/20", text: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-500/10" },
  danger:  { dot: "bg-red-500",    ring: "ring-red-500/20",    text: "text-red-600",    bg: "bg-red-50 dark:bg-red-500/10" },
  muted:   { dot: "bg-slate-400",  ring: "ring-slate-400/20",  text: "text-slate-500",  bg: "bg-slate-50 dark:bg-slate-800/40" },
};

export function claseColorEvento(color?: string) {
  return colorClasses[color ?? "muted"] ?? colorClasses.muted;
}
