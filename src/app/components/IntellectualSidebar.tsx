import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Film, FileText, Video, Cpu, User, Plus, Loader2 } from "lucide-react";
import recommendationService from "../../services/recommendationService";
import { toast } from "sonner";

interface Recommendation {
  id: string;
  title: string;
  type: string;
  label: string;
  coverUrl?: string;
  description: string;
  isAi: boolean;
  author?: {
    username: string;
    fullName?: string;
  };
}

interface RecommendationsState {
  authorRecommendations: Recommendation[];
  communityRecommendations: Recommendation[];
  aiRecommendations: Recommendation[];
}

interface IntellectualSidebarProps {
  discussionId?: string;
}

export function IntellectualSidebar({ discussionId }: IntellectualSidebarProps) {
  const [generalRecs, setGeneralRecs] = useState<Recommendation[]>([]);
  const [discussionRecs, setDiscussionRecs] = useState<RecommendationsState>({
    authorRecommendations: [],
    communityRecommendations: [],
    aiRecommendations: [],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form States
  const [title, setTitle] = useState("");
  const [type, setType] = useState("BOOK");
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [expandedRecs, setExpandedRecs] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedRecs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    fetchRecommendations();
  }, [discussionId]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      if (discussionId) {
        const res = await recommendationService.getDiscussionRecommendations(discussionId);
        setDiscussionRecs(res.data);
      } else {
        const res = await recommendationService.getGeneralRecommendations();
        setGeneralRecs(res.data || []);
      }
    } catch (err: any) {
      console.error("Öneriler yüklenirken hata:", err);
      toast.error("Öneri önerileri yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Lütfen başlık ve açıklama alanlarını doldurun");
      return;
    }

    try {
      setSubmitting(true);
      // Şablon bir etiket oluştur
      let finalLabel = label.trim();
      if (!finalLabel) {
        const typeLabels: Record<string, string> = {
          BOOK: "Kitap Önerisi",
          FILM: "Film Önerisi",
          ARTICLE: "Makale Önerisi",
          DOCUMENTARY: "Belgesel Önerisi",
        };
        finalLabel = typeLabels[type] || "Kaynak Önerisi";
      }

      await recommendationService.createRecommendation({
        title,
        type,
        label: finalLabel,
        description,
        discussionId: discussionId || null,
      });

      toast.success("Entelektüel öneriniz paylaşıldı!");
      setTitle("");
      setLabel("");
      setDescription("");
      setShowForm(false);
      fetchRecommendations();
    } catch (err: any) {
      toast.error(err.message || "Öneri paylaşılırken hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  // Kart Kapak Stilleri
  const getCoverStyle = (type: string) => {
    switch (type) {
      case "BOOK":
        return {
          background: "linear-gradient(135deg, #E85D4E 0%, #C44536 100%)",
          color: "#FAFAF5",
          icon: <BookOpen className="w-5 h-5 mb-1 opacity-90" />,
        };
      case "FILM":
        return {
          background: "linear-gradient(135deg, #4A90E2 0%, #2A6BB8 100%)",
          color: "#FAFAF5",
          icon: <Film className="w-5 h-5 mb-1 opacity-90" />,
        };
      case "ARTICLE":
        return {
          background: "linear-gradient(135deg, #8B9B7A 0%, #687958 100%)",
          color: "#FAFAF5",
          icon: <FileText className="w-5 h-5 mb-1 opacity-90" />,
        };
      case "DOCUMENTARY":
        return {
          background: "linear-gradient(135deg, #F6C744 0%, #D4A316 100%)",
          color: "#2C2C28",
          icon: <Video className="w-5 h-5 mb-1 opacity-90" />,
        };
      default:
        return {
          background: "linear-gradient(135deg, #E8E6E0 0%, #D4D2C8 100%)",
          color: "#2C2C28",
          icon: <BookOpen className="w-5 h-5 mb-1 opacity-90" />,
        };
    }
  };

  const renderCard = (rec: Recommendation) => {
    const cover = getCoverStyle(rec.type);
    return (
      <motion.div
        key={rec.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3 p-4 mb-0 lg:mb-4 border border-[#D4D2C8] bg-[#FFFEF5] hover:-translate-y-0.5 transition-all w-[290px] sm:w-[320px] lg:w-auto flex-shrink-0 snap-start"
        style={{
          borderRadius: "2px",
          boxShadow: "2px 2px 0px rgba(107, 107, 95, 0.1)",
        }}
      >
        {/* CSS Kapak Tasarımı */}
        <div
          className="w-[72px] h-[96px] flex-shrink-0 flex flex-col items-center justify-center p-2 text-center select-none"
          style={{
            background: cover.background,
            color: cover.color,
            borderRadius: "2px",
            boxShadow: "1px 1px 3px rgba(0,0,0,0.15)",
          }}
        >
          {cover.icon}
          <span className="text-[7px] font-bold typewriter uppercase tracking-widest leading-none mb-1">
            {rec.type === 'FILM' ? 'FİLM' : rec.type === 'BOOK' ? 'KİTAP' : rec.type === 'ARTICLE' ? 'MAKALE' : 'BELGESEL'}
          </span>
          <span className="text-[8px] font-medium typewriter line-clamp-2 leading-[9px] w-full break-all">
            {rec.title.split("-").shift()?.trim()}
          </span>
        </div>

        {/* Detaylar */}
        <div className="flex-1 min-w-0">
          <span
            className="inline-block text-[10px] px-1.5 py-0.5 border border-[#D4D2C8] rounded-sm typewriter mb-1"
            style={{ color: "#6B6B5F" }}
          >
            {rec.label}
          </span>
          <h4 className="typewriter text-xs font-bold text-[#2C2C28] line-clamp-2 mb-1">
            {rec.title}
          </h4>
          <p 
            onClick={() => toggleExpand(rec.id)}
            className={`handwritten text-[11px] text-[#6B6B5F] leading-4 mb-1 cursor-pointer hover:text-[#2C2C28] transition-colors ${expandedRecs[rec.id] ? "" : "line-clamp-3"}`}
            title={expandedRecs[rec.id] ? "Daralt" : "Devamını oku (Tıkla)"}
          >
            {rec.description}
          </p>

          {/* Öneren Bilgisi */}
          <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-dashed border-[#E8E6E0]">
            {rec.isAi ? (
              <>
                <Cpu className="w-3 h-3 text-[#8B9B7A]" />
                <span className="typewriter text-[9px] text-[#8B9B7A] font-medium">Yapay Zeka Önerisi</span>
              </>
            ) : (
              <>
                <User className="w-3 h-3 text-[#9B9B8F]" />
                <span className="typewriter text-[9px] text-[#9B9B8F]">
                  @{rec.author?.username || "anonim"}
                </span>
              </>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-5 flex flex-col h-fit"
      style={{
        background: "#FFFEF5",
        border: "1px solid #D4D2C8",
        borderRadius: "2px",
        boxShadow: "2px 2px 0px rgba(107, 107, 95, 0.15)",
      }}
    >
      {/* Başlık */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#D4D2C8]">
        <div>
          <h3 className="typewriter text-sm font-medium" style={{ color: "#8B9B7A" }}>
            {discussionId ? "Tartışma Önerileri" : "Entelektüel Derinlik"}
          </h3>
          <span className="handwritten text-[10px] text-[#9B9B8F]">Önerilen entelektüel kaynaklar</span>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="p-1 border border-[#D4D2C8] hover:bg-[#E8E6E0] rounded-sm transition-colors"
            title="Öneri Paylaş"
          >
            <Plus className="w-4 h-4 text-[#6B6B5F]" />
          </button>
        )}
      </div>

      {/* İçerik */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#8B9B7A]" />
          <span className="handwritten text-xs text-[#9B9B8F]">Öneriler yükleniyor...</span>
        </div>
      ) : (
        <div className="flex-1 lg:overflow-y-auto pr-1 lg:max-h-[600px] custom-scrollbar">
          {/* Form Bölümü */}
          <AnimatePresence>
            {showForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmit}
                className="p-4 mb-4 border border-[#E85D4E] bg-[#FAFAF5] space-y-3"
                style={{ borderRadius: "2px" }}
              >
                <div className="flex justify-between items-center pb-1 border-b border-dashed border-[#D4D2C8]">
                  <span className="typewriter text-xs font-bold text-[#E85D4E]">Kaynak Öner</span>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-[10px] typewriter text-[#9B9B8F] hover:underline"
                  >
                    Kapat
                  </button>
                </div>

                {/* Kaynak Adı */}
                <div>
                  <input
                    type="text"
                    placeholder="Kaynak Adı (örn: George Orwell - 1984)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-[#D4D2C8] bg-transparent outline-none text-xs typewriter rounded-sm"
                  />
                </div>

                {/* Tür Seçimi */}
                <div className="flex gap-2">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="flex-1 p-2 border border-[#D4D2C8] bg-transparent outline-none text-[11px] typewriter rounded-sm"
                  >
                    <option value="BOOK">Kitap</option>
                    <option value="FILM">Film</option>
                    <option value="ARTICLE">Makale</option>
                    <option value="DOCUMENTARY">Belgesel</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Konu/Etiket (örn: Gözetim)"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="flex-1 p-2 border border-[#D4D2C8] bg-transparent outline-none text-[11px] typewriter rounded-sm"
                  />
                </div>

                {/* Neden Tüketilmeli? */}
                <div>
                  <textarea
                    placeholder="Neden okunmalı / izlenmeli? Tartışmaya nasıl bir derinlik katar?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-[#D4D2C8] bg-transparent outline-none text-xs handwritten rounded-sm"
                  />
                </div>

                {/* Gönder butonu */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2 bg-[#2C2C28] text-[#F5F5F0] text-xs font-bold typewriter hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                  style={{ borderRadius: "2px" }}
                >
                  {submitting && <Loader2 className="w-3 h-3 animate-spin" />}
                  Öneriyi Paylaş
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Tartışmaya Özel Katmanlı Görünüm */}
          {discussionId ? (
            <div className="space-y-6 lg:space-y-4">
              {/* Katman A: Tartışma Yazarının Önerileri */}
              {discussionRecs.authorRecommendations.length > 0 && (
                <div>
                  <h4 className="typewriter text-[10px] font-bold text-[#C44536] uppercase tracking-wider mb-2">
                    Yazarın Önerileri
                  </h4>
                  <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-4 lg:gap-0 snap-x snap-mandatory">
                    {discussionRecs.authorRecommendations.map(renderCard)}
                  </div>
                </div>
              )}

              {/* Katman B: Topluluk & Katılımcı Önerileri */}
              {discussionRecs.communityRecommendations.length > 0 && (
                <div>
                  <h4 className="typewriter text-[10px] font-bold text-[#4A90E2] uppercase tracking-wider mb-2">
                    Topluluk Önerileri
                  </h4>
                  <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-4 lg:gap-0 snap-x snap-mandatory">
                    {discussionRecs.communityRecommendations.map(renderCard)}
                  </div>
                </div>
              )}

              {/* Katman C: Yapay Zeka Önerileri */}
              {discussionRecs.aiRecommendations.length > 0 && (
                <div>
                  <h4 className="typewriter text-[10px] font-bold text-[#8B9B7A] uppercase tracking-wider mb-2">
                    Yapay Zeka Analizi
                  </h4>
                  <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-4 lg:gap-0 snap-x snap-mandatory">
                    {discussionRecs.aiRecommendations.map(renderCard)}
                  </div>
                </div>
              )}

              {discussionRecs.authorRecommendations.length === 0 &&
                discussionRecs.communityRecommendations.length === 0 &&
                discussionRecs.aiRecommendations.length === 0 && (
                  <p className="handwritten text-xs text-[#9B9B8F] text-center py-6">
                    Henüz bir öneri bulunamadı.
                  </p>
                )}
            </div>
          ) : (
            /* Genel/Ana Sayfa Görünümü */
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-4 lg:gap-0 snap-x snap-mandatory">
              {generalRecs.length > 0 ? (
                generalRecs.map(renderCard)
              ) : (
                <p className="handwritten text-xs text-[#9B9B8F] text-center py-6 w-full">
                  Henüz genel bir öneri yok. İlk öneriyi sen yap!
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
