import { ClipboardList, ShieldCheck, Users } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { fetchPoliticas } from "@/lib/gas";

export const revalidate = 120;

const estadoVariant: Record<string, "success" | "warning" | "danger" | "muted"> = {
  activo: "success",
  vigente: "success",
  revision: "warning",
  en_revision: "warning",
  obsoleto: "danger",
};

export default async function PoliticasPage() {
  const { ok, data, error } = await fetchPoliticas();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Politicas
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Documentos vigentes de politicas operativas, conectados en vivo con la base de datos.
        </p>
      </div>

      {!ok && (
        <Card className="border border-danger/20 bg-danger/5 px-6 py-5 text-sm text-danger">
          No fue posible cargar las politicas ({error}). Intenta de nuevo en unos minutos.
        </Card>
      )}

      {ok && data.length === 0 && (
        <Card className="px-6 py-10 text-center text-slate-500">
          Aun no hay politicas publicadas.
        </Card>
      )}

      <div className="flex flex-col gap-4">
        {data.map((politica) => {
          const variant =
            estadoVariant[(politica.estado || "").toLowerCase()] ?? "muted";
          return (
            <Card key={politica.id} className="flex flex-col gap-3 p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {politica.titulo}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {politica.categoria}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={variant}>{politica.estado || "sin estado"}</Badge>
                  <Badge variant="secondary">v{politica.version}</Badge>
                </div>
              </div>

              {politica.objetivo && (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {politica.objetivo}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                {politica.responsables && politica.responsables.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {politica.responsables.join(", ")}
                  </span>
                )}
                {politica.responsableDocumento && (
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    {politica.responsableDocumento}
                  </span>
                )}
              </div>

              {politica.procedimiento && (
                <details className="group rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
                  <summary className="flex cursor-pointer items-center gap-2 font-medium text-slate-700 dark:text-slate-200">
                    <ClipboardList className="h-4 w-4" />
                    Ver procedimiento
                  </summary>
                  <p className="mt-3 whitespace-pre-line">{politica.procedimiento}</p>
                </details>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
