// lib/data/interfaces/data-provider.ts
// Contrato unico que TODO proveedor de datos del ERP debe implementar.
// Tanto el DemoProvider (mock con persistencia) como el GasProvider
// (Google Apps Script real) implementan esta misma interfaz.
// Cambiar entre uno y otro NO debe requerir tocar componentes, hooks ni servicios.

/** Respuesta estandar de cualquier operacion de datos. */
export interface Resp<T = unknown> {
    ok: boolean;
    data?: T;
    error?: string;
    total?: number;
}

/** Metodos soportados por la capa de datos. */
export type MetodoDatos =
    | "listar"
    | "obtener"
    | "crear"
    | "actualizar"
    | "eliminar";

/** Filtros / opciones de consulta y mutacion. */
export interface OpcionesDatos {
    payload?: Record<string, unknown>;
    filtros?: Record<string, unknown>;
    usuario?: string;
    id?: string;
    buscar?: string;
    ordenarPor?: string;
    orden?: "asc" | "desc";
    pagina?: number;
    porPagina?: number;
    incluirInactivas?: boolean;
    tags?: string[];
    revalidate?: number | false;
}

/**
 * Contrato central. `pedir` es el punto unico de entrada a los datos.
  * Recibe el nombre del recurso, el metodo y las opciones, y devuelve Resp<T>.
   */
export interface DataProvider {
    readonly nombre: string;
    pedir<T = unknown>(
          recurso: string,
          metodo: MetodoDatos,
          opciones?: OpcionesDatos
        ): Promise<Resp<T>>;
}
