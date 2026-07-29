// lib/data/storage/local-storage.ts
// Capa de persistencia del DemoProvider. Aisla el acceso a localStorage para que
// el provider sea testeable y no rompa en SSR (donde localStorage no existe).
// Incluye versionado de semilla: si SEED_VERSION cambia, el almacenamiento demo
// se purga una sola vez y se vuelve a sembrar con los datos nuevos.

import { SEED_VERSION } from "@/lib/data/seed/dashi-seed";

const PREFIJO = "nexus_erp_demo::";
const CLAVE_VERSION = PREFIJO + "__version";
const memoria = new Map<string, string>(); // fallback SSR / sin localStorage

let versionVerificada = false;

function disponible(): boolean {
try {
return typeof window !== "undefined" && !!window.localStorage;
} catch {
return false;
}
}

// Purga el almacenamiento demo cuando cambia la version de la semilla.
// Idempotente: se ejecuta como maximo una vez por carga de pagina.
export function asegurarVersion(): void {
if (versionVerificada) return;
versionVerificada = true;
try {
if (!disponible()) {
if (memoria.get(CLAVE_VERSION) !== SEED_VERSION) {
memoria.clear();
memoria.set(CLAVE_VERSION, SEED_VERSION);
}
return;
}
if (window.localStorage.getItem(CLAVE_VERSION) === SEED_VERSION) return;
const obsoletas: string[] = [];
for (let i = 0; i < window.localStorage.length; i++) {
const k = window.localStorage.key(i);
if (k && k.startsWith(PREFIJO)) obsoletas.push(k);
}
for (const k of obsoletas) window.localStorage.removeItem(k);
window.localStorage.setItem(CLAVE_VERSION, SEED_VERSION);
} catch {
return;
}
}

export function leerColeccion<T = Record<string, unknown>>(recurso: string): T[] {
asegurarVersion();
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
asegurarVersion();
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
asegurarVersion();
const clave = PREFIJO + recurso;
try {
return disponible() ? window.localStorage.getItem(clave) !== null : memoria.has(clave);
} catch {
return memoria.has(clave);
}
}

// Reinicia por completo el almacenamiento demo (util para el boton "Restablecer demo").
export function reiniciarAlmacenamiento(): void {
try {
if (disponible()) {
const claves: string[] = [];
for (let i = 0; i < window.localStorage.length; i++) {
const k = window.localStorage.key(i);
if (k && k.startsWith(PREFIJO)) claves.push(k);
}
for (const k of claves) window.localStorage.removeItem(k);
window.localStorage.setItem(CLAVE_VERSION, SEED_VERSION);
} else {
memoria.clear();
memoria.set(CLAVE_VERSION, SEED_VERSION);
}
} catch {
return;
}
}
