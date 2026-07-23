"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Building2,
  Plus,
  Search,
  Pencil,
  Power,
  RotateCcw,
  User,
  CalendarDays,
  X,
} from "lucide-react";
import { Badge, Button, Card, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Sede, SedeInput } from "@/lib/operaciones";

type Filtro = "activas" | "inactivas" | "todas";

type FormState = SedeInput & { id?: string };

const FORM_VACIO: FormState = {
  nombre: "",
  codigo: "",
  descripcion: "",
  responsable: "",
  administrador: "",
  direccion: "",
  telefono: "",
  estado: "Activa",
  activo: true,
};

async function llamarApi(
  metodo: "POST" | "PUT" | "DELETE",
  body: Record<string, unknown>
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch("/api/operaciones?recurso=sedes", {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json().catch(() => ({ ok: false, error: "Respuesta invalida" }));
}

function formatFecha(valor?: string) {
  if (!valor) return "—";
  const d = new Date(valor);
  return isNaN(d.getTime()) ? String(valor) : d.toLocaleDateString();
}

export function SedesClient({ sedesIniciales }: { sedesIniciales: Sede[] }) {
  const [sedes, setSedes] = useState<Sede[]>(sedesIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("activas");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState<FormState>(FORM_VACIO);
  const [error, setError] = useState<string | null>(null);
  const [cargando, iniciar] = useTransition();

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return sedes.filter((s) => {
      const activa = s.Activo !== false && String(s.Estado).toLowerCase() !== "inactiva";
      if (filtro === "activas" && !activa) return false;
      if (filtro === "inactivas" && activa) return false;
      if (!q) return true;
      return [s.Nombre, s.Codigo, s.Responsable, s.Administrador, s.Direccion]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [sedes, busqueda, filtro]);

  const totales = useMemo(() => {
    const activas = sedes.filter(
      (s) => s.Activo !== false && String(s.Estado).toLowerCase() !== "inactiva"
    ).length;
    return { total: sedes.length, activas, inactivas: sedes.length - activas };
  }, [sedes]);

  async function recargar() {
    const res = await fetch("/api/operaciones?recurso=sedes", { cache: "no-store" }).catch(
      () => null
    );
    if (!res) return;
    const json = await res.json().catch(() => null);
    if (json?.ok && Array.isArray(json.data)) setSedes(json.data as Sede[]);
  }

  function abrirNueva() {
    setForm(FORM_VACIO);
    setError(null);
    setModalAbierto(true);
  }

  function abrirEdicion(s: Sede) {
    setForm({
      id: s.ID,
      nombre: s.Nombre ?? "",
      codigo: s.Codigo ?? "",
      descripcion: s.Descripcion ?? "",
      responsable: s.Responsable ?? "",
      administrador: s.Administrador ?? "",
      direccion: s.Direccion ?? "",
      telefono: s.Telefono ?? "",
      estado: s.Estado ?? "Activa",
      activo: s.Activo !== false,
    });
    setError(null);
    setModalAbierto(true);
  }

  function guardar() {
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    setError(null);
    iniciar(async () => {
      const { id, ...datos } = form;
      const res = id
        ? await llamarApi("PUT", { id, ...datos })
        : await llamarApi("POST", datos);
      if (!res.ok) {
        setError(res.error || "No se pudo guardar.");
        return;
      }
      setModalAbierto(false);
      await recargar();
    });
  }

  function alternarActiva(s: Sede) {
    const activa = s.Activo !== false && String(s.Estado).toLowerCase() !== "inactiva";
    iniciar(async () => {
      const res = activa
        ? await llamarApi("DELETE", { id: s.ID })
        : await llamarApi("PUT", { id: s.ID, activo: true, estado: "Activa" });
      if (res.ok) await recargar();
    });
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-slate-900 dark:text-white">
            <Building2 className="h-6 w-6 text-primary" /> Sedes
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Administra todas las sedes del Centro de Operaciones. Nada se edita a mano en la hoja.
          </p>
        </div>
        <Button onClick={abrirNueva}>
          <Plus className="h-4 w-4" /> Nueva sede
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex flex-col gap-1 p-5">
          <span className="text-sm text-slate-500">Total de sedes</span>
          <span className="text-2xl font-semibold text-slate-900 dark:text-white">{totales.total}</span>
        </Card>
        <Card className="flex flex-col gap-1 p-5">
          <span className="text-sm text-slate-500">Activas</span>
          <span className="text-2xl font-semibold text-success">{totales.activas}</span>
        </Card>
        <Card className="flex flex-col gap-1 p-5">
          <span className="text-sm text-slate-500">Inactivas</span>
          <span className="text-2xl font-semibold text-slate-400">{totales.inactivas}</span>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, codigo, responsable..."
            className="pl-9"
          />
        </div>
        <div className="flex gap-1 rounded-xl border border-slate-200 p-1 dark:border-slate-700">
          {(["activas", "inactivas", "todas"] as Filtro[]).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm capitalize transition-colors",
                filtro === f
                  ? "bg-primary text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 font-medium">Sede</th>
                <th className="px-4 py-3 font-medium">Responsable</th>
                <th className="px-4 py-3 font-medium">Actividades</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Creada</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    No hay sedes que coincidan.
                  </td>
                </tr>
              )}
              {filtradas.map((s) => {
                const activa =
                  s.Activo !== false && String(s.Estado).toLowerCase() !== "inactiva";
                return (
                  <tr key={s.ID} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900 dark:text-white">{s.Nombre}</div>
                      <div className="text-xs text-slate-400">{s.Codigo}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        {s.Responsable || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                        {s.totalActividades ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={activa ? "success" : "muted"}>
                        {activa ? "Activa" : "Inactiva"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatFecha(s.FechaCreacion)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => abrirEdicion(s)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => alternarActiva(s)}
                          title={activa ? "Desactivar" : "Reactivar"}
                        >
                          {activa ? (
                            <Power className="h-4 w-4 text-danger" />
                          ) : (
                            <RotateCcw className="h-4 w-4 text-success" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-lg p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {form.id ? "Editar sede" : "Nueva sede"}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setModalAbierto(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm sm:col-span-2">
                <span className="text-slate-600 dark:text-slate-300">Nombre *</span>
                <Input
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Nombre de la sede"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-slate-600 dark:text-slate-300">Codigo</span>
                <Input
                  value={form.codigo ?? ""}
                  onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                  placeholder="Se genera si lo dejas vacio"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-slate-600 dark:text-slate-300">Telefono</span>
                <Input
                  value={form.telefono ?? ""}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-slate-600 dark:text-slate-300">Responsable</span>
                <Input
                  value={form.responsable ?? ""}
                  onChange={(e) => setForm({ ...form, responsable: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-slate-600 dark:text-slate-300">Administrador</span>
                <Input
                  value={form.administrador ?? ""}
                  onChange={(e) => setForm({ ...form, administrador: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm sm:col-span-2">
                <span className="text-slate-600 dark:text-slate-300">Direccion</span>
                <Input
                  value={form.direccion ?? ""}
                  onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm sm:col-span-2">
                <span className="text-slate-600 dark:text-slate-300">Descripcion</span>
                <Input
                  value={form.descripcion ?? ""}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                />
              </label>
            </div>

            {error && <p className="mt-3 text-sm text-danger">{error}</p>}

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalAbierto(false)}>
                Cancelar
              </Button>
              <Button onClick={guardar} disabled={cargando}>
                {cargando ? "Guardando..." : form.id ? "Guardar cambios" : "Crear sede"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
