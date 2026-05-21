"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { LandingSectionV2 } from "@/lib/api";

interface RowProps {
  item: LandingSectionV2;
  active: boolean;
  onSelect: () => void;
}

function SortableRow({ item, active, onSelect }: RowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li ref={setNodeRef} style={style}>
      <div
        className={
          "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition " +
          (active ? "bg-emerald-50 text-emerald-700" : "hover:bg-gray-50 text-gray-700")
        }
      >
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 px-1"
          title="Drag untuk urutkan"
          aria-label="Drag handle"
        >
          ⋮⋮
        </button>
        <button
          type="button"
          onClick={onSelect}
          className="flex-1 text-left"
        >
          <div className={"truncate " + (active ? "font-medium" : "")}>
            {item.judul || "(tanpa judul)"}
          </div>
          <div className="text-[11px] text-gray-400">
            urutan {item.sort_order}
            {!item.is_visible && " · hidden"}
          </div>
        </button>
      </div>
    </li>
  );
}

interface Props {
  items: LandingSectionV2[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onReorder: (orderedIds: string[]) => Promise<void>;
}

export default function KeyUnggulanList({ items, activeId, onSelect, onReorder }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const ids = items.map((x) => x.id);
    const oldIdx = ids.indexOf(String(active.id));
    const newIdx = ids.indexOf(String(over.id));
    if (oldIdx === -1 || newIdx === -1) return;
    const nextIds = arrayMove(ids, oldIdx, newIdx);
    onReorder(nextIds).catch((err) => alert(err.message));
  };

  if (items.length === 0) {
    return <p className="px-2 py-2 text-xs text-gray-400 italic">Belum ada item.</p>;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext
        items={items.map((x) => x.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="space-y-1">
          {items.map((item) => (
            <SortableRow
              key={item.id}
              item={item}
              active={activeId === item.id}
              onSelect={() => onSelect(item.id)}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
