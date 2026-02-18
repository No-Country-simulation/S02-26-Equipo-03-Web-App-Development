import { z } from "zod";

/* Validate inputs */
export const createProjectSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string()
});