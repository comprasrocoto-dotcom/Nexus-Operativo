// campo-tipos.ts — Contratos y utilidades puras de los campos del PanelRecurso.
// Sin JSX ni estado: lo consumen campo-celda.tsx, campo-panel.tsx y panel-recurso.tsx.
// No contiene fetch() ni conoce el DataProvider.

import type { RegistroBase } from "@/services/crud-recurso";

export type TipoCampo =
  | "texto"
  | "textarea"
  | "numero"
  | "fecha"
  | "hora"
  | "select"
  | "booleano"
  | "email"
  | "url"
  | "color"
  | "archivo"
  | "imagen";

export interface CampoPanel {
  clave: string;
  titulo: string;
  tipo?: TipoCampo;
  opciones?: (string | number)[];
  requerido?: boolean;
  enTabla?: boolean;
  enFormulario?: boolean;
  anchoCompleto?: boolean;
  soloLectura?: boolean;
  placeholder?: string;
  acepta?: string;
}

export interface MetricaPanel {
  titulo: string;
  calcular: (items: RegistroBase[]) => string | number;
}

export const LIMITE_BUSQUEDA = 300;
export const MAX_ARCHIVO_MB = 3;

export const ACEPTA_DEFECTO =
  ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.webp,.gif";

export const CLASE_INPUT =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 " +
  "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 " +
  "disabled:bg-slate-50 disabled:text-slate-400";

export const TIPO_HTML: Record<string, string> = {
  numero: "number",
  fecha: "date",
  hora: "time",
  email: "email",
  url: "url",
  color: "color",
};

export function esAdjunto(tipo?: TipoCampo): boolean {
  return tipo === "archivo" || tipo === "imagen";
}

export function leerArchivo(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(String(lector.result ?? ""));
    lector.onerror = () => reject(new Error("No se pudo leer el archivo."));
    lector.readAsDataURL(file);
  });
}

// Formatea "2026-07-28" o "2026-07-28T07:05:00" SIN instanciar Date, para no
// introducir desfases de zona horaria (mismo criterio que timeline.tsx).
export function fechaCorta(valor: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(valor);
  return m ? m[3] + "/" + m[2] + "/" + m[1] : valor;
}

export function recortar(texto: string, largo: number): string {
  return texto.length > largo ? texto.slice(0, largo - 1) + "…" : texto;
}

export function tonoEstado(valor: string): string {
  const s = valor.toLowerCase();
  if (/(activ|vigent|aprob|cumpl|complet|cerrad|^si$|ok)/.test(s))
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (/(pendient|revis|proceso|borrador|program|parcial)/.test(s))
    return "bg-amber-50 text-amber-700 ring-amber-200";
  if (/(inactiv|vencid|rechaz|critic|anulad|cancel|^no$)/.test(s))
    return "bg-red-50 text-red-700 ring-red-200";
  return "bg-slate-50 text-slate-600 ring-slate-200";
}
