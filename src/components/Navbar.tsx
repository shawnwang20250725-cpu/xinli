"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Heart } from "lucide-react";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/chat", label: "开始倾诉" },
  { href: "/mood", label: "情绪签到" },
  { href: "/toolbox", label: "工具箱" },
  { href: "/about", label: "关于我们" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className="glass-card border-b border-white/40"
        style={{ backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand to-sage flex items-center justify-center shadow-sm">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span
              className="text-lg font-semibold tracking-wide"
              style={{ color: "#2C4A58" }}
            >
              心语
            </span>
            <span
              className="text-xs text-brand-light hidden sm:block mt-0.5"
              style={{ color: "#8BBFBA" }}
            >
              聆听你的内心
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-brand/10 text-brand"
                      : "text-text-muted hover:text-text hover:bg-brand/5"
                  }`}
                  style={{
                    color: isActive ? "#5BA8A0" : "#7A9BAB",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth"
              className="text-sm px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:bg-brand/8"
              style={{ color: "#7A9BAB" }}
            >
              登录
            </Link>
            <Link
              href="/auth?tab=register"
              className="btn-brand text-sm px-5 py-2 rounded-xl font-medium"
            >
              免费注册
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-brand/8 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="菜单"
          >
            {menuOpen ? (
              <X className="w-5 h-5" style={{ color: "#5BA8A0" }} />
            ) : (
              <Menu className="w-5 h-5" style={{ color: "#7A9BAB" }} />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/40 px-5 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive ? "bg-brand/10" : "hover:bg-brand/5"
                  }`}
                  style={{ color: isActive ? "#5BA8A0" : "#7A9BAB" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 flex flex-col gap-2">
              <Link
                href="/auth"
                className="block text-center text-sm px-4 py-2.5 rounded-xl font-medium border"
                style={{ color: "#7A9BAB", borderColor: "rgba(91,168,160,0.25)" }}
                onClick={() => setMenuOpen(false)}
              >
                登录
              </Link>
              <Link
                href="/auth?tab=register"
                className="btn-brand block text-center text-sm px-4 py-2.5 rounded-xl font-medium"
                onClick={() => setMenuOpen(false)}
              >
                免费注册
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
