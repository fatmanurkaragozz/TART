import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="p-6 handwritten"
      style={{
        background: "#FFFEF5",
        border: "1.5px solid #6B6B5F",
        borderRadius: "2px",
        boxShadow: "3px 3px 0px rgba(107, 107, 95, 0.2)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "5px 5px 0px rgba(107, 107, 95, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "3px 3px 0px rgba(107, 107, 95, 0.2)";
      }}
    >
      <div
        className="w-10 h-10 flex items-center justify-center mb-4"
        style={{
          background: "transparent",
          border: "1.5px solid #8B9B7A",
          borderRadius: "2px",
        }}
      >
        <Icon className="w-5 h-5" style={{ color: "#8B9B7A" }} />
      </div>
      <h3 className="mb-3 typewriter" style={{ color: "#2C2C28", fontWeight: 400, fontSize: "1.05rem" }}>
        {title}
      </h3>
      <p className="text-sm" style={{ color: "#6B6B5F", lineHeight: 1.7 }}>
        {description}
      </p>
    </motion.div>
  );
}