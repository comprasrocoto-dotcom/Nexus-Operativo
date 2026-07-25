"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, X, Save, Loader2 } from "lucide-react";
import { Button, Card, Badge, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useRecurso, useCatalogo } from "@/hooks/useRecurso";
import { tipoCanonico } from "@/lib/eventos";
import type { CampoRecurso, DefinicionRecurso } from "@/types/admin";

type Fila = Record<string, unknown>;

export type CrudGenericoProps = {
  definicion: DefinicionRecurso;
  filtros?: Record<string, string | number | boolean>;
  usuario?: string;
};

export default function CrudGenerico({ definicion, filtros }: CrudGenericoProps) {
  const { recurso, campos, singular, campoId = "ID", campoEtiqueta = "Nombre" } = definicion;
  const acciones = definicion.acciones ?? ["crear", "editar", "eliminar", "consultar"];
  const { items, cargando, error, crear, actualizar, eliminar } = useRecurso<Fila>(recurso, filtros);

  const [busqueda, setBusqueda] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState<Fila | null>(null);
  const [form, setForm] = useState<Fila>({});
  const [guardando, setGuardando] = useState(false);

  const columnas = useMemo(() => campos.filter((c) => c.enTabla !== false), [campos]);
  const camposForm = useMemo(
    () => campos.filter((c) => c.enFormulario !== false && !c.soloLectura),
    [campos],
  );

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) =>
      Object.values(it).some((v) => String(v ?? "").toLowerCase().includes(q)),
    );
  }, [items, busqueda]);

  function abrirCrear() {
    const inicial: Fila = {};
    for (const c of camposForm) if (c.valorDefecto !== undefined) inicial[c.clave] = c.valorDefecto;
    setEditando(null);
    setForm(inicial);
    setAbierto(true);
  }
  function abrirEditar(fila: Fila) {
    setEditando(fila);
    setForm({ ...fila });
    setAbierto(true);
  }
  function cerrar() {
    setAbierto(false);
    setEditando(null);
    setForm({});
  }

  async function guardar() {
    setGuardando(true);
    const evento = {
      modulo: definicion.moduloEvento ?? "administracion",
      entidad: definicion.entidadEvento ?? recurso,
      tipoEvento: tipoCanonico(definicion.entidadEvento, editando ? "editar" : "crear"),
      descripcion:
        (editando ? "Edito " : "Creo ") + singular + ": " + String(form[campoEtiqueta] ?? ""),
    };
    const ok = editando
      ? await actualizar(String(editando[campoId]), form, { evento })
      : await crear(form, { evento });
    setGuardando(false);
    if (ok) cerrar();
  }

  async function borrar(fila: Fila) {
    const etiqueta = String(fila[campoEtiqueta] ?? fila[campoId] ?? "");
    if (!window.confirm("Eliminar " + singular + ": " + etiqueta + "?")) return;
    await eliminar(String(fila[campoId]), {
      evento: {
        modulo: definicion.moduloEvento ?? "administracion",
        entidad: definicion.entidadEvento ?? recurso,
        tipoEvento: tipoCanonico(definicion.entidadEvento, "eliminar"),
        descripcion: "Elimino " + singular + ": " + etiqueta,
      },
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder={"Buscar " + singular + "..."}
            className="pl-9"
          />
        </div>
        {acciones.includes("crear") && (
          <Button onClick={abrirCrear} className="gap-2">
            <Plus className="h-4 w-4" /> Nuevo
          </Button>
        )}
      </div>

      {error && <div className="text-sm text-amber-600 dark:text-amber-400">{error}</div>}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                {columnas.map((c) => (
                  <th key={c.clave} className="px-4 py-3 font-medium whitespace-nowrap">{c.etiqueta}</th>
                ))}
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan={columnas.length + 1} className="px-4 py-10 text-center text-slate-400">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  </td>
                </tr>
              ) : filtrados.length === 0 ? (
                <tr>
                  <td colSpan={columnas.length + 1} className="px-4 py-10 text-center text-slate-400">
                    Sin registros todavia.
                  </td>
                </tr>
              ) : (
                filtrados.map((fila, i) => (
                  <tr key={String(fila[campoId] ?? i)} className="border-t hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    {columnas.map((c) => (
                      <td key={c.clave} className="px-4 py-3 whitespace-nowrap">
                        <CeldaValor campo={c} valor={fila[c.clave]} />
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {acciones.includes("editar") && (
                          <Button variant="ghost" size="sm" onClick={() => abrirEditar(fila)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {acciones.includes("eliminar") && (
                          <Button variant="ghost" size="sm" onClick={() => borrar(fila)}>
                            <Trash2 className="h-4 w-4 text-danger" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={cerrar}>
          <Card
            className="w-full max-w-lg max-h-[85vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{(editando ? "Editar " : "Nuevo ") + singular}</h3>
              <Button variant="ghost" size="sm" onClick={cerrar}><X className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-4">
              {camposForm.map((c) => (
                <CampoFormulario
                  key={c.clave}
                  campo={c}
                  valor={form[c.clave]}
                  onChange={(v) => setForm((f) => ({ ...f, [c.clave]: v }))}
                />
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={cerrar}>Cancelar</Button>
              <Button onClick={guardar} disabled={guardando} className="gap-2">
                {guardando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Guardar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function CeldaValor({ campo, valor }: { campo: CampoRecurso; valor: unknown }) {
  if (campo.tipo === "booleano") {
    return <Badge variant={valor ? "success" : "muted"}>{valor ? "Si" : "No"}</Badge>;
  }
  if (campo.tipo === "color" && valor) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: String(valor) }} />
        <span className="text-slate-500">{String(valor)}</span>
      </span>
    );
  }
  const texto = Array.isArray(valor) ? valor.join(", ") : String(valor ?? "");
  return <span>{texto || "—"}</span>;
}

function CampoFormulario({
  campo,
  valor,
  onChange,
}: {
  campo: CampoRecurso;
  valor: unknown;
  onChange: (v: unknown) => void;
}) {
  const { opciones } = useCatalogo(campo.catalogo);
  const opts = campo.opciones ?? opciones;

  const label = (
    <label className="mb-1 block text-sm font-medium">
      {campo.etiqueta}
      {campo.requerido && <span className="text-danger"> *</span>}
    </label>
  );

  if (campo.tipo === "booleano") {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={Boolean(valor)} onChange={(e) => onChange(e.target.checked)} />
        {campo.etiqueta}
      </label>
    );
  }
  if (campo.tipo === "textarea") {
    return (
      <div>{label}
        <textarea
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          rows={3}
          value={String(valor ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={campo.placeholder}
        />
      </div>
    );
  }
  if (campo.tipo === "select") {
    return (
      <div>{label}
        <select
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          value={String(valor ?? "")}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Seleccionar...</option>
          {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    );
  }
  if (campo.tipo === "multiselect") {
    const sel = Array.isArray(valor)
      ? (valor as string[])
      : String(valor ?? "").split(",").filter(Boolean);
    const toggle = (v: string) =>
      onChange(sel.includes(v) ? sel.filter((x) => x !== v) : [...sel, v]);
    return (
      <div>{label}
        <div className="flex flex-wrap gap-2">
          {opts.map((o) => (
            <button
              type="button"
              key={o.value}
              onClick={() => toggle(o.value)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                sel.includes(o.value) ? "bg-primary text-white border-primary" : "bg-white dark:bg-slate-900",
              )}
            >{o.label}</button>
          ))}
          {opts.length === 0 && <span className="text-xs text-slate-400">Sin opciones.</span>}
        </div>
      </div>
    );
  }
  if (campo.tipo === "color") {
    return (
      <div>{label}
        <input
          type="color"
          value={String(valor ?? "#f97316")}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-16 rounded-lg border border-slate-200 dark:border-slate-700"
        />
      </div>
    );
  }

  const tipoHtml =
    campo.tipo === "numero" ? "number" : campo.tipo === "email" ? "email" : campo.tipo === "fecha" ? "date" : "text";
  return (
    <div>{label}
      <Input
        type={tipoHtml}
        value={String(valor ?? "")}
        onChange={(e) => onChange(tipoHtml === "number" ? Number(e.target.value) : e.target.value)}
        placeholder={campo.placeholder}
      />
    </div>
  );
}
