// lib/data/providers/gas-provider.ts
// Proveedor real (Google Apps Script). Implementa IDataProvider reutilizando
// el nucleo YA existente en lib/operaciones.ts (pedirRecurso). NO duplica la logica de red.

import type { IDataProvider, MetodoDatos, OpcionesDatos, Resp } from "@/lib/data/interfaces/data-provider";
import { pedirRecurso } from "@/lib/operaciones";

const MAP: Record<MetodoDatos, "GET" | "POST" | "PUT" | "DELETE"> = {
  listar: "GET",
  obtener: "GET",
  crear: "POST",
  actualizar: "PUT",
  eliminar: "DELETE",
};

export class GasProvider implements IDataProvider {
  readonly nombre = "gas";

  async pedir<T = unknown>(recurso: string, metodo: MetodoDatos, opciones: OpcionesDatos = {}): Promise<Resp<T>> {
    const res = await pedirRecurso<T>(recurso, MAP[metodo], {
      payload: opciones.payload,
      filtros: opciones.filtros,
      usuario: opciones.usuario ? { nombre: opciones.usuario } : undefined,
      tags: opciones.tags,
    });
    return res as Resp<T>;
  }
}

export const gasProvider = new GasProvider();
