import { createServerComponentSupabaseClient } from "@/lib/supabase";
import { ConsultationDashboard } from "@/components/consultation-dashboard";

export default async function HomePage() {
  const supabase = createServerComponentSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10">
      <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex flex-col gap-3">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">AuraCare AI</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            Medical-grade skin consultation powered by Supabase and React 19.
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-300">
            Secure session handling, server actions for mutations, and a privacy-first workflow for dermatology intake.
          </p>
        </div>

        <ConsultationDashboard session={session} />
      </section>
    </main>
  );
}
