"use client";

import { useState, useTransition } from "react";
import { login, signup } from "./actions";
import { Eye, EyeOff, Sparkles, Lock, Mail, UserPlus, LogIn } from "lucide-react";

type Mode = "login" | "signup";

interface ActionState {
  error?: string;
  success?: string;
}

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, setState] = useState<ActionState>({});
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState({});
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const action = mode === "login" ? login : signup;
      const result = await action(formData);
      // result is only returned on error; redirect happens server-side on success
      if (result?.error) {
        setState({ error: result.error });
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% -10%, rgba(139,92,246,0.18) 0%, transparent 70%), " +
            "radial-gradient(ellipse 60% 50% at 80% 110%, rgba(236,72,153,0.14) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg shadow-violet-500/30">
            <Sparkles className="h-7 w-7 text-white" strokeWidth={1.75} />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              AuraCare <span className="text-violet-400">AI</span>
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {mode === "login"
                ? "Chào mừng bạn trở lại 👋"
                : "Tạo tài khoản của bạn ✨"}
            </p>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl border border-white/[0.07] bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl"
          style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 24px 48px rgba(0,0,0,0.5)" }}
        >
          {/* Tab switcher */}
          <div className="mb-7 flex rounded-xl bg-white/[0.05] p-1 gap-1">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                id={`tab-${m}`}
                onClick={() => { setMode(m); setState({}); }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all duration-200 ${
                  mode === m
                    ? "bg-violet-600 text-white shadow-md shadow-violet-700/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {m === "login" ? (
                  <><LogIn className="h-4 w-4" /> Đăng nhập</>
                ) : (
                  <><UserPlus className="h-4 w-4" /> Đăng ký</>
                )}
              </button>
            ))}
          </div>

          {/* Form */}
          <form id="auth-form" onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="ten@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none ring-violet-500 transition focus:border-violet-500/60 focus:ring-2 focus:ring-offset-0 disabled:opacity-50"
                  disabled={isPending}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder="Ít nhất 8 ký tự"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-2.5 pl-10 pr-11 text-sm text-white placeholder-slate-600 outline-none ring-violet-500 transition focus:border-violet-500/60 focus:ring-2 disabled:opacity-50"
                  disabled={isPending}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (sign-up only) */}
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Nhập lại mật khẩu"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-2.5 pl-10 pr-11 text-sm text-white placeholder-slate-600 outline-none ring-violet-500 transition focus:border-violet-500/60 focus:ring-2 disabled:opacity-50"
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Error message */}
            {state.error && (
              <div
                role="alert"
                id="auth-error"
                className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400"
              >
                {state.error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="auth-submit"
              disabled={isPending}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-700/30 transition-all duration-200 hover:shadow-violet-600/40 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Đang xử lý…
                </span>
              ) : mode === "login" ? (
                "Đăng nhập"
              ) : (
                "Tạo tài khoản"
              )}
            </button>
          </form>

          {/* Footer note */}
          {mode === "signup" && (
            <p className="mt-5 text-center text-xs text-slate-500">
              Sau khi đăng ký, hãy kiểm tra email để xác nhận tài khoản.
            </p>
          )}
        </div>

        {/* Bottom text */}
        <p className="mt-6 text-center text-sm text-slate-500">
          {mode === "login" ? (
            <>
              Chưa có tài khoản?{" "}
              <button
                id="switch-to-signup"
                type="button"
                onClick={() => { setMode("signup"); setState({}); }}
                className="font-semibold text-violet-400 hover:text-violet-300 transition"
              >
                Đăng ký miễn phí
              </button>
            </>
          ) : (
            <>
              Đã có tài khoản?{" "}
              <button
                id="switch-to-login"
                type="button"
                onClick={() => { setMode("login"); setState({}); }}
                className="font-semibold text-violet-400 hover:text-violet-300 transition"
              >
                Đăng nhập
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
