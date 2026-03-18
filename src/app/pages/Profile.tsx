import { motion } from "motion/react";
import { ArrowLeft, Edit2, MessageSquare, Clock } from "lucide-react";
import { DevNav } from "../components/DevNav";

const mockUserTopics = [
  {
    id: "1",
    title: "Üniversitelerde not sistemi adil mi?",
    replies: 12,
    lastActivity: "2 saat önce",
    colorLevel: 2,
  },
  {
    id: "2",
    title: "Eleştiri kültürü neden önemli?",
    replies: 5,
    lastActivity: "1 gün önce",
    colorLevel: 1,
  },
];

export default function Profile() {
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

      <div className="max-w-[900px] mx-auto px-6 py-12 relative z-10">
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

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8 mb-8"
          style={{
            background: "#FFFEF5",
            border: "2px solid #6B6B5F",
            borderRadius: "2px",
            boxShadow: "4px 4px 0px rgba(107, 107, 95, 0.2)",
          }}
        >
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div
              className="w-20 h-20 flex items-center justify-center typewriter flex-shrink-0"
              style={{
                background: "#E8E6E0",
                color: "#2C2C28",
                fontSize: "1.5rem",
                borderRadius: "2px",
                border: "2px solid #D4D2C8",
              }}
            >
              BD
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1
                className="mb-2 typewriter"
                style={{
                  fontSize: "1.75rem",
                  color: "#2C2C28",
                  fontWeight: 400,
                }}
              >
                Benim Defterim
              </h1>
              <p
                className="mb-4 handwritten"
                style={{ color: "#6B6B5F", fontSize: "0.95rem" }}
              >
                Tartışmalarım, katkılarım ve düşüncelerim
              </p>

              {/* Stats - Level 3 color accents */}
              <div className="flex gap-6 mb-4">
                <div>
                  <div
                    className="typewriter"
                    style={{
                      fontSize: "1.5rem",
                      color: "#2C2C28",
                      fontWeight: 400,
                    }}
                  >
                    {mockUserTopics.length}
                  </div>
                  <div
                    className="text-xs handwritten"
                    style={{ color: "#6B6B5F" }}
                  >
                    Tartışma
                  </div>
                </div>
                <div>
                  <div
                    className="typewriter"
                    style={{
                      fontSize: "1.5rem",
                      color: "#4A90E2",
                      fontWeight: 400,
                    }}
                  >
                    {mockUserTopics.reduce((sum, t) => sum + t.replies, 0)}
                  </div>
                  <div
                    className="text-xs handwritten"
                    style={{ color: "#6B6B5F" }}
                  >
                    Yanıt
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 typewriter"
                style={{
                  background: "transparent",
                  border: "1px solid #6B6B5F",
                  borderRadius: "2px",
                  color: "#6B6B5F",
                  fontSize: "0.85rem",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#2C2C28";
                  e.currentTarget.style.color = "#2C2C28";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#6B6B5F";
                  e.currentTarget.style.color = "#6B6B5F";
                }}
              >
                <Edit2 className="w-3.5 h-3.5" />
                Profili Düzenle
              </motion.button>
            </div>
          </div>

          {/* Handwritten note accent - Level 4 personal palette */}
          <motion.div
            initial={{ opacity: 0, rotate: -1 }}
            animate={{ opacity: 1, rotate: -1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 pt-6"
            style={{ borderTop: "1px dashed #E8E6E0" }}
          >
            <p
              className="handwritten text-sm"
              style={{ color: "#8B9B7A", fontStyle: "italic" }}
            >
              "Eleştiri özgürlüğü, düşünce özgürlüğünün temelidir."
            </p>
          </motion.div>
        </motion.div>

        {/* My Topics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2
            className="mb-4 typewriter"
            style={{
              fontSize: "1.25rem",
              color: "#2C2C28",
              fontWeight: 400,
            }}
          >
            Tartışmalarım
          </h2>

          <div className="space-y-3">
            {mockUserTopics.map((topic, index) => (
              <motion.a
                key={topic.id}
                href={`/topic/${topic.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                className="block p-5 transition-all"
                style={{
                  background: "#FFFEF5",
                  border: "1px solid #D4D2C8",
                  borderRadius: "2px",
                  boxShadow: "2px 2px 0px rgba(107, 107, 95, 0.15)",
                  textDecoration: "none",
                }}
                whileHover={{
                  y: -2,
                  boxShadow: "3px 3px 0px rgba(107, 107, 95, 0.25)",
                }}
              >
                <h3
                  className="mb-3 typewriter"
                  style={{
                    fontSize: "1rem",
                    color: "#2C2C28",
                    fontWeight: 400,
                    lineHeight: 1.4,
                  }}
                >
                  {topic.title}
                </h3>

                <div className="flex items-center gap-4 text-xs">
                  <div
                    className="flex items-center gap-1.5 handwritten"
                    style={{ color: "#6B6B5F" }}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    {topic.replies} yanıt
                  </div>
                  <div
                    className="flex items-center gap-1.5 handwritten"
                    style={{ color: "#9B9B8F" }}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {topic.lastActivity}
                  </div>
                </div>

                {/* Color level underline */}
                {topic.colorLevel > 0 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="h-0.5 mt-3"
                    style={{
                      background:
                        topic.colorLevel === 1
                          ? "#4A90E2"
                          : topic.colorLevel === 2
                          ? "#E85D4E"
                          : "#F6C744",
                      transformOrigin: "left",
                      opacity: 0.4,
                      width: `${20 + topic.colorLevel * 15}%`,
                    }}
                  />
                )}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Dev Navigation */}
      <DevNav />
    </div>
  );
}