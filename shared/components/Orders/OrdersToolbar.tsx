"use client";

import { Input } from "@shared/components/ui/input";
import { Button } from "@shared/components/ui/button";
import { Search, SlidersHorizontal, Download } from "lucide-react";

interface OrdersToolbarProps {
  search: string;
  onSearchChange: (_value: string) => void;
  onFilter?: () => void;
  onExport?: () => void;
}

export function OrdersToolbar({
  search,
  onSearchChange,
  onFilter,
  onExport,
}: OrdersToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3">
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Buscar"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 text-sm text-black"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-sm font-medium"
          onClick={onFilter}
        >
          <SlidersHorizontal className="h-4 w-4" />
          FILTROS
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-sm font-medium"
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
          EXPORTAR CSV
        </Button>
      </div>
    </div>
  );
}