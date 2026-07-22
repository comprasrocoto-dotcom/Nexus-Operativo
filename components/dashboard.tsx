"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  Settings2,
  FileText,
  Video,
  Paperclip,
  Megaphone,
  HelpCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Files,
  Eye,
  History,
  Building2,
  Users,
  Landmark,
  ChefHat,
  ArrowRight,
} from "lucide-react";
import { Card, Badge, Input } from "@/components/ui";
import {
  indicators,
  moduleGroups,
  recentDocuments,
  mostViewedDocuments,
  dashboardStats,
} from "@/lib/mock-data";

const indicatorIcons: Record<string, typeof BookOpen> = {
  BookOpen,
  Settings2,
  FileText,
  Video,
  Paperclip,
  Megaphone,
  HelpCircle,
};

const groupIcons: Record<string, typeof Building2> = {
  operaciones: Building2,
  rrhh: Users,
  administracion: Landmark,
  cocina: ChefHat,
};

const statusVariant: Record<string, "success" | "warning" | "danger"> = {
  Vigente: "success",
  "En revision": "warning",
  Obsoleto: "danger",
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function Dashboard() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto flex max-w-7xl flex-col gap-8"
    >
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
          Hola, Administrador
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Bienvenido al portal corporativo. Todo el conocimiento de la empresa, organizado en un solo lugar.
        </p>

        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar politicas, procedimientos, manuales, videos, recetas..."
            className="h-16 rounded-2xl pl-14 pr-4 text-base shadow-soft-lg"
          />
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
        {indicators.map((ind) => {
          const Icon = indicatorIcons[ind.icon] ?? BookOpen;
          return (
            <Link key={ind.key} href={ind.href}>
              <Card className="flex flex-col items-center gap-2 px-3 py-5 text-center hover:-translate-y-0.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xl font-semibold text-slate-900 dark:text-white">{ind.count}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{ind.label}</p>
              </Card>
            </Link>
          );
        })}
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">{dashboardStats.vigentes}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Documentos vigentes</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/10 text-warning">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">{dashboardStats.pendientesAprobacion}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pendientes de aprobacion</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-danger/10 text-danger">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">{dashboardStats.proximosAVencer}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Proximos a vencer</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
            <Files className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">{dashboardStats.totalDocumentos}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total de documentos</p>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <History className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Ultimas modificaciones</h2>
          </div>
          <ul className="space-y-3">
            {recentDocuments.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{doc.title}</p>
                  <p className="text-xs text-slate-400">{doc.area} · {doc.responsible} · {doc.updatedAt}</p>
                </div>
                <Badge variant={statusVariant[doc.status] ?? "muted"}>{doc.status}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Eye className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Documentos mas consultados</h2>
          </div>
          <ul className="space-y-3">
            {mostViewedDocuments.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{doc.title}</p>
                  <p className="text-xs text-slate-400">{doc.area} · {doc.responsible}</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                  <Eye className="h-3.5 w-3.5" /> {doc.views}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </motion.div>

      <motion.div variants={item} className="flex flex-col gap-6">
        {moduleGroups.map((group) => {
          const GroupIcon = groupIcons[group.key] ?? Building2;
          return (
            <div key={group.key}>
              <div className="mb-3 flex items-center gap-2">
                <GroupIcon className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{group.name}</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.modules.map((mod) => (
                  <Link key={mod.slug} href={"/modulos/" + mod.slug}>
                    <Card className="flex h-full flex-col justify-between gap-4 p-5 hover:-translate-y-0.5">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-slate-900 dark:text-white">{mod.name}</h3>
                          <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1" />
                        </div>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{mod.description}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{mod.docCount} documentos</span>
                        <span>{mod.lastUpdate}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                        <span className="text-slate-400">Responsable</span>
                        <span className="font-medium text-slate-600 dark:text-slate-300">{mod.owner}</span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
