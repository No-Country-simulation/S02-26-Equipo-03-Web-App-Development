"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Check, X } from "lucide-react";
import { password } from "@/shared/Zod/value";
import { GardenAdsLogo } from "@/shared/components/Logo/Logo";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/shared/components/ui/field";
import { MyInput } from "@/shared/components/ui/Input/MyInput";
import { MyIcons } from "@/shared/components/MyIcons/MyIcons";

const activateAccountSchema = z
  .object({
    createPassword: password(),
    confirmPassword: z.string().trim().min(1, "Confirmá tu contraseña."),
  })
  .refine((values) => values.createPassword === values.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

type ActivateAccountData = z.infer<typeof activateAccountSchema>;

function ActivateAccountContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string>("");
  const [isBusy, setIsBusy] = useState(false);

  const email = searchParams.get("email") ?? "john@example.com";
  const role = searchParams.get("role") ?? "Marketing Manager";
  const inviter = searchParams.get("inviter") ?? "Alex Rivera";

  const form = useForm<ActivateAccountData>({
    resolver: zodResolver(activateAccountSchema),
    defaultValues: {
      createPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const createPassword = form.watch("createPassword") ?? "";

  const requirements = useMemo(
    () => [
      { label: "Mínimo 8 caracteres", valid: createPassword.length >= 8 },
      { label: "Al menos 1 mayúscula", valid: /[A-Z]/.test(createPassword) },
      { label: "Al menos 1 número", valid: /\d/.test(createPassword) },
    ],
    [createPassword]
  );

  const onSubmit = async () => {
    setIsBusy(true);
    setStatus("");

    await new Promise((resolve) => setTimeout(resolve, 700));

    setStatus("Cuenta activada correctamente. Ya puedes iniciar sesión.");
    setIsBusy(false);
    form.reset();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <GardenAdsLogo />
        <div className="space-y-1">
          <h2 className="text-center text-4xl font-semibold text-black">Bienvenido a GardenAds</h2>
          <p className="text-muted-foreground text-center text-sm">
            Creá tu contraseña para activar tu cuenta
          </p>
        </div>
      </div>

      <div className="flex items-start justify-between rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4 text-emerald-600" />
          <div>
            <p className="text-sm font-semibold text-emerald-700">Has sido invitado por:</p>
            <p className="text-sm text-emerald-600">{inviter} (Admin)</p>
          </div>
        </div>
        <X className="h-4 w-4 text-emerald-500" />
      </div>

      <FieldSet>
        <FieldGroup>
          <Field orientation="vertical" className="relative gap-2">
            <FieldLabel htmlFor="email" className="text-sm font-semibold text-black">
              Email *
            </FieldLabel>
            <MyInput id="email" value={email} readOnly disabled />
          </Field>

          <Field orientation="vertical" className="relative gap-2">
            <FieldLabel htmlFor="role" className="text-sm font-semibold text-black">
              Rol asignado *
            </FieldLabel>
            <MyInput id="role" value={role} readOnly disabled />
          </Field>

          <Field orientation="vertical" className="relative gap-2">
            <FieldLabel htmlFor="createPassword" className="text-sm font-semibold text-black">
              Crear contraseña *
            </FieldLabel>
            <MyInput
              id="createPassword"
              type="password"
              placeholder="Escribí tu contraseña"
              label={<MyIcons name="password" className="h-4 w-4" size={16} />}
              {...form.register("createPassword")}
            />
            {form.formState.errors.createPassword ? (
              <p className="text-xs text-red-500">{form.formState.errors.createPassword.message}</p>
            ) : null}
          </Field>

          <Field orientation="vertical" className="relative gap-2">
            <FieldLabel htmlFor="confirmPassword" className="text-sm font-semibold text-black">
              Confirmar contraseña *
            </FieldLabel>
            <MyInput
              id="confirmPassword"
              type="password"
              placeholder="Vuelve a escribir tu contraseña"
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
        disabled={isBusy || !form.formState.isValid}
        className="h-11 w-full cursor-pointer bg-emerald-500 font-semibold text-white hover:bg-emerald-400"
      >
        {isBusy ? "Activando..." : "Activar Cuenta"}
      </Button>

      {status ? <p className="text-muted-foreground text-center text-sm">{status}</p> : null}
    </form>
  );
}

export default function ActivateAccountPage() {
  return (
    <Suspense fallback={null}>
      <ActivateAccountContent />
    </Suspense>
  );
}
