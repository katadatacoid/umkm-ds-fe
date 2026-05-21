"use client";

import React, { useState } from "react";
import { useFooterStore } from "@/stores/use-footer-store";
import { FooterMenuGroup, FooterMenuItem } from "@/lib/api";

const MenuGroupsPanel: React.FC = () => {
  const {
    menuGroups,
    createMenuGroup,
    updateMenuGroup,
    removeMenuGroup,
    createMenuItem,
    updateMenuItem,
    removeMenuItem,
  } = useFooterStore();

  const [newGroupTitle, setNewGroupTitle] = useState("");
  const [busy, setBusy] = useState(false);

  const handleAddGroup = async () => {
    const title = newGroupTitle.trim();
    if (!title) return;
    setBusy(true);
    try {
      await createMenuGroup({
        title,
        sort_order: menuGroups.length + 1,
        is_visible: true,
      });
      setNewGroupTitle("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal membuat group");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-800">Menu Footer</h3>
          <p className="text-xs text-gray-500">
            Kolom menu yang tampil di footer (mis. Menu, Halaman, Perusahaan).
          </p>
        </div>
        <div className="flex items-end gap-2">
          <input
            type="text"
            value={newGroupTitle}
            onChange={(e) => setNewGroupTitle(e.target.value)}
            placeholder="Judul kolom baru..."
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-56 focus:ring focus:ring-green-200 outline-none"
          />
          <button
            type="button"
            onClick={handleAddGroup}
            disabled={!newGroupTitle.trim() || busy}
            className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition disabled:bg-gray-400"
          >
            Tambah Kolom
          </button>
        </div>
      </div>

      {menuGroups.length === 0 ? (
        <p className="text-sm text-gray-500 py-4 text-center">
          Belum ada kolom menu. Tambahkan kolom pertama di atas.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuGroups.map((g) => (
            <MenuGroupCard
              key={g.id}
              group={g}
              onUpdate={(body) => updateMenuGroup(g.id, body)}
              onRemove={() => removeMenuGroup(g.id)}
              onAddItem={(body) => createMenuItem(g.id, body)}
              onUpdateItem={(itemId, body) => updateMenuItem(itemId, body)}
              onRemoveItem={(itemId) => removeMenuItem(itemId)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

interface GroupCardProps {
  group: FooterMenuGroup;
  onUpdate: (body: Partial<{ title: string; sort_order: number; is_visible: boolean }>) => Promise<void>;
  onRemove: () => Promise<void>;
  onAddItem: (body: { label: string; href: string; sort_order?: number; is_visible?: boolean }) => Promise<void>;
  onUpdateItem: (
    id: string,
    body: Partial<{ label: string; href: string; sort_order: number; is_visible: boolean }>
  ) => Promise<void>;
  onRemoveItem: (id: string) => Promise<void>;
}

const MenuGroupCard: React.FC<GroupCardProps> = ({
  group,
  onUpdate,
  onRemove,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}) => {
  const [title, setTitle] = useState(group.title);
  const [sortOrder, setSortOrder] = useState<number>(group.sort_order);
  const [isVisible, setIsVisible] = useState(group.is_visible);
  const [newLabel, setNewLabel] = useState("");
  const [newHref, setNewHref] = useState("");
  const [savingHeader, setSavingHeader] = useState(false);
  const [addingItem, setAddingItem] = useState(false);

  React.useEffect(() => {
    setTitle(group.title);
    setSortOrder(group.sort_order);
    setIsVisible(group.is_visible);
  }, [group.id, group.title, group.sort_order, group.is_visible]);

  const handleSaveHeader = async () => {
    setSavingHeader(true);
    try {
      await onUpdate({ title, sort_order: Number(sortOrder) || 0, is_visible: isVisible });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSavingHeader(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Hapus kolom "${group.title}"? Semua link di dalamnya akan ikut terhapus.`)) return;
    try {
      await onRemove();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus");
    }
  };

  const handleAddItem = async () => {
    const label = newLabel.trim();
    const href = newHref.trim();
    if (!label || !href) return;
    setAddingItem(true);
    try {
      await onAddItem({
        label,
        href,
        sort_order: (group.items?.length || 0) + 1,
        is_visible: true,
      });
      setNewLabel("");
      setNewHref("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menambah link");
    } finally {
      setAddingItem(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul kolom"
            className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring focus:ring-green-200 outline-none bg-white"
          />
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            title="Urutan"
            className="w-20 border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring focus:ring-green-200 outline-none bg-white"
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              className="h-3.5 w-3.5 accent-emerald-600"
            />
            Tampilkan
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveHeader}
              disabled={savingHeader}
              className="px-3 py-1 bg-emerald-600 text-white text-xs rounded-md hover:bg-emerald-700 transition disabled:bg-gray-400"
            >
              {savingHeader ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-3 py-1 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md hover:bg-red-100 transition"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-3 space-y-2">
        <p className="text-xs font-semibold uppercase text-gray-500">Link</p>
        {(group.items || []).length === 0 && (
          <p className="text-xs text-gray-400 italic">Belum ada link di kolom ini.</p>
        )}
        {(group.items || []).map((item) => (
          <MenuItemRow
            key={item.id}
            item={item}
            onUpdate={(body) => onUpdateItem(item.id, body)}
            onRemove={() => onRemoveItem(item.id)}
          />
        ))}

        <div className="grid grid-cols-[1fr_1fr_auto] gap-2 pt-2">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Label (mis. Beranda)"
            className="border border-gray-300 rounded-md px-2 py-1.5 text-xs focus:ring focus:ring-green-200 outline-none bg-white"
          />
          <input
            type="text"
            value={newHref}
            onChange={(e) => setNewHref(e.target.value)}
            placeholder="Href (mis. /)"
            className="border border-gray-300 rounded-md px-2 py-1.5 text-xs focus:ring focus:ring-green-200 outline-none bg-white"
          />
          <button
            type="button"
            onClick={handleAddItem}
            disabled={!newLabel.trim() || !newHref.trim() || addingItem}
            className="px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-md hover:bg-emerald-700 transition disabled:bg-gray-400"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

interface MenuItemRowProps {
  item: FooterMenuItem;
  onUpdate: (body: Partial<{ label: string; href: string; sort_order: number; is_visible: boolean }>) => Promise<void>;
  onRemove: () => Promise<void>;
}

const MenuItemRow: React.FC<MenuItemRowProps> = ({ item, onUpdate, onRemove }) => {
  const [label, setLabel] = useState(item.label);
  const [href, setHref] = useState(item.href);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    setLabel(item.label);
    setHref(item.href);
  }, [item.id, item.label, item.href]);

  const dirty = label !== item.label || href !== item.href;

  const handleSave = async () => {
    if (!dirty) return;
    setSaving(true);
    try {
      await onUpdate({ label, href });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Hapus link "${item.label}"?`)) return;
    try {
      await onRemove();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus");
    }
  };

  return (
    <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onBlur={handleSave}
        className="border border-gray-300 rounded-md px-2 py-1.5 text-xs focus:ring focus:ring-green-200 outline-none bg-white"
      />
      <input
        type="text"
        value={href}
        onChange={(e) => setHref(e.target.value)}
        onBlur={handleSave}
        className="border border-gray-300 rounded-md px-2 py-1.5 text-xs focus:ring focus:ring-green-200 outline-none bg-white"
      />
      <span className="text-[10px] text-gray-400 w-8 text-center">
        {saving ? "..." : dirty ? "•" : ""}
      </span>
      <button
        type="button"
        onClick={handleDelete}
        className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-md transition"
        title="Hapus"
      >
        ✕
      </button>
    </div>
  );
};

export default MenuGroupsPanel;
