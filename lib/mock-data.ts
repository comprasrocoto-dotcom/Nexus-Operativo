export type EstadoDocumento = "Vigente" | "En revision" | "Obsoleto";

export interface Indicator {
    key: string;
    label: string;
    count: number;
    href: string;
    icon: string;
}

export const indicators: Indicator[] = [
  { key: "politicas", label: "Politicas", count: 38, href: "/politicas", icon: "BookOpen" },
  { key: "procedimientos", label: "Procedimientos", count: 52, href: "/procedimientos", icon: "Settings2" },
  { key: "manuales", label: "Manuales", count: 21, href: "/manuales", icon: "FileText" },
  { key: "videos", label: "Videos", count: 14, href: "/videos", icon: "Video" },
  { key: "formatos", label: "Formatos", count: 29, href: "/formatos", icon: "Paperclip" },
  { key: "noticias", label: "Noticias", count: 9, href: "/noticias", icon: "Megaphone" },
  { key: "faq", label: "Preguntas frecuentes", count: 17, href: "/faq", icon: "HelpCircle" },
  ];

export interface ModuleItem {
    slug: string;
    name: string;
    description: string;
    color: string;
    docCount: number;
    lastUpdate: string;
    owner: string;
    submodules: string[];
}

export interface ModuleGroup {
    key: string;
    name: string;
    icon: string;
    modules: ModuleItem[];
}

export const moduleGroups: ModuleGroup[] = [
  {
        key: "operaciones",
        name: "Operaciones",
        icon: "Building2",
        modules: [
          { slug: "inventarios", name: "Inventarios", description: "Control de existencias, conteos y ajustes de inventario.", color: "orange", docCount: 24, lastUpdate: "hace 3 dias", owner: "Ana Ruiz", submodules: ["Conteos", "Ajustes", "Kardex"] },
          { slug: "compras", name: "Compras", description: "Procesos de abastecimiento y negociacion con proveedores.", color: "blue", docCount: 18, lastUpdate: "hace 1 semana", owner: "Carlos Perez", submodules: ["Proveedores", "Ordenes de compra"] },
          { slug: "costos", name: "Costos", description: "Estructura de costos, fichas tecnicas y rentabilidad.", color: "green", docCount: 12, lastUpdate: "hace 2 dias", owner: "Laura Gomez", submodules: ["Fichas tecnicas", "Rentabilidad"] },
          { slug: "fabricaciones", name: "Fabricaciones", description: "Procesos de produccion interna y transformacion.", color: "purple", docCount: 9, lastUpdate: "hace 5 dias", owner: "Diego Salas", submodules: ["Ordenes de produccion"] },
          { slug: "calidad", name: "Calidad", description: "Estandares de calidad e inocuidad alimentaria.", color: "teal", docCount: 15, lastUpdate: "hoy", owner: "Marcela Ibanez", submodules: ["BPM", "HACCP"] },
          { slug: "auditorias", name: "Auditorias", description: "Planes de auditoria interna y externa.", color: "red", docCount: 7, lastUpdate: "hace 2 semanas", owner: "Julian Torres", submodules: ["Checklist", "Hallazgos"] },
              ],
  },
  {
        key: "rrhh",
        name: "Recursos Humanos",
        icon: "Users",
        modules: [
          { slug: "manual-empleado", name: "Manual del empleado", description: "Normas, beneficios y cultura organizacional.", color: "blue", docCount: 6, lastUpdate: "hace 1 mes", owner: "Sofia Ramirez", submodules: ["Reglamento interno"] },
          { slug: "capacitacion", name: "Capacitacion", description: "Programas de formacion y desarrollo del talento.", color: "orange", docCount: 11, lastUpdate: "hace 4 dias", owner: "Sofia Ramirez", submodules: ["Cronograma", "Evaluaciones"] },
          { slug: "induccion", name: "Induccion", description: "Proceso de bienvenida para nuevos colaboradores.", color: "green", docCount: 5, lastUpdate: "hace 6 dias", owner: "Sofia Ramirez", submodules: ["Checklist de ingreso"] },
              ],
  },
  {
        key: "administracion",
        name: "Administracion",
        icon: "Landmark",
        modules: [
          { slug: "contabilidad", name: "Contabilidad", description: "Procesos contables y cierre financiero.", color: "purple", docCount: 14, lastUpdate: "hace 2 dias", owner: "Ricardo Nieto", submodules: ["Cierres mensuales"] },
          { slug: "tesoreria", name: "Tesoreria", description: "Gestion de flujo de caja y pagos.", color: "teal", docCount: 8, lastUpdate: "hace 3 dias", owner: "Ricardo Nieto", submodules: ["Pagos a proveedores"] },
          { slug: "cartera", name: "Cartera", description: "Gestion de cuentas por cobrar.", color: "red", docCount: 6, lastUpdate: "hace 1 semana", owner: "Ricardo Nieto", submodules: ["Cobranza"] },
              ],
  },
  {
        key: "cocina",
        name: "Cocina",
        icon: "ChefHat",
        modules: [
          { slug: "recetas", name: "Recetas", description: "Estandarizacion de recetas y porciones.", color: "orange", docCount: 46, lastUpdate: "hoy", owner: "Chef Mario Duarte", submodules: ["Entradas", "Fuertes", "Postres"] },
          { slug: "produccion", name: "Produccion", description: "Planeacion de produccion diaria de cocina.", color: "blue", docCount: 10, lastUpdate: "ayer", owner: "Chef Mario Duarte", submodules: ["Mise en place"] },
          { slug: "bpm", name: "BPM", description: "Buenas practicas de manufactura en cocina.", color: "green", docCount: 13, lastUpdate: "hace 2 dias", owner: "Marcela Ibanez", submodules: ["Higiene", "Manejo de alimentos"] },
              ],
  },
  ];

export interface RecentDocument {
    id: string;
    title: string;
    area: string;
    status: EstadoDocumento;
    updatedAt: string;
    views: number;
    responsible: string;
}

export const recentDocuments: RecentDocument[] = [
  { id: "doc-1", title: "Politica de manejo de inventarios", area: "Inventarios", status: "Vigente", updatedAt: "hoy", views: 342, responsible: "Ana Ruiz" },
  { id: "doc-2", title: "Procedimiento de recepcion de mercancia", area: "Compras", status: "En revision", updatedAt: "ayer", views: 210, responsible: "Carlos Perez" },
  { id: "doc-3", title: "Manual de BPM en cocina", area: "BPM", status: "Vigente", updatedAt: "hace 2 dias", views: 501, responsible: "Marcela Ibanez" },
  { id: "doc-4", title: "Receta estandar: Salsa bechamel", area: "Recetas", status: "Vigente", updatedAt: "hace 2 dias", views: 189, responsible: "Chef Mario Duarte" },
  { id: "doc-5", title: "Politica de cartera y cobranza", area: "Cartera", status: "Obsoleto", updatedAt: "hace 3 semanas", views: 64, responsible: "Ricardo Nieto" },
  ];

export const mostViewedDocuments = [...recentDocuments].sort((a, b) => b.views - a.views);

export const dashboardStats = {
    vigentes: 187,
    pendientesAprobacion: 12,
    proximosAVencer: 6,
    totalDocumentos: 220,
};
