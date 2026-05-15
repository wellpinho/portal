interface SecurityEvent {
  type:
    | "login_attempt"
    | "login_success"
    | "login_fail"
    | "rate_limit"
    | "suspicious_activity";
  ip: string;
  email?: string;
  userAgent?: string;
  timestamp: number;
  details?: string;
}

class SecurityLogger {
  private events: SecurityEvent[] = [];
  private maxEvents = 10000; // Manter apenas os últimos 10k eventos

  public log(event: Omit<SecurityEvent, "timestamp">) {
    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now(),
    };

    this.events.push(fullEvent);

    // Manter apenas os eventos mais recentes
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Em produção, você deveria enviar para um serviço de logging
    // como CloudWatch, DataDog, etc.
  }

  public getRecentEvents(
    type?: SecurityEvent["type"],
    limit = 100,
  ): SecurityEvent[] {
    let filteredEvents = this.events;

    if (type) {
      filteredEvents = this.events.filter((e) => e.type === type);
    }

    return filteredEvents
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  public getFailedLoginsByIP(ip: string, hoursAgo = 24): SecurityEvent[] {
    const cutoff = Date.now() - hoursAgo * 60 * 60 * 1000;

    return this.events.filter(
      (e) => e.type === "login_fail" && e.ip === ip && e.timestamp > cutoff,
    );
  }

  public getFailedLoginsByEmail(email: string, hoursAgo = 24): SecurityEvent[] {
    const cutoff = Date.now() - hoursAgo * 60 * 60 * 1000;

    return this.events.filter(
      (e) =>
        e.type === "login_fail" && e.email === email && e.timestamp > cutoff,
    );
  }

  // Detectar padrões suspeitos
  public detectSuspiciousPatterns(): {
    suspiciousIPs: string[];
    suspiciousEmails: string[];
  } {
    const suspiciousIPs: string[] = [];
    const suspiciousEmails: string[] = [];
    const ipCounts = new Map<string, number>();
    const emailCounts = new Map<string, number>();

    // Contar falhas nas últimas 24h
    const last24h = Date.now() - 24 * 60 * 60 * 1000;
    const recentFailures = this.events.filter(
      (e) => e.type === "login_fail" && e.timestamp > last24h,
    );

    // Contar por IP
    for (const event of recentFailures) {
      ipCounts.set(event.ip, (ipCounts.get(event.ip) || 0) + 1);
      if (event.email) {
        emailCounts.set(event.email, (emailCounts.get(event.email) || 0) + 1);
      }
    }

    // IPs com mais de 20 falhas
    for (const [ip, count] of ipCounts) {
      if (count > 20) {
        suspiciousIPs.push(ip);
      }
    }

    // Emails com mais de 10 tentativas falhadas
    for (const [email, count] of emailCounts) {
      if (count > 10) {
        suspiciousEmails.push(email);
      }
    }

    return { suspiciousIPs, suspiciousEmails };
  }
}

export const securityLogger = new SecurityLogger();
