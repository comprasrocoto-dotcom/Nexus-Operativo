import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import {
  crearSede,
  actualizarSede,
  eliminarSede,
  crearActividad,
  actualizarActividad,
  eliminarActividad,
  type SedeInput,
  type ActividadInput,
} from "@/lib/operaciones";

// Ruta unica para el Centro de Operaciones. El recurso se elige con ?recurso=sedes
// o ?recurso=actividades. La validacion real de identidad vive en el backend GAS
// (Auth_validarToken / hojas Usuarios, Roles, Sesiones); aqui solo hacemos un
// chequeo de rol de puerta (placeholder via header x-usuario-rol) antes de mutar.
const ROLES_ESCRITURA = ["administrador", "supervisor"];
const ROLES_ELIMINAR = ["administrador"];

type Recurso = "sedes" | "actividades";

function rolDeSolicitud(request: Request): string {
  return (request.headers.get("x-usuario-rol") || "").toLowerCase();
}

function recursoDeSolicitud(request: Request): Recurso | null {
  const r = new URL(request.url).searchParams.get("recurso");
  return r === "sedes" || r === "actividades" ? r : null;
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

export async function POST(request: Request) {
  const recurso = recursoDeSolicitud(request);
  if (!recurso) return error("Falta ?recurso=sedes|actividades", 400);
  if (!ROLES_ESCRITURA.includes(rolDeSolicitud(request))) return error("No autorizado", 403);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return error("JSON invalido", 400);
  }

  const usuario = usuarioDeSolicitud(request);
  const resultado =
    recurso === "sedes"
      ? await crearSede(body as unknown as SedeInput, usuario)
      : await crearActividad(body as unknown as ActividadInput, usuario);

  if (resultado.ok) revalidateTag(recurso);
  return NextResponse.json(resultado, { status: resultado.ok ? 200 : 500 });
}

export async function PUT(request: Request) {
  const recurso = recursoDeSolicitud(request);
  if (!recurso) return error("Falta ?recurso=sedes|actividades", 400);
  if (!ROLES_ESCRITURA.includes(rolDeSolicitud(request))) return error("No autorizado", 403);

  let body: { id?: string } & Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return error("JSON invalido", 400);
  }
  if (!body.id) return error("Falta el id", 400);

  const usuario = usuarioDeSolicitud(request);
  const { id, ...cambios } = body;
  const resultado =
    recurso === "sedes"
      ? await actualizarSede(id, cambios as Partial<SedeInput>, usuario)
      : await actualizarActividad(id, cambios as Partial<ActividadInput>, usuario);

  if (resultado.ok) revalidateTag(recurso);
  return NextResponse.json(resultado, { status: resultado.ok ? 200 : 500 });
}

export async function DELETE(request: Request) {
  const recurso = recursoDeSolicitud(request);
  if (!recurso) return error("Falta ?recurso=sedes|actividades", 400);
  if (!ROLES_ELIMINAR.includes(rolDeSolicitud(request))) return error("No autorizado", 403);

  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return error("JSON invalido", 400);
  }
  if (!body.id) return error("Falta el id", 400);

  const usuario = usuarioDeSolicitud(request);
  const resultado =
    recurso === "sedes"
      ? await eliminarSede(body.id, usuario)
      : await eliminarActividad(body.id, usuario);

  if (resultado.ok) revalidateTag(recurso);
  return NextResponse.json(resultado, { status: resultado.ok ? 200 : 500 });
}
