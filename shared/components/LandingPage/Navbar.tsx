"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet";
import { Logo } from "@/shared/components/logo";

const NAV_ITEMS = [
  { label: "Producto", href: "/" },
  { label: "Integraciones", href: "/" },
  { label: "Diferenciador", href: "/" },
  { label: "Precio", href: "/" },
];

/* 
  NavLinks Component
  - Renders navigation links
  - Can be used in both desktop and mobile
*/
const NavLinks = ({ className = "" }: { className?: string }) => (
  <nav className={`flex gap-11 md:items-center ${className}`}>
    {NAV_ITEMS.map((item) => (
      <Link
        key={item.label}
        href={item.href}
        className="text-base font-medium text-emerald-600 transition-colors hover:text-emerald-400"
      >
        {item.label}
      </Link>
    ))}
  </nav>
);

/* 
  UserActions Component
  - Renders login and demo buttons
  - Adjusts layout for mobile if isMobile is true
*/
const UserActions = ({ isMobile = false }: { isMobile?: boolean }) => (
  <div className={`flex ${isMobile ? "flex-col items-center gap-4" : "items-center gap-6"}`}>
    <Link
      href="/login"
      className={`rounded-md bg-white px-4 py-3 text-slate-600 transition-colors hover:bg-slate-100 active:bg-slate-200 disabled:bg-slate-100 ${
        isMobile ? "w-full text-center" : ""
      }`}
    >
      Iniciar sesión
    </Link>
    <Button size="primary" variant="primary" className={isMobile ? "w-full" : ""}>
      Agendar Demo
    </Button>
  </div>
);

/* 
  MobileMenu Component
  - Encapsulates mobile menu logic using Sheet
  - Uses NavLinks and UserActions internally
*/
const MobileMenu = () => (
  <div className="md:hidden">
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Abrir menú">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 border-none bg-white px-5">
        <div className="mt-8 flex flex-col gap-6">
          <NavLinks className="flex-col gap-6" />
          <div className="mt-6">
            <UserActions isMobile />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </div>
);

/* 
  Navbar Component
  - Main header component
  - Combines logo, desktop navigation, desktop actions, and mobile menu
*/
export function Navbar() {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <NavLinks className="hidden md:flex" />

        {/* Desktop Actions */}
        <div className="hidden md:flex">
          <UserActions />
        </div>

        {/* Mobile Menu */}
        <MobileMenu />
      </div>
    </header>
  );
}
