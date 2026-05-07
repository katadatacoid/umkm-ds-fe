"use client";

import React from "react";
import {
  ListEditor,
  SectionFormProps,
  TextAreaField,
  TextField,
  cardCls,
} from "./shared";

interface MenuItem {
  label: string;
  href: string;
}
interface MenuGroup {
  title: string;
  items: MenuItem[];
}
export interface FooterContent {
  newsletter: { heading: string; body: string; placeholder: string };
  menu_groups: MenuGroup[];
  copyright_suffix: string;
}

export const footerDefaults = (): FooterContent => ({
  newsletter: { heading: "", body: "", placeholder: "" },
  menu_groups: [],
  copyright_suffix: "",
});

export default function FooterForm({ value, onChange }: SectionFormProps<FooterContent>) {
  const d = footerDefaults();
  const v: FooterContent = {
    ...d,
    ...value,
    newsletter: { ...d.newsletter, ...(value?.newsletter || {}) },
    menu_groups: value?.menu_groups ?? [],
  };

  return (
    <div className="space-y-5">
      <div className={cardCls}>
        <h5 className="text-xs font-semibold uppercase text-gray-500">Newsletter</h5>
        <TextField
          label="Heading"
          value={v.newsletter.heading}
          onChange={(heading) =>
            onChange({ ...v, newsletter: { ...v.newsletter, heading } })
          }
        />
        <TextAreaField
          label="Body"
          value={v.newsletter.body}
          onChange={(body) => onChange({ ...v, newsletter: { ...v.newsletter, body } })}
          rows={2}
        />
        <TextField
          label="Placeholder input email"
          value={v.newsletter.placeholder}
          onChange={(placeholder) =>
            onChange({ ...v, newsletter: { ...v.newsletter, placeholder } })
          }
        />
      </div>

      <ListEditor<MenuGroup>
        label="Menu Groups"
        items={v.menu_groups}
        onChange={(menu_groups) => onChange({ ...v, menu_groups })}
        newItem={() => ({ title: "", items: [] })}
        itemTitle={(item, i) => item.title || `Group ${i + 1}`}
        renderItem={(group, updateGroup) => (
          <div className="space-y-3">
            <TextField
              label="Judul group"
              value={group.title}
              onChange={(title) => updateGroup({ ...group, title })}
            />
            <ListEditor<MenuItem>
              label="Item menu"
              items={group.items ?? []}
              onChange={(items) => updateGroup({ ...group, items })}
              newItem={() => ({ label: "", href: "" })}
              itemTitle={(item, i) => item.label || `Item ${i + 1}`}
              renderItem={(item, updateItem) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <TextField
                    label="Label"
                    value={item.label}
                    onChange={(label) => updateItem({ ...item, label })}
                  />
                  <TextField
                    label="Href"
                    value={item.href}
                    onChange={(href) => updateItem({ ...item, href })}
                  />
                </div>
              )}
            />
          </div>
        )}
      />

      <TextField
        label="Copyright suffix"
        value={v.copyright_suffix}
        onChange={(copyright_suffix) => onChange({ ...v, copyright_suffix })}
        placeholder="Powered By ..."
      />
    </div>
  );
}
