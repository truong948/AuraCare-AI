"use client";

import type { Session } from "@supabase/supabase-js";
import { ConsultationForm } from "@/components/consultation-form";
import { AuthSignIn } from "@/components/auth-signin";

interface ConsultationDashboardProps {
  session: Session | null;
}

export function ConsultationDashboard({ session }: ConsultationDashboardProps) {
  return (
    <div className="space-y-6">
      {session ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-card dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm text-slate-500 dark:text-slate-400">Signed in as {session.user.email}</p>
          <ConsultationForm session={session} />
        </div>
      ) : (
        <AuthSignIn />
      )}
    </div>
  );
}
