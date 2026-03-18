import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Tag as TagIcon } from "lucide-react";
import { DevNav } from "../components/DevNav";

const availableTags = [
  "Eğitim",
  "Sistem Eleştirisi",
  "Özgürlük",
  "Tartışma Kültürü",
  "Akademik Hayat",
  "Sosyal Sorunlar",
  "Teknoloji",
  "Politika",
];

export default function CreateTopic() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [] as string[],
  });

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    console.log("Creating topic:", formData);
    // Redirect to home
    window.location.href = "/home";
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "#FAFAF5", position: "relative" }}
    >
      {/* Paper texture */}
      <div
        className="fixed inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      {/* Notebook lines background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
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

      <div className="max-w-[800px] mx-auto px-6 py-12 relative z-10">
        {/* Back Button */}
        <motion.a
          href="/home"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 mb-8 text-sm handwritten transition-colors"
          style={{ color: "#6B6B5F" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#2C2C28")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#6B6B5F")}
        >
          <ArrowLeft className="w-4 h-4" />
          Ana sayfaya dön
        </motion.a>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8"
          style={{
            background: "#FFFEF5",
            border: "2px solid #6B6B5F",
            borderRadius: "2px",
            boxShadow: "4px 4px 0px rgba(107, 107, 95, 0.2)",
          }}
        >
          {/* Header */}
          <h1
            className="mb-2 typewriter"
            style={{
              fontSize: "1.75rem",
              color: "#2C2C28",
              fontWeight: 400,
            }}
          >
            Yeni Tartışma Başlat
          </h1>
          <p
            className="mb-8 handwritten"
            style={{ color: "#6B6B5F", fontSize: "0.95rem" }}
          >
            Düşünceni paylaş, topluluğu tartışmaya davet et
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block mb-2 text-sm handwritten"
                style={{ color: "#6B6B5F" }}
              >
                Başlık
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Tartışma konunu özetleyen bir başlık..."
                required
                className="w-full px-4 py-3 typewriter"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "2px solid #D4D2C8",
                  borderRadius: "0",
                  color: "#2C2C28",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) =>
                  (e.target.style.borderBottom = "2px solid #2C2C28")
                }
                onBlur={(e) =>
                  (e.target.style.borderBottom = "2px solid #D4D2C8")
                }
              />
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="content"
                className="block mb-2 text-sm handwritten"
                style={{ color: "#6B6B5F" }}
              >
                İçerik
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Düşüncelerini detaylıca açıkla, sorularını sor..."
                required
                rows={12}
                className="w-full px-4 py-3 handwritten"
                style={{
                  background: "transparent",
                  border: "1px solid #D4D2C8",
                  borderRadius: "2px",
                  color: "#2C2C28",
                  fontSize: "0.95rem",
                  outline: "none",
                  resize: "vertical",
                  lineHeight: 1.7,
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "#2C2C28")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "#D4D2C8")
                }
              />
            </div>

            {/* Tags */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TagIcon className="w-4 h-4" style={{ color: "#6B6B5F" }} />
                <label className="text-sm handwritten" style={{ color: "#6B6B5F" }}>
                  Etiketler (en fazla 3)
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <motion.button
                    key={tag}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleTag(tag)}
                    disabled={
                      !formData.tags.includes(tag) && formData.tags.length >= 3
                    }
                    className="px-3 py-1.5 text-xs handwritten transition-all"
                    style={{
                      background: formData.tags.includes(tag)
                        ? "#2C2C28"
                        : "transparent",
                      border: `1px solid ${
                        formData.tags.includes(tag) ? "#2C2C28" : "#D4D2C8"
                      }`,
                      borderRadius: "2px",
                      color: formData.tags.includes(tag) ? "#F5F5F0" : "#6B6B5F",
                      opacity:
                        !formData.tags.includes(tag) && formData.tags.length >= 3
                          ? 0.4
                          : 1,
                      cursor:
                        !formData.tags.includes(tag) && formData.tags.length >= 3
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 typewriter"
                style={{
                  background: "#2C2C28",
                  color: "#F5F5F0",
                  border: "2px solid #2C2C28",
                  borderRadius: "2px",
                  fontSize: "0.95rem",
                  boxShadow: "3px 3px 0px rgba(107, 107, 95, 0.2)",
                  transition: "all 0.2s ease",
                }}
              >
                Tartışmayı Yayınla
              </motion.button>
              <motion.a
                href="/home"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 typewriter"
                style={{
                  background: "transparent",
                  border: "1px solid #6B6B5F",
                  borderRadius: "2px",
                  color: "#6B6B5F",
                  fontSize: "0.95rem",
                  transition: "all 0.2s ease",
                }}
              >
                İptal
              </motion.a>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Dev Navigation */}
      <DevNav />
    </div>
  );
}