"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Bell, Moon, Sun, Menu } from "lucide-react";
import { Input } from "@/components/ui";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 lg:px-8">
      <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden">
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden flex-1 md:block">
        <Input placeholder="Buscar en el portal..." className="max-w-md" />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-xl border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Cambiar tema"
        >
          {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button className="relative rounded-xl border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-danger" />
        </button>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 py-1.5 pl-1.5 pr-3 dark:border-slate-700">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
            A
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold leading-none text-slate-900 dark:text-white">Administrador</p>
            <p className="text-[11px] text-slate-400">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
