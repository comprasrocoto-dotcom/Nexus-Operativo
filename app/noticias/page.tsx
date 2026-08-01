"use client";

import PanelRecurso, {
  type CampoPanel,
  type MetricaPanel,
} from "@/components/operaciones/sedes/panel-recurso";

// Noticias y comunicados internos del Grupo DASHI. Reutiliza el CRUD generico
// (PanelRecurso -> crudRecurso -> DataProvider). Sin componentes nuevos.

const CATEGORIAS = [
  "Comunicado",
  "Operaciones",
  "Talento humano",
  "Calidad",
  "Reconocimientos",
  "Eventos",
];

const ESTADOS = ["Borrador", "Publicada", "Archivada"];

const CAMPOS: CampoPanel[] = [
  { clave: "Codigo", titulo: "Codigo" },
  { clave: "Nombre", titulo: "Titulo", requerido: true },
  { clave: "Categoria", titulo: "Categoria", tipo: "select", opciones: CATEGORIAS },
  { clave: "Fecha", titulo: "Fecha de publicacion", tipo: "fecha" },
  { clave: "Autor", titulo: "Autor" },
  { clave: "Estado", titulo: "Estado", tipo: "select", opciones: ESTADOS, badge: true },
  {
    clave: "Imagen",
    titulo: "Imagen de portada",
    tipo: "imagen",
    acepta: ".png,.jpg,.jpeg,.webp",
    enTabla: false,
    anchoCompleto: true,
  },
  {
    clave: "Resumen",
    titulo: "Resumen",
    tipo: "textarea",
    enTabla: false,
    anchoCompleto: true,
  },
  {
    clave: "Contenido",
    titulo: "Contenido",
    tipo: "textarea",
    enTabla: false,
    anchoCompleto: true,
  },
];

const METRICAS: MetricaPanel[] = [
  { titulo: "Noticias", calcular: (items) => String(items.length) },
  {
    titulo: "Publicadas",
    calcular: (items) =>
      String(items.filter((i) => String(i.Estado ?? "") === "Publicada").length),
  },
  {
    titulo: "Borradores",
    calcular: (items) =>
      String(items.filter((i) => String(i.Estado ?? "") === "Borrador").length),
  },
];

export default function NoticiasPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Noticias
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Comunicados y novedades internas del Grupo DASHI, administrables desde la web.
        </p>
      </div>
      <PanelRecurso
        recurso="noticias"
        titulo="Listado de noticias"
        descripcion="Crear, editar, consultar, buscar y dar de baja noticias."
        etiquetaNuevo="Nueva noticia"
        vacioMensaje="Aun no hay noticias registradas. Usa Nueva noticia para publicar la primera."
        campos={CAMPOS}
        metricas={METRICAS}
        filtrarPor="Categoria"
        campoEtiqueta="Nombre"
      />
    </div>
  );
}
