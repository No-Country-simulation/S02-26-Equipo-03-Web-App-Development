"use client";

import { Input } from "@shared/components/ui/input";
import { Button } from "@shared/components/ui/button";
import { Search } from "lucide-react";

interface OrdersToolbarProps {
  search: string;
  onSearchChange: (_value: string) => void;
}

export function SearchToolbar({
  search,
  onSearchChange,
}: OrdersToolbarProps) {
  return (
    <div className="flex items-center gap-4 border-b border-[#E2E8F0] p-4">
      <div className="relative w-80 shadow-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#475569]" strokeWidth={3} />
        <Input
          placeholder="Buscar"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-[#F8FAFC] pl-9 text-sm text-black h-10 placeholder:text-[#94A3B8]"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-sm font-medium text-[#475569] cursor-pointer"
          onClick={() => {}}
        >
          Filtros
        </Button>
        
      </div>
    </div>
  );
}