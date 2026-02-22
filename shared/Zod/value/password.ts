import { z } from "zod";

export const password = () =>
  z
    .string()
    .trim()
    .min(1, { message: "Ingrese una contraseña." })
    .min(8, { message: "Mínimo 8 caracteres." })
    .max(16, { message: "Máximo 16 caracteres." })
    .refine((value) => /[A-Z]/.test(value), {
      message: "Debe contener al menos una letra mayúscula.",
    })
    .refine((value) => /\d/.test(value), {
      message: "Debe contener al menos un número.",
    });
