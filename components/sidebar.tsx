"use client";

// Sidebar 100% data-driven. Los modulos salen del recurso "modulos" del
// DataProvider activo (Demo o Gas). Ya NO existe dependencia de mock-data.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Home,
  BookOpen,
  Settings2,
  FileText,
  Video,
  Paperclip,
  Megaphone,
  HelpCircle,
  ChevronDown,
  Building2,
  Sparkles,
  LayoutGrid,
  Package,
  ShoppingCart,
  ClipboardCheck,
  CalendarDays,
  BarChart3,
  Camera,
  Users,
  Shield,
  KeyRound,
  ScrollText,
  ListChecks,
  Workflow,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRecurso } from "@/hooks/useRecurso";
import { rutaModulo } from "@/lib/modulos-nav";

type Modulo = { ID: string; [k: string]: unknown };

const mainNav = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/politicas", label: "Politicas", icon: BookOpen },
  { href: "/procedimientos", label: "Procedimientos", icon: Settings2 },
  { href: "/manuales", label: "Manuales", icon: FileText },
  { href: "/videos", label: "Videos", icon: Video },
  { href: "/formatos", label: "Formatos", icon: Paperclip },
  { href: "/noticias", label: "Noticias", icon: Megaphone },
  { href: "/faq", label: "Preguntas frecuentes", icon: HelpCircle },
];

// Iconos disponibles para el campo Icono de Op_Modulos (administrable desde web).
const ICONOS: Record<string, typeof Building2> = {
  Building2,
  LayoutGrid,
  Package,
  ShoppingCart,
  ClipboardCheck,
  CalendarDays,
  BarChart3,
  Camera,
  Users,
  Shield,
  KeyRound,
  ScrollText,
  ListChecks,
  FileText,
  BookOpen,
  Workflow,
  Settings2,
};

function txt(v: unknown): string {
  return String(v ?? "").trim();
}

export function Sidebar() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(true);
  const { items: modulos } = useRecurso<Modulo>("modulos");

  const visibles = useMemo(
    () =>
      modulos
        .filter((m) => {
          if (m.Activo === false) return false;
          const estado = txt(m.Estado).toLowerCase();
          return estado === "" || estado === "activo" || estado === "activa" || estado === "vigente";
        })
        .sort((a, b) => Number(a.Orden ?? 0) - Number(b.Orden ?? 0)),
    [modulos],
  );

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col border-r border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-soft">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none text-slate-900 dark:text-white">Nexus Operativo</p>
          <p className="text-xs text-slate-400">Grupo DASHI S.A.S.</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        <ul className="space-y-1">
          {mainNav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Modulos</p>
        <ul className="mt-2 space-y-1">
          <li>
            <button
              onClick={() => setAbierto((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <span className="flex items-center gap-3">
                <Building2 className="h-4 w-4" />
                Operacion
              </span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", abierto && "rotate-180")} />
            </button>

            {abierto && (
              <ul className="ml-8 mt-1 space-y-1 border-l border-slate-200 pl-3 dark:border-slate-700">
                {visibles.length === 0 && (
                  <li className="px-2 py-1.5 text-xs text-slate-400">Cargando modulos...</li>
                )}
                {visibles.map((mod) => {
                  const clave = txt(mod.Clave);
                  const href = rutaModulo(clave);
                  const Icon = ICONOS[txt(mod.Icono)] ?? LayoutGrid;
                  const active = pathname === href;
                  return (
                    <li key={mod.ID}>
                      <Link
                        href={href}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
                          active
                            ? "text-primary font-medium"
                            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {txt(mod.Nombre) || clave}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        </ul>

        <p className="mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Sistema</p>
        <ul className="mt-2 space-y-1">
          <li>
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/admin"
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              <ShieldCheck className="h-4 w-4" />
              Administracion
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
