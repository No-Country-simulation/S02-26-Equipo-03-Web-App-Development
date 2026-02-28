"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { password } from "@/shared/Zod/value";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/shared/components/ui/field";
import { MyInput } from "@/shared/components/ui/Input/MyInput";
import { Button } from "@/shared/components/ui/button";
import { MyIcons } from "@/shared/components/MyIcons/MyIcons";
import { resetPassword } from "@/shared/lib/auth-client";
import { Check, X } from "lucide-react";
import { GardenAdsLogo } from "@/shared/components/Logo/Logo";

const resetPasswordSchema = z
  .object({
    newPassword: password(),
    confirmPassword: z.string().trim().min(1, "Confirmá tu contraseña."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string>("");
  const [isBusy, setIsBusy] = useState(false);

  const token = searchParams.get("token") ?? "";

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = form.watch("newPassword") ?? "";

  const requirements = useMemo(
    () => [
      { label: "Mínimo 8 caracteres", valid: newPassword.length >= 8 },
      { label: "Al menos 1 mayúscula", valid: /[A-Z]/.test(newPassword) },
      { label: "Al menos 1 número", valid: /\d/.test(newPassword) },
    ],
    [newPassword]
  );

  const onSubmit = async (data: ResetPasswordData) => {
    if (!token) {
      setStatus("El enlace no es válido o expiró. Solicitá uno nuevo.");
      return;
    }

    setIsBusy(true);
    setStatus("");

    const result = await resetPassword({
      token,
      newPassword: data.newPassword,
    });

    if (result.error) {
      setStatus(result.error.message ?? "No se pudo restablecer la contraseña.");
      setIsBusy(false);
      return;
    }

    setStatus("Contraseña actualizada correctamente. Ya podés iniciar sesión.");
    setIsBusy(false);
    form.reset();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <GardenAdsLogo />
        <div className="space-y-1">
          <h2 className="text-center text-4xl font-semibold text-black">Crear nueva contraseña</h2>
          <p className="text-muted-foreground text-center text-sm">
            Tu nueva contraseña debe ser diferente a las anteriores.
          </p>
        </div>
      </div>

      <FieldSet>
        <FieldGroup>
          <Field orientation="vertical" className="relative gap-2">
            <FieldLabel htmlFor="newPassword" className="text-sm font-semibold text-black">
              Nueva Contraseña *
            </FieldLabel>
            <MyInput
              id="newPassword"
              type="password"
              placeholder="Escribe tu nueva contraseña"
              label={<MyIcons name="password" className="h-4 w-4" size={16} />}
              {...form.register("newPassword")}
            />
            {form.formState.errors.newPassword ? (
              <p className="text-xs text-red-500">{form.formState.errors.newPassword.message}</p>
            ) : null}
          </Field>

          <Field orientation="vertical" className="relative gap-2">
            <FieldLabel htmlFor="confirmPassword" className="text-sm font-semibold text-black">
              Confirmar Nueva Contraseña *
            </FieldLabel>
            <MyInput
              id="confirmPassword"
              type="password"
              placeholder="Vuelve a escribir tu nueva contraseña"
              label={<MyIcons name="password" className="h-4 w-4" size={16} />}
              {...form.register("confirmPassword")}
            />
            {form.formState.errors.confirmPassword ? (
              <p className="text-xs text-red-500">
                {form.formState.errors.confirmPassword.message}
              </p>
            ) : null}
          </Field>
        </FieldGroup>
      </FieldSet>

      <div className="bg-muted/70 rounded-lg p-4">
        <p className="mb-3 text-sm font-semibold text-black">Requisitos</p>
        <ul className="space-y-2">
          {requirements.map((requirement) => (
            <li key={requirement.label} className="flex items-center gap-2 text-sm">
              {requirement.valid ? (
                <Check className="h-4 w-4 text-emerald-600" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
              <span className="text-muted-foreground">{requirement.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        type="submit"
        disabled={isBusy}
        className="h-11 w-full cursor-pointer bg-emerald-500 font-semibold text-white hover:bg-emerald-400"
      >
        {isBusy ? "Restableciendo..." : "Restablecer Contraseña"}
      </Button>

      {status ? <p className="text-muted-foreground text-center text-sm">{status}</p> : null}

      <p className="text-center text-base font-semibold text-black">
        <Link href="/login" className="hover:text-emerald-700">
          Volver al Login
        </Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
