export function formatSlugToCityName(slug: string): string {
  if (!slug) return "";

  // 1. Remove o %20 e outros encodings de URL
  const decoded = decodeURIComponent(slug);

  // 2. Substitui traços por espaços e divide o texto em palavras
  const palavras = decoded.replace(/-/g, " ").split(" ");

  // Lista de conectores que devem continuar em minúsculo no português
  const conectores = ["de", "di", "do", "da", "dos", "das", "e", "em"];

  // 3. Aplica a capitalização correta
  const resultado = palavras.map((palavra, index) => {
    const palavraMinuscula = palavra.toLowerCase();

    // Se for um conector e não for a primeira palavra da frase, mantém minúsculo
    if (conectores.includes(palavraMinuscula) && index !== 0) {
      return palavraMinuscula;
    }

    // Caso contrário, coloca a primeira letra em maiúsculo
    return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
  });

  return resultado.join(" ");
}
