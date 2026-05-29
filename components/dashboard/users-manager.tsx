"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, UserCog, UsersRound, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateUserAccess } from "@/app/dashboard/users/actions";
import { type AppUserProfile } from "@/lib/auth/roles";
import { mockUsers } from "@/lib/mock-data/users";

function formatDate(value: string | null) {
  if (!value) return "Chưa có";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function UsersManager({ initialUsers }: { initialUsers: AppUserProfile[] }) {
  const [users, setUsers] = useState<AppUserProfile[]>(initialUsers);

  const totalUsers = users.length;
  const adminUsers = users.filter((user) => user.role === "admin").length;
  const suspendedUsers = users.filter((user) => user.status === "suspended").length;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-teal-600 p-8 text-white shadow-lg shadow-teal-900/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/50 px-3 py-1 text-xs font-semibold text-teal-50 backdrop-blur-md mb-4">
              <ShieldCheck className="h-4 w-4" />
              USER ADMIN
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Quản trị người dùng</h1>
            <p className="mt-2 text-teal-100 max-w-xl">
              Quản lý tài khoản khách hàng và phân quyền hệ thống. Bạn có thể thay đổi vai trò hoặc khóa tài khoản tại đây.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Tổng người dùng", value: totalUsers, icon: UsersRound, color: "text-teal-600", bg: "bg-teal-50" },
          { label: "Admin System", value: adminUsers, icon: ShieldCheck, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Bị tạm khóa", value: suspendedUsers, icon: UserCog, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${item.bg} ${item.color}`}>
              <item.icon className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{item.value}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Danh sách tài khoản</h2>
            <p className="text-sm text-slate-500">Quản lý và cập nhật trạng thái người dùng.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">{users.length} tài khoản</span>
            <Button 
              onClick={() => {
                if(confirm('Nạp dữ liệu mẫu sẽ hiển thị 20+ người dùng mẫu lên màn hình để xem trước giao diện. Bạn có chắc chắn không?')) {
                  // Cast mockUsers to AppUserProfile to ignore missing fields (like updated_at)
                  setUsers(mockUsers as unknown as AppUserProfile[]);
                }
              }} 
              variant="outline" 
              size="sm" 
              className="rounded-full border-teal-200 text-teal-700 hover:bg-teal-50"
            >
              Nạp dữ liệu mẫu
            </Button>
            <Button 
              onClick={() => alert("Chức năng đồng bộ đang bị khóa do chưa có SUPABASE_SERVICE_ROLE_KEY. Vui lòng thêm key vào .env.local để kích hoạt.")} 
              variant="default" 
              size="sm" 
              className="rounded-full bg-teal-600 hover:bg-teal-700 text-white"
            >
              Đồng bộ lên Supabase
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-teal-50/50 text-xs font-semibold text-teal-800 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Phân quyền</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Ngày tham gia</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-100">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.full_name || ""} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-teal-100 text-teal-700">
                            <UserIcon className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{user.full_name || "Chưa đặt tên"}</div>
                        <div className="text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <form id={`access-${user.id}`} action={updateUserAccess} className="contents">
                      <input type="hidden" name="profileId" value={user.id} />
                      <select
                        name="role"
                        defaultValue={user.role}
                        className={`h-9 w-28 rounded-full border px-3 text-xs font-bold ${
                          user.role === "admin" 
                            ? "border-amber-200 bg-amber-50 text-amber-700" 
                            : "border-slate-200 bg-slate-50 text-slate-700"
                        }`}
                      >
                        <option value="user">USER</option>
                        <option value="admin">ADMIN</option>
                      </select>
                    </form>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      name="status"
                      form={`access-${user.id}`}
                      defaultValue={user.status}
                      className={`h-9 w-32 rounded-full border px-3 text-xs font-bold ${
                        user.status === "active"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-rose-200 bg-rose-50 text-rose-700"
                      }`}
                    >
                      <option value="active">Đang HĐ</option>
                      <option value="suspended">Tạm khóa</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/users/${user.id}`}>
                        <Button variant="outline" size="sm" className="rounded-full text-xs font-medium">Chi tiết</Button>
                      </Link>
                      <Button
                        type="submit"
                        form={`access-${user.id}`}
                        size="sm"
                        className="rounded-full bg-teal-600 text-white hover:bg-teal-700 text-xs font-medium"
                      >
                        Lưu
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <UsersRound className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    <p>Chưa có tài khoản nào. Vui lòng chọn "Nạp dữ liệu mẫu" để xem demo.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
