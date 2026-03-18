import { motion } from "motion/react";

interface TagFilterProps {
  tag: string;
  isSelected: boolean;
  onClick: () => void;
}

export function TagFilter({ tag, isSelected, onClick }: TagFilterProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="px-3 py-1.5 text-xs handwritten transition-all"
      style={{
        background: isSelected ? "#2C2C28" : "transparent",
        border: `1px solid ${isSelected ? "#2C2C28" : "#D4D2C8"}`,
        borderRadius: "2px",
        color: isSelected ? "#F5F5F0" : "#6B6B5F",
        // Level 1 color accent on hover for unselected
        ...(isSelected
          ? {}
          : {
              boxShadow: "none",
            }),
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = "#4A90E2"; // ink blue accent
          e.currentTarget.style.color = "#4A90E2";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = "#D4D2C8";
          e.currentTarget.style.color = "#6B6B5F";
        }
      }}
    >
      {tag}
    </motion.button>
  );
}
