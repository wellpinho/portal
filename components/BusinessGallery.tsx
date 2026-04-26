"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type BusinessGalleryProps = {
  businessName: string;
  coverImage: string;
  coverAlt: string;
  images: readonly string[];
  children?: ReactNode;
};

const SWIPE_THRESHOLD = 48;

export default function BusinessGallery({
  businessName,
  coverImage,
  coverAlt,
  images,
  children,
}: BusinessGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const allImages = [coverImage, ...images];

  const goToPrevious = () => {
    setSelectedIndex((currentIndex) => {
      if (currentIndex === null) {
        return currentIndex;
      }

      return (currentIndex - 1 + allImages.length) % allImages.length;
    });
  };

  const goToNext = () => {
    setSelectedIndex((currentIndex) => {
      if (currentIndex === null) {
        return currentIndex;
      }

      return (currentIndex + 1) % allImages.length;
    });
  };

  useEffect(() => {
    if (selectedIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((currentIndex) => {
          if (currentIndex === null) {
            return currentIndex;
          }

          return (currentIndex + 1) % allImages.length;
        });
      }

      if (event.key === "ArrowLeft") {
        setSelectedIndex((currentIndex) => {
          if (currentIndex === null) {
            return currentIndex;
          }

          return (currentIndex - 1 + allImages.length) % allImages.length;
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [allImages.length, selectedIndex]);

  return (
    <>
      <button
        type="button"
        onClick={() => setSelectedIndex(0)}
        className="relative aspect-16/6 w-full overflow-hidden bg-stone-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        aria-label={`Ampliar capa de ${businessName}`}
      >
        <Image
          src={coverImage}
          alt={coverAlt}
          fill
          className="object-cover transition duration-500 hover:scale-[1.02]"
          unoptimized
          priority
        />
        <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-black/5 to-transparent" />
        <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          Toque para ampliar
        </span>
      </button>

      {children}

      <div className="mt-5 px-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-stone-700">
          Galeria
        </h2>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedIndex(index + 1)}
              className="group relative aspect-square overflow-hidden rounded-xl bg-stone-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              aria-label={`Ampliar imagem ${index + 1} de ${businessName}`}
            >
              <Image
                src={image}
                alt={`Imagem ${index + 1} de ${businessName}`}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                unoptimized
              />
              <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
            </button>
          ))}
        </div>
      </div>

      {selectedIndex !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Galeria ampliada de ${businessName}`}
          onClick={() => setSelectedIndex(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Fechar galeria"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-6"
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>

          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={(event) => {
              setTouchStartX(event.changedTouches[0]?.clientX ?? null);
            }}
            onTouchEnd={(event) => {
              if (touchStartX === null) {
                return;
              }

              const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
              const touchDistance = touchEndX - touchStartX;

              if (touchDistance >= SWIPE_THRESHOLD) {
                goToPrevious();
              }

              if (touchDistance <= -SWIPE_THRESHOLD) {
                goToNext();
              }

              setTouchStartX(null);
            }}
          >
            <div className="absolute left-4 top-4 z-10 rounded-full bg-black/60 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur">
              {selectedIndex + 1} de {allImages.length}
            </div>

            <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-stone-900 shadow-2xl sm:aspect-16/10">
              <Image
                src={allImages[selectedIndex]}
                alt={
                  selectedIndex === 0
                    ? `Capa de ${businessName}`
                    : `Imagem ${selectedIndex} de ${businessName}`
                }
                fill
                className="object-contain"
                unoptimized
                priority
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 text-sm text-white/80">
              <span className="text-base font-semibold text-white">
                {businessName}
              </span>
              <span className="hidden rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/90 sm:inline-flex">
                {selectedIndex === 0 ? "Capa" : `Galeria ${selectedIndex}`}
              </span>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {allImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    selectedIndex === index
                      ? "border-white shadow-[0_0_0_2px_rgba(255,255,255,0.25)]"
                      : "border-white/20 opacity-70 hover:opacity-100"
                  }`}
                  aria-label={
                    index === 0
                      ? `Abrir capa de ${businessName}`
                      : `Abrir imagem ${index} de ${businessName}`
                  }
                >
                  <Image
                    src={image}
                    alt={
                      index === 0
                        ? `Miniatura da capa de ${businessName}`
                        : `Miniatura ${index} de ${businessName}`
                    }
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <span
                    className={`absolute inset-0 transition ${
                      selectedIndex === index ? "bg-black/0" : "bg-black/35"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goToNext();
            }}
            className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6"
            aria-label="Próxima imagem"
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </>
  );
}
