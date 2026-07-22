import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center py-24 text-center animate-fade-in">
      <Card className="flex w-full flex-col items-center gap-4 px-10 py-14">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
      </Card>
    </div>
  );
}
