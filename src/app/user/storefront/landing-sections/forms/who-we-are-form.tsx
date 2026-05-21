"use client";

import React from "react";
import {
  CTAFields,
  ListEditor,
  SectionFormProps,
  TextAreaField,
  TextField,
  inputCls,
  labelCls,
} from "./shared";

type StatItem =
  | {
      type: "stat";
      label: string;
      value: string;
      background?: string;
      description?: string;
      icon?: string;
    }
  | {
      type: "image";
      image_url: string;
      image_alt: string;
    };

export interface WhoWeAreContent {
  eyebrow: string;
  heading: string;
  body: string;
  cta: { label: string; href: string };
  stats: StatItem[];
}

export const whoWeAreDefaults = (): WhoWeAreContent => ({
  eyebrow: "",
  heading: "",
  body: "",
  cta: { label: "", href: "" },
  stats: [],
});

export default function WhoWeAreForm({ value, onChange }: SectionFormProps<WhoWeAreContent>) {
  const v: WhoWeAreContent = {
    ...whoWeAreDefaults(),
    ...value,
    cta: { ...whoWeAreDefaults().cta, ...(value?.cta || {}) },
    stats: value?.stats ?? [],
  };

  return (
    <div className="space-y-5">
      <TextField
        label="Eyebrow"
        value={v.eyebrow}
        onChange={(eyebrow) => onChange({ ...v, eyebrow })}
        placeholder="contoh: Filosofi Kami"
      />
      <TextField
        label="Heading"
        value={v.heading}
        onChange={(heading) => onChange({ ...v, heading })}
      />
      <TextAreaField
        label="Body"
        value={v.body}
        onChange={(body) => onChange({ ...v, body })}
        rows={4}
      />

      <CTAFields value={v.cta} onChange={(cta) => onChange({ ...v, cta })} />

      <ListEditor<StatItem>
        label="Stats / Gambar"
        items={v.stats}
        onChange={(stats) => onChange({ ...v, stats })}
        newItem={() => ({ type: "stat", label: "", value: "" })}
        itemTitle={(item, i) =>
          item.type === "stat"
            ? `Stat ${i + 1}: ${item.value || "?"} ${item.label || ""}`
            : `Gambar ${i + 1}`
        }
        renderItem={(item, update) => (
          <div className="space-y-3">
            <div>
              <label className={labelCls}>Tipe</label>
              <select
                value={item.type}
                onChange={(e) => {
                  const next = e.target.value as "stat" | "image";
                  if (next === "stat") {
                    update({ type: "stat", label: "", value: "" });
                  } else {
                    update({ type: "image", image_url: "", image_alt: "" });
                  }
                }}
                className={inputCls}
              >
                <option value="stat">Stat</option>
                <option value="image">Image</option>
              </select>
            </div>

            {item.type === "stat" ? (
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <TextField
                    label="Value"
                    value={item.value}
                    onChange={(value) => update({ ...item, value })}
                    placeholder="500+"
                  />
                  <TextField
                    label="Label"
                    value={item.label}
                    onChange={(label) => update({ ...item, label })}
                    placeholder="Keluarga Setia"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <TextField
                    label="Icon (opsional)"
                    value={item.icon ?? ""}
                    onChange={(icon) => update({ ...item, icon })}
                    placeholder="leaf, star, ..."
                  />
                  <TextField
                    label="Background (opsional)"
                    value={item.background ?? ""}
                    onChange={(background) => update({ ...item, background })}
                    placeholder="dark, mid, light"
                  />
                </div>
                <TextAreaField
                  label="Deskripsi (opsional)"
                  value={item.description ?? ""}
                  onChange={(description) => update({ ...item, description })}
                  rows={2}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextField
                  label="URL gambar"
                  type="url"
                  value={item.image_url}
                  onChange={(image_url) => update({ ...item, image_url })}
                />
                <TextField
                  label="Alt gambar"
                  value={item.image_alt}
                  onChange={(image_alt) => update({ ...item, image_alt })}
                />
              </div>
            )}
          </div>
        )}
      />

    </div>
  );
}
