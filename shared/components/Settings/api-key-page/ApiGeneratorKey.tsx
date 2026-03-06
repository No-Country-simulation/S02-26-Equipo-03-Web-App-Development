"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { TriangleAlert } from "lucide-react";
import { showToast } from "@/shared/lib/Toast";

type Permission = "read" | "write" | "admin";

export default function ApiKeyGenerator() {
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [showConfirmGenerate, setShowConfirmGenerate] = useState(false);

  const handleGenerateClick = () => {
    if (!name.trim() || permissions.length === 0) return;
    setShowConfirmGenerate(true);
  };

  const handleConfirmGenerate = () => {
    setName("");
    setPermissions([]);
    setShowConfirmGenerate(false);
    showToast.error("Error al generar API Key. Inténtalo más tarde.");
  };

  const isFormValid = name.trim().length > 0 && permissions.length > 0;

  return (
    <>
      <div className="w-full max-w-md space-y-6">
        {/* Generate Form Card */}
        <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
          <div className="border-b border-[#E2E8F0] px-6 py-4">
            <h3 className="text-base font-semibold text-[#020617]">Generar Nueva API Key</h3>
          </div>

          <div className="space-y-5 px-6 py-5">
            {/* Name Field */}
            <div className="space-y-4">
              <Label htmlFor="keyName" className="text-sm font-medium text-[#020617]">
                Nombre
              </Label>
              <Input
                id="keyName"
                placeholder="Ej: Integración frontend"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-[#E2E8F0] bg-[#F8FAFC] py-5 text-[#020617] transition-colors placeholder:text-[#94A3B8] focus:bg-white"
              />
            </div>

            {/* Permissions */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#020617]">Permisos</h3>
              <ul className="space-y-3 text-sm text-[#020617]">
                <li className="flex items-center gap-2">
                  <Checkbox
                    id="perm-read"
                    checked={permissions.includes("read")}
                    onCheckedChange={(checked) => {
                      setPermissions((prev) =>
                        checked ? [...prev, "read"] : prev.filter((p) => p !== "read")
                      );
                    }}
                  />
                  <Label htmlFor="perm-read" className="text-sm font-normal">
                    Lectura (read)
                  </Label>
                </li>
                <li className="flex items-center gap-2">
                  <Checkbox
                    id="perm-write"
                    checked={permissions.includes("write")}
                    onCheckedChange={(checked) => {
                      setPermissions((prev) =>
                        checked ? [...prev, "write"] : prev.filter((p) => p !== "write")
                      );
                    }}
                  />
                  <Label htmlFor="perm-write" className="text-sm font-normal">
                    Escritura (write - eventos)
                  </Label>
                </li>
                <li className="flex items-center gap-2">
                  <Checkbox
                    id="perm-admin"
                    checked={permissions.includes("admin")}
                    onCheckedChange={(checked) => {
                      setPermissions((prev) =>
                        checked ? [...prev, "admin"] : prev.filter((p) => p !== "admin")
                      );
                    }}
                  />
                  <Label htmlFor="perm-admin" className="text-sm font-normal">
                    Admin (acceso completo)
                  </Label>
                </li>
              </ul>
            </div>
            <Separator className="my-6 bg-[#F1F5F9]" />
            {/* Generate Button */}
            <Button
              onClick={handleGenerateClick}
              disabled={!isFormValid}
              className="w-full bg-[#059669] text-white hover:bg-[#047857] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Generar API Key
            </Button>
          </div>
        </div>
      </div>

      {/* Confirm Generate Modal */}
      <Dialog open={showConfirmGenerate} onOpenChange={setShowConfirmGenerate}>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <div className="mb-1 flex items-center gap-3">
              <TriangleAlert className="h-5 w-5 text-yellow-500" />
              <DialogTitle className="text-lg text-[#020617]">Confirmar generación</DialogTitle>
            </div>
            <DialogDescription className="text-[#475569]">
              Estás a punto de generar una nueva API Key con el nombre{" "}
              <span className="font-semibold text-[#020617]">"{name}"</span>.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setShowConfirmGenerate(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmGenerate}
              className="bg-[#059669] text-white hover:bg-[#047857]"
            >
              Generar API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
