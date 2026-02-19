"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { email, password } from "@/shared/Zod/value";
import { MyInput } from "@/shared/components/ui/Input/MyInput";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/shared/components/ui/field";
import { signUpWithEmail } from "@/shared/lib/auth-client";

const signupSchema = z.object({
  name: z.string().trim().min(2, "Ingresá al menos 2 caracteres."),
  email: email(),
  password: password(),
});

type SignupData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string>("");
  const [isBusy, setIsBusy] = useState(false);

  const form = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupData) => {
    setIsBusy(true);
    setStatus("");

    const result = await signUpWithEmail(data);

    if (result.error) {
      setStatus(result.error.message ?? "No se pudo completar el registro.");
      setIsBusy(false);
      return;
    }

    setStatus("Cuenta creada correctamente. Redirigiendo al login...");
    setIsBusy(false);
    router.push("/login");
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-96 max-w-sm rounded-xl bg-white p-8 shadow-md"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black">Solicitar acceso</h2>
          <p className="mt-1 text-sm text-gray-500">Creá tu cuenta para ingresar a la plataforma.</p>
        </div>

        <FieldSet>
          <FieldGroup>
            <Field orientation="vertical" className="relative mb-6">
              <FieldLabel htmlFor="name" className="font-bold text-gray-700">
                Nombre
              </FieldLabel>
              <MyInput id="name" placeholder="Tu nombre" {...form.register("name")} />
              {form.formState.errors.name ? (
                <p className="absolute -bottom-5 left-0 text-xs text-red-500">
                  {form.formState.errors.name.message}
                </p>
              ) : null}
            </Field>

            <Field orientation="vertical" className="relative mb-6">
              <FieldLabel htmlFor="email" className="font-bold text-gray-700">
                Email
              </FieldLabel>
              <MyInput id="email" type="email" placeholder="nombre@empresa.com" {...form.register("email")} />
              {form.formState.errors.email ? (
                <p className="absolute -bottom-5 left-0 text-xs text-red-500">
                  {form.formState.errors.email.message}
                </p>
              ) : null}
            </Field>

            <Field orientation="vertical" className="relative">
              <FieldLabel htmlFor="password" className="font-bold text-gray-700">
                Contraseña
              </FieldLabel>
              <MyInput id="password" type="password" placeholder="●●●●●●●" {...form.register("password")} />
              {form.formState.errors.password ? (
                <p className="absolute -bottom-5 left-0 text-xs text-red-500">
                  {form.formState.errors.password.message}
                </p>
              ) : null}
            </Field>
          </FieldGroup>
        </FieldSet>

        <Button
          type="submit"
          disabled={isBusy}
          className="mt-8 mb-5 w-full cursor-pointer rounded-lg bg-blue-600 py-3 text-white transition-colors hover:bg-blue-700"
        >
          {isBusy ? "Creando cuenta..." : "Crear cuenta"}
        </Button>

        {status ? <p className="mb-4 text-sm text-gray-700">{status}</p> : null}

        <p className="text-center text-sm text-gray-600">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="font-semibold text-gray-900 hover:text-blue-600">
            Iniciar sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
