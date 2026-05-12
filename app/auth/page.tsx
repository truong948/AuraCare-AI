"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/actions/auth";

const authText = {
  login: {
    title: "Đăng nhập",
    description: "Quản lý hồ sơ da, nhật ký và quét dấu hiệu với AuraCare AI.",
    submit: "Đăng nhập"
  },
  register: {
    title: "Đăng ký",
    description: "Tạo tài khoản để nhận tư vấn da liễu an toàn và bảo mật.",
    submit: "Đăng ký"
  }
};

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const action = mode === "login" ? signIn : signUp;
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      try {
        const result = await action(formData);
        if (result.success) {
          setSuccess(true);
        } else {
          setError("Lỗi xác thực. Vui lòng thử lại.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi xác thực. Vui lòng thử lại.");
      }
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }

    if (success) {
      const message = mode === "login" ? "Đăng nhập thành công." : "Đăng ký thành công. Xin hãy kiểm tra email để xác nhận.";
      toast.success(message);
      setSuccess(false);
    }
  }, [error, success, mode]);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 py-12 dark:bg-slate-950">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-8 space-y-3 text-center">
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-slate-50">{authText[mode].title}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">{authText[mode].description}</p>
        </div>

        <Form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input id="password" name="password" type="password" required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} />
          </div>

          {mode === "register" ? (
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" />
            </div>
          ) : null}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Đang xử lý…" : authText[mode].submit}
          </Button>
        </Form>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <span>
            {mode === "login" ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
          </span>
          <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")} className="font-semibold text-slate-950 transition hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-300">
            {mode === "login" ? "Đăng ký" : "Đăng nhập"}
          </button>
        </div>
      </div>
    </main>
  );
}
