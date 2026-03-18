import { motion } from "motion/react";
import { Bell, MessageSquare, ThumbsUp, UserPlus, ArrowLeft, Clock } from "lucide-react";
import { DevNav } from "../components/DevNav";

const mockNotifications = [
  {
    id: "1",
    type: "reply",
    title: "Yeni yanıt",
    message: "\"Üniversitelerde not sistemi adil mi?\" tartışmana yeni bir yanıt geldi",
    time: "5 dakika önce",
    isRead: false,
  },
  {
    id: "2",
    type: "mention",
    title: "Senden bahsedildi",
    message: "\"Kampüste ifade özgürlüğü\" tartışmasında senden bahsedildi",
    time: "2 saat önce",
    isRead: false,
  },
  {
    id: "3",
    type: "reply",
    title: "Yeni yanıt",
    message: "\"Eleştiri kültürü neden önemli?\" tartışmana yeni bir yanıt geldi",
    time: "1 gün önce",
    isRead: true,
  },
];

export default function Notifications() {
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1
            className="mb-2 typewriter"
            style={{
              fontSize: "1.75rem",
              color: "#2C2C28",
              fontWeight: 400,
            }}
          >
            Bildirimler
          </h1>
          <div
            className="h-px w-24"
            style={{ background: "#6B6B5F", opacity: 0.3 }}
          />
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-3">
          {mockNotifications.map((notification, index) => (
            <motion.a
              key={notification.id}
              href={`/topic/${notification.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="block p-5 transition-all"
              style={{
                background: notification.isRead ? "#F5F5F0" : "#FFFEF5",
                border: `1px solid ${notification.isRead ? "#E8E6E0" : "#D4D2C8"}`,
                borderRadius: "2px",
                borderLeft: `3px solid ${notification.isRead ? "#D4D2C8" : "#4A90E2"}`,
                boxShadow: notification.isRead
                  ? "none"
                  : "2px 2px 0px rgba(74, 144, 226, 0.1)",
                textDecoration: "none",
              }}
              whileHover={{
                y: -2,
                boxShadow: "2px 2px 0px rgba(107, 107, 95, 0.2)",
              }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className="mt-1 p-2"
                  style={{
                    background: notification.isRead ? "#E8E6E0" : "#E8F2FF",
                    borderRadius: "2px",
                  }}
                >
                  <MessageSquare
                    className="w-4 h-4"
                    style={{ color: notification.isRead ? "#9B9B8F" : "#4A90E2" }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className="typewriter"
                      style={{
                        fontSize: "0.9rem",
                        color: notification.isRead ? "#6B6B5F" : "#2C2C28",
                        fontWeight: 400,
                      }}
                    >
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: "#4A90E2" }}
                      />
                    )}
                  </div>
                  <p
                    className="mb-2 handwritten"
                    style={{
                      color: "#6B6B5F",
                      fontSize: "0.85rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" style={{ color: "#9B9B8F" }} />
                    <span
                      className="text-xs handwritten"
                      style={{ color: "#9B9B8F" }}
                    >
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Empty state if no notifications */}
        {mockNotifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 text-center"
            style={{
              background: "#FFFEF5",
              border: "2px dashed #D4D2C8",
              borderRadius: "2px",
            }}
          >
            <p
              className="handwritten"
              style={{ color: "#9B9B8F", fontSize: "0.95rem" }}
            >
              Henüz bildirim yok
            </p>
          </motion.div>
        )}
      </div>

      {/* Dev Navigation */}
      <DevNav />
    </div>
  );
}