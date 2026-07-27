// lib/data/seed/dashi-seed.ts
// Datos semilla REALES del Grupo DASHI S.A.S. para el DemoProvider.
// Todo se relaciona con la sede mediante SedeID. Coherente y listo para demo.

export const SEDES_SEED = [
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

function porSede<T>(fn: (sede: (typeof SEDES_OPERATIVAS)[number], i: number) => T[]): T[] {
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

export const ACTIVIDADES_SEED = porSede((s, i) => [
  { ID: `ACT_${s.Codigo}_1`, Codigo: `ACT-${s.Codigo}-001`, Nombre: "Apertura de local", SedeID: s.ID, Sedes: s.ID, Tipo: "Operativa", Area: "Operaciones", Estado: "Programada", Prioridad: "Alta", Fecha: "2026-07-28", HoraInicio: "07:00", HoraFin: "08:00", Responsable: s.Responsable, Activo: true },
  { ID: `ACT_${s.Codigo}_2`, Codigo: `ACT-${s.Codigo}-002`, Nombre: "Cierre de caja", SedeID: s.ID, Sedes: s.ID, Tipo: "Administrativa", Area: "Finanzas", Estado: "Programada", Prioridad: "Media", Fecha: "2026-07-28", HoraInicio: "22:00", HoraFin: "22:30", Responsable: s.Responsable, Activo: true },
]);

export const EVIDENCIAS_SEED = porSede((s, i) => [
  { ID: `EVD_${s.Codigo}_1`, Codigo: `EV-${s.Codigo}-001`, Nombre: "Foto limpieza cocina", SedeID: s.ID, Estado: "Cargada", Tipo: "Imagen", RutaDrive: "/demo/evidencias/cocina.jpg", Responsable: s.Responsable, Activo: true },
]);

export const INDICADORES_SEED = porSede((s, i) => [
  { ID: `IND_${s.Codigo}_1`, Codigo: `KPI-${s.Codigo}-001`, Nombre: "Ventas del dia", SedeID: s.ID, Valor: 2500000 + i * 150000, Unidad: "COP", Meta: 3000000, Estado: "En seguimiento", Activo: true },
  { ID: `IND_${s.Codigo}_2`, Codigo: `KPI-${s.Codigo}-002`, Nombre: "Satisfaccion cliente", SedeID: s.ID, Valor: 90 + i, Unidad: "%", Meta: 95, Estado: "En seguimiento", Activo: true },
]);

export const POLITICAS_SEED = [
  { ID: "POL_1", Codigo: "POL-001", Nombre: "Politica de manipulacion de alimentos", SedeID: "SEDE_TODAS", Estado: "Publicada", Responsable: "Calidad", Activo: true },
  { ID: "POL_2", Codigo: "POL-002", Nombre: "Politica de seguridad y salud en el trabajo", SedeID: "SEDE_TODAS", Estado: "Publicada", Responsable: "SST", Activo: true },
];

export const PROCEDIMIENTOS_SEED = [
  { ID: "PRC_1", Codigo: "PRC-001", Nombre: "Procedimiento de apertura de sede", SedeID: "SEDE_TODAS", Estado: "Vigente", Responsable: "Operaciones", Activo: true },
  { ID: "PRC_2", Codigo: "PRC-002", Nombre: "Procedimiento de cierre de caja", SedeID: "SEDE_TODAS", Estado: "Vigente", Responsable: "Finanzas", Activo: true },
];

export const MANUALES_SEED = [
  { ID: "MAN_1", Codigo: "MAN-001", Nombre: "Manual de operaciones", SedeID: "SEDE_TODAS", Estado: "Publicado", Responsable: "Operaciones", Activo: true },
  { ID: "MAN_2", Codigo: "MAN-002", Nombre: "Manual del empleado", SedeID: "SEDE_TODAS", Estado: "Publicado", Responsable: "RRHH", Activo: true },
];

export const USUARIOS_SEED = [
  { ID: "USR_ADMIN", Codigo: "U-001", Nombre: "Administrador Demo", SedeID: "SEDE_TODAS", Estado: "Activo", Rol: "administrador", Email: "admin@dashi.demo", Activo: true },
  ...SEDES_OPERATIVAS.map((s, i) => ({ ID: `USR_${s.Codigo}`, Codigo: `U-00${i + 2}`, Nombre: s.Responsable, SedeID: s.ID, Estado: "Activo", Rol: "supervisor", Email: `${s.Codigo.toLowerCase()}@dashi.demo`, Activo: true })),
];

export const ROLES_SEED = [
  { ID: "ROL_ADMIN", Codigo: "R-001", Nombre: "Administrador", Clave: "administrador", Descripcion: "Acceso total al sistema", Activo: true },
  { ID: "ROL_SUP", Codigo: "R-002", Nombre: "Supervisor", Clave: "supervisor", Descripcion: "Gestion de su sede", Activo: true },
  { ID: "ROL_OP", Codigo: "R-003", Nombre: "Operador", Clave: "operador", Descripcion: "Solo consulta", Activo: true },
];

export const PERMISOS_SEED = [
  { ID: "PRM_1", Codigo: "P-001", Nombre: "Lectura", Clave: "lectura", Rol: "operador", Activo: true },
  { ID: "PRM_2", Codigo: "P-002", Nombre: "Escritura", Clave: "escritura", Rol: "supervisor", Activo: true },
  { ID: "PRM_3", Codigo: "P-003", Nombre: "Eliminacion", Clave: "eliminar", Rol: "administrador", Activo: true },
];

export const EVENTOS_SEED = [
  { ID: "EVT_1", Fecha: "2026-07-27", Hora: "08:00", Usuario: "Administrador Demo", Modulo: "sedes", Entidad: "Sede", EntidadID: "SEDE_ROCOTO", SedeID: "SEDE_ROCOTO", TipoEvento: "SEDE_CREADA", Descripcion: "Sede Rocoto registrada", Nivel: "exito", Icono: "building", Color: "green" },
  { ID: "EVT_2", Fecha: "2026-07-27", Hora: "09:15", Usuario: "Administrador Demo", Modulo: "inventarios", Entidad: "Inventario", EntidadID: "INV_RCT_1", SedeID: "SEDE_ROCOTO", TipoEvento: "INVENTARIO_ACTUALIZADO", Descripcion: "Aceite vegetal 20L actualizado", Nivel: "info", Icono: "package", Color: "blue" },
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
  usuarios: USUARIOS_SEED,
  roles: ROLES_SEED,
  permisos: PERMISOS_SEED,
  eventos: EVENTOS_SEED,
};
