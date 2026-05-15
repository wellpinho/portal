/* eslint-disable @typescript-eslint/no-explicit-any */
export const removeSpacesAndSpecialCharacters = (value: string) =>
  value.replace(/[^a-zA-Z0-9]/g, "");

export const phoneValidation = (value: string) => {
  const phoneRegExp = /^\(?\d{2}\)?\s?9\d{4}-?\d{4}$/;
  const phone = value.match(phoneRegExp);

  return phone;
};

export const handleFilterAndOrderItens = (array: any, filter: string) => {
  const filteredProducts = array
    .filter((item: any) => {
      if (filter === "Todos") {
        return true; // Mostra todos os itens
      }

      if (filter === "Ocultar Inativos") {
        return item.messages < 5;
      }

      // Normaliza o filtro para comparação
      const normalizedFilter = filter
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      // Verifica se o filtro existe em qualquer posição do array specialties
      return item.specialties.some((specialty: string) => {
        const normalizedSpecialty = specialty
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        return normalizedSpecialty === normalizedFilter;
      });
    })
    .sort((a: any, b: any) => b.stars - a.stars);

  return filteredProducts;
};

export const handleDocumentValidation = (value: string) => {
  const document = removeSpacesAndSpecialCharacters(value);

  if (document.length <= 11) {
    if (/^(\d)\1{10}$/.test(document)) return false; // Rejeita documents com todos os dígitos iguais

    let sum = 0,
      remainder;

    for (let i = 0; i < 9; i++) sum += parseInt(document[i]) * (10 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(document[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(document[i]) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;

    return remainder === parseInt(document[10]);
  }

  if (/^(\d)\1{13}$/.test(document)) return false; // Rejeita documents com todos os dígitos iguais

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, ...weights1];

  const calculateDigit = (base: string, weights: number[]) => {
    const sum = base
      .split("")
      .reduce((acc, num, idx) => acc + parseInt(num) * weights[idx], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const digit1 = calculateDigit(document.slice(0, 12), weights1);
  const digit2 = calculateDigit(document.slice(0, 12) + digit1, weights2);

  return digit1 === parseInt(document[12]) && digit2 === parseInt(document[13]);
};

export const removeAccentsSpaces = (text: string): string => {
  return text
    .normalize("NFD") // Separa acentos das letras
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .toLowerCase() // Converte para minúsculas
    .replace(/\s+/g, "-") // Substitui espaços por hífen
    .replace(/[^a-z0-9-]/g, "") // Remove caracteres especiais
    .replace(/-+/g, "-") // Evita múltiplos hifens
    .trim(); // Remove espaços extras no começo e no fim
};

export const formatValueToReal = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const useCheckIsOpeningHours = (
  openTime: string,
  closeTime: string,
  currentTime: string,
): boolean => {
  function convertForMinutes(value: string) {
    const [hour, minuto] = value.split(":").map(Number);
    return hour * 60 + minuto;
  }

  const openInMinutes = convertForMinutes(openTime);
  const closeInMinutes = convertForMinutes(closeTime);
  const currentInMinutes = convertForMinutes(currentTime);

  if (currentInMinutes >= openInMinutes && currentInMinutes <= closeInMinutes) {
    return true; // is open
  } else {
    return false; // is closed
  }
};

export const tryCatch = (promise: Promise<any>) =>
  promise
    .then((data) => [null, data]) // Sucesso → [null, data]
    .catch((err) => [err, null]); // Erro → [err, null]

// Interface para resposta da API ViaCEP
export interface IViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

// Função para buscar endereço pelo CEP usando ViaCEP
export const fetchAddressByCep = async (
  cep: string,
): Promise<IViaCepResponse | null> => {
  try {
    // Remove caracteres não numéricos do CEP
    const cleanCep = cep.replace(/\D/g, "");

    // Valida se o CEP tem 8 dígitos
    if (cleanCep.length !== 8) {
      throw new Error("CEP deve ter 8 dígitos");
    }

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

    if (!response.ok) {
      throw new Error("Erro ao buscar CEP");
    }

    const data: IViaCepResponse = await response.json();

    // Verifica se o CEP foi encontrado
    if (data.erro) {
      throw new Error("CEP não encontrado");
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return null;
  }
};

// Função para formatar CEP (adiciona hífen)
export const formatCep = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "");
  if (cleanValue.length <= 5) {
    return cleanValue;
  }
  return cleanValue.replace(/(\d{5})(\d{1,3})/, "$1-$2");
};

// Função para formatar CPF (000.000.000-00) ou CNPJ (00.000.000/0000-00)
export const formatDocument = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "");

  if (cleanValue.length <= 11) {
    // Formatação CPF
    return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else {
    // Formatação CNPJ
    return cleanValue.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5",
    );
  }
};

// Função para determinar se é CPF ou CNPJ
export const getDocumentType = (document: string): "CPF" | "CNPJ" | null => {
  const cleanDoc = document.replace(/\D/g, "");
  if (cleanDoc.length === 11) return "CPF";
  if (cleanDoc.length === 14) return "CNPJ";
  return null;
};

// Re-export das funções de compressão de imagem
export * from "./image-compression.utils";
