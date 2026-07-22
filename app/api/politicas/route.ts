import { NextResponse } from "next/server";

export const revalidate = 120;

export async function GET() {
  const execUrl = process.env.GAS_EXEC_URL;
  const apiKey = process.env.GAS_API_KEY;

  if (!execUrl || !apiKey) {
    return NextResponse.json(
      { ok: false, error: "Backend no configurado" },
      { status: 500 }
    );
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
      next: { tags: ["politicas"] },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
