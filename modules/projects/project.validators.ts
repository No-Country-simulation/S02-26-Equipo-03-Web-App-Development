import { z } from "zod";

/* Validate inputs */
export const createProjectSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
});

export const updateProjectSchema = z
  .object({
    name: z.string().min(3).max(100).optional(),
    description: z.string().max(500).optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "At least one field must be provided",
  });

export const addMemberSchema = z.object({
  targetUserId: z.string().nonempty(),
  roleId: z.string().nonempty(),
});

export const removeMemberSchema = z.object({
  targetUserId: z.string().nonempty(),
});
