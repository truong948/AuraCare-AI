"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { AlertTriangle, Camera, CheckCircle2, ImagePlus, Loader2, RotateCcw, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMockPrice } from "@/lib/mock-data/catalog";
import type { ScanApiResponse } from "@/types/scan";

const MAX_IMAGE_WIDTH = 960;

async function fetchScanResult(payload: { imageDataUrl?: string; imageUrl?: string }) {
  const response = await fetch("/api/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || "Không thể phân tích hình ảnh.");
  }

  return body as ScanApiResponse;
}

function resizeImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Không thể đọc file ảnh."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("File ảnh không hợp lệ."));
      image.onload = () => {
        const scale = Math.min(1, MAX_IMAGE_WIDTH / image.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Trình duyệt không hỗ trợ xử lý ảnh."));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.86));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function confidenceLabel(value?: string) {
  if (value === "high") return "Cao";
  if (value === "medium") return "Trung bình";
  return "Thấp";
}

export default function ScanShell() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [preview, setPreview] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [result, setResult] = useState<ScanApiResponse | null>(null);
  const [error, setError] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const startCamera = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
    } catch {
      setError("Không thể mở camera. Bạn có thể tải ảnh từ máy hoặc dán URL ảnh để quét.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsCameraOn(false);
  };

  const captureFrame = () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) {
      setError("Camera chưa sẵn sàng, vui lòng thử lại sau vài giây.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 960;
    canvas.height = video.videoHeight || 720;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.86);
    setPreview(dataUrl);
    setImageDataUrl(dataUrl);
    setImageUrl("");
    setResult(null);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file ảnh hợp lệ.");
      return;
    }

    setError("");
    const dataUrl = await resizeImageFile(file);
    setPreview(dataUrl);
    setImageDataUrl(dataUrl);
    setImageUrl("");
    setResult(null);
  };

  const handleUrlChange = (value: string) => {
    setImageUrl(value);
    setImageDataUrl("");
    setPreview(value);
    setResult(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!imageDataUrl && !imageUrl) {
      setError("Vui lòng chụp ảnh, tải ảnh hoặc dán URL ảnh trước khi quét.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await fetchScanResult({ imageDataUrl, imageUrl });
      setResult(response);
    } catch (scanError) {
      setError(scanError instanceof Error ? scanError.message : "Không thể phân tích hình ảnh.");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetScan = () => {
    setPreview("");
    setImageDataUrl("");
    setImageUrl("");
    setResult(null);
    setError("");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[32px] border border-[#d7e5df] bg-white p-6 shadow-[0_16px_34px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#5b8c7a]">AI Skin Scan</p>
            <h2 className="mt-3 text-3xl font-bold text-[#0f172a]">Chụp hoặc tải ảnh da để AI đánh giá</h2>
            <p className="mt-3 text-sm leading-7 text-[#64748b]">
              Ảnh sẽ được gửi tới API nội bộ. Khi có Gemini API key thật, hệ thống dùng Gemini Vision để phân tích dấu hiệu nhìn thấy và gợi ý sản phẩm phù hợp.
            </p>
          </div>

          <div className="overflow-hidden rounded-[30px] border border-[#dce6df] bg-[#f8fbfa]">
            <div className="relative aspect-[4/3] bg-slate-950">
              {isCameraOn ? (
                <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
              ) : preview ? (
                <img src={preview} alt="Ảnh da cần phân tích" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-white/70">
                  <div>
                    <ImagePlus className="mx-auto h-12 w-12" />
                    <p className="mt-4 text-lg font-semibold text-white">Chưa có ảnh</p>
                    <p className="mt-2 text-sm">Bật camera, chụp ảnh hoặc tải ảnh từ máy để bắt đầu.</p>
                  </div>
                </div>
              )}

              <div className="pointer-events-none absolute inset-5 rounded-[26px] border border-white/30" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />
            </div>

            <div className="flex flex-wrap gap-3 border-t border-[#dce6df] bg-white p-4">
              <Button type="button" onClick={isCameraOn ? stopCamera : startCamera} className="rounded-2xl bg-[#5b8c7a] text-white hover:bg-[#4f7c6d]">
                <Camera className="mr-2 h-4 w-4" />
                {isCameraOn ? "Tắt camera" : "Bật camera"}
              </Button>
              <Button type="button" onClick={captureFrame} disabled={!isCameraOn} variant="outline" className="rounded-2xl border-[#d7e5df]">
                Chụp ảnh
              </Button>
              <label className="inline-flex cursor-pointer items-center rounded-2xl border border-[#d7e5df] bg-white px-4 py-2 text-sm font-semibold text-[#334155] hover:bg-[#f8fbfa]">
                <Upload className="mr-2 h-4 w-4" />
                Tải ảnh
                <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="sr-only" />
              </label>
              <Button type="button" onClick={resetScan} variant="ghost" className="rounded-2xl">
                <RotateCcw className="mr-2 h-4 w-4" />
                Làm lại
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-[#475569]">
              Hoặc dán URL ảnh da
              <input
                value={imageUrl}
                onChange={(event) => handleUrlChange(event.target.value)}
                placeholder="https://.../skin-photo.jpg"
                className="h-12 rounded-2xl border border-[#d7e5df] bg-[#fbfcfa] px-4 text-sm text-[#0f172a] outline-none transition focus:border-[#5b8c7a]"
              />
            </label>

            {error ? (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <Button type="submit" disabled={isLoading || (!imageDataUrl && !imageUrl)} className="h-12 rounded-2xl bg-[#e8a950] font-semibold text-slate-950 hover:bg-[#d59c48]">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  AI đang phân tích...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Phân tích da và gợi ý sản phẩm
                </>
              )}
            </Button>
          </form>
        </div>
      </section>

      <section className="space-y-6">
        <div className="rounded-[32px] border border-[#d7e5df] bg-white p-6 shadow-[0_16px_34px_rgba(15,23,42,0.05)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">Kết quả AI</p>
          <h2 className="mt-2 text-2xl font-bold text-[#0f172a]">Đánh giá tham khảo</h2>
          <p className="mt-3 text-sm leading-7 text-[#64748b]">
            AI chỉ hỗ trợ quan sát dấu hiệu bề mặt và gợi ý sản phẩm chăm sóc da. Không dùng kết quả này thay cho chẩn đoán y khoa.
          </p>
        </div>

        {!result ? (
          <div className="rounded-[30px] border border-dashed border-[#d7e5df] bg-white p-8 text-center text-sm text-[#64748b]">
            Chưa có kết quả. Hãy chụp/tải ảnh rồi bấm phân tích.
          </div>
        ) : (
          <div className="space-y-6">
            <section className="rounded-[30px] border border-[#d7e5df] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#edf4f1] px-3 py-1 text-xs font-semibold text-[#4f7c6d]">
                  {result.source === "gemini-vision" ? "Gemini Vision" : "Demo fallback"}
                </span>
                <span className="rounded-full bg-[#fff9ee] px-3 py-1 text-xs font-semibold text-[#8e6423]">
                  Độ tin cậy: {confidenceLabel(result.ai.confidence)}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#0f172a]">{result.ai.diagnosis}</h3>
              <p className="mt-3 text-sm leading-7 text-[#475569]">{result.ai.recommendations}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#f8fbfa] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Dấu hiệu nhận diện</p>
                  <p className="mt-2 text-sm leading-6 text-[#334155]">{result.ai.symptoms.join(", ") || "Không xác định"}</p>
                </div>
                <div className="rounded-2xl bg-[#f8fbfa] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Mức độ</p>
                  <p className="mt-2 text-sm font-semibold text-[#334155]">{result.ai.severity}</p>
                </div>
              </div>

              {result.ai.carePlan?.length ? (
                <div className="mt-5 rounded-2xl border border-[#dce6df] bg-[#fbfcfa] p-4">
                  <p className="text-sm font-semibold text-[#0f172a]">Gợi ý chăm sóc ngắn</p>
                  <div className="mt-3 grid gap-2">
                    {result.ai.carePlan.map((step) => (
                      <div key={step} className="flex gap-2 text-sm leading-6 text-[#475569]">
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#5b8c7a]" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-5 rounded-2xl border border-[#f1e3c5] bg-[#fff9ee] p-4 text-sm leading-7 text-[#7b5a23]">
                {result.disclaimer}
              </div>
            </section>

            <section className="rounded-[30px] border border-[#d7e5df] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">Sản phẩm phù hợp</p>
                  <h3 className="mt-2 text-2xl font-bold text-[#0f172a]">Gợi ý từ catalog AuraCare</h3>
                </div>
                <Link href="/products" className="text-sm font-semibold text-[#5b8c7a]">
                  Xem catalog
                </Link>
              </div>

              <div className="mt-5 grid gap-4">
                {result.products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="grid gap-4 rounded-[24px] border border-[#dce6df] bg-[#fbfcfa] p-4 transition hover:-translate-y-0.5 hover:bg-white sm:grid-cols-[96px_1fr]"
                  >
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="h-24 w-24 rounded-2xl bg-white object-contain p-2" />
                    ) : null}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#edf4f1] px-3 py-1 text-xs font-semibold text-[#5b8c7a]">
                          Score {product.score.toFixed(2)}
                        </span>
                        {product.price ? (
                          <span className="text-sm font-semibold text-[#0f172a]">{formatMockPrice(product.price)}</span>
                        ) : null}
                      </div>
                      <h4 className="mt-2 line-clamp-2 font-bold text-[#0f172a]">{product.name}</h4>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#64748b]">{product.description}</p>
                      <p className="mt-2 text-sm leading-6 text-[#4f7c6d]">{product.reason}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        )}
      </section>
    </div>
  );
}
