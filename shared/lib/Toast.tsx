import { toast } from "sonner";
import { CircleCheckBig, BadgeInfo, TriangleAlert, CircleX } from "lucide-react";

export const showToast = {
  success: (title: string, description?: string) =>
    toast.success(title, {
      description,
      icon: <CircleCheckBig size={20} color="#09DE61" />,
    }),

  info: (title: string, description?: string) =>
    toast.info(title, {
      description,
      icon: <BadgeInfo size={20} color="#3871BF" />,
    }),

  warning: (title: string, description?: string) =>
    toast.warning(title, {
      description,
      icon: <TriangleAlert size={20} color="#FFD600" />,
    }),

  error: (title: string, description?: string) =>
    toast.error(title, {
      description,
      icon: <CircleX size={20} color="#FF2323" />,
    }),
};
