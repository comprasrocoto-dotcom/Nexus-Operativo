import { notFound } from "next/navigation";
import { moduleGroups } from "@/lib/mock-data";
import { Card } from "@/components/ui";
import { ModuleTabs } from "@/components/module-tabs";
import { Building2 } from "lucide-react";

const groupIcons: Record<string, typeof Building2> = {
  operaciones: Building2,
};

export function generateStaticParams() {
  return moduleGroups.flatMap((g) => g.modules.map((m) => ({ slug: m.slug })));
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const group = moduleGroups.find((g) => g.modules.some((m) => m.slug === slug));
  const mod = group?.modules.find((m) => m.slug === slug);

  if (!mod || !group) {
    notFound();
  }

  const GroupIcon = groupIcons[group.key] ?? Building2;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <GroupIcon className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{group.name}</p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{mod.name}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{mod.description}</p>
          </div>
        </div>
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-xs text-slate-400">Documentos</p>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{mod.docCount}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Actualizado</p>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{mod.lastUpdate}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Responsable</p>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{mod.owner}</p>
          </div>
        </div>
      </Card>

      <ModuleTabs submodules={mod.submodules} />
    </div>
  );
}
