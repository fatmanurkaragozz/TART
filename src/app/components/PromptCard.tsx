import { motion } from "motion/react";
import { Lightbulb } from "lucide-react";

// Daily prompts - rotates daily
const dailyPrompts = [
  "Eleştiri ne zaman yapıcı olmaktan çıkar?",
  "Başarı nasıl tanımlanmalı?",
  "Özgürlük ve düzen arasında nasıl bir denge kurulmalı?",
  "Eğitim sistemi kimi yetiştirmeli?",
  "Tartışma kültürü neden önemli?",
];

export function PromptCard() {
  // Pick a "daily" prompt (in real app, would rotate by date)
  const todayPrompt = dailyPrompts[new Date().getDate() % dailyPrompts.length];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="p-5 relative overflow-hidden"
      style={{
        background: "#FFFEF5",
        border: "1px solid #D4D2C8",
        borderRadius: "2px",
        boxShadow: "2px 2px 0px rgba(107, 107, 95, 0.15)",
      }}
    >
      {/* Sticky note accent - level 2 color */}
      <div
        className="absolute top-0 right-0 w-16 h-16 opacity-20"
        style={{
          background: "linear-gradient(135deg, transparent 50%, #F6C744 50%)",
        }}
      />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4" style={{ color: "#E85D4E" }} />
        <h3
          className="typewriter"
          style={{
            fontSize: "0.9rem",
            color: "#2C2C28",
            fontWeight: 400,
          }}
        >
          Bugün Düşün
        </h3>
      </div>

      {/* Prompt Question */}
      <p
        className="handwritten mb-3"
        style={{
          color: "#6B6B5F",
          fontSize: "0.95rem",
          lineHeight: 1.6,
        }}
      >
        {todayPrompt}
      </p>

      {/* Underline accent - ballpoint style */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="h-px"
        style={{
          background: "#E85D4E",
          transformOrigin: "left",
          opacity: 0.3,
          width: "60%",
        }}
      />

      {/* Small hint text */}
      <p
        className="mt-3 text-xs handwritten"
        style={{ color: "#9B9B8F" }}
      >
        Fikrini paylaş, tartış
      </p>
    </motion.div>
  );
}
