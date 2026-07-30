"use client";

// Pantalla generica de modulo. NO se escribe una pagina por modulo: se lee el
// modulo real de Op_Modulos y se monta el CRUD generico sobre su coleccion.
// Todo pasa por el DataProvider activo. Sin mock-data, sin fetch directo.

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Layers, Loader2 } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import CrudGenerico from "@/components/admin/crud-generico";
import { useRecurso } from "@/hooks/useRecurso";
import { RECURSOS_ADMIN } from "@/lib/admin";
import { definicionInferida, recursoDeModulo } from "@/lib/modulos-nav";

type Registro = { ID: string; [k: string]: unknown };

function txt(v: unknown): string {
  return String(v ?? "").trim();
}

function capitalizar(v: string): string {
  return v ? v.charAt(0).toUpperCase() + v.slice(1) : v;
}

function singularizar(v: string): string {
  if (v.endsWith("es")) return v.slice(0, -2);
  if (v.endsWith("s")) return v.slice(0, -1);
  return v;
}

export default function ModuloPage() {
  const params = useParams<{ slug: string | string[] }>();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : txt(params?.slug);

  const { items: modulos, cargando: cargandoModulos } = useRecurso<Registro>("modulos");
  const modulo = useMemo(
    () => modulos.find((m) => txt(m.Clave).toLowerCase() === slug.toLowerCase()),
    [modulos, slug],
  );

  const recurso = recursoDeModulo(slug);
  const { items, cargando } = useRecurso<Registro>(recurso);

  const titulo = txt(modulo?.Nombre) || capitalizar(slug);
  const singular = singularizar(titulo).toLowerCase() || "registro";

  const definicion = useMemo(() => {
    const declarada = RECURSOS_ADMIN[recurso];
    if (declarada) return declarada;
    return definicionInferida(recurso, titulo, singular, items.slice(0, 8) as Record<string, unknown>[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recurso, titulo, singular, items]);

  if (cargandoModulos) {
    return (
      <div className="mx-auto flex max-w-6xl items-center justify-center py-24 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!modulo) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Modulo no encontrado</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No existe un modulo con la clave <span className="font-medium">{slug}</span>. Los modulos se
          administran desde Administracion &gt; Modulos.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/" className="text-sm font-medium text-primary hover:underline">Volver al inicio</Link>
          <Link href="/admin" className="text-sm font-medium text-primary hover:underline">Ir a Administracion</Link>
        </div>
      </div>
    );
  }

  const color = txt(modulo.Color) || "#f97316";
  const roles = txt(modulo.Roles) || "todos";
  const estado = txt(modulo.Estado) || "activo";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al portal
      </Link>

      <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-white"
            style={{ backgroundColor: color }}
          >
            <Layers className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Modulo · {txt(modulo.Clave)}</p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{titulo}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Informacion administrada desde el DataProvider de Nexus Operativo.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-xs text-slate-400">Registros</p>
            <p className="font-semibold text-slate-800 dark:text-slate-100">
              {cargando ? "—" : items.length}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Orden</p>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{txt(modulo.Orden) || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Roles</p>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{roles}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Estado</p>
            <Badge variant={estado.toLowerCase() === "activo" ? "success" : "muted"}>{estado}</Badge>
          </div>
        </div>
      </Card>

      <CrudGenerico definicion={definicion} />
    </div>
  );
}
