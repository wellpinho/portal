import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_CITY_PATH, isSupportedCityPath } from "@/lib/locations";
import {
  detectLocationFromHeaders,
  getDetectedCityPath,
} from "@/lib/geolocation.utils";

const LOCATION_COOKIE = "cl_location";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname !== "/") {
    return NextResponse.next();
  }

  // 1. Verificar se tem cookie salvo de localização anterior
  const savedLocation = request.cookies.get(LOCATION_COOKIE)?.value;
  if (savedLocation && isSupportedCityPath(savedLocation)) {
    const nextUrl = request.nextUrl.clone();
    nextUrl.pathname = savedLocation;
    return NextResponse.redirect(nextUrl);
  }

  // 2. Tentar detectar localização pelo IP/headers
  const headersRecord: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headersRecord[key] = value;
  });

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown";

  const geolocation = detectLocationFromHeaders(headersRecord, ip);
  const detectedCityPath = getDetectedCityPath(geolocation.detectedCity);

  if (detectedCityPath && isSupportedCityPath(detectedCityPath)) {
    const response = NextResponse.redirect(
      new URL(detectedCityPath, request.url),
    );
    // Salvar localização em cookie para próximas visitas
    response.cookies.set(LOCATION_COOKIE, detectedCityPath, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 dias
    });
    return response;
  }

  // 3. Fallback: usar cidade padrão
  const nextUrl = request.nextUrl.clone();
  nextUrl.pathname = DEFAULT_CITY_PATH;

  return NextResponse.redirect(nextUrl);
}

export const config = {
  matcher: ["/"],
};
