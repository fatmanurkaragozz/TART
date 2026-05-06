import { motion } from "motion/react";
import { ArrowLeft, Shield, FileText, Users } from "lucide-react";
import { DevNav } from "../components/DevNav";
import { useEffect, useState } from "react";

type LegalType = "privacy" | "terms" | "guidelines";

interface LegalProps {
  type: LegalType;
}

export default function Legal({ type }: LegalProps) {
  const [content, setContent] = useState({ title: "", icon: <Shield />, text: [] as string[] });

  useEffect(() => {
    switch (type) {
      case "privacy":
        setContent({
          title: "Gizlilik Politikası",
          icon: <Shield className="w-12 h-12 mb-4" style={{ color: "#4A90E2" }} />,
          text: [
            "TART olarak gizliliğinize önem veriyoruz. Bu politika, verilerinizin nasıl işlendiğini açıklar.",
            "1. Veri Toplama: Sadece platformun işleyişi için gerekli olan e-posta ve kullanıcı adı bilgilerini topluyoruz.",
            "2. Veri Kullanımı: Verileriniz, profilinizi oluşturmak ve platform içi bildirimler göndermek amacıyla kullanılır.",
            "3. Veri Güvenliği: Şifreleriniz modern hashleme yöntemleri ile korunmaktadır.",
            "4. Üçüncü Taraflar: Verileriniz asla reklam veya başka amaçlarla üçüncü taraflarla paylaşılmaz."
          ]
        });
        break;
      case "terms":
        setContent({
          title: "Kullanım Koşulları",
          icon: <FileText className="w-12 h-12 mb-4" style={{ color: "#E85D4E" }} />,
          text: [
            "TART platformunu kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.",
            "1. Sorumluluk: Paylaşılan içeriklerin sorumluluğu tamamen kullanıcıya aittir.",
            "2. Uygunluk: Diğer kullanıcılara hakaret, küfür veya tehdit içeren paylaşımlar yasaktır.",
            "3. Hesap Güvenliği: Hesabınızın güvenliğini sağlamak sizin sorumluluğunuzdadır.",
            "4. Hizmet Değişikliği: TART, önceden haber vermeksizin hizmet özelliklerini değiştirme hakkını saklı tutar."
          ]
        });
        break;
      case "guidelines":
        setContent({
          title: "Topluluk Kuralları",
          icon: <Users className="w-12 h-12 mb-4" style={{ color: "#8B9B7A" }} />,
          text: [
            "Sağlıklı bir tartışma ortamı için aşağıdaki kurallara uyulması zorunludur.",
            "1. Fikirlere Odaklanın: Tartışmalarda kişileri değil, düşünceleri eleştirin.",
            "2. Saygı: Farklı görüşlere sahip kullanıcılara karşı her zaman saygılı olun.",
            "3. Kanıt ve Mantık: Eleştirilerinizi mümkün olduğunca mantıklı temellere oturtun.",
            "4. Spam ve Taciz: Platformun huzurunu kaçıracak spam veya taciz edici davranışlar yasaktır."
          ]
        });
        break;
    }
  }, [type]);

  return (
    <div
      className="min-h-screen"
      style={{ background: "#F5F5F0", position: "relative" }}
    >
      {/* Paper texture */}
      <div
        className="fixed inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-[800px] mx-auto px-6 py-12 relative z-10">
        {/* Back Button */}
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 mb-8 text-sm handwritten transition-colors"
          style={{ color: "#6B6B5F" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Geri Dön
        </motion.a>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-10"
          style={{
            background: "#FFFEF5",
            border: "2px solid #6B6B5F",
            borderRadius: "2px",
            boxShadow: "6px 6px 0px rgba(107, 107, 95, 0.2)",
          }}
        >
          <div className="flex flex-col items-center mb-10 text-center">
            {content.icon}
            <h1
              className="mb-3 typewriter"
              style={{
                fontSize: "2rem",
                color: "#2C2C28",
                fontWeight: 400,
              }}
            >
              {content.title}
            </h1>
            <div
              className="h-px w-24"
              style={{ background: "#6B6B5F", opacity: 0.3 }}
            />
          </div>

          <div className="space-y-6">
            {content.text.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="handwritten"
                style={{
                  color: "#6B6B5F",
                  fontSize: "1.05rem",
                  lineHeight: 1.8,
                }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 pt-8 text-center"
            style={{ borderTop: "1px dashed #D4D2C8" }}
          >
            <p className="handwritten text-sm" style={{ color: "#9B9B8F" }}>
              Son güncelleme: 6 Mayıs 2026
            </p>
          </motion.div>
        </motion.div>
      </div>

      <DevNav />
    </div>
  );
}
