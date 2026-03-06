import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/components/ui/table";
import { Badge } from "@shared/components/ui/badge";
import { Skeleton } from "@shared/components/ui/skeleton";

import { Button } from "../../ui/button";
import { Copy, Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@shared/components/ui/dropdown-menu";
import { ActiveKey } from "./api-key.type";
import { formatDate } from "@/shared/lib/utils";
import { HeaderColumn } from "@/shared/types/header-col.types";
import { showToast } from "@/shared/lib/Toast";

// --- Sub-components ---

function ColHeader({ label }: { label: string }) {
  return <span>{label}</span>;
}

const handleCopyKey = async (key: string) => {
  await navigator.clipboard.writeText(key);
  showToast.success("¡Key copiada al portapapeles!");
};

// --- Props ---

const HEADER_COLUMNS: HeaderColumn[] = [
  { key: "name", label: "Nombre" },
  { key: "key", label: "Key (parcial)" },
  { key: "permissions", label: "Permisos" },
  { key: "createdAt", label: "Creada" },
  { key: "lastUsedAt", label: "Último uso" },
  { key: "action", label: " " },
];

interface Props {
  activeKeys: ActiveKey[];
  loading?: boolean;
}

// --- Main Component ---

export function ApiKeyTable({ activeKeys, loading = false }: Props & { loading?: boolean }) {
  if (loading) {
    return (
      <Table>
        <TableHeader>
          <TableRow className="border-[#E2E8F0] text-xs tracking-wide uppercase [&_th]:text-[#475569]">
            {HEADER_COLUMNS.map((column, index) => (
              <TableHead
                key={column.key}
                className={`${column.className ?? ""} ${index === 0 ? "pl-5" : ""}`.trim()}
              >
                <ColHeader label={column.label} />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(1)].map((_, i) => (
            <TableRow key={i}>
              {HEADER_COLUMNS.map((col) => (
                <TableCell key={col.key}>
                  <Skeleton className="h-10 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-[#E2E8F0] text-xs uppercase hover:bg-[#E2E8F0]/50 [&_th]:text-[#475569]">
            {HEADER_COLUMNS.map((column, index) => (
              <TableHead
                key={column.key}
                className={`${column.className ?? ""} ${column.key == "action" && "text-right"} ${index === 0 ? "pl-5" : ""}`.trim()}
              >
                <ColHeader label={column.label} />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeKeys.map((key) => (
            <TableRow
              key={key.id}
              className="border-[#E2E8F0] transition-colors hover:bg-[#E2E8F0]/20"
            >
              <TableCell className="py-6 pl-6 text-xs font-medium text-[#020617]">
                {key.name}
              </TableCell>
              <TableCell className="text-xs font-medium text-[#020617]">
                <div className="item-center flex">
                  {key.key.slice(0, 6)}-XXXX...XXXX
                  <Button
                    size="icon"
                    variant={"link"}
                    type="button"
                    className="h-4 w-4 pl-6 text-gray-500"
                    onClick={() => handleCopyKey(key.key)}
                    title="Copiar key"
                  >
                    <Copy />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="rounded-sm border-[#E2E8F0] bg-white px-2 text-xs font-medium text-[#475569] uppercase"
                >
                  {key.permissions}
                </Badge>
              </TableCell>
              <TableCell className="text-xs font-medium text-[#020617]">
                {formatDate(key.createdAt)}
              </TableCell>
              <TableCell className="py-6 text-xs font-medium text-[#020617]">
                {key.lastUsedAt}
              </TableCell>
              <TableCell className="pr-2 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant={"ghost"}
                      className="flex h-6 w-6 min-w-0 cursor-pointer items-center justify-center p-1 text-right font-medium text-[#475569]"
                    >
                      <Ellipsis strokeWidth={3} size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>Borrar Key</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
