import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface StepCardProps {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function StepCard({ number, icon: Icon, title, description, delay = 0 }: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex gap-6 items-start"
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-14 h-14 flex items-center justify-center flex-shrink-0 typewriter"
          style={{
            background: "#2C2C28",
            color: "#F5F5F0",
            border: "2px solid #2C2C28",
            borderRadius: "2px",
            fontSize: "1.25rem",
            fontWeight: 400,
          }}
        >
          {number}
        </div>
        <div
          className="w-px h-20 last:hidden"
          style={{ background: "#6B6B5F", opacity: 0.3 }}
        />
      </div>
      <div className="flex-1 pt-2">
        <div className="flex items-center gap-3 mb-3">
          <Icon className="w-5 h-5" style={{ color: "#8B9B7A" }} />
        </div>
        <h3 className="mb-3 typewriter" style={{ color: "#2C2C28", fontWeight: 400, fontSize: "1.1rem" }}>
          {title}
        </h3>
        <p className="text-sm handwritten" style={{ color: "#6B6B5F", lineHeight: 1.7 }}>
          {description}
        </p>
      </div>
    </motion.div>
  );
}