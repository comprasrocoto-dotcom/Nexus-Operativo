// lib/data/providers/demo-provider.ts
// Proveedor OFICIAL del sistema (no un parche). Implementa IDataProvider al 100%.
// Persiste en localStorage, soporta CRUD + buscar + filtrar + ordenar + paginacion,
// y registra un evento automatico por cada mutacion (alimenta el Timeline).

import type { IDataProvider, MetodoDatos, OpcionesDatos, Resp } from "@/lib/data/interfaces/data-provider";
import { leerColeccion, guardarColeccion, existeColeccion } from "@/lib/data/storage/local-storage";
import { SEED_MAP } from "@/lib/data/seed/dashi-seed";

type Registro = { ID: string; [k: string]: unknown };

function nuevoId(recurso: string): string {
  return `${recurso.toUpperCase()}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

function ahora() {
  const d = new Date();
  return { fecha: d.toISOString().slice(0, 10), hora: d.toTimeString().slice(0, 5) };
}

function asegurarSemilla(recurso: string) {
  if (!existeColeccion(recurso) && SEED_MAP[recurso]) {
    guardarColeccion(recurso, SEED_MAP[recurso] as Registro[]);
  }
}

function aplicarFiltros(items: Registro[], op: OpcionesDatos): Registro[] {
  let out = items.slice();
  const f = op.filtros ?? {};

  const claves = Object.keys(f).filter(
    (k) => !["buscar", "ordenarPor", "orden", "pagina", "porPagina", "incluirInactivas", "limite"].includes(k)
  );
  for (const k of claves) {
    const val = String(f[k]);
    if (val === "" || val === "undefined") continue;
    const campo = k === "sedeId" ? "SedeID" : k === "entidadId" ? "EntidadID" : k;
    out = out.filter((it) => {
      const v = it[campo] ?? it[k];
      if (v === undefined) return true;
      return String(v) === val || String(v).includes(val);
    });
  }

  const buscar = (op.buscar ?? (f.buscar as string) ?? "").toString().toLowerCase();
  if (buscar) {
    out = out.filter((it) =>
      Object.values(it).some((v) => String(v ?? "").toLowerCase().includes(buscar))
    );
  }

  const incluirInactivas = op.incluirInactivas ?? f.incluirInactivas === "true";
  if (!incluirInactivas) out = out.filter((it) => it.Activo !== false);

  const ordenarPor = op.ordenarPor ?? (f.ordenarPor as string);
  if (ordenarPor) {
    const dir = (op.orden ?? (f.orden as string)) === "desc" ? -1 : 1;
    out.sort((a, b) => (String(a[ordenarPor] ?? "") > String(b[ordenarPor] ?? "") ? dir : -dir));
  }

  return out;
}

function paginar(items: Registro[], op: OpcionesDatos): { data: Registro[]; total: number } {
  const total = items.length;
  const pagina = Number(op.pagina ?? 0);
  const porPagina = Number(op.porPagina ?? 0);
  if (pagina > 0 && porPagina > 0) {
    const inicio = (pagina - 1) * porPagina;
    return { data: items.slice(inicio, inicio + porPagina), total };
  }
  return { data: items, total };
}

function registrarEventoAuto(recurso: string, tipo: string, registro: Registro, usuario?: string) {
  if (recurso === "eventos") return;
  asegurarSemilla("eventos");
  const eventos = leerColeccion<Registro>("eventos");
  const { fecha, hora } = ahora();
  eventos.unshift({
    ID: nuevoId("eventos"),
    Fecha: fecha,
    Hora: hora,
    Usuario: usuario ?? "Administrador Demo",
    Modulo: recurso,
    Entidad: recurso,
    EntidadID: registro.ID,
    SedeID: (registro.SedeID as string) ?? "SEDE_TODAS",
    TipoEvento: tipo,
    Descripcion: `${registro.Nombre ?? registro.ID} - ${tipo.replace(/_/g, " ").toLowerCase()}`,
    Nivel: tipo.includes("ELIMINAD") ? "advertencia" : "info",
    Icono: "activity",
    Color: tipo.includes("ELIMINAD") ? "amber" : "blue",
  });
  guardarColeccion("eventos", eventos);
}

export class DemoProvider implements IDataProvider {
  readonly nombre = "demo";

  async pedir<T = unknown>(recurso: string, metodo: MetodoDatos, opciones: OpcionesDatos = {}): Promise<Resp<T>> {
    try {
      asegurarSemilla(recurso);
      const items = leerColeccion<Registro>(recurso);
      const usuario = opciones.usuario;

      switch (metodo) {
        case "listar": {
          const filtrados = aplicarFiltros(items, opciones);
          const { data, total } = paginar(filtrados, opciones);
          return { ok: true, data: data as T, total };
        }
        case "obtener": {
          const id = opciones.id ?? (opciones.filtros?.id as string);
          const item = items.find((it) => it.ID === id);
          return item ? { ok: true, data: item as T } : { ok: false, error: "No encontrado" };
        }
        case "crear": {
          const payload = (opciones.payload ?? {}) as Registro;
          const { fecha } = ahora();
          const registro: Registro = {
            ...payload,
            ID: payload.ID ?? nuevoId(recurso),
            Activo: payload.Activo ?? true,
            FechaCreacion: fecha,
            UsuarioCreador: usuario ?? "Administrador Demo",
          };
          items.unshift(registro);
          guardarColeccion(recurso, items);
          registrarEventoAuto(recurso, `${recurso.toUpperCase()}_CREADO`, registro, usuario);
          return { ok: true, data: { id: registro.ID } as T };
        }
        case "actualizar": {
          const payload = (opciones.payload ?? {}) as Registro;
          const id = payload.ID ?? (opciones.id as string);
          const idx = items.findIndex((it) => it.ID === id);
          if (idx === -1) return { ok: false, error: "No encontrado" };
          const { fecha } = ahora();
          items[idx] = { ...items[idx], ...payload, ID: id, FechaModificacion: fecha, UltimoEditor: usuario ?? "Administrador Demo" };
          guardarColeccion(recurso, items);
          registrarEventoAuto(recurso, `${recurso.toUpperCase()}_ACTUALIZADO`, items[idx], usuario);
          return { ok: true, data: { id } as T };
        }
        case "eliminar": {
          const id = (opciones.payload?.id as string) ?? (opciones.id as string);
          const idx = items.findIndex((it) => it.ID === id);
          if (idx === -1) return { ok: false, error: "No encontrado" };
          const eliminado = items[idx];
          items[idx] = { ...eliminado, Activo: false, Estado: "Inactiva" };
          guardarColeccion(recurso, items);
          registrarEventoAuto(recurso, `${recurso.toUpperCase()}_ELIMINADO`, eliminado, usuario);
          return { ok: true, data: { id } as T };
        }
        default:
          return { ok: false, error: "Metodo no soportado" };
      }
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  }
}

export const demoProvider = new DemoProvider();
