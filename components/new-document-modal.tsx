"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, UploadCloud } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

const TIPOS = [
  "Politica",
  "Procedimiento",
  "Manual de Uso",
  "Formato",
  "Instructivo",
  "Video",
  "Pregunta Frecuente",
  "Noticia",
] as const;

const ESTADOS = ["Borrador", "En revision", "Vigente", "Obsoleto"] as const;

export type NuevoDocumento = {
  titulo: string;
  tipo: string;
  area: string;
  categoria: string;
  subcategoria: string;
  responsable: string;
  version: string;
  estado: string;
  fechaVigencia: string;
  etiquetas: string;
  descripcion: string;
  contenido: string;
};

const VALOR_INICIAL: NuevoDocumento = {
  titulo: "",
  tipo: TIPOS[0],
  area: "",
  categoria: "",
  subcategoria: "",
  responsable: "",
  version: "1.0",
  estado: ESTADOS[0],
  fechaVigencia: "",
  etiquetas: "",
  descripcion: "",
  contenido: "",
};

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{label}</span>
      {children}
    </label>
  );
}

const selectClase =
  "flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

export function NewDocumentModal() {
  const [abierto, setAbierto] = React.useState(false);
  const [enviando, setEnviando] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<NuevoDocumento>(VALOR_INICIAL);

  function actualizar<K extends keyof NuevoDocumento>(campo: K, valor: NuevoDocumento[K]) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function cerrar() {
    setAbierto(false);
    setError(null);
    setForm(VALOR_INICIAL);
  }

  async function guardar() {
    if (!form.titulo.trim()) {
      setError("El titulo es obligatorio");
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch("/api/documentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          etiquetas: form.etiquetas
            ? form.etiquetas.split(",").map((e) => e.trim()).filter(Boolean)
            : [],
        }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error || "No se pudo guardar el documento");
        return;
      }
      cerrar();
    } catch (err) {
      setError(String(err));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 items-center gap-2 rounded-full bg-primary px-5 text-white shadow-soft-lg transition-transform hover:scale-105 active:scale-95"
      >
        <Plus className="h-5 w-5" />
        <span className="text-sm font-semibold">Nuevo Documento</span>
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrar}
          >
            <motion.div
              className="my-8 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-soft-lg dark:border-slate-800 dark:bg-slate-900"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Nuevo Documento</h2>
                <button
                  onClick={cerrar}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Campo label="Titulo">
                    <Input
                      value={form.titulo}
                      onChange={(e) => actualizar("titulo", e.target.value)}
                      placeholder="Nombre del documento"
                    />
                  </Campo>
                </div>

                <Campo label="Tipo de documento">
                  <select
                    className={selectClase}
                    value={form.tipo}
                    onChange={(e) => actualizar("tipo", e.target.value)}
                  >
                    {TIPOS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Campo>

                <Campo label="Estado">
                  <select
                    className={selectClase}
                    value={form.estado}
                    onChange={(e) => actualizar("estado", e.target.value)}
                  >
                    {ESTADOS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Campo>

                <Campo label="Area">
                  <Input value={form.area} onChange={(e) => actualizar("area", e.target.value)} />
                </Campo>

                <Campo label="Responsable">
                  <Input
                    value={form.responsable}
                    onChange={(e) => actualizar("responsable", e.target.value)}
                  />
                </Campo>

                <Campo label="Categoria">
                  <Input
                    value={form.categoria}
                    onChange={(e) => actualizar("categoria", e.target.value)}
                  />
                </Campo>

                <Campo label="Subcategoria">
                  <Input
                    value={form.subcategoria}
                    onChange={(e) => actualizar("subcategoria", e.target.value)}
                  />
                </Campo>

                <Campo label="Version">
                  <Input
                    value={form.version}
                    onChange={(e) => actualizar("version", e.target.value)}
                  />
                </Campo>

                <Campo label="Fecha de vigencia">
                  <Input
                    type="date"
                    value={form.fechaVigencia}
                    onChange={(e) => actualizar("fechaVigencia", e.target.value)}
                  />
                </Campo>

                <div className="sm:col-span-2">
                  <Campo label="Etiquetas (separadas por comas)">
                    <Input
                      value={form.etiquetas}
                      onChange={(e) => actualizar("etiquetas", e.target.value)}
                      placeholder="inventario, calidad, sst"
                    />
                  </Campo>
                </div>

                <div className="sm:col-span-2">
                  <Campo label="Descripcion corta">
                    <Input
                      value={form.descripcion}
                      onChange={(e) => actualizar("descripcion", e.target.value)}
                    />
                  </Campo>
                </div>

                <div className="sm:col-span-2">
                  <Campo label="Contenido del documento">
                    {/* Editor basico por ahora. TODO: reemplazar por editor enriquecido (Tiptap) en Claude Code. */}
                    <textarea
                      className={cn(selectClase, "h-40 resize-y py-2")}
                      value={form.contenido}
                      onChange={(e) => actualizar("contenido", e.target.value)}
                      placeholder="Escribe el contenido del documento..."
                    />
                  </Campo>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-400 dark:border-slate-700">
                    <UploadCloud className="h-6 w-6" />
                    <span>Arrastra archivos adjuntos aqui (proximamente)</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="px-6 pb-2 text-sm text-danger">{error}</div>
              )}

              <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
                <Button variant="outline" onClick={cerrar} disabled={enviando}>
                  Cancelar
                </Button>
                <Button onClick={guardar} disabled={enviando}>
                  {enviando ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
