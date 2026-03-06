"use client";

import { Switch } from "../../ui/switch";

export function NotificationRow({
  title,
  description,
  checked,
  onChange,
  id,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  id: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-between gap-4 px-4 py-4"
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#020617]">{title}</p>
        <p className="mt-1 text-sm text-[#020617]">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </label>
  );
}
