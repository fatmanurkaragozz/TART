import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  MessageSquare, 
  LayoutDashboard, 
  Trash2, 
  CheckCircle, 
  Mail, 
  TrendingUp,
  ArrowLeft,
  ShieldCheck
} from "lucide-react";
import adminService from "../../services/adminService";
import contactService from "../../services/contactService";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { DevNav } from "../components/DevNav";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"stats" | "messages" | "users">("stats");
  const [stats, setStats] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === "stats") {
        const res = await adminService.getStats();
        setStats(res.data);
      } else if (activeTab === "messages") {
        const res = await contactService.getMessages();
        setMessages(res.data);
      } else if (activeTab === "users") {
        const res = await adminService.getUsers();
        setUsers(res.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Veriler yüklenemedi. Admin yetkiniz olmayabilir.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await contactService.markAsRead(id);
      setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m));
      toast.success("Mesaj okundu işaretlendi");
    } catch (error) {
      toast.error("İşlem başarısız");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
    try {
      await adminService.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      toast.success("Kullanıcı silindi");
    } catch (error) {
      toast.error("Silme işlemi başarısız");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#F5F5F0" }}>
      {/* Texture */}
      <div
        className="fixed inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 py-10 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-[#2C2C28] text-[#F5F5F0] rounded-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="typewriter text-2xl font-medium" style={{ color: "#2C2C28" }}>Yönetim Paneli</h1>
                <p className="handwritten text-sm" style={{ color: "#6B6B5F" }}>TART Sistem Arşivi ve Moderasyon</p>
              </div>
           </div>
           <a href="/home" className="flex items-center gap-2 text-sm typewriter hover:opacity-70 transition-opacity" style={{ color: "#6B6B5F" }}>
              <ArrowLeft className="w-4 h-4" /> Geri Dön
           </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-[#D4D2C8]">
          {[
            { id: "stats", label: "İstatistikler", icon: LayoutDashboard },
            { id: "messages", label: "Mesajlar", icon: Mail },
            { id: "users", label: "Kullanıcılar", icon: Users }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="pb-3 px-4 flex items-center gap-2 text-sm typewriter transition-all relative"
              style={{
                color: activeTab === tab.id ? "#2C2C28" : "#9B9B8F"
              }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="admin-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2C2C28]" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-20 text-center handwritten" style={{ color: "#6B6B5F" }}>Dosyalar yükleniyor...</div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6"
          >
            {activeTab === "stats" && stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Toplam Kullanıcı" value={stats.users} icon={Users} color="#4A90E2" />
                <StatCard label="Tartışmalar" value={stats.discussions} icon={MessageSquare} color="#E85D4E" />
                <StatCard label="Yanıtlar" value={stats.comments} icon={TrendingUp} color="#8B9B7A" />
                <StatCard label="Gelen Mesajlar" value={stats.messages} icon={Mail} color="#F6C744" />
              </div>
            )}

            {activeTab === "messages" && (
              <div className="space-y-4">
                {messages.length > 0 ? messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className="p-6 transition-all"
                    style={{
                      background: msg.isRead ? "#F5F5F0" : "#FFFEF5",
                      border: "1px solid #D4D2C8",
                      boxShadow: "2px 2px 0px rgba(107, 107, 95, 0.1)",
                      opacity: msg.isRead ? 0.8 : 1
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="typewriter font-medium text-[#2C2C28]">{msg.subject}</h3>
                        <p className="handwritten text-xs" style={{ color: "#6B6B5F" }}>
                          {msg.name} ({msg.email}) • {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: tr })}
                        </p>
                      </div>
                      {!msg.isRead && (
                        <button 
                          onClick={() => handleMarkRead(msg.id)}
                          className="p-2 hover:bg-[#E8E6E0] rounded-sm transition-colors"
                          title="Okundu işaretle"
                        >
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </button>
                      )}
                    </div>
                    <p className="handwritten text-sm leading-relaxed" style={{ color: "#2C2C28" }}>{msg.message}</p>
                  </div>
                )) : (
                  <div className="text-center py-20 handwritten" style={{ color: "#9B9B8F" }}>Henüz mesaj yok.</div>
                )}
              </div>
            )}

            {activeTab === "users" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left typewriter text-sm">
                  <thead>
                    <tr style={{ color: "#6B6B5F", borderBottom: "2px solid #D4D2C8" }}>
                      <th className="pb-4 font-normal">Kullanıcı</th>
                      <th className="pb-4 font-normal">E-posta</th>
                      <th className="pb-4 font-normal">Rol</th>
                      <th className="pb-4 font-normal">Katkılar</th>
                      <th className="pb-4 font-normal">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E6E0]">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-paper/50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                             <div className="w-8 h-8 bg-[#E8E6E0] flex items-center justify-center text-xs rounded-sm">
                               {u.username.substring(0, 2).toUpperCase()}
                             </div>
                             <span>{u.username}</span>
                          </div>
                        </td>
                        <td className="py-4">{u.email}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded-sm text-[10px] ${u.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 text-xs handwritten" style={{ color: "#6B6B5F" }}>
                          {u._count.discussions} t / {u._count.comments} y
                        </td>
                        <td className="py-4">
                          {u.role !== 'admin' && (
                            <button 
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </div>
      <DevNav />
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div 
      className="p-6 bg-[#FFFEF5]" 
      style={{ 
        border: "1px solid #D4D2C8",
        boxShadow: "4px 4px 0px rgba(107, 107, 95, 0.15)"
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-sm" style={{ background: `${color}15`, color }}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="typewriter text-2xl font-medium" style={{ color: "#2C2C28" }}>{value}</span>
      </div>
      <p className="handwritten text-sm" style={{ color: "#6B6B5F" }}>{label}</p>
    </div>
  );
}
