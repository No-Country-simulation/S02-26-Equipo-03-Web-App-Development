"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { email } from "@/shared/Zod/value";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/shared/components/ui/field";
import { MyInput } from "@/shared/components/ui/Input/MyInput";
import { Button } from "@/shared/components/ui/button";
import { MyIcons } from "@/shared/components/MyIcons/MyIcons";
import { forgotPassword } from "@/shared/lib/auth-client";
import { GardenAdsLogo } from "@/shared/components/Logo/Logo";

const forgotPasswordSchema = z.object({
  email: email(),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<string>("");
  const [isBusy, setIsBusy] = useState(false);

  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsBusy(true);
    setStatus("");

    const result = await forgotPassword({
      email: data.email,
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (result.error) {
      setStatus(result.error.message ?? "No se pudo enviar el enlace de recuperación.");
      setIsBusy(false);
      return;
    }

    setStatus("Enlace enviado. Revisá tu correo para continuar.");
    setIsBusy(false);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <GardenAdsLogo />
        <div className="space-y-1">
          <h2 className="text-center text-4xl font-semibold text-black">Recuperar contraseña</h2>
          <p className="text-muted-foreground text-center text-sm">
            Te enviaremos un link para restablecer tu contraseña.
          </p>
        </div>
      </div>

      <FieldSet>
        <FieldGroup>
          <Field orientation="vertical" className="relative gap-2">
            <FieldLabel htmlFor="email" className="text-sm font-semibold text-black">
              Email *
            </FieldLabel>
            <MyInput
              id="email"
              type="email"
              placeholder="tu@email"
              label={<MyIcons name="email" className="h-4 w-4" size={16} />}
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
            ) : null}
          </Field>
        </FieldGroup>
      </FieldSet>

      <Button
        type="submit"
        disabled={isBusy}
        className="h-11 w-full cursor-pointer bg-emerald-500 font-semibold text-white hover:bg-emerald-400"
      >
        {isBusy ? "Enviando..." : "Enviar Link de Recuperación"}
      </Button>

      {status ? <p className="text-muted-foreground text-center text-sm">{status}</p> : null}

      <p className="text-center text-base font-semibold text-black">
        <Link href="/login" className="text-black hover:text-emerald-700">
          Volver al Login
        </Link>
      </p>
    </form>
  );
}
