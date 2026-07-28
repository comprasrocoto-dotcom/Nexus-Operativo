import { SedesClient } from "@/components/operaciones/sedes-client";

export const dynamic = "force-dynamic";

export default function SedesPage() {
  return <SedesClient sedesIniciales={[]} />;
}
