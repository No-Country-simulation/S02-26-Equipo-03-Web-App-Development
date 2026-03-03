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
import { MyIcons } from "@/shared/components/MyIcons/MyIcons";
import { GardenAdsLogo } from "@/shared/components/Logo/Logo";

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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <GardenAdsLogo />
        <div className="space-y-1">
          <h2 className="text-center text-4xl font-semibold text-black">Crear Cuenta</h2>
          <p className="text-muted-foreground text-center text-sm">
            Ingrese sus datos para crear su cuenta
          </p>
        </div>
      </div>

      <FieldSet>
        <FieldGroup>
          <Field orientation="vertical" className="relative gap-2">
            <FieldLabel htmlFor="name" className="text-sm font-semibold text-black">
              Nombre *
            </FieldLabel>
            <MyInput id="name" placeholder="Escriba su nombre" {...form.register("name")} />
            {form.formState.errors.name ? (
              <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
            ) : null}
          </Field>

          <Field orientation="vertical" className="relative gap-2">
            <FieldLabel htmlFor="email" className="text-sm font-semibold text-black">
              Correo electrónico *
            </FieldLabel>
            <MyInput
              id="email"
              type="email"
              placeholder="Escriba su email"
              label={<MyIcons name="email" className="h-4 w-4" size={16} />}
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
            ) : null}
          </Field>

          <Field orientation="vertical" className="relative gap-2">
            <FieldLabel htmlFor="password" className="text-sm font-semibold text-black">
              Contraseña *
            </FieldLabel>
            <MyInput
              id="password"
              type="password"
              placeholder="Escriba su contraseña"
              label={<MyIcons name="password" className="h-4 w-4" size={16} />}
              {...form.register("password")}
            />
            {form.formState.errors.password ? (
              <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
            ) : null}
          </Field>
        </FieldGroup>
      </FieldSet>

      <Button
        type="submit"
        disabled={isBusy}
        className="h-11 w-full cursor-pointer bg-emerald-500 font-semibold text-white hover:bg-emerald-400"
      >
        {isBusy ? "Creando cuenta..." : "Crear Cuenta"}
      </Button>

      {status ? <p className="text-muted-foreground text-center text-sm">{status}</p> : null}

      <p className="text-muted-foreground text-center text-sm">
        ¿Ya tienes una cuenta en GardenAds?
      </p>
      <p className="text-center text-lg font-semibold text-black">
        <Link href="/login" className="hover:text-emerald-700">
          Iniciar Sesión
        </Link>
      </p>
    </form>
  );
}
