"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, Calendar, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";

// ── 类型 ──────────────────────────────────────────────────────
interface CheckIn {
  id: string;
  date: string;       // "YYYY-MM-DD"
  score: number;
  emoji: string;
  label: string;
  feelings: string[];
  triggers: string[];
  journal: string;
}

interface Evaluation {
  title: string;
  text: string;
  suggestion: string;
}

// ── 常量 ──────────────────────────────────────────────────────
const STORAGE_KEY = "xinyu_mood_history";

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

const weekDays = ["一", "二", "三", "四", "五", "六", "日"];

// ── 工具函数 ──────────────────────────────────────────────────
const getTodayStr = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const formatDisplayDate = (dateStr: string): string => {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getMonth() + 1}月${d.getDate()}日`;
};

const getScoreColor = (score: number | null) => {
  if (score === null) return "transparent";
  if (score >= 8) return "rgba(245,166,125,0.3)";
  if (score >= 6) return "rgba(91,168,160,0.25)";
  if (score >= 4) return "rgba(123,179,212,0.25)";
  return "rgba(168,191,201,0.25)";
};

// ── 情绪评价生成 ──────────────────────────────────────────────
const generateEvaluation = (score: number, feelings: string[], triggers: string[]): Evaluation => {
  const NEG_FEELING_MAP: Record<string, string> = {
    焦虑:   "焦虑会消耗很多能量，但你能停下来记录这一刻，已经是在照顾自己了。",
    疲惫:   "身心俱疲的时候，最需要的是真正的休息，而不是继续硬撑。",
    孤独:   "孤独的感觉很难受，但你不是真的一个人——你在认真对待自己的内心。",
    委屈:   "委屈积压不说出来会很沉，可以来聊聊，或者写下来。",
    烦躁:   "烦躁的时候很难静下来，试着先做一件很小的事，哪怕只是喝口水。",
    压力大: "压力大的时候，先把任务拆小一点，一件一件来。",
    迷茫:   "迷茫是在找方向，不是失去方向。允许自己慢一点。",
    担忧:   "担忧的事情未必会发生，先把注意力拉回到今天能做的一件事。",
    沮丧:   "沮丧是正常的情绪反应，不需要马上振作，先承认它的存在。",
  };

  let title = "";
  let text = "";
  let suggestion = "";

  if (score <= 3) {
    title = "今天辛苦了";
    const matched = feelings.find((f) => NEG_FEELING_MAP[f]);
    text = matched ? NEG_FEELING_MAP[matched] : "低落的时候，只需要撑过今天就好，不需要马上变好。";
    suggestion = "试试深呼吸，或者来聊聊";
  } else if (score <= 6) {
    title = "今天状态还好";
    text = feelings.some((f) => ["平静", "轻松", "释然", "平和"].includes(f))
      ? "平静本身就是一种好状态，好好感受这份稳定。"
      : "普通的一天也有它的价值，你在认真对待自己的感受，这很重要。";
    suggestion = "保持今天的节奏";
  } else {
    title = "今天状态不错！";
    text = feelings.some((f) => ["感恩", "满足", "感动"].includes(f))
      ? "能感受到满足和感恩，说明你在认真感受生活。把这份心情记下来，以后可以翻翻。"
      : "好状态的时候把它记下来——你知道自己是有能力感受到轻松和愉快的。";
    suggestion = "把这份好状态带进明天";
  }

  if (triggers.includes("睡眠问题") && score <= 6) {
    text += " 睡眠对情绪影响很大，工具箱里有一些助眠的小练习可以试试。";
  }

  return { title, text, suggestion };
};

// ── 日历计算 ──────────────────────────────────────────────────
const buildCalendarCells = (year: number, month: number, history: CheckIn[]) => {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Mon=0 … Sun=6
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const scoreMap: Record<number, number> = {};
  history.forEach((c) => {
    const d = new Date(c.date + "T00:00:00");
    if (d.getFullYear() === year && d.getMonth() === month) {
      scoreMap[d.getDate()] = c.score;
    }
  });

  const cells: { day: number | null; score: number | null }[] = [];
  for (let i = 0; i < startOffset; i++) cells.push({ day: null, score: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, score: scoreMap[d] ?? null });

  return cells;
};

type Step = "mood" | "feelings" | "triggers" | "journal" | "done";

// ── 主组件 ────────────────────────────────────────────────────
export default function MoodPage() {
  const [step, setStep] = useState<Step>("mood");
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [journal, setJournal] = useState("");
  const [activeTab, setActiveTab] = useState<"checkin" | "history">("checkin");
  const [history, setHistory] = useState<CheckIn[]>([]);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  // 从 localStorage 加载历史
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw) as CheckIn[]);
    } catch { /* ignore */ }
  }, []);

  const saveHistory = (next: CheckIn[]) => {
    setHistory(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const toggleTag = (tag: string, arr: string[], setter: (v: string[]) => void) => {
    setter(arr.includes(tag) ? arr.filter((t) => t !== tag) : [...arr, tag]);
  };

  const handleComplete = () => {
    const moodObj = moodEmojis.find((m) => m.score === selectedMood)!;
    const checkin: CheckIn = {
      id: crypto.randomUUID(),
      date: getTodayStr(),
      score: selectedMood!,
      emoji: moodObj.emoji,
      label: moodObj.label,
      feelings: selectedFeelings,
      triggers: selectedTriggers,
      journal,
    };
    // 同一天覆盖旧记录
    const next = [checkin, ...history.filter((c) => c.date !== checkin.date)];
    saveHistory(next);
    setEvaluation(generateEvaluation(selectedMood!, selectedFeelings, selectedTriggers));
    setStep("done");
  };

  const handleReset = () => {
    setStep("mood");
    setSelectedMood(null);
    setSelectedFeelings([]);
    setSelectedTriggers([]);
    setJournal("");
    setEvaluation(null);
  };

  const progress = { mood: 0, feelings: 25, triggers: 50, journal: 75, done: 100 }[step];

  // 日历
  const calendarCells = buildCalendarCells(calYear, calMonth, history);
  const calTitle = `${calYear}年${calMonth + 1}月`;
  const prevMonth = () => { if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); } else setCalMonth(m => m - 1); };
  const nextMonth = () => { if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); } else setCalMonth(m => m + 1); };

  // 统计：最近 7 天
  const weekScores = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return history.find((c) => c.date === ds)?.score ?? null;
  });

  // 统计：常见情绪
  const feelingCounts: Record<string, number> = {};
  history.forEach((c) => c.feelings.forEach((f) => { feelingCounts[f] = (feelingCounts[f] || 0) + 1; }));
  const topFeelings = Object.entries(feelingCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const maxCount = topFeelings[0]?.[1] ?? 1;

  // 历史列表（降序）
  const sortedHistory = [...history].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 14);

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-5 py-10">

        {/* Page header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold mb-3" style={{ color: "#2C4A58" }}>情绪签到</h1>
          <p className="text-base" style={{ color: "#7A9BAB" }}>
            每天花 2 分钟，记录一下今天的感受。长期下来，你会更了解自己。
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex justify-center mb-8">
          <div className="flex rounded-2xl p-1 gap-1"
            style={{ background: "rgba(91,168,160,0.08)", border: "1px solid rgba(91,168,160,0.15)" }}
          >
            {[{ key: "checkin", label: "📝 今日签到" }, { key: "history", label: "📊 情绪记录" }].map((tab) => (
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
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%`, background: "linear-gradient(to right, #5BA8A0, #84C5AB)" }} />
                  </div>
                </div>

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
                        <button key={idx} onClick={() => setSelectedMood(m.score)}
                          className={`mood-option flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 ${selectedMood === m.score ? "selected" : ""}`}
                          style={{
                            background: selectedMood === m.score ? "rgba(91,168,160,0.12)" : "rgba(255,255,255,0.6)",
                            border: selectedMood === m.score ? "2px solid #5BA8A0" : "1.5px solid rgba(91,168,160,0.15)",
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
                    >下一步</button>
                  </div>
                )}

                {step === "feelings" && (
                  <div className="soft-card rounded-3xl p-8 animate-fade-in-up">
                    <button onClick={() => setStep("mood")}
                      className="flex items-center gap-1 text-sm mb-6 hover:opacity-70 transition-opacity"
                      style={{ color: "#7A9BAB" }}
                    ><ChevronLeft className="w-4 h-4" /> 返回</button>
                    <h2 className="text-xl font-semibold mb-2" style={{ color: "#2C4A58" }}>你现在有哪些感受？</h2>
                    <p className="text-sm mb-6" style={{ color: "#7A9BAB" }}>可以多选，选出最接近你的状态</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {feelingTags.map((tag) => (
                        <button key={tag}
                          onClick={() => toggleTag(tag, selectedFeelings, setSelectedFeelings)}
                          className={`chip ${selectedFeelings.includes(tag) ? "selected" : ""}`}
                        >{tag}</button>
                      ))}
                    </div>
                    <button
                      className="w-full py-3.5 rounded-2xl font-semibold btn-brand disabled:opacity-40"
                      disabled={selectedFeelings.length === 0}
                      onClick={() => setStep("triggers")}
                    >下一步</button>
                  </div>
                )}

                {step === "triggers" && (
                  <div className="soft-card rounded-3xl p-8 animate-fade-in-up">
                    <button onClick={() => setStep("feelings")}
                      className="flex items-center gap-1 text-sm mb-6 hover:opacity-70 transition-opacity"
                      style={{ color: "#7A9BAB" }}
                    ><ChevronLeft className="w-4 h-4" /> 返回</button>
                    <h2 className="text-xl font-semibold mb-2" style={{ color: "#2C4A58" }}>你觉得是什么影响了今天的心情？</h2>
                    <p className="text-sm mb-6" style={{ color: "#7A9BAB" }}>了解情绪的来源，是改变的第一步</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {triggerTags.map((tag) => (
                        <button key={tag}
                          onClick={() => toggleTag(tag, selectedTriggers, setSelectedTriggers)}
                          className={`chip ${selectedTriggers.includes(tag) ? "selected" : ""}`}
                        >{tag}</button>
                      ))}
                    </div>
                    <button className="w-full py-3.5 rounded-2xl font-semibold btn-brand"
                      onClick={() => setStep("journal")}
                    >下一步</button>
                  </div>
                )}

                {step === "journal" && (
                  <div className="soft-card rounded-3xl p-8 animate-fade-in-up">
                    <button onClick={() => setStep("triggers")}
                      className="flex items-center gap-1 text-sm mb-6 hover:opacity-70 transition-opacity"
                      style={{ color: "#7A9BAB" }}
                    ><ChevronLeft className="w-4 h-4" /> 返回</button>
                    <h2 className="text-xl font-semibold mb-2" style={{ color: "#2C4A58" }}>想留下什么文字吗？</h2>
                    <p className="text-sm mb-6" style={{ color: "#7A9BAB" }}>
                      可以什么都不写，也可以随便说几句。没有人会评判你。
                    </p>
                    <textarea
                      value={journal} onChange={(e) => setJournal(e.target.value)}
                      placeholder="今天发生了什么？你有什么想说的…" rows={5}
                      className="w-full rounded-2xl px-4 py-3.5 text-sm input-calm resize-none mb-8"
                      style={{ background: "rgba(91,168,160,0.04)", color: "#2C4A58", lineHeight: "1.7" }}
                    />
                    <button className="w-full py-3.5 rounded-2xl font-semibold btn-brand"
                      onClick={handleComplete}
                    >完成签到 ✓</button>
                  </div>
                )}
              </>
            )}

            {/* ===== DONE + EVALUATION ===== */}
            {step === "done" && (
              <div className="animate-fade-in-up space-y-4">
                {/* 完成卡 */}
                <div className="soft-card rounded-3xl p-8 text-center">
                  <div className="text-5xl mb-4">
                    {moodEmojis.find((m) => m.score === selectedMood)?.emoji ?? "🌿"}
                  </div>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "rgba(91,168,160,0.12)" }}
                  >
                    <CheckCircle className="w-7 h-7" style={{ color: "#5BA8A0" }} />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2" style={{ color: "#2C4A58" }}>今天的签到完成了</h2>
                  <p className="text-sm" style={{ color: "#A8BFC9" }}>持续记录，你会发现自己情绪的规律。</p>
                </div>

                {/* 情绪评价卡 */}
                {evaluation && (
                  <div className="rounded-3xl p-6"
                    style={{ background: "rgba(91,168,160,0.06)", border: "1px solid rgba(91,168,160,0.18)" }}
                  >
                    <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#84C5AB" }}>
                      今日情绪小结
                    </p>
                    <h3 className="text-lg font-semibold mb-3" style={{ color: "#2C4A58" }}>
                      {evaluation.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "#7A9BAB" }}>
                      {evaluation.text}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{ background: "rgba(91,168,160,0.12)", color: "#5BA8A0" }}
                    >
                      💡 {evaluation.suggestion}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Link href="/chat"
                    className="btn-brand inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold"
                  >
                    去倾诉一下 <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/toolbox"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-colors"
                    style={{ background: "rgba(91,168,160,0.1)", color: "#5BA8A0" }}
                  >
                    情绪工具箱
                  </Link>
                </div>
                <div className="text-center">
                  <button className="mt-2 text-sm underline underline-offset-2"
                    style={{ color: "#A8BFC9" }} onClick={handleReset}
                  >重新填写</button>
                </div>
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
                  {calTitle}
                </h3>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-brand/8 transition-colors" onClick={prevMonth}>
                    <ChevronLeft className="w-4 h-4" style={{ color: "#7A9BAB" }} />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-brand/8 transition-colors" onClick={nextMonth}>
                    <ChevronRight className="w-4 h-4" style={{ color: "#7A9BAB" }} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 mb-2">
                {weekDays.map((d) => (
                  <div key={d} className="text-center text-xs font-medium py-1" style={{ color: "#A8BFC9" }}>{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarCells.map((cell, idx) => {
                  const isToday = cell.day !== null &&
                    calYear === now.getFullYear() && calMonth === now.getMonth() && cell.day === now.getDate();
                  return (
                    <div key={idx}
                      className="aspect-square rounded-xl flex items-center justify-center text-xs font-medium transition-all hover:scale-105"
                      style={{
                        background: cell.day === null ? "transparent" : getScoreColor(cell.score),
                        color: cell.day === null ? "transparent" : "#2C4A58",
                        border: isToday ? "2px solid #5BA8A0" : cell.score !== null ? "1px solid rgba(91,168,160,0.15)" : "none",
                        cursor: cell.score !== null ? "pointer" : "default",
                      }}
                    >
                      {cell.day ?? ""}
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
                  <h3 className="text-sm font-semibold" style={{ color: "#2C4A58" }}>最近 7 天趋势</h3>
                </div>
                <div className="flex items-end gap-1.5 h-20 mb-2">
                  {weekScores.map((v, i) => (
                    <div key={i} className="flex-1 rounded-t-lg transition-all duration-700"
                      style={{
                        height: v !== null ? `${(v / 10) * 100}%` : "8%",
                        background: v === null ? "rgba(91,168,160,0.08)"
                          : v >= 7 ? "rgba(91,168,160,0.5)"
                          : v >= 5 ? "rgba(123,179,212,0.4)"
                          : "rgba(168,191,201,0.35)",
                        minHeight: "4px",
                      }}
                    />
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
                {topFeelings.length === 0 ? (
                  <p className="text-xs" style={{ color: "#A8BFC9" }}>完成签到后这里会显示你的情绪分布</p>
                ) : (
                  <div className="space-y-2">
                    {topFeelings.map(([tag, count]) => (
                      <div key={tag} className="flex items-center gap-2">
                        <span className="text-xs w-14 flex-shrink-0" style={{ color: "#7A9BAB" }}>{tag}</span>
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(91,168,160,0.1)" }}>
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${(count / maxCount) * 100}%`, background: "#5BA8A0" }} />
                        </div>
                        <span className="text-xs" style={{ color: "#A8BFC9" }}>{count}次</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent list */}
            <div className="lg:col-span-3 soft-card rounded-3xl p-6">
              <h3 className="font-semibold mb-5" style={{ color: "#2C4A58" }}>最近签到记录</h3>
              {sortedHistory.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">📋</div>
                  <p className="text-sm" style={{ color: "#A8BFC9" }}>还没有签到记录，去完成第一次签到吧</p>
                  <button className="mt-4 text-sm font-medium" style={{ color: "#5BA8A0" }}
                    onClick={() => setActiveTab("checkin")}
                  >去签到 →</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedHistory.map((item) => (
                    <div key={item.id}
                      className="flex items-center gap-4 px-4 py-3.5 rounded-2xl"
                      style={{ background: "rgba(91,168,160,0.04)", border: "1px solid rgba(91,168,160,0.1)" }}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-medium" style={{ color: "#2C4A58" }}>
                            {formatDisplayDate(item.date)}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              background: item.score >= 7 ? "rgba(91,168,160,0.15)" : item.score >= 4 ? "rgba(123,179,212,0.15)" : "rgba(168,191,201,0.2)",
                              color: item.score >= 7 ? "#5BA8A0" : item.score >= 4 ? "#7BB3D4" : "#A8BFC9",
                            }}
                          >
                            {item.score}/10
                          </span>
                          <span className="text-xs" style={{ color: "#A8BFC9" }}>{item.label}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.feelings.map((tag) => (
                            <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                              style={{ background: "rgba(91,168,160,0.08)", color: "#7A9BAB" }}
                            >{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
