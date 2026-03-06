import { Loader2Icon, BadgeInfo, CircleCheckBig, CircleX, TriangleAlert } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      closeButton
      icons={{
        success: <CircleCheckBig size={20} color="#09DE61" />,
        info: <BadgeInfo size={20} color="#3871BF" />,
        warning: <TriangleAlert size={20} color="#FFD600" />,
        error: <CircleX size={20} color="#FF2323" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast rounded-xl border px-4 py-3.5 shadow-md text-sm font-sans",
          title: "font-semibold text-sm leading-snug",
          description: "text-sm mt-0.5 leading-snug opacity-90",
          icon: "mt-0.5 shrink-0",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-description": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--width": "412px",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
