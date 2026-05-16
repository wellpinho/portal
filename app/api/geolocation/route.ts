import { NextRequest, NextResponse } from "next/server";
import {
  detectLocationFromHeaders,
  getDetectedCityPath,
  GeolocationData,
} from "@/lib/geolocation.utils";

/**
 * GET /api/geolocation
 * Detecta a localização do usuário baseada em seu IP
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Obter IP do usuário
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      request.headers.get("cf-connecting-ip") ||
      "unknown";

    // Converter headers para objeto Record
    const headersRecord: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headersRecord[key] = value;
    });

    // Detectar localização
    const geolocation = detectLocationFromHeaders(headersRecord, ip);
    const detectedCityPath = getDetectedCityPath(geolocation.detectedCity);

    const response: {
      success: boolean;
      data: GeolocationData;
      cityPath?: string | null;
    } = {
      success: true,
      data: geolocation,
      cityPath: detectedCityPath,
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error detecting geolocation:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao detectar localização",
      },
      { status: 500 },
    );
  }
}
