import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CalendarClock,
  Car,
  CreditCard,
  MapPinned,
  MessageCircle,
  Motorbike,
} from "lucide-react";
import BusinessGallery from "@/components/BusinessGallery";
import Header from "@/components/Header";
import { getBusinessBySlug } from "@/lib/mock-data";
import { DEFAULT_CITY_PATH } from "@/lib/locations";
import { generateMapsLink } from "@/lib/generateGoogleMapLink.lib";

type AdvertiserPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: AdvertiserPageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);

  if (!business) {
    return {
      title: "Anunciante não encontrado",
    };
  }

  return {
    title: business.businessName,
    description: business.description,
    openGraph: {
      title: business.businessName,
      description: business.description,
      images: [business.bannerUrl],
    },
  };
}

export default async function AdvertiserPage({ params }: AdvertiserPageProps) {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);
  const googleMapsUrl = business
    ? generateMapsLink(
        business.businessName,
        business.address.street,
        business.address.city,
        business.address.state,
      )
    : "";

  if (!business) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-xl font-bold">Anunciante não encontrado</h1>
          <p className="text-sm text-stone-600 mt-2">
            O perfil solicitado não existe ou foi removido.
          </p>
          <Link
            href={DEFAULT_CITY_PATH}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-3 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Voltar para início
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <Header />

      <main className="max-w-3xl mx-auto pb-12">
        <div className="px-4 pt-4">
          <Link
            href={DEFAULT_CITY_PATH}
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Voltar
          </Link>
        </div>

        <section className="mt-3">
          <BusinessGallery
            businessName={business.businessName}
            coverImage={business.bannerUrl}
            coverAlt={`Banner de ${business.businessName}`}
            images={business.galleryImages}
          >
            <div className="px-4 -mt-10 relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-white border border-stone-200 shadow-sm overflow-hidden">
                <Image
                  src={business.logoUrl}
                  alt={`Logo de ${business.businessName}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>

              <h1 className="text-xl font-extrabold mt-3 tracking-tight">
                {business.businessName}
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                {business.address.street}, {business.address.city} -{" "}
                {business.address.state}
              </p>
            </div>
          </BusinessGallery>
        </section>

        <section className="px-4 mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-stone-700">
            Sobre o comércio
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-700">
            {business.description}
          </p>
        </section>

        <section className="flex flex-col md:flex-row px-4 mt-6 gap-2">
          <Link
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold py-3 px-4 touch-manipulation"
          >
            <MapPinned className="w-4 h-4" aria-hidden="true" />
            Como chegar
          </Link>
          <Link
            href={`https://wa.me/${business.businessWhatsapp}?text=Ola! Encontrei ${business.businessName} no Comercios Locais e gostaria de mais informacoes.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-3 px-4 touch-manipulation"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            Falar no WhatsApp
          </Link>
        </section>

        <section className="px-4 mt-6 grid sm:grid-cols-2 gap-3">
          <article className="bg-white rounded-2xl border border-stone-200 p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-stone-800">
              <CalendarClock className="w-4 h-4 text-emerald-600" />
              Horários de funcionamento
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-stone-600">
              {business.workingHours.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>

          <article className="bg-white rounded-2xl border border-stone-200 p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-stone-800">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Formas de pagamento
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-stone-600">
              {business.paymentMethods.map((method) => (
                <li key={method}>{method}</li>
              ))}
            </ul>
          </article>

          <div className="flex w-full flex-col sm:flex-row gap-3">
            <article className="bg-white rounded-2xl border border-stone-200 p-4 sm:col-span-2">
              <h3 className="flex items-center gap-2 text-sm font-bold text-stone-800">
                <Car className="w-4 h-4 text-emerald-600" />
                Estacionamento
              </h3>
              <p className="mt-2 text-sm text-stone-600">
                {business.hasParking
                  ? "Sim, possui estacionamento para clientes."
                  : "Não possui estacionamento próprio."}
              </p>
            </article>
            <article className="bg-white rounded-2xl border border-stone-200 p-4 sm:col-span-2">
              <h3 className="flex items-center gap-2 text-sm font-bold text-stone-800">
                <Motorbike className="w-4 h-4 text-emerald-600" />
                Delivery
              </h3>
              <p className="mt-2 text-sm text-stone-600">
                {business.hasDelivery
                  ? "Sim, oferece serviço de delivery."
                  : "Não oferece serviço de delivery."}
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
