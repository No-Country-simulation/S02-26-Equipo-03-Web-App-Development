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
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@shared/components/ui/dropdown-menu";

// --- Sub-components ---

function ColHeader({ label }: { label: string }) {
  return <span>{label}</span>;
}

function StatusUserBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    activo: "border-[#BBF7D1] bg-[#EEFFF4] text-[#049140]",
    pendiente: "border-[#FFFD86] bg-[#FFFFE7] text-[#A67102]",
    inactivo: "border-[#E2E8F0] bg-[#FFFFFF] text-[#475569]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-semibold ${styles[status]}`}
    >
      {status === "activo" ? "Activo" : status === "pendiente" ? "Pendiente" : "Inactivo"}
    </span>
  );
}

// --- Props ---

type HeaderColumn = {
  key: string;
  label: string;
  className?: string;
};

const HEADER_COLUMNS: HeaderColumn[] = [
  { key: "user", label: "Usuario" },
  { key: "role", label: "Rol" },
  { key: "status", label: "Estado" },
  { key: "lastAccess", label: "Último acceso" },
  { key: "action", label: " " },
];

type UsersAndRoles = {
  name: string;
  roleId: string;
  email?: string;
};

interface Props {
  usersroles: UsersAndRoles[];
  loading?: boolean;
}

// Normalización de roles por ID
const ROLE_ID_TO_LABEL: Record<string, string> = {
  "d1f4068e-6e29-4886-877c-ddaccf5bfc02": "ADMIN",
  "9449e8ce-320e-49a1-8c45-ee134604478a": "EDITOR",
  "30182bcb-8f32-49f8-9fba-2e1f3f6fb371": "PROPIETARIO",
  "af92ae8c-5ee5-465e-b1ab-b71b6787e622": "LECTOR",
};

// --- Main Component ---

export function UsersRolesTable({ usersroles, loading = false }: Props & { loading?: boolean }) {
  // Normalizar roles antes de renderizar
  const normalizedUsers = usersroles.map((user) => ({
    ...user,
    role: ROLE_ID_TO_LABEL[user.roleId] || "LECTOR",
  }));

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
                className={`${column.className ?? ""} ${index === 0 ? "pl-5" : ""}`.trim()}
              >
                <ColHeader label={column.label} />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {normalizedUsers.map((userrole, i) => (
            <TableRow
              key={`${userrole.name}-${i}`}
              className="border-[#E2E8F0] transition-colors hover:bg-[#E2E8F0]/20"
            >
              <TableCell className="py-6 pl-6 text-xs font-medium text-[#020617]">
                {userrole.name}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="rounded-sm border-[#E2E8F0] bg-white px-2 text-xs font-medium text-[#475569] uppercase"
                >
                  {userrole.role}
                </Badge>
              </TableCell>
              <TableCell>
                <StatusUserBadge status={"activo"} />
              </TableCell>
              <TableCell className="py-6 text-xs font-medium text-[#020617]">En línea</TableCell>
              <TableCell className="pr-2 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className="flex h-6 w-6 min-w-0 cursor-pointer items-center justify-center p-1 text-right font-medium text-[#475569]"
                    >
                      <Ellipsis strokeWidth={3} size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>Editar</DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={userrole.role === "PROPIETARIO" || userrole.role === "ADMIN"}
                    >
                      Eliminar usuario
                    </DropdownMenuItem>
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
