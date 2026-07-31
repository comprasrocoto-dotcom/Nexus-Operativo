"use client";

import PanelRecurso, {
  type CampoPanel,
  type MetricaPanel,
} from "@/components/operaciones/sedes/panel-recurso";

// Videoteca corporativa. Reutiliza el CRUD generico (PanelRecurso -> crudRecurso ->
// DataProvider activo). Cero componentes nuevos y cero logica duplicada.

const CATEGORIAS = [
  "Capacitacion",
  "Operaciones",
  "Calidad",
  "SST",
  "Servicio al cliente",
  "Sistemas",
];

const ESTADOS = ["Borrador", "Publicado", "Archivado"];

const CAMPOS: CampoPanel[] = [
  { clave: "Codigo", titulo: "Codigo" },
  { clave: "Nombre", titulo: "Titulo", requerido: true },
  { clave: "Categoria", titulo: "Categoria", tipo: "select", opciones: CATEGORIAS },
  { clave: "URL", titulo: "Enlace de YouTube", tipo: "url" },
  {
    clave: "Archivo",
    titulo: "Archivo de video",
    tipo: "archivo",
    acepta: ".mp4,.webm,.mov,.m4v",
    enTabla: false,
  },
  {
    clave: "Miniatura",
    titulo: "Miniatura",
    tipo: "imagen",
    acepta: ".png,.jpg,.jpeg,.webp",
    enTabla: false,
  },
  { clave: "Fecha", titulo: "Fecha", tipo: "fecha" },
  { clave: "Responsable", titulo: "Responsable" },
  { clave: "Estado", titulo: "Estado", tipo: "select", opciones: ESTADOS, badge: true },
  { clave: "Descripcion", titulo: "Descripcion", tipo: "textarea", enTabla: false },
];

const METRICAS: MetricaPanel[] = [
  { titulo: "Videos", calcular: (items) => String(items.length) },
  {
    titulo: "Publicados",
    calcular: (items) =>
      String(items.filter((i) => String(i.Estado ?? "") === "Publicado").length),
  },
  {
    titulo: "Borradores",
    calcular: (items) =>
      String(items.filter((i) => String(i.Estado ?? "") === "Borrador").length),
  },
];

export default function VideosPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Videos</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Videoteca de capacitacion y procesos operativos del Grupo DASHI, administrable
          desde la web.
        </p>
      </div>
      <PanelRecurso
        recurso="videos"
        titulo="Listado de videos"
        descripcion="Crear, editar, consultar, buscar y dar de baja videos."
        etiquetaNuevo="Nuevo video"
        vacioMensaje="Aun no hay videos registrados. Usa Nuevo video para cargar el primero."
        campos={CAMPOS}
        metricas={METRICAS}
        filtrarPor="Categoria"
        campoEtiqueta="Nombre"
      />
    </div>
  );
}
