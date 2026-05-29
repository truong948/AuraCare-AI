"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { login, signup } from "./actions";
import { Eye, EyeOff, Sparkles, Lock, Mail, User, UserPlus, LogIn } from "lucide-react";

type Mode = "login" | "signup";

interface ActionState {
  error?: string;
  success?: string;
}

export default function LoginPage() {
  const mountedRef = useRef(false);
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, setState] = useState<ActionState>({});
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState({});
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const action = mode === "login" ? login : signup;
      const result = await action(formData);
      // result is only returned on error; redirect happens server-side on success
      if (!mountedRef.current) {
        return;
      }
      if (result?.error) {
        setState({ error: result.error });
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#f6f4ee] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background blobs (Sage/Teal theme) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% -10%, rgba(13,148,136,0.08) 0%, transparent 70%), " +
            "radial-gradient(ellipse 60% 50% at 80% 110%, rgba(91,140,122,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0d9488] to-[#14b8a6] shadow-lg shadow-teal-500/20">
            <Sparkles className="h-7 w-7 text-white" strokeWidth={1.75} />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-[#0f172a]">
              AuraCare <span className="text-[#0d9488]">AI</span>
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 font-medium">
              {mode === "login"
                ? "Chào mừng bạn trở lại 👋"
                : "Tạo tài khoản của bạn ✨"}
            </p>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-[32px] border border-[#dce6df] bg-white p-8 shadow-[0_24px_48px_rgba(15,23,42,0.04)]"
        >
          {/* Tab switcher */}
          <div className="mb-7 flex rounded-2xl bg-slate-50 p-1.5 gap-1 border border-slate-100">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                id={`tab-${m}`}
                onClick={() => { setMode(m); setState({}); }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                  mode === m
                    ? "bg-[#0d9488] text-white shadow-md shadow-teal-700/20"
                    : "text-slate-500 hover:text-slate-800"
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
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#5b8c7a]">
                  Tên hiển thị
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5b8c7a]" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    minLength={2}
                    autoComplete="name"
                    placeholder="Nguyễn Minh Anh"
                    className="w-full rounded-xl border border-slate-200 bg-[#fbfbfd] py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition disabled:opacity-50"
                    disabled={isPending}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#5b8c7a]">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5b8c7a]" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="ten@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-[#fbfbfd] py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition disabled:opacity-50"
                  disabled={isPending}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#5b8c7a]">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5b8c7a]" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder="Ít nhất 8 ký tự"
                  className="w-full rounded-xl border border-slate-200 bg-[#fbfbfd] py-2.5 pl-10 pr-11 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition disabled:opacity-50"
                  disabled={isPending}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5b8c7a] hover:text-[#0d9488] transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (sign-up only) */}
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#5b8c7a]">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5b8c7a]" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Nhập lại mật khẩu"
                    className="w-full rounded-xl border border-slate-200 bg-[#fbfbfd] py-2.5 pl-10 pr-11 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition disabled:opacity-50"
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5b8c7a] hover:text-[#0d9488] transition"
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
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 font-medium"
              >
                {state.error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="auth-submit"
              disabled={isPending}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#0d9488] to-[#0f766e] py-3 text-sm font-semibold text-white shadow-lg shadow-teal-700/10 transition-all duration-200 hover:shadow-teal-600/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
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
            <p className="mt-5 text-center text-xs text-[#5b8c7a] font-medium bg-[#f8fbfa] py-2.5 px-3 rounded-xl border border-[#e8f2ee]">
              Sau khi đăng ký, hãy kiểm tra email để xác nhận tài khoản.
            </p>
          )}
        </div>

        {/* Bottom text */}
        <p className="mt-6 text-center text-sm text-slate-600 font-medium">
          {mode === "login" ? (
            <>
              Chưa có tài khoản?{" "}
              <button
                id="switch-to-signup"
                type="button"
                onClick={() => { setMode("signup"); setState({}); }}
                className="font-bold text-[#0d9488] hover:text-[#0f766e] transition underline underline-offset-4"
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
                className="font-bold text-[#0d9488] hover:text-[#0f766e] transition underline underline-offset-4"
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
