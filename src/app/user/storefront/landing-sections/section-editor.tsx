"use client";

import React, { useEffect, useMemo, useState } from "react";
import { LandingSection } from "@/lib/api";
import { getSectionForm } from "./forms";
import { decodeStringFields } from "./forms/shared";

interface Props {
  section: LandingSection;
  templateId: number;
  onSave: (body: {
    template_id: number;
    content: unknown;
    is_visible: boolean;
    sort_order: number;
  }) => Promise<void>;
}

function formatJson(value: unknown): string {
  try {
    return JSON.stringify(value ?? {}, null, 2);
  } catch {
    return "{}";
  }
}

export default function SectionEditor({ section, templateId, onSave }: Props) {
  const formDef = useMemo(() => getSectionForm(section.section_key), [section.section_key]);

  const initialContent = useMemo(() => {
    const decoded = decodeStringFields(section.content ?? {});
    if (formDef && (decoded == null || Object.keys(decoded as object).length === 0)) {
      return formDef.defaults();
    }
    return decoded;
  }, [section.id, section.content, formDef]);

  const [content, setContent] = useState<unknown>(initialContent);
  const [rawJson, setRawJson] = useState<string>(formatJson(initialContent));
  const [isVisible, setIsVisible] = useState(section.is_visible);
  const [sortOrder, setSortOrder] = useState<number>(section.sort_order);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setContent(initialContent);
    setRawJson(formatJson(initialContent));
    setIsVisible(section.is_visible);
    setSortOrder(section.sort_order);
    setJsonError(null);
    setSaved(false);
  }, [section.id]);

  const handleSave = async () => {
    let payload: unknown = content;

    // Untuk section_key tanpa form khusus, parse textarea fallback.
    if (!formDef) {
      try {
        payload = JSON.parse(rawJson);
        setJsonError(null);
      } catch (e) {
        setJsonError(e instanceof Error ? e.message : "JSON tidak valid");
        return;
      }
    }

    setSaving(true);
    try {
      await onSave({
        template_id: templateId,
        content: payload,
        is_visible: isVisible,
        sort_order: Number(sortOrder) || 0,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const handleFormatRaw = () => {
    try {
      const parsed = JSON.parse(rawJson);
      setRawJson(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : "JSON tidak valid");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-800">
            <span className="font-mono text-emerald-700">{section.section_key}</span>
          </h3>
          <p className="text-xs text-gray-500">
            ID: {section.id} · Template: {section.template_id}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              className="h-4 w-4 accent-emerald-600"
            />
            Tampilkan
          </label>
          <label className="text-sm text-gray-700 flex items-center gap-2">
            Urutan
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring focus:ring-green-200 outline-none"
            />
          </label>
        </div>
      </div>

      {formDef ? (
        <formDef.Form value={content as never} onChange={(next: unknown) => setContent(next)} />
      ) : (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Content (JSON) — section custom
            </label>
            <button
              type="button"
              onClick={handleFormatRaw}
              className="text-xs text-emerald-700 hover:underline"
            >
              Format JSON
            </button>
          </div>
          <textarea
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
            rows={14}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs font-mono focus:ring focus:ring-green-200 outline-none"
          />
          {jsonError && (
            <p className="mt-1 text-xs text-red-600">JSON tidak valid: {jsonError}</p>
          )}
          <p className="mt-2 text-[11px] text-gray-400">
            Tidak ada form khusus untuk <code>{section.section_key}</code>. Edit raw JSON.
          </p>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
        {saved && <span className="text-sm text-emerald-700">Tersimpan ✓</span>}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition disabled:bg-gray-400"
        >
          {saving ? "Menyimpan..." : "Simpan Section"}
        </button>
      </div>
    </div>
  );
}
