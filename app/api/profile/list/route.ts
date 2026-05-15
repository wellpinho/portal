import { NextResponse } from "next/server";

const api = process.env.NEXT_PUBLIC_API;

export async function GET(request: Request) {
  if (!api) {
    return NextResponse.json(
      { message: "API_URL nao configurada." },
      { status: 500 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") ?? "1";
    const limit = searchParams.get("limit") ?? "10";
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");

    if (!slug) {
      return NextResponse.json(
        { message: "Parâmetro 'slug' é obrigatório." },
        { status: 400 },
      );
    }

    if (!category) {
      return NextResponse.json(
        { message: "Parâmetro 'category' é obrigatório." },
        { status: 400 },
      );
    }

    const upstreamUrl = new URL(`${api}/profile/list`);
    upstreamUrl.searchParams.set("page", page);
    upstreamUrl.searchParams.set("limit", limit);
    upstreamUrl.searchParams.set("slug", slug);
    upstreamUrl.searchParams.set("category", category);

    const response = await fetch(upstreamUrl.toString(), {
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
