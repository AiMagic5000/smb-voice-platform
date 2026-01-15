import { Logo } from "@/components/shared/logo";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Background Image (visible on lg screens) */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/auth-bg.png"
            alt="Business dashboard"
            fill
            className="object-cover"
            priority
            sizes="50vw"
          />
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#1E3A5F]/80 to-transparent" />
        {/* Content */}
        <div className="relative z-20 flex flex-col justify-center p-12">
          <Logo size="lg" className="mb-8" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Professional Business Phone System
          </h1>
          <p className="text-xl text-white/80 max-w-md">
            Get your business phone number, AI receptionist, and mobile apps.
            Set up in 5 minutes.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[
                { initials: "JD", bg: "bg-blue-500" },
                { initials: "SM", bg: "bg-green-500" },
                { initials: "AK", bg: "bg-purple-500" },
                { initials: "MR", bg: "bg-orange-500" },
              ].map((user, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full ${user.bg} border-2 border-white/60 flex items-center justify-center text-white text-xs font-semibold`}
                >
                  {user.initials}
                </div>
              ))}
            </div>
            <p className="text-white/70 text-sm">
              Join 10,000+ businesses
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 min-h-screen bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F] flex flex-col">
        {/* Mobile Header */}
        <header className="p-6 lg:hidden">
          <Logo size="md" />
        </header>

        {/* Main Content - positioned at top */}
        <main className="flex justify-center p-6 pt-4 lg:pt-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>

        {/* Footer - pushed to bottom */}
        <footer className="mt-auto p-6 text-center">
          <p className="text-white/50 text-sm">
            &copy; {new Date().getFullYear()} Start My Business Inc. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
