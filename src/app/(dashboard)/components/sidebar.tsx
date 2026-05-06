"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";

interface NavItemProps {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: NavItemProps[];
}

function NavItem({ label, href, icon, children }: NavItemProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = href ? pathname === href : false;

  if (children) {
    return (
      <li>
        <button
          onClick={() => setOpen(!open)}
          className="naabol-btn w-full justify-between"
        >
          <span className="flex items-center gap-2">
            {icon}
            {label}
          </span>
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        {open && (
          <ul className="pl-4 mt-1 space-y-1">
            {children.map((child) => (
              <NavItem key={child.label} {...child} />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link
        href={href ?? "#"}
        className={`naabol-btn w-full justify-start ${isActive ? "naabol-btn-primary" : ""}`}
      >
        {icon}
        {label}
      </Link>
    </li>
  );
}

const NAV_ITEMS: NavItemProps[] = [
  { label: "Dashboard", href: "/" },
  { label: "Usuarios", href: "/usuarios" },
];

export default function Sidebar() {
  return (
    <aside
      className="w-60 shrink-0 border-r border-naabol-gold/10 p-4 flex flex-col gap-4"
      style={{ backgroundColor: "var(--color-naabol-bg-mid)" }}
    >
      <div
        className="text-lg font-bold px-2"
        style={{
          fontFamily: "'Syne', sans-serif",
          color: "var(--color-naabol-gold)",
        }}
      >
        Activ+
      </div>
      <nav>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </ul>
      </nav>
    </aside>
  );
}
