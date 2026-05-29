/**
 * Script: Đồng bộ tài khoản mẫu lên Supabase Auth + Profiles
 * 
 * Yêu cầu: Thêm SUPABASE_SERVICE_ROLE_KEY vào file .env.local
 * Chạy: node scripts/seed-supabase-users.mjs
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function parseDotEnv() {
  try {
    const raw = readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
    return Object.fromEntries(
      raw
        .split(/\r?\n/)
        .map((line) => line.match(/^\s*([^#=]+)=(.*)$/))
        .filter(Boolean)
        .map((match) => [match[1].trim(), match[2].trim().replace(/^['"]|['"]$/g, "")])
    );
  } catch {
    return {};
  }
}

function requiredEnv(name, env) {
  const value = process.env[name] ?? env[name];
  if (!value || /your_|placeholder|example|changeme/i.test(value)) {
    throw new Error(`Missing ${name}. Add it to .env.local before seeding.`);
  }
  return value;
}

const mockUsers = [
  { email: "linh.nguyen@auracare.vn", full_name: "Linh Nguyễn", avatar_url: "https://i.pravatar.cc/150?u=linh", role: "user", status: "active" },
  { email: "an.pham@auracare.vn", full_name: "An Phạm", avatar_url: "https://i.pravatar.cc/150?u=an", role: "user", status: "active" },
  { email: "hoang.vu@auracare.vn", full_name: "Hoàng Vũ", avatar_url: "https://i.pravatar.cc/150?u=hoang", role: "user", status: "active" },
  { email: "tran.minh@auracare.vn", full_name: "Trần Minh", avatar_url: "https://i.pravatar.cc/150?u=minh", role: "user", status: "active" },
  { email: "le.hoa@auracare.vn", full_name: "Lê Hoa", avatar_url: "https://i.pravatar.cc/150?u=hoa", role: "user", status: "active" },
  { email: "nguyen.hai@auracare.vn", full_name: "Nguyễn Hải", avatar_url: "https://i.pravatar.cc/150?u=hai", role: "user", status: "active" },
  { email: "pham.thuy@auracare.vn", full_name: "Phạm Thúy", avatar_url: "https://i.pravatar.cc/150?u=thuy", role: "user", status: "suspended" },
  { email: "dang.nam@auracare.vn", full_name: "Đặng Nam", avatar_url: "https://i.pravatar.cc/150?u=nam", role: "user", status: "active" },
  { email: "bui.ngoc@auracare.vn", full_name: "Bùi Ngọc", avatar_url: "https://i.pravatar.cc/150?u=ngoc", role: "user", status: "active" },
  { email: "ly.tam@auracare.vn", full_name: "Lý Tâm", avatar_url: "https://i.pravatar.cc/150?u=tam", role: "user", status: "active" },
  { email: "do.dat@auracare.vn", full_name: "Đỗ Đạt", avatar_url: "https://i.pravatar.cc/150?u=dat", role: "user", status: "active" },
  { email: "vo.giang@auracare.vn", full_name: "Võ Giang", avatar_url: "https://i.pravatar.cc/150?u=giang", role: "user", status: "active" },
  { email: "ngo.cuong@auracare.vn", full_name: "Ngô Cường", avatar_url: "https://i.pravatar.cc/150?u=cuong", role: "user", status: "suspended" },
  { email: "trinh.thao@auracare.vn", full_name: "Trịnh Thảo", avatar_url: "https://i.pravatar.cc/150?u=thao", role: "user", status: "active" },
  { email: "dinh.tai@auracare.vn", full_name: "Đinh Tài", avatar_url: "https://i.pravatar.cc/150?u=tai", role: "user", status: "active" },
  { email: "chu.lan@auracare.vn", full_name: "Chu Lan", avatar_url: "https://i.pravatar.cc/150?u=lan", role: "user", status: "active" },
  { email: "phan.hung@auracare.vn", full_name: "Phan Hùng", avatar_url: "https://i.pravatar.cc/150?u=hung", role: "user", status: "active" },
  { email: "luu.binh@auracare.vn", full_name: "Lưu Bình", avatar_url: "https://i.pravatar.cc/150?u=binh", role: "user", status: "active" },
  { email: "mac.kieu@auracare.vn", full_name: "Mạc Kiều", avatar_url: "https://i.pravatar.cc/150?u=kieu", role: "user", status: "active" },
  { email: "ho.tuan@auracare.vn", full_name: "Hồ Tuấn", avatar_url: "https://i.pravatar.cc/150?u=tuan", role: "user", status: "suspended" },
  { email: "trang.quynh@auracare.vn", full_name: "Trang Quỳnh", avatar_url: "https://i.pravatar.cc/150?u=quynh", role: "user", status: "active" },
];

const DEFAULT_PASSWORD = "AuraCare@2026";

async function main() {
  const env = parseDotEnv();
  const supabaseUrl = requiredEnv("NEXT_PUBLIC_SUPABASE_URL", env);
  const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY", env);

  // Use service_role key to bypass RLS
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`\n🚀 Bắt đầu đồng bộ ${mockUsers.length} tài khoản mẫu lên Supabase...\n`);

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const user of mockUsers) {
    try {
      // Step 1: Create auth user via Admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: DEFAULT_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: user.full_name },
      });

      if (authError) {
        if (authError.message.includes("already been registered") || authError.message.includes("already exists")) {
          console.log(`⏭️  ${user.email} — đã tồn tại, bỏ qua.`);
          skipped++;

          // Still update the profile for existing users
          const { data: existingUsers } = await supabase.auth.admin.listUsers();
          const existing = existingUsers?.users?.find((u) => u.email === user.email);
          if (existing) {
            await supabase.from("profiles").upsert({
              id: existing.id,
              email: user.email,
              full_name: user.full_name,
              avatar_url: user.avatar_url,
              role: user.role,
              status: user.status,
            }, { onConflict: "id" });
          }
          continue;
        }
        throw authError;
      }

      // Step 2: Update the profile row (trigger may have created it)
      const userId = authData.user.id;
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userId,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        role: user.role,
        status: user.status,
      }, { onConflict: "id" });

      if (profileError) {
        console.warn(`⚠️  ${user.email} — tạo Auth OK, nhưng cập nhật Profile thất bại: ${profileError.message}`);
      }

      console.log(`✅ ${user.email} — ${user.full_name} (${user.role}/${user.status})`);
      success++;
    } catch (err) {
      console.error(`❌ ${user.email} — thất bại: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Kết quả: ${success} thành công, ${skipped} bỏ qua, ${failed} thất bại.`);
  console.log(`🔑 Mật khẩu chung cho tất cả tài khoản mẫu: ${DEFAULT_PASSWORD}\n`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
