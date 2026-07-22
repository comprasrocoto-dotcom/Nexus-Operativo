"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

const tabs = [
  "Politicas",
  "Procedimientos",
  "Manuales",
  "Videos",
  "Formatos",
  "Noticias",
  "Preguntas frecuentes",
];

export function ModuleTabs({ submodules }: { submodules: string[] }) {
  const [active, setActive] = useState(tabs[0]);

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={
              "whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-colors " +
              (active === tab
                ? "bg-primary text-white"
                : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800")
            }
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-dashed border-slate-200 p-10 text-center dark:border-slate-700">
        <FileText className="mx-auto h-8 w-8 text-slate-300" />
        <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
          Aun no hay documentos de {active.toLowerCase()} publicados en este modulo.
        </p>
        <p className="mt-1 text-xs text-slate-400">Subcategorias: {submodules.join(", ")}</p>
      </div>
    </div>
  );
}
