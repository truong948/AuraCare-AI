"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { createConsultation } from "@/actions/consultation";
import { Button } from "@/components/ui/button";
import type { Session } from "@supabase/supabase-js";

interface ConsultationFormProps {
  session: Session;
}

export function ConsultationForm({ session }: ConsultationFormProps) {
  const action = async (formData: FormData) => createConsultation(formData, session.user.id);
  const mountedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      try {
        const result = await action(formData);
        if (!mountedRef.current) {
          return;
        }
        if (result.success) {
          setSuccess(true);
        } else {
          setError("Failed to submit consultation.");
        }
      } catch (err) {
        if (!mountedRef.current) {
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to submit consultation.");
      }
    });
  };

  useEffect(() => {
    if (!mountedRef.current) {
      return;
    }

    if (error) {
      toast.error(error);
      setError(null);
    }
    if (success) {
      toast.success("Consultation request submitted.");
      setSuccess(false);
    }
  }, [error, success]);

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-card dark:border-slate-800 dark:bg-slate-950">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">Start your consultation</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Share your skin concern and our AI-assisted workflow will prepare the report securely.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Skin concern</label>
          <input name="skin_concern" required className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-slate-500 dark:focus:ring-slate-800" placeholder="E.g. acne, redness, texture" />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Detailed description</label>
          <textarea name="description" rows={6} required className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-slate-500 dark:focus:ring-slate-800" placeholder="Describe your current regimen, symptoms, and previous treatments."></textarea>
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Submitting…" : "Submit consultation"}
        </Button>
      </form>
    </div>
  );
}
