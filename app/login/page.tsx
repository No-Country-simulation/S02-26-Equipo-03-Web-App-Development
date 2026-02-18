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
import { getSession, signInWithEmail, signOut } from "@/shared/lib/auth-client";
import { useState } from "react";
type FormData = z.infer<typeof formSchemaLogin>;

export default function LoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState<string>("");
  const [sessionSummary, setSessionSummary] = useState<string>("");
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
      setStatus(result.error.message ?? "No se pudo iniciar sesión.");
      setIsBusy(false);
      return;
    }

    setStatus("Sesión iniciada correctamente.");
    setIsBusy(false);
    router.push("/");
  };

  const handleGetSession = async () => {
    setIsBusy(true);
    const result = await getSession();

    if (result.error) {
      setSessionSummary(result.error.message ?? "No hay sesión activa.");
      setIsBusy(false);
      return;
    }

    const sessionData = result.data as { user?: { email?: string; name?: string } } | null;
    const identity = sessionData?.user?.email ?? sessionData?.user?.name ?? "sesión activa";
    setSessionSummary(`Sesión detectada: ${identity}`);
    setIsBusy(false);
  };

  const handleSignOut = async () => {
    setIsBusy(true);
    const result = await signOut();
    setIsBusy(false);

    if (result.error) {
      setStatus(result.error.message ?? "No se pudo cerrar sesión.");
      return;
    }

    setStatus("Sesión cerrada correctamente.");
    setSessionSummary("");
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-96 max-w-sm rounded-xl bg-white p-8 shadow-md"
      >
        <div className="mb-6 flex flex-col items-start gap-2">
          <Button className="mr-3 flex h-12 w-12 cursor-pointer items-center justify-center bg-blue-600 text-lg font-bold text-white hover:bg-blue-800">
            G
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-black">Iniciar sesión</h2>
            <p className="mt-1 text-sm text-gray-500">
              Accedé a tu plataforma de revenue tracking.
            </p>
          </div>
        </div>

        <FieldSet>
          <FieldGroup>
            <Field orientation="vertical" className="relative mb-6">
              <FieldLabel htmlFor="email" className="relative font-bold text-gray-700">
                Email
              </FieldLabel>
              <MyInput
                id="email"
                type="email"
                placeholder="nombre@empresa.com"
                className="pl-10"
                {...form.register("email")}
              />
              {/* Icono de email */}
              <div className="pointer-events-none absolute top-10 left-2 mt-1 ml-2 flex items-center text-xs text-gray-500">
                <MyIcons name="email" className="h-4 w-4" size={32} />
              </div>
              {form.formState.errors.email && (
                <p className="absolute -bottom-5 left-0 text-xs text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </Field>

            <Field orientation="vertical" className="relative">
              <div className="mb-1 flex items-center justify-between">
                <FieldLabel htmlFor="password" className="font-bold text-gray-700">
                  Contraseña
                </FieldLabel>
                <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-800">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <MyInput
                id="password"
                type="password"
                placeholder="●●●●●●●"
                className="pl-10"
                {...form.register("password")}
              />
              {/* Icono de candado */}
              <div className="pointer-events-none absolute top-11 left-2 mt-1 ml-2 flex items-center text-xs text-gray-500">
                <MyIcons name="password" className="h-4 w-4" size={32} />
              </div>
              {form.formState.errors.password && (
                <p className="absolute -bottom-5 left-0 text-xs text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </Field>
          </FieldGroup>
        </FieldSet>

        <Button
          type="submit"
          disabled={isBusy}
          className="mt-8 mb-5 w-full cursor-pointer rounded-lg bg-blue-600 py-3 text-white transition-colors hover:bg-blue-700"
        >
          {isBusy ? "Procesando..." : "Iniciar sesión"}
        </Button>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isBusy}
            onClick={handleGetSession}
            className="flex-1"
          >
            Ver sesión
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isBusy}
            onClick={handleSignOut}
            className="flex-1"
          >
            Cerrar sesión
          </Button>
        </div>

        {status ? <p className="mt-4 text-sm text-gray-700">{status}</p> : null}
        {sessionSummary ? <p className="mt-1 text-sm text-gray-700">{sessionSummary}</p> : null}

        <p className="text-center text-sm text-gray-600">
          ¿No tenés acceso?{" "}
          <Link href="/signup" className="font-semibold text-gray-900 hover:text-blue-600">
            Solicitar acceso
          </Link>
        </p>
      </form>
    </div>
  );
}
