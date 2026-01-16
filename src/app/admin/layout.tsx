"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Phone,
  CreditCard,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/clients", label: "Clients", icon: Building2 },
  { href: "/admin/phone-numbers", label: "Phone Numbers", icon: Phone },
  { href: "/admin/billing", label: "Billing", icon: CreditCard },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function checkAdminAccess() {
      if (!isLoaded) return;

      if (!userId) {
        router.push("/sign-in");
        return;
      }

      try {
        const response = await fetch("/api/admin/stats");
        if (response.ok) {
          setIsAuthorized(true);
        } else if (response.status === 403) {
          router.push("/dashboard");
        } else if (response.status === 401) {
          router.push("/sign-in");
        }
      } catch {
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    }

    checkAdminAccess();
  }, [isLoaded, userId, router]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-[#C9A227]" />
            <span className="font-semibold text-white">Admin Panel</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-200 ease-in-out lg:transform-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-700">
          <Shield className="h-8 w-8 text-[#C9A227]" />
          <div>
            <span className="font-bold text-white">SMB Voice</span>
            <span className="block text-xs text-[#C9A227]">Admin Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#C9A227]/20 text-[#C9A227]"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
                {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
