"use client";

import { Card, Badge, Button } from "@/components/ui";
import { FolderOpen, Image, FileText, Sheet, FileType, Video, Upload } from "lucide-react";

interface EvidenciasProps {
  sedeId: string;
  rutaDrive?: string;
}

const TIPOS = [
  { titulo: "Fotos", icono: Image },
  { titulo: "PDF", icono: FileText },
  { titulo: "Excel", icono: Sheet },
  { titulo: "Word", icono: FileType },
  { titulo: "Videos", icono: Video },
];

/**
 * Pestana Evidencias. Se conectara a Google Drive por sede.
 * Muestra los tipos de archivo disponibles; el listado real llegara del conector Drive.
 */
export function Evidencias({ rutaDrive }: EvidenciasProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700">
          <FolderOpen className="h-4 w-4 text-primary" />
          <span className="font-medium">Evidencias de la sede</span>
        </div>
        <Button className="gap-1"><Upload className="h-4 w-4" /> Subir evidencia</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {TIPOS.map((t) => {
          const Icono = t.icono;
          return (
            <Card key={t.titulo} className="p-5 rounded-2xl shadow-soft flex flex-col items-center justify-center gap-2">
              <Icono className="h-6 w-6 text-primary" />
              <div className="text-sm font-medium text-slate-700">{t.titulo}</div>
              <Badge>0</Badge>
            </Card>
          );
        })}
      </div>

      <Card className="p-5 rounded-2xl shadow-soft">
        {rutaDrive ? (
          <div className="text-sm text-slate-600">Carpeta de Drive vinculada: <span className="font-mono text-slate-800">{rutaDrive}</span></div>
        ) : (
          <div className="py-10 text-center text-slate-400 text-sm">Aun no hay una carpeta de Google Drive vinculada a esta sede.</div>
        )}
      </Card>
    </div>
  );
}

export default Evidencias;
