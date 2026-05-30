import { redirect } from "next/navigation";

/**
 * Trang /auth đã được hợp nhất vào /login.
 * Chuyển hướng server-side để đảm bảo không có route cũ nào bị "chết".
 */
export default function AuthRedirectPage() {
  redirect("/login");
}
