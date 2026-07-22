export type Politica = {
  id: string;
  version: number;
  slug: string;
  categoria: string;
  titulo: string;
  objetivo?: string;
  alcance?: string;
  responsables?: string[];
  procedimiento?: string;
  buenasPracticas?: string;
  erroresFrecuentes?: string;
  lecturaObligatoria?: boolean;
  responsableDocumento?: string;
  fechaVigencia?: string;
  fechaRevision?: string;
  estado?: string;
};

type PoliticasResponse = {
  ok: boolean;
  data: Politica[];
  error?: string;
};

export async function fetchPoliticas(): Promise<PoliticasResponse> {
  const execUrl = process.env.GAS_EXEC_URL;
  const apiKey = process.env.GAS_API_KEY;

  if (!execUrl || !apiKey) {
    return { ok: false, data: [], error: "Backend no configurado" };
  }

  try {
    const res = await fetch(execUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        recurso: "politicas",
        _method: "GET",
        apiKey,
        token: "nexus-server-interno",
      }),
      next: { tags: ["politicas"], revalidate: 120 },
    });

    const json = await res.json();

    if (!json.ok) {
      const mensaje =
        json.error && typeof json.error === "object"
          ? json.error.mensaje
          : json.error;
      return { ok: false, data: [], error: mensaje || "Error desconocido" };
    }

    return { ok: true, data: (json.data as Politica[]) || [] };
  } catch (err) {
    return { ok: false, data: [], error: String(err) };
  }
}
