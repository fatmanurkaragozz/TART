import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Bell, Plus, BookOpen, Tag as TagIcon, TrendingUp, Users, MessageCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { TopicCard } from "../components/TopicCard";
import { TopicSkeleton } from "../components/Skeleton";
import { TagFilter } from "../components/TagFilter";
import { PromptCard } from "../components/PromptCard";
import { DevNav } from "../components/DevNav";
import discussionService from "../../services/discussionService";
import userService from "../../services/userService";
import { toast } from "sonner";
import logo from "../../assets/logo.png";
import authService from "../../services/authService";

const tags = [
  "Eğitim",
  "Sistem Eleştirisi",
  "Özgürlük",
  "Tartışma Kültürü",
  "Akademik Hayat",
  "Sosyal Sorunlar",
];

export default function Home() {
  const [topics, setTopics] = useState<any[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<any[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"discover" | "following">("discover");
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    toast.success("Başarıyla çıkış yapıldı");
    navigate("/");
  };

  useEffect(() => {
    fetchSideData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTopics();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedTags, activeTab]);

  const fetchSideData = async () => {
    try {
      const [trendingRes, suggestedRes] = await Promise.all([
        discussionService.getTrending(),
        userService.getSuggestedUsers()
      ]);
      setTrendingTopics(trendingRes?.data || []);
      setSuggestedUsers(suggestedRes?.data || []);
    } catch (error) {
      console.error("Yan veriler çekilirken hata:", error);
    }
  };

  const fetchTopics = async () => {
    try {
      setLoading(true);
      let data;

      if (activeTab === "following") {
        data = await discussionService.getFollowingFeed();
      } else {
        const tag = selectedTags.length > 0 ? selectedTags[selectedTags.length - 1] : undefined;
        data = await discussionService.getAllDiscussions({
          search: searchQuery,
          tag
        });
      }

      setTopics(data?.data || []);
    } catch (error) {
      console.error("Tartışmalar çekilirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      await userService.followUser(userId);
      toast.success("Takip edildi");
      fetchSideData(); // Listeyi yenile
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };


  return (
    <div
      className="min-h-screen"
      style={{ background: "#FAFAF5", position: "relative" }}
    >
      {/* Paper texture overlay */}
      <div
        className="fixed inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-sm"
        style={{
          background: "rgba(250, 250, 245, 0.95)",
          borderBottom: "1px solid rgba(107, 107, 95, 0.2)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-8">
            {/* Logo */}
            <a
              href="/home"
              className="flex items-center gap-2 flex-shrink-0 transition-opacity hover:opacity-70"
            >
              <img src={logo} alt="TART Logo" className="w-12 h-12 object-contain" />
              <span
                className="typewriter text-xl font-medium tracking-tight"
                style={{ color: "#2C2C28" }}
              >
                TART
              </span>
            </a>

            {/* Search Bar */}
            <div className="flex-1 max-w-md relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "#6B6B5F" }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tartışma ara..."
                className="w-full pl-10 pr-4 py-2 typewriter"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "2px solid #D4D2C8",
                  borderRadius: "0",
                  color: "#2C2C28",
                  fontSize: "0.9rem",
                  outline: "none",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderBottom = "2px solid #2C2C28";
                  e.target.style.boxShadow = "0 2px 8px rgba(44, 44, 40, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderBottom = "2px solid #D4D2C8";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* New Discussion Button */}
              <motion.a
                href="/create-topic"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 flex items-center gap-2 typewriter"
                style={{
                  background: "#2C2C28",
                  color: "#F5F5F0",
                  border: "2px solid #2C2C28",
                  borderRadius: "2px",
                  fontSize: "0.9rem",
                  transition: "all 0.2s ease",
                }}
              >
                <Plus className="w-4 h-4" />
                Yeni Tartışma
              </motion.a>

              {/* Notifications */}
              <motion.a
                href="/notifications"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 relative"
                style={{
                  background: "transparent",
                  border: "1px solid #D4D2C8",
                  borderRadius: "2px",
                  transition: "all 0.2s ease",
                }}
              >
                <Bell className="w-5 h-5" style={{ color: "#6B6B5F" }} />
                {/* Notification badge - Level 1 color accent */}
                <div
                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                  style={{ background: "#4A90E2" }}
                />
              </motion.a>

              {/* Profile */}
              {(() => {
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                const name = user.fullName || user.username || "Kullanıcı";
                const initials = name.substring(0, 2).toUpperCase();

                return (
                  <div className="flex items-center gap-2">
                    <a
                      href="/profile"
                      className="flex items-center gap-2 p-1.5 transition-opacity hover:opacity-70"
                      style={{
                        border: "1px solid #D4D2C8",
                        borderRadius: "2px",
                      }}
                    >
                      <div
                        className="w-8 h-8 flex items-center justify-center typewriter"
                        style={{
                          background: "#E8E6E0",
                          color: "#2C2C28",
                          fontSize: "0.75rem",
                          borderRadius: "2px",
                        }}
                      >
                        {initials}
                      </div>
                    </a>
                    <button
                      onClick={handleLogout}
                      className="p-2 transition-all hover:bg-paper border border-[#D4D2C8] rounded-sm group"
                      title="Çıkış Yap"
                    >
                      <LogOut className="w-4 h-4 text-pencil group-hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8 relative z-10">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Left Column - Topic Feed */}
          <main>
            {/* Haftanın Sorusu / Prompt */}
            <div className="mb-8">
              <PromptCard />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 mb-8 border-b border-[#D4D2C8]">
              <button
                onClick={() => setActiveTab("discover")}
                className="pb-3 px-1 text-sm typewriter transition-all relative"
                style={{
                  color: activeTab === "discover" ? "#2C2C28" : "#9B9B8F",
                  fontWeight: activeTab === "discover" ? 500 : 400
                }}
              >
                Keşfet
                {activeTab === "discover" && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2C2C28]"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("following")}
                className="pb-3 px-1 text-sm typewriter transition-all relative"
                style={{
                  color: activeTab === "following" ? "#2C2C28" : "#9B9B8F",
                  fontWeight: activeTab === "following" ? 500 : 400
                }}
              >
                Takip Ettiklerim
                {activeTab === "following" && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2C2C28]"
                  />
                )}
              </button>
            </div>

            {/* Topic List */}
            {loading ? (
              <div className="handwritten text-center py-12" style={{ color: "#6B6B5F" }}>
                Tartışmalar yükleniyor...
              </div>
            ) : topics.length > 0 ? (
              <div className="space-y-4">
                {topics?.map((topic: any, index: number) => (
                  <TopicCard key={topic.id} topic={{
                    ...topic,
                    preview: topic.content.substring(0, 150) + "...",
                    lastActivity: "Şimdi", // Gerçek veride yoksa
                    colorLevel: topic.voteScore > 5 ? 1 : 0
                  }} delay={index * 0.05} />
                ))}
              </div>
            ) : (

              /* Empty State */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="p-12 text-center"
                style={{
                  background: "#FFFEF5",
                  border: "2px dashed #D4D2C8",
                  borderRadius: "2px",
                }}
              >
                <div className="mb-6">
                  <BookOpen
                    className="w-16 h-16 mx-auto"
                    style={{ color: "#D4D2C8" }}
                  />
                </div>
                <h3
                  className="mb-3 typewriter"
                  style={{
                    fontSize: "1.25rem",
                    color: "#6B6B5F",
                    fontWeight: 400,
                  }}
                >
                  İlk tartışmayı sen başlat
                </h3>
                <p
                  className="mb-6 handwritten"
                  style={{ color: "#9B9B8F", fontSize: "0.95rem" }}
                >
                  Henüz hiç tartışma yok. Topluluğu sen başlat!
                </p>
                <a href="/create-topic">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-6 py-3 typewriter"
                    style={{
                      background: "#2C2C28",
                      color: "#F5F5F0",
                      border: "2px solid #2C2C28",
                      borderRadius: "2px",
                      fontSize: "0.9rem",
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Yeni Tartışma Başlat
                  </motion.div>
                </a>
              </motion.div>
            )}
          </main>

          {/* Right Column - Sidebar */}
          <aside className="space-y-6">
            {/* Trend Tartışmalar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-5"
              style={{
                background: "#FFFEF5",
                border: "1px solid #D4D2C8",
                borderRadius: "2px",
                boxShadow: "2px 2px 0px rgba(107, 107, 95, 0.15)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4" style={{ color: "#4A90E2" }} />
                <h3 className="typewriter text-sm font-medium" style={{ color: "#4A90E2" }}>Trend Tartışmalar</h3>
              </div>
              <div className="space-y-4">
                {trendingTopics?.length > 0 ? (
                  trendingTopics?.map((topic, i) => (
                    <a key={topic.id} href={`/topic/${topic.id}`} className="block group">
                      <p className="text-sm typewriter group-hover:underline line-clamp-1 mb-1" style={{ color: "#2C2C28" }}>
                        {i + 1}. {topic.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs handwritten" style={{ color: "#9B9B8F" }}>
                        <MessageCircle className="w-3 h-3" />
                        {topic._count.comments} yanıt
                      </div>
                    </a>
                  ))
                ) : (
                  <p className="text-[10px] handwritten text-center py-4" style={{ color: "#9B9B8F" }}>
                    Henüz trend tartışma yok.
                  </p>
                )}
              </div>
            </motion.div>

            {/* Önerilen Kişiler */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5"
              style={{
                background: "#FFFEF5",
                border: "1px solid #D4D2C8",
                borderRadius: "2px",
                boxShadow: "2px 2px 0px rgba(107, 107, 95, 0.15)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4" style={{ color: "#8B9B7A" }} />
                <h3 className="typewriter text-sm font-medium" style={{ color: "#8B9B7A" }}>Kimi Takip Etmeli?</h3>
              </div>
              <div className="space-y-4">
                {suggestedUsers?.length > 0 ? (
                  suggestedUsers?.map((u) => (
                    <div key={u.id} className="flex items-center justify-between gap-3">
                      <a href={`/profile/${u.id}`} className="flex items-center gap-2 overflow-hidden hover:opacity-70 transition-opacity">
                        <div className="w-7 h-7 flex-shrink-0 bg-[#E8E6E0] flex items-center justify-center text-[0.6rem] typewriter border border-[#D4D2C8]">
                          {u.username.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="typewriter text-xs truncate" style={{ color: "#2C2C28" }}>@{u.username}</span>
                      </a>
                      <button
                        onClick={() => handleFollow(u.id)}
                        className="text-[0.65rem] typewriter px-3 py-1 border border-[#2C2C28] hover:bg-[#2C2C28] hover:text-white transition-colors"
                      >
                        Takip Et
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] handwritten text-center py-4" style={{ color: "#9B9B8F" }}>
                    Şu an için yeni bir öneri yok.
                  </p>
                )}
              </div>
            </motion.div>

            {/* Tag Filters */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-5"
              style={{
                background: "#FFFEF5",
                border: "1px solid #D4D2C8",
                borderRadius: "2px",
                boxShadow: "2px 2px 0px rgba(107, 107, 95, 0.15)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <TagIcon className="w-4 h-4" style={{ color: "#4A90E2" }} />
                <h3
                  className="typewriter"
                  style={{
                    fontSize: "0.9rem",
                    color: "#4A90E2",
                    fontWeight: 400,
                  }}
                >
                  Konular
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <TagFilter
                    key={tag}
                    tag={tag}
                    isSelected={selectedTags.includes(tag)}
                    onClick={() => toggleTag(tag)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Manifesto Link */}
            <motion.a
              href="/manifesto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="block p-5 transition-all"
              style={{
                background: "#FFFEF5",
                border: "1px solid #D4D2C8",
                borderRadius: "2px",
                boxShadow: "2px 2px 0px rgba(107, 107, 95, 0.15)",
              }}
            >
              <h3 className="mb-1 typewriter text-sm" style={{ color: "#E85D4E" }}>Manifestomuz</h3>
              <p className="text-xs handwritten" style={{ color: "#6B6B5F" }}>İşleyiş prensiplerimizi oku</p>
            </motion.a>
          </aside>
        </div>
      </div>

      {/* Dev Navigation */}
      <DevNav />
    </div>
  );
}