import { motion } from "motion/react";

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  borderRadius?: string;
}

export const Skeleton = ({
  className = "",
  height = "1rem",
  width = "100%",
  borderRadius = "2px"
}: SkeletonProps) => {
  return (
    <motion.div
      className={`skeleton-base ${className}`}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 0.8 }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      style={{
        height,
        width,
        borderRadius,
        background: "#E8E6E0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
        }}
      />
    </motion.div>
  );
};

export const TopicSkeleton = () => (
  <div className="p-6 mb-4 border border-[#D4D2C8] bg-[#FFFEF5] space-y-4">
    <Skeleton width="70%" height="1.5rem" />
    <div className="space-y-2">
      <Skeleton width="100%" />
      <Skeleton width="90%" />
    </div>
    <div className="flex gap-2">
      <Skeleton width="50px" height="20px" />
      <Skeleton width="50px" height="20px" />
    </div>
  </div>
);
