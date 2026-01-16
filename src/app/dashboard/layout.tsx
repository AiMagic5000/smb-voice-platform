"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Phone,
  PhoneCall,
  Voicemail,
  MessageSquare,
  Settings,
  Menu,
  X,
  ChevronRight,
  Bell,
  Search,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/phone-numbers", label: "Phone Numbers", icon: Phone },
  { href: "/dashboard/calls", label: "Call History", icon: PhoneCall },
  { href: "/dashboard/voicemails", label: "Voicemails", icon: Voicemail },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/ai-receptionist", label: "AI Receptionist", icon: Bot },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/sign-in");
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A227] to-[#DEB44A] flex items-center justify-center">
                <Phone className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white">SMB Voice</span>
            </Link>
          </div>
          <UserButton afterSignOutUrl="/" />
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
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A227] to-[#DEB44A] flex items-center justify-center">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white">SMB Voice</span>
              <span className="block text-xs text-slate-400">Business Phone</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

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

        {/* Upgrade banner */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#C9A227]/20 to-[#C9A227]/5 border border-[#C9A227]/30">
            <p className="text-[#C9A227] font-semibold text-sm">Starter Plan</p>
            <p className="text-slate-400 text-xs mt-1">$7.95/month</p>
            <Button
              asChild
              size="sm"
              className="w-full mt-3 bg-[#C9A227] hover:bg-[#B8921F] text-white text-xs"
            >
              <Link href="/dashboard/settings?tab=billing">Upgrade Plan</Link>
            </Button>
          </div>
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
      <div className="lg:ml-64 min-h-screen">
        {/* Desktop header */}
        <header className="hidden lg:flex h-16 items-center justify-between px-6 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search calls, messages, contacts..."
                className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Bell className="h-5 w-5" />
            </Button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 pt-20 lg:pt-6">{children}</main>
      </div>
    </div>
  );
}
