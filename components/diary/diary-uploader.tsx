"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { saveDiaryEntry } from "@/actions/diary";
import { createBrowserSupabase } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function DiaryUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Vui lòng chọn ảnh để upload.");
      return;
    }

    setIsUploading(true);
    const supabase = createBrowserSupabase();

    const session = await supabase.auth.getSession();
    const userId = session.data?.session?.user?.id;

    if (!userId) {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      setIsUploading(false);
      return;
    }

    const fileName = `${Date.now()}-${file.name}`.replace(/[^a-zA-Z0-9-_.]/g, "_");
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("diary_images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false
      });

    if (uploadError) {
      toast.error(uploadError.message);
      setIsUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("diary_images")
      .getPublicUrl(filePath);

    if (!publicUrlData.publicUrl) {
      toast.error("Không lấy được URL ảnh.");
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("imageUrl", publicUrlData.publicUrl);
    formData.append("notes", notes.trim());

    try {
      await saveDiaryEntry(formData);
      setFile(null);
      setNotes("");
      toast.success("Ảnh đã được lưu vào nhật ký da.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể lưu nhật ký.";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">Thêm mục nhật ký mới</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Upload ảnh da và ghi lại cảm nhận của bạn hôm nay.</p>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="diaryImage">Ảnh</Label>
            <input
              id="diaryImage"
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="diaryNotes">Ghi chú</Label>
            <textarea
              id="diaryNotes"
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-slate-500 dark:focus:ring-slate-800"
              placeholder="Mô tả trạng thái da, cảm nhận hoặc sản phẩm đã dùng hôm nay."
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="button" onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Đang upload…" : "Lưu nhật ký"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
