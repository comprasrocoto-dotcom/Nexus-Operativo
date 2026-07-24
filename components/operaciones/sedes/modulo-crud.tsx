"use client";

import { useState } from "react";
import { Button, Card, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Plus, Pencil, Trash2, Search, X, Loader2 } from "lucide-react";

/**
 * modulo-crud.tsx
 *
 * Scaffold CRUD reutilizable y GENERICO para cualquier recurso del ERP.
 * Se alimenta de un hook que expone { items, loading, error, crear, editar, eliminar, recargar }
 * y de una definicion de columnas. NO contiene logica de negocio: toda la logica vive en
 * hooks/services/lib. Los modulos (Inventarios, Auditorias, Compras, Costos, Documentos,
 * Politicas, Procedimientos, Manuales, Usuarios, Agenda) reutilizan este mismo patron.
 */

export interface ColumnaCrud<T> {
  clave: keyof T & string;
  titulo: string;
  render?: (fila: T) => React.ReactNode;
}

export interface CrudController<T> {
  items: T[];
  loading: boolean;
  error?: string | null;
  crear?: (data: Partial<T>) => Promise<void> | void;
  editar?: (id: string, data: Partial<T>) => Promise<void> | void;
  eliminar?: (id: string) => Promise<void> | void;
  recargar?: () => void;
}

interface ModuloCrudProps<T extends { ID?: string }> {
  titulo: string;
  descripcion?: string;
  columnas: ColumnaCrud<T>[];
  controller: CrudController<T>;
  onNuevo?: () => void;
  onEditar?: (fila: T) => void;
  vacioMensaje?: string;
  acciones?: boolean;
}

export function ModuloCrud<T extends { ID?: string }>(props: ModuloCrudProps<T>) {
  const {
    titulo,
    descripcion,
    columnas,
    controller,
    onNuevo,
    onEditar,
    vacioMensaje = "Sin registros todavia.",
    acciones = true,
  } = props;

  const { items, loading, error, eliminar } = controller;
  const [filtro, setFiltro] = useState("");
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);

  const filtrados = items.filter((it) => {
    if (!filtro.trim()) return true;
    const texto = filtro.toLowerCase();
    return columnas.some((c) => {
      const v = (it as Record<string, unknown>)[c.clave];
      return String(v ?? "").toLowerCase().includes(texto);
    });
  });

  async function handleEliminar(fila: T) {
    if (!eliminar || !fila.ID) return;
    setEliminandoId(fila.ID);
    try {
      await eliminar(fila.ID);
    } finally {
      setEliminandoId(null);
    }
  }

  return (
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
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Buscar..."
              className="pl-8 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          {onNuevo && (
            <Button onClick={onNuevo} className="gap-1">
              <Plus className="h-4 w-4" /> Nuevo
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded-xl bg-danger/10 text-danger text-sm px-3 py-2">
          {error}
        </div>
      )}

      {loading ? (
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
                {columnas.map((c) => (
                  <th key={c.clave} className="py-2 pr-4 font-medium">{c.titulo}</th>
                ))}
                {acciones && <th className="py-2 w-24 text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((fila, idx) => (
                <tr key={fila.ID ?? idx} className="border-b border-slate-50 hover:bg-slate-50/60">
                  {columnas.map((c) => (
                    <td key={c.clave} className="py-2.5 pr-4 text-slate-700">
                      {c.render ? c.render(fila) : String((fila as Record<string, unknown>)[c.clave] ?? "")}
                    </td>
                  ))}
                  {acciones && (
                    <td className="py-2.5 text-right">
                      <div className="inline-flex gap-1">
                        {onEditar && (
                          <button onClick={() => onEditar(fila)} className="p-1.5 rounded-lg hover:bg-secondary/10 text-secondary" title="Editar">
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                        {eliminar && (
                          <button onClick={() => handleEliminar(fila)} disabled={eliminandoId === fila.ID} className="p-1.5 rounded-lg hover:bg-danger/10 text-danger" title="Eliminar">
                            {eliminandoId === fila.ID ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export default ModuloCrud;
