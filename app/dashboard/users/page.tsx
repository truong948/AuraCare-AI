import Link from "next/link";
import { ShieldCheck, UserCog, UsersRound } from "lucide-react";
import { updateUserAccess } from "@/app/dashboard/users/actions";
import { Button } from "@/components/ui/button";
import { requireAdmin, type AppUserProfile } from "@/lib/auth/roles";

function formatDate(value: string | null) {
  if (!value) {
    return "Chưa có";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function DashboardUsersPage() {
  const { supabase } = await requireAdmin();

  const { data: users, error } = (await (supabase as any)
    .from("profiles")
    .select("id,email,full_name,role,status,created_at,updated_at")
    .order("created_at", { ascending: false })) as {
    data: AppUserProfile[] | null;
    error: Error | null;
  };

  if (error) {
    console.error("Error fetching profiles from Supabase:", error.message);
  }

  const userList = error || !users ? [] : users;
  const totalUsers = userList.length;
  const adminUsers = userList.filter((user) => user.role === "admin").length;
  const suspendedUsers =
    userList.filter((user) => user.status === "suspended").length;

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              User Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Quản trị người dùng
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Tài khoản đăng ký qua Supabase Auth, quyền truy cập được lưu trong
              bảng profiles của cơ sở dữ liệu.
            </p>
          </div>
          <div className="flex h-12 items-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white">
            <ShieldCheck className="h-4 w-4 text-cyan-300" />
            Admin only
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Tổng người dùng", value: totalUsers, icon: UsersRound },
          { label: "Admin", value: adminUsers, icon: ShieldCheck },
          { label: "Tạm khóa", value: suspendedUsers, icon: UserCog },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf4f1] text-[#5b8c7a]">
              <item.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-500">
              {item.label}
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {item.value}
            </p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm shadow-slate-950/5">
        <div className="border-b border-slate-100 px-6 py-5">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Danh sách tài khoản
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Đổi vai trò hoặc trạng thái tài khoản trực tiếp từ database.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-6 py-4">Người dùng</th>
                <th className="px-6 py-4">Vai trò</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Ngày tạo</th>
                <th className="px-6 py-4 text-right">Cập nhật</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userList.map((user) => (
                <tr key={user.id} className="align-middle">
                  <td className="px-6 py-5">
                    <p className="font-semibold text-slate-900">
                      {user.full_name || "Chưa đặt tên"}
                    </p>
                    <p className="mt-1 text-slate-500">{user.email}</p>
                  </td>
                  <td className="px-6 py-5">
                    <form
                      id={`access-${user.id}`}
                      action={updateUserAccess}
                      className="contents"
                    >
                      <input type="hidden" name="profileId" value={user.id} />
                      <select
                        name="role"
                        defaultValue={user.role}
                        className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-900"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </form>
                  </td>
                  <td className="px-6 py-5">
                    <select
                      name="status"
                      form={`access-${user.id}`}
                      defaultValue={user.status}
                      className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-900"
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="px-6 py-5 text-slate-500">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-5 text-right flex justify-end gap-2">
                    <Link href={`/dashboard/users/${user.id}`}>
                      <Button variant="outline" className="rounded-2xl">
                        Chi tiết
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      form={`access-${user.id}`}
                      className="rounded-2xl bg-[#5b8c7a] text-white hover:bg-[#4f7c6d]"
                    >
                      Lưu quyền
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
