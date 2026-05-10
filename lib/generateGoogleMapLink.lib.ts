export function generateMapsLink(
  name: string,
  street: string,
  city: string,
  state: string,
): string {
  // Monta a string de endereço combinando os campos
  const fullAddress = `${name}, ${street}, ${city} - ${state}`;

  // encodeURIComponent lida com acentos e caracteres especiais com segurança
  const encodedAddress = encodeURIComponent(fullAddress);

  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
}
