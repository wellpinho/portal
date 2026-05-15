/**
 * Utilitário para compressão e redimensionamento de imagens no frontend
 */

interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 a 1.0
  outputFormat?: "webp" | "jpeg" | "png";
  maxSizeKB?: number; // Tamanho máximo em KB
}

interface CompressResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

/**
 * Comprime uma imagem redimensionando e/ou ajustando qualidade
 */
export async function compressImage(
  file: File,
  options: CompressImageOptions = {},
): Promise<CompressResult> {
  const {
    maxWidth = 1200,
    maxHeight = 800,
    quality = 0.8,
    outputFormat = "webp",
    maxSizeKB = 500, // 500KB por padrão
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Canvas context não disponível"));
      return;
    }

    img.onload = () => {
      // Calcular novas dimensões mantendo aspect ratio
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      // Configurar canvas
      canvas.width = width;
      canvas.height = height;

      // Desenhar imagem redimensionada
      ctx.drawImage(img, 0, 0, width, height);

      // Função para tentar diferentes qualidades
      const tryCompress = (currentQuality: number): void => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Falha na compressão"));
              return;
            }

            const sizeKB = blob.size / 1024;

            // Se ainda está grande demais e podemos reduzir mais a qualidade
            if (sizeKB > maxSizeKB && currentQuality > 0.1) {
              tryCompress(currentQuality - 0.1);
              return;
            }

            // Criar novo arquivo
            const fileName = file.name.replace(/\.[^/.]+$/, `.${outputFormat}`);
            const compressedFile = new File([blob], fileName, {
              type: blob.type,
              lastModified: Date.now(),
            });

            const result: CompressResult = {
              file: compressedFile,
              originalSize: file.size,
              compressedSize: blob.size,
              compressionRatio: Math.round(
                ((file.size - blob.size) / file.size) * 100,
              ),
            };

            resolve(result);
          },
          `image/${outputFormat}`,
          currentQuality,
        );
      };

      tryCompress(quality);
    };

    img.onerror = () => {
      reject(new Error("Falha ao carregar a imagem"));
    };

    // Carregar imagem
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Comprime múltiplas imagens
 */
export async function compressMultipleImages(
  files: File[],
  options: CompressImageOptions = {},
): Promise<CompressResult[]> {
  const results: CompressResult[] = [];

  for (const file of files) {
    try {
      const result = await compressImage(file, options);
      results.push(result);
    } catch (error) {
      console.error(`Erro ao comprimir ${file.name}:`, error);
      // Em caso de erro, usar arquivo original
      results.push({
        file,
        originalSize: file.size,
        compressedSize: file.size,
        compressionRatio: 0,
      });
    }
  }

  return results;
}

/**
 * Validações de imagem
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Tipos permitidos
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/svg+xml",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Apenas arquivos JPG, PNG, WebP e SVG são permitidos.",
    };
  }

  // Tamanho máximo antes da compressão (20MB)
  const maxSizeBeforeCompression = 20 * 1024 * 1024;
  if (file.size > maxSizeBeforeCompression) {
    return {
      valid: false,
      error: "Arquivo muito grande. Máximo 20MB antes da compressão.",
    };
  }

  return { valid: true };
}

/**
 * Utilitário para mostrar preview da imagem
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };

    reader.onerror = () => {
      reject(new Error("Erro ao criar preview da imagem"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Formatar tamanho em bytes para string legível
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
