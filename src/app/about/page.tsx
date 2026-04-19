import Link from "next/link";
import { Heart, Shield, Eye, Users, MessageCircle, Award, ChevronDown } from "lucide-react";

const values = [
  {
    icon: <Heart className="w-6 h-6" />,
    title: "无条件接纳",
    desc: "不管你是什么原因感到难受，来到这里，都不会被评判。你的感受本身就值得被认真对待。",
    color: "#E8856D",
    bg: "rgba(232,133,109,0.08)",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "真实的倾听",
    desc: "我们设计的每一个回应，都建立在真正理解你话语背后感受的基础上，而不是模板化的安慰。",
    color: "#5BA8A0",
    bg: "rgba(91,168,160,0.08)",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "安全是第一位",
    desc: "你分享的一切都被加密保护。我们永远不会拿你的情绪数据做商业广告推送。",
    color: "#7BB3D4",
    bg: "rgba(123,179,212,0.08)",
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "透明与诚实",
    desc: "我们清楚地告诉你：这是 AI，不是人类咨询师。我们做得到什么，做不到什么，都会直接说。",
    color: "#84C5AB",
    bg: "rgba(132,197,171,0.08)",
  },
];

const notWe = [
  "不是医疗平台，不提供诊断或处方",
  "不是危机干预机构（遇到危机请拨打专业热线）",
  "不是人工咨询师（未来会提供真人预约入口）",
  "不会替代你与真实朋友、家人的真实联结",
];

const weAre = [
  "一个随时可以说话的安全空间",
  "帮你梳理情绪、理解自己的工具",
  "让你感到「有人在」的陪伴体验",
  "通往专业帮助的第一步引导",
];

const faqs = [
  {
    q: "心语的 AI 是如何工作的？",
    a: "心语使用大语言模型来理解和回应你的倾诉。AI 会尝试理解你话语背后的情感，而不只是字面意思。我们的回应经过专业心理咨询师的审核与优化，确保温柔、适度、不会造成伤害。",
  },
  {
    q: "我的聊天记录会被怎么处理？",
    a: "你的聊天记录只属于你，加密存储在我们的服务器上。我们不会分享给第三方，也不会用于商业广告。你可以随时在设置中删除所有记录。",
  },
  {
    q: "心语能帮我治疗抑郁症或焦虑症吗？",
    a: "不能。心语不是治疗工具，也不能替代专业心理治疗。如果你觉得自己可能患有心理健康问题，我们强烈建议你寻求持牌心理咨询师或精神科医生的帮助。心语可以在你寻求帮助的过程中陪伴你。",
  },
  {
    q: "可以匿名使用吗？",
    a: "可以。你可以在不注册账号的情况下体验基本功能。注册账号后，你可以保存聊天记录、情绪签到数据，但我们不强制要求你提供真实姓名或照片。",
  },
  {
    q: "心语未来会有真人咨询师吗？",
    a: "是的，这是我们正在建设的功能。未来，如果 AI 识别到你可能需要更专业的帮助，或者你主动提出，我们会提供预约持牌咨询师的入口，初次咨询将提供优惠。",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-16 min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #B8DFF8 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
        />
        <div className="max-w-4xl mx-auto px-5 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
            style={{ background: "rgba(91,168,160,0.1)", border: "1px solid rgba(91,168,160,0.25)", color: "#5BA8A0" }}
          >
            <Heart className="w-3.5 h-3.5" /> 关于心语
          </div>
          <h1 className="text-4xl md:text-5xl font-light leading-snug mb-6" style={{ color: "#2C4A58" }}>
            我们相信，每一种痛苦<br />
            <span className="font-semibold text-gradient">都值得被温柔地对待</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "#7A9BAB" }}>
            心语诞生于一个简单的出发点：很多人心里有话，却不知道说给谁听。
            夜深了，朋友不方便打扰；情绪太复杂，自己也说不清楚；
            害怕被评判，索性什么都憋着。
            <br /><br />
            我们想做那个「可以说话的地方」。
          </p>
        </div>
      </section>

      {/* We are / We are not */}
      <section className="max-w-5xl mx-auto px-5 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="soft-card rounded-3xl p-8">
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ color: "#2C4A58" }}>
              <span className="text-2xl">✅</span> 心语可以做到
            </h3>
            <ul className="space-y-3.5">
              {weAre.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(91,168,160,0.15)" }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ background: "#5BA8A0" }} />
                  </div>
                  <span className="text-sm leading-relaxed" style={{ color: "#2C4A58" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="soft-card rounded-3xl p-8" style={{ border: "1px solid rgba(168,191,201,0.3)" }}>
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ color: "#2C4A58" }}>
              <span className="text-2xl">❌</span> 心语做不到
            </h3>
            <ul className="space-y-3.5">
              {notWe.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(168,191,201,0.15)" }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ background: "#A8BFC9" }} />
                  </div>
                  <span className="text-sm leading-relaxed" style={{ color: "#7A9BAB" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16" style={{ background: "rgba(91,168,160,0.03)" }}>
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-3" style={{ color: "#2C4A58" }}>我们的设计原则</h2>
            <p style={{ color: "#7A9BAB" }}>每一个功能背后，都有这些原则在支撑</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((v, idx) => (
              <div key={idx} className="soft-card rounded-3xl p-6 flex gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: v.bg, color: v.color }}
                >
                  {v.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: "#2C4A58" }}>{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#7A9BAB" }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisor / Counselor signup */}
      <section id="join" className="py-16 max-w-5xl mx-auto px-5">
        <div className="soft-card rounded-3xl p-10 text-center" style={{ background: "rgba(91,168,160,0.05)" }}>
          <Award className="w-10 h-10 mx-auto mb-4" style={{ color: "#5BA8A0" }} />
          <h2 className="text-2xl font-semibold mb-3" style={{ color: "#2C4A58" }}>
            咨询师入驻
          </h2>
          <p className="text-base leading-relaxed mb-6 max-w-xl mx-auto" style={{ color: "#7A9BAB" }}>
            我们正在建立一支经过严格审核的持牌心理咨询师团队。
            如果你是心理咨询师，希望在心语平台提供服务，欢迎申请合作。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-sm" style={{ color: "#7A9BAB" }}>
              <Users className="w-4 h-4" style={{ color: "#5BA8A0" }} />
              需持有国家认定心理咨询师资格证
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: "#7A9BAB" }}>
              <Shield className="w-4 h-4" style={{ color: "#5BA8A0" }} />
              严格背景核查
            </div>
          </div>
          <button className="mt-6 btn-brand px-8 py-3.5 rounded-2xl font-semibold">
            申请合作（即将开放）
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="pb-20 max-w-3xl mx-auto px-5">
        <h2 className="text-3xl font-semibold mb-10 text-center" style={{ color: "#2C4A58" }}>
          常见问题
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details key={idx} className="soft-card rounded-2xl overflow-hidden group">
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none">
                <span className="text-sm font-medium pr-4" style={{ color: "#2C4A58" }}>{faq.q}</span>
                <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform group-open:rotate-180" style={{ color: "#A8BFC9" }} />
              </summary>
              <div className="px-6 pb-5">
                <div className="divider-soft mb-4" />
                <p className="text-sm leading-relaxed" style={{ color: "#7A9BAB" }}>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
