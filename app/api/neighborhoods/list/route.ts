import { NextResponse } from "next/server";

const api = process.env.API_URL;

export async function GET() {
  if (!api) {
    return NextResponse.json(
      { message: "API_URL não configurada." },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(`${api}/neighborhoods/list`, {
      method: "GET",
      cache: "no-store",
    });

    const data: unknown = await response.json().catch(() => null);

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "Erro ao conectar com o servidor." },
      { status: 502 },
    );
  }
}
