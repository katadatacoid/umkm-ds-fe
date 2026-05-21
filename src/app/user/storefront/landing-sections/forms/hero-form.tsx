"use client";

import React from "react";
import {
  CTAFields,
  CheckboxField,
  ListEditor,
  NumberField,
  SectionFormProps,
  StringListEditor,
  TextAreaField,
  TextField,
  cardCls,
} from "./shared";

interface HeadingItem {
  text: string;
  highlight: boolean;
}
interface SlideItem {
  alt: string;
  url: string;
}
interface MissionCard {
  text: string;
  image_url: string;
  image_alt: string;
  avatars: string[];
}
export interface HeroContent {
  heading: HeadingItem[];
  cta: { label: string; href: string };
  rating: { value: number; max: number };
  slideshow: SlideItem[];
  mission_card: MissionCard;
}

export const heroDefaults = (): HeroContent => ({
  heading: [],
  cta: { label: "", href: "" },
  rating: { value: 0, max: 5 },
  slideshow: [],
  mission_card: { text: "", image_url: "", image_alt: "", avatars: [] },
});

export default function HeroForm({ value, onChange }: SectionFormProps<HeroContent>) {
  const v: HeroContent = {
    ...heroDefaults(),
    ...value,
    cta: { ...heroDefaults().cta, ...(value?.cta || {}) },
    rating: { ...heroDefaults().rating, ...(value?.rating || {}) },
    mission_card: { ...heroDefaults().mission_card, ...(value?.mission_card || {}) },
    heading: value?.heading ?? [],
    slideshow: value?.slideshow ?? [],
  };

  return (
    <div className="space-y-5">
      <ListEditor<HeadingItem>
        label="Heading (per baris)"
        items={v.heading}
        onChange={(heading) => onChange({ ...v, heading })}
        newItem={() => ({ text: "", highlight: false })}
        itemTitle={(item, i) => `Baris ${i + 1}${item.highlight ? " · highlight" : ""}`}
        renderItem={(item, update) => (
          <div className="space-y-2">
            <TextField
              label="Teks"
              value={item.text}
              onChange={(text) => update({ ...item, text })}
            />
            <CheckboxField
              label="Highlight (warna aksen)"
              value={item.highlight}
              onChange={(highlight) => update({ ...item, highlight })}
            />
          </div>
        )}
      />

      <CTAFields value={v.cta} onChange={(cta) => onChange({ ...v, cta })} />

      <div className={cardCls}>
        <h5 className="text-xs font-semibold uppercase text-gray-500">Rating</h5>
        <div className="grid grid-cols-2 gap-3">
          <NumberField
            label="Nilai"
            value={v.rating.value}
            onChange={(value) => onChange({ ...v, rating: { ...v.rating, value } })}
            min={0}
          />
          <NumberField
            label="Maksimum"
            value={v.rating.max}
            onChange={(max) => onChange({ ...v, rating: { ...v.rating, max } })}
            min={1}
          />
        </div>
      </div>

      <ListEditor<SlideItem>
        label="Slideshow"
        items={v.slideshow}
        onChange={(slideshow) => onChange({ ...v, slideshow })}
        newItem={() => ({ alt: "", url: "" })}
        itemTitle={(item, i) => item.alt || `Gambar ${i + 1}`}
        renderItem={(item, update) => (
          <div className="space-y-2">
            <TextField
              label="Alt text"
              value={item.alt}
              onChange={(alt) => update({ ...item, alt })}
            />
            <TextField
              label="URL gambar"
              type="url"
              value={item.url}
              onChange={(url) => update({ ...item, url })}
              placeholder="https://..."
            />
          </div>
        )}
      />

      <div className={cardCls}>
        <h5 className="text-xs font-semibold uppercase text-gray-500">Mission Card</h5>
        <TextAreaField
          label="Teks"
          value={v.mission_card.text}
          onChange={(text) => onChange({ ...v, mission_card: { ...v.mission_card, text } })}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextField
            label="URL gambar"
            type="url"
            value={v.mission_card.image_url}
            onChange={(image_url) => onChange({ ...v, mission_card: { ...v.mission_card, image_url } })}
          />
          <TextField
            label="Alt gambar"
            value={v.mission_card.image_alt}
            onChange={(image_alt) => onChange({ ...v, mission_card: { ...v.mission_card, image_alt } })}
          />
        </div>
        <StringListEditor
          label="Avatar pelanggan (URL)"
          items={v.mission_card.avatars}
          onChange={(avatars) => onChange({ ...v, mission_card: { ...v.mission_card, avatars } })}
          placeholder="https://..."
          addLabel="Tambah avatar"
        />
      </div>
    </div>
  );
}
