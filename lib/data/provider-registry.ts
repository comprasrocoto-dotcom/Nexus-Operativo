// lib/data/provider-registry.ts
// ProviderRegistry: registra todos los proveedores y decide cual esta activo.
// Cambiar de proveedor NO requiere tocar componentes, hooks, servicios ni vistas.

import type { IDataProvider } from "@/lib/data/interfaces/data-provider";
import { demoProvider } from "@/lib/data/providers/demo-provider";
import { gasProvider } from "@/lib/data/providers/gas-provider";

const REGISTRO: Record<string, IDataProvider> = {
  demo: demoProvider,
  gas: gasProvider,
  // Preparado para el futuro: se registran igual, sin tocar consumidores.
  // api: futureApiProvider,
  // db: futureDatabaseProvider,
};

// Seleccion del proveedor activo.
// Regla: si hay backend GAS configurado se usa "gas"; si no, "demo".
// Se puede forzar con NEXT_PUBLIC_DATA_PROVIDER = "demo" | "gas".
function claveActiva(): string {
  const forzado = process.env.NEXT_PUBLIC_DATA_PROVIDER;
  if (forzado && REGISTRO[forzado]) return forzado;
  const hayGas =
    typeof process !== "undefined" &&
    !!(process.env.GAS_EXEC_URL && process.env.GAS_API_KEY);
  return hayGas ? "gas" : "demo";
}

export function getProvider(): IDataProvider {
  return REGISTRO[claveActiva()] ?? demoProvider;
}

export function registrarProvider(clave: string, provider: IDataProvider): void {
  REGISTRO[clave] = provider;
}

export function proveedorActivo(): string {
  return claveActiva();
}
