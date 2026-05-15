interface LoginAttempt {
  count: number;
  lastAttempt: number;
  blocked: boolean;
  blockUntil?: number;
}

class RateLimiter {
  private attempts = new Map<string, LoginAttempt>();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutos
  private readonly blockDurationMs = 30 * 60 * 1000; // 30 minutos de bloqueio

  private getKey(ip: string, email: string): string {
    return `${ip}:${email}`;
  }

  public checkRateLimit(
    ip: string,
    email: string,
  ): { allowed: boolean; message?: string; retryAfter?: number } {
    const key = this.getKey(ip, email);
    const now = Date.now();
    const attempt = this.attempts.get(key);

    // Se não há tentativas anteriores
    if (!attempt) {
      this.attempts.set(key, {
        count: 1,
        lastAttempt: now,
        blocked: false,
      });
      return { allowed: true };
    }

    // Se está bloqueado
    if (attempt.blocked && attempt.blockUntil && now < attempt.blockUntil) {
      const retryAfter = Math.ceil((attempt.blockUntil - now) / 1000);
      return {
        allowed: false,
        message: `Muitas tentativas de login. Tente novamente em ${Math.ceil(
          retryAfter / 60,
        )} minutos.`,
        retryAfter,
      };
    }

    // Se o tempo da janela passou, resetar contador
    if (now - attempt.lastAttempt > this.windowMs) {
      this.attempts.set(key, {
        count: 1,
        lastAttempt: now,
        blocked: false,
      });
      return { allowed: true };
    }

    // Incrementar contador
    attempt.count++;
    attempt.lastAttempt = now;

    // Se excedeu o limite, bloquear
    if (attempt.count > this.maxAttempts) {
      attempt.blocked = true;
      attempt.blockUntil = now + this.blockDurationMs;

      return {
        allowed: false,
        message: `Muitas tentativas de login falharam. Conta bloqueada por ${
          this.blockDurationMs / 60000
        } minutos.`,
        retryAfter: this.blockDurationMs / 1000,
      };
    }

    return { allowed: true };
  }

  public recordFailedAttempt(ip: string, email: string): void {
    const key = this.getKey(ip, email);
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (attempt) {
      attempt.count++;
      attempt.lastAttempt = now;
    } else {
      this.attempts.set(key, {
        count: 1,
        lastAttempt: now,
        blocked: false,
      });
    }
  }

  public recordSuccessfulLogin(ip: string, email: string): void {
    const key = this.getKey(ip, email);
    this.attempts.delete(key);
  }

  // Limpar tentativas antigas periodicamente
  public cleanup(): void {
    const now = Date.now();
    for (const [key, attempt] of this.attempts.entries()) {
      if (
        now - attempt.lastAttempt > this.windowMs &&
        (!attempt.blockUntil || now > attempt.blockUntil)
      ) {
        this.attempts.delete(key);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// Executar limpeza a cada 5 minutos
if (typeof window === "undefined") {
  // Apenas no servidor
  setInterval(
    () => {
      rateLimiter.cleanup();
    },
    5 * 60 * 1000,
  );
}
