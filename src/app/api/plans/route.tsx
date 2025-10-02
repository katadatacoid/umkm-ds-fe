// app/api/plans/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  const plans = [
    {
      id: "1",
      title: "Starter",
      plan: "Paket Basic",
      monthlyPrice: "Rp 49.000 / bulan",
      yearlyPrice: "Rp 499.000 / tahun",
      description:
        "Cocok untuk UMKM yang baru mulai go-online, memiliki jumlah produk terbatas, dan ingin mencoba layanan.",
      features: [
        "Jumlah Produk Maks. 25 produk",
        "Template 3 pilihan dasar",
        "Logo Rumah DigitalKU (White Label)",
        "Link publik, WhatsApp",
        "Analytics Dasar (Jumlah View)",
        "Export (PDF)",
        "Dukungan Email & Pusat Bantuan",
      ],
    },
    {
      id: "2",
      title: "Pro",
      plan: "Pro – UMKM Naik Kelas",
      monthlyPrice: "Rp 99.000 / bulan",
      yearlyPrice: "Rp 999.000 / tahun",
      description:
        "Cocok untuk UMKM yang sedang berkembang, sudah memiliki banyak produk, dan membutuhkan fitur branding serta analitik yang lebih baik.",
      features: [
        "Jumlah Produk Maks. 25 produk",
        "Template 3 pilihan dasar",
        "Logo Rumah DigitalKU (White Label)",
        "Link, WhatsApp, Embed di Website",
        "Analytics (View, Traffic Source, Hot Products)",
        "Export (PDF, CSV/Excel)",
        "Kode QR Kustom untuk katalog",
        "Dukungan Email & Pusat Bantuan",
      ],
      highlighted: true,
    },
    {
      id: "3",
      title: "Business",
      plan: "Premium – Full Power",
      monthlyPrice: "Rp 199.000 / bulan",
      yearlyPrice: "Rp 1.999.000 / tahun",
      description:
        "Cocok untuk UMKM besar, distributor, atau produsen dengan banyak koleksi produk yang perlu dikelompokkan dan fitur manajemen tim.",
      features: [
        "Jumlah Produk Unlimited",
        "Buat hingga 5 katalog terpisah",
        "Semua template + kustom warna",
        "Full Branding + Brand Colors",
        "Semua cara + Embed, Kode QR per Katalog",
        "Analytics Advanced (Per-katalog analytics)",
        "Export (PDF, CSV/Excel, Otomatis ke GDrive)",
        "Tambahkan 2 user anggota tim",
        "Dukungan Prioritas 24/7 & Onboarding Call",
      ],
    },
  ];

  return NextResponse.json(plans);
}
