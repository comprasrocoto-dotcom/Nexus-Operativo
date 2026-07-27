// lib/data/storage/local-storage.ts
// Capa de persistencia del DemoProvider. Aisla el acceso a localStorage para que
// el provider sea testeable y no rompa en SSR (donde localStorage no existe).

const PREFIJO = "nexus_erp_demo::";
const memoria = new Map<string, string>(); // fallback SSR / sin localStorage

function disponible(): boolean {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

export function leerColeccion<T = Record<string, unknown>>(recurso: string): T[] {
  const clave = PREFIJO + recurso;
  try {
    const raw = disponible() ? window.localStorage.getItem(clave) : memoria.get(clave);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function guardarColeccion<T = Record<string, unknown>>(recurso: string, datos: T[]): void {
  const clave = PREFIJO + recurso;
  const raw = JSON.stringify(datos ?? []);
  try {
    if (disponible()) window.localStorage.setItem(clave, raw);
    else memoria.set(clave, raw);
  } catch {
    memoria.set(clave, raw);
  }
}

export function existeColeccion(recurso: string): boolean {
  const clave = PREFIJO + recurso;
  try {
    return disponible() ? window.localStorage.getItem(clave) !== null : memoria.has(clave);
  } catch {
    return memoria.has(clave);
  }
}
