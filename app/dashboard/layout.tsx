import type { ReactNode } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { requireSignedIn } from "@/lib/auth/roles";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const { profile, role } = await requireSignedIn();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative flex min-h-screen">
        <DashboardSidebar role={role} />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader profile={profile} role={role} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
