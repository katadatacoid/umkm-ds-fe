"use client";

import React from "react";
import { NumberField, SectionFormProps, TextField } from "./shared";

export interface ExploreProductsContent {
  eyebrow: string;
  heading: string;
  limit: number;
}

export const exploreProductsDefaults = (): ExploreProductsContent => ({
  eyebrow: "",
  heading: "",
  limit: 6,
});

export default function ExploreProductsForm({
  value,
  onChange,
}: SectionFormProps<ExploreProductsContent>) {
  const v: ExploreProductsContent = { ...exploreProductsDefaults(), ...value };
  return (
    <div className="space-y-4">
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
      <NumberField
        label="Jumlah produk yang ditampilkan"
        value={v.limit}
        onChange={(limit) => onChange({ ...v, limit })}
        min={1}
      />
    </div>
  );
}
