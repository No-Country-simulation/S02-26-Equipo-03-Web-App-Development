import { ProjectRole } from "../project.types";

export const standardPermissions = [
  { name: "Ver Proyecto", resource: "project", action: "read" },
  { name: "Editar Proyecto", resource: "project", action: "update" },
  { name: "Eliminar Proyecto", resource: "project", action: "delete" },
  { name: "Gestionar Roles", resource: "project_role", action: "manage" },
  { name: "Gestionar API Keys", resource: "api_key", action: "manage" },
  { name: "Invitar Miembros", resource: "project_member", action: "create" },
  { name: "Eliminar Miembros", resource: "project_member", action: "delete" },
] as const;

export const rolePermissionMap: Record<ProjectRole, { resource: string; action: string }[]> = {
  owner: [
    { resource: "project", action: "read" },
    { resource: "project", action: "update" },
    { resource: "project", action: "delete" },
    { resource: "project_role", action: "manage" },
    { resource: "api_key", action: "manage" },
    { resource: "project_member", action: "create" },
    { resource: "project_member", action: "delete" },
  ],
  admin: [
    { resource: "project", action: "read" },
    { resource: "project", action: "update" },
    { resource: "api_key", action: "manage" },
    { resource: "project_member", action: "create" },
    { resource: "project_member", action: "delete" },
  ],
  editor: [
    { resource: "project", action: "read" },
    { resource: "project", action: "update" },
  ],
  viewer: [
    { resource: "project", action: "read" },
  ],
};