"use client";

import { useEffect } from "react";

export default function RegisterSW() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      console.warn("[SW] Service Worker não suportado neste navegador.");
      return;
    }

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("[SW] Registrado com sucesso:", registration.scope);
      })
      .catch((error) => {
        console.error("[SW] Erro ao registrar:", error);
      });
  }, []);

  return null;
}
