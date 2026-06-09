import { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, RefreshControl, View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import discussionService from '../../src/services/discussionService';
import userService from '../../src/services/userService';
import { MessageSquare, ArrowUp, Clock, TrendingUp, Users, Flame, Sparkles } from 'lucide-react-native';
import IntellectualRecommendations from '../../components/IntellectualRecommendations';

// Oy sayısına göre renk paleti — notebook işaretleyici teması
const ACCENT_COLORS = ["#E85D4E", "#4A90E2", "#8B9B7A", "#F6C744", "#9B59B6", "#E67E22"];

const getAccentColor = (index: number) => ACCENT_COLORS[index % ACCENT_COLORS.length];

const getVoteColor = (votes: number) => {
  if (votes >= 20) return "#8B9B7A";   // yeşil — çok beğenildi
  if (votes >= 10) return "#F6C744";   // sarı — trend
  if (votes >= 5)  return "#E85D4E";   // kırmızı — dikkat çekici
  if (votes >= 2)  return "#4A90E2";   // mavi — aktif
  return "#9B9B8F";                     // gri — yeni
};

const TAGS = [
  "Eğitim",
  "Sistem Eleştirisi",
  "Özgürlük",
  "Tartışma Kültürü",
  "Akademik Hayat",
  "Sosyal Sorunlar",
  "Teknoloji",
  "Politika",
];

export default function HomeScreen() {
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [visibleLimit, setVisibleLimit] = useState(5);
  const router = useRouter();

  const fetchData = async (tagToUse?: string | null) => {
    try {
      const activeTag = tagToUse !== undefined ? tagToUse : selectedTag;
      const params = activeTag ? { tag: activeTag } : undefined;
      const [discussionsRes, trendingRes, suggestedRes] = await Promise.all([
        discussionService.getAllDiscussions(params),
        discussionService.getTrending(),
        userService.getSuggestedUsers()
      ]);
      setDiscussions(discussionsRes?.data || []);
      setTrending(trendingRes?.data || []);
      setSuggestedUsers(suggestedRes?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectTag = (tag: string | null) => {
    setSelectedTag(tag);
    setVisibleLimit(5);
    fetchData(tag);
  };

  const handleFollowUser = async (userId: string) => {
    try {
      await userService.followUser(userId);
      Alert.alert("Başarılı", "Kullanıcı takip edildi.");
      fetchData(selectedTag);
    } catch (error: any) {
      Alert.alert("Hata", error.message);
    }
  };

  const handleVoteDiscussion = async (id: string, value: number) => {
    try {
      await discussionService.voteDiscussion(id, value);
      fetchData(selectedTag);
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setVisibleLimit(5);
    await fetchData(selectedTag);
    setRefreshing(false);
  };

  // ── Tartışma Kartı ──────────────────────────────────────────────────────────
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const votes = item._count?.votes || 0;
    const commentCount = item._count?.comments || 0;
    const accentColor = getAccentColor(index);
    const voteColor = getVoteColor(votes);

    return (
      <TouchableOpacity
        onPress={() => router.push({ pathname: "/modal", params: { id: item.id, accentColor } })}
        style={{
          backgroundColor: "#FFFEF5",
          borderRadius: 2,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: "#D4D2C8",
          borderLeftWidth: 4,
          borderLeftColor: accentColor,
          shadowColor: "#000",
          shadowOffset: { width: 3, height: 3 },
          shadowOpacity: 0.1,
          shadowRadius: 0,
          elevation: 2,
          overflow: "hidden",
        }}
      >
        {/* Üst renkli şerit */}
        <View style={{ height: 3, backgroundColor: accentColor, opacity: 0.25 }} />

        <View style={{ padding: 16 }}>
          {/* Başlık — tamamen aksan rengiyle */}
          <Text
            style={{
              fontFamily: "Courier",
              fontSize: 16,
              lineHeight: 24,
              color: accentColor,
            }}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          {/* İçerik */}
          <Text
            style={{
              fontFamily: "System",
              fontSize: 13,
              color: "#6B6B5F",
              lineHeight: 20,
              marginTop: 8,
              marginBottom: 12,
            }}
            numberOfLines={2}
          >
            {item.content}
          </Text>

          {/* Alt satır: Yazar + tarih + oy/yorum */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            {/* Sol: yazar baş harfi + tarih */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 2,
                  backgroundColor: accentColor + "22",
                  borderWidth: 1,
                  borderColor: accentColor + "55",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontFamily: "Courier", fontSize: 11, color: accentColor, fontWeight: "bold" }}>
                  {item.author?.username?.substring(0, 2).toUpperCase() || "??"}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Clock size={11} color="#9B9B8F" />
                <Text style={{ fontFamily: "System", fontSize: 11, color: "#9B9B8F" }}>
                  {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                </Text>
              </View>
            </View>

            {/* Sağ: yorum + oy */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <MessageSquare size={13} color="#6B6B5F" />
                <Text style={{ fontFamily: "System", fontSize: 12, color: "#6B6B5F" }}>{commentCount}</Text>
              </View>

              <TouchableOpacity
                onPress={() => handleVoteDiscussion(item.id, 1)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 2,
                  borderWidth: 1,
                  borderColor: voteColor + "66",
                  backgroundColor: voteColor + "11",
                }}
              >
                <ArrowUp size={13} color={voteColor} />
                <Text style={{ fontFamily: "Courier", fontSize: 12, color: voteColor, fontWeight: "bold" }}>
                  {votes}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Oy oranı çizgisi */}
          {votes > 0 && (
            <View style={{ marginTop: 12, height: 2, backgroundColor: "#F0EDE5", borderRadius: 1 }}>
              <View
                style={{
                  height: 2,
                  width: `${Math.min(100, 15 + votes * 8)}%`,
                  backgroundColor: voteColor,
                  borderRadius: 1,
                  opacity: 0.7,
                }}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // ── Header içeriği ──────────────────────────────────────────────────────────
  const ListHeader = () => (
    <View style={{ paddingTop: 16, marginBottom: 8 }}>

      {/* Sayfa başlığı */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <View>
          <Text style={{ fontFamily: "Courier", fontSize: 24, color: "#E85D4E" }}>
            Tartışmalar
          </Text>
          <View style={{ height: 2, width: 48, backgroundColor: "#E85D4E", opacity: 0.5, marginTop: 4 }} />
        </View>
        <TouchableOpacity
          onPress={() => router.push("/create-topic")}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: "#2C2C28",
            borderRadius: 2,
            shadowColor: "#000",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 0,
            elevation: 2,
          }}
        >
          <Text style={{ fontFamily: "Courier", fontSize: 13, color: "#F5F5F0" }}>+ Yeni</Text>
        </TouchableOpacity>
      </View>

      {/* Entelektüel Öneriler */}
      <IntellectualRecommendations />

      {/* ─── TREND TARTIŞMALAR ─── */}
      {trending.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <Flame size={15} color="#E85D4E" />
            <Text style={{ fontFamily: "Courier", fontSize: 12, color: "#E85D4E", letterSpacing: 1.5, textTransform: "uppercase" }}>
              Trend
            </Text>
          </View>

          <FlatList
            horizontal
            data={trending}
            keyExtractor={(item: any) => `trend-${item.id}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 8 }}
            renderItem={({ item, index }: { item: any; index: number }) => {
              const color = getAccentColor(index);
              return (
                <TouchableOpacity
                  onPress={() => router.push({ pathname: "/modal", params: { id: item.id, accentColor: color } })}
                  style={{
                    backgroundColor: "#FFFEF5",
                    padding: 14,
                    marginRight: 12,
                    borderRadius: 2,
                    width: 200,
                    borderWidth: 1,
                    borderColor: "#D4D2C8",
                    borderTopWidth: 3,
                    borderTopColor: color,
                    shadowColor: "#000",
                    shadowOffset: { width: 2, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 0,
                    elevation: 1,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <TrendingUp size={13} color={color} />
                    <Text style={{ fontFamily: "System", fontSize: 11, color: color }}>Trend</Text>
                  </View>
                  <Text
                    style={{ fontFamily: "Courier", fontSize: 14, color: "#2C2C28", lineHeight: 20 }}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 10 }}>
                    <MessageSquare size={11} color="#9B9B8F" />
                    <Text style={{ fontFamily: "System", fontSize: 11, color: "#9B9B8F" }}>
                      {item._count?.comments || 0} yanıt
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}

      {/* Ayraç */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: "#D4D2C8" }} />
        <Text style={{ fontFamily: "System", fontSize: 10, color: "#9B9B8F", letterSpacing: 1 }}>•</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: "#D4D2C8" }} />
      </View>

      {/* ─── ÖNERİLEN KULLANICILAR ─── */}
      {suggestedUsers.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <Sparkles size={15} color="#4A90E2" />
            <Text style={{ fontFamily: "Courier", fontSize: 12, color: "#4A90E2", letterSpacing: 1.5, textTransform: "uppercase" }}>
              Kimi Takip Etmeli?
            </Text>
          </View>

          <FlatList
            horizontal
            data={suggestedUsers.slice(0, 4)}
            keyExtractor={(item: any) => `suggested-${item.id}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 8 }}
            renderItem={({ item, index }: { item: any; index: number }) => {
              const color = getAccentColor(index + 2);
              return (
                <View
                  style={{
                    backgroundColor: "#FFFEF5",
                    padding: 14,
                    marginRight: 12,
                    borderRadius: 2,
                    width: 160,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#D4D2C8",
                    shadowColor: "#000",
                    shadowOffset: { width: 2, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 0,
                    elevation: 1,
                  }}
                >
                  {/* Avatar dairesi renkli */}
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: color + "20",
                      borderWidth: 2,
                      borderColor: color + "55",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ fontFamily: "Courier", fontSize: 18, color: color, fontWeight: "bold" }}>
                      {item.username?.substring(0, 2).toUpperCase() || "??"}
                    </Text>
                  </View>

                  <Text
                    style={{ fontFamily: "Courier", fontSize: 13, color: "#2C2C28", marginBottom: 12 }}
                    numberOfLines={1}
                  >
                    @{item.username}
                  </Text>

                  <TouchableOpacity
                    onPress={() => handleFollowUser(item.id)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 6,
                      borderRadius: 2,
                      borderWidth: 1.5,
                      borderColor: color,
                      backgroundColor: color + "11",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontFamily: "Courier", fontSize: 11, color: color, fontWeight: "bold" }}>
                      Takip Et
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />

          {/* Manifesto Link */}
          <TouchableOpacity
            onPress={() => router.push("/legal?type=guidelines")}
            style={{
              backgroundColor: "#FFFEF5",
              borderWidth: 1,
              borderColor: "#D4D2C8",
              borderRadius: 2,
              padding: 14,
              marginTop: 12,
              shadowColor: "#000",
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 0,
              elevation: 1,
            }}
          >
            <Text style={{ fontFamily: "Courier", fontSize: 13, color: "#E85D4E", fontWeight: "bold", marginBottom: 4 }}>
              Manifestomuz
            </Text>
            <Text style={{ fontFamily: "System", fontSize: 11, color: "#6B6B5F" }}>
              İşleyiş prensiplerimizi oku
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* İkinci ayraç */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: "#D4D2C8" }} />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <MessageSquare size={11} color="#9B9B8F" />
          <Text style={{ fontFamily: "System", fontSize: 10, color: "#9B9B8F" }}>Tüm tartışmalar</Text>
        </View>
        <View style={{ flex: 1, height: 1, backgroundColor: "#D4D2C8" }} />
      </View>

      {/* Kategori Barı */}
      <View style={{ marginBottom: 16 }}>
        <FlatList
          horizontal
          data={["Tümü", ...TAGS]}
          keyExtractor={(tag) => tag}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => {
            const isSelected = item === "Tümü" ? selectedTag === null : selectedTag === item;
            return (
              <TouchableOpacity
                onPress={() => handleSelectTag(item === "Tümü" ? null : item)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 2,
                  borderWidth: 1,
                  borderColor: isSelected ? "#2C2C28" : "#D4D2C8",
                  backgroundColor: isSelected ? "#2C2C28" : "#FFFEF5",
                }}
              >
                <Text
                  style={{
                    fontFamily: "System",
                    fontSize: 12,
                    color: isSelected ? "#F5F5F0" : "#6B6B5F",
                    fontWeight: isSelected ? "bold" : "normal",
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F0", paddingHorizontal: 16 }}>
      <FlatList
        data={discussions.slice(0, visibleLimit)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E85D4E" />
        }
        ListHeaderComponent={ListHeader}
        ListFooterComponent={
          discussions.length > visibleLimit ? (
            <View style={{ alignItems: "center", paddingVertical: 16 }}>
              <TouchableOpacity
                onPress={() => setVisibleLimit((prev) => prev + 5)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  backgroundColor: "#FFFEF5",
                  borderWidth: 1,
                  borderColor: "#D4D2C8",
                  borderRadius: 2,
                  shadowColor: "#000",
                  shadowOffset: { width: 2, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 0,
                  elevation: 1,
                }}
              >
                <Text style={{ fontFamily: "Courier", fontSize: 12, color: "#2C2C28", fontWeight: "bold" }}>
                  Daha Fazla Tartışma Göster
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        ListEmptyComponent={() => (
          <View
            style={{
              paddingVertical: 48,
              alignItems: "center",
              backgroundColor: "#FFFEF5",
              borderWidth: 2,
              borderStyle: "dashed",
              borderColor: "#D4D2C8",
              borderRadius: 2,
              padding: 24,
              marginTop: 8,
            }}
          >
            <MessageSquare size={32} color="#D4D2C8" />
            <Text style={{ fontFamily: "Courier", fontSize: 16, color: "#6B6B5F", marginTop: 12, marginBottom: 6 }}>
              İlk tartışmayı sen başlat
            </Text>
            <Text style={{ fontFamily: "System", fontSize: 13, color: "#9B9B8F", textAlign: "center", marginBottom: 20, lineHeight: 20 }}>
              Henüz hiç tartışma yok. Topluluğu sen başlat!
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/create-topic")}
              style={{
                paddingHorizontal: 24,
                paddingVertical: 10,
                backgroundColor: "#2C2C28",
                borderRadius: 2,
              }}
            >
              <Text style={{ fontFamily: "Courier", fontSize: 13, color: "#F5F5F0" }}>+ Yeni Tartışma</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

