export const handleShareWhatsapp = () => {
  // Pega a URL exata da página atual (ex: https://comercioslocais.com.br/aguas-mornas/agro-e-coloniais)
  const urlAtual = window.location.href;

  const mensagem = `Olha que legal esse portal com os comércios e serviços da nossa região! Dá uma olhada ou cadastre sua empresa: ${urlAtual}`;

  // Codifica a string de forma segura para URL
  const linkWhats = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`;

  // Abre em uma nova aba
  window.open(linkWhats, "_blank");
};
