"use client";

import PanelRecurso, {
  type CampoPanel,
  type MetricaPanel,
} from "@/components/operaciones/sedes/panel-recurso";

// Biblioteca de formatos y plantillas corporativas del Grupo DASHI. Reutiliza el
// CRUD generico (PanelRecurso -> crudRecurso -> DataProvider). Sin logica duplicada.

const CATEGORIAS = [
  "Operaciones",
  "Calidad",
  "SST",
  "Compras",
  "Talento humano",
  "Contabilidad",
  "Servicio al cliente",
];

const ESTADOS = ["Borrador", "Vigente", "Obsoleto"];

const ACEPTA_FORMATOS =
  ".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.png,.jpg,.jpeg,.webp";

const CAMPOS: CampoPanel[] = [
  { clave: "Codigo", titulo: "Codigo" },
  { clave: "Nombre", titulo: "Nombre del formato", requerido: true },
  { clave: "Categoria", titulo: "Categoria", tipo: "select", opciones: CATEGORIAS },
  {
    clave: "Archivo",
    titulo: "Archivo (PDF, Word, Excel, PowerPoint o imagen)",
    tipo: "archivo",
    acepta: ACEPTA_FORMATOS,
    anchoCompleto: true,
  },
  { clave: "Version", titulo: "Version" },
  { clave: "Fecha", titulo: "Fecha de emision", tipo: "fecha" },
  { clave: "Responsable", titulo: "Responsable" },
  { clave: "Estado", titulo: "Estado", tipo: "select", opciones: ESTADOS, badge: true },
  { clave: "Observaciones", titulo: "Observaciones", tipo: "textarea", enTabla: false },
];

const METRICAS: MetricaPanel[] = [
  { titulo: "Formatos", calcular: (items) => String(items.length) },
  {
    titulo: "Vigentes",
    calcular: (items) =>
      String(items.filter((i) => String(i.Estado ?? "") === "Vigente").length),
  },
  {
    titulo: "Con archivo",
    calcular: (items) =>
      String(items.filter((i) => String(i.Archivo ?? "").length > 0).length),
  },
];

export default function FormatosPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Formatos
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Formatos y plantillas oficiales del Grupo DASHI. Permite adjuntar archivos
          PDF, Word, Excel, PowerPoint e imagenes, o registrar el enlace del documento.
        </p>
      </div>
      <PanelRecurso
        recurso="formatos"
        titulo="Listado de formatos"
        descripcion="Crear, editar, consultar, buscar y dar de baja formatos."
        etiquetaNuevo="Nuevo formato"
        vacioMensaje="Aun no hay formatos registrados. Usa Nuevo formato para cargar el primero."
        campos={CAMPOS}
        metricas={METRICAS}
        filtrarPor="Categoria"
        campoEtiqueta="Nombre"
      />
    </div>
  );
}
