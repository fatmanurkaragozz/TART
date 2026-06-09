import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Flag, MessageSquare, ThumbsUp } from 'lucide-react-native';
import discussionService from '../src/services/discussionService';
import commentService from '../src/services/commentService';
import userService from '../src/services/userService';
import { ThumbsUp as ThumbsUpFilled } from 'lucide-react-native';
import IntellectualRecommendations from '../components/IntellectualRecommendations';

export default function TopicDetailScreen() {
  const { id, accentColor: accentParam } = useLocalSearchParams<{ id: string; accentColor?: string }>();
  const accentColor = (accentParam as string) || "#6B6B5F";
  const router = useRouter();
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyToUser, setReplyToUser] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [focusedInput, setFocusedInput] = useState(false);
  const [nestedComments, setNestedComments] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTopicDetails();
    }
  }, [id]);

  const fetchTopicDetails = async () => {
    try {
      setLoading(true);
      // Tartışma detaylarını ve kullanıcı profilini paralel olarak sorgula
      const [topicRes, meRes] = await Promise.all([
        discussionService.getDiscussionById(id as string),
        userService.getMyProfile().catch(() => null)
      ]);

      const data = topicRes.data;
      setTopic(data);

      // Yorumları hiyerarşik yapıya dönüştür
      const flatComments = data.comments || [];
      const commentMap = new Map();
      const roots: any[] = [];

      flatComments.forEach((c: any) => {
        commentMap.set(c.id, { ...c, replies: [] });
      });

      flatComments.forEach((c: any) => {
        if (c.parentId && commentMap.has(c.parentId)) {
          commentMap.get(c.parentId).replies.push(commentMap.get(c.id));
        } else if (!c.parentId) {
          roots.push(commentMap.get(c.id));
        }
      });
      setNestedComments(roots);

      // Kullanıcı profilini ve yazar takip durumunu güncelle
      const me = meRes?.data;
      if (me) {
        setCurrentUserId(me.id);
        const myFollowing: any[] = me.following || [];
        setIsFollowing(myFollowing.some((u: any) => u.id === data.authorId));
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Hata", "Tartışma yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  // Sayfayı spinner göstermeden arka planda güncelle
  const refreshInBackground = async () => {
    try {
      const response = await discussionService.getDiscussionById(id as string);
      const data = response.data;
      setTopic(data);
      const flatComments = data.comments || [];
      const commentMap = new Map();
      const roots: any[] = [];
      flatComments.forEach((c: any) => { commentMap.set(c.id, { ...c, replies: [] }); });
      flatComments.forEach((c: any) => {
        if (c.parentId && commentMap.has(c.parentId)) {
          commentMap.get(c.parentId).replies.push(commentMap.get(c.id));
        } else if (!c.parentId) {
          roots.push(commentMap.get(c.id));
        }
      });
      setNestedComments(roots);
    } catch (_) {}
  };

  const handleVoteTopic = async (value: number) => {
    // Optimistic update: UI'ı hemen güncelle
    setTopic((prev: any) => ({
      ...prev,
      votes: value === 1
        ? [...(prev.votes || []), { id: 'temp' }]
        : (prev.votes || []).slice(0, -1)
    }));
    try {
      await discussionService.voteDiscussion(id as string, value);
      // Arka planda gerçek veriyi senkronize et (spinner olmadan)
      refreshInBackground();
    } catch (error: any) {
      // Hata durumunda eski haline geri dönür (background fetch ile)
      refreshInBackground();
      Alert.alert("Hata", "Oylama işlemi başarısız.");
    }
  };

  const handleVoteComment = async (commentId: string, value: number) => {
    // Optimistic update: yorum oyunu anında güncelle
    const updateVote = (comments: any[]): any[] =>
      comments.map((c: any) => {
        if (c.id === commentId) {
          return {
            ...c,
            votes: value === 1
              ? [...(c.votes || []), { id: 'temp' }]
              : (c.votes || []).slice(0, -1),
          };
        }
        return { ...c, replies: updateVote(c.replies || []) };
      });
    setNestedComments(prev => updateVote(prev));
    try {
      await commentService.voteComment(commentId, value);
      refreshInBackground();
    } catch (error: any) {
      refreshInBackground();
      Alert.alert("Hata", "Oylama işlemi başarısız.");
    }
  };

  const handleFollowAuthor = async () => {
    if (!topic.authorId) return;
    try {
      setFollowLoading(true);
      await userService.followUser(topic.authorId);
      setIsFollowing(true);
      Alert.alert("Başarılı", "Yazar takip edildi.");
    } catch (error: any) {
      Alert.alert("Hata", error.message);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;

    try {
      setSubmitting(true);
      await commentService.addComment({
        content: replyText,
        discussionId: id as string,
        parentId: replyToId || undefined
      });
      setReplyText("");
      setReplyToId(null);
      setReplyToUser(null);
      refreshInBackground(); // Spinner göstermeden arka planda güncelle
    } catch (error: any) {
      console.error(error);
      const msg = error.message || "Yanıt gönderilemedi.";
      if (msg.toLowerCase().includes("topluluk kuralları") || msg.toLowerCase().includes("ihlal")) {
        Alert.alert("Topluluk Kuralları İhlali", msg);
      } else {
        Alert.alert("Hata", msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#6B6B5F" />
        <Text className="text-pencil mt-4" style={{ fontFamily: "System" }}>Yükleniyor...</Text>
      </View>
    );
  }

  if (!topic) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-charcoal text-lg mb-4" style={{ fontFamily: "Courier" }}>Tartışma bulunamadı.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-charcoal underline" style={{ fontFamily: "System" }}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* Back Button */}
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: Platform.OS === "ios" ? 28 : 16,
            marginBottom: 24,
            paddingVertical: 10,
          }}
        >
          <ArrowLeft size={16} color="#6B6B5F" />
          <Text className="text-pencil ml-2" style={{ fontFamily: "System" }}>Tartışmalara dön</Text>
        </TouchableOpacity>

        {/* Main Topic Card */}
        <View
          style={{
            backgroundColor: "#FFFEF5",
            padding: 24,
            marginBottom: 32,
            borderWidth: 2,
            borderColor: "#6B6B5F",
            borderLeftWidth: 5,
            borderLeftColor: accentColor,
            borderRadius: 2,
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 0,
          }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-row items-center">
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: accentColor + "22",
                  borderWidth: 1.5,
                  borderColor: accentColor + "55",
                  borderRadius: 2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontFamily: "Courier", fontSize: 14, color: accentColor, fontWeight: "bold" }}>
                  {topic.author?.username?.substring(0, 2).toUpperCase() || "??"}
                </Text>
              </View>
              <View className="ml-3">
                <Text className="text-charcoal" style={{ fontFamily: "Courier" }}>{topic.author?.username || "Bilinmeyen"}</Text>
                <Text className="text-pencil text-xs" style={{ fontFamily: "System" }}>
                  {new Date(topic.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              {/* Kendi yazısı değilse ve takip etmiyorsa butonu göster */}
              {currentUserId !== topic.authorId && (
                isFollowing ? (
                  <View className="px-3 py-1.5 border border-border rounded-sm">
                    <Text className="text-pencil text-xs" style={{ fontFamily: "Courier" }}>✓ Takip Ediliyor</Text>
                  </View>
                ) : (
                  <TouchableOpacity 
                    onPress={handleFollowAuthor}
                    disabled={followLoading}
                    className="px-3 py-1.5 border border-charcoal rounded-sm"
                  >
                    <Text className="text-charcoal text-xs font-bold" style={{ fontFamily: "Courier" }}>
                      {followLoading ? "..." : "Takip Et"}
                    </Text>
                  </TouchableOpacity>
                )
              )}
              <TouchableOpacity className="p-2 border border-border rounded-sm">
                <Flag size={14} color="#9B9B8F" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Başlık */}
          <Text style={{ fontFamily: "Courier", fontSize: 22, color: accentColor, lineHeight: 32, marginBottom: 16 }}>
            {topic.title}
          </Text>

          {/* Tags */}
          <View className="flex-row flex-wrap mb-4 gap-2">
            <View className="px-2 py-1 border border-border rounded-sm">
              <Text className="text-pencil text-xs" style={{ fontFamily: "System" }}>Tartışma</Text>
            </View>
          </View>

          {/* Content */}
          <Text className="text-charcoal text-base mb-6" style={{ fontFamily: "System", lineHeight: 24 }}>
            {topic.content}
          </Text>

          {/* Interaction Row */}
          <View className="flex-row items-center gap-4 py-4 border-y border-dashed border-border mb-6">
            <TouchableOpacity
              onPress={() => handleVoteTopic(1)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderWidth: 1.5,
                borderColor: accentColor,
                borderRadius: 2,
                backgroundColor: accentColor + "11",
              }}
            >
              <ThumbsUp size={16} color={accentColor} />
              <Text style={{ fontFamily: "Courier", fontSize: 14, color: accentColor, fontWeight: "bold" }}>
                {topic.votes?.length || 0}
              </Text>
            </TouchableOpacity>
            
            <View className="flex-row items-center gap-2">
              <MessageSquare size={16} color="#6B6B5F" />
              <Text className="text-pencil text-sm" style={{ fontFamily: "System" }}>
                {topic.comments?.length || 0} yanıt
              </Text>
            </View>
          </View>

          {/* Color accent underline */}
          <View className="h-0.5 bg-pencil w-1/3 opacity-30" />
        </View>

        {/* Entelektüel Öneriler */}
        <IntellectualRecommendations discussionId={id as string} />

        {/* Replies Section */}
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <MessageSquare size={20} color="#6B6B5F" />
            <Text className="text-charcoal text-lg ml-2" style={{ fontFamily: "Courier" }}>
              Yanıtlar ({topic.comments?.length || 0})
            </Text>
          </View>

          {nestedComments.length > 0 ? (
            <View className="space-y-4">
              {nestedComments.map((reply: any) => (
                <View key={reply.id} className="mb-4">
                  {/* Parent Comment */}
                  <View
                    style={{
                      backgroundColor: "#FFFEF5",
                      padding: 20,
                      borderWidth: 1,
                      borderColor: "#D4D2C8",
                      borderLeftWidth: 3,
                      borderLeftColor: accentColor,
                      borderRadius: 2,
                      shadowColor: "#000",
                      shadowOffset: { width: 2, height: 2 },
                      shadowOpacity: 0.08,
                      shadowRadius: 0,
                    }}
                  >
                    <View className="flex-row items-center mb-3">
                      <View className="w-8 h-8 bg-border items-center justify-center rounded-sm">
                        <Text className="text-charcoal text-xs" style={{ fontFamily: "Courier" }}>
                          {reply.author?.username?.substring(0, 2).toUpperCase() || "??"}
                        </Text>
                      </View>
                      <View className="ml-3">
                        <Text className="text-charcoal text-sm" style={{ fontFamily: "Courier" }}>{reply.author?.username || "Anonim"}</Text>
                        <Text className="text-pencil text-xs" style={{ fontFamily: "System" }}>
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>

                    <Text className="text-charcoal text-sm mb-4" style={{ fontFamily: "System", lineHeight: 22 }}>
                      {reply.content}
                    </Text>

                    <View className="flex-row items-center gap-4">
                      <TouchableOpacity 
                        onPress={() => handleVoteComment(reply.id, 1)}
                        className="flex-row items-center px-3 py-1.5 border border-border rounded-sm"
                      >
                        <ThumbsUp size={12} color="#6B6B5F" />
                        <Text className="text-pencil text-xs ml-1" style={{ fontFamily: "Courier" }}>
                          {reply.votes?.length || 0}
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        onPress={() => {
                          setReplyToId(reply.id);
                          setReplyToUser(reply.author?.username);
                        }}
                        className="flex-row items-center gap-1"
                      >
                        <MessageSquare size={14} color="#6B6B5F" />
                        <Text className="text-pencil text-xs" style={{ fontFamily: "Courier" }}>Yanıtla</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Nested Replies */}
                  {reply.replies && reply.replies.length > 0 && (
                    <View className="ml-6 mt-2 space-y-3">
                      {reply.replies.map((nested: any) => (
                        <View 
                          key={nested.id}
                          className="bg-[#FAFAF5] p-4 border border-border rounded-sm"
                          style={{ borderLeftWidth: 3, borderLeftColor: "#E85D4E" }}
                        >
                          <View className="flex-row items-center mb-2">
                            <Text className="text-charcoal text-xs font-bold" style={{ fontFamily: "Courier" }}>
                              {nested.author?.username || "Anonim"}
                            </Text>
                            <Text className="text-pencil text-[10px] ml-2" style={{ fontFamily: "System" }}>
                              {new Date(nested.createdAt).toLocaleDateString()}
                            </Text>
                          </View>
                          <Text className="text-charcoal text-xs mb-3" style={{ fontFamily: "System", lineHeight: 18 }}>
                            {nested.content}
                          </Text>
                          <TouchableOpacity 
                            onPress={() => handleVoteComment(nested.id, 1)}
                            className="flex-row items-center self-start"
                          >
                            <ThumbsUp size={10} color="#6B6B5F" />
                            <Text className="text-pencil text-[10px] ml-1" style={{ fontFamily: "Courier" }}>
                              {nested.votes?.length || 0}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-pencil text-center p-6" style={{ fontFamily: "System" }}>
              Henüz yanıt yok. İlk yanıtı sen yaz!
            </Text>
          )}
        </View>

        {/* Reply Form */}
        <View 
          className="bg-paper p-6 border-2 border-pencil rounded-sm mb-4"
          style={{ shadowColor: "#000", shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.15, shadowRadius: 0 }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-charcoal text-lg" style={{ fontFamily: "Courier" }}>
              {replyToId ? `${replyToUser} kullanıcısına yanıt ver` : "Yanıt Yaz"}
            </Text>
            {replyToId && (
              <TouchableOpacity onPress={() => { setReplyToId(null); setReplyToUser(null); }}>
                <Text className="text-crimson text-xs underline" style={{ fontFamily: "System" }}>İptal</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <TextInput
            multiline
            numberOfLines={4}
            value={replyText}
            onChangeText={setReplyText}
            placeholder="Düşüncelerini paylaş..."
            placeholderTextColor="#9B9B8F"
            className="p-4 border text-charcoal mb-4 rounded-sm"
            style={{ 
              borderColor: focusedInput ? "#2C2C28" : "#D4D2C8", 
              fontFamily: "System", 
              minHeight: 100, 
              textAlignVertical: 'top' 
            }}
            onFocus={() => setFocusedInput(true)}
            onBlur={() => setFocusedInput(false)}
          />

          <TouchableOpacity 
            onPress={handleSubmitReply}
            disabled={submitting}
            className={`py-3 px-6 self-start rounded-sm border-2 border-charcoal ${submitting ? 'bg-pencil' : 'bg-charcoal'}`}
            style={{ shadowColor: "#000", shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.15, shadowRadius: 0 }}
          >
            <Text className="text-paper font-bold" style={{ fontFamily: "Courier" }}>
              {submitting ? "Gönderiliyor..." : "Yanıtla"}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
