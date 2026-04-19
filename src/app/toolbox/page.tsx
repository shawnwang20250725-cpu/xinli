"use client";

import { useState } from "react";
import { X, Play, Pause, RotateCcw, ChevronRight, Clock, Star } from "lucide-react";

const tools = [
  {
    id: "breathing",
    emoji: "🌬️",
    title: "4-7-8 呼吸法",
    subtitle: "缓解焦虑 · 3分钟",
    desc: "一种简单强大的呼吸技术，通过调节呼吸节奏来激活副交感神经，快速降低焦虑感。",
    tags: ["焦虑", "失眠", "压力"],
    color: "#7BB3D4",
    bg: "rgba(123,179,212,0.08)",
    border: "rgba(123,179,212,0.2)",
    duration: "3分钟",
    difficulty: "简单",
  },
  {
    id: "grounding",
    emoji: "🌿",
    title: "5-4-3-2-1 接地练习",
    subtitle: "回到当下 · 5分钟",
    desc: "通过五感体验把注意力拉回到当下，对惊恐发作和过度思虑特别有效。",
    tags: ["焦虑", "惊恐", "解离"],
    color: "#5BA8A0",
    bg: "rgba(91,168,160,0.08)",
    border: "rgba(91,168,160,0.2)",
    duration: "5分钟",
    difficulty: "简单",
  },
  {
    id: "bodyscan",
    emoji: "🧘",
    title: "身体扫描冥想",
    subtitle: "放松全身 · 10分钟",
    desc: "从头到脚依次放松每个部位，释放身体储存的紧张和压力，改善睡眠质量。",
    tags: ["失眠", "紧张", "疲惫"],
    color: "#84C5AB",
    bg: "rgba(132,197,171,0.08)",
    border: "rgba(132,197,171,0.2)",
    duration: "10分钟",
    difficulty: "中等",
  },
  {
    id: "journal",
    emoji: "📝",
    title: "情绪日记引导",
    subtitle: "梳理感受 · 随时",
    desc: "通过结构化的写作提示，帮助你表达和整理复杂的情绪，而不是压抑它们。",
    tags: ["情绪低落", "内耗", "梳理"],
    color: "#F5A67D",
    bg: "rgba(245,166,125,0.08)",
    border: "rgba(245,166,125,0.2)",
    duration: "随时",
    difficulty: "简单",
  },
  {
    id: "muscle",
    emoji: "💪",
    title: "渐进式肌肉放松",
    subtitle: "释放身体紧张 · 15分钟",
    desc: "通过交替收紧和放松肌肉群，释放全身积累的躯体化压力。",
    tags: ["压力", "紧张", "头痛"],
    color: "#7BB3D4",
    bg: "rgba(123,179,212,0.08)",
    border: "rgba(123,179,212,0.2)",
    duration: "15分钟",
    difficulty: "中等",
  },
  {
    id: "gratitude",
    emoji: "🙏",
    title: "感恩练习",
    subtitle: "转换视角 · 5分钟",
    desc: "不是让你强行正向，而是温和地把注意力引向生活中还存在的美好，哪怕很微小。",
    tags: ["低落", "消极思维", "孤独"],
    color: "#F5A67D",
    bg: "rgba(245,166,125,0.08)",
    border: "rgba(245,166,125,0.2)",
    duration: "5分钟",
    difficulty: "简单",
  },
  {
    id: "safespace",
    emoji: "🏡",
    title: "安全屋想象",
    subtitle: "心理庇护 · 8分钟",
    desc: "引导你在内心构建一个完全属于自己的安全空间，当外部世界让你感到不安时可以随时去那里。",
    tags: ["创伤", "焦虑", "安全感"],
    color: "#5BA8A0",
    bg: "rgba(91,168,160,0.08)",
    border: "rgba(91,168,160,0.2)",
    duration: "8分钟",
    difficulty: "中等",
  },
  {
    id: "sleep",
    emoji: "🌙",
    title: "睡前放松引导",
    subtitle: "改善睡眠 · 12分钟",
    desc: "专为睡前设计的引导放松，帮助大脑从焦虑模式切换到休息模式，让你更容易入睡。",
    tags: ["失眠", "焦虑", "睡前"],
    color: "#7BB3D4",
    bg: "rgba(123,179,212,0.08)",
    border: "rgba(123,179,212,0.2)",
    duration: "12分钟",
    difficulty: "简单",
  },
];

const categories = ["全部", "焦虑", "失眠", "压力", "情绪低落", "放松"];

// --- Breathing Exercise Component ---
function BreathingExercise({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "idle">("idle");
  const [count, setCount] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [running, setRunning] = useState(false);

  const phaseConfig = {
    inhale: { label: "吸气", duration: 4, color: "#5BA8A0", next: "hold" as const },
    hold: { label: "屏住", duration: 7, color: "#7BB3D4", next: "exhale" as const },
    exhale: { label: "呼气", duration: 8, color: "#84C5AB", next: "inhale" as const },
    idle: { label: "准备好了吗", duration: 0, color: "#A8BFC9", next: "inhale" as const },
  };

  const start = () => {
    setRunning(true);
    setPhase("inhale");
    setCount(4);
    setCycle(1);
  };

  const reset = () => {
    setRunning(false);
    setPhase("idle");
    setCount(0);
    setCycle(0);
  };

  const current = phaseConfig[phase];
  const circleSize = phase === "inhale" ? 1.15 : phase === "exhale" ? 0.85 : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(44,74,88,0.4)", backdropFilter: "blur(12px)" }}
    >
      <div className="soft-card rounded-3xl p-8 max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-brand/8 transition-colors"
        >
          <X className="w-5 h-5" style={{ color: "#A8BFC9" }} />
        </button>

        <h3 className="text-xl font-semibold text-center mb-2" style={{ color: "#2C4A58" }}>
          4-7-8 呼吸法
        </h3>
        <p className="text-sm text-center mb-8" style={{ color: "#7A9BAB" }}>
          跟着圆圈的大小，调整你的呼吸节奏
        </p>

        {/* Breathing circle */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
            {/* Outer glow */}
            <div
              className="absolute rounded-full transition-all duration-1000"
              style={{
                width: `${circleSize * 180}px`,
                height: `${circleSize * 180}px`,
                background: `radial-gradient(circle, ${current.color}30 0%, ${current.color}08 70%, transparent 100%)`,
              }}
            />
            {/* Main circle */}
            <div
              className="rounded-full flex flex-col items-center justify-center transition-all duration-1000"
              style={{
                width: `${circleSize * 140}px`,
                height: `${circleSize * 140}px`,
                background: `radial-gradient(circle, ${current.color}25 0%, ${current.color}10 100%)`,
                border: `2px solid ${current.color}40`,
              }}
            >
              <span className="text-2xl font-light" style={{ color: current.color }}>
                {running ? count : ""}
              </span>
              <span className="text-sm font-medium mt-1" style={{ color: current.color }}>
                {current.label}
              </span>
            </div>
          </div>
        </div>

        {cycle > 0 && (
          <p className="text-center text-sm mb-6" style={{ color: "#A8BFC9" }}>
            第 {cycle} 轮 · 建议完成 4 轮
          </p>
        )}

        <div className="flex gap-3">
          {!running ? (
            <button
              onClick={start}
              className="flex-1 btn-brand py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" /> 开始
            </button>
          ) : (
            <>
              <button
                onClick={() => setRunning(false)}
                className="flex-1 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2"
                style={{ background: "rgba(91,168,160,0.1)", color: "#5BA8A0" }}
              >
                <Pause className="w-4 h-4" /> 暂停
              </button>
              <button
                onClick={reset}
                className="px-4 py-3.5 rounded-2xl transition-colors"
                style={{ background: "rgba(168,191,201,0.15)", color: "#A8BFC9" }}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Grounding Exercise Component ---
function GroundingExercise({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    { sense: "👀 看", count: 5, instruction: "环顾四周，说出你能看到的 5 样东西", color: "#7BB3D4" },
    { sense: "✋ 触摸", count: 4, instruction: "感受 4 种不同的触感，可以摸摸桌子、衣服、皮肤…", color: "#5BA8A0" },
    { sense: "👂 听", count: 3, instruction: "闭上眼睛，听到 3 种声音", color: "#84C5AB" },
    { sense: "👃 闻", count: 2, instruction: "闻到 2 种气味，或者回忆你喜欢的气味", color: "#7BB3D4" },
    { sense: "👅 尝", count: 1, instruction: "感受 1 种味道，口腔现在的感觉", color: "#F5A67D" },
  ];

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(44,74,88,0.4)", backdropFilter: "blur(12px)" }}
    >
      <div className="soft-card rounded-3xl p-8 max-w-sm w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-brand/8">
          <X className="w-5 h-5" style={{ color: "#A8BFC9" }} />
        </button>

        <h3 className="text-xl font-semibold text-center mb-2" style={{ color: "#2C4A58" }}>
          5-4-3-2-1 接地练习
        </h3>
        <p className="text-xs text-center mb-6" style={{ color: "#A8BFC9" }}>
          步骤 {step + 1} / {steps.length}
        </p>

        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {steps.map((_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-300"
              style={{ background: i <= step ? current.color : "rgba(168,191,201,0.2)" }}
            />
          ))}
        </div>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{current.sense.split(" ")[0]}</div>
          <div className="text-5xl font-light mb-4" style={{ color: current.color }}>
            {current.count}
          </div>
          <p className="text-base" style={{ color: "#2C4A58" }}>{current.instruction}</p>
        </div>

        <div className="flex gap-3">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)}
              className="px-5 py-3.5 rounded-2xl font-medium transition-colors"
              style={{ background: "rgba(91,168,160,0.08)", color: "#7A9BAB" }}
            >
              上一步
            </button>
          )}
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(step + 1)}
              className="flex-1 btn-brand py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2"
            >
              完成了，下一步 <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl font-semibold"
              style={{ background: "rgba(91,168,160,0.12)", color: "#5BA8A0" }}
            >
              完成练习 ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Journal Exercise Component ---
const journalPrompts = [
  "现在，我感到…（不加评判，只是描述）",
  "让我感到这样的，可能是因为…",
  "如果好朋友告诉我他有这样的感受，我会对他说…",
  "今天，有什么事情让我觉得还不错，哪怕很小？",
  "我现在最需要的是什么？",
];

function JournalExercise({ onClose }: { onClose: () => void }) {
  const [promptIdx, setPromptIdx] = useState(0);
  const [text, setText] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(44,74,88,0.4)", backdropFilter: "blur(12px)" }}
    >
      <div className="soft-card rounded-3xl p-8 max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-brand/8">
          <X className="w-5 h-5" style={{ color: "#A8BFC9" }} />
        </button>

        <h3 className="text-xl font-semibold mb-2" style={{ color: "#2C4A58" }}>情绪日记</h3>
        <p className="text-sm mb-6" style={{ color: "#7A9BAB" }}>
          没有格式要求，写什么都可以。这里只有你自己。
        </p>

        <div className="rounded-2xl px-4 py-4 mb-4"
          style={{ background: "rgba(91,168,160,0.06)", border: "1px solid rgba(91,168,160,0.15)" }}
        >
          <p className="text-sm font-medium" style={{ color: "#5BA8A0" }}>
            💭 {journalPrompts[promptIdx]}
          </p>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="在这里写…"
          rows={6}
          className="w-full rounded-2xl px-4 py-3.5 text-sm input-calm resize-none mb-4"
          style={{ background: "rgba(91,168,160,0.03)", color: "#2C4A58", lineHeight: "1.8" }}
        />

        <div className="flex gap-3">
          <button
            onClick={() => { setPromptIdx((i) => (i + 1) % journalPrompts.length); setText(""); }}
            className="flex-1 py-3 rounded-2xl font-medium text-sm transition-colors"
            style={{ background: "rgba(91,168,160,0.08)", color: "#5BA8A0" }}
          >
            换一个提示
          </button>
          <button onClick={onClose} className="flex-1 btn-brand py-3 rounded-2xl font-semibold text-sm">
            保存并关闭
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ToolboxPage() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const filtered = activeCategory === "全部"
    ? tools
    : tools.filter((t) => t.tags.includes(activeCategory));

  return (
    <div className="pt-16 min-h-screen">
      {/* Tool overlays */}
      {activeTool === "breathing" && <BreathingExercise onClose={() => setActiveTool(null)} />}
      {activeTool === "grounding" && <GroundingExercise onClose={() => setActiveTool(null)} />}
      {activeTool === "journal" && <JournalExercise onClose={() => setActiveTool(null)} />}

      <div className="max-w-6xl mx-auto px-5 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold mb-3" style={{ color: "#2C4A58" }}>
            情绪自助工具箱
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: "#7A9BAB" }}>
            这些方法都有心理学依据，无需任何设备，随时随地可以做。
            找到适合你当下状态的那个。
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`chip ${activeCategory === cat ? "selected" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((tool) => (
            <div
              key={tool.id}
              className="soft-card rounded-3xl p-5 flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ border: `1px solid ${tool.border}` }}
              onClick={() => ["breathing", "grounding", "journal"].includes(tool.id) ? setActiveTool(tool.id) : undefined}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4"
                style={{ background: tool.bg }}
              >
                {tool.emoji}
              </div>
              <h3 className="text-sm font-semibold mb-1.5" style={{ color: "#2C4A58" }}>
                {tool.title}
              </h3>
              <p className="text-xs mb-3" style={{ color: tool.color }}>{tool.subtitle}</p>
              <p className="text-xs leading-relaxed flex-1 mb-4" style={{ color: "#7A9BAB" }}>
                {tool.desc}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {tool.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: `${tool.bg}`, color: tool.color }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs" style={{ color: "#A8BFC9" }}>
                  <Clock className="w-3 h-3" />
                  {tool.duration}
                </div>
              </div>
              {["breathing", "grounding", "journal"].includes(tool.id) && (
                <div
                  className="mt-4 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all"
                  style={{ background: `${tool.bg}`, color: tool.color, border: `1px solid ${tool.border}` }}
                >
                  <Play className="w-3.5 h-3.5" /> 立即开始
                </div>
              )}
              {!["breathing", "grounding", "journal"].includes(tool.id) && (
                <div
                  className="mt-4 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium"
                  style={{ background: "rgba(168,191,201,0.1)", color: "#A8BFC9" }}
                >
                  <Star className="w-3.5 h-3.5" /> 即将开放
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom tip */}
        <div className="mt-12 text-center">
          <div
            className="inline-flex items-start gap-3 px-6 py-4 rounded-2xl text-sm text-left max-w-lg"
            style={{ background: "rgba(91,168,160,0.07)", border: "1px solid rgba(91,168,160,0.15)" }}
          >
            <span className="text-lg flex-shrink-0">💡</span>
            <p style={{ color: "#7A9BAB" }}>
              这些工具是辅助，不是治疗。如果你感到情绪持续低落超过两周，
              建议寻求专业心理咨询师的帮助。
              <span className="ml-1 font-medium" style={{ color: "#5BA8A0" }}>
                心语可以帮你预约 →
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
