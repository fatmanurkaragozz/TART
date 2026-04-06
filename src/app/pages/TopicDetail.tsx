import { motion } from "motion/react";
import { ArrowLeft, MessageSquare, ThumbsUp, Flag, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { DevNav } from "../components/DevNav";
import discussionService from "../../services/discussionService";
import commentService from "../../services/commentService";
import { toast } from "sonner";

export default function TopicDetail() {
  const { id } = useParams<{ id: string }>();
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTopicDetails();
    }
  }, [id]);

  const fetchTopicDetails = async () => {
    try {
      setLoading(true);
      const response = await discussionService.getDiscussionById(id!);
      setTopic(response.data);
    } catch (error: any) {
      console.error("Tartışma detayları çekilirken hata:", error);
      toast.error(error.message || "Tartışma yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      setSubmitting(true);
      await commentService.addComment({
        content: replyText,
        discussionId: id!,
      });
      
      toast.success("Yanıtınız başarıyla eklendi.");
      setReplyText("");
      // Yeniden çekerek listeyi güncelle
      fetchTopicDetails();
    } catch (error: any) {
      console.error("Yanıt gönderilirken hata:", error);
      toast.error(error.message || "Yanıt gönderilemedi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAFAF5" }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: "#6B6B5F" }} />
          <p className="handwritten" style={{ color: "#6B6B5F" }}>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAFAF5" }}>
        <div className="text-center">
          <p className="typewriter mb-4" style={{ color: "#2C2C28" }}>Tartışma bulunamadı.</p>
          <Link to="/home" className="handwritten" style={{ color: "#4A90E2" }}>Ana sayfaya dön</Link>
        </div>
      </div>
    );
  }

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
        <Link
          to="/home"
          className="inline-flex items-center gap-2 mb-8 text-sm handwritten transition-colors"
          style={{ color: "#6B6B5F", textDecoration: 'none' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Tartışmalara dön
        </Link>

        {/* Main Topic Card */}
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
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 flex items-center justify-center typewriter"
                style={{
                  background: "#E8E6E0",
                  color: "#2C2C28",
                  fontSize: "0.85rem",
                  borderRadius: "2px",
                }}
              >
                {topic.author?.username?.substring(0, 2).toUpperCase() || "??"}
              </div>
              <div>
                <div
                  className="typewriter"
                  style={{ fontSize: "0.9rem", color: "#2C2C28" }}
                >
                  {topic.author?.username || "Bilinmeyen"}
                </div>
                <div
                  className="text-xs handwritten"
                  style={{ color: "#9B9B8F" }}
                >
                  {new Date(topic.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Report Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2"
              style={{
                background: "transparent",
                border: "1px solid #D4D2C8",
                borderRadius: "2px",
                color: "#9B9B8F",
              }}
            >
              <Flag className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Title */}
          <h1
            className="mb-4 typewriter"
            style={{
              fontSize: "1.75rem",
              color: "#2C2C28",
              fontWeight: 400,
              lineHeight: 1.3,
            }}
          >
            {topic.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {topic.tags?.map((tag: any, index: number) => (
              <span
                key={index}
                className="px-2.5 py-1 text-xs handwritten"
                style={{
                  background: "transparent",
                  border: `1px solid ${index === 0 ? "#4A90E2" : "#D4D2C8"}`,
                  borderRadius: "2px",
                  color: index === 0 ? "#4A90E2" : "#6B6B5F",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Content */}
          <div
            className="mb-6 handwritten"
            style={{
              color: "#2C2C28",
              fontSize: "1rem",
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
            }}
          >
            {topic.content}
          </div>

          {/* Color accent underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-0.5"
            style={{
              background: "#4A90E2",
              transformOrigin: "left",
              opacity: 0.3,
              width: "40%",
            }}
          />
        </motion.div>

        {/* Replies Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5" style={{ color: "#6B6B5F" }} />
            <h2
              className="typewriter"
              style={{
                fontSize: "1.1rem",
                color: "#2C2C28",
                fontWeight: 400,
              }}
            >
              Yanıtlar ({topic.comments?.length || 0})
            </h2>
          </div>

          <div className="space-y-4">
            {topic.comments && topic.comments.length > 0 ? (
              topic.comments.map((reply: any, index: number) => (
                <motion.div
                  key={reply.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                  className="p-5"
                  style={{
                    background: "#FFFEF5",
                    border: "1px solid #D4D2C8",
                    borderLeft: "3px solid #E85D4E",
                    borderRadius: "2px",
                    boxShadow: "2px 2px 0px rgba(107, 107, 95, 0.1)",
                  }}
                >
                  {/* Reply Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 flex items-center justify-center typewriter"
                      style={{
                        background: "#E8E6E0",
                        color: "#2C2C28",
                        fontSize: "0.75rem",
                        borderRadius: "2px",
                      }}
                    >
                      {reply.author?.username?.substring(0, 2).toUpperCase() || "??"}
                    </div>
                    <div>
                      <div
                        className="typewriter"
                        style={{ fontSize: "0.85rem", color: "#2C2C28" }}
                      >
                        {reply.author?.username || "Anonim"}
                      </div>
                      <div
                        className="text-xs handwritten"
                        style={{ color: "#9B9B8F" }}
                      >
                        {new Date(reply.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  </div>

                  {/* Reply Content */}
                  <p
                    className="mb-3 handwritten"
                    style={{
                      color: "#2C2C28",
                      fontSize: "0.95rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {reply.content}
                  </p>

                  {/* Like Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs typewriter"
                    style={{
                      background: "transparent",
                      border: "1px solid #D4D2C8",
                      borderRadius: "2px",
                      color: "#6B6B5F",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#4A90E2";
                      e.currentTarget.style.color = "#4A90E2";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#D4D2C8";
                      e.currentTarget.style.color = "#6B6B5F";
                    }}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {reply.votes?.length || 0}
                  </motion.button>
                </motion.div>
              ))
            ) : (
              <div className="p-8 text-center handwritten" style={{ color: "#9B9B8F" }}>
                Henüz yanıt yok. İlk yanıtı sen yaz!
              </div>
            )}
          </div>
        </motion.div>

        {/* Reply Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="p-6"
          style={{
            background: "#FFFEF5",
            border: "2px solid #6B6B5F",
            borderRadius: "2px",
            boxShadow: "3px 3px 0px rgba(107, 107, 95, 0.2)",
          }}
        >
          <h3
            className="mb-4 typewriter"
            style={{
              fontSize: "1rem",
              color: "#2C2C28",
              fontWeight: 400,
            }}
          >
            Yanıt Yaz
          </h3>

          <form onSubmit={handleSubmitReply}>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Düşüncelerini paylaş..."
              required
              rows={6}
              className="w-full px-4 py-3 mb-4 handwritten"
              style={{
                background: "transparent",
                border: "1px solid #D4D2C8",
                borderRadius: "2px",
                color: "#2C2C28",
                fontSize: "0.95rem",
                outline: "none",
                resize: "vertical",
                lineHeight: 1.7,
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#2C2C28")}
              onBlur={(e) => (e.target.style.borderColor = "#D4D2C8")}
            />

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 typewriter flex items-center gap-2"
              style={{
                background: "#2C2C28",
                color: "#F5F5F0",
                border: "2px solid #2C2C28",
                borderRadius: "2px",
                fontSize: "0.9rem",
                boxShadow: "2px 2px 0px rgba(107, 107, 95, 0.2)",
                transition: "all 0.2s ease",
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                "Yanıtla"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Dev Navigation */}
      <DevNav />
    </div>
  );
}