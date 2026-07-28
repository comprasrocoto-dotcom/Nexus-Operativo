"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, Button, Badge, Input } from "@/components/ui";
import { Plus, Pencil, Trash2, Search, X, Loader2, RefreshCw } from "lucide-react";
import { crudRecurso, type RegistroBase } from "@/services/crud-recurso";

/**
 * panel-recurso.tsx
 *
 * Panel CRUD CONECTADO y generico para cualquier recurso del ERP.
 * Consume EXCLUSIVAMENTE el DataProvider activo (Demo o Gas) via services/crud-recurso.
 * No contiene fetch() ni llamadas directas al backend.
 * Crear / Editar / Eliminar / Buscar / Metricas funcionan sin backend real (DemoProvider).
 */

export type TipoCampo = "texto" | "numero" | "fecha" | "hora" | "select" | "textarea";

export type CampoPanel = {
  clave: string;
  titulo: string;
  tipo?: TipoCampo;
  opciones?: string[];
  requerido?: boolean;
  enTabla?: boolean;
  enFormulario?: boolean;
  badge?: boolean;
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
  } = props;

  const servicio = useMemo(() => crudRecurso(recurso), [recurso]);

  const [items, setItems] = useState<RegistroBase[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState<RegistroBase | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState<string | null>(null);

  const filtroSede = useMemo(
    () => (sedeId && sedeId !== "SEDE_TODAS" ? { sedeId } : {}),
    [sedeId],
  );

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

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) =>
      Object.values(it).some((v) => String(v ?? "").toLowerCase().includes(q)),
    );
  }, [items, busqueda]);

  function abrirNuevo() {
    const inicial: Record<string, string> = {};
    camposForm.forEach((c) => {
      inicial[c.clave] = c.tipo === "select" && c.opciones && c.opciones.length ? c.opciones[0] : "";
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
    });
    setForm(inicial);
    setEditando(fila);
    setError(null);
    setAbierto(true);
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
      if (String(v).trim() === "") return;
      datos[c.clave] = c.tipo === "numero" ? Number(v) : v;
    });
    if (sedeId) datos.SedeID = sedeId;

    try {
      const res = editando && editando.ID
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
    const nombre = String(fila.Nombre ?? fila.ID);
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
    const texto = v === undefined || v === null || v === "" ? "—" : String(v);
    if (campo.badge && texto !== "—") return <Badge variant="secondary">{texto}</Badge>;
    return texto;
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
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar..."
                className="pl-8 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={() => void recargar()} title="Recargar">
              <RefreshCw className={cargando ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            </Button>
            <Button onClick={abrirNuevo} className="gap-1">
              <Plus className="h-4 w-4" /> {etiquetaNuevo}
            </Button>
          </div>
        </div>

        {error && !abierto && (
          <div className="mb-3 rounded-xl bg-red-100 text-red-700 text-sm px-3 py-2">{error}</div>
        )}

        {cargando ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-10 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : filtrados.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-sm">{vacioMensaje}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  {camposTabla.map((c) => (
                    <th key={c.clave} className="py-2 pr-4 font-medium whitespace-nowrap">
                      {c.titulo}
                    </th>
                  ))}
                  <th className="py-2 w-24 text-right">Acciones</th>
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
                        {valorCelda(fila, c)}
                      </td>
                    ))}
                    <td className="py-2.5 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => abrirEdicion(fila)}
                          className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-700"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => void eliminar(fila)}
                          disabled={eliminando === String(fila.ID)}
                          className="p-1.5 rounded-lg hover:bg-red-100 text-red-700"
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
          <Card className="w-full max-w-xl p-6 rounded-2xl shadow-soft-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {editando ? "Editar registro" : etiquetaNuevo}
              </h3>
              <button
                onClick={() => setAbierto(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                title="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <div className="mb-3 rounded-xl bg-red-100 text-red-700 text-sm px-3 py-2">{error}</div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {camposForm.map((c) => (
                <div key={c.clave} className={c.tipo === "textarea" ? "sm:col-span-2" : ""}>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    {c.titulo}
                    {c.requerido && <span className="text-red-600"> *</span>}
                  </label>

                  {c.tipo === "select" ? (
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
                  ) : c.tipo === "textarea" ? (
                    <textarea
                      value={form[c.clave] ?? ""}
                      onChange={(e) => setForm({ ...form, [c.clave]: e.target.value })}
                      rows={3}
                      className="w-full text-sm rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  ) : (
                    <Input
                      type={
                        c.tipo === "numero"
                          ? "number"
                          : c.tipo === "fecha"
                            ? "date"
                            : c.tipo === "hora"
                              ? "time"
                              : "text"
                      }
                      value={form[c.clave] ?? ""}
                      onChange={(e) => setForm({ ...form, [c.clave]: e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <Button variant="outline" onClick={() => setAbierto(false)} disabled={guardando}>
                Cancelar
              </Button>
              <Button onClick={() => void guardar()} disabled={guardando} className="gap-1">
                {guardando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
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
