import { motion } from "motion/react";
import { ArrowLeft, MessageSquare, Heart, Flag, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { DevNav } from "../components/DevNav";
import discussionService from "../../services/discussionService";
import commentService from "../../services/commentService";
import { toast } from "sonner";

import { Skeleton } from "../components/Skeleton";

export default function TopicDetail() {
  const { id } = useParams<{ id: string }>();
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
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

      // Yorumları hiyerarşik yapıya dönüştür
      const flatComments = response.data.comments || [];
      const commentMap = new Map();
      const rootComments: any[] = [];

      flatComments.forEach((c: any) => {
        commentMap.set(c.id, { ...c, replies: [] });
      });

      flatComments.forEach((c: any) => {
        if (c.parentId && commentMap.has(c.parentId)) {
          commentMap.get(c.parentId).replies.push(commentMap.get(c.id));
        } else if (!c.parentId) {
          rootComments.push(commentMap.get(c.id));
        }
      });

      setTopic({ ...response.data, nestedComments: rootComments });
    } catch (error: any) {
      console.error("Tartışma detayları çekilirken hata:", error);
      toast.error(error.message || "Tartışma yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      setSubmitting(true);
      await commentService.addComment({
        content: replyText,
        discussionId: id!,
        parentId: parentId
      });

      toast.success(parentId ? "Yanıtınız başarıyla eklendi." : "Yorumunuz başarıyla eklendi.");
      setReplyText("");
      setReplyToId(null);
      // Yeniden çekerek listeyi güncelle
      fetchTopicDetails();
    } catch (error: any) {
      console.error("Yanıt gönderilirken hata:", error);
      toast.error(error.message || "Yanıt gönderilemedi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVoteDiscussion = async (value: number) => {
    // İyimser Güncelleme (Optimistic Update)
    const originalTopic = { ...topic };
    const isAdding = value === 1;

    // UI'ı hemen güncelle
    setTopic((prev: any) => ({
      ...prev,
      voteScore: (prev.voteScore || 0) + (isAdding ? 1 : -1)
    }));

    try {
      await discussionService.voteDiscussion(id!, value);
      toast.success(isAdding ? "Tartışmayı beğendiniz." : "Oyunuz geri alındı.");
      // Arka planda veriyi tazele (gerçek sayıyı teyit et)
      fetchTopicDetails();
    } catch (error: any) {
      // Hata olursa eski haline döndür
      setTopic(originalTopic);
      toast.error(error.message || "İşlem başarısız.");
    }
  };

  const handleVoteComment = async (commentId: string, value: number) => {
    try {
      await commentService.voteComment(commentId, value);
      fetchTopicDetails();
    } catch (error: any) {
      toast.error(error.message || "İşlem başarısız.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;

    try {
      await commentService.deleteComment(commentId);
      toast.success("Yorum silindi.");
      fetchTopicDetails();
    } catch (error: any) {
      toast.error(error.message || "Yorum silinemedi.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "#FAFAF5" }}>
        <div className="max-w-[900px] mx-auto px-6 py-12">
          <Skeleton width="150px" height="20px" className="mb-8" />
          <div className="p-8 mb-8 border-2 border-[#6B6B5F] bg-[#FFFEF5]">
            <Skeleton width="80%" height="2rem" className="mb-6" />
            <Skeleton width="100%" height="1rem" className="mb-2" />
            <Skeleton width="90%" height="1rem" className="mb-8" />
            <Skeleton width="120px" height="40px" />
          </div>
          <div className="space-y-6">
            <Skeleton width="200px" height="24px" className="mb-4" />
            <Skeleton width="100%" height="120px" />
            <Skeleton width="100%" height="120px" />
          </div>
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

          {/* Discussion Actions */}
          <div className="flex items-center gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleVoteDiscussion(1)}
              className="flex items-center gap-2 px-4 py-2 typewriter"
              style={{
                background: "rgba(232, 93, 78, 0.05)",
                border: "1px solid rgba(232, 93, 78, 0.2)",
                borderRadius: "2px",
                color: "#E85D4E",
              }}
            >
              <Heart className="w-4 h-4" fill={topic.voteScore > 0 ? "#E85D4E" : "none"} />
              <span>{topic.voteScore || 0} Beğeni</span>
            </motion.button>
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
            {topic.nestedComments && topic.nestedComments.length > 0 ? (
              topic.nestedComments.map((reply: any, index: number) => (
                <div key={reply.id} className="relative mb-6">
                  {/* Ana Yorum */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                    className="p-6 relative z-10"
                    style={{
                      background: "#FFFEF5",
                      border: "1px solid #D4D2C8",
                      borderLeft: "4px solid #4A90E2", // Ana yorumlar mavi çizgiyle başlar
                      borderRadius: "2px",
                      boxShadow: "3px 3px 0px rgba(107, 107, 95, 0.1)",
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 flex items-center justify-center typewriter font-bold"
                          style={{
                            background: "#E8E6E0",
                            color: "#2C2C28",
                            fontSize: "0.8rem",
                            borderRadius: "2px",
                            border: "1px solid #D4D2C8"
                          }}
                        >
                          {reply.author?.username?.substring(0, 2).toUpperCase() || "??"}
                        </div>
                        <div>
                          <div
                            className="typewriter font-medium"
                            style={{ fontSize: "0.9rem", color: "#2C2C28" }}
                          >
                            {reply.author?.username || "Anonim"}
                          </div>
                          <div
                            className="text-xs handwritten"
                            style={{ color: "#9B9B8F" }}
                          >
                            {new Date(reply.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteComment(reply.id)}
                        className="text-xs handwritten hover:text-red-500 transition-colors opacity-60 hover:opacity-100"
                      >
                        Sil
                      </button>
                    </div>

                    {/* Content */}
                    <p
                      className="mb-4 handwritten"
                      style={{
                        color: "#2C2C28",
                        fontSize: "1.05rem",
                        lineHeight: 1.7,
                        letterSpacing: "0.01em"
                      }}
                    >
                      {reply.content}
                    </p>

                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleVoteComment(reply.id, 1)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs typewriter"
                        style={{
                          background: "rgba(232, 93, 78, 0.05)",
                          border: "1px solid rgba(232, 93, 78, 0.2)",
                          borderRadius: "2px",
                          color: "#E85D4E",
                        }}
                      >
                        <Heart className="w-3.5 h-3.5" fill={reply.votes?.length > 0 ? "#E85D4E" : "none"} />
                        {reply.votes?.length || 0}
                      </motion.button>

                      <button
                        onClick={() => setReplyToId(replyToId === reply.id ? null : reply.id)}
                        className="text-xs typewriter hover:underline flex items-center gap-1"
                        style={{ color: "#6B6B5F" }}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Yanıtla
                      </button>
                    </div>

                    {/* Nested Reply Input */}
                    {replyToId === reply.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 pt-4 border-t border-dashed border-[#D4D2C8]"
                      >
                        <textarea
                          id={`reply-to-${reply.id}`}
                          name={`reply-to-${reply.id}`}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Fikrinizi buraya yazın..."
                          className="w-full p-4 mb-3 handwritten text-sm outline-none border border-[#D4D2C8] bg-[rgba(255,254,245,0.5)] focus:border-[#4A90E2] transition-colors"
                          rows={4}
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => {
                              setReplyToId(null);
                              setReplyText("");
                            }}
                            className="px-5 py-2 text-xs typewriter border border-[#D4D2C8] rounded-[2px]"
                          >
                            Vazgeç
                          </button>
                          <button
                            onClick={(e) => handleSubmitReply(e, reply.id)}
                            disabled={submitting}
                            className="px-5 py-2 text-xs typewriter bg-[#2C2C28] text-white rounded-[2px] shadow-md"
                          >
                            Yanıtı Gönder
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Yanıtlar Bölümü - Dikey Çizgi ve Girinti ile */}
                  {reply.replies && reply.replies.length > 0 && (
                    <div className="mt-2 ml-6 pl-6 relative">
                      {/* Dikey Bağlantı Çizgisi */}
                      <div
                        className="absolute left-0 top-[-20px] bottom-0 w-0.5"
                        style={{ background: "#D4D2C8", opacity: 0.6 }}
                      />

                      <div className="space-y-4">
                        {reply.replies.map((nested: any) => (
                          <div key={nested.id} className="relative">
                            {/* Yatay küçük dal çizgisi */}
                            <div
                              className="absolute left-[-24px] top-[24px] w-6 h-0.5"
                              style={{ background: "#D4D2C8", opacity: 0.6 }}
                            />

                            <motion.div
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="p-5"
                              style={{
                                background: "#FAFAF5",
                                border: "1px solid rgba(212, 210, 200, 0.8)",
                                borderLeft: "3px solid #E85D4E", // Yanıtlar turuncu çizgiyle ayrılır
                                borderRadius: "2px",
                              }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="typewriter text-[0.75rem] font-bold text-[#2C2C28]">
                                    {nested.author?.username}
                                  </span>
                                  <span className="handwritten text-[0.7rem] text-[#9B9B8F]">
                                    {new Date(nested.createdAt).toLocaleDateString('tr-TR')}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleDeleteComment(nested.id)}
                                  className="text-[0.65rem] handwritten text-[#9B9B8F] hover:text-red-500"
                                >
                                  Sil
                                </button>
                              </div>
                              <p className="handwritten text-[0.95rem] leading-relaxed mb-3" style={{ color: "#444" }}>
                                {nested.content}
                              </p>

                              <div className="flex items-center gap-3">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleVoteComment(nested.id, 1)}
                                  className="flex items-center gap-1.5 text-[0.7rem] typewriter"
                                  style={{
                                    color: nested.votes?.length > 0 ? "#E85D4E" : "#9B9B8F"
                                  }}
                                >
                                  <Heart className="w-3.5 h-3.5" fill={nested.votes?.length > 0 ? "#E85D4E" : "none"} />
                                  {nested.votes?.length || 0}
                                </motion.button>
                              </div>
                            </motion.div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
              id="main-reply-text"
              name="main-reply-text"
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