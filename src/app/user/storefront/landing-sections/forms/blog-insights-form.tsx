"use client";

import React from "react";
import { CTAFields, NumberField, SectionFormProps, TextField } from "./shared";

export interface BlogInsightsContent {
  eyebrow: string;
  heading: string;
  limit: number;
  cta: { label: string; href: string };
}

export const blogInsightsDefaults = (): BlogInsightsContent => ({
  eyebrow: "",
  heading: "",
  limit: 4,
  cta: { label: "", href: "" },
});

export default function BlogInsightsForm({
  value,
  onChange,
}: SectionFormProps<BlogInsightsContent>) {
  const v: BlogInsightsContent = {
    ...blogInsightsDefaults(),
    ...value,
    cta: { ...blogInsightsDefaults().cta, ...(value?.cta || {}) },
  };
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
        label="Jumlah post yang ditampilkan"
        value={v.limit}
        onChange={(limit) => onChange({ ...v, limit })}
        min={1}
      />
      <CTAFields value={v.cta} onChange={(cta) => onChange({ ...v, cta })} />
    </div>
  );
}
