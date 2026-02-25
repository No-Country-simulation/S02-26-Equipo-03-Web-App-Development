import { Target } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/components/ui/input-group";

interface CampaignSearchProps {
  search: string;
  onSearchChange: (_value: string) => void;
}

export function CampaignSearch({ search, onSearchChange }: CampaignSearchProps) {
  return (
    <>
      <InputGroup className="relative max-w-sm">
        <InputGroupInput
          placeholder="Buscar"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <InputGroupAddon>
          <Target className="size-6 text-black" />
        </InputGroupAddon>
      </InputGroup>
    </>
  );
}
