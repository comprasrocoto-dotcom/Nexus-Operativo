import { NextResponse, type NextRequest } from "next/server";
import { verificarToken } from "@/lib/auth/token";

const RUTAS_PUBLICAS = ["/login", "/api/auth/login", "/api/revalidate", "/manifest.webmanifest"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (RUTAS_PUBLICAS.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }
  const sesion = await verificarToken(req.cookies.get("nexus_sesion")?.value);
  if (!sesion) {
    const destino = new URL("/login", req.url);
    if (pathname !== "/") destino.searchParams.set("desde", pathname);
    return NextResponse.redirect(destino);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons/).*)"],
};
