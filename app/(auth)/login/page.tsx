"use client";
import { MyInput } from "@/shared/components/ui/Input/MyInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/shared/components/ui/field";
import { MyIcons } from "@/shared/components/MyIcons/MyIcons";
import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";
import { formSchemaLogin } from "@/shared/Zod/formSchemaLogin";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Link from "next/link";
import { signInWithEmail } from "@/shared/lib/auth-client";
import { useState } from "react";
import { GardenAdsLogo } from "@/shared/components/Logo/Logo";
type FormData = z.infer<typeof formSchemaLogin>;

export default function LoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState<string>("");
  const [isBusy, setIsBusy] = useState(false);

  const form = useForm<z.infer<typeof formSchemaLogin>>({
    resolver: zodResolver(formSchemaLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsBusy(true);
    setStatus("");

    const result = await signInWithEmail(data);

    if (result.error) {
      // Capturamos el error 403 o el código específico de Better Auth
      if (result.error.status === 403 || result.error.message?.includes("403")) {
        setStatus("--> Revisá tus datos o la verificación de tu email.");
      } else {
        setStatus(result.error.message ?? "No se pudo iniciar sesión.");
      }
      setIsBusy(false);
      return;
    }

    setStatus("Sesión iniciada correctamente.");
    setIsBusy(false);
    router.push("/dashboard");
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <GardenAdsLogo />
        <div className="space-y-1">
          <h2 className="text-center text-4xl font-semibold text-black">Iniciar Sesión</h2>
          <p className="text-muted-foreground text-center text-sm">
            Ingrese su correo electrónico a continuación para iniciar sesión en su cuenta
          </p>
        </div>
      </div>

      <FieldSet>
        <FieldGroup>
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
            {form.formState.errors.email && (
              <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
            )}
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
            {form.formState.errors.password && (
              <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
            )}
          </Field>

          <div className="flex items-center justify-between text-sm">
            <label className="text-muted-foreground inline-flex items-center gap-2">
              <input type="checkbox" className="border-border h-4 w-4 rounded" />
              Recordar datos
            </label>
            <Link
              href="/forgot-password"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </FieldGroup>
      </FieldSet>

      <Button
        type="submit"
        disabled={isBusy}
        className="h-11 w-full cursor-pointer bg-emerald-500 font-semibold text-white hover:bg-emerald-400"
      >
        {isBusy ? "Procesando..." : "Iniciar Sesión"}
      </Button>

      {status ? <p className="text-muted-foreground text-center text-sm">{status}</p> : null}

      <p className="text-muted-foreground text-center text-sm">
        ¿No tienes una cuenta en GardenAds?
      </p>
      <p className="text-center text-lg font-semibold">
        <Link href="/signup" className="text-black hover:text-emerald-700">
          Agendar Demo
        </Link>
      </p>
    </form>
  );
}
