export const AREAS_SEED = [
{ ID: "ARE_OPE", Clave: "operaciones", Nombre: "Operaciones", Etiqueta: "Operaciones", Orden: 1, Activo: true },
{ ID: "ARE_FIN", Clave: "finanzas", Nombre: "Finanzas", Etiqueta: "Finanzas", Orden: 2, Activo: true },
{ ID: "ARE_COM", Clave: "compras", Nombre: "Compras", Etiqueta: "Compras", Orden: 3, Activo: true },
{ ID: "ARE_CAL", Clave: "calidad", Nombre: "Calidad", Etiqueta: "Calidad", Orden: 4, Activo: true },
{ ID: "ARE_SST", Clave: "sst", Nombre: "Seguridad y Salud", Etiqueta: "Seguridad y Salud", Orden: 5, Activo: true },
{ ID: "ARE_RRHH", Clave: "rrhh", Nombre: "Talento Humano", Etiqueta: "Talento Humano", Orden: 6, Activo: true },
{ ID: "ARE_SIS", Clave: "sistemas", Nombre: "Sistemas", Etiqueta: "Sistemas", Orden: 7, Activo: true },
{ ID: "ARE_DIR", Clave: "direccion", Nombre: "Direccion General", Etiqueta: "Direccion General", Orden: 8, Activo: true },
];

export const PRIORIDADES_SEED = [
{ ID: "PRI_ALTA", Clave: "alta", Nombre: "Alta", Etiqueta: "Alta", Color: "#ef4444", Orden: 1, Activo: true },
{ ID: "PRI_MEDIA", Clave: "media", Nombre: "Media", Etiqueta: "Media", Color: "#f59e0b", Orden: 2, Activo: true },
{ ID: "PRI_BAJA", Clave: "baja", Nombre: "Baja", Etiqueta: "Baja", Color: "#16a34a", Orden: 3, Activo: true },
];

export const TIPOS_SEED = [
{ ID: "TIP_OPE", Clave: "operativa", Nombre: "Operativa", Etiqueta: "Operativa", Orden: 1, Activo: true },
{ ID: "TIP_ADM", Clave: "administrativa", Nombre: "Administrativa", Etiqueta: "Administrativa", Orden: 2, Activo: true },
{ ID: "TIP_MAN", Clave: "mantenimiento", Nombre: "Mantenimiento", Etiqueta: "Mantenimiento", Orden: 3, Activo: true },
{ ID: "TIP_CAP", Clave: "capacitacion", Nombre: "Capacitacion", Etiqueta: "Capacitacion", Orden: 4, Activo: true },
{ ID: "TIP_AUD", Clave: "auditoria", Nombre: "Auditoria", Etiqueta: "Auditoria", Orden: 5, Activo: true },
];

export const UNIDADES_SEED = [
{ ID: "UNI_UND", Clave: "und", Nombre: "Unidad", Etiqueta: "Unidad", Orden: 1, Activo: true },
{ ID: "UNI_KG", Clave: "kg", Nombre: "Kilogramo", Etiqueta: "Kilogramo", Orden: 2, Activo: true },
{ ID: "UNI_LB", Clave: "lb", Nombre: "Libra", Etiqueta: "Libra", Orden: 3, Activo: true },
{ ID: "UNI_LT", Clave: "lt", Nombre: "Litro", Etiqueta: "Litro", Orden: 4, Activo: true },
{ ID: "UNI_BUL", Clave: "bulto", Nombre: "Bulto", Etiqueta: "Bulto", Orden: 5, Activo: true },
{ ID: "UNI_CAJ", Clave: "caja", Nombre: "Caja", Etiqueta: "Caja", Orden: 6, Activo: true },
{ ID: "UNI_PAQ", Clave: "paquete", Nombre: "Paquete", Etiqueta: "Paquete", Orden: 7, Activo: true },
];

export const CATEGORIAS_SEED = [
{ ID: "CAT_CAL", Clave: "calidad", Nombre: "Calidad", Etiqueta: "Calidad", Orden: 1, Activo: true },
{ ID: "CAT_SST", Clave: "sst", Nombre: "SST", Etiqueta: "SST", Orden: 2, Activo: true },
{ ID: "CAT_LEG", Clave: "legal", Nombre: "Legal", Etiqueta: "Legal", Orden: 3, Activo: true },
{ ID: "CAT_COM", Clave: "compras", Nombre: "Compras", Etiqueta: "Compras", Orden: 4, Activo: true },
{ ID: "CAT_FIN", Clave: "financiera", Nombre: "Financiera", Etiqueta: "Financiera", Orden: 5, Activo: true },
{ ID: "CAT_OPE", Clave: "operativa", Nombre: "Operativa", Etiqueta: "Operativa", Orden: 6, Activo: true },
];

// Listas maestras declaradas (pestana "Catalogos" del modulo de Administracion).
export const CATALOGOS_SEED = [
{ ID: "CTL_ESTADOS", Clave: "estados", Nombre: "Estados", Descripcion: "Estados genericos del sistema", Icono: "ToggleLeft", Activo: true },
{ ID: "CTL_ACCIONES", Clave: "acciones", Nombre: "Acciones", Descripcion: "Acciones permisionables", Icono: "MousePointerClick", Activo: true },
{ ID: "CTL_AREAS", Clave: "areas", Nombre: "Areas", Descripcion: "Areas funcionales de la compania", Icono: "Network", Activo: true },
{ ID: "CTL_PRIORIDADES", Clave: "prioridades", Nombre: "Prioridades", Descripcion: "Niveles de prioridad", Icono: "Flag", Activo: true },
{ ID: "CTL_TIPOS", Clave: "tipos", Nombre: "Tipos", Descripcion: "Tipos de actividad", Icono: "Shapes", Activo: true },
{ ID: "CTL_UNIDADES", Clave: "unidades", Nombre: "Unidades", Descripcion: "Unidades de medida", Icono: "Ruler", Activo: true },
{ ID: "CTL_CATEGORIAS", Clave: "categorias", Nombre: "Categorias", Descripcion: "Categorias documentales", Icono: "Tags", Activo: true },
];

type ItemCatalogo = {
ID: string;
Catalogo: string;
Clave: string;
Nombre: string;
Etiqueta: string;
Color?: string;
Orden?: number;
Activo: boolean;
};

function aItems(catalogo: string, base: { ID: string; Clave: string; Nombre: string; Etiqueta: string; Color?: string; Orden?: number; Activo: boolean }[]): ItemCatalogo[] {
return base.map((x) => ({
ID: `ITC_${x.ID}`,
Catalogo: catalogo,
Clave: x.Clave,
Nombre: x.Nombre,
Etiqueta: x.Etiqueta,
Color: x.Color,
Orden: x.Orden,
Activo: x.Activo,
}));
}

export const ITEMS_CATALOGO_SEED: ItemCatalogo[] = [
...aItems("estados", ESTADOS_SEED),
...aItems("acciones", ACCIONES_SEED),
...aItems("areas", AREAS_SEED),
...aItems("prioridades", PRIORIDADES_SEED),
...aItems("tipos", TIPOS_SEED),
...aItems("unidades", UNIDADES_SEED),
...aItems("categorias", CATEGORIAS_SEED),
];

export const PARAMETROS_SEED = [
{ ID: "PAR_1", Grupo: "empresa", Clave: "empresa.nombre", Nombre: "Nombre de la empresa", Valor: "Grupo DASHI S.A.S.", Descripcion: "Razon social del grupo", Activo: true },
{ ID: "PAR_2", Grupo: "empresa", Clave: "empresa.nit", Nombre: "NIT", Valor: "Por definir", Descripcion: "Identificacion tributaria", Activo: true },
{ ID: "PAR_3", Grupo: "empresa", Clave: "empresa.moneda", Nombre: "Moneda", Valor: "COP", Descripcion: "Moneda base del ERP", Activo: true },
{ ID: "PAR_4", Grupo: "empresa", Clave: "empresa.zona", Nombre: "Zona horaria", Valor: "America/Bogota", Descripcion: "Zona horaria operativa", Activo: true },
{ ID: "PAR_5", Grupo: "sistema", Clave: "sistema.nombre", Nombre: "Nombre del sistema", Valor: "Nexus Operativo", Descripcion: "Marca del ERP", Activo: true },
{ ID: "PAR_6", Grupo: "sistema", Clave: "sistema.proveedor_datos", Nombre: "Proveedor de datos", Valor: "demo", Descripcion: "demo | gas", Activo: true },
{ ID: "PAR_7", Grupo: "sistema", Clave: "sistema.version", Nombre: "Version", Valor: "1.0.0", Descripcion: "Version del frontend", Activo: true },
{ ID: "PAR_8", Grupo: "notificaciones", Clave: "notificaciones.correo", Nombre: "Correo de notificaciones", Valor: "admin@dashi.demo", Descripcion: "Destino de alertas del sistema", Activo: true },
];

export const EVENTOS_SEED = [
{ ID: "EVT_1", Fecha: "2026-07-27", Hora: "08:00", Usuario: "Administrador Demo", Modulo: "sedes", Entidad: "Sede", EntidadID: "SEDE_ROCOTO", SedeID: "SEDE_ROCOTO", TipoEvento: "SEDE_CREADA", Descripcion: "Sede Rocoto registrada", Nivel: "exito", Icono: "building", Color: "green" },
{ ID: "EVT_2", Fecha: "2026-07-27", Hora: "09:15", Usuario: "Administrador Demo", Modulo: "inventarios", Entidad: "Inventario", EntidadID: "INV_RCT_1", SedeID: "SEDE_ROCOTO", TipoEvento: "INVENTARIO_ACTUALIZADO", Descripcion: "Aceite vegetal 20L actualizado", Nivel: "info", Icono: "package", Color: "blue" },
{ ID: "EVT_3", Fecha: "2026-07-28", Hora: "07:05", Usuario: "Gerente Rocoto", Modulo: "agenda", Entidad: "Actividad", EntidadID: "ACT_RCT_1", SedeID: "SEDE_ROCOTO", TipoEvento: "ACTIVIDAD_PROGRAMADA", Descripcion: "Apertura de local programada", Nivel: "info", Icono: "calendar", Color: "violet" },
{ ID: "EVT_4", Fecha: "2026-07-28", Hora: "10:40", Usuario: "Auditor Interno", Modulo: "auditorias", Entidad: "Auditoria", EntidadID: "AUD_MLG_1", SedeID: "SEDE_MALANGA", TipoEvento: "AUDITORIA_APROBADA", Descripcion: "Auditoria de higiene mensual aprobada", Nivel: "exito", Icono: "clipboard-check", Color: "green" },
{ ID: "EVT_5", Fecha: "2026-07-28", Hora: "16:20", Usuario: "Administrador Demo", Modulo: "compras", Entidad: "Compra", EntidadID: "CMP_WOK_2", SedeID: "SEDE_123WOK", TipoEvento: "COMPRA_PENDIENTE", Descripcion: "Orden de compra empaques pendiente de aprobacion", Nivel: "advertencia", Icono: "shopping-cart", Color: "amber" },
];

export const SEED_MAP: Record<string, unknown[]> = {
sedes: SEDES_SEED,
actividades: ACTIVIDADES_SEED,
inventarios: INVENTARIOS_SEED,
auditorias: AUDITORIAS_SEED,
compras: COMPRAS_SEED,
evidencias: EVIDENCIAS_SEED,
indicadores: INDICADORES_SEED,
politicas: POLITICAS_SEED,
procedimientos: PROCEDIMIENTOS_SEED,
manuales: MANUALES_SEED,
documentos: DOCUMENTOS_SEED,
modulos: MODULOS_SEED,
usuarios: USUARIOS_SEED,
roles: ROLES_SEED,
permisos: PERMISOS_SEED,
catalogos: CATALOGOS_SEED,
items_catalogo: ITEMS_CATALOGO_SEED,
parametros: PARAMETROS_SEED,
estados: ESTADOS_SEED,
acciones: ACCIONES_SEED,
areas: AREAS_SEED,
prioridades: PRIORIDADES_SEED,
tipos: TIPOS_SEED,
unidades: UNIDADES_SEED,
categorias: CATEGORIAS_SEED,
eventos: EVENTOS_SEED,
};
