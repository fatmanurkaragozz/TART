import { motion } from "motion/react";
import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router";
import { NavLink } from "../components/NavLink";
import { DevNav } from "../components/DevNav";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock validation
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    
    if (!formData.name) newErrors.name = "İsim gerekli";
    if (!formData.email) newErrors.email = "E-posta gerekli";
    if (!formData.password) newErrors.password = "Şifre gerekli";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Şifreler eşleşmiyor";
    }
    
    setErrors(newErrors);
    
    // Eğer hata yoksa Home sayfasına yönlendir
    const hasErrors = Object.values(newErrors).some(error => error !== "");
    if (!hasErrors) {
      setTimeout(() => {
        setIsLoading(false);
        navigate("/home");
      }, 1000);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 relative"
      style={{ background: "#F5F5F0" }}
    >
      {/* Paper texture */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      {/* Notebook lines background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 40 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              y1={i * 40 + 20}
              x2="100%"
              y2={i * 40 + 20}
              stroke="#6B6B5F"
              strokeWidth="0.5"
              opacity="0.3"
            />
          ))}
          <line
            x1="80"
            y1="0"
            x2="80"
            y2="100%"
            stroke="#C44536"
            strokeWidth="1"
            opacity="0.2"
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md px-6 relative z-10"
      >
        {/* Card */}
        <div
          className="p-8"
          style={{
            background: "#FFFEF5",
            border: "2px solid #6B6B5F",
            borderRadius: "2px",
            boxShadow: "6px 6px 0px rgba(107, 107, 95, 0.3)",
          }}
        >
          {/* Logo */}
          <NavLink to="/" className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 8L20 32" stroke="#2C2C28" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 32L28 32" stroke="#2C2C28" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="10" cy="16" r="5" stroke="#6B6B5F" strokeWidth="1.5" fill="none"/>
                <circle cx="30" cy="16" r="5" stroke="#6B6B5F" strokeWidth="1.5" fill="none"/>
                <path d="M10 16L20 12L30 16" stroke="#2C2C28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span 
                className="typewriter"
                style={{ 
                  fontSize: "1.5rem",
                  color: "#2C2C28",
                  fontWeight: 400,
                }}
              >
                TART
              </span>
            </div>
          </NavLink>

          {/* Title */}
          <h1 
            className="text-center mb-2 typewriter"
            style={{ 
              fontSize: "1.75rem",
              color: "#2C2C28",
              fontWeight: 400,
            }}
          >
            Kayıt Ol
          </h1>
          
          <p 
            className="text-center mb-8 handwritten"
            style={{ color: "#6B6B5F", fontSize: "0.9rem" }}
          >
            Eleştiri kültürüne katıl
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label 
                htmlFor="name"
                className="block mb-2 text-sm handwritten"
                style={{ color: "#6B6B5F" }}
              >
                İsim
              </label>
              <div className="relative">
                <User 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "#6B6B5F" }}
                />
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 typewriter"
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: errors.name ? "2px solid #C44536" : "2px solid #6B6B5F",
                    borderRadius: "0",
                    color: "#2C2C28",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                  placeholder="Adın Soyadın"
                  onFocus={(e) => e.target.style.borderBottom = "2px solid #2C2C28"}
                  onBlur={(e) => e.target.style.borderBottom = errors.name ? "2px solid #C44536" : "2px solid #6B6B5F"}
                />
              </div>
              {errors.name && (
                <p 
                  className="mt-1 text-xs handwritten"
                  style={{ color: "#C44536" }}
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label 
                htmlFor="email"
                className="block mb-2 text-sm handwritten"
                style={{ color: "#6B6B5F" }}
              >
                E-posta
              </label>
              <div className="relative">
                <Mail 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "#6B6B5F" }}
                />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 typewriter"
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: errors.email ? "2px solid #C44536" : "2px solid #6B6B5F",
                    borderRadius: "0",
                    color: "#2C2C28",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                  placeholder="ornek@mail.com"
                  onFocus={(e) => e.target.style.borderBottom = "2px solid #2C2C28"}
                  onBlur={(e) => e.target.style.borderBottom = errors.email ? "2px solid #C44536" : "2px solid #6B6B5F"}
                />
              </div>
              {errors.email && (
                <p 
                  className="mt-1 text-xs handwritten"
                  style={{ color: "#C44536" }}
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label 
                htmlFor="password"
                className="block mb-2 text-sm handwritten"
                style={{ color: "#6B6B5F" }}
              >
                Şifre
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "#6B6B5F" }}
                />
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 typewriter"
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: errors.password ? "2px solid #C44536" : "2px solid #6B6B5F",
                    borderRadius: "0",
                    color: "#2C2C28",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                  placeholder="••••••••"
                  onFocus={(e) => e.target.style.borderBottom = "2px solid #2C2C28"}
                  onBlur={(e) => e.target.style.borderBottom = errors.password ? "2px solid #C44536" : "2px solid #6B6B5F"}
                />
              </div>
              {errors.password && (
                <p 
                  className="mt-1 text-xs handwritten"
                  style={{ color: "#C44536" }}
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label 
                htmlFor="confirmPassword"
                className="block mb-2 text-sm handwritten"
                style={{ color: "#6B6B5F" }}
              >
                Şifre Tekrar
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "#6B6B5F" }}
                />
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 typewriter"
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: errors.confirmPassword ? "2px solid #C44536" : "2px solid #6B6B5F",
                    borderRadius: "0",
                    color: "#2C2C28",
                    fontSize: "0.95rem",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                  placeholder="••••••••"
                  onFocus={(e) => e.target.style.borderBottom = "2px solid #2C2C28"}
                  onBlur={(e) => e.target.style.borderBottom = errors.confirmPassword ? "2px solid #C44536" : "2px solid #6B6B5F"}
                />
              </div>
              {errors.confirmPassword && (
                <p 
                  className="mt-1 text-xs handwritten"
                  style={{ color: "#C44536" }}
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98, y: 0 }}
              disabled={isLoading}
              className="w-full py-3 mt-6 typewriter"
              style={{
                background: isLoading ? "#6B6B5F" : "#2C2C28",
                color: "#F5F5F0",
                border: "2px solid #2C2C28",
                borderRadius: "2px",
                fontSize: "1rem",
                fontWeight: 400,
                boxShadow: "4px 4px 0px rgba(107, 107, 95, 0.3)",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px" style={{ background: "#D4D2C8" }} />
            <span 
              className="text-xs handwritten"
              style={{ color: "#6B6B5F" }}
            >
              veya
            </span>
            <div className="flex-1 h-px" style={{ background: "#D4D2C8" }} />
          </div>

          {/* Login Link */}
          <p 
            className="text-center text-sm handwritten"
            style={{ color: "#6B6B5F" }}
          >
            Zaten hesabın var mı?{" "}
            <NavLink 
              to="/login"
              className="typewriter"
              style={{ 
                color: "#2C2C28",
                textDecoration: "underline",
              }}
            >
              Giriş Yap
            </NavLink>
          </p>
        </div>

        {/* Back to Home */}
        <NavLink
          to="/"
          className="block text-center mt-6 text-sm handwritten"
          style={{ color: "#6B6B5F" }}
        >
          ← Ana sayfaya dön
        </NavLink>
      </motion.div>

      {/* Dev Navigation */}
      <DevNav />
    </div>
  );
}