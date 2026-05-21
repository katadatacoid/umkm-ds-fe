"use client";

import React from "react";
import { SectionFormProps, StringListEditor } from "./shared";

export interface MarqueeContent {
  items: string[];
}

export const marqueeDefaults = (): MarqueeContent => ({ items: [] });

export default function MarqueeForm({ value, onChange }: SectionFormProps<MarqueeContent>) {
  const items = value?.items ?? [];
  return (
    <StringListEditor
      label="Items marquee"
      items={items}
      onChange={(next) => onChange({ items: next })}
      placeholder="contoh: ARTISAN BAKERY"
      addLabel="Tambah item"
    />
  );
}
