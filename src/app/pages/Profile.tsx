import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Edit2, MessageSquare, Clock, UserPlus, UserMinus } from "lucide-react";
import { DevNav } from "../components/DevNav";
import userService from "../../services/userService";
import { useParams } from "react-router";
import { toast } from "sonner";

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState<"followers" | "following" | null>(null);

  const isOwnProfile = !id || id === JSON.parse(localStorage.getItem("user") || "{}").id;

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = id ? await userService.getUserProfile(id) : await userService.getMyProfile();
      setProfile(response.data);
      setFormData({ fullName: response.data.fullName || "" });
      
      // Check if current user is following this profile
      if (id) {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (currentUser.id) {
          const isFoll = response.data.followedBy?.some((f: any) => f.id === currentUser.id);
          setIsFollowing(!!isFoll);
        }
      }
    } catch (err: any) {
      setError(err.message || "Profil bilgileri yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowAction = async () => {
    if (!profile) return;
    try {
      if (isFollowing) {
        await userService.unfollowUser(profile.id);
        toast.success("Takip bırakıldı");
      } else {
        await userService.followUser(profile.id);
        toast.success("Takip edildi");
      }
      setIsFollowing(!isFollowing);
      fetchProfile(); // Sayaçları yenile
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsSaving(true);
      await userService.updateProfile(formData);
      await fetchProfile();
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || "Profil güncellenemedi");
    } finally {
      setIsSaving(false);
    }
  };

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
        >
          <ArrowLeft className="w-4 h-4" />
          Ana sayfaya dön
        </motion.a>

        {loading ? (
          <div className="text-center py-12 typewriter" style={{ color: "#6B6B5F" }}>
            Profil yükleniyor...
          </div>
        ) : error ? (
          <div className="p-8 text-center border-2 border-red-200 handwritten" style={{ color: "#C44536", background: "#FFF5F5" }}>
            {error}
          </div>
        ) : (
          <>
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
                  {(profile?.fullName || profile?.username || "??").substring(0, 2).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1">
                  {isEditing ? (
                    <div className="mb-4">
                      <label className="block text-xs typewriter mb-1" style={{ color: "#6B6B5F" }}>İsim Soyisim</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full p-2 typewriter border-b-2 border-[#D4D2C8] focus:border-[#2C2C28] outline-none bg-transparent"
                        placeholder="İsim Soyisim"
                      />
                    </div>
                  ) : (
                    <>
                      <h1
                        className="mb-2 typewriter"
                        style={{
                          fontSize: "1.75rem",
                          color: "#2C2C28",
                          fontWeight: 400,
                        }}
                      >
                        {profile?.fullName || profile?.username}
                      </h1>
                      <p
                        className="mb-4 handwritten"
                        style={{ color: "#6B6B5F", fontSize: "0.95rem" }}
                      >
                        {profile?.username} · Tartışmalarım ve katkılarım
                      </p>
                    </>
                  )}

                  {/* Stats */}
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
                        {profile?._count?.discussions || 0}
                      </div>
                      <div
                        className="text-xs handwritten"
                        style={{ color: "#6B6B5F" }}
                      >
                        Tartışma
                      </div>
                    </div>
                    <div
                      className="cursor-pointer hover:opacity-70 transition-opacity"
                      onClick={() => setShowFollowModal("followers")}
                    >
                      <div
                        className="typewriter"
                        style={{
                          fontSize: "1.5rem",
                          color: "#4A90E2",
                          fontWeight: 400,
                        }}
                      >
                        {profile?._count?.followedBy || 0}
                      </div>
                      <div
                        className="text-xs handwritten"
                        style={{ color: "#6B6B5F" }}
                      >
                        Takipçi
                      </div>
                    </div>
                    <div
                      className="cursor-pointer hover:opacity-70 transition-opacity"
                      onClick={() => setShowFollowModal("following")}
                    >
                      <div
                        className="typewriter"
                        style={{
                          fontSize: "1.5rem",
                          color: "#8B9B7A",
                          fontWeight: 400,
                        }}
                      >
                        {profile?._count?.following || 0}
                      </div>
                      <div
                        className="text-xs handwritten"
                        style={{ color: "#6B6B5F" }}
                      >
                        Takip
                      </div>
                    </div>
                  </div>

                  {/* Edit/Follow Buttons */}
                  <div className="flex gap-2">
                    {isOwnProfile ? (
                      isEditing ? (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleUpdateProfile}
                            disabled={isSaving}
                            className="px-4 py-2 typewriter"
                            style={{
                              background: "#2C2C28",
                              border: "1px solid #2C2C28",
                              borderRadius: "2px",
                              color: "#F5F5F0",
                              fontSize: "0.85rem",
                            }}
                          >
                            {isSaving ? "Kaydediliyor..." : "Kaydet"}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setIsEditing(false);
                              setFormData({ fullName: profile?.fullName || "" });
                            }}
                            className="px-4 py-2 typewriter"
                            style={{
                              background: "transparent",
                              border: "1px solid #D4D2C8",
                              borderRadius: "2px",
                              color: "#6B6B5F",
                              fontSize: "0.85rem",
                            }}
                          >
                            İptal
                          </motion.button>
                        </>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 px-4 py-2 typewriter"
                          style={{
                            background: "transparent",
                            border: "1px solid #6B6B5F",
                            borderRadius: "2px",
                            color: "#6B6B5F",
                            fontSize: "0.85rem",
                          }}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Profili Düzenle
                        </motion.button>
                      )
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleFollowAction}
                        className="flex items-center gap-2 px-6 py-2 typewriter"
                        style={{
                          background: isFollowing ? "transparent" : "#2C2C28",
                          border: "1px solid #2C2C28",
                          borderRadius: "2px",
                          color: isFollowing ? "#2C2C28" : "#F5F5F0",
                          fontSize: "0.85rem",
                        }}
                      >
                        {isFollowing ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                        {isFollowing ? "Takibi Bırak" : "Takip Et"}
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              {/* Handwritten note accent */}
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
                {profile?.discussions?.length > 0 ? (
                  profile?.discussions?.map((topic: any, index: number) => (
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
                          {topic._count?.comments || 0} yanıt
                        </div>
                        <div
                          className="flex items-center gap-1.5 handwritten"
                          style={{ color: "#9B9B8F" }}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(topic.createdAt).toLocaleDateString("tr-TR")}
                        </div>
                      </div>
                    </motion.a>
                  ))
                ) : (
                  <p className="handwritten text-center py-8" style={{ color: "#9B9B8F" }}>
                    Henüz bir tartışma başlatmadınız.
                  </p>
                )}
              </div>
            </motion.div>

            {/* Follow Modal */}
            {showFollowModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={() => setShowFollowModal(null)}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-sm p-6"
                  style={{
                    background: "#FFFEF5",
                    border: "2px solid #2C2C28",
                    borderRadius: "2px",
                    boxShadow: "8px 8px 0px rgba(44, 44, 40, 0.2)",
                    maxHeight: "80vh",
                    overflowY: "auto"
                  }}
                >
                  <h3 className="text-xl mb-4 typewriter" style={{ color: "#2C2C28" }}>
                    {showFollowModal === "followers" ? "Takipçiler" : "Takip Edilenler"}
                  </h3>
                  
                  <div className="space-y-4">
                    {(showFollowModal === "followers" ? profile?.followedBy : profile?.following)?.map((u: any) => (
                      <a key={u.id} href={`/profile/${u.id}`} className="flex items-center gap-3 p-2 hover:bg-[#F5F5F0] transition-colors rounded-sm border border-transparent hover:border-[#D4D2C8]">
                        <div className="w-10 h-10 flex-shrink-0 bg-[#E8E6E0] flex items-center justify-center text-sm typewriter border border-[#D4D2C8]">
                          {(u.fullName || u.username || "??").substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="typewriter text-sm" style={{ color: "#2C2C28" }}>{u.fullName || u.username}</div>
                          <div className="handwritten text-xs" style={{ color: "#6B6B5F" }}>@{u.username}</div>
                        </div>
                      </a>
                    ))}
                    {!(showFollowModal === "followers" ? profile?.followedBy : profile?.following)?.length && (
                      <p className="text-center text-sm handwritten text-[#6B6B5F] py-4">Kimse bulunamadı.</p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setShowFollowModal(null)}
                    className="mt-6 w-full py-2 text-sm typewriter border border-[#2C2C28] hover:bg-[#2C2C28] hover:text-white transition-colors"
                  >
                    Kapat
                  </button>
                </motion.div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Dev Navigation */}
      <DevNav />
    </div>
  );
}