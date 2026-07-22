"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  Users,
  Landmark,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { moduleGroups } from "@/lib/mock-data";

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

const groupIcons: Record<string, typeof Building2> = {
  operaciones: Building2,
  rrhh: Users,
  administracion: Landmark,
};

export function Sidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<string[]>(["operaciones"]);

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col border-r border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-soft">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none text-slate-900 dark:text-white">Nexus Operativo</p>
          <p className="text-xs text-slate-400">Portal corporativo</p>
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
          {moduleGroups.map((group) => {
            const GroupIcon = groupIcons[group.key] ?? Building2;
            const isOpen = openGroups.includes(group.key);
            return (
              <li key={group.key}>
                <button
                  onClick={() => toggleGroup(group.key)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <span className="flex items-center gap-3">
                    <GroupIcon className="h-4 w-4" />
                    {group.name}
                  </span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                </button>
                {isOpen && (
                  <ul className="ml-8 mt-1 space-y-1 border-l border-slate-200 pl-3 dark:border-slate-700">
                    {group.modules.map((mod) => (
                      <li key={mod.slug}>
                        <Link
                          href={"/modulos/" + mod.slug}
                          className={cn(
                            "block rounded-lg px-2 py-1.5 text-sm transition-colors",
                            pathname === "/modulos/" + mod.slug
                              ? "text-primary font-medium"
                              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                          )}
                        >
                          {mod.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
