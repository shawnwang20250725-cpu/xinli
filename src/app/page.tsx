"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Heart,
  Moon,
  Briefcase,
  Users,
  Frown,
  Coffee,
  Shield,
  CheckCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const topics = [
  {
    icon: <Frown className="w-6 h-6" />,
    title: "情绪低落",
    desc: "提不起劲，什么都不想做，感觉很空",
    color: "from-sky-50 to-sky-100",
    iconBg: "#7BB3D4",
  },
  {
    icon: <Coffee className="w-6 h-6" />,
    title: "焦虑内耗",
    desc: "脑子停不下来，总担心很多事，很累",
    color: "from-sage-50 to-brand-50",
    iconBg: "#84C5AB",
  },
  {
    icon: <Moon className="w-6 h-6" />,
    title: "失眠困扰",
    desc: "夜里睡不着，躺着思绪乱飞",
    color: "from-brand-50 to-sky-50",
    iconBg: "#5BA8A0",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "工作压力",
    desc: "任务压着，不知道怎么开口说",
    color: "from-warm-50 to-sage-50",
    iconBg: "#84C5AB",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "关系困扰",
    desc: "和亲人、朋友、伴侣之间的烦恼",
    color: "from-sky-50 to-brand-50",
    iconBg: "#7BB3D4",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "孤独陪伴",
    desc: "只是想找个人说说话，不想一个人待着",
    color: "from-warm-50 to-sky-50",
    iconBg: "#E8856D",
  },
];

const steps = [
  {
    num: "01",
    title: "说说你现在的感受",
    desc: "不需要整理好再说，你想到什么就说什么。没有评判，只有倾听。",
    icon: "💬",
  },
  {
    num: "02",
    title: "我们温柔地回应",
    desc: "AI 会认真理解你说的话，用温和的方式陪你梳理情绪，不急，慢慢来。",
    icon: "🌿",
  },
  {
    num: "03",
    title: "找回一点点平静",
    desc: "我们会提供适合你当下状态的小练习和自助工具，帮你慢慢好起来。",
    icon: "✨",
  },
];

const testimonials = [
  {
    text: "那天晚上特别崩溃，不想打扰朋友，就来这里说了说。没想到回复那么温柔，说的话让我安心了很多。",
    name: "小 A",
    tag: "焦虑 / 失眠",
    avatar: "🌙",
  },
  {
    text: "我本来不相信 AI 能帮上什么，但它真的没有给我讲道理，就是陪着我说话，感觉被理解了。",
    name: "小 林",
    tag: "工作压力",
    avatar: "🌿",
  },
  {
    text: "情绪签到的功能帮我发现了我的焦虑规律，原来每周一我压力最大。知道了以后感觉好处理一点。",
    name: "晨 晨",
    tag: "情绪追踪",
    avatar: "☀️",
  },
];

const floatWords = ["你还好吗", "有人在听", "不用一个人撑"];

export default function HomePage() {
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setWordIdx((i) => (i + 1) % floatWords.length);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="pt-16">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        {/* Background blobs */}
        <div
          className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full opacity-30 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #B8DFF8 0%, transparent 70%)",
            transform: "translate(-30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full opacity-25 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #B8DFD0 0%, transparent 70%)",
            transform: "translate(30%, 30%)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #F5B8A8 0%, transparent 70%)",
            transform: "translate(-50%, -60%)",
          }}
        />

        <div className="relative w-full max-w-6xl 2xl:max-w-7xl mx-auto px-6 md:px-10 lg:px-20 py-24 md:py-32">
          {/* Tagline chip */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-10 text-sm font-medium"
            style={{
              background: "rgba(91,168,160,0.1)",
              border: "1px solid rgba(91,168,160,0.25)",
              color: "#5BA8A0",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            温柔陪伴 · 不评判 · 随时在线
          </div>

          {/* Two-column: left = title + CTA, right = description */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left */}
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-light leading-snug mb-6" style={{ color: "#2C4A58" }}>
                当你心情不好的时候，<span className="font-semibold text-gradient">来这里聊聊</span>
              </h1>

              {/* Floating words */}
              <div className="flex items-center gap-3 mb-8 justify-start">
                <div
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-500"
                  style={{
                    background: "rgba(91,168,160,0.12)",
                    color: "#5BA8A0",
                    minWidth: "80px",
                    textAlign: "center",
                  }}
                >
                  {floatWords[wordIdx]}
                </div>
                <span className="text-sm" style={{ color: "#A8BFC9" }}>
                  · 你不是一个人
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-start">
                <Link
                  href="/chat"
                  className="btn-brand inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-base"
                >
                  立即开始倾诉
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/mood"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.8)",
                    border: "1.5px solid rgba(91,168,160,0.25)",
                    color: "#5BA8A0",
                  }}
                >
                  做一个情绪测试
                </Link>
              </div>

              <p className="mt-6 text-xs" style={{ color: "#A8BFC9" }}>
                免费使用 · 匿名可用 · 数据加密保护
              </p>
            </div>

            {/* Right: description */}
            <div className="text-left lg:pl-8">
              <p className="text-xl md:text-2xl leading-relaxed font-light" style={{ color: "#7A9BAB" }}>
                这里没有说教，没有评判，
                <br />
                也没有那些无用的大道理。
              </p>
              <p className="text-xl md:text-2xl leading-relaxed font-light mt-4" style={{ color: "#5BA8A0" }}>
                只有倾听、理解，
                <br />
                和一点温柔的陪伴。
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ===== TOPICS ===== */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-semibold mb-4" style={{ color: "#2C4A58" }}>
              你可以聊任何让你感到难受的事
            </h2>
            <p className="text-base" style={{ color: "#7A9BAB" }}>
              无论大事小事，只要是你的感受，就值得被认真对待
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topics.map((topic, idx) => (
              <Link key={idx} href="/chat" className="group">
                <div className="soft-card rounded-3xl p-6 h-full transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 group-hover:border-brand/25">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white"
                    style={{ background: topic.iconBg }}
                  >
                    {topic.icon}
                  </div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: "#2C4A58" }}>
                    {topic.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#7A9BAB" }}>
                    {topic.desc}
                  </p>
                  <div
                    className="flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "#5BA8A0" }}
                  >
                    开始聊聊 <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section-padding" style={{ background: "rgba(91,168,160,0.04)" }}>
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-semibold mb-4" style={{ color: "#2C4A58" }}>
              就像和朋友聊天一样简单
            </h2>
            <p className="text-base" style={{ color: "#7A9BAB" }}>
              没有复杂的流程，只需要打开，然后说话
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="relative inline-block mb-6">
                  <div
                    className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      border: "1px solid rgba(91,168,160,0.18)",
                      boxShadow: "0 4px 20px rgba(44,74,88,0.07)",
                    }}
                  >
                    {step.icon}
                  </div>
                  <span
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center"
                    style={{ background: "#5BA8A0", color: "white" }}
                  >
                    {step.num}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: "#2C4A58" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#7A9BAB" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/chat"
              className="btn-brand inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold"
            >
              现在就开始 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-semibold mb-4" style={{ color: "#2C4A58" }}>
              他们曾经也觉得说不出口
            </h2>
            <p className="text-base" style={{ color: "#7A9BAB" }}>
              但说出来之后，好了一点点
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="soft-card rounded-3xl p-6">
                <div className="text-3xl mb-4">{t.avatar}</div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#2C4A58" }}>
                  "{t.text}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: "#7A9BAB" }}>
                    — {t.name}
                  </span>
                  <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: "rgba(91,168,160,0.1)", color: "#5BA8A0" }}
                  >
                    {t.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SAFETY DISCLAIMER ===== */}
      <section className="max-w-4xl mx-auto px-5 pb-16">
        <div
          className="rounded-3xl p-8"
          style={{
            background: "rgba(91,168,160,0.06)",
            border: "1px solid rgba(91,168,160,0.18)",
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(91,168,160,0.15)" }}
            >
              <Shield className="w-5 h-5" style={{ color: "#5BA8A0" }} />
            </div>
            <div>
              <h3 className="text-base font-semibold mb-2" style={{ color: "#2C4A58" }}>
                请放心，这里是安全的
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#7A9BAB" }}>
                心语<strong className="font-medium" style={{ color: "#2C4A58" }}>不是</strong>医疗平台，不提供诊断、治疗或处方服务。
                我们提供的是情绪陪伴、倾听和一般性的自助支持。
                如果你正在经历严重的心理健康问题，我们建议你寻求专业心理咨询师的帮助。
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  "数据加密存储",
                  "聊天记录不对外",
                  "随时可以删除",
                  "匿名使用可选",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-1.5 text-xs font-medium"
                    style={{ color: "#5BA8A0" }}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="max-w-4xl mx-auto px-5 pb-20">
        <div
          className="rounded-3xl p-10 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #5BA8A0 0%, #4A9A90 50%, #84C5AB 100%)",
          }}
        >
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20"
            style={{ background: "rgba(255,255,255,0.3)", transform: "translate(30%, -30%)" }}
          />
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            今晚，不要一个人待着
          </h2>
          <p className="text-white/80 mb-8 text-base">
            随时都可以来，不用预约，不用解释。
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-200 hover:-translate-y-1"
            style={{ background: "rgba(255,255,255,0.95)", color: "#5BA8A0" }}
          >
            开始倾诉 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
