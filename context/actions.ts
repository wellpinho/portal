/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { FormState, LoginFormSchema, SessionPayload } from "@/lib/zod.lib";
import { rateLimiter } from "@/lib/rateLimiter";
import { calculateDelay, sleep, addJitter } from "@/lib/security.utils";
import { console } from "inspector";
import { securityLogger } from "@/lib/security-logger.lib";
import { getToken } from "@/services/api-cliente.service";
import { tryCatch } from "@/utils/index.utils";

const secretKey = process.env.SECRET;
const key = new TextEncoder().encode(secretKey);
const expiresIn = 60 * 24 * 30;

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(key);
}

export async function authorization() {
  const cookieStore = await cookies();
  const hasToken = cookieStore.get("@auth_token");
  if (hasToken) redirect("/");
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(token: string) {
  const cookieStore = await cookies();

  // Decodificar o token para extrair as informações do usuário
  try {
    // Decodificar o JWT token da API (sem verificar assinatura pois é da API externa)
    const tokenParts = token.split(".");
    if (tokenParts.length === 3) {
      // JWT usa base64url, precisamos converter para base64 padrão antes de decodificar no Node
      const decodeJwtPayload = (part: string) => {
        const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
        const padding =
          b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
        const data = Buffer.from(b64 + padding, "base64").toString("utf8");
        return JSON.parse(data);
      };

      const payload = decodeJwtPayload(tokenParts[1]);

      // Criar um JWT próprio com as informações do usuário
      const userPayload: SessionPayload = {
        userId: payload.sub || payload.id,
        email: payload.email,
        name: payload.name,
        phone: payload.phone,
        state: payload.state,
        city: payload.city,
        account: payload.account,
        category: payload.category,
        slug: payload.slug,
        hasProfile:
          typeof payload.hasProfile === "boolean" ? payload.hasProfile : false,
        plan: payload.plan || null,
        profile: payload.profile,
      };

      const sessionToken = await encrypt(userPayload);

      cookieStore.set("@auth_token", sessionToken, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: expiresIn,
      });
    } else {
      // Se não for um JWT, salvar como está (fallback)
      cookieStore.set("@auth_token", token, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        maxAge: expiresIn,
      });
    }
  } catch (error) {
    console.error("Error creating session:", error);
    // Fallback: salvar token como está
    cookieStore.set("@auth_token", token, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      maxAge: expiresIn,
    });
  }
}

export async function login(formData: FormData): Promise<FormState> {
  // Obter IP e User Agent do usuário
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0] || realIp || "unknown";
  const userAgent = headersList.get("user-agent") || "unknown";

  // 1. Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  const errorMessage = {
    message: "Credenciais inválidas. Você já está registrado?",
  };
  const internalMessage = {
    message: "Internal error. Please, contact suport.",
  };

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  // 2. Verificar rate limiting
  const rateLimitResult = rateLimiter.checkRateLimit(ip, email);
  if (!rateLimitResult.allowed) {
    securityLogger.log({
      type: "rate_limit",
      ip,
      email,
      userAgent,
      details: rateLimitResult.message,
    });

    return {
      message:
        rateLimitResult.message ||
        "Muitas tentativas. Tente novamente mais tarde.",
    };
  }

  // 3. Adicionar delay progressivo baseado em tentativas anteriores
  const cookieStore = await cookies();
  const attemptsCookie = cookieStore.get(`login_attempts_${email}`);
  const attemptCount = attemptsCookie ? parseInt(attemptsCookie.value) : 0;

  if (attemptCount > 0) {
    const delay = addJitter(calculateDelay(attemptCount));
    await sleep(delay);
  }

  // VER DEPOIS CSRF
  // const [csrfError, csrfToken] = await tryCatch(getCsrfToken());

  // if (csrfError) {
  //     return { message: "Erro ao obter CSRF token." };
  // }

  // 4. Query the database for the user with the given email
  const [error, response] = await tryCatch(getToken({ email, password }));

  if (error) {
    // Registrar tentativa falhada
    rateLimiter.recordFailedAttempt(ip, email);

    securityLogger.log({
      type: "login_fail",
      ip,
      email,
      userAgent,
      details: "Login failed - API error",
    });

    // Incrementar contador de tentativas
    const newAttemptCount = attemptCount + 1;
    cookieStore.set(`login_attempts_${email}`, newAttemptCount.toString(), {
      maxAge: 60 * 15, // 15 minutos
      httpOnly: true,
      secure: true,
    });

    return error;
  }

  if (!response) {
    rateLimiter.recordFailedAttempt(ip, email);

    securityLogger.log({
      type: "login_fail",
      ip,
      email,
      userAgent,
      details: "Login failed - No response from API",
    });

    const newAttemptCount = attemptCount + 1;
    cookieStore.set(`login_attempts_${email}`, newAttemptCount.toString(), {
      maxAge: 60 * 15,
      httpOnly: true,
      secure: true,
    });
    return internalMessage;
  }

  if (!response?.access_token) {
    rateLimiter.recordFailedAttempt(ip, email);

    securityLogger.log({
      type: "login_fail",
      ip,
      email,
      userAgent,
      details: "Login failed - Invalid credentials",
    });

    const newAttemptCount = attemptCount + 1;
    cookieStore.set(`login_attempts_${email}`, newAttemptCount.toString(), {
      maxAge: 60 * 15,
      httpOnly: true,
    });
    return errorMessage;
  }

  if (response?.access_token) {
    // Login bem-sucedido - limpar tentativas
    rateLimiter.recordSuccessfulLogin(ip, email);
    cookieStore.delete(`login_attempts_${email}`);

    securityLogger.log({
      type: "login_success",
      ip,
      email,
      userAgent,
      details: "Login successful",
    });

    await createSession(response?.access_token);

    const session = cookieStore.get("@auth_token");

    const user = await decrypt(session?.value);

    console.log("User data from token:", user);

    // se esta logado, não é user e não tem profile, redirecionar para criar profile
    if (user?.userId && !user?.hasProfile) {
      redirect("/profile");
    }

    if (session) {
      redirect("/");
    }

    redirect("/404");
  }
}

export async function logout() {
  deleteSession();
}

export async function verifySession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("@auth_token")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/");
  }

  // session é do tipo JWTPayload & SessionPayload; garantir tipagem segura
  const s = session as SessionPayload;
  return {
    isAuth: true,
    userId: Number(s.userId),
    account: s.account,
    hasProfile: Boolean(s.hasProfile),
  };
}

export async function getSession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("@auth_token")?.value;

  return cookie || null;
}

export async function updateSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("@auth_token")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  cookieStore.set("@auth_token", session, {
    httpOnly: true,
    secure: true,
    expires: expiresIn,
    sameSite: "lax",
    path: "/",
  });
}

export async function getUserDataAction() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("@auth_token")?.value;
  const session = await decrypt(cookie);

  if (!session) {
    return null;
  }

  const { userId, email, name, phone } = session as SessionPayload;

  return {
    id: userId,
    email,
    name,
    phone,
  };
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("@auth_token");
  cookieStore.delete("@csrf_token");
  redirect("/");
}
