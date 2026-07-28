import { SedesClient } from "@/components/operaciones/sedes-client";

// La carga de sedes ocurre en cliente vía DataProvider (Demo/localStorage o Gas).
// Así el modo Demo funciona sin backend y sin fallar por token de GAS.
export const dynamic = "force-dynamic";

export default function SedesPage() {
  return <SedesClient sedesIniciales={[]} />;
}
