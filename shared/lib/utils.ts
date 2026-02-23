import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

export function timeAgo(dateString: string) {
  const now = new Date();
  const past = new Date(dateString);
  const diffSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffSeconds < 60) return { text: "Justo ahora", isNow: true };
  if (diffSeconds < 600) return { text: "Ahora", isNow: true };
  if (diffSeconds < 3600) {
    const minutes = Math.floor(diffSeconds / 60);
    return { text: `Hace ${minutes} min`, isNow: false };
  }
  if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600);
    return { text: `Hace ${hours}h`, isNow: false };
  }
  const days = Math.floor(diffSeconds / 86400);
  return { text: `Hace ${days}d`, isNow: false };
}
