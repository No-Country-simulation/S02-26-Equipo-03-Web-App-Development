export const standardPermissions = [
  { name: "Ver Proyecto", resource: "project", action: "read" },
  { name: "Editar Proyecto", resource: "project", action: "update" },
  { name: "Eliminar Proyecto", resource: "project", action: "delete" },
  { name: "Gestionar Roles", resource: "project_role", action: "manage" },
  { name: "Gestionar API Keys", resource: "api_key", action: "manage" },
  { name: "Invitar Miembros", resource: "project_member", action: "create" },
  { name: "Eliminar Miembros", resource: "project_member", action: "delete" },
] as const;
