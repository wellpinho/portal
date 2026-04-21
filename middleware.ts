import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_CITY_PATH, isSupportedCityPath } from "@/lib/locations";

const LOCATION_COOKIE = "cl_location";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== "/") {
    return NextResponse.next();
  }

  const savedLocation = request.cookies.get(LOCATION_COOKIE)?.value;
  const targetPath =
    savedLocation && isSupportedCityPath(savedLocation)
      ? savedLocation
      : DEFAULT_CITY_PATH;

  const nextUrl = request.nextUrl.clone();
  nextUrl.pathname = targetPath;

  return NextResponse.redirect(nextUrl);
}

export const config = {
  matcher: ["/"],
};
