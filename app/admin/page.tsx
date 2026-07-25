// app/admin/page.tsx — Ruta del modulo Administracion del Sistema.
// Solo ENSAMBLA: no contiene logica. Toda la logica vive en hooks/services/lib
// y el shell data-driven (AdminShell) resuelve las secciones desde lib/admin.ts.
import AdminShell from "@/components/admin/admin-shell";

export const metadata = {
  title: "Administracion del Sistema | Nexus Operativo",
  description: "Centro de configuracion del ERP: modulos, usuarios, roles, permisos, catalogos y parametros.",
};

export default function AdminPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <AdminShell />
    </main>
  );
}
