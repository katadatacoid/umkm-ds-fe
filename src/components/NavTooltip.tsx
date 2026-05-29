"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

// ─── Konten tooltip per menu key ─────────────────────────────────────────────
export interface NavTooltipContent {
  title: string;
  description: string;
  accentColor: string;
  badgeColor: string;
  badgeText: string;
  /** Path relatif dari /public — opsional; tooltip tetap tampil tanpa gambar */
  image?: string;
  icon: React.ReactNode;
}

export const NAV_TOOLTIP_CONTENT: Record<string, NavTooltipContent> = {
  beranda: {
    title: "Beranda",
    description:
      "Halaman utama dashboard Anda. Lihat ringkasan performa toko, statistik pengunjung, dan aktivitas terbaru dalam satu tampilan.",
    accentColor: "bg-emerald-500",
    badgeColor: "bg-emerald-50",
    badgeText: "text-emerald-600",
    image: "/images/umkm/umkm-img.webp",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
  },
  products: {
    title: "Product Management",
    description:
      "Kelola semua produk toko Anda di sini — tambah produk baru, edit harga, deskripsi, foto dengan mudah.",
    accentColor: "bg-blue-500",
    badgeColor: "bg-blue-50",
    badgeText: "text-blue-600",
    image: "/images/umkm/product-section.webp",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
        <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  landing: {
    title: "Landing Page",
    description:
      "Desain dan atur tampilan halaman utama toko online Anda — mulai dari banner, tombol aksi, hingga bagian keunggulan produk.",
    accentColor: "bg-violet-500",
    badgeColor: "bg-violet-50",
    badgeText: "text-violet-600",
    image: "/images/umkm/Hero-section.webp",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
      </svg>
    ),
  },
  faqs: {
    title: "FAQ",
    description:
      "Buat daftar pertanyaan yang sering ditanyakan pelanggan beserta jawabannya — membantu pengunjung menemukan informasi tanpa harus menghubungi Anda.",
    accentColor: "bg-amber-500",
    badgeColor: "bg-amber-50",
    badgeText: "text-amber-600",
    image: "/images/umkm/faq-section.webp",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    ),
  },
  testimonials: {
    title: "Testimonial",
    description:
      "Tampilkan ulasan dan cerita dari pelanggan Anda — membangun kepercayaan calon pembeli dan memperkuat reputasi toko.",
    accentColor: "bg-pink-500",
    badgeColor: "bg-pink-50",
    badgeText: "text-pink-600",
    image: "/images/umkm/testimoni-section.webp",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 000 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    ),
  },
  blog: {
    title: "Blog Post",
    description:
      "Tulis dan publikasikan artikel, tips, atau berita terbaru seputar produk Anda.",
    accentColor: "bg-cyan-500",
    badgeColor: "bg-cyan-50",
    badgeText: "text-cyan-600",
    // image: "/images/umkm/umkm-img.webp",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
        <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
      </svg>
    ),
  },
  footer: {
    title: "Footer",
    description:
      "Atur konten bagian bawah halaman toko Anda — seperti informasi kontak, link media sosial.",
    accentColor: "bg-slate-500",
    badgeColor: "bg-slate-50",
    badgeText: "text-slate-600",
    image: "/images/umkm/footer.webp",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  affiliate: {
    title: "Affiliate",
    description:
      "Kelola program afiliasi Anda — pantau performa referral, lihat komisi, dan atur mitra yang membantu mempromosikan produk Anda.",
    accentColor: "bg-orange-500",
    badgeColor: "bg-orange-50",
    badgeText: "text-orange-600",
    // image: "/images/umkm/umkm-img.webp",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
      </svg>
    ),
  },
  settings: {
    title: "Pengaturan",
    description:
      "Ubah informasi profil, ganti password, atur notifikasi, dan sesuaikan preferensi akun toko Anda.",
    accentColor: "bg-gray-500",
    badgeColor: "bg-gray-100",
    badgeText: "text-gray-600",
    // image: "/images/umkm/umkm-img.webp",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
    ),
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface NavTooltipProps {
  menuKey: string;
  children: React.ReactNode;
  enabled?: boolean;
}

// ─── Komponen NavTooltip ──────────────────────────────────────────────────────
const NavTooltip: React.FC<NavTooltipProps> = ({
  menuKey,
  children,
  enabled = true,
}) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords]   = useState({ top: 0, left: 0 });
  const triggerRef            = useRef<HTMLDivElement>(null);
  const tooltipRef            = useRef<HTMLDivElement>(null);
  const timerRef              = useRef<ReturnType<typeof setTimeout> | null>(null);

  const content = NAV_TOOLTIP_CONTENT[menuKey];

  // ─── Hitung posisi tooltip di sebelah kanan trigger ──────────────────────
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;
    const trigger = triggerRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current.getBoundingClientRect();
    const GAP = 12;

    let top  = trigger.top + trigger.height / 2 - tooltip.height / 2;
    let left = trigger.right + GAP;

    // Fallback ke kiri jika keluar viewport kanan
    if (left + tooltip.width > window.innerWidth - 16) {
      left = trigger.left - tooltip.width - GAP;
    }

    top = Math.max(8, Math.min(top, window.innerHeight - tooltip.height - 8));
    setCoords({ top, left });
  }, []);

  const show = useCallback(() => {
    if (!enabled) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(calculatePosition);
    }, 250);
  }, [enabled, calculatePosition]);

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 120);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);
  useEffect(() => { if (visible) requestAnimationFrame(calculatePosition); }, [visible, calculatePosition]);

  if (!content || !enabled) return <>{children}</>;

  return (
    <>
      {/* ── Trigger ── */}
      <div
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className="w-full"
      >
        {children}
      </div>

      {/* ── Tooltip bubble ── */}
      {visible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          style={{ position: "fixed", top: coords.top, left: coords.left, zIndex: 9999 }}
          className="pointer-events-none"
        >
          {/* Arrow caret */}
          <div
            className="
              absolute -left-[5px] top-1/2 -translate-y-1/2
              h-0 w-0
              border-y-[5px] border-y-transparent
              border-r-[6px] border-r-white
              drop-shadow-[-1px_0_0_rgba(0,0,0,0.06)]
            "
            aria-hidden="true"
          />

          <div
            className="
              w-60 overflow-hidden rounded-xl border border-gray-100 bg-white
              shadow-[0_8px_32px_rgba(0,0,0,0.12)]
              animate-in fade-in slide-in-from-left-2 duration-150
            "
          >
            {/* ── Image preview — full width, 16/9 ── */}
            {content.image && (
              <div className="relative h-[120px] w-full bg-gray-100">
                <Image
                  src={content.image}
                  alt={content.title}
                  fill
                  sizes="240px"
                  className="object-cover"
                  unoptimized
                />
                {/* Gradient overlay supaya teks badge terbaca */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                {/* Badge label di pojok kiri atas */}
                <span
                  className={`
                    absolute left-2 top-2
                    inline-flex items-center gap-1.5
                    rounded-md px-2 py-[3px]
                    text-[11px] font-semibold
                    backdrop-blur-sm bg-white/85
                    ${content.badgeColor} ${content.badgeText}
                  `}
                >
                  {content.icon}
                  {content.title}
                </span>
              </div>
            )}

            {/* Accent bar + deskripsi */}
            <div className="flex">
              {/* Accent bar kiri */}
              <div className={`w-1 flex-shrink-0 ${content.accentColor}`} />

              <div className="flex-1 px-3 py-3">
                {/* Jika tidak ada gambar, tampilkan header icon + title */}
                {!content.image && (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`
                          inline-flex h-6 w-6 flex-shrink-0 items-center justify-center
                          rounded-md ${content.badgeColor} ${content.badgeText}
                        `}
                      >
                        {content.icon}
                      </span>
                      <span className="text-[13px] font-semibold text-gray-800 leading-tight">
                        {content.title}
                      </span>
                    </div>
                    <div className="mb-2 h-px bg-gray-100" />
                  </>
                )}

                {/* Description */}
                <p className="text-[11.5px] leading-relaxed text-gray-500">
                  {content.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavTooltip;