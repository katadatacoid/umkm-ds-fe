"use client";

import React, { useState } from "react";
import { useAboutStore } from "@/stores/use-about-store";
import { AboutTeam } from "@/lib/api";
import ImageUploadField from "@/app/ui/file-upload/image-upload-field";

const TeamPanel: React.FC = () => {
  const { team, createTeam, updateTeam, removeTeam } = useAboutStore();
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [creating, setCreating] = useState(false);

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    try {
      await createTeam({
        name,
        role: newRole.trim() || undefined,
        image_url: newImageUrl.trim() || undefined,
        sort_order: team.length + 1,
        is_visible: true,
      });
      setNewName("");
      setNewRole("");
      setNewImageUrl("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menambah anggota team");
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
      <div>
        <h3 className="text-base font-semibold text-gray-800">Team Kami</h3>
        <p className="text-xs text-gray-500">
          Anggota tim yang ditampilkan di halaman About. Gambar opsional tapi
          dianjurkan.
        </p>
      </div>

      <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 space-y-3">
        <p className="text-xs font-semibold uppercase text-gray-500">
          Tambah Anggota
        </p>

        <ImageUploadField
          label="Foto Anggota (opsional)"
          value={newImageUrl}
          onChange={(url) => setNewImageUrl(url)}
        />

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 items-end">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Nama</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Andi Saputra"
              className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring focus:ring-green-200 outline-none bg-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Role (opsional)
            </label>
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="Founder & CEO"
              className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring focus:ring-green-200 outline-none bg-white"
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newName.trim() || creating}
            className="px-4 py-1.5 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition disabled:bg-gray-400"
          >
            {creating ? "Menambah..." : "Tambah"}
          </button>
        </div>
      </div>

      {team.length === 0 ? (
        <p className="text-sm text-gray-500 py-2 text-center">
          Belum ada anggota team. Tambahkan anggota pertama di atas.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {team.map((t) => (
            <TeamCard
              key={t.id}
              member={t}
              onUpdate={(body) => updateTeam(t.id, body)}
              onRemove={() => removeTeam(t.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

interface TeamCardProps {
  member: AboutTeam;
  onUpdate: (
    body: Partial<{
      name: string;
      image_url: string | null;
      role: string | null;
      sort_order: number;
      is_visible: boolean;
    }>
  ) => Promise<void>;
  onRemove: () => Promise<void>;
}

const TeamCard: React.FC<TeamCardProps> = ({ member, onUpdate, onRemove }) => {
  const [name, setName] = useState(member.name);
  const [role, setRole] = useState(member.role ?? "");
  const [imageUrl, setImageUrl] = useState(member.image_url ?? "");
  const [sortOrder, setSortOrder] = useState<number>(member.sort_order);
  const [isVisible, setIsVisible] = useState(member.is_visible);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    setName(member.name);
    setRole(member.role ?? "");
    setImageUrl(member.image_url ?? "");
    setSortOrder(member.sort_order);
    setIsVisible(member.is_visible);
  }, [
    member.id,
    member.name,
    member.role,
    member.image_url,
    member.sort_order,
    member.is_visible,
  ]);

  const dirty =
    name !== member.name ||
    (role || null) !== (member.role || null) ||
    (imageUrl || null) !== (member.image_url || null) ||
    sortOrder !== member.sort_order ||
    isVisible !== member.is_visible;

  const handleSave = async () => {
    if (!dirty) return;
    setSaving(true);
    try {
      await onUpdate({
        name,
        role: role.trim() || null,
        image_url: imageUrl.trim() || null,
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
    if (!confirm(`Hapus anggota "${member.name}"?`)) return;
    try {
      await onRemove();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus");
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
      <ImageUploadField
        label="Foto"
        value={imageUrl}
        onChange={(url) => setImageUrl(url)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Nama</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama lengkap"
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring focus:ring-green-200 outline-none bg-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Founder & CEO"
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring focus:ring-green-200 outline-none bg-white"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1 text-xs text-gray-600">
            Urutan
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-16 border border-gray-300 rounded-md px-2 py-1 text-xs focus:ring focus:ring-green-200 outline-none bg-white"
            />
          </label>
          <label className="flex items-center gap-1 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              className="h-4 w-4 accent-emerald-600"
            />
            Tampilkan
          </label>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty || saving}
            className="px-3 py-1 bg-emerald-600 text-white text-xs rounded-md hover:bg-emerald-700 transition disabled:bg-gray-300"
          >
            {saving ? "Menyimpan..." : "Simpan"}
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
  );
};

export default TeamPanel;
