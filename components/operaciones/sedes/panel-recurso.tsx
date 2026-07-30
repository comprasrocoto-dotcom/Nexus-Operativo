"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, Button, Badge, Input } from "@/components/ui";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Loader2,
  RefreshCw,
  Upload,
  ExternalLink,
  Paperclip,
} from "lucide-react";
import { crudRecurso, type RegistroBase } from "@/services/crud-recurso";

/**
 * panel-recurso.tsx
 *
 * Panel CRUD CONECTADO y generico para cualquier recurso del ERP.
 * Consume EXCLUSIVAMENTE el DataProvider activo (Demo o Gas) via services/crud-recurso.
 * No contiene fetch() ni llamadas directas al backend.
 *
 * Tipos de campo soportados: texto, numero, fecha, hora, select, textarea,
 * url, archivo, imagen. Los tipos archivo/imagen permiten subir el fichero
 * (se guarda como data URL) o pegar un enlace de Drive/YouTube.
 */

export type TipoCampo =
  | "texto"
  | "numero"
  | "fecha"
  | "hora"
  | "select"
  | "textarea"
  | "url"
  | "archivo"
  | "imagen";

export type CampoPanel = {
  clave: string;
  titulo: string;
  tipo?: TipoCampo;
  opciones?: string[];
  requerido?: boolean;
  enTabla?: boolean;
  enFormulario?: boolean;
  badge?: boolean;
  accept?: string; // para archivo/imagen (ej. ".pdf,.xlsx,.docx")
  anchoCompleto?: boolean; // ocupa las dos columnas del formulario
  placeholder?: string;
};

export type MetricaPanel = {
  titulo: string;
  calcular: (items: RegistroBase[]) => string;
};

export interface PanelRecursoProps {
  recurso: string;
  titulo: string;
  descripcion?: string;
  sedeId?: string;
  campos: CampoPanel[];
  metricas?: MetricaPanel[];
  etiquetaNuevo?: string;
  vacioMensaje?: string;
  filtrarPor?: string; // clave del campo por el que se ofrece filtro rapido
  campoEtiqueta?: string; // campo usado en mensajes (default: Nombre)
}

// Limite prudente: localStorage del DemoProvider ronda los 5 MB totales.
const MAX_ARCHIVO_MB = 1.5;
// Valores mas largos que esto no se indexan en la busqueda (data URLs).
const LIMITE_BUSQUEDA = 300;

const TIPOS_ADJUNTO: TipoCampo[] = ["archivo", "imagen"];

function esAdjunto(tipo?: TipoCampo) {
  return TIPOS_ADJUNTO.includes((tipo ?? "texto") as TipoCampo);
}

function esEnlace(valor: string) {
  const v = valor.trim().toLowerCase();
  return (
    v.startsWith("http://") ||
    v.startsWith("https://") ||
    v.startsWith("data:") ||
    v.startsWith("/")
  );
}

function leerArchivo(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(String(lector.result ?? ""));
    lector.onerror = () => reject(new Error("lectura"));
    lector.readAsDataURL(file);
  });
}

export function PanelRecurso(props: PanelRecursoProps) {
  const {
    recurso,
    titulo,
    descripcion,
    sedeId,
    campos,
    metricas = [],
    etiquetaNuevo = "Nuevo",
    vacioMensaje = "Sin registros todavia.",
    filtrarPor,
    campoEtiqueta = "Nombre",
  } = props;

  const servicio = useMemo(() => crudRecurso(recurso), [recurso]);

  const [items, setItems] = useState<RegistroBase[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState<RegistroBase | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState<string | null>(null);

  const filtroSede = useMemo(() => {
    const f: Record<string, string> = {};
    if (sedeId && sedeId !== "SEDE_TODAS") f.sedeId = sedeId;
    return f;
  }, [sedeId]);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await servicio.listar(filtroSede);
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
      setError("No se pudo cargar la informacion.");
    } finally {
      setCargando(false);
    }
  }, [servicio, filtroSede]);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  const camposTabla = campos.filter((c) => c.enTabla !== false);
  const camposForm = campos.filter((c) => c.enFormulario !== false);

  // Valores disponibles para el filtro rapido (se derivan de los datos reales).
  const valoresFiltro = useMemo(() => {
    if (!filtrarPor) return [];
    const set = new Set<string>();
    items.forEach((it) => {
      const v = String(it[filtrarPor] ?? "").trim();
      if (v) set.add(v);
    });
    return Array.from(set).sort();
  }, [items, filtrarPor]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return items.filter((it) => {
      if (filtrarPor && filtro && String(it[filtrarPor] ?? "") !== filtro) return false;
      if (!q) return true;
      return Object.values(it).some((v) => {
        const texto = String(v ?? "");
        if (texto.length > LIMITE_BUSQUEDA) return false;
        return texto.toLowerCase().includes(q);
      });
    });
  }, [items, busqueda, filtro, filtrarPor]);

  function abrirNuevo() {
    const inicial: Record<string, string> = {};
    camposForm.forEach((c) => {
      const opciones = c.opciones ?? [];
      inicial[c.clave] = c.tipo === "select" && opciones.length > 0 ? String(opciones[0]) : "";
    });
    setForm(inicial);
    setEditando(null);
    setError(null);
    setAbierto(true);
  }

  function abrirEdicion(fila: RegistroBase) {
    const inicial: Record<string, string> = {};
    camposForm.forEach((c) => {
      const v = fila[c.clave];
      inicial[c.clave] = v === undefined || v === null ? "" : String(v);
      if (esAdjunto(c.tipo)) {
        const nombre = fila[c.clave + "Nombre"];
        inicial[c.clave + "Nombre"] = nombre ? String(nombre) : "";
      }
    });
    setForm(inicial);
    setEditando(fila);
    setError(null);
    setAbierto(true);
  }

  async function seleccionarArchivo(campo: CampoPanel, file?: File | null) {
    if (!file) return;
    const mb = file.size / (1024 * 1024);
    if (mb > MAX_ARCHIVO_MB) {
      setError(
        'El archivo "' +
          file.name +
          '" pesa ' +
          mb.toFixed(1) +
          " MB. Maximo " +
          MAX_ARCHIVO_MB +
          " MB: sube el archivo a Drive y pega el enlace.",
      );
      return;
    }
    try {
      const dataUrl = await leerArchivo(file);
      setError(null);
      setForm((f) => ({ ...f, [campo.clave]: dataUrl, [campo.clave + "Nombre"]: file.name }));
    } catch {
      setError("No se pudo leer el archivo.");
    }
  }

  async function guardar() {
    const faltante = camposForm.find((c) => c.requerido && !String(form[c.clave] ?? "").trim());
    if (faltante) {
      setError('El campo "' + faltante.titulo + '" es obligatorio.');
      return;
    }
    setGuardando(true);
    setError(null);

    const datos: Record<string, unknown> = {};
    camposForm.forEach((c) => {
      const v = form[c.clave] ?? "";
      if (String(v).trim() !== "") {
        datos[c.clave] = c.tipo === "numero" ? Number(v) : v;
      }
      if (esAdjunto(c.tipo)) {
        const nombre = form[c.clave + "Nombre"] ?? "";
        if (String(nombre).trim() !== "") datos[c.clave + "Nombre"] = nombre;
      }
    });
    if (sedeId) datos.SedeID = sedeId;

    try {
      const res =
        editando && editando.ID
          ? await servicio.actualizar(String(editando.ID), datos)
          : await servicio.crear(datos);

      if (!res || res.ok === false) {
        setError((res && res.error) || "No se pudo guardar el registro.");
        return;
      }
      setAbierto(false);
      setEditando(null);
      await recargar();
    } catch {
      setError("No se pudo guardar el registro.");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(fila: RegistroBase) {
    if (!fila.ID) return;
    const nombre = String(fila[campoEtiqueta] ?? fila.Nombre ?? fila.ID);
    if (typeof window !== "undefined" && !window.confirm('Eliminar "' + nombre + '"?')) return;
    setEliminando(String(fila.ID));
    try {
      const res = await servicio.eliminar(String(fila.ID));
      if (!res || res.ok === false) setError((res && res.error) || "No se pudo eliminar.");
      await recargar();
    } finally {
      setEliminando(null);
    }
  }

  function valorCelda(fila: RegistroBase, campo: CampoPanel) {
    const v = fila[campo.clave];
    const texto = v === undefined || v === null || v === "" ? "" : String(v);
    if (!texto) return "—";

    if (campo.tipo === "imagen" && esEnlace(texto)) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={texto}
          alt={String(fila[campoEtiqueta] ?? "miniatura")}
          className="h-10 w-16 rounded-lg border border-slate-200 object-cover"
        />
      );
    }

    if ((campo.tipo === "archivo" || campo.tipo === "url") && esEnlace(texto)) {
      const etiqueta = String(fila[campo.clave + "Nombre"] ?? "") || "Abrir";
      return (
        <a
          href={texto}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex max-w-[220px] items-center gap-1 truncate text-primary hover:underline"
        >
          {campo.tipo === "archivo" ? (
            <Paperclip className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          )}
          <span className="truncate">{etiqueta}</span>
        </a>
      );
    }

    if (campo.badge) return <Badge variant="secondary">{texto}</Badge>;
    if (texto.length > 80) return <span title={texto}>{texto.slice(0, 80) + "..."}</span>;
    return texto;
  }

  function campoFormulario(c: CampoPanel) {
    if (c.tipo === "select") {
      return (
        <select
          value={form[c.clave] ?? ""}
          onChange={(e) => setForm({ ...form, [c.clave]: e.target.value })}
          className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="">— Seleccionar —</option>
          {(c.opciones ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    }

    if (c.tipo === "textarea") {
      return (
        <textarea
          value={form[c.clave] ?? ""}
          onChange={(e) => setForm({ ...form, [c.clave]: e.target.value })}
          rows={4}
          placeholder={c.placeholder}
          className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      );
    }

    if (esAdjunto(c.tipo)) {
      const valor = form[c.clave] ?? "";
      const nombre = form[c.clave + "Nombre"] ?? "";
      const esDato = valor.startsWith("data:");
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
              <Upload className="h-4 w-4" />
              Subir archivo
              <input
                type="file"
                className="hidden"
                accept={c.accept}
                onChange={(e) => void seleccionarArchivo(c, e.target.files?.[0])}
              />
            </label>
            {valor && (
              <button
                type="button"
                onClick={() => setForm({ ...form, [c.clave]: "", [c.clave + "Nombre"]: "" })}
                className="rounded-xl border border-slate-200 px-2 py-2 text-xs text-slate-500 hover:bg-slate-50"
              >
                Quitar
              </button>
            )}
            {esDato && (
              <span className="max-w-[220px] truncate text-xs text-slate-500">
                {nombre || "archivo cargado"}
              </span>
            )}
          </div>
          <Input
            type="text"
            value={esDato ? "" : valor}
            placeholder={c.placeholder ?? "...o pega un enlace de Drive / YouTube"}
            onChange={(e) => setForm({ ...form, [c.clave]: e.target.value, [c.clave + "Nombre"]: "" })}
            disabled={esDato}
          />
          {c.tipo === "imagen" && valor && esEnlace(valor) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={valor}
              alt="Vista previa"
              className="h-24 w-40 rounded-xl border border-slate-200 object-cover"
            />
          )}
          <p className="text-xs text-slate-400">
            Maximo {MAX_ARCHIVO_MB} MB por archivo. Para pesos mayores usa un enlace.
          </p>
        </div>
      );
    }

    return (
      <Input
        type={
          c.tipo === "numero"
            ? "number"
            : c.tipo === "fecha"
              ? "date"
              : c.tipo === "hora"
                ? "time"
                : c.tipo === "url"
                  ? "url"
                  : "text"
        }
        value={form[c.clave] ?? ""}
        placeholder={c.placeholder}
        onChange={(e) => setForm({ ...form, [c.clave]: e.target.value })}
      />
    );
  }

  return (
    <div className="space-y-4">
      {metricas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {metricas.map((m) => (
            <Card key={m.titulo} className="p-5 rounded-2xl shadow-soft">
              <div className="text-sm text-slate-500 mb-2">{m.titulo}</div>
              <div className="text-lg font-semibold text-slate-800">
                {cargando ? "…" : m.calcular(items)}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="p-5 rounded-2xl shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">{titulo}</h3>
            {descripcion && <p className="text-sm text-slate-500">{descripcion}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar..."
                className="pl-8 pr-3 py-2 text-sm rounded-xl border border-slate-200
