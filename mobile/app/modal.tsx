import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Flag, MessageSquare, ThumbsUp } from 'lucide-react-native';
import discussionService from '../src/services/discussionService';
import commentService from '../src/services/commentService';
import userService from '../src/services/userService';
import { ThumbsUp as ThumbsUpFilled } from 'lucide-react-native';

export default function TopicDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [focusedInput, setFocusedInput] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTopicDetails();
    }
  }, [id]);

  const fetchTopicDetails = async () => {
    try {
      setLoading(true);
      const response = await discussionService.getDiscussionById(id as string);
      setTopic(response.data);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Hata", "Tartışma yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleVoteTopic = async (value: number) => {
    try {
      await discussionService.voteDiscussion(id as string, value);
      fetchTopicDetails();
    } catch (error: any) {
      Alert.alert("Hata", "Oylama işlemi başarısız.");
    }
  };

  const handleVoteComment = async (commentId: string, value: number) => {
    try {
      await commentService.voteComment(commentId, value);
      fetchTopicDetails();
    } catch (error: any) {
      Alert.alert("Hata", "Oylama işlemi başarısız.");
    }
  };

  const handleFollowAuthor = async () => {
    if (!topic.authorId) return;
    try {
      await userService.followUser(topic.authorId);
      Alert.alert("Başarılı", "Yazar takip edildi.");
    } catch (error: any) {
      Alert.alert("Hata", error.message);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;

    try {
      setSubmitting(true);
      await commentService.addComment({
        content: replyText,
        discussionId: id as string,
      });
      setReplyText("");
      fetchTopicDetails(); // Refresh list
    } catch (error: any) {
      console.error(error);
      Alert.alert("Hata", "Yanıt gönderilemedi.");
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
          className="flex-row items-center mb-6"
        >
          <ArrowLeft size={16} color="#6B6B5F" />
          <Text className="text-pencil ml-2" style={{ fontFamily: "System" }}>Tartışmalara dön</Text>
        </TouchableOpacity>

        {/* Main Topic Card */}
        <View 
          className="bg-paper p-6 mb-8 border-2 border-pencil rounded-sm"
          style={{ shadowColor: "#000", shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.15, shadowRadius: 0 }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-border items-center justify-center rounded-sm">
                <Text className="text-charcoal" style={{ fontFamily: "Courier" }}>
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
              <TouchableOpacity 
                onPress={handleFollowAuthor}
                className="px-3 py-1.5 border border-charcoal rounded-sm"
              >
                <Text className="text-charcoal text-xs font-bold" style={{ fontFamily: "Courier" }}>Takip Et</Text>
              </TouchableOpacity>
              <TouchableOpacity className="p-2 border border-border rounded-sm">
                <Flag size={14} color="#9B9B8F" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Title */}
          <Text className="text-charcoal text-2xl mb-4" style={{ fontFamily: "Courier", lineHeight: 32 }}>
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
              className="flex-row items-center gap-2 px-4 py-2 bg-paper border border-pencil rounded-sm"
            >
              <ThumbsUp size={16} color="#8B9B7A" />
              <Text className="text-charcoal font-bold" style={{ fontFamily: "Courier" }}>
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

        {/* Replies Section */}
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <MessageSquare size={20} color="#6B6B5F" />
            <Text className="text-charcoal text-lg ml-2" style={{ fontFamily: "Courier" }}>
              Yanıtlar ({topic.comments?.length || 0})
            </Text>
          </View>

          {topic.comments && topic.comments.length > 0 ? (
            <View className="space-y-4">
              {topic.comments.map((reply: any, index: number) => (
                <View 
                  key={reply.id} 
                  className="bg-paper p-5 border border-border rounded-sm mt-4"
                  style={{ borderLeftWidth: 3, borderLeftColor: "#E85D4E", shadowColor: "#000", shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.1, shadowRadius: 0 }}
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

                  <TouchableOpacity 
                    onPress={() => handleVoteComment(reply.id, 1)}
                    className="flex-row items-center self-start px-3 py-1.5 border border-border rounded-sm"
                  >
                    <ThumbsUp size={12} color="#6B6B5F" />
                    <Text className="text-pencil text-xs ml-1" style={{ fontFamily: "Courier" }}>
                      {reply.votes?.length || 0}
                    </Text>
                  </TouchableOpacity>
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
          <Text className="text-charcoal text-lg mb-4" style={{ fontFamily: "Courier" }}>Yanıt Yaz</Text>
          
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
