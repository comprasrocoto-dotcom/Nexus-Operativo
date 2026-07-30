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

// ─── fin de la PARTE A ───
