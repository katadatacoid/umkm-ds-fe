"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

// ─── Tipe data tooltip per section kind ──────────────────────────────────────
export type TooltipKind =
  | "hero"
  | "cta"
  | "cta_product"
  | "cta_filosofi"
  | "key_unggulan_item";

interface TooltipContent {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  /** Path relatif dari /public — wajib ada */
  image: string;
}

// ─── Konten tooltip per section ──────────────────────────────────────────────
const TOOLTIP_CONTENT: Record<string, TooltipContent> = {
  hero: {
    title: "Banner Cover Utama",
    description:
      "Bagian pertama yang dilihat pengunjung saat membuka halaman. Berisi judul besar, deskripsi singkat, dan gambar utama produk Anda.",
    color: "bg-emerald-100 text-emerald-700",
    image: "/images/umkm/Hero-section.webp",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
      </svg>
    ),
  },
  cta: {
    title: "Banner Tombol Utama",
    description:
      "Tombol dan banner utama halaman Anda. Mengarahkan pengunjung ke langkah selanjutnya — melihat menu, dan menghubungi Anda.",
    color: "bg-blue-100 text-blue-700",
    image: "/images/umkm/cta-utama.webp",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path
          fillRule="evenodd"
          d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  cta_product: {
    title: "Banner Tombol Produk",
    description:
      "Tombol banner khusus yang berada di halaman produk atau katalog Anda. Berisi keunggulan produk atau katalog anda.",
    color: "bg-orange-100 text-orange-700",
    image: "/images/umkm/Cta-produk.webp",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      </svg>
    ),
  },
  cta_filosofi: {
    title: "Banner Tombol Filosofi",
    description:
      "Bagian yang menceritakan nilai dan filosofi di balik brand Anda. Membangun kepercayaan dan koneksi emosional dengan pengunjung melalui cerita yang autentik.",
    color: "bg-purple-100 text-purple-700",
    image: "/images/umkm/cta-filosofi.webp",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  key_unggulan_item: {
    title: "Item Keunggulan Produk",
    description:
      "Satu poin keunggulan atau fitur unggulan produk Anda. Tambahkan beberapa item untuk meyakinkan pengunjung mengapa produk Anda lebih baik.",
    color: "bg-yellow-100 text-yellow-700",
    image: "/images/umkm/key-unggulan.webp",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
  },
};

// ─── Tipe posisi tooltip ──────────────────────────────────────────────────────
type TooltipPosition = "top" | "bottom" | "right";

interface SectionTooltipProps {
  kind: string;
  position?: TooltipPosition;
  children: React.ReactNode;
}

// ─── Komponen utama SectionTooltip ───────────────────────────────────────────
const SectionTooltip: React.FC<SectionTooltipProps> = ({
  kind,
  position = "right",
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const content = TOOLTIP_CONTENT[kind];

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;
    const trigger = triggerRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current.getBoundingClientRect();
    const GAP = 8;

    let top = 0;
    let left = 0;

    if (position === "right") {
      top = trigger.top + trigger.height / 2 - tooltip.height / 2;
      left = trigger.right + GAP;
      if (left + tooltip.width > window.innerWidth - 16) {
        left = trigger.left - tooltip.width - GAP;
      }
    } else if (position === "top") {
      top = trigger.top - tooltip.height - GAP;
      left = trigger.left + trigger.width / 2 - tooltip.width / 2;
    } else {
      top = trigger.bottom + GAP;
      left = trigger.left + trigger.width / 2 - tooltip.width / 2;
    }

    top = Math.max(8, Math.min(top, window.innerHeight - tooltip.height - 8));
    left = Math.max(8, Math.min(left, window.innerWidth - tooltip.width - 8));

    setCoords({ top, left });
  }, [position]);

  const show = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => calculatePosition());
    }, 200);
  }, [calculatePosition]);

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 100);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => calculatePosition());
    }
  }, [visible, calculatePosition]);

  if (!content) return <>{children}</>;

  return (
    <>
      {/* Trigger wrapper */}
      <div
        ref={triggerRef}
        className="relative inline-flex items-center"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}

        {/* Info icon kecil */}
        <span className="ml-1 text-gray-300 hover:text-gray-500 transition-colors cursor-help flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-3 h-3"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>

      {/* Portal-style tooltip via fixed positioning */}
      {visible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
            zIndex: 9999,
          }}
          className="pointer-events-none"
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          <div
            className="
              w-64 rounded-xl bg-white shadow-xl border border-gray-100
              animate-in fade-in zoom-in-95 duration-150
              overflow-hidden
            "
            style={{
              filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.10))",
            }}
          >
            {/* ── Image preview — full width, aspect 16/9 ── */}
            <div className="relative w-full h-32 bg-gray-100">
              <Image
                src={content.image}
                alt={content.title}
                fill
                sizes="256px"
                className="object-cover"
                /**
                 * unoptimized hanya sebagai fallback jika domain belum
                 * dikonfigurasi di next.config; hapus jika sudah ada.
                 */
                unoptimized
              />
              {/* label badge di atas gambar */}
              <span
                className={`
                  absolute top-2 left-2
                  inline-flex items-center gap-1.5
                  px-2 py-1 rounded-lg text-[11px] font-semibold
                  backdrop-blur-sm bg-white/80
                  ${content.color}
                `}
              >
                {content.icon}
                {content.title}
              </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* Body */}
            <div className="px-4 py-3">
              <p className="text-[12px] text-gray-500 leading-relaxed">
                {content.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SectionTooltip;