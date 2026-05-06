import { motion } from "motion/react";
import { ArrowLeft, Send, Mail, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { DevNav } from "../components/DevNav";
import { toast } from "sonner";
import contactService from "../../services/contactService";

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (!userJson) {
      toast.error("İletişime geçebilmek için önce giriş yapmalısınız.");
      navigate("/login");
      return;
    }

    const user = JSON.parse(userJson);
    setFormData(prev => ({
      ...prev,
      name: user.fullName || user.username,
      email: user.email
    }));
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await contactService.sendMessage(formData);
      toast.success("Mesajınız başarıyla iletildi! En kısa sürede size döneceğiz.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Mesaj gönderilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

        {/* Main Card - Styled like a Letter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-10"
          style={{
            background: "#FFFEF5",
            border: "2px solid #6B6B5F",
            borderRadius: "2px",
            boxShadow: "8px 8px 0px rgba(107, 107, 95, 0.2)",
          }}
        >
          <div className="flex flex-col items-center mb-10 text-center">
            <Mail className="w-12 h-12 mb-4" style={{ color: "#2C2C28" }} />
            <h1
              className="mb-3 typewriter"
              style={{
                fontSize: "2rem",
                color: "#2C2C28",
                fontWeight: 400,
              }}
            >
              Bizimle İletişime Geçin
            </h1>
            <p className="handwritten" style={{ color: "#6B6B5F" }}>
              Sorularınız, önerileriniz veya şikayetleriniz için bize yazabilirsiniz.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs typewriter mb-2" style={{ color: "#6B6B5F" }}>Adınız Soyadınız</label>
                <input
                  type="text"
                  required
                  readOnly
                  value={formData.name}
                  className="w-full p-3 handwritten border-b-2 border-[#D4D2C8] outline-none bg-transparent opacity-70 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs typewriter mb-2" style={{ color: "#6B6B5F" }}>E-posta Adresiniz</label>
                <input
                  type="email"
                  required
                  readOnly
                  value={formData.email}
                  className="w-full p-3 handwritten border-b-2 border-[#D4D2C8] outline-none bg-transparent opacity-70 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs typewriter mb-2" style={{ color: "#6B6B5F" }}>Konu</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full p-3 handwritten border-b-2 border-[#D4D2C8] focus:border-[#2C2C28] outline-none bg-transparent"
                placeholder="Nasıl yardımcı olabiliriz?"
              />
            </div>

            <div>
              <label className="block text-xs typewriter mb-2" style={{ color: "#6B6B5F" }}>Mesajınız</label>
              <textarea
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-4 handwritten border-2 border-[#D4D2C8] focus:border-[#2C2C28] outline-none bg-transparent rounded-sm resize-none"
                placeholder="Düşüncelerinizi buraya dökün..."
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-[#2C2C28] text-[#F5F5F0] typewriter flex items-center justify-center gap-3 rounded-sm shadow-md transition-all"
              style={{ fontSize: "1rem" }}
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Hazırlanıyor..." : "Mesajı Gönder"}
            </motion.button>
          </form>

          <div className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: "1px dashed #D4D2C8" }}>
             <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" style={{ color: "#4A90E2" }} />
                <span className="text-xs typewriter" style={{ color: "#6B6B5F" }}>tart.platform4@gmail.com</span>
             </div>
             <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" style={{ color: "#8B9B7A" }} />
                <span className="text-xs typewriter" style={{ color: "#6B6B5F" }}>7/24 Destek</span>
             </div>
          </div>
        </motion.div>
      </div>

      <DevNav />
    </div>
  );
}
