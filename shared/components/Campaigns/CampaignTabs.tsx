import { Info } from "lucide-react";

type Props = {
  activeTab: "all" | "low";
  onChange: (_tab: "all" | "low") => void;
};

export function CampaignTabs({ activeTab, onChange }: Props) {
  return (
    <div className="flex w-full border-b-2 border-gray-200">
      <TabButton
        label="Todas las campañas"
        active={activeTab === "all"}
        onClick={() => onChange("all")}
      />

      <TabButton
        active={activeTab === "low"}
        onClick={() => onChange("low")}
        customContent={
          <div className="flex items-center gap-2">
            Bajo rendimiento
            <Info className={`size-3.5 ${activeTab === "low" ? "text-black" : "text-slate-500"}`} />
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FF3358] text-[10px] font-bold text-white">
              1
            </span>
          </div>
        }
      />
    </div>
  );
}

type TabButtonProps = {
  label?: string;
  active: boolean;
  onClick: () => void;
  customContent?: React.ReactNode;
};

function TabButton({ label, active, onClick, customContent }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative -mb-0.5 h-11 border-b-2 px-4 text-sm font-bold uppercase transition-colors outline-none ${
        active
          ? "border-black text-black"
          : "border-transparent text-slate-500 hover:text-slate-600"
      }`}
    >
      {customContent ?? label}
    </button>
  );
}
