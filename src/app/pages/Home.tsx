import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Bell, Plus, BookOpen, Tag as TagIcon } from "lucide-react";
import { TopicCard } from "../components/TopicCard";
import { TagFilter } from "../components/TagFilter";
import { PromptCard } from "../components/PromptCard";
import { DevNav } from "../components/DevNav";
import discussionService from "../../services/discussionService";

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
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const data = await discussionService.getAllDiscussions();
      setTopics(data.data);
    } catch (error) {
      console.error("Tartışmalar çekilirken hata:", error);
    } finally {
      setLoading(false);
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
              <svg
                width="24"
                height="24"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 8L20 32"
                  stroke="#2C2C28"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 32L28 32"
                  stroke="#2C2C28"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx="10"
                  cy="16"
                  r="5"
                  stroke="#6B6B5F"
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle
                  cx="30"
                  cy="16"
                  r="5"
                  stroke="#6B6B5F"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M10 16L20 12L30 16"
                  stroke="#2C2C28"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className="typewriter"
                style={{ fontSize: "1.25rem", color: "#2C2C28", fontWeight: 400 }}
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
                  BD
                </div>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8 relative z-10">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Left Column - Topic Feed */}
          <main>
            {/* Section Header */}
            <div className="mb-6">
              <h1
                className="typewriter mb-2"
                style={{
                  fontSize: "1.5rem",
                  color: "#2C2C28",
                  fontWeight: 400,
                }}
              >
                Tartışmalar
              </h1>
              <div
                className="h-px w-24"
                style={{ background: "#6B6B5F", opacity: 0.3 }}
              />
            </div>

            {/* Topic List */}
            {loading ? (
              <div className="handwritten text-center py-12" style={{ color: "#6B6B5F" }}>
                Tartışmalar yükleniyor...
              </div>
            ) : topics.length > 0 ? (
              <div className="space-y-4">
                {topics.map((topic: any, index: number) => (
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
            {/* Tag Filters */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="p-5"
              style={{
                background: "#FFFEF5",
                border: "1px solid #D4D2C8",
                borderRadius: "2px",
                boxShadow: "2px 2px 0px rgba(107, 107, 95, 0.15)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <TagIcon className="w-4 h-4" style={{ color: "#6B6B5F" }} />
                <h3
                  className="typewriter"
                  style={{
                    fontSize: "0.9rem",
                    color: "#2C2C28",
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

            {/* Bugün Düşün Prompt */}
            <PromptCard />

            {/* Manifesto Link */}
            <motion.a
              href="/manifesto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="block p-5 transition-all"
              style={{
                background: "#FFFEF5",
                border: "1px solid #D4D2C8",
                borderRadius: "2px",
                boxShadow: "2px 2px 0px rgba(107, 107, 95, 0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "3px 3px 0px rgba(107, 107, 95, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "2px 2px 0px rgba(107, 107, 95, 0.15)";
              }}
            >
              <h3
                className="mb-2 typewriter"
                style={{
                  fontSize: "0.95rem",
                  color: "#2C2C28",
                  fontWeight: 400,
                }}
              >
                Manifestomuz
              </h3>
              <p
                className="text-sm handwritten"
                style={{ color: "#6B6B5F", lineHeight: 1.6 }}
              >
                TART'ın temel ilkelerini oku
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs typewriter" style={{ color: "#4A90E2" }}>
                <span>Oku</span>
                <span>→</span>
              </div>
            </motion.a>
          </aside>
        </div>
      </div>

      {/* Dev Navigation */}
      <DevNav />
    </div>
  );
}