"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    toast.error(error?.message ?? "Something went wrong.");
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-10">
      <div className="w-full rounded-3xl border border-red-200 bg-white p-10 text-center shadow-card dark:border-red-800 dark:bg-slate-950">
        <h1 className="text-3xl font-semibold text-slate-950 dark:text-slate-50">Uh-oh, something failed.</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">Our team is already working on it. Try refreshing the page.</p>
        <button onClick={() => reset()} className="mt-8 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200">
          Retry
        </button>
      </div>
    </main>
  );
}
