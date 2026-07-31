"use client";

// campo-panel.tsx — Campo de formulario del PanelRecurso + fachada de re-exports.
// Barril unico que consume panel-recurso.tsx: los contratos y utilidades viven en
// ./campo-tipos y la celda de tabla en ./campo-celda. Cero logica duplicada.

import { Upload } from "lucide-react";
import {
  ACEPTA_DEFECTO,
  CLASE_INPUT,
  esAdjunto,
  TIPO_HTML,
  type CampoPanel,
} from "./campo-tipos";

export {
  esAdjunto,
  leerArchivo,
  fechaCorta,
  recortar,
  tonoEstado,
  ACEPTA_DEFECTO,
  CLASE_INPUT,
  LIMITE_BUSQUEDA,
  MAX_ARCHIVO_MB,
  TIPO_HTML,
} from "./campo-tipos";
export type { CampoPanel, MetricaPanel, TipoCampo } from "./campo-tipos";
export { CeldaValorPanel, InsigniaPanel } from "./campo-celda";
export type { CeldaValorPanelProps } from "./campo-celda";

export interface CampoFormularioPanelProps {
  campo: CampoPanel;
  valores: Record<string, string>;
  onCambio: (parche: Record<string, string>) => void;
  onArchivo: (campo: CampoPanel, file?: File | null) => void;
}

function CampoArchivo({ campo, valores, onCambio, onArchivo }: CampoFormularioPanelProps) {
  const valor = valores[campo.clave] ?? "";
  const nombre = valores[campo.clave + "Nombre"] ?? "";
  const esEnlace = /^https?:\/\//i.test(valor);
  return (
    <div className="space-y-2">
      <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100">
        <Upload className="h-4 w-4" />
        <span>{nombre || (esEnlace ? "Enlace cargado" : "Seleccionar archivo")}</span>
        <input
          type="file"
          accept={campo.acepta ?? ACEPTA_DEFECTO}
          className="hidden"
          onChange={(e) => onArchivo(campo, e.target.files ? e.target.files[0] : null)}
        />
      </label>
      <input
        value={esEnlace ? valor : ""}
        placeholder="...o pega el enlace de Drive"
        onChange={(e) =>
          onCambio({ [campo.clave]: e.target.value, [campo.clave + "Nombre"]: "" })
        }
        className={CLASE_INPUT}
      />
      {valor.trim() !== "" && (
        <button
          type="button"
          onClick={() => onCambio({ [campo.clave]: "", [campo.clave + "Nombre"]: "" })}
          className="text-xs font-medium text-red-600 hover:underline"
        >
          Quitar archivo
        </button>
      )}
    </div>
  );
}

export function CampoFormularioPanel(props: CampoFormularioPanelProps) {
  const { campo, valores, onCambio } = props;
  const valor = valores[campo.clave] ?? "";
  const set = (v: string) => onCambio({ [campo.clave]: v });

  if (esAdjunto(campo.tipo)) return <CampoArchivo {...props} />;

  if (campo.tipo === "textarea") {
    return (
      <textarea
        rows={3}
        value={valor}
        disabled={campo.soloLectura}
        placeholder={campo.placeholder}
        onChange={(e) => set(e.target.value)}
        className={CLASE_INPUT}
      />
    );
  }

  if (campo.tipo === "select" || campo.tipo === "booleano") {
    const opciones =
      campo.tipo === "booleano" ? ["Si", "No"] : (campo.opciones ?? []).map(String);
    return (
      <select
        value={valor}
        disabled={campo.soloLectura}
        onChange={(e) => set(e.target.value)}
        className={CLASE_INPUT}
      >
        {!campo.requerido && <option value="">— Sin definir —</option>}
        {opciones.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={TIPO_HTML[campo.tipo ?? "texto"] ?? "text"}
      value={valor}
      disabled={campo.soloLectura}
      placeholder={campo.placeholder}
      onChange={(e) => set(e.target.value)}
      className={CLASE_INPUT}
    />
  );
}

export default CampoFormularioPanel;
