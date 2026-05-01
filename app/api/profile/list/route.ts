import { NextResponse } from "next/server";

const api = process.env.API_URL;
const FIXED_PROFILE_SLUG = "aguas-mornas-sc";

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
    const limit = searchParams.get("limit") ?? "5";

    const upstreamUrl = new URL(`${api}/profile/list`);
    upstreamUrl.searchParams.set("page", page);
    upstreamUrl.searchParams.set("limit", limit);
    upstreamUrl.searchParams.set("slug", FIXED_PROFILE_SLUG);

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
