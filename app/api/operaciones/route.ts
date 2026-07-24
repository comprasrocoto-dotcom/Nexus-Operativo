import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import {
  crearSede,
  actualizarSede,
  eliminarSede,
  crearActividad,
  actualizarActividad,
  eliminarActividad,
  fetchSedes,
  fetchActividades,
  fetchEventos,
  fetchModulos,
  registrarEvento,
  type SedeInput,
  type ActividadInput,
  type EventoInput,
} from "@/lib/operaciones";

// Ruta única del Centro de Operaciones. El recurso se elige con ?recurso=...
// Recursos: sedes | actividades | eventos | modulos. Añadir uno futuro = registrar
// sus handlers aquí; el resto de la arquitectura no cambia.
// La validación real de identidad vive en el backend GAS; aquí solo un chequeo de
// rol de puerta (placeholder via header x-usuario-rol) antes de mutar.
const ROLES_ESCRITURA = ["administrador", "supervisor"];
const ROLES_ELIMINAR = ["administrador"];

type Recurso = "sedes" | "actividades" | "eventos" | "modulos";
const RECURSOS: Recurso[] = ["sedes", "actividades", "eventos", "modulos"];

function rolDeSolicitud(request: Request): string {
  return (request.headers.get("x-usuario-rol") || "").toLowerCase();
}

function recursoDeSolicitud(request: Request): Recurso | null {
  const r = new URL(request.url).searchParams.get("recurso");
  return RECURSOS.includes(r as Recurso) ? (r as Recurso) : null;
}

function usuarioDeSolicitud(request: Request) {
  return {
    nombre: request.headers.get("x-usuario-nombre") || undefined,
    rol: rolDeSolicitud(request) || undefined,
  };
}

function error(mensaje: string, status: number) {
  return NextResponse.json({ ok: false, error: mensaje }, { status });
}

// ─── GET: lectura de cualquier recurso (para hidratación en cliente / Timeline) ───
export async function GET(request: Request) {
  const recurso = recursoDeSolicitud(request);
  if (!recurso) return error("Falta ?recurso=sedes|actividades|eventos|modulos", 400);
  const sp = new URL(request.url).searchParams;
  const filtros: Record<string, unknown> = {};
  sp.forEach((v, k) => { if (k !== "recurso") filtros[k] = v; });

  let resultado;
  if (recurso === "sedes") resultado = await fetchSedes(filtros);
  else if (recurso === "actividades") resultado = await fetchActividades(filtros);
  else if (recurso === "eventos") resultado = await fetchEventos(filtros);
  else resultado = await fetchModulos(filtros);

  return NextResponse.json(resultado, { status: resultado.ok ? 200 : 500 });
}

export async function POST(request: Request) {
  const recurso = recursoDeSolicitud(request);
  if (!recurso) return error("Falta ?recurso", 400);
  // Los eventos pueden registrarse por cualquier rol autenticado (bitácora del sistema).
  if (recurso !== "eventos" && !ROLES_ESCRITURA.includes(rolDeSolicitud(request)))
    return error("No autorizado", 403);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return error("JSON inválido", 400);
  }

  const usuario = usuarioDeSolicitud(request);
  let resultado;
  if (recurso === "sedes") resultado = await crearSede(body as unknown as SedeInput, usuario);
  else if (recurso === "actividades") resultado = await crearActividad(body as unknown as ActividadInput, usuario);
  else if (recurso === "eventos") resultado = await registrarEvento(body as unknown as EventoInput, usuario);
  else return error("Recurso de solo lectura", 405);

  if (resultado.ok) revalidateTag(recurso);
  return NextResponse.json(resultado, { status: resultado.ok ? 200 : 500 });
}

export async function PUT(request: Request) {
  const recurso = recursoDeSolicitud(request);
  if (!recurso) return error("Falta ?recurso", 400);
  if (!ROLES_ESCRITURA.includes(rolDeSolicitud(request))) return error("No autorizado", 403);

  let body: { id?: string } & Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return error("JSON inválido", 400);
  }
  if (!body.id) return error("Falta el id", 400);

  const usuario = usuarioDeSolicitud(request);
  const { id, ...cambios } = body;
  let resultado;
  if (recurso === "sedes") resultado = await actualizarSede(id, cambios as Partial<SedeInput>, usuario);
  else if (recurso === "actividades") resultado = await actualizarActividad(id, cambios as Partial<ActividadInput>, usuario);
  else return error("Recurso no editable por esta ruta", 405);

  if (resultado.ok) revalidateTag(recurso);
  return NextResponse.json(resultado, { status: resultado.ok ? 200 : 500 });
}

export async function DELETE(request: Request) {
  const recurso = recursoDeSolicitud(request);
  if (!recurso) return error("Falta ?recurso", 400);
  if (!ROLES_ELIMINAR.includes(rolDeSolicitud(request))) return error("No autorizado", 403);

  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return error("JSON inválido", 400);
  }
  if (!body.id) return error("Falta el id", 400);

  const usuario = usuarioDeSolicitud(request);
  let resultado;
  if (recurso === "sedes") resultado = await eliminarSede(body.id, usuario);
  else if (recurso === "actividades") resultado = await eliminarActividad(body.id, usuario);
  else return error("Recurso no eliminable por esta ruta", 405);

  if (resultado.ok) revalidateTag(recurso);
  return NextResponse.json(resultado, { status: resultado.ok ? 200 : 500 });
}
