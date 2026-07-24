import { SedeDetalle } from "@/components/operaciones/sedes/sede-detalle";

/**
 * Ficha de la Sede — Centro de Informacion (nucleo del ERP).
 * Server Component: solo resuelve el parametro de ruta y ensambla el shell.
 * Toda la logica vive en el shell y en los componentes/hooks de cada modulo.
 */

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FichaSedePage({ params }: PageProps) {
  const { id } = await params;
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <SedeDetalle sedeId={id} />
    </main>
  );
}
