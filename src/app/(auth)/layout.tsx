import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export const dynamic = "force-dynamic";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F] flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/">
          <Logo variant="light" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-white/50 text-sm">
          &copy; {new Date().getFullYear()} Start My Business Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
