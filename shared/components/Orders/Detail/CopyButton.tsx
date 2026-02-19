"use client";

import { Copy } from "lucide-react";

interface CopyButtonProps {
  value: string;
}

export function CopyButton({ value }: CopyButtonProps) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(value)}
      className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
      title="Copiar"
    >
      <Copy className="h-3.5 w-3.5 inline" />
    </button>
  );
}
