"use client";

// panel-recurso.tsx — Panel CRUD generico y CONECTADO para cualquier recurso del ERP.
// Consume EXCLUSIVAMENTE el DataProvider activo (Demo o Gas) via services/crud-recurso.
// No contiene fetch() ni llamadas directas al backend. El renderizado de campos vive
// en ./campo-panel para mantener este archivo pequeno y sin logica duplicada.

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, Button } from "@/components/ui";
import { Plus, Pencil, Trash2, Search, X, Loader2, RefreshCw } from "lucide-react";
import { crudRecurso, type RegistroBase } from "@/services/crud-recurso";
import {
  CampoFormularioPanel,
  CeldaValorPanel,
  esAdjunto,
  leerArchivo,
  LIMITE_BUSQUEDA,
  MAX_ARCHIVO_MB,
  type CampoPanel,
  type MetricaPanel,
} from "./campo-panel";

export type { CampoPanel, MetricaPanel, TipoCampo } from "./campo-panel";

export interface PanelRecursoProps {
  recurso: string;
  titulo: string;
  descripcion?: string;
  sedeId?: string;
  campos: CampoPanel[];
  metricas?: MetricaPanel[];
  etiquetaNuevo?: string;
  vacioMensaje?: string;
  filtrarPor?: string;
  campoEtiqueta?: string;
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

  function cambiar(parche: Record<string, string>) {
    setForm((f) => ({ ...f, ...parche }));
  }

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
        'El archivo "' + file.name + '" pesa ' + mb.toFixed(1) + " MB. Maximo " +
          MAX_ARCHIVO_MB + " MB: subelo a Drive y pega el enlace.",
      );
      return;
    }
    try {
      const dataUrl = await leerArchivo(file);
      setError(null);
      cambiar({ [campo.clave]: dataUrl, [campo.clave + "Nombre"]: file.name });
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
      if (String(v).trim() !== "") datos[c.clave] = c.tipo === "numero" ? Number(v) : v;
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

  return (
    <div className="space-y-4">
      {metricas.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {metricas.map((m) => (
            <Card key={m.titulo} className="rounded-2xl p-5 shadow-soft">
              <div className="mb-2 text-sm text-slate-500">{m.titulo}</div>
              <div className="text-lg font-semibold text-slate-800">
                {cargando ? "…" : m.calcular(items)}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="rounded-2xl p-5 shadow-soft">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
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
                className="rounded-xl border border-slate-200 py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            {filtrarPor && valoresFiltro.length > 0 && (
              <select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">Todos</option>
                {valoresFiltro.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            )}
            <Button variant="ghost" size="icon" onClick={() => void recargar()} title="Recargar">
              <RefreshCw className={cargando ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            </Button>
            <Button onClick={abrirNuevo} className="gap-1">
              <Plus className="h-4 w-4" /> {etiquetaNuevo}
            </Button>
          </div>
        </div>

        {error && !abierto && (
          <div className="mb-3 rounded-xl bg-red-100 px-3 py-2 text-sm text-red-700">{error}</div>
        )}

        {cargando ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : filtrados.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400">{vacioMensaje}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-500">
                  {camposTabla.map((c) => (
                    <th key={c.clave} className="whitespace-nowrap py-2 pr-4 font-medium">
                      {c.titulo}
                    </th>
                  ))}
                  <th className="w-24 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((fila, idx) => (
                  <tr
                    key={String(fila.ID ?? idx)}
                    className="border-b border-slate-50 hover:bg-slate-50/60"
                  >
                    {camposTabla.map((c) => (
                      <td key={c.clave} className="py-2.5 pr-4 text-slate-700">
                        <CeldaValorPanel campo={c} fila={fila} campoEtiqueta={campoEtiqueta} />
                      </td>
                    ))}
                    <td className="py-2.5 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => abrirEdicion(fila)}
                          className="rounded-lg p-1.5 text-blue-700 hover:bg-blue-100"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => void eliminar(fila)}
                          disabled={eliminando === String(fila.ID)}
                          className="rounded-lg p-1.5 text-red-700 hover:bg-red-100"
                          title="Eliminar"
                        >
                          {eliminando === String(fila.ID) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <Card className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl p-6 shadow-soft-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                {editando ? "Editar registro" : etiquetaNuevo}
              </h3>
              <button
                onClick={() => setAbierto(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                title="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <div className="mb-3 rounded-xl bg-red-100 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {camposForm.map((c) => (
                <div
                  key={c.clave}
                  className={
                    c.tipo === "textarea" || c.anchoCompleto || esAdjunto(c.tipo)
                      ? "sm:col-span-2"
                      : ""
                  }
                >
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    {c.titulo}
                    {c.requerido && <span className="text-red-600"> *</span>}
                  </label>
                  <CampoFormularioPanel
                    campo={c}
                    valores={form}
                    onCambio={cambiar}
                    onArchivo={(campo, file) => void seleccionarArchivo(campo, file)}
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAbierto(false)} disabled={guardando}>
                Cancelar
              </Button>
              <Button onClick={() => void guardar()} disabled={guardando} className="gap-1">
                {guardando ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default PanelRecurso;
