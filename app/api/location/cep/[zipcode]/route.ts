import { NextResponse } from "next/server";

type ViaCepResponse = {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ zipcode: string }> },
) {
  const { zipcode } = await context.params;
  const digits = zipcode.replace(/\D/g, "");

  if (digits.length !== 8) {
    return NextResponse.json({ message: "CEP invalido." }, { status: 400 });
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Nao foi possivel consultar o CEP." },
        { status: 502 },
      );
    }

    const data = (await response.json()) as ViaCepResponse;

    if (data.erro) {
      return NextResponse.json(
        { message: "CEP nao encontrado." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      zipcode: data.cep ?? "",
      street: data.logradouro ?? "",
      neighborhood: data.bairro ?? "",
      city: data.localidade ?? "",
      state: data.uf ?? "",
    });
  } catch {
    return NextResponse.json(
      { message: "Erro ao consultar o CEP." },
      { status: 502 },
    );
  }
}
