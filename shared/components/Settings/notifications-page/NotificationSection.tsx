import { NotificationRow } from "./NotificationRow";
import { NotificationKey, NotificationSettings } from "./setting-notification.type";

export function NotificationSection({
  title,
  items,
  settings,
  onChange,
}: {
  title: string;
  items: { key: NotificationKey; title: string; description: string }[];
  settings: NotificationSettings;
  onChange: (_key: NotificationKey, _val: boolean) => void;
}) {
  return (
    <div>
      <h2 className="mb-5 text-xl font-semibold text-[#020617]">{title}</h2>
      <div className="divide-y divide-[#E2E8F0] overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
        {items.map((item) => (
          <NotificationRow
            key={item.key}
            id={item.key}
            title={item.title}
            description={item.description}
            checked={settings[item.key]}
            onChange={() => onChange(item.key, !settings[item.key])}
          />
        ))}
      </div>
    </div>
  );
}
