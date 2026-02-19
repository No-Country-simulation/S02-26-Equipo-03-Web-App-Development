import { z } from "zod";
import { email, password } from "@shared/Zod/value";

export const formSchemaLogin = z.object({
  email: email(),
  password: password(),
});
