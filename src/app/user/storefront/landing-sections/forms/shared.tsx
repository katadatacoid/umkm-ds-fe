"use client";

import React from "react";

// Decode entitas HTML yang sering ada di payload (mis. &#x2F; → /).
export function decodeEntities(value: unknown): string {
  if (typeof value !== "string") return value === null || value === undefined ? "" : String(value);
  if (!/&[a-zA-Z0-9#]+;/.test(value)) return value;
  if (typeof document === "undefined") return value;
  const ta = document.createElement("textarea");
  ta.innerHTML = value;
  return ta.value;
}

export function decodeStringFields<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map((v) => decodeStringFields(v)) as unknown as T;
  }
  if (input && typeof input === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
      out[k] = decodeStringFields(v);
    }
    return out as T;
  }
  if (typeof input === "string") return decodeEntities(input) as unknown as T;
  return input;
}

export const cardCls =
  "rounded-lg border border-gray-200 bg-gray-50/60 p-3 space-y-3";

export const inputCls =
  "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none";

export const labelCls = "block text-xs font-medium text-gray-600 mb-1";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "url" | "number";
}

export function TextField({ label, value, onChange, placeholder, type = "text" }: TextFieldProps) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputCls}
      />
    </div>
  );
}

interface NumberFieldProps {
  label: string;
  value: number | undefined;
  onChange: (v: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
}

export function NumberField({ label, value, onChange, placeholder, min, max }: NumberFieldProps) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        type="number"
        value={value ?? ""}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder={placeholder}
        className={inputCls}
      />
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}

export function TextAreaField({ label, value, onChange, rows = 3, placeholder }: TextAreaFieldProps) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={inputCls}
      />
    </div>
  );
}

interface CheckboxFieldProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

export function CheckboxField({ label, value, onChange }: CheckboxFieldProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-700 select-none">
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-emerald-600"
      />
      {label}
    </label>
  );
}

interface CTAFieldsProps {
  label?: string;
  value: { label?: string; href?: string } | undefined;
  onChange: (v: { label: string; href: string }) => void;
}

export function CTAFields({ label = "CTA", value, onChange }: CTAFieldsProps) {
  const v = value ?? { label: "", href: "" };
  return (
    <div className={cardCls}>
      <h5 className="text-xs font-semibold uppercase text-gray-500">{label}</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TextField
          label="Label tombol"
          value={v.label ?? ""}
          onChange={(s) => onChange({ label: s, href: v.href ?? "" })}
          placeholder="contoh: Pelajari Lebih Lanjut"
        />
        <TextField
          label="Href"
          value={v.href ?? ""}
          onChange={(s) => onChange({ label: v.label ?? "", href: s })}
          placeholder="/products"
        />
      </div>
    </div>
  );
}

interface ListEditorProps<T> {
  label: string;
  items: T[];
  onChange: (next: T[]) => void;
  newItem: () => T;
  renderItem: (item: T, update: (next: T) => void, index: number) => React.ReactNode;
  itemTitle?: (item: T, index: number) => string;
  addLabel?: string;
}

export function ListEditor<T>({
  label,
  items,
  onChange,
  newItem,
  renderItem,
  itemTitle,
  addLabel = "Tambah",
}: ListEditorProps<T>) {
  const safeItems = Array.isArray(items) ? items : [];

  const update = (i: number, next: T) => {
    const copy = [...safeItems];
    copy[i] = next;
    onChange(copy);
  };
  const remove = (i: number) => {
    onChange(safeItems.filter((_, idx) => idx !== i));
  };
  const move = (i: number, dir: -1 | 1) => {
    const target = i + dir;
    if (target < 0 || target >= safeItems.length) return;
    const copy = [...safeItems];
    [copy[i], copy[target]] = [copy[target], copy[i]];
    onChange(copy);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={() => onChange([...safeItems, newItem()])}
          className="text-xs px-3 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
        >
          + {addLabel}
        </button>
      </div>

      {safeItems.length === 0 && (
        <p className="text-xs text-gray-400 italic">Belum ada item.</p>
      )}

      <div className="space-y-3">
        {safeItems.map((item, i) => (
          <div key={i} className={cardCls}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">
                {itemTitle ? itemTitle(item, i) : `#${i + 1}`}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="text-xs px-2 py-1 rounded text-gray-600 hover:bg-gray-200 disabled:opacity-30"
                  title="Naikkan"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === safeItems.length - 1}
                  className="text-xs px-2 py-1 rounded text-gray-600 hover:bg-gray-200 disabled:opacity-30"
                  title="Turunkan"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-xs px-2 py-1 rounded text-red-600 hover:bg-red-50"
                  title="Hapus"
                >
                  Hapus
                </button>
              </div>
            </div>
            {renderItem(item, (next) => update(i, next), i)}
          </div>
        ))}
      </div>
    </div>
  );
}

// List string sederhana (mis. items marquee, avatars, highlight_words).
interface StringListEditorProps {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}

export function StringListEditor({
  label,
  items,
  onChange,
  placeholder,
  addLabel = "Tambah",
}: StringListEditorProps) {
  return (
    <ListEditor<string>
      label={label}
      items={items ?? []}
      onChange={onChange}
      newItem={() => ""}
      itemTitle={(_, i) => `#${i + 1}`}
      addLabel={addLabel}
      renderItem={(item, update) => (
        <input
          type="text"
          value={item}
          onChange={(e) => update(e.target.value)}
          placeholder={placeholder}
          className={inputCls}
        />
      )}
    />
  );
}

export interface SectionFormProps<TContent> {
  value: TContent;
  onChange: (next: TContent) => void;
}
