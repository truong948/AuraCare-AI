"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function ImageComparison({ beforeImage, afterImage, beforeLabel = "Trước", afterLabel = "Sau" }: ImageComparisonProps) {
  const [ratio, setRatio] = useState(50);

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="text-center text-sm text-slate-600 dark:text-slate-300">{beforeLabel}</div>
        <div className="text-center text-sm text-slate-600 dark:text-slate-300">{afterLabel}</div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
        <img src={beforeImage} alt="Before" className="h-[360px] w-full object-cover" />
        <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${ratio}%` }}>
          <img src={afterImage} alt="After" className="h-[360px] w-full object-cover" />
        </div>
        <div className="absolute inset-x-0 top-1/2 h-px bg-slate-300/70 dark:bg-slate-700/70" />
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={ratio}
        onChange={(event) => setRatio(Number(event.target.value))}
        className={cn(
          "w-full accent-slate-950 focus:outline-none dark:accent-slate-100"
        )}
      />
    </div>
  );
}
