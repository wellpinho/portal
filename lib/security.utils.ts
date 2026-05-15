// Delay progressivo para tornar ataques de força bruta mais lentos
export const calculateDelay = (attemptCount: number): number => {
  // Exponential backoff: 1s, 2s, 4s, 8s, 16s...
  const baseDelay = 1000; // 1 segundo
  const maxDelay = 30000; // 30 segundos máximo

  const delay = Math.min(baseDelay * Math.pow(2, attemptCount - 1), maxDelay);
  return delay;
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Adicionar ruído aleatório para dificultar timing attacks
export const addJitter = (delay: number): number => {
  const jitter = Math.random() * 1000; // Até 1 segundo de variação
  return delay + jitter;
};
