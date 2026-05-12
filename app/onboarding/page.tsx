"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createSkinProfile } from "@/actions/profile";

const skinTypes = [
  { value: "oily", label: "Da dầu" },
  { value: "dry", label: "Da khô" },
  { value: "combination", label: "Da hỗn hợp" },
  { value: "sensitive", label: "Da nhạy cảm" },
  { value: "normal", label: "Da thường" }
] as const;

const skinConcerns = [
  "Mụn",
  "Lỗ chân lông to",
  "Lão hóa",
  "Thâm nám",
  "Da không đều màu"
];

const allergyOptions = [
  "Hương liệu",
  "Paraben",
  "Cồn",
  "Tinh dầu citrus",
  "Không có"
];

export default function OnboardingPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(0);
  const [skinType, setSkinType] = useState<string>(skinTypes[0].value);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      try {
        const result = await createSkinProfile(formData);
        if (result.success) {
          setSuccess(true);
        } else {
          setError("Không thể lưu thông tin da.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể lưu thông tin da.");
      }
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }

    if (success) {
      toast.success("Thông tin da đã được lưu. Chuyển về dashboard.");
      router.push("/dashboard");
      setSuccess(false);
    }
  }, [error, success, router]);

  const progress = useMemo(() => ((step + 1) / 3) * 100, [step]);

  const toggleConcern = (value: string) => {
    setConcerns((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );
  };

  const toggleAllergy = (value: string) => {
    setAllergies((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Onboarding</p>
            <h1 className="text-3xl font-semibold text-slate-950 dark:text-slate-50">Khởi tạo hồ sơ da của bạn</h1>
            <p className="text-slate-600 dark:text-slate-300">Trả lời vài câu hỏi nhanh để AuraCare AI cá nhân hóa lộ trình chăm sóc da.</p>
          </div>
          <div className="mt-6">
            <Progress value={progress} />
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Bước {step + 1} trên 3</p>
          </div>
        </div>

        <Form onSubmit={handleSubmit} className="space-y-6">
          <Card className={step === 0 ? "block" : "hidden"}>
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">Loại da của bạn</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Chọn một loại da phù hợp nhất với bạn.</p>
              </div>
              <RadioGroup value={skinType} onValueChange={setSkinType} className="grid gap-3 md:grid-cols-2">
                {skinTypes.map((item) => (
                  <div key={item.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={item.value} id={item.value} />
                    <Label htmlFor={item.value}>{item.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </Card>

          <Card className={step === 1 ? "block" : "hidden"}>
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">Mối quan tâm về da</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Chọn các vấn đề bạn muốn cải thiện.</p>
              </div>
              <div className="grid gap-3">
                {skinConcerns.map((concern) => (
                  <div key={concern} className="flex items-center space-x-2">
                    <Checkbox
                      id={concern}
                      checked={concerns.includes(concern)}
                      onCheckedChange={() => toggleConcern(concern)}
                    />
                    <Label htmlFor={concern}>{concern}</Label>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className={step === 2 ? "block" : "hidden"}>
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">Dị ứng và kích ứng</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Chọn những thành phần hoặc chất bạn dị ứng.</p>
              </div>
              <div className="grid gap-3">
                {allergyOptions.map((allergy) => (
                  <div key={allergy} className="flex items-center space-x-2">
                    <Checkbox
                      id={allergy}
                      checked={allergies.includes(allergy)}
                      onCheckedChange={() => toggleAllergy(allergy)}
                    />
                    <Label htmlFor={allergy}>{allergy}</Label>
                  </div>
                ))}
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                <p>Gợi ý: nếu bạn không dị ứng thành phần nào, hãy chọn "Không có".</p>
              </div>
            </div>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              disabled={step === 0}
            >
              Quay lại
            </Button>

            {step < 2 ? (
              <Button type="button" className="w-full sm:w-auto" onClick={() => setStep((current) => Math.min(2, current + 1))}>
                Tiếp theo
              </Button>
            ) : (
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? "Đang lưu…" : "Hoàn tất và chuyển đến dashboard"}
              </Button>
            )}
          </div>
        </Form>
      </div>
    </main>
  );
}
