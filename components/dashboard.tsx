"use client";

// Portada del portal. Consume EXCLUSIVAMENTE el DataProvider activo (Demo o Gas).
// Sin mock-data: todas las cifras, documentos y modulos son datos reales.

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  Workflow,
  FileText,
  Building2,
  Package,
  ShoppingCart,
  ClipboardCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Files,
  History,
  CalendarClock,
  ArrowRight,
} from "lucide-react";
import { Card, Badge, Input } from "@/components/ui";
import { useRecurso } from "@/hooks/useRecurso";
import { rutaModulo } from "@/lib/modulos-nav";

type Registro = { ID: string; [k: string]: unknown };

const VIGENTES = ["vigente", "publicada", "publicado", "aprobada", "aprobado", "activo", "activa"];
const PENDIENTES = ["en revision", "borrador", "pendiente"];
const DIAS_ALERTA = 180;

function txt(v: unknown): string {
  return String(v ?? "").trim();
}

function estadoEn(reg: Registro, lista: string[]): boolean {
  return lista.includes(txt(reg.Estado).toLowerCase());
}

function diasHasta(valor: unknown): number {
  const ms = Date.parse(txt(valor));
  if (Number.isNaN(ms)) return Number.POSITIVE_INFINITY;
  return Math.ceil((ms - Date.now()) / 86400000);
}

const nivelVariant: Record<string, "success" | "warning" | "danger" | "muted"> = {
  exito: "success",
  info: "muted",
  advertencia: "warning",
  error: "danger",
  critico: "danger",
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export function Dashboard() {
  const [busqueda, setBusqueda] = useState("");

  const { items: politicas } = useRecurso<Registro>("politicas");
  const { items: procedimientos } = useRecurso<Registro>("procedimientos");
  const { items: manuales } = useRecurso<Registro>("manuales");
  const { items: sedes } = useRecurso<Registro>("sedes");
  const { items: inventarios } = useRecurso<Registro>("inventarios");
  const { items: compras } = useRecurso<Registro>("compras");
  const { items: auditorias } = useRecurso<Registro>("auditorias");
  const { items: actividades } = useRecurso<Registro>("actividades");
  const { items: indicadores } = useRecurso<Registro>("indicadores");
  const { items: evidencias } = useRecurso<Registro>("evidencias");
  const { items: modulos } = useRecurso<Registro>("modulos");
  const { items: eventos } = useRecurso<Registro>("eventos");
  const { items: usuarios } = useRecurso<Registro>("usuarios");
  const { items: roles } = useRecurso<Registro>("roles");
  const { items: permisos } = useRecurso<Registro>("permisos");
  const { items: catalogos } = useRecurso<Registro>("catalogos");
  const { items: parametros } = useRecurso<Registro>("parametros");

  const sedesOperativas = useMemo(() => sedes.filter((s) => s.ID !== "SEDE_TODAS"), [sedes]);

  const documentos = useMemo(
    () => [...politicas, ...procedimientos, ...manuales],
    [politicas, procedimientos, manuales],
  );

  const stats = useMemo(() => {
    const vigentes = documentos.filter((d) => estadoEn(d, VIGENTES)).length;
    const pendientes = documentos.filter((d) => estadoEn(d, PENDIENTES)).length;
    const porVencer = documentos.filter((d) => {
      const dias = diasHasta(d.Vigencia);
      return dias !== Number.POSITIVE_INFINITY && dias <= DIAS_ALERTA;
    }).length;
    return { vigentes, pendientes, porVencer, total: documentos.length };
  }, [documentos]);

  const indicadoresPortada = useMemo(
    () => [
      { key: "politicas", label: "Politicas", count: politicas.length, href: "/politicas", Icon: BookOpen },
      { key: "procedimientos", label: "Procedimientos", count: procedimientos.length, href: "/procedimientos", Icon: Workflow },
      { key: "manuales", label: "Manuales", count: manuales.length, href: "/manuales", Icon: FileText },
      { key: "sedes", label: "Sedes", count: sedesOperativas.length, href: "/operaciones/sedes", Icon: Building2 },
      { key: "inventarios", label: "Inventarios", count: inventarios.length, href: "/modulos/inventarios", Icon: Package },
      { key: "compras", label: "Compras", count: compras.length, href: "/modulos/compras", Icon: ShoppingCart },
      { key: "auditorias", label: "Auditorias", count: auditorias.length, href: "/modulos/auditorias", Icon: ClipboardCheck },
    ],
    [politicas, procedimientos, manuales, sedesOperativas, inventarios, compras, auditorias],
  );

  const conteos = useMemo<Record<string, number>>(
    () => ({
      politicas: politicas.length,
      procedimientos: procedimientos.length,
      manuales: manuales.length,
      sedes: sedesOperativas.length,
      operaciones: sedesOperativas.length,
      inventarios: inventarios.length,
      compras: compras.length,
      auditorias: auditorias.length,
      agenda: actividades.length,
      actividades: actividades.length,
      indicadores: indicadores.length,
      evidencias: evidencias.length,
      eventos: eventos.length,
      bitacora: eventos.length,
      usuarios: usuarios.length,
      roles: roles.length,
      permisos: permisos.length,
      catalogos: catalogos.length,
      parametros: parametros.length,
      modulos: modulos.length,
    }),
    [
      politicas, procedimientos, manuales, sedesOperativas, inventarios, compras,
      auditorias, actividades, indicadores, evidencias, eventos, usuarios, roles,
      permisos, catalogos, parametros, modulos,
    ],
  );

  const modulosVisibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const orden = [...modulos].sort((a, b) => Number(a.Orden ?? 0) - Number(b.Orden ?? 0));
    if (!q) return orden;
    return orden.filter((m) =>
      [m.Nombre, m.Clave, m.Roles].some((v) => txt(v).toLowerCase().includes(q)),
    );
  }, [modulos, busqueda]);

  const ultimosEventos = useMemo(() => eventos.slice(0, 6), [eventos]);

  const porVencerLista = useMemo(
    () =>
      documentos
        .map((d) => ({ doc: d, dias: diasHasta(d.Vigencia) }))
        .filter((x) => x.dias !== Number.POSITIVE_INFINITY && x.dias <= DIAS_ALERTA)
        .sort((a, b) => a.dias - b.dias)
        .slice(0, 6),
    [documentos],
  );

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="mx-auto flex max-w-7xl flex-col gap-8">
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">Hola, Administrador</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Grupo DASHI S.A.S. — operacion, documentacion y trazabilidad en un solo lugar.
        </p>

        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar modulo: inventarios, compras, auditorias, politicas..."
            className="h-16 rounded-2xl pl-14 pr-4 text-base shadow-soft-lg"
          />
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
        {indicadoresPortada.map((ind) => (
          <Link key={ind.key} href={ind.href}>
            <Card className="flex flex-col items-center gap-2 px-3 py-5 text-center hover:-translate-y-0.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ind.Icon className="h-5 w-5" />
              </div>
              <p className="text-xl font-semibold text-slate-900 dark:text-white">{ind.count}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{ind.label}</p>
            </Card>
          </Link>
        ))}
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">{stats.vigentes}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Documentos vigentes</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/10 text-warning">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">{stats.pendientes}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pendientes de aprobacion</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-danger/10 text-danger">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">{stats.porVencer}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Proximos a vencer</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
            <Files className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">{stats.total}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total de documentos</p>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <History className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Ultima actividad registrada</h2>
          </div>
          <ul className="space-y-3">
            {ultimosEventos.length === 0 && (
              <li className="text-sm text-slate-400">Aun no hay actividad registrada.</li>
            )}
            {ultimosEventos.map((ev) => (
              <li key={ev.ID} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{txt(ev.Descripcion)}</p>
                  <p className="text-xs text-slate-400">
                    {txt(ev.Modulo)} · {txt(ev.Usuario)} · {txt(ev.Fecha)} {txt(ev.Hora)}
                  </p>
                </div>
                <Badge variant={nivelVariant[txt(ev.Nivel).toLowerCase()] ?? "muted"}>{txt(ev.Nivel) || "info"}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Documentos proximos a vencer</h2>
          </div>
          <ul className="space-y-3">
            {porVencerLista.length === 0 && (
              <li className="text-sm text-slate-400">Ningun documento vence en los proximos {DIAS_ALERTA} dias.</li>
            )}
            {porVencerLista.map(({ doc, dias }) => (
              <li key={doc.ID} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{txt(doc.Nombre)}</p>
                  <p className="text-xs text-slate-400">
                    {txt(doc.Categoria) || txt(doc.Area) || "General"} · {txt(doc.Responsable)} · vence {txt(doc.Vigencia)}
                  </p>
                </div>
                <Badge variant={dias <= 60 ? "danger" : "warning"}>{dias} dias</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </motion.div>

      <motion.div variants={item} className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Modulos del sistema</h2>
        </div>
        {modulosVisibles.length === 0 ? (
          <p className="text-sm text-slate-400">Sin modulos que coincidan con la busqueda.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modulosVisibles.map((mod) => {
              const clave = txt(mod.Clave);
              const total = conteos[clave];
              return (
                <Link key={mod.ID} href={rutaModulo(clave)}>
                  <Card className="flex h-full flex-col justify-between gap-4 p-5 hover:-translate-y-0.5">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{txt(mod.Nombre)}</h3>
                        <ArrowRight className="h-4 w-4 text-slate-300" />
                      </div>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Clave: {clave}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{total === undefined ? "—" : total + " registros"}</span>
                      <Badge variant={estadoEn(mod, VIGENTES) ? "success" : "muted"}>{txt(mod.Estado) || "activo"}</Badge>
                    </div>
                    <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                      <span className="text-slate-400">Roles</span>
                      <span className="truncate font-medium text-slate-600 dark:text-slate-300">{txt(mod.Roles) || "—"}</span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
