// lib/data/seed/dashi-seed.ts
// Datos semilla REALES del Grupo DASHI S.A.S. para el DemoProvider.
// Todo se relaciona con la sede mediante SedeID. Coherente y listo para demo.
// Al cambiar SEED_VERSION el DemoProvider regenera el almacenamiento local.

export const SEED_VERSION = "2026-07-29-admin-v2";

export type SedeSeed = {
ID: string;
Codigo: string;
Nombre: string;
Descripcion: string;
Estado: string;
Responsable: string;
Administrador: string;
Direccion?: string;
Telefono?: string;
Activo: boolean;
};

export const SEDES_SEED: SedeSeed[] = [
{ ID: "SEDE_TODAS", Codigo: "ALL", Nombre: "Todas las sedes", Descripcion: "Vista consolidada de todas las sedes", Estado: "Activa", Responsable: "Direccion General", Administrador: "Direccion General", Activo: true },
{ ID: "SEDE_ROCOTO", Codigo: "RCT", Nombre: "Rocoto", Descripcion: "Sede Rocoto", Estado: "Activa", Responsable: "Gerente Rocoto", Administrador: "Admin Rocoto", Direccion: "Av. Principal 100", Telefono: "300-000-0001", Activo: true },
{ ID: "SEDE_MALANGA", Codigo: "MLG", Nombre: "Malanga", Descripcion: "Sede Malanga", Estado: "Activa", Responsable: "Gerente Malanga", Administrador: "Admin Malanga", Direccion: "Calle 20 #15", Telefono: "300-000-0002", Activo: true },
{ ID: "SEDE_123WOK", Codigo: "WOK", Nombre: "123 Wok", Descripcion: "Sede 123 Wok", Estado: "Activa", Responsable: "Gerente Wok", Administrador: "Admin Wok", Direccion: "CC Central L-3", Telefono: "300-000-0003", Activo: true },
{ ID: "SEDE_ARREBATAO", Codigo: "ARB", Nombre: "Arrebatao", Descripcion: "Sede Arrebatao", Estado: "Activa", Responsable: "Gerente Arrebatao", Administrador: "Admin Arrebatao", Direccion: "Av. 68 #40", Telefono: "300-000-0004", Activo: true },
{ ID: "SEDE_HOTWINGS", Codigo: "HTW", Nombre: "Hot Wings", Descripcion: "Sede Hot Wings", Estado: "Activa", Responsable: "Gerente Hot Wings", Administrador: "Admin Hot Wings", Direccion: "Cra 7 #22", Telefono: "300-000-0005", Activo: true },
{ ID: "SEDE_SINPAR", Codigo: "SNP", Nombre: "Sin Par", Descripcion: "Sede Sin Par", Estado: "Activa", Responsable: "Gerente Sin Par", Administrador: "Admin Sin Par", Direccion: "Calle 45 #12", Telefono: "300-000-0006", Activo: true },
{ ID: "SEDE_CASANADIE", Codigo: "CDN", Nombre: "Casa de Nadie", Descripcion: "Sede Casa de Nadie", Estado: "Activa", Responsable: "Gerente Casa de Nadie", Administrador: "Admin Casa de Nadie", Direccion: "Av. Sur 88", Telefono: "300-000-0007", Activo: true },
{ ID: "SEDE_QUEMA", Codigo: "QQQ", Nombre: "Quema Que Quema", Descripcion: "Sede Quema Que Quema", Estado: "Activa", Responsable: "Gerente Quema", Administrador: "Admin Quema", Direccion: "Cra 15 #33", Telefono: "300-000-0008", Activo: true },
];

const SEDES_OPERATIVAS = SEDES_SEED.filter((s) => s.ID !== "SEDE_TODAS");

function porSede<T>(fn: (sede: SedeSeed, i: number) => T[]): T[] {
return SEDES_OPERATIVAS.flatMap((s, i) => fn(s, i));
}

export const INVENTARIOS_SEED = porSede((s, i) => [
{ ID: `INV_${s.Codigo}_1`, Codigo: `INV-${s.Codigo}-001`, Nombre: "Aceite vegetal 20L", SedeID: s.ID, Estado: "Disponible", Cantidad: 12 + i, Unidad: "und", Responsable: s.Responsable, Activo: true },
{ ID: `INV_${s.Codigo}_2`, Codigo: `INV-${s.Codigo}-002`, Nombre: "Arroz 25kg", SedeID: s.ID, Estado: "Disponible", Cantidad: 8 + i, Unidad: "bulto", Responsable: s.Responsable, Activo: true },
{ ID: `INV_${s.Codigo}_3`, Codigo: `INV-${s.Codigo}-003`, Nombre: "Pollo congelado", SedeID: s.ID, Estado: "Bajo stock", Cantidad: 3, Unidad: "kg", Responsable: s.Responsable, Activo: true },
]);

export const AUDITORIAS_SEED = porSede((s, i) => [
{ ID: `AUD_${s.Codigo}_1`, Codigo: `AUD-${s.Codigo}-001`, Nombre: "Auditoria de higiene mensual", SedeID: s.ID, Estado: i % 2 ? "Aprobada" : "Pendiente", Responsable: "Auditor Interno", Fecha: "2026-07-10", Resultado: i % 2 ? "95%" : "En proceso", Activo: true },
]);

export const COMPRAS_SEED = porSede((s, i) => [
{ ID: `CMP_${s.Codigo}_1`, Codigo: `OC-${s.Codigo}-001`, Nombre: "Orden de compra insumos", SedeID: s.ID, Estado: "Recibida", Proveedor: "Distribuidora Central", Monto: 1500000 + i * 100000, Fecha: "2026-07-05", Activo: true },
{ ID: `CMP_${s.Codigo}_2`, Codigo: `OC-${s.Codigo}-002`, Nombre: "Orden de compra empaques", SedeID: s.ID, Estado: "Pendiente", Proveedor: "EmpaqueYa", Monto: 450000, Fecha: "2026-07-18", Activo: true },
]);

export const ACTIVIDADES_SEED = porSede((s) => [
{ ID: `ACT_${s.Codigo}_1`, Codigo: `ACT-${s.Codigo}-001`, Nombre: "Apertura de local", SedeID: s.ID, Sedes: s.ID, Tipo: "Operativa", Area: "Operaciones", Estado: "Programada", Prioridad: "Alta", Fecha: "2026-07-28", HoraInicio: "07:00", HoraFin: "08:00", Responsable: s.Responsable, Activo: true },
{ ID: `ACT_${s.Codigo}_2`, Codigo: `ACT-${s.Codigo}-002`, Nombre: "Cierre de caja", SedeID: s.ID, Sedes: s.ID, Tipo: "Administrativa", Area: "Finanzas", Estado: "Programada", Prioridad: "Media", Fecha: "2026-07-28", HoraInicio: "22:00", HoraFin: "22:30", Responsable: s.Responsable, Activo: true },
]);

export const EVIDENCIAS_SEED = porSede((s) => [
{ ID: `EVD_${s.Codigo}_1`, Codigo: `EV-${s.Codigo}-001`, Nombre: "Foto limpieza cocina", SedeID: s.ID, Estado: "Cargada", Tipo: "Imagen", RutaDrive: "/demo/evidencias/cocina.jpg", Responsable: s.Responsable, Activo: true },
]);

export const INDICADORES_SEED = porSede((s, i) => [
{ ID: `IND_${s.Codigo}_1`, Codigo: `KPI-${s.Codigo}-001`, Nombre: "Ventas del dia", SedeID: s.ID, Valor: 2500000 + i * 150000, Unidad: "COP", Meta: 3000000, Estado: "En seguimiento", Activo: true },
{ ID: `IND_${s.Codigo}_2`, Codigo: `KPI-${s.Codigo}-002`, Nombre: "Satisfaccion cliente", SedeID: s.ID, Valor: 90 + i, Unidad: "%", Meta: 95, Estado: "En seguimiento", Activo: true },
]);

export const POLITICAS_SEED = [
{ ID: "POL_1", Codigo: "POL-001", Nombre: "Politica de manipulacion de alimentos", SedeID: "SEDE_TODAS", Categoria: "Calidad", Version: "1.2", Estado: "Publicada", Responsable: "Calidad", Vigencia: "2026-12-31", Activo: true },
{ ID: "POL_2", Codigo: "POL-002", Nombre: "Politica de seguridad y salud en el trabajo", SedeID: "SEDE_TODAS", Categoria: "SST", Version: "2.0", Estado: "Publicada", Responsable: "SST", Vigencia: "2026-12-31", Activo: true },
{ ID: "POL_3", Codigo: "POL-003", Nombre: "Politica de tratamiento de datos", SedeID: "SEDE_TODAS", Categoria: "Legal", Version: "1.0", Estado: "Publicada", Responsable: "Direccion General", Vigencia: "2027-06-30", Activo: true },
{ ID: "POL_4", Codigo: "POL-004", Nombre: "Politica de compras y proveedores", SedeID: "SEDE_TODAS", Categoria: "Compras", Version: "1.1", Estado: "En revision", Responsable: "Compras", Vigencia: "2026-10-31", Activo: true },
];

export const PROCEDIMIENTOS_SEED = [
{ ID: "PRC_1", Codigo: "PRC-001", Nombre: "Procedimiento de apertura de sede", SedeID: "SEDE_TODAS", Area: "Operaciones", Version: "1.3", Estado: "Vigente", Responsable: "Operaciones", Vigencia: "2026-12-31", Activo: true },
{ ID: "PRC_2", Codigo: "PRC-002", Nombre: "Procedimiento de cierre de caja", SedeID: "SEDE_TODAS", Area: "Finanzas", Version: "1.1", Estado: "Vigente", Responsable: "Finanzas", Vigencia: "2026-12-31", Activo: true },
{ ID: "PRC_3", Codigo: "PRC-003", Nombre: "Procedimiento de recepcion de mercancia", SedeID: "SEDE_TODAS", Area: "Compras", Version: "1.0", Estado: "Vigente", Responsable: "Compras", Vigencia: "2027-01-31", Activo: true },
{ ID: "PRC_4", Codigo: "PRC-004", Nombre: "Procedimiento de limpieza y desinfeccion", SedeID: "SEDE_TODAS", Area: "Calidad", Version: "2.1", Estado: "Vigente", Responsable: "Calidad", Vigencia: "2026-11-30", Activo: true },
{ ID: "PRC_5", Codigo: "PRC-005", Nombre: "Procedimiento de inventario ciclico", SedeID: "SEDE_TODAS", Area: "Operaciones", Version: "1.0", Estado: "En revision", Responsable: "Operaciones", Vigencia: "2026-09-30", Activo: true },
];

export const MANUALES_SEED = [
{ ID: "MAN_1", Codigo: "MAN-001", Nombre: "Manual de operaciones", SedeID: "SEDE_TODAS", Area: "Operaciones", Version: "3.0", Estado: "Publicado", Responsable: "Operaciones", Vigencia: "2027-01-31", Activo: true },
{ ID: "MAN_2", Codigo: "MAN-002", Nombre: "Manual del empleado", SedeID: "SEDE_TODAS", Area: "RRHH", Version: "2.2", Estado: "Publicado", Responsable: "RRHH", Vigencia: "2027-01-31", Activo: true },
{ ID: "MAN_3", Codigo: "MAN-003", Nombre: "Manual de buenas practicas de manufactura", SedeID: "SEDE_TODAS", Area: "Calidad", Version: "1.4", Estado: "Publicado", Responsable: "Calidad", Vigencia: "2026-12-31", Activo: true },
{ ID: "MAN_4", Codigo: "MAN-004", Nombre: "Manual de uso de Nexus Operativo", SedeID: "SEDE_TODAS", Area: "Sistemas", Version: "1.0", Estado: "Borrador", Responsable: "Sistemas", Vigencia: "2027-06-30", Activo: true },
];

export const DOCUMENTOS_SEED = [
...POLITICAS_SEED.map((d) => ({ ...d, ID: `DOC_${d.ID}`, Tipo: "Politica" })),
...PROCEDIMIENTOS_SEED.map((d) => ({ ...d, ID: `DOC_${d.ID}`, Tipo: "Procedimiento" })),
...MANUALES_SEED.map((d) => ({ ...d, ID: `DOC_${d.ID}`, Tipo: "Manual" })),
];

export const MODULOS_SEED = [
{ ID: "MOD_OPERACIONES", Codigo: "M-001", Clave: "operaciones", Nombre: "Operaciones", Icono: "Building2", Color: "#f97316", Orden: 1, Roles: "administrador,supervisor", Estado: "activo", Activo: true },
{ ID: "MOD_SEDES", Codigo: "M-002", Clave: "sedes", Nombre: "Sedes", Icono: "Building", Color: "#0ea5e9", Orden: 2, Roles: "administrador,supervisor", Estado: "activo", Activo: true },
{ ID: "MOD_AGENDA", Codigo: "M-003", Clave: "agenda", Nombre: "Agenda", Icono: "CalendarDays", Color: "#8b5cf6", Orden: 3, Roles: "administrador,supervisor,operador", Estado: "activo", Activo: true },
{ ID: "MOD_INVENTARIOS", Codigo: "M-004", Clave: "inventarios", Nombre: "Inventarios", Icono: "Package", Color: "#16a34a", Orden: 4, Roles: "administrador,supervisor", Estado: "activo", Activo: true },
{ ID: "MOD_COMPRAS", Codigo: "M-005", Clave: "compras", Nombre: "Compras", Icono: "ShoppingCart", Color: "#f59e0b", Orden: 5, Roles: "administrador,supervisor", Estado: "activo", Activo: true },
{ ID: "MOD_AUDITORIAS", Codigo: "M-006", Clave: "auditorias", Nombre: "Auditorias", Icono: "ClipboardCheck", Color: "#ef4444", Orden: 6, Roles: "administrador,supervisor", Estado: "activo", Activo: true },
{ ID: "MOD_INDICADORES", Codigo: "M-007", Clave: "indicadores", Nombre: "Indicadores", Icono: "TrendingUp", Color: "#06b6d4", Orden: 7, Roles: "administrador,supervisor", Estado: "activo", Activo: true },
{ ID: "MOD_EVIDENCIAS", Codigo: "M-008", Clave: "evidencias", Nombre: "Evidencias", Icono: "Image", Color: "#a855f7", Orden: 8, Roles: "administrador,supervisor,operador", Estado: "activo", Activo: true },
{ ID: "MOD_OBSERVACIONES", Codigo: "M-009", Clave: "observaciones", Nombre: "Observaciones", Icono: "MessageSquare", Color: "#64748b", Orden: 9, Roles: "administrador,supervisor,operador", Estado: "activo", Activo: true },
{ ID: "MOD_POLITICAS", Codigo: "M-010", Clave: "politicas", Nombre: "Politicas", Icono: "BookOpen", Color: "#0ea5e9", Orden: 10, Roles: "administrador,supervisor,operador", Estado: "activo", Activo: true },
{ ID: "MOD_PROCEDIMIENTOS", Codigo: "M-011", Clave: "procedimientos", Nombre: "Procedimientos", Icono: "Workflow", Color: "#f97316", Orden: 11, Roles: "administrador,supervisor,operador", Estado: "activo", Activo: true },
{ ID: "MOD_MANUALES", Codigo: "M-012", Clave: "manuales", Nombre: "Manuales", Icono: "FileText", Color: "#16a34a", Orden: 12, Roles: "administrador,supervisor,operador", Estado: "activo", Activo: true },
{ ID: "MOD_USUARIOS", Codigo: "M-013", Clave: "usuarios", Nombre: "Usuarios", Icono: "Users", Color: "#8b5cf6", Orden: 13, Roles: "administrador", Estado: "activo", Activo: true },
{ ID: "MOD_ROLES", Codigo: "M-014", Clave: "roles", Nombre: "Roles", Icono: "Shield", Color: "#ef4444", Orden: 14, Roles: "administrador", Estado: "activo", Activo: true },
{ ID: "MOD_PERMISOS", Codigo: "M-015", Clave: "permisos", Nombre: "Permisos", Icono: "KeyRound", Color: "#f59e0b", Orden: 15, Roles: "administrador", Estado: "activo", Activo: true },
{ ID: "MOD_EVENTOS", Codigo: "M-016", Clave: "eventos", Nombre: "Bitacora", Icono: "ScrollText", Color: "#64748b", Orden: 16, Roles: "administrador", Estado: "activo", Activo: true },
];

export const USUARIOS_SEED = [
{ ID: "USR_ADMIN", Codigo: "U-001", Nombre: "Administrador Demo", SedeID: "SEDE_TODAS", Sedes: "SEDE_TODAS", Estado: "activo", Rol: "administrador", Correo: "admin@dashi.demo", Email: "admin@dashi.demo", Telefono: "300-000-0000", Activo: true },
...SEDES_OPERATIVAS.map((s, i) => ({
ID: `USR_${s.Codigo}`,
Codigo: `U-0${String(i + 2).padStart(2, "0")}`,
Nombre: s.Responsable,
SedeID: s.ID,
Sedes: s.ID,
Estado: "activo",
Rol: "supervisor",
Correo: `${s.Codigo.toLowerCase()}@dashi.demo`,
Email: `${s.Codigo.toLowerCase()}@dashi.demo`,
Telefono: s.Telefono ?? "",
Activo: true,
})),
];

export const ROLES_SEED = [
{ ID: "ROL_ADMIN", Codigo: "R-001", Clave: "administrador", Nombre: "Administrador", Descripcion: "Acceso total al sistema", Color: "#ef4444", Nivel: 100, Estado: "activo", Activo: true },
{ ID: "ROL_SUP", Codigo: "R-002", Clave: "supervisor", Nombre: "Supervisor", Descripcion: "Gestion de su sede", Color: "#f97316", Nivel: 60, Estado: "activo", Activo: true },
{ ID: "ROL_OP", Codigo: "R-003", Clave: "operador", Nombre: "Operador", Descripcion: "Registro y consulta", Color: "#0ea5e9", Nivel: 30, Estado: "activo", Activo: true },
{ ID: "ROL_AUD", Codigo: "R-004", Clave: "auditor", Nombre: "Auditor", Descripcion: "Solo consulta y auditoria", Color: "#8b5cf6", Nivel: 20, Estado: "activo", Activo: true },
];

export const PERMISOS_SEED = [
{ ID: "PRM_1", Codigo: "P-001", Nombre: "Administrador total", Modulo: "operaciones", Accion: "eliminar", Rol: "administrador", Usuario: "", Permitido: true, Activo: true },
{ ID: "PRM_2", Codigo: "P-002", Nombre: "Supervisor edita inventarios", Modulo: "inventarios", Accion: "editar", Rol: "supervisor", Usuario: "", Permitido: true, Activo: true },
{ ID: "PRM_3", Codigo: "P-003", Nombre: "Supervisor crea compras", Modulo: "compras", Accion: "crear", Rol: "supervisor", Usuario: "", Permitido: true, Activo: true },
{ ID: "PRM_4", Codigo: "P-004", Nombre: "Operador consulta agenda", Modulo: "agenda", Accion: "ver", Rol: "operador", Usuario: "", Permitido: true, Activo: true },
{ ID: "PRM_5", Codigo: "P-005", Nombre: "Auditor consulta auditorias", Modulo: "auditorias", Accion: "ver", Rol: "auditor", Usuario: "", Permitido: true, Activo: true },
{ ID: "PRM_6", Codigo: "P-006", Nombre: "Operador no elimina", Modulo: "inventarios", Accion: "eliminar", Rol: "operador", Usuario: "", Permitido: false, Activo: true },
];

export const ESTADOS_SEED = [
{ ID: "EST_ACTIVO", Clave: "activo", Nombre: "Activo", Etiqueta: "Activo", Color: "#16a34a", Orden: 1, Activo: true },
{ ID: "EST_INACTIVO", Clave: "inactivo", Nombre: "Inactivo", Etiqueta: "Inactivo", Color: "#64748b", Orden: 2, Activo: true },
{ ID: "EST_PENDIENTE", Clave: "pendiente", Nombre: "Pendiente", Etiqueta: "Pendiente", Color: "#f59e0b", Orden: 3, Activo: true },
{ ID: "EST_APROBADO", Clave: "aprobado", Nombre: "Aprobado", Etiqueta: "Aprobado", Color: "#16a34a", Orden: 4, Activo: true },
{ ID: "EST_VIGENTE", Clave: "vigente", Nombre: "Vigente", Etiqueta: "Vigente", Color: "#0ea5e9", Orden: 5, Activo: true },
{ ID: "EST_PUBLICADO", Clave: "publicado", Nombre: "Publicado", Etiqueta: "Publicado", Color: "#0ea5e9", Orden: 6, Activo: true },
{ ID: "EST_BORRADOR", Clave: "borrador", Nombre: "Borrador", Etiqueta: "Borrador", Color: "#94a3b8", Orden: 7, Activo: true },
{ ID: "EST_REVISION", Clave: "revision", Nombre: "En revision", Etiqueta: "En revision", Color: "#f59e0b", Orden: 8, Activo: true },
];

export const ACCIONES_SEED = [
{ ID: "ACC_VER", Clave: "ver", Nombre: "Consultar", Etiqueta: "Consultar", Orden: 1, Activo: true },
{ ID: "ACC_CREAR", Clave: "crear", Nombre: "Crear", Etiqueta: "Crear", Orden: 2, Activo: true },
{ ID: "ACC_EDITAR", Clave: "editar", Nombre: "Editar", Etiqueta: "Editar", Orden: 3, Activo: true },
{ ID: "ACC_ELIMINAR", Clave: "eliminar", Nombre: "Eliminar", Etiqueta: "Eliminar", Orden: 4, Activo: true },
{ ID: "ACC_EXPORTAR", Clave: "exportar", Nombre: "Exportar", Etiqueta: "Exportar", Orden: 5, Activo: true },
{ ID: "ACC_APROBAR", Clave: "aprobar", Nombre: "Aprobar", Etiqueta: "Aprobar", Orden: 6, Activo: true },
];

// ─── fin del bloque de cabecera ───
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

type BaseCatalogo = {
ID: string;
Clave: string;
Nombre: string;
Etiqueta: string;
Color?: string;
Orden?: number;
Activo: boolean;
};

function aItems(catalogo: string, base: BaseCatalogo[]): ItemCatalogo[] {
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
