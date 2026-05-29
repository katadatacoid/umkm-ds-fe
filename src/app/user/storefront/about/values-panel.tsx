"use client";

import React, { useState } from "react";
import { useAboutStore } from "@/stores/use-about-store";
import { AboutValue } from "@/lib/api";

const ValuesPanel: React.FC = () => {
  const { values, createValue, updateValue, removeValue } = useAboutStore();
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [creating, setCreating] = useState(false);

  const handleAdd = async () => {
    const title = newTitle.trim();
    if (!title) return;
    setCreating(true);
    try {
      await createValue({
        title,
        description: newDescription.trim() || undefined,
        icon: newIcon.trim() || undefined,
        sort_order: values.length + 1,
        is_visible: true,
      });
      setNewTitle("");
      setNewDescription("");
      setNewIcon("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menambah nilai");
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
      <div>
        <h3 className="text-base font-semibold text-gray-800">Nilai-Nilai Kami</h3>
        <p className="text-xs text-gray-500">
          Prinsip atau value yang dipegang perusahaan.
        </p>
      </div>

      <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        <p className="text-xs font-semibold uppercase text-gray-500 mb-3">
          Tambah Nilai
        </p>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_140px_auto] gap-2 items-end">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Judul</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Integritas"
              className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring focus:ring-green-200 outline-none bg-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Deskripsi</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Kami menjunjung tinggi kejujuran..."
              className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring focus:ring-green-200 outline-none bg-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Icon (opsional)
            </label>
            <input
              type="text"
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              placeholder="shield-check"
              className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring focus:ring-green-200 outline-none bg-white"
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newTitle.trim() || creating}
            className="px-4 py-1.5 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition disabled:bg-gray-400"
          >
            {creating ? "Menambah..." : "Tambah"}
          </button>
        </div>
      </div>

      {values.length === 0 ? (
        <p className="text-sm text-gray-500 py-2 text-center">
          Belum ada nilai. Tambahkan nilai pertama di atas.
        </p>
      ) : (
        <div className="space-y-2">
          {values.map((v) => (
            <ValueRow
              key={v.id}
              value={v}
              onUpdate={(body) => updateValue(v.id, body)}
              onRemove={() => removeValue(v.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

interface ValueRowProps {
  value: AboutValue;
  onUpdate: (
    body: Partial<{
      title: string;
      description: string | null;
      icon: string | null;
      sort_order: number;
      is_visible: boolean;
    }>
  ) => Promise<void>;
  onRemove: () => Promise<void>;
}

const ValueRow: React.FC<ValueRowProps> = ({ value, onUpdate, onRemove }) => {
  const [title, setTitle] = useState(value.title);
  const [description, setDescription] = useState(value.description ?? "");
  const [icon, setIcon] = useState(value.icon ?? "");
  const [sortOrder, setSortOrder] = useState<number>(value.sort_order);
  const [isVisible, setIsVisible] = useState(value.is_visible);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    setTitle(value.title);
    setDescription(value.description ?? "");
    setIcon(value.icon ?? "");
    setSortOrder(value.sort_order);
    setIsVisible(value.is_visible);
  }, [
    value.id,
    value.title,
    value.description,
    value.icon,
    value.sort_order,
    value.is_visible,
  ]);

  const dirty =
    title !== value.title ||
    (description || null) !== (value.description || null) ||
    (icon || null) !== (value.icon || null) ||
    sortOrder !== value.sort_order ||
    isVisible !== value.is_visible;

  const handleSave = async () => {
    if (!dirty) return;
    setSaving(true);
    try {
      await onUpdate({
        title,
        description: description.trim() || null,
        icon: icon.trim() || null,
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
    if (!confirm(`Hapus nilai "${value.title}"?`)) return;
    try {
      await onRemove();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_140px_70px_auto_auto] gap-2 items-center border border-gray-200 rounded-md p-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Judul"
        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring focus:ring-green-200 outline-none"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Deskripsi"
        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring focus:ring-green-200 outline-none"
      />
      <input
        type="text"
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
        placeholder="icon (opsional)"
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

export default ValuesPanel;
