import { z } from "zod";

export const email = () =>
  z
    .string()
    .trim()
    .min(1, { message: "Ingrese un email." })
    .pipe(z.email({ message: "Email inválido." }));
