"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { getUser, removeToken } from "@/lib/auth";

export default function Header() {
  const router = useRouter();
  const user = getUser();

  function handleLogout() {
    removeToken();
    router.replace("/login");
  }

  return (
    <header
      className="h-14 flex items-center justify-between px-6 border-b border-naabol-gold/10"
      style={{ backgroundColor: "var(--color-naabol-bg-mid)" }}
    >
      <div
        className="text-sm"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          color: "var(--color-naabol-white)",
        }}
      >
        {user?.nombre ?? user?.email}
      </div>
      <button onClick={handleLogout} className="naabol-btn naabol-btn-icon">
        <LogOut size={16} />
      </button>
    </header>
  );
}
