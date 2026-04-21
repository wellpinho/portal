import { NextResponse } from "next/server";
import { isSupportedCityPath } from "@/lib/locations";

const LOCATION_COOKIE = "cl_location";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { path?: string };
    const path = body.path;

    if (!path || !isSupportedCityPath(path)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: LOCATION_COOKIE,
      value: path,
      path: "/",
      maxAge: 60 * 60 * 24 * 180,
      sameSite: "lax",
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
