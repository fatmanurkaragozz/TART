import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert } from "react-native";
import { BookOpen, Film, FileText, Video, Cpu, User, Plus } from "lucide-react-native";
import recommendationService from "../src/services/recommendationService";

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

interface IntellectualRecommendationsProps {
  discussionId?: string;
}

const TYPE_LABELS: Record<string, string> = {
  BOOK: "Kitap Önerisi",
  FILM: "Film Önerisi",
  ARTICLE: "Makale Önerisi",
  DOCUMENTARY: "Belgesel Önerisi",
};

export default function IntellectualRecommendations({ discussionId }: IntellectualRecommendationsProps) {
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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Hata", "Lütfen kaynak adı ve açıklama alanlarını doldurun");
      return;
    }

    try {
      setSubmitting(true);
      let finalLabel = label.trim();
      if (!finalLabel) {
        finalLabel = TYPE_LABELS[type] || "Kaynak Önerisi";
      }

      await recommendationService.createRecommendation({
        title: title.trim(),
        type,
        label: finalLabel,
        description: description.trim(),
        discussionId: discussionId || null,
      });

      Alert.alert("Başarılı", "Entelektüel öneriniz paylaşıldı!");
      setTitle("");
      setLabel("");
      setDescription("");
      setShowForm(false);
      fetchRecommendations();
    } catch (err: any) {
      Alert.alert("Hata", err.message || "Öneri paylaşılırken hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  const getCoverStyle = (recType: string) => {
    switch (recType) {
      case "BOOK":
        return {
          backgroundColor: "#E85D4E",
          color: "#FAFAF5",
          icon: <BookOpen size={16} color="#FAFAF5" style={{ marginBottom: 4 }} />,
        };
      case "FILM":
        return {
          backgroundColor: "#4A90E2",
          color: "#FAFAF5",
          icon: <Film size={16} color="#FAFAF5" style={{ marginBottom: 4 }} />,
        };
      case "ARTICLE":
        return {
          backgroundColor: "#8B9B7A",
          color: "#FAFAF5",
          icon: <FileText size={16} color="#FAFAF5" style={{ marginBottom: 4 }} />,
        };
      case "DOCUMENTARY":
        return {
          backgroundColor: "#F6C744",
          color: "#2C2C28",
          icon: <Video size={16} color="#2C2C28" style={{ marginBottom: 4 }} />,
        };
      default:
        return {
          backgroundColor: "#D4D2C8",
          color: "#2C2C28",
          icon: <BookOpen size={16} color="#2C2C28" style={{ marginBottom: 4 }} />,
        };
    }
  };

  const renderCard = ({ item }: { item: Recommendation }) => {
    const cover = getCoverStyle(item.type);
    const isExpanded = expandedRecs[item.id];
    
    return (
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#FFFEF5",
          borderWidth: 1,
          borderColor: "#D4D2C8",
          borderRadius: 2,
          padding: 12,
          marginRight: 12,
          width: 280,
          shadowColor: "#000",
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 0,
          elevation: 1,
        }}
      >
        {/* Sol tarafta kapak tasarımı */}
        <View
          style={{
            width: 68,
            height: 90,
            backgroundColor: cover.backgroundColor,
            borderRadius: 2,
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
            shadowColor: "#000",
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 1,
          }}
        >
          {cover.icon}
          <Text
            style={{
              fontSize: 7,
              fontFamily: "Courier",
              color: cover.color,
              fontWeight: "bold",
              letterSpacing: 1,
              textAlign: "center",
              marginBottom: 2,
            }}
          >
            {item.type}
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontFamily: "Courier",
              color: cover.color,
              textAlign: "center",
              fontWeight: "500",
            }}
            numberOfLines={2}
          >
            {item.title.split("-").shift()?.trim()}
          </Text>
        </View>

        {/* Sağ tarafta detaylar */}
        <View style={{ flex: 1, marginLeft: 12 }}>
          {/* Tür Etiketi */}
          <View style={{ alignSelf: "flex-start", paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: "#D4D2C8", borderRadius: 2, marginBottom: 4 }}>
            <Text style={{ fontFamily: "System", fontSize: 9, color: "#6B6B5F" }}>
              {item.label}
            </Text>
          </View>

          {/* Başlık */}
          <Text style={{ fontFamily: "Courier", fontSize: 12, fontWeight: "bold", color: "#2C2C28", marginBottom: 4 }} numberOfLines={1}>
            {item.title}
          </Text>

          {/* Açıklama */}
          <TouchableOpacity onPress={() => toggleExpand(item.id)} activeOpacity={0.7}>
            <Text
              style={{
                fontFamily: "System",
                fontSize: 10,
                color: "#6B6B5F",
                lineHeight: 14,
              }}
              numberOfLines={isExpanded ? undefined : 3}
            >
              {item.description}
            </Text>
            {!isExpanded && item.description.length > 80 && (
              <Text style={{ fontFamily: "System", fontSize: 9, color: "#E85D4E", marginTop: 2 }}>
                ...devamını oku
              </Text>
            )}
          </TouchableOpacity>

          {/* Öneren */}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, paddingTop: 4, borderTopWidth: 1, borderStyle: "dashed", borderColor: "#E8E6E0" }}>
            {item.isAi ? (
              <>
                <Cpu size={10} color="#8B9B7A" style={{ marginRight: 4 }} />
                <Text style={{ fontFamily: "Courier", fontSize: 8, color: "#8B9B7A", fontWeight: "bold" }}>
                  Yapay Zeka Önerisi
                </Text>
              </>
            ) : (
              <>
                <User size={10} color="#9B9B8F" style={{ marginRight: 4 }} />
                <Text style={{ fontFamily: "Courier", fontSize: 8, color: "#9B9B8F" }}>
                  @{item.author?.username || "anonim"}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        backgroundColor: "#FFFEF5",
        borderWidth: 1,
        borderColor: "#D4D2C8",
        borderRadius: 2,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 0,
        elevation: 2,
      }}
    >
      {/* Başlık Alanı */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12, pb: 4, borderBottomWidth: 1, borderColor: "#D4D2C8" }}>
        <View>
          <Text style={{ fontFamily: "Courier", fontSize: 13, fontWeight: "bold", color: "#8B9B7A" }}>
            {discussionId ? "Tartışma Önerileri" : "Entelektüel Derinlik"}
          </Text>
          <Text style={{ fontFamily: "System", fontSize: 9, color: "#9B9B8F" }}>
            Önerilen entelektüel kaynaklar
          </Text>
        </View>
        {!showForm && (
          <TouchableOpacity
            onPress={() => setShowForm(true)}
            style={{
              padding: 6,
              borderWidth: 1,
              borderColor: "#D4D2C8",
              borderRadius: 2,
              backgroundColor: "#FAFAF5",
            }}
          >
            <Plus size={14} color="#6B6B5F" />
          </TouchableOpacity>
        )}
      </View>

      {/* Kaynak Öner Formu */}
      {showForm && (
        <View
          style={{
            padding: 12,
            borderWidth: 1,
            borderColor: "#E85D4E",
            backgroundColor: "#FAFAF5",
            borderRadius: 2,
            marginBottom: 12,
            gap: 8,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderStyle: "dashed", borderColor: "#D4D2C8", paddingBottom: 4 }}>
            <Text style={{ fontFamily: "Courier", fontSize: 11, fontWeight: "bold", color: "#E85D4E" }}>Kaynak Öner</Text>
            <TouchableOpacity onPress={() => setShowForm(false)}>
              <Text style={{ fontFamily: "System", fontSize: 10, color: "#9B9B8F", textDecorationLine: "underline" }}>Kapat</Text>
            </TouchableOpacity>
          </View>

          {/* Kaynak Adı */}
          <TextInput
            placeholder="Kaynak Adı (örn: George Orwell - 1984)"
            placeholderTextColor="#9B9B8F"
            value={title}
            onChangeText={setTitle}
            style={{
              borderWidth: 1,
              borderColor: "#D4D2C8",
              backgroundColor: "#FFF",
              paddingHorizontal: 8,
              paddingVertical: 6,
              fontSize: 11,
              fontFamily: "System",
              borderRadius: 2,
            }}
          />

          {/* Tür Seçimi Chips */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {["BOOK", "FILM", "ARTICLE", "DOCUMENTARY"].map((recType) => {
              const isSelected = type === recType;
              const trName: Record<string, string> = { BOOK: "Kitap", FILM: "Film", ARTICLE: "Makale", DOCUMENTARY: "Belgesel" };
              return (
                <TouchableOpacity
                  key={recType}
                  onPress={() => setType(recType)}
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderWidth: 1,
                    borderColor: isSelected ? "#E85D4E" : "#D4D2C8",
                    backgroundColor: isSelected ? "#E85D4E" : "#FFF",
                    borderRadius: 2,
                  }}
                >
                  <Text style={{ fontFamily: "System", fontSize: 10, color: isSelected ? "#FFF" : "#6B6B5F" }}>
                    {trName[recType]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Etiket/Konu */}
          <TextInput
            placeholder="Konu/Etiket (örn: Sistem Eleştirisi)"
            placeholderTextColor="#9B9B8F"
            value={label}
            onChangeText={setLabel}
            style={{
              borderWidth: 1,
              borderColor: "#D4D2C8",
              backgroundColor: "#FFF",
              paddingHorizontal: 8,
              paddingVertical: 6,
              fontSize: 11,
              fontFamily: "System",
              borderRadius: 2,
            }}
          />

          {/* Açıklama */}
          <TextInput
            placeholder="Neden okunmalı/izlenmeli? Tartışmaya nasıl bir derinlik katar?"
            placeholderTextColor="#9B9B8F"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={{
              borderWidth: 1,
              borderColor: "#D4D2C8",
              backgroundColor: "#FFF",
              paddingHorizontal: 8,
              paddingVertical: 6,
              fontSize: 11,
              fontFamily: "System",
              borderRadius: 2,
              minHeight: 50,
              textAlignVertical: "top",
            }}
          />

          {/* Gönder Butonu */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting}
            style={{
              backgroundColor: "#2C2C28",
              paddingVertical: 8,
              borderRadius: 2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#F5F5F0" />
            ) : (
              <Text style={{ fontFamily: "Courier", fontSize: 11, fontWeight: "bold", color: "#F5F5F0" }}>Öneriyi Paylaş</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Öneriler Listesi */}
      {loading ? (
        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <ActivityIndicator size="small" color="#8B9B7A" />
          <Text style={{ fontFamily: "System", fontSize: 10, color: "#9B9B8F", marginTop: 6 }}>
            Öneriler yükleniyor...
          </Text>
        </View>
      ) : (
        <View>
          {discussionId ? (
            /* Tartışmaya Özel Katmanlı Görünüm */
            <View style={{ gap: 16 }}>
              {/* Yazarın Önerileri */}
              {discussionRecs.authorRecommendations.length > 0 && (
                <View>
                  <Text style={{ fontFamily: "Courier", fontSize: 9, fontWeight: "bold", color: "#C44536", marginBottom: 6, letterSpacing: 1 }}>
                    YAZARIN ÖNERİLERİ
                  </Text>
                  <FlatList
                    horizontal
                    data={discussionRecs.authorRecommendations}
                    keyExtractor={(item) => `author-${item.id}`}
                    renderItem={renderCard}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: 8 }}
                  />
                </View>
              )}

              {/* Topluluk Önerileri */}
              {discussionRecs.communityRecommendations.length > 0 && (
                <View>
                  <Text style={{ fontFamily: "Courier", fontSize: 9, fontWeight: "bold", color: "#4A90E2", marginBottom: 6, letterSpacing: 1 }}>
                    TOPLULUK ÖNERİLERİ
                  </Text>
                  <FlatList
                    horizontal
                    data={discussionRecs.communityRecommendations}
                    keyExtractor={(item) => `comm-${item.id}`}
                    renderItem={renderCard}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: 8 }}
                  />
                </View>
              )}

              {/* Yapay Zeka Önerileri */}
              {discussionRecs.aiRecommendations.length > 0 && (
                <View>
                  <Text style={{ fontFamily: "Courier", fontSize: 9, fontWeight: "bold", color: "#8B9B7A", marginBottom: 6, letterSpacing: 1 }}>
                    YAPAY ZEKA ANALİZİ
                  </Text>
                  <FlatList
                    horizontal
                    data={discussionRecs.aiRecommendations}
                    keyExtractor={(item) => `ai-${item.id}`}
                    renderItem={renderCard}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: 8 }}
                  />
                </View>
              )}

              {discussionRecs.authorRecommendations.length === 0 &&
                discussionRecs.communityRecommendations.length === 0 &&
                discussionRecs.aiRecommendations.length === 0 && (
                  <Text style={{ fontFamily: "System", fontSize: 11, color: "#9B9B8F", textAlign: "center", paddingVertical: 12 }}>
                    Henüz bir öneri bulunamadı.
                  </Text>
                )}
            </View>
          ) : (
            /* Genel Öneriler Görünümü */
            <View>
              {generalRecs.length > 0 ? (
                <FlatList
                  horizontal
                  data={generalRecs}
                  keyExtractor={(item) => `gen-${item.id}`}
                  renderItem={renderCard}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 8 }}
                />
              ) : (
                <Text style={{ fontFamily: "System", fontSize: 11, color: "#9B9B8F", textAlign: "center", paddingVertical: 12 }}>
                  Henüz genel bir öneri yok. İlk öneriyi sen yap!
                </Text>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
