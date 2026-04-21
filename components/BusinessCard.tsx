import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Star,
  Crown,
  ChevronsRight,
  MessageCircleMore,
} from "lucide-react";
import { Business } from "@/lib/types";

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const {
    name,
    category,
    location,
    slug,
    phone,
    imageUrl,
    isOpen,
    isFeatured,
    rating,
    reviewCount,
  } = business;

  return (
    <article
      className={[
        "bg-white rounded-2xl overflow-hidden flex flex-col transition-shadow",
        isFeatured
          ? "border-2 border-amber-400 shadow-md shadow-amber-100"
          : "border border-stone-200 shadow-sm",
      ].join(" ")}
    >
      {/* Image */}
      <div className="relative aspect-video w-full bg-stone-100">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
          unoptimized
        />

        {/* Featured badge */}
        {isFeatured && (
          <span className="absolute top-2 right-2 flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
            <Crown className="w-3 h-3" aria-hidden="true" strokeWidth={3} />
            Premium
          </span>
        )}

        {/* Open / Closed badge */}
        <span
          className={[
            "absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full",
            isOpen ? "bg-emerald-500 text-white" : "bg-stone-500 text-white",
          ].join(" ")}
        >
          {isOpen ? "Aberto" : "Fechado"}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        <h3 className="font-semibold text-stone-900 text-sm leading-snug line-clamp-2">
          {name}
        </h3>

        <span className="text-xs font-medium text-emerald-700">{category}</span>

        <div className="flex items-center gap-1 mt-0.5">
          <MapPin
            className="w-3 h-3 text-stone-400 shrink-0"
            aria-hidden="true"
          />
          <span className="text-xs text-stone-500 truncate">{location}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star
            className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold text-stone-700">
            {rating.toFixed(1)}
          </span>
          <span className="text-xs text-stone-400">({reviewCount})</span>
        </div>

        <div className="flex gap-2">
          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/${phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.97] text-white font-semibold text-sm py-3 rounded-xl transition-all touch-manipulation"
            aria-label={`Falar com ${name} no WhatsApp`}
          >
            <MessageCircleMore
              className="w-4 h-4"
              aria-hidden="true"
              strokeWidth={3}
            />
            WhatsApp
          </a>
          {isFeatured && (
            <Link
              href={`/anunciante/${slug}`}
              className="mt-auto pt-3 flex items-center justify-center gap-2 w-full bg-amber-100 hover:bg-amber-200 active:scale-[0.97] text-amber-900 font-semibold text-sm py-3 rounded-xl transition-all touch-manipulation border border-amber-300"
              aria-label={`Visitar página de ${name}`}
            >
              Detalhes
              <ChevronsRight
                className="w-4 h-4"
                aria-hidden="true"
                strokeWidth={3}
              />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
