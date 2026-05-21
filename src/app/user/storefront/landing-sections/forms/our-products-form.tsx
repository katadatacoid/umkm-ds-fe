"use client";

import React from "react";
import {
  CTAFields,
  ListEditor,
  SectionFormProps,
  TextAreaField,
  TextField,
} from "./shared";

interface HighlightItem {
  name: string;
  category: string;
  description: string;
  image_url: string;
  link_href: string;
}

export interface OurProductsContent {
  eyebrow: string;
  heading: string;
  cta: { label: string; href: string };
  highlights: HighlightItem[];
}

export const ourProductsDefaults = (): OurProductsContent => ({
  eyebrow: "",
  heading: "",
  cta: { label: "", href: "" },
  highlights: [],
});

export default function OurProductsForm({
  value,
  onChange,
}: SectionFormProps<OurProductsContent>) {
  const v: OurProductsContent = {
    ...ourProductsDefaults(),
    ...value,
    cta: { ...ourProductsDefaults().cta, ...(value?.cta || {}) },
    highlights: value?.highlights ?? [],
  };

  return (
    <div className="space-y-5">
      <TextField
        label="Eyebrow"
        value={v.eyebrow}
        onChange={(eyebrow) => onChange({ ...v, eyebrow })}
      />
      <TextField
        label="Heading"
        value={v.heading}
        onChange={(heading) => onChange({ ...v, heading })}
      />

      <CTAFields value={v.cta} onChange={(cta) => onChange({ ...v, cta })} />

      <ListEditor<HighlightItem>
        label="Produk Unggulan"
        items={v.highlights}
        onChange={(highlights) => onChange({ ...v, highlights })}
        newItem={() => ({
          name: "",
          category: "",
          description: "",
          image_url: "",
          link_href: "",
        })}
        itemTitle={(item, i) => item.name || `Produk ${i + 1}`}
        renderItem={(item, update) => (
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <TextField
                label="Nama"
                value={item.name}
                onChange={(name) => update({ ...item, name })}
              />
              <TextField
                label="Kategori"
                value={item.category}
                onChange={(category) => update({ ...item, category })}
                placeholder="ROTI ARTISAN"
              />
            </div>
            <TextAreaField
              label="Deskripsi"
              value={item.description}
              onChange={(description) => update({ ...item, description })}
              rows={2}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <TextField
                label="URL gambar"
                type="url"
                value={item.image_url}
                onChange={(image_url) => update({ ...item, image_url })}
              />
              <TextField
                label="Link href"
                value={item.link_href}
                onChange={(link_href) => update({ ...item, link_href })}
                placeholder="/products/1"
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
