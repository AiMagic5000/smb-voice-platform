"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import {
  LayoutDashboard,
  Phone,
  Users,
  Voicemail,
  Bot,
  Settings,
  HelpCircle,
  ChevronLeft,
  History,
  CreditCard,
  MessageSquare,
  UserCircle,
  BarChart3,
  Code,
  ListTree,
  Menu,
  Clock,
  Mic,
  Shield,
  UsersRound,
  PhoneCall,
  CircleDot,
  Target,
  Puzzle,
  FileCode,
  Smartphone,
  Zap,
  Ban,
  MapPin,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Live Calls",
    href: "/dashboard/live-calls",
    icon: PhoneCall,
  },
  {
    label: "Phone Numbers",
    href: "/dashboard/phone-numbers",
    icon: Phone,
  },
  {
    label: "Extensions",
    href: "/dashboard/extensions",
    icon: Users,
  },
  {
    label: "Call History",
    href: "/dashboard/calls",
    icon: History,
  },
  {
    label: "Messaging",
    href: "/dashboard/messaging",
    icon: MessageSquare,
  },
  {
    label: "Voicemails",
    href: "/dashboard/voicemails",
    icon: Voicemail,
  },
  {
    label: "Contacts",
    href: "/dashboard/contacts",
    icon: UserCircle,
  },
  {
    label: "Speed Dial",
    href: "/dashboard/speed-dial",
    icon: Zap,
  },
  {
    label: "AI Receptionist",
    href: "/dashboard/ai-receptionist",
    icon: Bot,
  },
  {
    label: "Call Queues",
    href: "/dashboard/queues",
    icon: ListTree,
  },
  {
    label: "Ring Groups",
    href: "/dashboard/ring-groups",
    icon: CircleDot,
  },
  {
    label: "Hunt Groups",
    href: "/dashboard/hunt-groups",
    icon: Target,
  },
  {
    label: "Phone Menu (IVR)",
    href: "/dashboard/ivr",
    icon: Menu,
  },
  {
    label: "Business Hours",
    href: "/dashboard/hours",
    icon: Clock,
  },
  {
    label: "Recordings",
    href: "/dashboard/recordings",
    icon: Mic,
  },
  {
    label: "Team Presence",
    href: "/dashboard/presence",
    icon: UsersRound,
  },
  {
    label: "Blocklist",
    href: "/dashboard/blocklist",
    icon: Ban,
  },
  {
    label: "E911 Config",
    href: "/dashboard/e911",
    icon: MapPin,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    label: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
  {
    label: "Integrations",
    href: "/dashboard/integrations",
    icon: Puzzle,
  },
  {
    label: "API Docs",
    href: "/dashboard/api-docs",
    icon: FileCode,
  },
  {
    label: "Mobile App",
    href: "/dashboard/mobile-app",
    icon: Smartphone,
  },
  {
    label: "Audit Logs",
    href: "/dashboard/audit",
    icon: Shield,
  },
  {
    label: "Developer",
    href: "/dashboard/developer",
    icon: Code,
  },
  {
    label: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const bottomItems = [
  {
    label: "Help & Support",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="fixed left-0 top-0 bottom-0 bg-[#1E3A5F] text-white z-40 flex flex-col"
    >
      {/* Header */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-white/10">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Logo variant="light" />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }}>
            <ChevronLeft className="h-5 w-5" />
          </motion.div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                  isActive ? "bg-[#C9A227] text-white" : "bg-white/10"
                )}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Bottom items */}
      <div className="py-4 px-3 border-t border-white/10">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="h-5 w-5" />
              </div>
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>
    </motion.aside>
  );
}
