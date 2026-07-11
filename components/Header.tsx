"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock, Menu as MenuIcon, X } from "lucide-react";
import { navItems } from "./Sidebar";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const [time, setTime] = useState<Date | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageTitle = () => {
    switch (pathname) {
      case "/": return "Dashboard";
      case "/menu": return "Cafe Menu";
      case "/reports": return "Daily Report";
      case "/settings": return "Settings";
      default: return "Dashboard";
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b bg-card/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <h1 className="text-lg md:text-xl font-semibold tracking-tight truncate max-w-[150px] sm:max-w-none">{getPageTitle()}</h1>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden text-sm text-muted-foreground lg:block">
              Wild Gaming Cafe Management
            </div>
            
            <div className="flex items-center gap-2 md:gap-3 text-right">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                <Clock className="h-4 w-4" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold leading-none">
                  {time ? format(time, 'hh:mm:ss a') : '00:00:00'}
                </div>
                <div className="text-[10px] md:text-xs text-muted-foreground mt-1">
                  {time ? format(time, 'EEEE, dd MMM yyyy') : 'Loading...'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer Content */}
          <div className="relative w-3/4 max-w-sm bg-card border-r border-border h-full flex flex-col p-6 animate-in slide-in-from-left">
            <button 
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="flex flex-col items-center gap-3 pb-8 mt-4">
              <div className="relative h-16 w-40 overflow-hidden rounded-md">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase text-center mt-1">
                Internal Management
              </span>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-4 py-4 text-base font-medium transition-colors border-l-4",
                      isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
