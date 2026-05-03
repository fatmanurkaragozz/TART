import { motion } from "motion/react";
import { useState } from "react";
import { Lock, CheckCircle2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import authService from "../../services/authService";
import { toast } from "sonner";

export default function ResetPassword() {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.password || !formData.confirmPassword) {
      setError("Tüm alanları doldurun");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler uyuşmuyor");
      return;
    }

    if (formData.password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(token as string, { password: formData.password });
      toast.success("Şifreniz başarıyla güncellendi!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "İşlem başarısız");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 relative"
      style={{ background: "#F5F5F0" }}
    >
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md px-6 relative z-10"
      >
        <div
          className="p-8"
          style={{
            background: "#FFFEF5",
            border: "2px solid #6B6B5F",
            borderRadius: "2px",
            boxShadow: "6px 6px 0px rgba(107, 107, 95, 0.3)",
          }}
        >
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(107, 107, 95, 0.1)" }}>
              <Lock className="w-8 h-8" style={{ color: "#2C2C28" }} />
            </div>
          </div>

          <h1 
            className="text-center mb-2 typewriter"
            style={{ fontSize: "1.75rem", color: "#2C2C28", fontWeight: 400 }}
          >
            Yeni Şifre
          </h1>
          
          <p 
            className="text-center mb-8 handwritten"
            style={{ color: "#6B6B5F", fontSize: "0.9rem" }}
          >
            Lütfen yeni şifrenizi belirleyin.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm handwritten" style={{ color: "#6B6B5F" }}>
                Yeni Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6B6B5F" }} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => { setFormData({...formData, password: e.target.value}); setError(""); }}
                  className="w-full pl-10 pr-4 py-3 typewriter"
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: "2px solid #6B6B5F",
                    borderRadius: "0",
                    color: "#2C2C28",
                    fontSize: "0.95rem",
                    outline: "none",
                  }}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm handwritten" style={{ color: "#6B6B5F" }}>
                Şifre Tekrar
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6B6B5F" }} />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => { setFormData({...formData, confirmPassword: e.target.value}); setError(""); }}
                  className="w-full pl-10 pr-4 py-3 typewriter"
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: "2px solid #6B6B5F",
                    borderRadius: "0",
                    color: "#2C2C28",
                    fontSize: "0.95rem",
                    outline: "none",
                  }}
                  placeholder="••••••••"
                />
              </div>
              {error && <p className="mt-1 text-xs handwritten" style={{ color: "#C44536" }}>{error}</p>}
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98, y: 0 }}
              disabled={isLoading}
              className="w-full py-3 mt-6 typewriter flex items-center justify-center gap-2"
              style={{
                background: isLoading ? "#6B6B5F" : "#2C2C28",
                color: "#F5F5F0",
                border: "2px solid #2C2C28",
                borderRadius: "2px",
                fontSize: "1rem",
                boxShadow: "4px 4px 0px rgba(107, 107, 95, 0.3)",
              }}
            >
              {!isLoading && <CheckCircle2 className="w-4 h-4" />}
              {isLoading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
