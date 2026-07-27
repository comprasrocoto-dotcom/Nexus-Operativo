// lib/data/client.ts
// dataClient: fachada unica que TODA la app usa para hablar con los datos.
// Traduce el estilo HTTP (recurso + metodo REST) al IDataProvider activo.
// - Con DemoProvider: opera en localStorage (cliente), CRUD real y persistente.
// - Con GasProvider: delega en la API/GAS existente.
// Devuelve SIEMPRE la misma forma { ok, data, error, total } que ya espera la UI.

import type { OpcionesDatos, Resp, MetodoDatos } from "@/lib/data/interfaces/data-provider";
import { getProvider, proveedorActivo } from "@/lib/data/provider-registry";

const REST_A_METODO: Record<string, MetodoDatos> = {
  GET: "listar",
  POST: "crear",
  PUT: "actualizar",
  DELETE: "eliminar",
};

// Punto unico que reemplaza a fetch("/api/operaciones?...") en el cliente.
export async function dataRequest<T = unknown>(
  recurso: string,
  metodoRest: string,
  opciones: OpcionesDatos = {}
): Promise<Resp<T>> {
  const metodo = REST_A_METODO[metodoRest.toUpperCase()] ?? "listar";
  return getProvider().pedir<T>(recurso, metodo, opciones);
}

// Indica si el proveedor activo opera en el navegador (Demo) o via red (Gas).
export function esProveedorLocal(): boolean {
  return proveedorActivo() === "demo";
}
