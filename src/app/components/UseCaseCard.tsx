import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface UseCaseCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  examples: string[];
  delay?: number;
}

export function UseCaseCard({ icon: Icon, title, description, examples, delay = 0 }: UseCaseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="p-6 rounded-2xl bg-white border h-full flex flex-col"
      style={{ borderColor: "#E5E7EB" }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{
          background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
        }}
      >
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="mb-2" style={{ color: "#0F172A", fontWeight: 700 }}>
        {title}
      </h3>
      <p className="text-[15px] mb-4" style={{ color: "#475569", lineHeight: 1.6 }}>
        {description}
      </p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {examples.map((example, index) => (
          <span
            key={index}
            className="text-xs px-3 py-1.5 rounded-lg border"
            style={{
              background: "#FFFBEB",
              color: "#D97706",
              borderColor: "#E5E7EB",
            }}
          >
            {example}
          </span>
        ))}
      </div>
    </motion.div>
  );
}