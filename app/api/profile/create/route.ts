import { NextResponse } from "next/server";

const api = process.env.NEXT_PUBLIC_API;

const allowedImageMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

function getImageMimeTypeFromName(fileName: string): string | null {
  const normalized = fileName.toLowerCase();

  if (normalized.endsWith(".jpg") || normalized.endsWith(".jpeg")) {
    return "image/jpeg";
  }

  if (normalized.endsWith(".png")) {
    return "image/png";
  }

  if (normalized.endsWith(".webp")) {
    return "image/webp";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const incomingFormData = await request.formData();
    const outgoingFormData = new FormData();

    for (const [key, value] of incomingFormData.entries()) {
      if (!(value instanceof File)) {
        outgoingFormData.append(key, value);
        continue;
      }

      if (key !== "avatar" && key !== "gallery") {
        outgoingFormData.append(key, value);
        continue;
      }

      const detectedType = value.type || getImageMimeTypeFromName(value.name);

      if (!detectedType || !allowedImageMimeTypes.includes(detectedType)) {
        return NextResponse.json(
          { message: "Apenas imagens são permitidas!" },
          { status: 422 },
        );
      }

      if (value.type === detectedType) {
        outgoingFormData.append(key, value);
        continue;
      }

      const buffer = await value.arrayBuffer();
      const normalizedFile = new File([buffer], value.name, {
        type: detectedType,
        lastModified: Date.now(),
      });

      outgoingFormData.append(key, normalizedFile);
    }

    const response = await fetch(`${api}/profile/create`, {
      method: "POST",
      body: outgoingFormData,
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
