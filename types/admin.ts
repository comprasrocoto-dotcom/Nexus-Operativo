// types/admin.ts — Sistema de tipos data-driven para el nucleo administrativo del ERP.
// Toda pantalla de administracion (Modulos, Usuarios, Roles, Permisos, Catalogos,
// Parametros) se describe con estas configuraciones. Ningun modulo se hardcodea:
// se registra una DefinicionRecurso y el CRUD generico hace el resto.

// ─── Tipos de campo soportados por el formulario/tabla genericos ───
export type TipoCampo =
  | "texto"
  | "textarea"
  | "numero"
  | "booleano"
  | "select"
  | "multiselect"
  | "color"
  | "icono"
  | "fecha"
  | "email"
  | "imagen"
  | "etiquetas";

// Una opcion de un campo select/multiselect. value siempre string para el Sheet.
export type OpcionCampo = { value: string; label: string; color?: string };

// Definicion de un campo del recurso. Describe como se renderiza y valida.
export type CampoRecurso = {
  clave: string;              // nombre de la columna en el Sheet (ej. "Nombre")
  etiqueta: string;           // texto visible en formulario y cabecera de tabla
  tipo: TipoCampo;
  requerido?: boolean;
  soloLectura?: boolean;      // se muestra pero no se edita (ej. ID, FechaCreacion)
  enTabla?: boolean;          // aparece como columna en la lista (default: true)
  enFormulario?: boolean;     // aparece en el formulario (default: true)
  ancho?: "auto" | "min" | "max";
  placeholder?: string;
  ayuda?: string;
  opciones?: OpcionCampo[];   // para select/multiselect
  // Catalogo del que se alimentan las opciones dinamicamente (ej. "roles").
  // Si se define, las opciones se cargan en runtime y NO se hardcodean.
  catalogo?: string;
  valorDefecto?: unknown;
};

// Accion CRUD/extendida que un recurso puede exponer. Data-driven: la barra de
// acciones del CRUD generico se construye a partir de esta lista.
export type AccionRecurso =
  | "crear"
  | "editar"
  | "eliminar"
  | "consultar"
  | "activar"
  | "desactivar"
  | "exportar"
  | "importar"
  | "aprobar"
  | "publicar";

// Definicion completa de un recurso administrable. Es la unidad reutilizable:
// Inventarios, Compras, Auditorias, Usuarios, Proveedores, etc. se declaran asi.
export type DefinicionRecurso = {
  recurso: string;            // clave del recurso en /api/operaciones?recurso=
  titulo: string;             // titulo del gestor (ej. "Usuarios")
  singular: string;           // ej. "usuario" (para mensajes y botones)
  icono?: string;             // nombre de icono lucide
  descripcion?: string;
  campoId?: string;           // columna que actua como id (default: "ID")
  campoEtiqueta?: string;     // columna usada como titulo de cada fila (default: "Nombre")
  campos: CampoRecurso[];
  acciones?: AccionRecurso[]; // default: crear/editar/eliminar/consultar
  // Modulo y entidad para el registro automatico de eventos en Op_Eventos.
  moduloEvento?: string;
  entidadEvento?: string;
  // Si el recurso se filtra por sede. Muchos recursos admin son globales.
  porSede?: boolean;
};

// ─── Dominio administrativo: entidades concretas ───

// Rol administrable desde la web (nada hardcodeado en codigo).
export type Rol = {
  ID: string;
  Clave: string;              // ej. "administrador"
  Nombre: string;             // ej. "Administrador"
  Descripcion?: string;
  Color?: string;
  Nivel?: number;             // jerarquia; mayor = mas privilegios
  Activo?: boolean;
};

// Permiso dinamico: relaciona modulo + accion + rol (o usuario).
export type Permiso = {
  ID: string;
  Modulo: string;             // clave del modulo (Op_Modulos.Clave)
  Accion: string;             // crear | editar | eliminar | exportar | importar | aprobar | publicar | eliminar
  Rol?: string;               // clave del rol al que aplica
  Usuario?: string;           // opcional: permiso a nivel de usuario concreto
  Permitido: boolean;
};

// Valor de un catalogo/lista maestra (Tipos de actividad, Prioridades, Estados...).
export type ItemCatalogo = {
  ID: string;
  Catalogo: string;           // clave del catalogo (ej. "prioridades")
  Clave: string;
  Etiqueta: string;
  Color?: string;
  Icono?: string;
  Orden?: number;
  Activo?: boolean;
};

// Catalogo (lista maestra) declarado desde la web.
export type Catalogo = {
  ID: string;
  Clave: string;              // ej. "prioridades"
  Nombre: string;             // ej. "Prioridades"
  Descripcion?: string;
  Icono?: string;
  Activo?: boolean;
};

// Parametro global del sistema (clave/valor tipado).
export type Parametro = {
  ID: string;
  Clave: string;              // ej. "empresa.nombre"
  Nombre: string;
  Valor: string;
  Tipo?: TipoCampo;           // como se edita el valor
  Grupo?: string;             // ej. "Empresa", "Google", "Notificaciones"
  Descripcion?: string;
};

// Definicion de widget del dashboard administrativo (reutilizable/configurable).
export type DefinicionWidget = {
  clave: string;
  titulo: string;
  icono?: string;
  color?: string;
  // De donde saca el numero: recurso a contar y filtros opcionales.
  recurso?: string;
  filtros?: Record<string, string | number | boolean>;
  formato?: "numero" | "moneda" | "porcentaje";
  descripcion?: string;
};
