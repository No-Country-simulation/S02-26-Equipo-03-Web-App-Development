type Permission = "admin" | "editor" | "viewer";

export type DataKey = {
  id: string;
  createdAt: string;
  revokedAt?: string | null;
};

export type ActiveKey = {
  id: string;
  name: string;
  key: string;
  permissions: Permission;
  createdAt: string;
  lastUsedAt: string;
};
