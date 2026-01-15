import { Sidebar } from "@/components/dashboard/sidebar";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F172A]">
      <Sidebar />
      <main className="ml-[280px] transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
