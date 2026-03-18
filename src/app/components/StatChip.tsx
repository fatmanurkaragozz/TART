import { motion } from "motion/react";

interface StatChipProps {
  value: string;
  label: string;
  delay?: number;
}

export function StatChip({ value, label, delay = 0 }: StatChipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="flex flex-col items-center gap-2 px-6 py-5 handwritten"
      style={{ 
        background: "#FFFEF5",
        border: "1.5px solid #6B6B5F",
        borderRadius: "2px",
        boxShadow: "2px 2px 0px rgba(107, 107, 95, 0.2)",
      }}
    >
      <div
        className="font-bold text-2xl typewriter"
        style={{
          color: "#2C2C28",
        }}
      >
        {value}
      </div>
      <div className="text-xs" style={{ color: "#6B6B5F" }}>
        {label}
      </div>
    </motion.div>
  );
}