import Link from "next/link";
import { Shield, Lock, Phone, AlertTriangle, FileText, Eye, Server } from "lucide-react";

const hotlines = [
  { name: "北京心理危机研究与干预中心", number: "010-82951332", hours: "24小时" },
  { name: "全国心理援助热线", number: "400-161-9995", hours: "24小时" },
  { name: "希望24热线（情绪援助）", number: "400-161-9995", hours: "24小时" },
  { name: "生命热线", number: "400-821-1215", hours: "24小时" },
  { name: "青少年心理援助热线（广州）", number: "020-12320-5", hours: "周一至周日" },
];

const privacyPoints = [
  {
    icon: <Lock className="w-5 h-5" />,
    title: "传输加密",
    desc: "所有通信使用 TLS 1.3 加密，你的每一条消息在传输过程中都受到保护。",
  },
  {
    icon: <Server className="w-5 h-5" />,
    title: "数据存储",
    desc: "你的聊天记录和情绪数据存储在中国大陆的安全服务器上，符合相关数据保护法规。",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "不售卖数据",
    desc: "我们从不将你的个人数据出售给第三方，也不用于商业广告推送。",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "你的控制权",
    desc: "你可以随时在账户设置中查看、导出或永久删除你的所有数据。",
  },
];

export default function SafetyPage() {
  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <div className="w-16 h-16 rounded-3xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: "rgba(91,168,160,0.12)" }}
          >
            <Shield className="w-8 h-8" style={{ color: "#5BA8A0" }} />
          </div>
          <h1 className="text-4xl font-semibold mb-4" style={{ color: "#2C4A58" }}>
            安全说明
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "#7A9BAB" }}>
            你在心语分享的一切，都值得被保护。
            以下是我们如何保护你的安全，以及在危急时刻如何获得帮助。
          </p>
        </div>
      </section>

      {/* Crisis section */}
      <section className="max-w-4xl mx-auto px-5 pb-10">
        <div id="crisis" className="rounded-3xl p-8"
          style={{ background: "rgba(232,133,109,0.07)", border: "1.5px solid rgba(232,133,109,0.2)" }}
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(232,133,109,0.15)" }}
            >
              <AlertTriangle className="w-5 h-5" style={{ color: "#E8856D" }} />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: "#2C4A58" }}>
                如果你现在处于危机中
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "#7A9BAB" }}>
                如果你有伤害自己或他人的想法，或者正在经历严重的精神健康危机，
                <strong className="font-semibold" style={{ color: "#E8856D" }}>请立即联系专业危机热线</strong>，
                而不是心语 AI。心语无法提供即时危机干预。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hotlines.map((line, idx) => (
              <a key={idx} href={`tel:${line.number.replace(/-/g, "")}`}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all hover:scale-[1.02]"
                style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(232,133,109,0.2)" }}
              >
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: "#E8856D" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: "#2C4A58" }}>{line.name}</p>
                  <p className="text-base font-bold" style={{ color: "#E8856D" }}>{line.number}</p>
                </div>
                <span className="text-xs flex-shrink-0" style={{ color: "#A8BFC9" }}>{line.hours}</span>
              </a>
            ))}
          </div>

          <p className="mt-4 text-xs" style={{ color: "#A8BFC9" }}>
            * 如情况紧急，请直接拨打 110（警察）或 120（急救）
          </p>
        </div>
      </section>

      {/* What we are not */}
      <section className="max-w-4xl mx-auto px-5 pb-10">
        <div className="soft-card rounded-3xl p-8">
          <h2 className="text-xl font-semibold mb-5" style={{ color: "#2C4A58" }}>
            心语的服务边界
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "#7A9BAB" }}>
            我们希望对你完全诚实：
          </p>
          <ul className="space-y-3">
            {[
              "心语是情绪支持工具，不是医疗服务，也不是心理治疗",
              "心语 AI 无法替代持牌心理咨询师或精神科医生的专业判断",
              "心语不能监控用户的实时安全状况，不具备危机干预能力",
              "心语的回应基于 AI 生成，可能存在理解偏差或不适合的建议",
              "心语不应被视为紧急医疗支持的替代方案",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: "#A8BFC9" }} />
                <span className="text-sm leading-relaxed" style={{ color: "#7A9BAB" }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Privacy */}
      <section id="privacy" className="max-w-4xl mx-auto px-5 pb-10">
        <h2 className="text-2xl font-semibold mb-6" style={{ color: "#2C4A58" }}>隐私保护</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          {privacyPoints.map((point, idx) => (
            <div key={idx} className="soft-card rounded-2xl p-5 flex gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(91,168,160,0.1)", color: "#5BA8A0" }}
              >
                {point.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1.5" style={{ color: "#2C4A58" }}>{point.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#7A9BAB" }}>{point.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-5 text-sm leading-relaxed"
          style={{ background: "rgba(91,168,160,0.05)", border: "1px solid rgba(91,168,160,0.15)", color: "#7A9BAB" }}
        >
          <strong className="font-medium" style={{ color: "#2C4A58" }}>关于 AI 训练：</strong>
          我们默认不会使用你的聊天内容训练 AI 模型。如果你愿意匿名贡献数据以改善产品，
          可以在设置中选择开启此选项。
        </div>
      </section>

      {/* Terms */}
      <section id="terms" className="max-w-4xl mx-auto px-5 pb-20">
        <div className="soft-card rounded-3xl p-8">
          <div className="flex items-center gap-2 mb-5">
            <FileText className="w-5 h-5" style={{ color: "#5BA8A0" }} />
            <h2 className="text-xl font-semibold" style={{ color: "#2C4A58" }}>服务条款摘要</h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: "#7A9BAB" }}>
            <p>
              <strong className="font-medium" style={{ color: "#2C4A58" }}>使用条件：</strong>
              心语面向 16 岁以上用户，16 至 18 岁用户需经监护人同意。
            </p>
            <p>
              <strong className="font-medium" style={{ color: "#2C4A58" }}>用户责任：</strong>
              请不要在心语上分享可能伤害他人的信息，或使用本平台从事违法活动。
            </p>
            <p>
              <strong className="font-medium" style={{ color: "#2C4A58" }}>服务变更：</strong>
              心语可能随时更新功能或条款，重大变更会提前通知注册用户。
            </p>
            <p>
              <strong className="font-medium" style={{ color: "#2C4A58" }}>免责声明：</strong>
              心语不对因使用本服务产生的任何后果承担医疗或法律责任。
              如有健康问题，请咨询相关专业人士。
            </p>
            <p>
              <strong className="font-medium" style={{ color: "#2C4A58" }}>联系我们：</strong>
              如对安全或隐私有任何疑虑，请发送邮件至{" "}
              <a href="mailto:safety@xinyu.app" className="underline underline-offset-2" style={{ color: "#5BA8A0" }}>
                safety@xinyu.app
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
