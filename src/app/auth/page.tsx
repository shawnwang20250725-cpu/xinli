"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Heart, ArrowRight, Loader2 } from "lucide-react";
import { Suspense } from "react";

function AuthForm() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (searchParams.get("tab") === "register") {
      setTab("register");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-6">🌿</div>
        <h2 className="text-2xl font-semibold mb-3" style={{ color: "#2C4A58" }}>
          {tab === "login" ? "欢迎回来" : "欢迎来到心语"}
        </h2>
        <p className="text-sm mb-8" style={{ color: "#7A9BAB" }}>
          {tab === "login" ? "很高兴你回来了。" : "这里随时都是你的空间。"}
        </p>
        <Link href="/chat" className="btn-brand inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold">
          去开始聊聊 <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Tab */}
      <div className="flex rounded-2xl p-1 gap-1 mb-8"
        style={{ background: "rgba(91,168,160,0.07)", border: "1px solid rgba(91,168,160,0.12)" }}
      >
        {([["login", "登录"], ["register", "注册"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: tab === key ? "white" : "transparent",
              color: tab === key ? "#5BA8A0" : "#7A9BAB",
              boxShadow: tab === key ? "0 2px 8px rgba(44,74,88,0.08)" : "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {tab === "register" && (
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#7A9BAB" }}>
              昵称（可以是任意名字）
            </label>
            <input
              type="text"
              placeholder="你想让我叫你什么？"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3.5 rounded-2xl text-sm input-calm"
              style={{ background: "rgba(91,168,160,0.04)", color: "#2C4A58" }}
              required={tab === "register"}
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#7A9BAB" }}>邮箱</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3.5 rounded-2xl text-sm input-calm"
            style={{ background: "rgba(91,168,160,0.04)", color: "#2C4A58" }}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#7A9BAB" }}>密码</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={tab === "register" ? "至少 8 位，建议包含字母和数字" : "输入你的密码"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3.5 pr-12 rounded-2xl text-sm input-calm"
              style={{ background: "rgba(91,168,160,0.04)", color: "#2C4A58" }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showPassword
                ? <EyeOff className="w-4 h-4" style={{ color: "#A8BFC9" }} />
                : <Eye className="w-4 h-4" style={{ color: "#A8BFC9" }} />
              }
            </button>
          </div>
        </div>

        {tab === "login" && (
          <div className="text-right">
            <button type="button" className="text-xs" style={{ color: "#A8BFC9" }}>
              忘记密码？
            </button>
          </div>
        )}

        {tab === "register" && (
          <p className="text-xs leading-relaxed" style={{ color: "#A8BFC9" }}>
            注册即表示你同意
            <Link href="/safety#terms" className="underline underline-offset-2 mx-1" style={{ color: "#5BA8A0" }}>服务条款</Link>
            和
            <Link href="/safety#privacy" className="underline underline-offset-2 ml-1" style={{ color: "#5BA8A0" }}>隐私政策</Link>。
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-brand py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> 处理中…</>
          ) : tab === "login" ? "登录" : "创建账户"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 divider-soft" />
        <span className="text-xs" style={{ color: "#A8BFC9" }}>或者</span>
        <div className="flex-1 divider-soft" />
      </div>

      {/* Guest mode */}
      <Link href="/chat"
        className="w-full block text-center py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 hover:bg-brand/8"
        style={{ border: "1.5px solid rgba(91,168,160,0.2)", color: "#5BA8A0" }}
      >
        匿名体验（不保存记录）
      </Link>
    </>
  );
}

export default function AuthPage() {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-3xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#5BA8A0,#84C5AB)", boxShadow: "0 8px 24px rgba(91,168,160,0.3)" }}
            >
              <Heart className="w-7 h-7 text-white fill-white" />
            </div>
            <span className="text-xl font-semibold" style={{ color: "#2C4A58" }}>心语</span>
          </Link>
          <p className="mt-3 text-sm" style={{ color: "#7A9BAB" }}>
            你的专属情绪空间，随时等着你
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8">
          <Suspense fallback={<div className="h-40 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#5BA8A0" }} />
          </div>}>
            <AuthForm />
          </Suspense>
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: "#A8BFC9" }}>
          心语不是医疗平台 · 如有紧急需要请拨打
          <a href="tel:400-161-9995" className="ml-1 font-medium" style={{ color: "#5BA8A0" }}>400-161-9995</a>
        </p>
      </div>
    </div>
  );
}
