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
];

export const mostViewedDocuments = [...recentDocuments].sort((a, b) => b.views - a.views);

export const dashboardStats = {
    vigentes: 187,
    pendientesAprobacion: 12,
    proximosAVencer: 6,
    totalDocumentos: 220,
};
