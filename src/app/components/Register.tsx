import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react";

export function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = "İsim gerekli";
    if (!formData.email) newErrors.email = "E-posta gerekli";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Geçerli bir e-posta girin";
    if (!formData.password) newErrors.password = "Şifre gerekli";
    else if (formData.password.length < 8) newErrors.password = "Şifre en az 8 karakter olmalı";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Şifreler eşleşmiyor";
    if (!agreedToTerms) newErrors.terms = "Kullanım koşullarını kabul etmelisiniz";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      console.log("Registration successful", formData);
    }, 1500);
  };

  const passwordStrength = () => {
    const { password } = formData;
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 2;
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) return 3;
    return 2;
  };

  const strength = passwordStrength();
  const strengthColors = ["#D4D2C8", "#C44536", "#8B9B7A", "#8B9B7A"];
  const strengthLabels = ["", "Zayıf", "Orta", "Güçlü"];

  return (
    <div className="min-h-screen flex" style={{ background: "#FAFAF5" }}>
      {/* Left Side - Branding */}
      <div 
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: "#D4D2C8",
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
            Sessiz kalma. Tartış.
          </h1>
          <p className="text-lg max-w-md handwritten" style={{ color: "#6B6B5F", lineHeight: 1.7 }}>
            TART topluluğuna katıl ve eleştiri kültürünün bir parçası ol.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex flex-col gap-3 handwritten text-sm" style={{ color: "#6B6B5F" }}>
            <div className="flex items-center gap-2">
              <span>✓</span>
              Binlerce tartışmaya erişim
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              Kendi fikirlerini özgürce paylaş
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              Eleştirel düşünme becerini geliştir
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto" style={{ background: "#F5F5F0" }}>
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
              Kayıt Ol
            </h2>
            <p className="handwritten" style={{ color: "#6B6B5F" }}>
              Zaten hesabın var mı?{" "}
              <a href="/login" className="hover:underline typewriter" style={{ color: "#8B9B7A" }}>
                Giriş Yap
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm mb-2 typewriter" style={{ color: "#2C2C28" }}>
                İsim Soyisim
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Adınız Soyadınız"
                className="w-full px-4 py-3 handwritten transition-all outline-none"
                style={{
                  borderBottom: errors.name ? "2px solid #C44536" : "2px solid #D4D2C8",
                  background: "transparent",
                  color: "#2C2C28",
                }}
                onFocus={(e) => e.target.style.borderBottom = "2px solid #2C2C28"}
                onBlur={(e) => e.target.style.borderBottom = errors.name ? "2px solid #C44536" : "2px solid #D4D2C8"}
              />
              {errors.name && <p className="text-xs mt-1 handwritten" style={{ color: "#C44536" }}>{errors.name}</p>}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm mb-2 typewriter" style={{ color: "#2C2C28" }}>
                E-posta
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="ornek@email.com"
                className="w-full px-4 py-3 handwritten transition-all outline-none"
                style={{
                  borderBottom: errors.email ? "2px solid #C44536" : "2px solid #D4D2C8",
                  background: "transparent",
                  color: "#2C2C28",
                }}
                onFocus={(e) => e.target.style.borderBottom = "2px solid #2C2C28"}
                onBlur={(e) => e.target.style.borderBottom = errors.email ? "2px solid #C44536" : "2px solid #D4D2C8"}
              />
              {errors.email && <p className="text-xs mt-1 handwritten" style={{ color: "#C44536" }}>{errors.email}</p>}
              <p className="text-xs mt-1 handwritten" style={{ color: "#6B6B5F" }}>Herhangi bir e-posta adresi kullanabilirsiniz</p>
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
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="En az 8 karakter"
                  className="w-full px-4 py-3 pr-12 handwritten transition-all outline-none"
                  style={{
                    borderBottom: errors.password ? "2px solid #C44536" : "2px solid #D4D2C8",
                    background: "transparent",
                    color: "#2C2C28",
                  }}
                  onFocus={(e) => e.target.style.borderBottom = "2px solid #2C2C28"}
                  onBlur={(e) => e.target.style.borderBottom = errors.password ? "2px solid #C44536" : "2px solid #D4D2C8"}
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
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 transition-all"
                        style={{ background: i < strength ? strengthColors[strength] : "#E8E6E0" }}
                      />
                    ))}
                  </div>
                  {strength > 0 && (
                    <p className="text-xs handwritten" style={{ color: strengthColors[strength] }}>
                      Şifre gücü: {strengthLabels[strength]}
                    </p>
                  )}
                </div>
              )}
              {errors.password && <p className="text-xs mt-1 handwritten" style={{ color: "#C44536" }}>{errors.password}</p>}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm mb-2 typewriter" style={{ color: "#2C2C28" }}>
                Şifre Tekrar
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  placeholder="Şifrenizi tekrar girin"
                  className="w-full px-4 py-3 pr-12 handwritten transition-all outline-none"
                  style={{
                    borderBottom: errors.confirmPassword ? "2px solid #C44536" : "2px solid #D4D2C8",
                    background: "transparent",
                    color: "#2C2C28",
                  }}
                  onFocus={(e) => e.target.style.borderBottom = "2px solid #2C2C28"}
                  onBlur={(e) => e.target.style.borderBottom = errors.confirmPassword ? "2px solid #C44536" : "2px solid #D4D2C8"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" style={{ color: "#6B6B5F" }} />
                  ) : (
                    <Eye className="w-5 h-5" style={{ color: "#6B6B5F" }} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs mt-1 handwritten" style={{ color: "#C44536" }}>{errors.confirmPassword}</p>}
            </div>

            {/* Terms Checkbox */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    if (errors.terms) setErrors({ ...errors, terms: "" });
                  }}
                  className="w-4 h-4 mt-0.5"
                  style={{ accentColor: "#8B9B7A" }}
                />
                <span className="text-sm flex-1 handwritten" style={{ color: "#6B6B5F" }}>
                  <a href="#" className="hover:underline typewriter" style={{ color: "#8B9B7A" }}>Kullanım Koşulları</a>{" "}
                  ve{" "}
                  <a href="#" className="hover:underline typewriter" style={{ color: "#8B9B7A" }}>Topluluk Kuralları</a>'nı
                  okudum ve kabul ediyorum
                </span>
              </label>
              {errors.terms && <p className="text-xs mt-1 handwritten" style={{ color: "#C44536" }}>{errors.terms}</p>}
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
              {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
