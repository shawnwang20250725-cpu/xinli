"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { getOrCreateSession, saveMessage } from "@/lib/session";
import {
  Send,
  Mic,
  ChevronDown,
  Heart,
  RefreshCw,
  BookOpen,
  Phone,
  Info,
  Sparkles,
} from "lucide-react";

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
  time: string;
}

const quickEmotions = [
  { label: "😢 我很难过", prompt: "我现在心情很差，感觉很难过，什么都提不起劲来。" },
  { label: "😰 我很焦虑", prompt: "我最近很焦虑，脑子里总是停不下来，会想很多坏的可能性。" },
  { label: "😶 我感到麻木", prompt: "我感觉很麻木，不悲也不喜，就是空空的。" },
  { label: "💬 就想找人聊聊", prompt: "没有特别的事，我只是想找个人聊聊，感觉一个人有点孤独。" },
  { label: "😤 我很烦躁", prompt: "我现在很烦躁，控制不住地想发火，但不知道为什么。" },
  { label: "😴 我很累了", prompt: "我真的很累了，不只是身体上，心里也好像快撑不下去了。" },
];

// ── 安全词检测 ──────────────────────────────────────────────
const CRISIS_KEYWORDS = [
  "自杀", "自伤", "割腕", "结束生命", "不想活", "活不下去",
  "跳楼", "轻生", "去死", "伤害自己", "伤害别人", "杀",
  "绝望到极点", "没有活下去的理由",
];
const CRISIS_RESPONSE = `我听到你了，谢谢你告诉我这些。\n\n此刻你感受到的，一定非常沉重——但你不应该一个人扛着这些。\n\n请你现在拨打心理危机热线：\n📞 **全国心理援助热线：400-161-9995**（24小时）\n📞 **北京心理危机研究：010-82951332**\n\n如果你身边有信任的人，也可以直接打电话告诉他们你现在的状态。你不需要解释太多，只需要说"我现在不太好，需要你陪着我"。\n\n你联系上人了吗？`;

const isCrisis = (text: string) =>
  CRISIS_KEYWORDS.some((kw) => text.includes(kw));

// ── 降级 mock（无 API Key 时使用）────────────────────────────
const FALLBACK_KEYWORD_RESPONSES: Record<string, string[]> = {
  八卦: [
    "被人背后议论，这种感觉真的很不舒服，像是自己的事情被翻来翻去。\n\n你知道他们在说什么吗？还是只是感觉到？",
    "职场里的闲话最让人消耗，因为你没法完全控制别人说什么。\n\n这件事有影响到你平时工作的状态吗？",
    "已经好几年了……一直忍着这些，你平时有没有机会跟谁说过？",
  ],
  同事: [
    "跟同事之间的事，往往特别拧，说了怕麻烦，不说又憋着。\n\n你现在更多是哪种感觉——烦躁，还是心寒？",
    "能具体说说吗，是哪种八卦让你觉得最难受？",
    "这种事一直没处理，会很累的。你有没有想过怎么应对？",
  ],
  开会: [
    "开会本来就够压力了，还要担心背后的眼神……能说说都发生过什么吗？",
    "你说开会时他们八卦你——是当着你的面，还是你事后听到的？",
  ],
  难过: [
    "听到你说难过，心里有点放不下。\n\n能说说，是有什么事发生了，还是这种感觉就这么悄悄来的？",
    "难过了多久了？是最近突然出现的，还是积累了一段时间？",
  ],
  焦虑: [
    "那种脑子里停不下来的感觉真的很累，比身体疲惫还难受。\n\n你现在最压着你的，是哪件事？",
    "焦虑有时候很具体，有时候又说不清楚。你现在的焦虑，能找到源头吗？",
  ],
  麻木: [
    "麻木有时候是心在说：我已经撑了很久了。\n\n这种感觉是最近才有，还是已经有一段时间了？",
    "什么时候开始有这种麻木的感觉的？有没有发生过什么让你特别受伤的事？",
  ],
  孤独: [
    "能来这里说说话，就已经很好了。孤独不是你的问题，只是在告诉你，你需要被看见。\n\n今天，想聊什么都行，我在。",
    "孤独感有时候是因为身边没人，有时候是因为身边有人但没法说真心话。你是哪种？",
  ],
  烦躁: [
    "烦躁的时候，身体和心都很难受。\n\n有没有什么事，你觉得一直卡在那里、没处理完？",
    "最近让你烦躁的，主要是一件事，还是很多事搅在一起？",
  ],
  累: [
    "你说累，我听到了。不只是身体累，是那种深到骨子里的乏。\n\n是什么让你觉得快撑不住了？",
    "累了这么久，你现在最需要的是什么——休息，还是有人听你说说？",
  ],
  失眠: [
    "睡不着的夜晚格外漫长，脑子越安静反而越乱。\n\n躺下来的时候，脑子里转的是什么？",
    "失眠多久了？是每天都这样，还是有些特别难熬的夜晚？",
  ],
  压力: [
    "你一直在撑着，感觉到了吗？\n\n现在压着你的，主要是哪一块？",
    "压力大的时候，最想做什么？或者最不想做什么？",
  ],
};

// 按对话轮次递进式追问池（每轮用不同角度）
const FALLBACK_GENERIC_POOL = [
  "我在认真听。\n\n你刚才说的，能多说一点吗？",
  "这种感觉持续多久了？",
  "这些事有没有人知道？还是一直一个人扛着？",
  "你现在最不好受的，是哪个部分？",
  "面对这些，你平时怎么处理？",
  "你今天想到这件事，是有什么触发了你，还是一直都会想？",
  "如果让你用一个词形容现在的状态，你会说什么？",
];

/**
 * 根据用户输入和已有 AI 回复历史，选出不重复的降级回复。
 * @param userText 用户当前输入
 * @param usedTexts 已经出现过的所有 AI 回复（去重用）
 */
const getFallbackResponse = (userText: string, usedTexts: string[]): string => {
  // 先匹配关键词，找出候选池
  let candidates: string[] = [];
  for (const [key, resps] of Object.entries(FALLBACK_KEYWORD_RESPONSES)) {
    if (userText.includes(key)) {
      candidates = [...candidates, ...resps];
    }
  }
  // 过滤掉已用过的
  const unused = candidates.filter((r) => !usedTexts.includes(r));
  if (unused.length > 0) {
    return unused[Math.floor(Math.random() * unused.length)];
  }
  if (candidates.length > 0) {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  // 通用追问池：同样过滤已用过的
  const genericUnused = FALLBACK_GENERIC_POOL.filter((r) => !usedTexts.includes(r));
  const pool = genericUnused.length > 0 ? genericUnused : FALLBACK_GENERIC_POOL;
  return pool[Math.floor(Math.random() * pool.length)];
};

// ── 情绪分析引擎 ──────────────────────────────────────────────

const EMOTION_KEYWORDS: Record<string, string[]> = {
  焦虑: ["焦虑", "担心", "紧张", "害怕", "恐惧", "不安", "慌", "着急", "忧虑", "怕"],
  悲伤: ["难过", "悲伤", "哭", "失落", "伤心", "痛苦", "委屈", "绝望", "心碎", "难受"],
  烦躁: ["烦躁", "烦死", "生气", "愤怒", "火大", "抓狂", "崩溃", "气死"],
  麻木: ["麻木", "空空的", "没感觉", "迷茫", "空洞", "提不起劲"],
  疲惫: ["累", "疲惫", "撑不住", "没力气", "好累", "很累", "精疲力竭"],
};

const EMOTION_META: Record<string, {
  emoji: string; color: string; label: string; suggestions: string[];
}> = {
  焦虑: {
    emoji: "😰", color: "#7BB3D4", label: "情绪焦虑",
    suggestions: ["🌬️ 试试4-7-8呼吸法", "📝 写下担忧清单", "🎵 听轻音乐放松"],
  },
  悲伤: {
    emoji: "😢", color: "#A8BFC9", label: "情绪低落",
    suggestions: ["💧 允许自己哭一会儿", "📝 写下你的感受", "🤗 联系一个朋友"],
  },
  烦躁: {
    emoji: "😤", color: "#E8856D", label: "情绪烦躁",
    suggestions: ["🚶 去散步10分钟", "🌊 冷水洗脸降温", "🎮 做一件喜欢的事"],
  },
  麻木: {
    emoji: "😶", color: "#B8BFC9", label: "情绪麻木",
    suggestions: ["☀️ 出门晒晒太阳", "📚 尝试一件新事物", "🤸 做几个伸展动作"],
  },
  疲惫: {
    emoji: "😴", color: "#84C5AB", label: "身心疲惫",
    suggestions: ["😴 给自己休息的许可", "🌿 深呼吸3次", "🚶 去散步5分钟"],
  },
};

interface EmotionResult {
  emoji: string;
  label: string;
  level: string;
  color: string;
  suggestions: string[];
  bars: { label: string; value: number }[];
}

const DEFAULT_EMOTION: EmotionResult = {
  emoji: "😶",
  label: "等待感受中",
  level: "开始说说你的感受",
  color: "#A8BFC9",
  suggestions: ["🌬️ 试试4-7-8呼吸法", "📝 写下你现在的感受", "🚶 去散步5分钟"],
  bars: [{ label: "平静", value: 0 }, { label: "焦虑", value: 0 }, { label: "悲伤", value: 0 }],
};

const analyzeEmotion = (messages: Message[]): EmotionResult => {
  const userText = messages.filter((m) => m.role === "user").map((m) => m.text).join(" ");
  if (!userText.trim()) return DEFAULT_EMOTION;

  // 统计各情绪关键词命中次数
  const scores: Record<string, number> = {};
  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    scores[emotion] = keywords.reduce((acc, kw) => {
      return acc + (userText.match(new RegExp(kw, "g")) || []).length;
    }, 0);
  }

  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  // 无关键词命中 → 平静基线
  if (total === 0) {
    return {
      emoji: "🙂", label: "状态平稳", level: "情绪较为平静", color: "#84C5AB",
      suggestions: ["🌬️ 试试4-7-8呼吸法", "📝 写下你现在的感受", "🚶 去散步5分钟"],
      bars: [{ label: "平静", value: 85 }, { label: "焦虑", value: 10 }, { label: "悲伤", value: 5 }],
    };
  }

  // 各情绪百分比
  const pcts: Record<string, number> = {};
  for (const [k, v] of Object.entries(scores)) {
    pcts[k] = Math.min(Math.round((v / total) * 100), 100);
  }
  pcts["平静"] = Math.max(100 - Math.min(total * 18, 85), 5);

  // 主导情绪
  const dominant = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  const meta = EMOTION_META[dominant];
  const level = total >= 6 ? "较为强烈" : total >= 3 ? "中度波动" : "轻度波动";

  // 进度条：平静 + 前两名情绪
  const topTwo = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => k);
  const barLabels = ["平静", ...topTwo].filter((v, i, a) => a.indexOf(v) === i).slice(0, 3);

  return {
    emoji: meta.emoji, label: meta.label, level, color: meta.color, suggestions: meta.suggestions,
    bars: barLabels.map((label) => ({ label, value: pcts[label] ?? 0 })),
  };
};

const formatTime = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
};

export default function ChatPage() {
  // 用函数初始化，只在客户端首次执行，避免服务端/客户端时间不一致
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 1,
      role: "ai",
      text: "你好，我是心语。不管是什么事，不管大事小事，你都可以在这里说。\n\n我会认真地听，不评判，不急着给建议。就像和一个老朋友聊天一样。\n\n今天，你想聊什么？",
      time: formatTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [demoMode, setDemoMode] = useState(false); // true = 无 API Key，走 mock
  const [emotionState, setEmotionState] = useState<EmotionResult>(DEFAULT_EMOTION);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string | null>(null); // Supabase session id
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Prevent page scroll while on chat page
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const scrollToBottom = () => {
    const el = chatContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // 每次消息更新后重新分析情绪（仅在非流式状态时，避免频繁重渲染）
  useEffect(() => {
    if (!isStreaming) {
      setEmotionState(analyzeEmotion(messages));
    }
  }, [messages, isStreaming]);

  const handleScroll = () => {
    const el = chatContainerRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setShowScrollBtn(!isNearBottom);
  };

  /** 懒获取/创建 Supabase session，失败时静默降级 */
  const ensureSession = async (): Promise<string | null> => {
    if (sessionIdRef.current) return sessionIdRef.current;
    const id = await getOrCreateSession();
    sessionIdRef.current = id;
    return id;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const trimmed = text.trim();

    // ── 前端安全词检测（立即响应，不等 API）───────────────────
    if (isCrisis(trimmed)) {
      const userMsg: Message = { id: Date.now(), role: "user", text: trimmed, time: formatTime() };
      const crisisMsg: Message = { id: Date.now() + 1, role: "ai", text: CRISIS_RESPONSE, time: formatTime() };
      setMessages((prev) => [...prev, userMsg, crisisMsg]);
      setInput("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      return;
    }

    const userMsg: Message = { id: Date.now(), role: "user", text: trimmed, time: formatTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    // 持久化用户消息（fire-and-forget，不阻塞 UI）
    ensureSession().then((sid) => { if (sid) saveMessage(sid, "user", trimmed); });

    // Build context for API (convert role names)
    const contextMessages = [...messages, userMsg]
      .filter((m) => m.id !== 1) // skip static greeting in API context
      .map((m) => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));

    try {
      abortRef.current = new AbortController();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: contextMessages }),
        signal: abortRef.current.signal,
      });

      // ── No API key → fallback ─────────────────────────────
      if (res.status === 503) {
        setDemoMode(true);
        await new Promise((r) => setTimeout(r, 800 + Math.random() * 500));
        setIsTyping(false);
        setMessages((prev) => {
          // 收集所有已有的 AI 回复文本，用于去重
          const usedTexts = prev.filter((m) => m.role === "ai").map((m) => m.text);
          const reply = getFallbackResponse(trimmed, usedTexts);
          // 持久化 fallback AI 回复
          ensureSession().then((sid) => { if (sid) saveMessage(sid, "ai", reply); });
          return [...prev, { id: Date.now() + 1, role: "ai", text: reply, time: formatTime() }];
        });
        return;
      }

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      // ── Streaming response ────────────────────────────────
      setIsTyping(false);
      setIsStreaming(true);
      const aiMsgId = Date.now() + 1;
      setMessages((prev) => [...prev, { id: aiMsgId, role: "ai", text: "", time: formatTime() }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content ?? "";
            accumulated += delta;
            setMessages((prev) =>
              prev.map((m) => (m.id === aiMsgId ? { ...m, text: accumulated } : m))
            );
          } catch { /* ignore malformed chunks */ }
        }
      }

      // 流式传输结束后持久化完整 AI 回复
      if (accumulated) {
        ensureSession().then((sid) => { if (sid) saveMessage(sid, "ai", accumulated); });
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setIsTyping(false);
      setMessages((prev) => {
        const usedTexts = prev.filter((m) => m.role === "ai").map((m) => m.text);
        const reply = getFallbackResponse(trimmed, usedTexts);
        ensureSession().then((sid) => { if (sid) saveMessage(sid, "ai", reply); });
        return [...prev, { id: Date.now() + 1, role: "ai", text: reply, time: formatTime() }];
      });
    } finally {
      setIsTyping(false);
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isStreaming) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  };

  return (
    <div
      className="overflow-hidden flex flex-col"
      style={{ height: "100vh", paddingTop: "4rem", background: "var(--bg-gradient)", backgroundAttachment: "fixed" }}
    >
      <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full px-4 py-4 gap-4 min-h-0">

        {/* ===== CHAT MAIN ===== */}
        <div className="flex-1 flex flex-col rounded-3xl overflow-hidden glass-card min-w-0 min-h-0">

          {/* Chat header */}
          <div className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(91,168,160,0.12)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                style={{ background: "linear-gradient(135deg,#5BA8A0,#84C5AB)" }}
              >
                🌿
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#2C4A58" }}>心语陪伴</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ background: "#84C5AB" }} />
                  <p className="text-xs" style={{ color: "#84C5AB" }}>随时在线，等你说话</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                title="重新开始"
                className="p-2 rounded-xl transition-colors hover:bg-brand/8"
                onClick={() => setMessages(initialMessages)}
              >
                <RefreshCw className="w-4 h-4" style={{ color: "#A8BFC9" }} />
              </button>
              <Link href="/toolbox" title="工具箱">
                <button className="p-2 rounded-xl transition-colors hover:bg-brand/8">
                  <BookOpen className="w-4 h-4" style={{ color: "#A8BFC9" }} />
                </button>
              </Link>
            </div>
          </div>

          {/* Demo mode banner */}
          {demoMode && (
            <div
              className="mx-4 mt-3 rounded-2xl px-4 py-2.5 flex items-center gap-2.5"
              style={{ background: "rgba(245,166,125,0.1)", border: "1px solid rgba(245,166,125,0.25)" }}
            >
              <span className="text-sm flex-shrink-0">⚠️</span>
              <p className="text-xs leading-relaxed" style={{ color: "#c2784a" }}>
                当前为<strong className="font-semibold">演示模式</strong>（固定回复）。
                配置 <code className="px-1 py-0.5 rounded text-xs" style={{ background: "rgba(245,166,125,0.15)" }}>ARK_API_KEY</code> 后即可启用真实 AI 对话。
              </p>
            </div>
          )}

          {/* Welcome bar */}
          <div
            className="mx-4 mt-3 rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{ background: "rgba(91,168,160,0.07)", border: "1px solid rgba(91,168,160,0.15)" }}
          >
            <Sparkles className="w-4 h-4 flex-shrink-0" style={{ color: "#5BA8A0" }} />
            <p className="text-xs leading-relaxed" style={{ color: "#7A9BAB" }}>
              这里是安全的空间。你说的任何话，都不会被评判。
              随时可以暂停、离开，也随时可以回来。
            </p>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-5 min-h-0"
            onScroll={handleScroll}
          >
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3`}>
                {msg.role === "ai" && (
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                    style={{ background: "linear-gradient(135deg,#5BA8A0,#84C5AB)" }}
                  >
                    🌿
                  </div>
                )}
                <div className={`max-w-[72%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div
                    className={`px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                      msg.role === "user" ? "bubble-user" : "bubble-ai"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-xs px-1" style={{ color: "#A8BFC9" }} suppressHydrationWarning>{msg.time}</span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#5BA8A0,#84C5AB)" }}
                >
                  🌿
                </div>
                <div className="bubble-ai px-4 py-3.5 flex items-center gap-1.5">
                  <span className="typing-dot w-2 h-2 rounded-full" style={{ background: "#84C5AB", display: "inline-block" }} />
                  <span className="typing-dot w-2 h-2 rounded-full" style={{ background: "#84C5AB", display: "inline-block" }} />
                  <span className="typing-dot w-2 h-2 rounded-full" style={{ background: "#84C5AB", display: "inline-block" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Scroll to bottom button */}
          {showScrollBtn && (
            <button
              className="absolute bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium shadow-lg"
              style={{ background: "white", color: "#5BA8A0", border: "1px solid rgba(91,168,160,0.2)" }}
              onClick={scrollToBottom}
            >
              <ChevronDown className="w-3.5 h-3.5" /> 新消息
            </button>
          )}


          {/* Input area */}
          <div
            className="px-4 pb-4"
            style={{ borderTop: "1px solid rgba(91,168,160,0.1)", paddingTop: "12px" }}
          >
            <div
              className="flex items-end gap-3 rounded-2xl px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.95)",
                border: "1.5px solid rgba(91,168,160,0.2)",
              }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={autoResize}
                onKeyDown={handleKeyDown}
                placeholder="说说你现在的感受… (Enter 发送，Shift+Enter 换行)"
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm outline-none"
                style={{ color: "#2C4A58", minHeight: "24px", maxHeight: "140px", lineHeight: "1.6" }}
              />
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  className="p-2 rounded-xl transition-colors hover:bg-brand/8"
                  title="语音输入（即将开放）"
                >
                  <Mic className="w-4 h-4" style={{ color: "#A8BFC9" }} />
                </button>
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isStreaming}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-40"
                  style={{
                    background: input.trim() && !isStreaming ? "#5BA8A0" : "rgba(91,168,160,0.2)",
                    boxShadow: input.trim() && !isStreaming ? "0 4px 12px rgba(91,168,160,0.3)" : "none",
                  }}
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            <p className="text-center text-xs mt-2" style={{ color: "#A8BFC9" }}>
              心语不是医疗服务 · 如有紧急情况请拨打
              <a href="tel:400-161-9995" className="font-medium ml-1" style={{ color: "#5BA8A0" }}>
                400-161-9995
              </a>
            </p>
          </div>
        </div>

        {/* ===== RIGHT SIDEBAR ===== */}
        <div className="hidden lg:flex flex-col w-72 gap-4 overflow-y-auto min-h-0">

          {/* Emotion Recognition */}
          <div className="glass-card rounded-3xl p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "#2C4A58" }}>
              <Heart className="w-4 h-4" style={{ color: "#E8856D" }} />
              当前情绪识别
            </h3>
            <div
              className="rounded-2xl p-4 mb-4 text-center"
              style={{ background: `rgba(123,179,212,0.1)`, border: `1px solid rgba(123,179,212,0.25)` }}
            >
              <div className="text-3xl mb-2">{emotionState.emoji}</div>
              <p className="text-sm font-semibold" style={{ color: emotionState.color }}>
                {emotionState.label}
              </p>
              <p className="text-xs mt-1" style={{ color: "#A8BFC9" }}>{emotionState.level}</p>
            </div>

            {/* Emotion bar */}
            <div className="space-y-2 mb-4">
              {emotionState.bars.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1" style={{ color: "#7A9BAB" }}>
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "rgba(91,168,160,0.12)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.value}%`, background: "#5BA8A0" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-xs" style={{ color: "#A8BFC9" }}>
              <Info className="w-3 h-3" />
              基于对话内容估算，仅供参考
            </div>
          </div>

          {/* Suggestions */}
          <div className="glass-card rounded-3xl p-5">
            <h3 className="text-sm font-semibold mb-4" style={{ color: "#2C4A58" }}>
              💡 推荐安抚方式
            </h3>
            <div className="space-y-2.5">
              {emotionState.suggestions.map((s, i) => (
                <Link key={i} href="/toolbox">
                  <div
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all hover:-translate-y-0.5"
                    style={{
                      background: "rgba(91,168,160,0.06)",
                      border: "1px solid rgba(91,168,160,0.12)",
                    }}
                  >
                    <span className="text-sm">{s}</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="/toolbox"
              className="block text-center text-xs mt-4 py-2 rounded-xl transition-colors font-medium"
              style={{ color: "#5BA8A0", background: "rgba(91,168,160,0.08)" }}
            >
              查看全部工具 →
            </Link>
          </div>

          {/* Crisis */}
          <div
            className="rounded-3xl p-5"
            style={{ background: "rgba(232,133,109,0.07)", border: "1px solid rgba(232,133,109,0.18)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-4 h-4" style={{ color: "#E8856D" }} />
              <h3 className="text-sm font-semibold" style={{ color: "#2C4A58" }}>需要人工帮助？</h3>
            </div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: "#7A9BAB" }}>
              如果你有自伤或伤害他人的想法，请立即联系专业热线。
            </p>
            <a
              href="tel:400-161-9995"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white w-full"
              style={{ background: "#E8856D" }}
            >
              <Phone className="w-3.5 h-3.5" />
              400-161-9995
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
