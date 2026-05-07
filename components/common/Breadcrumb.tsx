"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav
      className={`flex items-center gap-1 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      <Link
        href="/"
        className="flex items-center gap-1 text-stone-600 hover:text-emerald-600 transition-colors"
        aria-label="Home"
      >
        <Home className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">Início</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4 text-stone-400" aria-hidden="true" />
          {item.href && !item.active ? (
            <Link
              href={item.href}
              className="text-stone-600 hover:text-emerald-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={
                item.active ? "text-stone-900 font-semibold" : "text-stone-600"
              }
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
