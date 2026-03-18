import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Mock validation
      if (!email || !password) {
        setError("Lütfen tüm alanları doldurun.");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#FAFAF5" }}>
      {/* Left Side - Branding */}
      <div 
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: "#E8E6E0",
        }}
      >
        {/* Paper texture */}
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10">
          <a href="/" className="flex items-center gap-2 mb-12 group handwritten">
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" style={{ color: "#6B6B5F" }} />
            <span className="text-sm" style={{ color: "#6B6B5F" }}>Ana Sayfaya Dön</span>
          </a>
          
          <div className="flex items-center gap-3 mb-8">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 8L20 32" stroke="#2C2C28" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 32L28 32" stroke="#2C2C28" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="10" cy="16" r="5" stroke="#6B6B5F" strokeWidth="1.5" fill="none"/>
              <circle cx="30" cy="16" r="5" stroke="#6B6B5F" strokeWidth="1.5" fill="none"/>
              <path d="M10 16L20 12L30 16" stroke="#2C2C28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="typewriter" style={{ color: "#2C2C28", fontSize: "1.5rem", fontWeight: 400 }}>TART</span>
          </div>

          <h1 className="text-4xl mb-4 leading-tight typewriter" style={{ color: "#2C2C28", fontWeight: 400 }}>
            Fikirlerin burada değerli.
          </h1>
          <p className="text-lg max-w-md handwritten" style={{ color: "#6B6B5F", lineHeight: 1.7 }}>
            Eleştiri kültürünü birlikte inşa ediyoruz. Giriş yap ve tartışmaya katıl.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex flex-col gap-3 handwritten">
            <div className="flex items-center gap-2 text-sm" style={{ color: "#6B6B5F" }}>
              <span>✓</span>
              Güvenli ve saygılı tartışma ortamı
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: "#6B6B5F" }}>
              <span>✓</span>
              5000+ aktif topluluk üyesi
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8" style={{ background: "#F5F5F0" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <a href="/" className="flex items-center gap-3 mb-6">
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 8L20 32" stroke="#2C2C28" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 32L28 32" stroke="#2C2C28" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="10" cy="16" r="5" stroke="#6B6B5F" strokeWidth="1.5" fill="none"/>
                <circle cx="30" cy="16" r="5" stroke="#6B6B5F" strokeWidth="1.5" fill="none"/>
                <path d="M10 16L20 12L30 16" stroke="#2C2C28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="typewriter" style={{ color: "#2C2C28", fontSize: "1.2rem", fontWeight: 400 }}>TART</span>
            </a>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl mb-2 typewriter" style={{ color: "#2C2C28", fontWeight: 400 }}>
              Giriş Yap
            </h2>
            <p className="handwritten" style={{ color: "#6B6B5F" }}>
              Hesabın yok mu?{" "}
              <a href="/register" className="hover:underline typewriter" style={{ color: "#8B9B7A" }}>
                Kayıt Ol
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm mb-2 typewriter" style={{ color: "#2C2C28" }}>
                E-posta
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full px-4 py-3 handwritten transition-all outline-none"
                  style={{
                    borderBottom: error ? "2px solid #C44536" : "2px solid #D4D2C8",
                    background: "transparent",
                    color: "#2C2C28",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderBottom = "2px solid #2C2C28";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottom = error ? "2px solid #C44536" : "2px solid #D4D2C8";
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm mb-2 typewriter" style={{ color: "#2C2C28" }}>
                Şifre
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 handwritten transition-all outline-none"
                  style={{
                    borderBottom: error ? "2px solid #C44536" : "2px solid #D4D2C8",
                    background: "transparent",
                    color: "#2C2C28",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderBottom = "2px solid #2C2C28";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottom = error ? "2px solid #C44536" : "2px solid #D4D2C8";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" style={{ color: "#6B6B5F" }} />
                  ) : (
                    <Eye className="w-5 h-5" style={{ color: "#6B6B5F" }} />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 text-sm handwritten"
                style={{ background: "#FFEAEA", color: "#C44536", border: "1px solid #C44536" }}
              >
                {error}
              </motion.div>
            )}

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between handwritten text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" style={{ accentColor: "#8B9B7A" }} />
                <span style={{ color: "#6B6B5F" }}>Beni hatırla</span>
              </label>
              <a href="#" className="hover:underline" style={{ color: "#8B9B7A" }}>
                Şifremi Unuttum
              </a>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { y: -2 } : {}}
              whileTap={!isLoading ? { y: 0 } : {}}
              className="w-full py-3 typewriter transition-all"
              style={{
                background: isLoading ? "#6B6B5F" : "#2C2C28",
                color: "#F5F5F0",
                border: "2px solid #2C2C28",
                borderRadius: "2px",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.6 : 1,
                boxShadow: isLoading ? "none" : "3px 3px 0px rgba(107, 107, 95, 0.3)",
              }}
            >
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}