import { fetchSedes } from "@/lib/operaciones";
import { SedesClient } from "@/components/operaciones/sedes-client";

// Se pide "todas" (incluye inactivas) para que la pantalla pueda filtrarlas
// en cliente entre activas / inactivas / todas.
export const revalidate = 60;

export default async function SedesPage() {
  const { ok, data, error } = await fetchSedes({ incluirInactivas: true });

  if (!ok) {
    return (
      <div className="mx-auto max-w-5xl py-10">
        <div className="rounded-2xl border border-danger/20 bg-danger/5 px-6 py-5 text-sm text-danger">
          No fue posible cargar las sedes ({error}). Verifica que el backend del
          Centro de Operaciones este configurado.
        </div>
      </div>
    );
  }

  return <SedesClient sedesIniciales={data ?? []} />;
}
