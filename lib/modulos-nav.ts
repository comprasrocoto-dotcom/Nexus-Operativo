// lib/modulos-nav.ts — Navegacion y mapeo data-driven de los modulos del ERP.
// Fuente unica de verdad para: a que ruta lleva cada modulo, que coleccion del
// DataProvider lo alimenta y como se infiere su definicion CRUD cuando no esta
// declarada en lib/admin.ts. Lo consumen la portada, el sidebar y /modulos/[slug].

import type { CampoRecurso, DefinicionRecurso, TipoCampo } from "@/types/admin";

// ─── Rutas dedicadas. Si un modulo no esta aqui, cae en /modulos/<clave> ───
export const RUTAS_MODULO: Record<string, string> = {
  politicas: "/politicas",
  procedimientos: "/procedimientos",
  manuales: "/manuales",
  sedes: "/operaciones/sedes",
  operaciones: "/operaciones/sedes",
  usuarios: "/admin",
  roles: "/admin",
  permisos: "/admin",
  catalogos: "/admin",
  parametros: "/admin",
  eventos: "/admin",
  bitacora: "/admin",
};

export function rutaModulo(clave: string): string {
  return RUTAS_MODULO[clave] ?? "/modulos/" + clave;
}

// ─── Modulo -> coleccion del DataProvider que lo alimenta ───
export const RECURSO_MODULO: Record<string, string> = {
  operaciones: "sedes",
  agenda: "actividades",
  bitacora: "eventos",
};

export function recursoDeModulo(clave: string): string {
  return RECURSO_MODULO[clave] ?? clave;
}

// ─── Inferencia de definicion CRUD a partir de los datos reales ───
// Permite que CUALQUIER modulo nuevo tenga tabla + formulario sin escribir
// una pantalla. Si el recurso ya esta declarado en RECURSOS_ADMIN se usa aquel.

const CATALOGO_DE: Record<string, string> = {
  SedeID: "sedes",
};

const ETIQUETA_DE: Record<string, string> = {
  SedeID: "Sede",
  ID: "ID",
};

function tipoDe(clave: string, valor: unknown): TipoCampo {
  if (typeof valor === "boolean") return "booleano";
  if (typeof valor === "number") return "numero";
  const c = clave.toLowerCase();
  if (c === "color") return "color";
  if (c === "icono") return "icono";
  if (c.includes("correo") || c.includes("email")) return "email";
  if (c.startsWith("fecha") || c === "vigencia" || c === "vence") return "fecha";
  if (c.includes("descripcion") || c.includes("observacion") || c.includes("nota")) return "textarea";
  return "texto";
}

const CAMPOS_MINIMOS: CampoRecurso[] = [
  { clave: "ID", etiqueta: "ID", tipo: "texto", soloLectura: true, enFormulario: false },
  { clave: "Nombre", etiqueta: "Nombre", tipo: "texto", requerido: true },
  { clave: "Descripcion", etiqueta: "Descripcion", tipo: "textarea", enTabla: false },
  { clave: "SedeID", etiqueta: "Sede", tipo: "select", catalogo: "sedes" },
  { clave: "Estado", etiqueta: "Estado", tipo: "texto" },
];

export function definicionInferida(
  recurso: string,
  titulo: string,
  singular: string,
  muestras: Record<string, unknown>[],
): DefinicionRecurso {
  const claves: string[] = [];
  for (const m of muestras) {
    for (const k of Object.keys(m)) if (!claves.includes(k)) claves.push(k);
  }

  const campos: CampoRecurso[] =
    claves.length === 0
      ? CAMPOS_MINIMOS
      : claves.map((k) => {
          const muestra = muestras.find((m) => m[k] !== undefined && m[k] !== null && m[k] !== "");
          const valor = muestra ? muestra[k] : undefined;
          const catalogo = CATALOGO_DE[k];
          const campo: CampoRecurso = {
            clave: k,
            etiqueta: ETIQUETA_DE[k] ?? k,
            tipo: catalogo ? "select" : tipoDe(k, valor),
          };
          if (catalogo) campo.catalogo = catalogo;
          if (k === "ID") {
            campo.soloLectura = true;
            campo.enFormulario = false;
          }
          if (campo.tipo === "textarea") campo.enTabla = false;
          return campo;
        });

  const campoEtiqueta = claves.includes("Nombre")
    ? "Nombre"
    : claves.includes("Titulo")
      ? "Titulo"
      : claves.includes("Descripcion")
        ? "Descripcion"
        : "ID";

  return {
    recurso,
    titulo,
    singular,
    campoId: "ID",
    campoEtiqueta,
    campos,
    acciones: ["crear", "editar", "eliminar", "consultar"],
    moduloEvento: recurso,
    entidadEvento: singular,
  };
}
