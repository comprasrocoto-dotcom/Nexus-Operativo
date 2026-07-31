"use client";

// campo-celda.tsx — Celda de tabla del PanelRecurso. Solo presentacion.
// Reutiliza los contratos y utilidades de ./campo-tipos. Sin estado ni backend.

import { Paperclip } from "lucide-react";
import type { RegistroBase } from "@/services/crud-recurso";
import {
  esAdjunto,
  fechaCorta,
  recortar,
  tonoEstado,
  type CampoPanel,
} from "./campo-tipos";

export function InsigniaPanel({ texto }: { texto: string }) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 " +
        tonoEstado(texto)
      }
    >
      {recortar(texto, 26)}
    </span>
  );
}

export interface CeldaValorPanelProps {
  campo: CampoPanel;
  fila: RegistroBase;
  campoEtiqueta?: string;
}

export function CeldaValorPanel({ campo, fila, campoEtiqueta }: CeldaValorPanelProps) {
  const bruto = fila[campo.clave];
  const valor = bruto === undefined || bruto === null ? "" : String(bruto);
  if (!valor.trim()) return <span className="text-slate-300">—</span>;

  if (esAdjunto(campo.tipo)) {
    const nombre = String(fila[campo.clave + "Nombre"] ?? "Archivo");
    return (
      <a
        href={valor}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 font-medium text-blue-700 hover:underline"
      >
        <Paperclip className="h-3.5 w-3.5" />
        {recortar(nombre, 28)}
      </a>
    );
  }

  if (campo.tipo === "fecha") {
    return <span className="whitespace-nowrap tabular-nums">{fechaCorta(valor)}</span>;
  }

  if (campo.tipo === "numero") {
    return <span className="tabular-nums">{valor}</span>;
  }

  if (campo.tipo === "color") {
    return (
      <span className="inline-flex items-center gap-2">
        <span
          className="h-3.5 w-3.5 rounded-full ring-1 ring-slate-200"
          style={{ backgroundColor: valor }}
        />
        {valor}
      </span>
    );
  }

  if (campo.tipo === "booleano") {
    return <InsigniaPanel texto={valor === "true" || valor === "Si" ? "Si" : "No"} />;
  }

  if (campo.tipo === "select" || /estado/i.test(campo.clave)) {
    return <InsigniaPanel texto={valor} />;
  }

  if (campo.tipo === "url" || /^https?:\/\//i.test(valor)) {
    return (
      <a
        href={valor}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-blue-700 hover:underline"
      >
        {recortar(valor, 40)}
      </a>
    );
  }

  if (campoEtiqueta && campo.clave === campoEtiqueta) {
    return <span className="font-medium text-slate-800">{recortar(valor, 60)}</span>;
  }

  return <span>{recortar(valor, 60)}</span>;
}

export default CeldaValorPanel;
