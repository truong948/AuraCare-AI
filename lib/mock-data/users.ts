export type AppUserRole = "admin" | "user";
export type AppUserStatus = "active" | "suspended";

export interface MockUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: AppUserRole;
  status: AppUserStatus;
  created_at: string;
}

const now = new Date();
const dates = Array.from({ length: 25 }, (_, i) => {
  const d = new Date(now);
  d.setDate(d.getDate() - i * 2); // Spread over the last 50 days
  return d.toISOString();
});

export const mockUsers: MockUser[] = [
  {
    id: "uuid-admin-1",
    email: "admin@auracare.vn",
    full_name: "Nguyễn Văn Trưởng",
    avatar_url: "https://i.pravatar.cc/150?u=admin",
    role: "admin",
    status: "active",
    created_at: dates[24],
  },
  {
    id: "uuid-user-1",
    email: "linh.nguyen@example.com",
    full_name: "Linh Nguyễn",
    avatar_url: "https://i.pravatar.cc/150?u=linh",
    role: "user",
    status: "active",
    created_at: dates[0],
  },
  {
    id: "uuid-user-2",
    email: "an.pham@example.com",
    full_name: "An Phạm",
    avatar_url: "https://i.pravatar.cc/150?u=an",
    role: "user",
    status: "active",
    created_at: dates[1],
  },
  {
    id: "uuid-user-3",
    email: "hoang.vu@example.com",
    full_name: "Hoàng Vũ",
    avatar_url: "https://i.pravatar.cc/150?u=hoang",
    role: "user",
    status: "active",
    created_at: dates[2],
  },
  {
    id: "uuid-user-4",
    email: "tran.minh@example.com",
    full_name: "Trần Minh",
    avatar_url: "https://i.pravatar.cc/150?u=minh",
    role: "user",
    status: "active",
    created_at: dates[3],
  },
  {
    id: "uuid-user-5",
    email: "le.hoa@example.com",
    full_name: "Lê Hoa",
    avatar_url: "https://i.pravatar.cc/150?u=hoa",
    role: "user",
    status: "active",
    created_at: dates[4],
  },
  {
    id: "uuid-user-6",
    email: "nguyen.hai@example.com",
    full_name: "Nguyễn Hải",
    avatar_url: "https://i.pravatar.cc/150?u=hai",
    role: "user",
    status: "active",
    created_at: dates[5],
  },
  {
    id: "uuid-user-7",
    email: "pham.thuy@example.com",
    full_name: "Phạm Thúy",
    avatar_url: "https://i.pravatar.cc/150?u=thuy",
    role: "user",
    status: "suspended",
    created_at: dates[6],
  },
  {
    id: "uuid-user-8",
    email: "dang.nam@example.com",
    full_name: "Đặng Nam",
    avatar_url: "https://i.pravatar.cc/150?u=nam",
    role: "user",
    status: "active",
    created_at: dates[7],
  },
  {
    id: "uuid-user-9",
    email: "bui.ngoc@example.com",
    full_name: "Bùi Ngọc",
    avatar_url: "https://i.pravatar.cc/150?u=ngoc",
    role: "user",
    status: "active",
    created_at: dates[8],
  },
  {
    id: "uuid-user-10",
    email: "ly.tam@example.com",
    full_name: "Lý Tâm",
    avatar_url: "https://i.pravatar.cc/150?u=tam",
    role: "user",
    status: "active",
    created_at: dates[9],
  },
  {
    id: "uuid-user-11",
    email: "do.dat@example.com",
    full_name: "Đỗ Đạt",
    avatar_url: "https://i.pravatar.cc/150?u=dat",
    role: "user",
    status: "active",
    created_at: dates[10],
  },
  {
    id: "uuid-user-12",
    email: "vo.giang@example.com",
    full_name: "Võ Giang",
    avatar_url: "https://i.pravatar.cc/150?u=giang",
    role: "user",
    status: "active",
    created_at: dates[11],
  },
  {
    id: "uuid-user-13",
    email: "ngo.cuong@example.com",
    full_name: "Ngô Cường",
    avatar_url: "https://i.pravatar.cc/150?u=cuong",
    role: "user",
    status: "suspended",
    created_at: dates[12],
  },
  {
    id: "uuid-user-14",
    email: "trinh.thao@example.com",
    full_name: "Trịnh Thảo",
    avatar_url: "https://i.pravatar.cc/150?u=thao",
    role: "user",
    status: "active",
    created_at: dates[13],
  },
  {
    id: "uuid-user-15",
    email: "dinh.tai@example.com",
    full_name: "Đinh Tài",
    avatar_url: "https://i.pravatar.cc/150?u=tai",
    role: "user",
    status: "active",
    created_at: dates[14],
  },
  {
    id: "uuid-user-16",
    email: "chu.lan@example.com",
    full_name: "Chu Lan",
    avatar_url: "https://i.pravatar.cc/150?u=lan",
    role: "user",
    status: "active",
    created_at: dates[15],
  },
  {
    id: "uuid-user-17",
    email: "phan.hung@example.com",
    full_name: "Phan Hùng",
    avatar_url: "https://i.pravatar.cc/150?u=hung",
    role: "user",
    status: "active",
    created_at: dates[16],
  },
  {
    id: "uuid-user-18",
    email: "luu.binh@example.com",
    full_name: "Lưu Bình",
    avatar_url: "https://i.pravatar.cc/150?u=binh",
    role: "user",
    status: "active",
    created_at: dates[17],
  },
  {
    id: "uuid-user-19",
    email: "mac.kieu@example.com",
    full_name: "Mạc Kiều",
    avatar_url: "https://i.pravatar.cc/150?u=kieu",
    role: "user",
    status: "active",
    created_at: dates[18],
  },
  {
    id: "uuid-user-20",
    email: "ho.tuan@example.com",
    full_name: "Hồ Tuấn",
    avatar_url: "https://i.pravatar.cc/150?u=tuan",
    role: "user",
    status: "suspended",
    created_at: dates[19],
  },
  {
    id: "uuid-user-21",
    email: "trang.quynh@example.com",
    full_name: "Trang Quỳnh",
    avatar_url: "https://i.pravatar.cc/150?u=quynh",
    role: "user",
    status: "active",
    created_at: dates[20],
  }
];
