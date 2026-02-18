// Example roles
export type ProjectRole = "owner" | "admin" | "editor" | "viewer";

export const roleHierarchy: Record<ProjectRole, number> = {
  owner: 4,
  admin: 3,
  editor: 2,
  viewer: 1,
};

