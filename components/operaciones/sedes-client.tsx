"use client";

// sedes-client.tsx — Orquestador del modulo Sedes.
// TODO el acceso a datos pasa por dataRequest (DataProvider activo): cero fetch(),
// cero Apps Script y cero Route Handlers desde el componente.
// La tabla vive en ./sedes/sedes-tabla y el formulario en ./sedes/sedes-modal.

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { Building2, Plus, Search } from "lucide-react";
import { Button, Card, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Sede } from "@/lib/operaciones";
import { dataRequest } from "@/lib/data/client";
import { SedesTabla, sedeActiva, type SedeFila } from "./sedes/sedes-tabla";
import { SedesModal, type FormSede } from "./sedes/sedes-modal";

type Filtro = "activas" | "inactivas" | "todas";
type Registro = Record<string, unknown>;

const USUARIO_DEMO = "Administrador Demo";

const FORM_VACIO: FormSede = {
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

async function pedirSedes(metodo: "POST" | "PUT" | "DELETE", body: Registro) {
  const { id, ...payload } = body;
  return dataRequest("sedes", metodo, {
    payload,
    id: id as string | undefined,
    usuario: USUARIO_DEMO,
  });
}

export function SedesClient({ sedesIniciales }: { sedesIniciales: Sede[] }) {
  const [sedes, setSedes] = useState<Sede[]>(sedesIniciales);
  const [actividades, setActividades] = useState<Registro[]>([]);
  const [eventos, setEventos] = useState<Registro[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("activas");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState<FormSede>(FORM_VACIO);
  const [error, setError] = useState<string | null>(null);
  const [cargando, iniciar] = useTransition();

  const recargar = useCallback(async () => {
    const [rs, ra, re] = await Promise.all([
      dataRequest<Sede[]>("sedes", "GET", { incluirInactivas: true }),
      dataRequest<Registro[]>("actividades", "GET", {}),
      dataRequest<Registro[]>("eventos", "GET", {}),
    ]);
    if (rs?.ok && Array.isArray(rs.data)) setSedes(rs.data as Sede[]);
    if (ra?.ok && Array.isArray(ra.data)) setActividades(ra.data as Registro[]);
    if (re?.ok && Array.isArray(re.data)) setEventos(re.data as Registro[]);
  }, []);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  // Actividades por sede y fecha de creacion derivada del primer Op_Evento.
  const enriquecidas = useMemo<SedeFila[]>(() => {
    const conteo: Record<string, number> = {};
    actividades.forEach((a) => {
      const id = String(a.SedeID ?? "");
      if (id) conteo[id] = (conteo[id] ?? 0) + 1;
    });
    const primera: Record<string, string> = {};
    eventos.forEach((e) => {
      const id = String(e.SedeID ?? "");
      const f = String(e.Fecha ?? "");
      if (!id || !f) return;
      if (!primera[id] || f < primera[id]) primera[id] = f;
    });
    return sedes.map((s) => ({
      ...s,
      totalActividades: conteo[String(s.ID)] ?? 0,
      creada: String(s.FechaCreacion ?? primera[String(s.ID)] ?? ""),
    }));
  }, [sedes, actividades, eventos]);

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return enriquecidas.filter((s) => {
      const activa = sedeActiva(s);
      if (filtro === "activas" && !activa) return false;
      if (filtro === "inactivas" && activa) return false;
      if (!q) return true;
      return [s.Nombre, s.Codigo, s.Responsable, s.Administrador, s.Direccion]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [enriquecidas, busqueda, filtro]);

  const totales = useMemo(() => {
    const activas = enriquecidas.filter(sedeActiva).length;
    return { total: enriquecidas.length, activas, inactivas: enriquecidas.length - activas };
  }, [enriquecidas]);

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
        ? await pedirSedes("PUT", { id, ...datos })
        : await pedirSedes("POST", datos);
      if (!res?.ok) {
        setError(res?.error || "No se pudo guardar.");
        return;
      }
      setModalAbierto(false);
      await recargar();
    });
  }

  function alternarActiva(s: Sede) {
    const activa = sedeActiva(s);
    iniciar(async () => {
      const res = activa
        ? await pedirSedes("DELETE", { id: s.ID })
        : await pedirSedes("PUT", { id: s.ID, activo: true, estado: "Activa" });
      if (res?.ok) await recargar();
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
          <span className="text-2xl font-semibold text-slate-900 dark:text-white">
            {totales.total}
          </span>
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
        <div className="relative min-w-[220px] flex-1">
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
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <SedesTabla sedes={filtradas} onEditar={abrirEdicion} onAlternar={alternarActiva} />

      {modalAbierto && (
        <SedesModal
          form={form}
          error={error}
          cargando={cargando}
          onCambio={(parche) => setForm((f) => ({ ...f, ...parche }))}
          onCerrar={() => setModalAbierto(false)}
          onGuardar={guardar}
        />
      )}
    </div>
  );
}

export default SedesClient;
