import { motion } from "motion/react";
import { Clock } from "lucide-react";

interface TopicCardProps {
  topic: {
    id: string;
    title: string;
    preview: string;
    tags: string[];
    lastActivity: string;
    colorLevel: number; // 0-4 for color progression
  };
  delay?: number;
}

export function TopicCard({ topic, delay = 0 }: TopicCardProps) {
  // Color level system: gradually add color as users contribute
  const getColorAccent = (level: number) => {
    if (level === 0) return "#6B6B5F"; // monochrome
    if (level === 1) return "#4A90E2"; // ink blue accent
    if (level === 2) return "#E85D4E"; // red ballpoint
    if (level === 3) return "#F6C744"; // marker yellow
    return "#8B9B7A"; // personal palette green
  };

  const accentColor = getColorAccent(topic.colorLevel);

  return (
    <motion.a
      href={`/topic/${topic.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="block p-6 transition-all"
      style={{
        background: "#FFFEF5",
        border: "1px solid #D4D2C8",
        borderRadius: "2px",
        boxShadow: "2px 2px 0px rgba(107, 107, 95, 0.15)",
        textDecoration: "none",
      }}
      whileHover={{ y: -2, boxShadow: "3px 3px 0px rgba(107, 107, 95, 0.25)" }}
    >
      {/* Title */}
      <h3
        className="mb-3 typewriter"
        style={{
          fontSize: "1.1rem",
          color: "#2C2C28",
          fontWeight: 400,
          lineHeight: 1.4,
        }}
      >
        {topic.title}
      </h3>

      {/* Preview */}
      <p
        className="mb-4 handwritten"
        style={{
          color: "#6B6B5F",
          fontSize: "0.9rem",
          lineHeight: 1.6,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {topic.preview}
      </p>

      {/* Tags and Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {topic.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2.5 py-1 text-xs handwritten"
              style={{
                background: "transparent",
                border: `1px solid ${index === 0 && topic.colorLevel > 0 ? accentColor : "#D4D2C8"}`,
                borderRadius: "2px",
                color: index === 0 && topic.colorLevel > 0 ? accentColor : "#6B6B5F",
                transition: "all 0.2s ease",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Join Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-1.5 typewriter"
          style={{
            background: "transparent",
            border: "1px solid #2C2C28",
            borderRadius: "2px",
            color: "#2C2C28",
            fontSize: "0.8rem",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2C2C28";
            e.currentTarget.style.color = "#F5F5F0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#2C2C28";
          }}
          onClick={(e) => e.preventDefault()}
        >
          Katıl
        </motion.button>
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: "1px solid #E8E6E0" }}>
        <Clock className="w-3.5 h-3.5" style={{ color: "#9B9B8F" }} />
        <span className="text-xs handwritten" style={{ color: "#9B9B8F" }}>
          Son katkı: {topic.lastActivity}
        </span>
      </div>

      {/* Color level indicator - subtle underline accent */}
      {topic.colorLevel > 0 && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: delay + 0.2 }}
          className="h-0.5 mt-4"
          style={{
            background: accentColor,
            transformOrigin: "left",
            opacity: 0.4,
            width: `${20 + topic.colorLevel * 15}%`,
          }}
        />
      )}
    </motion.a>
  );
}
