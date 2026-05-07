"use client";

import React from "react";
import {
  SectionFormProps,
  StringListEditor,
  TextAreaField,
  TextField,
  cardCls,
} from "./shared";

export interface WhyChooseUsContent {
  eyebrow: string;
  heading: string;
  feature_a: { title: string; body: string };
  feature_b: { title: string; rating_text: string; avatars: string[] };
  feature_main: { title: string; body: string; images: string[] };
  spotlight: { caption: string; image_url: string; highlight_words: string[] };
}

export const whyChooseUsDefaults = (): WhyChooseUsContent => ({
  eyebrow: "",
  heading: "",
  feature_a: { title: "", body: "" },
  feature_b: { title: "", rating_text: "", avatars: [] },
  feature_main: { title: "", body: "", images: [] },
  spotlight: { caption: "", image_url: "", highlight_words: [] },
});

export default function WhyChooseUsForm({
  value,
  onChange,
}: SectionFormProps<WhyChooseUsContent>) {
  const d = whyChooseUsDefaults();
  const v: WhyChooseUsContent = {
    ...d,
    ...value,
    feature_a: { ...d.feature_a, ...(value?.feature_a || {}) },
    feature_b: { ...d.feature_b, ...(value?.feature_b || {}), avatars: value?.feature_b?.avatars ?? [] },
    feature_main: {
      ...d.feature_main,
      ...(value?.feature_main || {}),
      images: value?.feature_main?.images ?? [],
    },
    spotlight: {
      ...d.spotlight,
      ...(value?.spotlight || {}),
      highlight_words: value?.spotlight?.highlight_words ?? [],
    },
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

      <div className={cardCls}>
        <h5 className="text-xs font-semibold uppercase text-gray-500">Feature A</h5>
        <TextField
          label="Judul"
          value={v.feature_a.title}
          onChange={(title) => onChange({ ...v, feature_a: { ...v.feature_a, title } })}
        />
        <TextAreaField
          label="Body"
          value={v.feature_a.body}
          onChange={(body) => onChange({ ...v, feature_a: { ...v.feature_a, body } })}
          rows={3}
        />
      </div>

      <div className={cardCls}>
        <h5 className="text-xs font-semibold uppercase text-gray-500">Feature B</h5>
        <TextField
          label="Judul"
          value={v.feature_b.title}
          onChange={(title) => onChange({ ...v, feature_b: { ...v.feature_b, title } })}
        />
        <TextField
          label="Rating text"
          value={v.feature_b.rating_text}
          onChange={(rating_text) =>
            onChange({ ...v, feature_b: { ...v.feature_b, rating_text } })
          }
        />
        <StringListEditor
          label="Avatar (URL)"
          items={v.feature_b.avatars}
          onChange={(avatars) =>
            onChange({ ...v, feature_b: { ...v.feature_b, avatars } })
          }
          placeholder="https://..."
          addLabel="Tambah avatar"
        />
      </div>

      <div className={cardCls}>
        <h5 className="text-xs font-semibold uppercase text-gray-500">Feature Main</h5>
        <TextField
          label="Judul"
          value={v.feature_main.title}
          onChange={(title) => onChange({ ...v, feature_main: { ...v.feature_main, title } })}
        />
        <TextAreaField
          label="Body"
          value={v.feature_main.body}
          onChange={(body) => onChange({ ...v, feature_main: { ...v.feature_main, body } })}
          rows={3}
        />
        <StringListEditor
          label="Gambar (URL)"
          items={v.feature_main.images}
          onChange={(images) =>
            onChange({ ...v, feature_main: { ...v.feature_main, images } })
          }
          placeholder="https://..."
          addLabel="Tambah gambar"
        />
      </div>

      <div className={cardCls}>
        <h5 className="text-xs font-semibold uppercase text-gray-500">Spotlight</h5>
        <TextAreaField
          label="Caption"
          value={v.spotlight.caption}
          onChange={(caption) => onChange({ ...v, spotlight: { ...v.spotlight, caption } })}
          rows={2}
        />
        <TextField
          label="URL gambar"
          type="url"
          value={v.spotlight.image_url}
          onChange={(image_url) =>
            onChange({ ...v, spotlight: { ...v.spotlight, image_url } })
          }
        />
        <StringListEditor
          label="Highlight words"
          items={v.spotlight.highlight_words}
          onChange={(highlight_words) =>
            onChange({ ...v, spotlight: { ...v.spotlight, highlight_words } })
          }
          placeholder="contoh: handmade"
          addLabel="Tambah kata"
        />
      </div>
    </div>
  );
}
