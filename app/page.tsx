import type { Metadata } from "next";
import Header from "@/components/Header";
import HomePageClient from "@/components/HomePageClient";
import { MOCK_BUSINESSES } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Início",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <HomePageClient businesses={MOCK_BUSINESSES} />
    </div>
  );
}
