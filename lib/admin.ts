// lib/admin.ts — Registro data-driven del nucleo administrativo del ERP.
// Cada recurso administrable se declara aqui como DefinicionRecurso. El CRUD
// generico (modulo-crud.tsx) consume estas definiciones: NO se escribe una
// pantalla por modulo. Agregar un modulo/catalogo nuevo = agregar una entrada.

import type {
  DefinicionRecurso,
  DefinicionWidget,
} from "@/types/admin";

// ─── Evento reforzado (Op_Eventos con 18 campos) ───
// Extiende el Evento base de operaciones.ts con trazabilidad completa:
// Resultado, Origen, IP, Dispositivo y Version. Aditivo: no rompe lo existente.
export type NivelEvento = "info" | "exito" | "advertencia" | "error" | "critico";

export type EventoCompleto = {
  ID: string;
  Fecha: string;
  Hora: string;
  Usuario: string;
  Modulo: string;
  Entidad: string;
  EntidadID: string;
  SedeID: string;
  TipoEvento: string;
  Descripcion: string;
  DatosAnteriores: string;
  DatosNuevos: string;
  Nivel: NivelEvento;
  Resultado: string;      // "ok" | "error" | descripcion corta del resultado
  Origen: string;         // "web" | "api" | "sistema" | "importacion"
  IP: string;
  Dispositivo: string;
  Version: string;
  Icono: string;
  Color: string;
};

// Columnas de Op_Eventos en orden. Fuente unica de verdad para el backend GAS.
export const COLUMNAS_EVENTO: (keyof EventoCompleto)[] = [
  "ID","Fecha","Hora","Usuario","Modulo","Entidad","EntidadID","SedeID",
  "TipoEvento","Descripcion","DatosAnteriores","DatosNuevos","Nivel",
  "Resultado","Origen","IP","Dispositivo","Version","Icono","Color",
];

// ─── Definiciones de recursos administrables ───

export const RECURSO_MODULOS: DefinicionRecurso = {
  recurso: "modulos",
  titulo: "Modulos",
  singular: "modulo",
  icono: "LayoutGrid",
  descripcion: "Modulos del sistema. Activa, ordena y da permisos sin tocar codigo.",
  moduloEvento: "administracion",
  entidadEvento: "modulo",
  campos: [
    { clave: "ID", etiqueta: "ID", tipo: "texto", soloLectura: true, enFormulario: false },
    { clave: "Clave", etiqueta: "Clave", tipo: "texto", requerido: true, placeholder: "inventarios" },
    { clave: "Nombre", etiqueta: "Nombre", tipo: "texto", requerido: true },
    { clave: "Icono", etiqueta: "Icono", tipo: "icono" },
    { clave: "Color", etiqueta: "Color", tipo: "color" },
    { clave: "Orden", etiqueta: "Orden", tipo: "numero" },
    { clave: "Roles", etiqueta: "Roles", tipo: "multiselect", catalogo: "roles" },
    { clave: "Estado", etiqueta: "Estado", tipo: "select", catalogo: "estados", valorDefecto: "activo" },
    { clave: "Activo", etiqueta: "Activo", tipo: "booleano", valorDefecto: true },
  ],
  acciones: ["crear","editar","eliminar","consultar","activar","desactivar"],
};

export const RECURSO_USUARIOS: DefinicionRecurso = {
  recurso: "usuarios",
  titulo: "Usuarios",
  singular: "usuario",
  icono: "Users",
  descripcion: "Gestion de usuarios: roles, sedes, permisos y estado.",
  moduloEvento: "administracion",
  entidadEvento: "usuario",
  campos: [
    { clave: "ID", etiqueta: "ID", tipo: "texto", soloLectura: true, enFormulario: false },
    { clave: "Foto", etiqueta: "Foto", tipo: "imagen", enTabla: false },
    { clave: "Nombre", etiqueta: "Nombre", tipo: "texto", requerido: true },
    { clave: "Correo", etiqueta: "Correo", tipo: "email", requerido: true },
    { clave: "Rol", etiqueta: "Rol", tipo: "select", catalogo: "roles", requerido: true },
    { clave: "Sedes", etiqueta: "Sedes", tipo: "multiselect", catalogo: "sedes" },
    { clave: "Telefono", etiqueta: "Telefono", tipo: "texto", enTabla: false },
    { clave: "Estado", etiqueta: "Estado", tipo: "select", catalogo: "estados", valorDefecto: "activo" },
  ],
  acciones: ["crear","editar","eliminar","consultar","activar","desactivar"],
};

export const RECURSO_ROLES: DefinicionRecurso = {
  recurso: "roles",
  titulo: "Roles",
  singular: "rol",
  icono: "Shield",
  descripcion: "Roles del sistema. Ninguno esta hardcodeado: se administran aqui.",
  moduloEvento: "administracion",
  entidadEvento: "rol",
  campos: [
    { clave: "ID", etiqueta: "ID", tipo: "texto", soloLectura: true, enFormulario: false },
    { clave: "Clave", etiqueta: "Clave", tipo: "texto", requerido: true, placeholder: "supervisor" },
    { clave: "Nombre", etiqueta: "Nombre", tipo: "texto", requerido: true },
    { clave: "Descripcion", etiqueta: "Descripcion", tipo: "textarea", enTabla: false },
    { clave: "Color", etiqueta: "Color", tipo: "color" },
    { clave: "Nivel", etiqueta: "Nivel", tipo: "numero" },
    { clave: "Activo", etiqueta: "Activo", tipo: "booleano", valorDefecto: true },
  ],
};

export const RECURSO_PERMISOS: DefinicionRecurso = {
  recurso: "permisos",
  titulo: "Permisos",
  singular: "permiso",
  icono: "KeyRound",
  descripcion: "Permisos dinamicos: modulo + accion + rol/usuario.",
  moduloEvento: "administracion",
  entidadEvento: "permiso",
  campos: [
    { clave: "ID", etiqueta: "ID", tipo: "texto", soloLectura: true, enFormulario: false },
    { clave: "Modulo", etiqueta: "Modulo", tipo: "select", catalogo: "modulos", requerido: true },
    { clave: "Accion", etiqueta: "Accion", tipo: "select", catalogo: "acciones", requerido: true },
    { clave: "Rol", etiqueta: "Rol", tipo: "select", catalogo: "roles" },
    { clave: "Usuario", etiqueta: "Usuario", tipo: "select", catalogo: "usuarios" },
    { clave: "Permitido", etiqueta: "Permitido", tipo: "booleano", valorDefecto: true },
  ],
};

export const RECURSO_CATALOGOS: DefinicionRecurso = {
  recurso: "catalogos",
  titulo: "Catalogos",
  singular: "catalogo",
  icono: "List",
  descripcion: "Listas maestras: tipos, estados, prioridades, categorias...",
  moduloEvento: "administracion",
  entidadEvento: "catalogo",
  campos: [
    { clave: "ID", etiqueta: "ID", tipo: "texto", soloLectura: true, enFormulario: false },
    { clave: "Clave", etiqueta: "Clave", tipo: "texto", requerido: true, placeholder: "prioridades" },
    { clave: "Nombre", etiqueta: "Nombre", tipo: "texto", requerido: true },
    { clave: "Descripcion", etiqueta: "Descripcion", tipo: "textarea", enTabla: false },
    { clave: "Icono", etiqueta: "Icono", tipo: "icono" },
    { clave: "Activo", etiqueta: "Activo", tipo: "booleano", valorDefecto: true },
  ],
};

export const RECURSO_ITEMS_CATALOGO: DefinicionRecurso = {
  recurso: "items_catalogo",
  titulo: "Valores de catalogo",
  singular: "valor",
  icono: "Tag",
  descripcion: "Valores concretos de cada lista maestra.",
  moduloEvento: "administracion",
  entidadEvento: "item_catalogo",
  campos: [
    { clave: "ID", etiqueta: "ID", tipo: "texto", soloLectura: true, enFormulario: false },
    { clave: "Catalogo", etiqueta: "Catalogo", tipo: "select", catalogo: "catalogos", requerido: true },
    { clave: "Clave", etiqueta: "Clave", tipo: "texto", requerido: true },
    { clave: "Etiqueta", etiqueta: "Etiqueta", tipo: "texto", requerido: true },
    { clave: "Color", etiqueta: "Color", tipo: "color" },
    { clave: "Icono", etiqueta: "Icono", tipo: "icono" },
    { clave: "Orden", etiqueta: "Orden", tipo: "numero" },
    { clave: "Activo", etiqueta: "Activo", tipo: "booleano", valorDefecto: true },
  ],
};

export const RECURSO_PARAMETROS: DefinicionRecurso = {
  recurso: "parametros",
  titulo: "Parametros",
  singular: "parametro",
  icono: "Settings",
  descripcion: "Configuracion global: empresa, logo, Google, notificaciones, API.",
  moduloEvento: "administracion",
  entidadEvento: "parametro",
  campos: [
    { clave: "ID", etiqueta: "ID", tipo: "texto", soloLectura: true, enFormulario: false },
    { clave: "Grupo", etiqueta: "Grupo", tipo: "texto" },
    { clave: "Clave", etiqueta: "Clave", tipo: "texto", requerido: true, placeholder: "empresa.nombre" },
    { clave: "Nombre", etiqueta: "Nombre", tipo: "texto", requerido: true },
    { clave: "Valor", etiqueta: "Valor", tipo: "texto", requerido: true },
    { clave: "Descripcion", etiqueta: "Descripcion", tipo: "textarea", enTabla: false },
  ],
};

// Registro central. Un modulo/pantalla nuevo se agrega SOLO aqui.
export const RECURSOS_ADMIN: Record<string, DefinicionRecurso> = {
  modulos: RECURSO_MODULOS,
  usuarios: RECURSO_USUARIOS,
  roles: RECURSO_ROLES,
  permisos: RECURSO_PERMISOS,
  catalogos: RECURSO_CATALOGOS,
  items_catalogo: RECURSO_ITEMS_CATALOGO,
  parametros: RECURSO_PARAMETROS,
};

// ─── Widgets del dashboard administrativo (reutilizables/configurables) ───
export const WIDGETS_ADMIN: DefinicionWidget[] = [
  { clave: "usuarios", titulo: "Usuarios activos", icono: "Users", color: "primary", recurso: "usuarios", filtros: { Estado: "activo" } },
  { clave: "eventos_hoy", titulo: "Eventos del dia", icono: "Activity", color: "secondary", recurso: "eventos" },
  { clave: "sedes", titulo: "Sedes", icono: "Building2", color: "success", recurso: "sedes" },
  { clave: "modulos", titulo: "Modulos", icono: "LayoutGrid", color: "primary", recurso: "modulos", filtros: { Activo: true } },
  { clave: "actividades", titulo: "Actividades", icono: "CalendarDays", color: "secondary", recurso: "actividades" },
  { clave: "inventarios", titulo: "Inventarios", icono: "Package", color: "success", recurso: "inventarios" },
  { clave: "auditorias", titulo: "Auditorias", icono: "ClipboardCheck", color: "primary", recurso: "auditorias" },
  { clave: "compras", titulo: "Compras", icono: "ShoppingCart", color: "secondary", recurso: "compras" },
  { clave: "documentos", titulo: "Documentos", icono: "FileText", color: "success", recurso: "documentos" },
  { clave: "errores", titulo: "Errores", icono: "TriangleAlert", color: "danger", recurso: "eventos", filtros: { Nivel: "error" } },
];

// Secciones del modulo de Administracion (tabs data-driven del shell).
export type SeccionAdmin = {
  clave: string;
  titulo: string;
  icono: string;
  emoji?: string;
  recurso?: string;   // si la seccion es un CRUD directo de un recurso
  tipo: "dashboard" | "crud" | "eventos";
};

export const SECCIONES_ADMIN: SeccionAdmin[] = [
  { clave: "dashboard", titulo: "Dashboard", icono: "LayoutDashboard", emoji: "📊", tipo: "dashboard" },
  { clave: "modulos", titulo: "Modulos", icono: "LayoutGrid", emoji: "📦", tipo: "crud", recurso: "modulos" },
  { clave: "usuarios", titulo: "Usuarios", icono: "Users", emoji: "👤", tipo: "crud", recurso: "usuarios" },
  { clave: "roles", titulo: "Roles", icono: "Shield", emoji: "🔐", tipo: "crud", recurso: "roles" },
  { clave: "permisos", titulo: "Permisos", icono: "KeyRound", emoji: "🔑", tipo: "crud", recurso: "permisos" },
  { clave: "catalogos", titulo: "Catalogos", icono: "List", emoji: "📋", tipo: "crud", recurso: "catalogos" },
  { clave: "parametros", titulo: "Parametros", icono: "Settings", emoji: "⚙", tipo: "crud", recurso: "parametros" },
  { clave: "eventos", titulo: "Eventos", icono: "ScrollText", emoji: "📜", tipo: "eventos" },
];
