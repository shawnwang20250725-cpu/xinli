"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, Calendar, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";

const moodEmojis = [
  { emoji: "😭", label: "很难受", score: 1, color: "#7BB3D4" },
  { emoji: "😔", label: "有点低落", score: 3, color: "#84C5AB" },
  { emoji: "😐", label: "一般般", score: 5, color: "#A8BFC9" },
  { emoji: "🙂", label: "还不错", score: 7, color: "#5BA8A0" },
  { emoji: "😊", label: "挺好的", score: 9, color: "#84C5AB" },
  { emoji: "🌟", label: "很开心", score: 10, color: "#F5A67D" },
];

const feelingTags = [
  "焦虑", "平静", "疲惫", "孤独", "压力大", "轻松", "烦躁",
  "空虚", "感动", "委屈", "满足", "迷茫", "自我怀疑", "感恩",
  "兴奋", "沮丧", "释然", "紧张", "担忧", "平和",
];

const triggerTags = [
  "工作/学习", "人际关系", "家庭", "身体不适", "睡眠问题",
  "经济压力", "对未来迷茫", "自我要求高", "没什么特别原因",
];

const mockHistory = [
  { date: "4月18日", emoji: "😔", score: 3, tags: ["焦虑", "疲惫"] },
  { date: "4月17日", emoji: "🙂", score: 7, tags: ["平静", "满足"] },
  { date: "4月16日", emoji: "😐", score: 5, tags: ["压力大", "疲惫"] },
  { date: "4月15日", emoji: "😭", score: 2, tags: ["孤独", "委屈", "焦虑"] },
  { date: "4月14日", emoji: "😊", score: 8, tags: ["轻松", "感恩"] },
  { date: "4月13日", emoji: "😔", score: 4, tags: ["迷茫", "疲惫"] },
  { date: "4月12日", emoji: "🙂", score: 6, tags: ["平静"] },
];

const weekDays = ["一", "二", "三", "四", "五", "六", "日"];
const calendarScores = [6, 4, 7, 3, 5, 8, 6, null, null, 5, 4, 8, 7, 6, 5, 3, null, null, 7, 6, 5, 4, 8, 7, 6, null, null, 4, 5, 3];

const getScoreColor = (score: number | null) => {
  if (score === null) return "transparent";
  if (score >= 8) return "rgba(245,166,125,0.3)";
  if (score >= 6) return "rgba(91,168,160,0.25)";
  if (score >= 4) return "rgba(123,179,212,0.25)";
  return "rgba(168,191,201,0.25)";
};

type Step = "mood" | "feelings" | "triggers" | "journal" | "done";

export default function MoodPage() {
  const [step, setStep] = useState<Step>("mood");
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [journal, setJournal] = useState("");
  const [activeTab, setActiveTab] = useState<"checkin" | "history">("checkin");

  const toggleTag = (tag: string, arr: string[], setter: (v: string[]) => void) => {
    setter(arr.includes(tag) ? arr.filter((t) => t !== tag) : [...arr, tag]);
  };

  const progress = {
    mood: 0,
    feelings: 25,
    triggers: 50,
    journal: 75,
    done: 100,
  }[step];

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-5 py-10">

        {/* Page header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold mb-3" style={{ color: "#2C4A58" }}>
            情绪签到
          </h1>
          <p className="text-base" style={{ color: "#7A9BAB" }}>
            每天花 2 分钟，记录一下今天的感受。长期下来，你会更了解自己。
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex justify-center mb-8">
          <div
            className="flex rounded-2xl p-1 gap-1"
            style={{ background: "rgba(91,168,160,0.08)", border: "1px solid rgba(91,168,160,0.15)" }}
          >
            {[
              { key: "checkin", label: "📝 今日签到" },
              { key: "history", label: "📊 情绪记录" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "checkin" | "history")}
                className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: activeTab === tab.key ? "white" : "transparent",
                  color: activeTab === tab.key ? "#5BA8A0" : "#7A9BAB",
                  boxShadow: activeTab === tab.key ? "0 2px 8px rgba(44,74,88,0.08)" : "none",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== CHECK-IN FLOW ===== */}
        {activeTab === "checkin" && (
          <div className="max-w-xl mx-auto">

            {step !== "done" && (
              <>
                {/* Progress bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-xs mb-2" style={{ color: "#A8BFC9" }}>
                    <span>今天的情绪签到</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "rgba(91,168,160,0.12)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%`, background: "linear-gradient(to right, #5BA8A0, #84C5AB)" }}
                    />
                  </div>
                </div>

                {/* Steps */}
                {step === "mood" && (
                  <div className="soft-card rounded-3xl p-8 animate-fade-in-up">
                    <h2 className="text-xl font-semibold mb-2 text-center" style={{ color: "#2C4A58" }}>
                      今天，你的整体感受怎么样？
                    </h2>
                    <p className="text-sm text-center mb-8" style={{ color: "#7A9BAB" }}>
                      没有对错，就是你现在真实的状态
                    </p>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {moodEmojis.map((m, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedMood(m.score)}
                          className={`mood-option flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 ${selectedMood === m.score ? "selected" : ""}`}
                          style={{
                            background: selectedMood === m.score
                              ? `rgba(91,168,160,0.12)`
                              : "rgba(255,255,255,0.6)",
                            border: selectedMood === m.score
                              ? "2px solid #5BA8A0"
                              : "1.5px solid rgba(91,168,160,0.15)",
                          }}
                        >
                          <span className="text-4xl">{m.emoji}</span>
                          <span className="text-xs font-medium" style={{ color: "#7A9BAB" }}>{m.label}</span>
                        </button>
                      ))}
                    </div>
                    <button
                      className="w-full py-3.5 rounded-2xl font-semibold btn-brand disabled:opacity-40 disabled:cursor-not-allowed"
                      disabled={selectedMood === null}
                      onClick={() => setStep("feelings")}
                    >
                      下一步
                    </button>
                  </div>
                )}

                {step === "feelings" && (
                  <div className="soft-card rounded-3xl p-8 animate-fade-in-up">
                    <button
                      onClick={() => setStep("mood")}
                      className="flex items-center gap-1 text-sm mb-6 hover:opacity-70 transition-opacity"
                      style={{ color: "#7A9BAB" }}
                    >
                      <ChevronLeft className="w-4 h-4" /> 返回
                    </button>
                    <h2 className="text-xl font-semibold mb-2" style={{ color: "#2C4A58" }}>
                      你现在有哪些感受？
                    </h2>
                    <p className="text-sm mb-6" style={{ color: "#7A9BAB" }}>
                      可以多选，选出最接近你的状态
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {feelingTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag, selectedFeelings, setSelectedFeelings)}
                          className={`chip ${selectedFeelings.includes(tag) ? "selected" : ""}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <button
                      className="w-full py-3.5 rounded-2xl font-semibold btn-brand disabled:opacity-40"
                      disabled={selectedFeelings.length === 0}
                      onClick={() => setStep("triggers")}
                    >
                      下一步
                    </button>
                  </div>
                )}

                {step === "triggers" && (
                  <div className="soft-card rounded-3xl p-8 animate-fade-in-up">
                    <button
                      onClick={() => setStep("feelings")}
                      className="flex items-center gap-1 text-sm mb-6 hover:opacity-70 transition-opacity"
                      style={{ color: "#7A9BAB" }}
                    >
                      <ChevronLeft className="w-4 h-4" /> 返回
                    </button>
                    <h2 className="text-xl font-semibold mb-2" style={{ color: "#2C4A58" }}>
                      你觉得是什么影响了今天的心情？
                    </h2>
                    <p className="text-sm mb-6" style={{ color: "#7A9BAB" }}>
                      了解情绪的来源，是改变的第一步
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {triggerTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag, selectedTriggers, setSelectedTriggers)}
                          className={`chip ${selectedTriggers.includes(tag) ? "selected" : ""}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <button
                      className="w-full py-3.5 rounded-2xl font-semibold btn-brand"
                      onClick={() => setStep("journal")}
                    >
                      下一步
                    </button>
                  </div>
                )}

                {step === "journal" && (
                  <div className="soft-card rounded-3xl p-8 animate-fade-in-up">
                    <button
                      onClick={() => setStep("triggers")}
                      className="flex items-center gap-1 text-sm mb-6 hover:opacity-70 transition-opacity"
                      style={{ color: "#7A9BAB" }}
                    >
                      <ChevronLeft className="w-4 h-4" /> 返回
                    </button>
                    <h2 className="text-xl font-semibold mb-2" style={{ color: "#2C4A58" }}>
                      想留下什么文字吗？
                    </h2>
                    <p className="text-sm mb-6" style={{ color: "#7A9BAB" }}>
                      可以什么都不写，也可以随便说几句。没有人会评判你。
                    </p>
                    <textarea
                      value={journal}
                      onChange={(e) => setJournal(e.target.value)}
                      placeholder="今天发生了什么？你有什么想说的…"
                      rows={5}
                      className="w-full rounded-2xl px-4 py-3.5 text-sm input-calm resize-none mb-8"
                      style={{
                        background: "rgba(91,168,160,0.04)",
                        color: "#2C4A58",
                        lineHeight: "1.7",
                      }}
                    />
                    <button
                      className="w-full py-3.5 rounded-2xl font-semibold btn-brand"
                      onClick={() => setStep("done")}
                    >
                      完成签到 ✓
                    </button>
                  </div>
                )}
              </>
            )}

            {step === "done" && (
              <div className="soft-card rounded-3xl p-10 text-center animate-fade-in-up">
                <div className="text-6xl mb-6">🌿</div>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: "rgba(91,168,160,0.12)" }}
                >
                  <CheckCircle className="w-8 h-8" style={{ color: "#5BA8A0" }} />
                </div>
                <h2 className="text-2xl font-semibold mb-3" style={{ color: "#2C4A58" }}>
                  今天的签到完成了
                </h2>
                <p className="text-base mb-2" style={{ color: "#7A9BAB" }}>
                  感谢你今天认真关注了自己的状态。
                </p>
                <p className="text-sm mb-8" style={{ color: "#A8BFC9" }}>
                  持续记录，你会发现自己情绪的规律。
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/chat" className="btn-brand inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold">
                    去倾诉一下 <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/toolbox" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-colors"
                    style={{ background: "rgba(91,168,160,0.1)", color: "#5BA8A0" }}
                  >
                    情绪工具箱
                  </Link>
                </div>
                <button
                  className="mt-6 text-sm underline underline-offset-2"
                  style={{ color: "#A8BFC9" }}
                  onClick={() => {
                    setStep("mood");
                    setSelectedMood(null);
                    setSelectedFeelings([]);
                    setSelectedTriggers([]);
                    setJournal("");
                  }}
                >
                  重新填写
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===== HISTORY ===== */}
        {activeTab === "history" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Calendar */}
            <div className="lg:col-span-2 soft-card rounded-3xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold" style={{ color: "#2C4A58" }}>
                  <Calendar className="w-4 h-4 inline mr-2" style={{ color: "#5BA8A0" }} />
                  2025年4月
                </h3>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-brand/8 transition-colors">
                    <ChevronLeft className="w-4 h-4" style={{ color: "#7A9BAB" }} />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-brand/8 transition-colors">
                    <ChevronRight className="w-4 h-4" style={{ color: "#7A9BAB" }} />
                  </button>
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {weekDays.map((d) => (
                  <div key={d} className="text-center text-xs font-medium py-1" style={{ color: "#A8BFC9" }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarScores.map((score, idx) => {
                  const day = idx + 1;
                  return (
                    <div
                      key={idx}
                      className="aspect-square rounded-xl flex items-center justify-center text-xs font-medium cursor-pointer transition-all hover:scale-105"
                      style={{
                        background: getScoreColor(score),
                        color: score ? "#2C4A58" : "transparent",
                        border: score ? "1px solid rgba(91,168,160,0.15)" : "none",
                      }}
                    >
                      {score ? day : ""}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 mt-4">
                <span className="text-xs" style={{ color: "#A8BFC9" }}>情绪颜色：</span>
                {[
                  { color: "rgba(245,166,125,0.4)", label: "很好" },
                  { color: "rgba(91,168,160,0.3)", label: "不错" },
                  { color: "rgba(123,179,212,0.3)", label: "一般" },
                  { color: "rgba(168,191,201,0.3)", label: "低落" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm" style={{ background: item.color }} />
                    <span className="text-xs" style={{ color: "#A8BFC9" }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <div className="soft-card rounded-3xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4" style={{ color: "#5BA8A0" }} />
                  <h3 className="text-sm font-semibold" style={{ color: "#2C4A58" }}>本周情绪趋势</h3>
                </div>
                <div className="flex items-end gap-1.5 h-20 mb-2">
                  {[3, 7, 5, 2, 8, 4, 6].map((v, i) => (
                    <div key={i} className="flex-1 rounded-t-lg" style={{
                      height: `${(v / 10) * 100}%`,
                      background: v >= 7 ? "rgba(91,168,160,0.5)" : v >= 5 ? "rgba(123,179,212,0.4)" : "rgba(168,191,201,0.35)",
                    }} />
                  ))}
                </div>
                <div className="flex gap-1.5">
                  {["一", "二", "三", "四", "五", "六", "日"].map((d) => (
                    <div key={d} className="flex-1 text-center text-xs" style={{ color: "#A8BFC9" }}>{d}</div>
                  ))}
                </div>
              </div>

              <div className="soft-card rounded-3xl p-5">
                <h3 className="text-sm font-semibold mb-3" style={{ color: "#2C4A58" }}>常见情绪</h3>
                <div className="space-y-2">
                  {[
                    { tag: "焦虑", count: 5 },
                    { tag: "疲惫", count: 4 },
                    { tag: "平静", count: 3 },
                    { tag: "孤独", count: 2 },
                  ].map((item) => (
                    <div key={item.tag} className="flex items-center gap-2">
                      <span className="text-xs w-12" style={{ color: "#7A9BAB" }}>{item.tag}</span>
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(91,168,160,0.1)" }}>
                        <div className="h-full rounded-full" style={{
                          width: `${(item.count / 5) * 100}%`,
                          background: "#5BA8A0"
                        }} />
                      </div>
                      <span className="text-xs" style={{ color: "#A8BFC9" }}>{item.count}次</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent list */}
            <div className="lg:col-span-3 soft-card rounded-3xl p-6">
              <h3 className="font-semibold mb-5" style={{ color: "#2C4A58" }}>最近签到记录</h3>
              <div className="space-y-3">
                {mockHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 px-4 py-3.5 rounded-2xl"
                    style={{ background: "rgba(91,168,160,0.04)", border: "1px solid rgba(91,168,160,0.1)" }}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-medium" style={{ color: "#2C4A58" }}>{item.date}</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: item.score >= 7 ? "rgba(91,168,160,0.15)" : item.score >= 4 ? "rgba(123,179,212,0.15)" : "rgba(168,191,201,0.2)",
                            color: item.score >= 7 ? "#5BA8A0" : item.score >= 4 ? "#7BB3D4" : "#A8BFC9",
                          }}
                        >
                          {item.score}/10
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(91,168,160,0.08)", color: "#7A9BAB" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
