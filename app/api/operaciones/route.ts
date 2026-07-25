import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { pedirRecurso, registrarEvento, type EventoInput } from "@/lib/operaciones";

type ReglaRecurso = { lectura: boolean; escritura: boolean; eliminar: boolean };

const RESOURCE_REGISTRY: Record<string, ReglaRecurso> = {
  sedes:          { lectura: true, escritura: true, eliminar: true },
  actividades:    { lectura: true, escritura: true, eliminar: true },
  eventos:        { lectura: true, escritura: true, eliminar: false },
  modulos:        { lectura: true, escritura: true, eliminar: true },
  usuarios:       { lectura: true, escritura: true, eliminar: true },
  roles:          { lectura: true, escritura: true, eliminar: true },
  permisos:       { lectura: true, escritura: true, eliminar: true },
  catalogos:      { lectura: true, escritura: true, eliminar: true },
  items_catalogo: { lectura: true, escritura: true, eliminar: true },
  parametros:     { lectura: true, escritura: true, eliminar: true },
};

const ROLES_ESCRITURA = ["administrador", "supervisor"];
const ROLES_ELIMINAR = ["administrador"];

function rol(req: Request) {
  return (req.headers.get("x-usuario-rol") || "").toLowerCase();
}
function usuario(req: Request) {
  return { nombre: req.headers.get("x-usuario-nombre") || undefined, rol: rol(req) || undefined };
}
function recurso(req: Request): string | null {
  const r = new URL(req.url).searchParams.get("recurso");
  return r && r in RESOURCE_REGISTRY ? r : null;
}
function err(mensaje: string, status: number) {
  return NextResponse.json({ ok: false, error: mensaje }, { status });
}

export async function GET(request: Request) {
  const rec = recurso(request);
  if (!rec) return err("Recurso no registrado", 400);
  const sp = new URL(request.url).searchParams;
  const filtros: Record<string, unknown> = {};
  sp.forEach((v, k) => { if (k !== "recurso") filtros[k] = v; });
  const res = await pedirRecurso(rec, "GET", { filtros, tags: [rec] });
  return NextResponse.json(res, { status: res.ok ? 200 : 500 });
}

export async function POST(request: Request) {
  const rec = recurso(request);
  if (!rec) return err("Recurso no registrado", 400);
  const reglas = RESOURCE_REGISTRY[rec];
  if (rec !== "eventos" && !ROLES_ESCRITURA.includes(rol(request))) return err("No autorizado", 403);
  if (rec !== "eventos" && !reglas.escritura) return err("Recurso de solo lectura", 405);

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return err("JSON inválido", 400); }

  const res = rec === "eventos"
    ? await registrarEvento(body as unknown as EventoInput, usuario(request))
    : await pedirRecurso(rec, "POST", { payload: body, usuario: usuario(request) });

  if (res.ok) revalidateTag(rec);
  return NextResponse.json(res, { status: res.ok ? 200 : 500 });
}

export async function PUT(request: Request) {
  const rec = recurso(request);
  if (!rec) return err("Recurso no registrado", 400);
  if (!RESOURCE_REGISTRY[rec].escritura) return err("Recurso no editable", 405);
  if (!ROLES_ESCRITURA.includes(rol(request))) return err("No autorizado", 403);

  let body: { id?: string } & Record<string, unknown>;
  try { body = await request.json(); } catch { return err("JSON inválido", 400); }
  if (!body.id) return err("Falta el id", 400);

  const res = await pedirRecurso(rec, "PUT", { payload: body, usuario: usuario(request) });
  if (res.ok) revalidateTag(rec);
  return NextResponse.json(res, { status: res.ok ? 200 : 500 });
}

export async function DELETE(request: Request) {
  const rec = recurso(request);
  if (!rec) return err("Recurso no registrado", 400);
  if (!RESOURCE_REGISTRY[rec].eliminar) return err("Recurso no eliminable", 405);
  if (!ROLES_ELIMINAR.includes(rol(request))) return err("No autorizado", 403);

  let body: { id?: string };
  try { body = await request.json(); } catch { return err("JSON inválido", 400); }
  if (!body.id) return err("Falta el id", 400);

  const res = await pedirRecurso(rec, "DELETE", { payload: { id: body.id }, usuario: usuario(request) });
  if (res.ok) revalidateTag(rec);
  return NextResponse.json(res, { status: res.ok ? 200 : 500 });
}
