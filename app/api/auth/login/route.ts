import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "@/lib/rateLimiter";

const api = process.env.AUTH_URL;

export async function POST(request: NextRequest) {
  if (!api) {
    return NextResponse.json(
      { message: "AUTH_URL não configurada." },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const { email, password } = body;

    // Validação básica
    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Email e senha são obrigatórios.",
          errors: {
            email: !email ? ["Email é obrigatório"] : [],
            password: !password ? ["Senha é obrigatória"] : [],
          },
        },
        { status: 400 },
      );
    }

    // Obter IP do cliente
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      request.ip ||
      "unknown";

    // Verificar rate limit
    const rateLimitCheck = rateLimiter.checkRateLimit(ip, email);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          message: rateLimitCheck.message,
          retryAfter: rateLimitCheck.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimitCheck.retryAfter?.toString() || "3600",
          },
        },
      );
    }

    // Chamar a API de autenticação
    const response = await fetch(`${api}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json().catch(() => null);

    // Se o login foi bem-sucedido
    if (response.ok) {
      rateLimiter.recordSuccessfulLogin(ip, email);

      // Se houver token na resposta, pode armazenar em cookie
      const token = data?.access_token || data?.token;
      if (token) {
        const responseData = NextResponse.json(data, {
          status: response.status,
        });

        // Armazenar token em um cookie seguro (httpOnly)
        responseData.cookies.set("auth_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 dias
          path: "/",
        });

        return responseData;
      }

      return NextResponse.json(data, { status: response.status });
    }

    // Registrar falha na tentativa
    rateLimiter.recordFailedAttempt(ip, email);

    // Tratar erro de autenticação
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return NextResponse.json(
      { message: "Erro ao conectar com o servidor." },
      { status: 502 },
    );
  }
}
