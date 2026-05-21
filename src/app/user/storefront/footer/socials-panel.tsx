"use client";

import React, { useState } from "react";
import { useFooterStore } from "@/stores/use-footer-store";
import { FooterSocial } from "@/lib/api";

const PLATFORM_OPTIONS = [
  "instagram",
  "facebook",
  "twitter",
  "tiktok",
  "youtube",
  "linkedin",
  "whatsapp",
  "telegram",
];

const SocialsPanel: React.FC = () => {
  const { socials, createSocial, updateSocial, removeSocial } = useFooterStore();
  const [form, setForm] = useState({
    platform: "instagram",
    label: "",
    url: "",
    icon: "",
  });
  const [creating, setCreating] = useState(false);

  const handleAdd = async () => {
    const url = form.url.trim();
    const platform = form.platform.trim();
    if (!url || !platform) return;
    setCreating(true);
    try {
      await createSocial({
        platform,
        url,
        label: form.label.trim() || undefined,
        icon: form.icon.trim() || platform,
        sort_order: socials.length + 1,
        is_visible: true,
      });
      setForm({ platform: "instagram", label: "", url: "", icon: "" });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menambah social link");
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
      <div>
        <h3 className="text-base font-semibold text-gray-800">Social Media</h3>
        <p className="text-xs text-gray-500">Tautan ke akun sosial media brand.</p>
      </div>

      <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        <p className="text-xs font-semibold uppercase text-gray-500 mb-3">
          Tambah Social Link
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 items-end">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Platform</label>
            <input
              type="text"
              list="platform-options"
              value={form.platform}
              onChange={(e) => setForm((p) => ({ ...p, platform: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring focus:ring-green-200 outline-none bg-white"
            />
            <datalist id="platform-options">
              {PLATFORM_OPTIONS.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Label</label>
            <input
              type="text"
              value={form.label}
              onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
              placeholder="opsional"
              className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring focus:ring-green-200 outline-none bg-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-600 mb-1">URL</label>
            <input
              type="text"
              value={form.url}
              onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
              placeholder="https://instagram.com/..."
              className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring focus:ring-green-200 outline-none bg-white"
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!form.url.trim() || !form.platform.trim() || creating}
            className="px-4 py-1.5 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition disabled:bg-gray-400"
          >
            {creating ? "Menambah..." : "Tambah"}
          </button>
        </div>
      </div>

      {socials.length === 0 ? (
        <p className="text-sm text-gray-500 py-2 text-center">
          Belum ada social link.
        </p>
      ) : (
        <div className="space-y-2">
          {socials.map((s) => (
            <SocialRow
              key={s.id}
              social={s}
              onUpdate={(body) => updateSocial(s.id, body)}
              onRemove={() => removeSocial(s.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

interface SocialRowProps {
  social: FooterSocial;
  onUpdate: (body: Partial<{
    platform: string;
    url: string;
    label: string;
    icon: string;
    sort_order: number;
    is_visible: boolean;
  }>) => Promise<void>;
  onRemove: () => Promise<void>;
}

const SocialRow: React.FC<SocialRowProps> = ({ social, onUpdate, onRemove }) => {
  const [platform, setPlatform] = useState(social.platform);
  const [label, setLabel] = useState(social.label ?? "");
  const [url, setUrl] = useState(social.url);
  const [sortOrder, setSortOrder] = useState<number>(social.sort_order);
  const [isVisible, setIsVisible] = useState(social.is_visible);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    setPlatform(social.platform);
    setLabel(social.label ?? "");
    setUrl(social.url);
    setSortOrder(social.sort_order);
    setIsVisible(social.is_visible);
  }, [
    social.id,
    social.platform,
    social.label,
    social.url,
    social.sort_order,
    social.is_visible,
  ]);

  const dirty =
    platform !== social.platform ||
    (label || null) !== (social.label || null) ||
    url !== social.url ||
    sortOrder !== social.sort_order ||
    isVisible !== social.is_visible;

  const handleSave = async () => {
    if (!dirty) return;
    setSaving(true);
    try {
      await onUpdate({
        platform,
        label,
        url,
        sort_order: Number(sortOrder) || 0,
        is_visible: isVisible,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Hapus social ${social.platform}?`)) return;
    try {
      await onRemove();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_2fr_70px_auto_auto] gap-2 items-center border border-gray-200 rounded-md p-2">
      <input
        type="text"
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        placeholder="platform"
        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring focus:ring-green-200 outline-none"
      />
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Label"
        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring focus:ring-green-200 outline-none"
      />
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://..."
        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring focus:ring-green-200 outline-none"
      />
      <input
        type="number"
        value={sortOrder}
        onChange={(e) => setSortOrder(Number(e.target.value))}
        title="Urutan"
        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring focus:ring-green-200 outline-none"
      />
      <label className="flex items-center gap-1 text-xs text-gray-600">
        <input
          type="checkbox"
          checked={isVisible}
          onChange={(e) => setIsVisible(e.target.checked)}
          className="h-4 w-4 accent-emerald-600"
        />
        Tampil
      </label>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || saving}
          className="px-2 py-1 bg-emerald-600 text-white text-xs rounded-md hover:bg-emerald-700 transition disabled:bg-gray-300"
        >
          {saving ? "..." : "Simpan"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="px-2 py-1 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md hover:bg-red-100 transition"
        >
          Hapus
        </button>
      </div>
    </div>
  );
};

export default SocialsPanel;
