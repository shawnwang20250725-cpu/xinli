"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  TrendingUp,
  Calendar,
  Settings,
  LogOut,
  Download,
  Trash2,
  ChevronRight,
  Heart,
  Shield,
  Bell,
} from "lucide-react";

const mockChats = [
  { id: 1, date: "今天 20:15", preview: "今天又加班到很晚，好累，感觉撑不住了…", turns: 12, mood: "😔" },
  { id: 2, date: "昨天 23:42", preview: "我最近很焦虑，脑子里总是停不下来…", turns: 8, mood: "😰" },
  { id: 3, date: "4月16日 22:10", preview: "和朋友吵架了，感觉很委屈，不知道是不是我的问题…", turns: 15, mood: "😢" },
  { id: 4, date: "4月14日 09:30", preview: "今天心情还不错，只是有点小事想聊聊…", turns: 6, mood: "🙂" },
  { id: 5, date: "4月12日 21:05", preview: "失眠已经第三天了，白天昏昏沉沉的…", turns: 10, mood: "😶" },
];

const weeklyMood = [3, 7, 5, 2, 8, 4, 6];
const weekLabels = ["一", "二", "三", "四", "五", "六", "日"];

const stats = [
  { label: "累计对话", value: "47", unit: "次", icon: "💬", color: "#5BA8A0" },
  { label: "情绪签到", value: "23", unit: "天", icon: "📝", color: "#7BB3D4" },
  { label: "使用工具", value: "8", unit: "次", icon: "🧘", color: "#84C5AB" },
  { label: "连续打卡", value: "5", unit: "天", icon: "🔥", color: "#E8856D" },
];

const settingGroups = [
  {
    title: "账户",
    items: [
      { icon: <Shield className="w-4 h-4" />, label: "隐私设置", sub: "数据导出、删除账户" },
      { icon: <Bell className="w-4 h-4" />, label: "通知提醒", sub: "每日签到提醒" },
      { icon: <Download className="w-4 h-4" />, label: "导出我的数据", sub: "下载聊天记录和情绪报告" },
    ],
  },
  {
    title: "危险操作",
    items: [
      { icon: <Trash2 className="w-4 h-4" />, label: "清空聊天记录", sub: "此操作不可撤销", danger: true },
    ],
  },
];

type ProfileTab = "overview" | "chats" | "mood" | "settings";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

  const tabs: { key: ProfileTab; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "概览", icon: <Heart className="w-4 h-4" /> },
    { key: "chats", label: "聊天记录", icon: <MessageCircle className="w-4 h-4" /> },
    { key: "mood", label: "情绪报告", icon: <TrendingUp className="w-4 h-4" /> },
    { key: "settings", label: "设置", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-5 py-10">

        {/* Profile header */}
        <div className="glass-card rounded-3xl p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#EEF8F7,#D4EEEC)" }}
          >
            🌿
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-semibold mb-1" style={{ color: "#2C4A58" }}>晨晨</h1>
            <p className="text-sm mb-3" style={{ color: "#7A9BAB" }}>chenchen@example.com</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              <span className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: "rgba(91,168,160,0.12)", color: "#5BA8A0" }}
              >
                已加入 68 天
              </span>
              <span className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: "rgba(245,166,125,0.12)", color: "#E8856D" }}
              >
                🔥 连续打卡 5 天
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/chat">
              <button className="btn-brand px-5 py-2.5 rounded-xl text-sm font-semibold">
                开始对话
              </button>
            </Link>
            <button className="p-2.5 rounded-xl transition-colors hover:bg-brand/8"
              style={{ border: "1px solid rgba(91,168,160,0.2)" }}
            >
              <LogOut className="w-4 h-4" style={{ color: "#A8BFC9" }} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-2xl"
          style={{ background: "rgba(91,168,160,0.06)", border: "1px solid rgba(91,168,160,0.12)" }}
        >
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200"
              style={{
                background: activeTab === t.key ? "white" : "transparent",
                color: activeTab === t.key ? "#5BA8A0" : "#7A9BAB",
                boxShadow: activeTab === t.key ? "0 2px 8px rgba(44,74,88,0.08)" : "none",
              }}
            >
              {t.icon}
              <span className="hidden sm:block">{t.label}</span>
            </button>
          ))}
        </div>

        {/* ===== OVERVIEW ===== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <div key={i} className="soft-card rounded-2xl p-5 text-center">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="text-2xl font-bold mb-0.5" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs" style={{ color: "#A8BFC9" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* This week's mood */}
            <div className="soft-card rounded-3xl p-6">
              <h3 className="text-base font-semibold mb-5" style={{ color: "#2C4A58" }}>
                <Calendar className="w-4 h-4 inline mr-2" style={{ color: "#5BA8A0" }} />
                本周情绪
              </h3>
              <div className="flex items-end gap-2 h-24 mb-3">
                {weeklyMood.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-xl transition-all duration-500"
                      style={{
                        height: `${(v / 10) * 80}px`,
                        background: v >= 7 ? "linear-gradient(to top,#5BA8A0,#84C5AB)" : v >= 4 ? "linear-gradient(to top,#7BB3D4,#B8D9EE)" : "rgba(168,191,201,0.35)",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                {weekLabels.map((d, i) => (
                  <div key={i} className="flex-1 text-center text-xs" style={{ color: "#A8BFC9" }}>{d}</div>
                ))}
              </div>
            </div>

            {/* Recent chats */}
            <div className="soft-card rounded-3xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold" style={{ color: "#2C4A58" }}>最近的对话</h3>
                <button onClick={() => setActiveTab("chats")} className="text-xs" style={{ color: "#5BA8A0" }}>
                  查看全部 →
                </button>
              </div>
              <div className="space-y-3">
                {mockChats.slice(0, 3).map((chat) => (
                  <div key={chat.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all hover:bg-brand/4"
                    style={{ border: "1px solid rgba(91,168,160,0.08)" }}
                  >
                    <span className="text-xl flex-shrink-0">{chat.mood}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs mb-0.5" style={{ color: "#A8BFC9" }}>{chat.date}</p>
                      <p className="text-sm truncate" style={{ color: "#2C4A58" }}>{chat.preview}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs" style={{ color: "#A8BFC9" }}>{chat.turns} 条</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== CHATS ===== */}
        {activeTab === "chats" && (
          <div className="soft-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold" style={{ color: "#2C4A58" }}>全部聊天记录</h3>
              <span className="text-xs px-3 py-1 rounded-full"
                style={{ background: "rgba(91,168,160,0.1)", color: "#5BA8A0" }}
              >
                共 {mockChats.length} 次对话
              </span>
            </div>
            <div className="space-y-3">
              {mockChats.map((chat) => (
                <div key={chat.id}
                  className="group flex items-start gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all hover:bg-brand/4"
                  style={{ border: "1px solid rgba(91,168,160,0.1)" }}
                >
                  <span className="text-2xl flex-shrink-0 mt-0.5">{chat.mood}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-medium" style={{ color: "#A8BFC9" }}>{chat.date}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(91,168,160,0.08)", color: "#7A9BAB" }}
                      >
                        {chat.turns} 轮对话
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#2C4A58" }}>{chat.preview}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#A8BFC9" }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== MOOD REPORT ===== */}
        {activeTab === "mood" && (
          <div className="space-y-5">
            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "本月平均情绪", value: "5.8 / 10", icon: "📊", color: "#5BA8A0" },
                { label: "最好的一天", value: "8 / 10", icon: "🌟", color: "#F5A67D" },
                { label: "最常见情绪", value: "焦虑", icon: "💭", color: "#7BB3D4" },
              ].map((item, i) => (
                <div key={i} className="soft-card rounded-2xl p-5">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-xl font-bold mb-0.5" style={{ color: item.color }}>{item.value}</div>
                  <div className="text-xs" style={{ color: "#A8BFC9" }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* Monthly trend */}
            <div className="soft-card rounded-3xl p-6">
              <h3 className="text-base font-semibold mb-5" style={{ color: "#2C4A58" }}>本月情绪趋势</h3>
              <div className="flex items-end gap-1 h-32">
                {Array.from({ length: 18 }, (_, i) => {
                  const scores = [5, 4, 6, 3, 7, 8, 5, 4, 2, 6, 7, 6, 5, 8, 7, 4, 5, 6];
                  const v = scores[i] || 5;
                  return (
                    <div key={i} className="flex-1 rounded-t-lg transition-all duration-300"
                      style={{
                        height: `${(v / 10) * 100}%`,
                        background: v >= 7 ? "rgba(91,168,160,0.5)" : v >= 5 ? "rgba(123,179,212,0.4)" : "rgba(168,191,201,0.3)",
                      }}
                    />
                  );
                })}
              </div>
              <p className="text-xs mt-2 text-right" style={{ color: "#A8BFC9" }}>4月1日 → 4月18日</p>
            </div>

            {/* Insight */}
            <div className="rounded-3xl p-6"
              style={{ background: "rgba(91,168,160,0.06)", border: "1px solid rgba(91,168,160,0.15)" }}
            >
              <h3 className="text-base font-semibold mb-3" style={{ color: "#2C4A58" }}>
                💡 本月情绪洞察
              </h3>
              <ul className="space-y-2.5">
                {[
                  "你的情绪在周一和周三通常偏低，可能与工作节奏有关",
                  "晚上 10 点之后的签到情绪评分平均低于白天 1.5 分",
                  ""焦虑"是你本月最常选择的情绪标签（出现 8 次）",
                  "与上月相比，你的平均情绪分提升了 0.4 分",
                ].map((insight, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#7A9BAB" }}>
                    <span className="flex-shrink-0 mt-0.5" style={{ color: "#5BA8A0" }}>·</span>
                    {insight}
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 divider-soft" />
              <p className="text-xs mt-4" style={{ color: "#A8BFC9" }}>
                洞察基于你的历史数据自动生成，仅供参考，不构成诊断。
              </p>
            </div>
          </div>
        )}

        {/* ===== SETTINGS ===== */}
        {activeTab === "settings" && (
          <div className="space-y-5">
            {settingGroups.map((group, gi) => (
              <div key={gi} className="soft-card rounded-3xl p-2 overflow-hidden">
                <div className="px-4 pt-3 pb-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#A8BFC9" }}>
                    {group.title}
                  </h3>
                </div>
                {group.items.map((item, ii) => (
                  <button
                    key={ii}
                    className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left transition-colors hover:bg-brand/4"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0`}
                      style={{
                        background: item.danger ? "rgba(232,133,109,0.1)" : "rgba(91,168,160,0.1)",
                        color: item.danger ? "#E8856D" : "#5BA8A0",
                      }}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: item.danger ? "#E8856D" : "#2C4A58" }}>
                        {item.label}
                      </p>
                      <p className="text-xs" style={{ color: "#A8BFC9" }}>{item.sub}</p>
                    </div>
                    <ChevronRight className="w-4 h-4" style={{ color: "#A8BFC9" }} />
                  </button>
                ))}
              </div>
            ))}

            <div className="text-center pt-2">
              <button className="text-sm flex items-center gap-2 mx-auto py-3 px-6 rounded-2xl transition-colors hover:bg-brand/4"
                style={{ color: "#A8BFC9" }}
              >
                <LogOut className="w-4 h-4" /> 退出登录
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
