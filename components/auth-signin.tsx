"use client";

import { useState, useEffect, useTransition } from "react";
import { toast } from "react-hot-toast";
import { signIn } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function AuthSignIn() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      try {
        const result = await signIn(formData);
        if (result.success) {
          setSuccess(true);
        } else {
          setError("Unable to sign in.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to sign in.");
      }
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
    if (success) {
      toast.success("Signed in successfully.");
      setSuccess(false);
    }
  }, [error, success]);

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">Secure sign in</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Authenticate with email and password to start your skin consultation.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
          <input name="email" type="email" required className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-slate-500 dark:focus:ring-slate-800" />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
          <input name="password" type="password" required minLength={8} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-slate-500 dark:focus:ring-slate-800" />
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
