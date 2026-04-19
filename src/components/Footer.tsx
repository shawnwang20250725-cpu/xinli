import Link from "next/link";
import { Heart, Shield, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto" style={{ background: "rgba(44,74,88,0.04)", borderTop: "1px solid rgba(91,168,160,0.12)" }}>
      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-brand to-sage flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 text-white fill-white" />
              </div>
              <span className="text-base font-semibold" style={{ color: "#2C4A58" }}>心语</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#7A9BAB" }}>
              一个温柔的倾听空间。<br />
              当你需要说说话的时候，<br />
              我们在这里。
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: "#2C4A58" }}>功能</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/chat", label: "开始倾诉" },
                { href: "/mood", label: "情绪签到" },
                { href: "/toolbox", label: "情绪工具箱" },
                { href: "/profile", label: "我的记录" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-brand"
                    style={{ color: "#7A9BAB" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: "#2C4A58" }}>了解我们</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/about", label: "关于心语" },
                { href: "/safety", label: "安全说明" },
                { href: "/about#faq", label: "常见问题" },
                { href: "/about#join", label: "咨询师入驻" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-brand"
                    style={{ color: "#7A9BAB" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Crisis */}
          <div>
            <h4 className="text-sm font-semibold mb-4 flex items-center gap-1.5" style={{ color: "#2C4A58" }}>
              <Shield className="w-3.5 h-3.5" style={{ color: "#5BA8A0" }} />
              紧急求助
            </h4>
            <div
              className="rounded-2xl p-4 space-y-2.5"
              style={{ background: "rgba(91,168,160,0.07)", border: "1px solid rgba(91,168,160,0.15)" }}
            >
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#5BA8A0" }} />
                <div>
                  <p className="text-xs font-medium" style={{ color: "#2C4A58" }}>北京心理危机研究</p>
                  <p className="text-sm font-bold" style={{ color: "#5BA8A0" }}>010-82951332</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#5BA8A0" }} />
                <div>
                  <p className="text-xs font-medium" style={{ color: "#2C4A58" }}>全国心理援助热线</p>
                  <p className="text-sm font-bold" style={{ color: "#5BA8A0" }}>400-161-9995</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="divider-soft mb-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "#A8BFC9" }}>
            © 2025 心语. 保留所有权利。
            <span className="mx-2">·</span>
            心语不是医疗平台，不提供诊断或治疗服务。
          </p>
          <div className="flex items-center gap-4">
            <Link href="/safety#privacy" className="text-xs transition-colors hover:text-brand" style={{ color: "#A8BFC9" }}>隐私政策</Link>
            <Link href="/safety#terms" className="text-xs transition-colors hover:text-brand" style={{ color: "#A8BFC9" }}>服务条款</Link>
            <Link href="/safety" className="text-xs transition-colors hover:text-brand" style={{ color: "#A8BFC9" }}>安全说明</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
