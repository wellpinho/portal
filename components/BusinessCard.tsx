import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Star,
  Crown,
  MessageCircleMore,
  ChevronRight,
  Rocket,
} from "lucide-react";
import { Business } from "@/lib/types";
import { generateMapsLink } from "@/lib/generateGoogleMapLink.lib";

interface BusinessCardProps {
  business: Business;
  priority?: boolean;
}

export default function BusinessCard({
  business,
  priority = false,
}: BusinessCardProps) {
  const {
    businessName,
    category,
    segment,
    address,
    slug,
    businessWhatsapp,
    avatar,
    isFeatured,
    rating,
    reviewCount,
  } = business;
  const cleanSegment = segment?.trim();
  const badgeSegment = cleanSegment || category;
  const whatsappMessage = encodeURIComponent(
    `Ola! Encontrei ${businessName} no Comercios Locais e gostaria de mais informacoes.`,
  );

  const { street, city, state } = address;
  const googleMapsUrl = generateMapsLink(businessName, street, city, state);

  console.log("BusinessCard render:", business);

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
          src={avatar}
          alt={businessName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
          priority={priority}
          fetchPriority={priority ? "high" : "auto"}
        />

        {/* Featured badge */}
        {isFeatured && (
          <span className="absolute top-2 right-2 flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
            <Crown className="w-3 h-3" aria-hidden="true" strokeWidth={3} />
            Premium
          </span>
        )}

        {/* Segment badge */}
        <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-600 text-white">
          {badgeSegment}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        <h3 className="font-semibold text-stone-900 text-sm leading-snug line-clamp-2">
          {businessName}
        </h3>

        <span className="text-xs font-medium text-emerald-700">{category}</span>

        <Link
          href={googleMapsUrl}
          className="flex items-center gap-1 mt-0.5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MapPin
            className="w-4 h-4 text-stone-600 shrink-0"
            aria-hidden="true"
          />
          <span className="text-xs text-stone-600 truncate">{`${street}, ${city} - ${state}`}</span>
        </Link>

        {/* Rating */}
        {reviewCount > 0 ? (
          <div className="flex items-center gap-1">
            <Star
              className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0"
              aria-hidden="true"
            />
            <span className="text-xs font-semibold text-stone-700">
              {rating.toFixed(1)}
            </span>
            <span className="text-xs text-stone-600">({reviewCount})</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Rocket
              className="w-4 h-4 text-stone-500 shrink-0"
              aria-hidden="true"
            />
            <span className="text-xs font-semibold text-stone-500">
              Novo Cliente
            </span>
          </div>
        )}

        <div className="flex gap-2">
          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/${businessWhatsapp}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.97] text-white font-semibold text-sm py-3 rounded-xl transition-all touch-manipulation"
            aria-label={`Falar com ${businessName} no WhatsApp`}
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
              className="mt-auto pt-3 flex items-center justify-center gap-2 w-full bg-slate-100 text-slate-500 active:scale-[0.97] font-semibold text-sm py-3 rounded-xl transition-all touch-manipulation"
              aria-label={`Visitar página de ${businessName}`}
            >
              Ver perfil
              <ChevronRight
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
