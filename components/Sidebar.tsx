"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Menu, BarChart3, Settings, ShoppingBag, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

export const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Sales Entry", href: "/sales", icon: ShoppingBag },
  { name: "Today's Orders", href: "/orders", icon: Receipt },
  { name: "Cafe Menu", href: "/menu", icon: Menu },
  { name: "Daily Report", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex h-screen w-20 lg:w-72 flex-col border-r border-border bg-card py-6 transition-all duration-300 print:hidden">
      <div className="flex flex-col items-center justify-center gap-3 px-2 pb-8">
        <div className="relative h-12 w-12 lg:h-20 lg:w-48 overflow-hidden rounded-md flex-shrink-0">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            fill
            sizes="(max-width: 1024px) 48px, 192px"
            className="object-contain"
            priority
          />
        </div>
        <span className="hidden lg:block text-sm font-semibold tracking-wider text-muted-foreground uppercase text-center mt-1">
          Internal Management
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={item.name}
              className={cn(
                "group flex items-center justify-center lg:justify-start gap-3 rounded-md px-3 py-3 text-sm font-medium transition-all duration-200 lg:border-l-2",
                isActive
                  ? "lg:border-primary bg-primary/10 text-primary"
                  : "lg:border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-6 w-6 lg:h-5 lg:w-5 transition-colors shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              <span className="hidden lg:block">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col items-center justify-center border-t border-border pt-6 pb-2 text-center text-xs text-muted-foreground overflow-hidden px-2">
        <p className="hidden lg:block font-medium text-foreground whitespace-nowrap">Wild Gaming Cafe</p>
        <p className="hidden lg:block mt-1 whitespace-nowrap">Internal Management System</p>
        <p className="hidden lg:block mt-2 text-[10px] uppercase tracking-wider opacity-60">Version 1.0.0</p>
        <p className="block lg:hidden font-bold">WGC</p>
      </div>
    </div>
  );
}

