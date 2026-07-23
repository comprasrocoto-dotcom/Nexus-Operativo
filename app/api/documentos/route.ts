import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import {
    crearDocumento,
    actualizarDocumento,
    eliminarDocumento,
    type DocumentoInput,
} from "@/lib/gas";

// Roles con permiso de escritura. La validacion real de identidad vive en el
// backend GAS (Auth_validarToken / hojas Usuarios, Roles, Sesiones). Aqui solo
// hacemos un chequeo de rol de puerta antes de reenviar la mutacion.
const ROLES_ESCRITURA = ["administrador", "supervisor"];
const ROLES_ELIMINAR = ["administrador"];

function rolDeSolicitud(request: Request): string {
    return (request.headers.get("x-usuario-rol") || "").toLowerCase();
}

function sinPermiso() {
    return NextResponse.json(
      { ok: false, error: "No autorizado para esta accion" },
      { status: 403 }
        );
}

export async function POST(request: Request) {
    const rol = rolDeSolicitud(request);
    if (!ROLES_ESCRITURA.includes(rol)) return sinPermiso();

  let body: DocumentoInput;
    try {
          body = (await request.json()) as DocumentoInput;
    } catch {
          return NextResponse.json({ ok: false, error: "JSON invalido" }, { status: 400 });
    }

  const resultado = await crearDocumento(body);
    if (resultado.ok) revalidateTag("politicas");
    return NextResponse.json(resultado, { status: resultado.ok ? 200 : 500 });
}

export async function PUT(request: Request) {
    const rol = rolDeSolicitud(request);
    if (!ROLES_ESCRITURA.includes(rol)) return sinPermiso();

  let body: { id?: string } & Partial<DocumentoInput>;
    try {
          body = await request.json();
    } catch {
          return NextResponse.json({ ok: false, error: "JSON invalido" }, { status: 400 });
    }

  if (!body.id) {
        return NextResponse.json({ ok: false, error: "Falta el id del documento" }, { status: 400 });
  }

  const { id, ...cambios } = body;
    const resultado = await actualizarDocumento(id, cambios);
    if (resultado.ok) revalidateTag("politicas");
    return NextResponse.json(resultado, { status: resultado.ok ? 200 : 500 });
}

export async function DELETE(request: Request) {
    const rol = rolDeSolicitud(request);
    if (!ROLES_ELIMINAR.includes(rol)) return sinPermiso();

  let body: { id?: string };
    try {
          body = await request.json();
    } catch {
          return NextResponse.json({ ok: false, error: "JSON invalido" }, { status: 400 });
    }

  if (!body.id) {
        return NextResponse.json({ ok: false, error: "Falta el id del documento" }, { status: 400 });
  }

  const resultado = await eliminarDocumento(body.id);
    if (resultado.ok) revalidateTag("politicas");
    return NextResponse.json(resultado, { status: resultado.ok ? 200 : 500 });
}
