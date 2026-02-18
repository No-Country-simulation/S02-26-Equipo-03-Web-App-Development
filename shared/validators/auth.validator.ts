import { z } from "zod";

/**
 * Validaciones comunes para reutilizar en distintos esquemas
 */
export const passwordValidation = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .max(100, "Contraseña demasiado larga");

/**
 * Esquema para el Login
 */
export const loginValidator = z.object({
  email: z.string().email("Formato de correo inválido"),
  password: passwordValidation,
});

/**
 * Esquema para el Registro (Sign-up)
 */
export const registerValidator = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Formato de correo inválido"),
  password: passwordValidation,
});

// Tipos derivados para TypeScript
export type LoginInput = z.infer<typeof loginValidator>;
export type RegisterInput = z.infer<typeof registerValidator>;
