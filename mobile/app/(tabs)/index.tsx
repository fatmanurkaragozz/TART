import { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, RefreshControl, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import discussionService from '../../src/services/discussionService';
import userService from '../../src/services/userService';
import { MessageSquare, ArrowUpCircle, Clock, UserPlus } from 'lucide-react-native';
import { Alert } from 'react-native';

export default function HomeScreen() {
  const [discussions, setDiscussions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const [discussionsRes, trendingRes, suggestedRes] = await Promise.all([
        discussionService.getAllDiscussions(),
        discussionService.getTrending(),
        userService.getSuggestedUsers()
      ]);
      setDiscussions(discussionsRes.data);
      setTrending(trendingRes.data);
      setSuggestedUsers(suggestedRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollowUser = async (userId: string) => {
    try {
      await userService.followUser(userId);
      Alert.alert("Başarılı", "Kullanıcı takip edildi.");
      fetchData(); // Refresh list
    } catch (error: any) {
      Alert.alert("Hata", error.message);
    }
  };

  const handleVoteDiscussion = async (id: string, value: number) => {
    try {
      await discussionService.voteDiscussion(id, value);
      fetchData();
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const getColorAccent = (votes: number) => {
    if (votes >= 20) return "#8B9B7A"; // personal palette green
    if (votes >= 10) return "#F6C744"; // marker yellow
    if (votes >= 5) return "#E85D4E"; // red ballpoint
    if (votes >= 2) return "#4A90E2"; // ink blue accent
    return "#6B6B5F"; // monochrome
  };

  const renderItem = ({ item }: { item: any }) => {
    const votes = item._count?.votes || 0;
    const accentColor = getColorAccent(votes);
    
    return (
      <TouchableOpacity 
        onPress={() => router.push({ pathname: "/modal", params: { id: item.id } })}
        className="bg-paper p-5 mb-4 border border-border rounded-sm"
        style={{ shadowColor: "#000", shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.1, shadowRadius: 0 }}
      >
        <Text 
          className="text-charcoal text-lg mb-2" 
          style={{ fontFamily: "Courier", lineHeight: 24 }}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        <Text 
          className="text-pencil text-sm mb-4" 
          style={{ fontFamily: "System", lineHeight: 20 }}
          numberOfLines={2}
        >
          {item.content}
        </Text>

        {/* Tags simulation */}
        <View className="flex-row items-center justify-between mb-4 flex-wrap">
          <View className="flex-row flex-wrap gap-2">
            <View 
              className="px-2 py-1 rounded-sm border"
              style={{ borderColor: votes > 0 ? accentColor : "#D4D2C8" }}
            >
              <Text 
                className="text-xs" 
                style={{ fontFamily: "System", color: votes > 0 ? accentColor : "#6B6B5F" }}
              >
                Tartışma
              </Text>
            </View>
          </View>

          <View className="px-4 py-1.5 border border-charcoal rounded-sm">
            <Text className="text-charcoal text-xs" style={{ fontFamily: "Courier" }}>Katıl</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between pt-3 border-t border-border mt-1">
          <View className="flex-row items-center gap-1">
            <Clock size={14} color="#9B9B8F" />
            <Text className="text-xs" style={{ fontFamily: "System", color: "#9B9B8F" }}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <MessageSquare size={14} color="#6B6B5F" />
              <Text className="text-pencil text-xs" style={{ fontFamily: "System" }}>{item._count?.comments || 0}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => handleVoteDiscussion(item.id, 1)}
              className="flex-row items-center gap-1 bg-paper px-2 py-1 rounded-sm border border-border"
            >
              <ArrowUpCircle size={14} color="#8B9B7A" />
              <Text className="text-sage text-xs font-bold" style={{ fontFamily: "System" }}>{votes}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Color Accent Line based on Votes */}
        {votes > 0 && (
          <View 
            className="h-0.5 mt-4 opacity-40 rounded-full" 
            style={{ backgroundColor: accentColor, width: `${Math.min(100, 20 + votes * 10)}%` }} 
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-background px-4">
      <FlatList
        data={discussions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2C2C28" />
        }
        ListHeaderComponent={() => (
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-6">
              <View>
                <Text className="text-2xl text-charcoal mb-1" style={{ fontFamily: "Courier" }}>Tartışmalar</Text>
                <View className="h-0.5 bg-pencil w-12 opacity-30" />
              </View>
              <TouchableOpacity 
                onPress={() => router.push("/create-topic")}
                className="px-4 py-2 bg-charcoal rounded-sm"
                style={{ shadowColor: "#000", shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.15, shadowRadius: 0 }}
              >
                <Text className="text-paper font-bold" style={{ fontFamily: "Courier" }}>+ Yeni</Text>
              </TouchableOpacity>
            </View>

            {/* Trending Section */}
            {trending.length > 0 && (
              <View className="mb-6">
                <Text className="text-pencil text-sm mb-4 uppercase tracking-widest" style={{ fontFamily: "Courier" }}>Trend Tartışmalar</Text>
                <FlatList
                  horizontal
                  data={trending}
                  keyExtractor={(item: any) => `trend-${item.id}`}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }: { item: any }) => (
                    <TouchableOpacity 
                      onPress={() => router.push({ pathname: "/modal", params: { id: item.id } })}
                      className="bg-paper p-4 mr-4 border border-border rounded-sm w-64"
                      style={{ shadowColor: "#000", shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.05, shadowRadius: 0 }}
                    >
                      <Text className="text-charcoal text-base mb-3" style={{ fontFamily: "Courier" }} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <View className="flex-row items-center gap-1">
                        <MessageSquare size={12} color="#6B6B5F" />
                        <Text className="text-pencil text-xs" style={{ fontFamily: "System" }}>{item._count?.comments || 0} yanıt</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
            
            <View className="h-px bg-border mb-6 opacity-50" />

            {/* Suggested Users Section */}
            {suggestedUsers.length > 0 && (
              <View className="mb-6">
                <Text className="text-pencil text-sm mb-4 uppercase tracking-widest" style={{ fontFamily: "Courier" }}>Kimi Takip Etmeli?</Text>
                <FlatList
                  horizontal
                  data={suggestedUsers}
                  keyExtractor={(item: any) => `suggested-${item.id}`}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }: { item: any }) => (
                    <View 
                      className="bg-paper p-4 mr-4 border border-border rounded-sm w-48 items-center"
                      style={{ shadowColor: "#000", shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.05, shadowRadius: 0 }}
                    >
                      <View className="w-12 h-12 bg-border rounded-sm items-center justify-center mb-3">
                        <Text className="text-charcoal text-lg" style={{ fontFamily: "Courier" }}>
                          {item.username.substring(0, 2).toUpperCase()}
                        </Text>
                      </View>
                      <Text className="text-charcoal text-sm mb-4" style={{ fontFamily: "Courier" }} numberOfLines={1}>
                        @{item.username}
                      </Text>
                      <TouchableOpacity 
                        onPress={() => handleFollowUser(item.id)}
                        className="px-4 py-1.5 border border-charcoal rounded-sm w-full items-center"
                      >
                        <Text className="text-charcoal text-xs font-bold" style={{ fontFamily: "Courier" }}>Takip Et</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            )}

            <View className="h-px bg-border mb-6 opacity-50" />
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="py-20 items-center bg-paper border-2 border-dashed border-border rounded-sm p-6 mt-4">
            <Text className="text-pencil text-lg mb-2" style={{ fontFamily: "Courier" }}>İlk tartışmayı sen başlat</Text>
            <Text className="text-pencil text-sm text-center mb-6" style={{ fontFamily: "System" }}>
              Henüz hiç tartışma yok. Topluluğu sen başlat!
            </Text>
            <TouchableOpacity 
              onPress={() => router.push("/create-topic")}
              className="px-6 py-3 bg-charcoal rounded-sm"
            >
              <Text className="text-paper text-sm" style={{ fontFamily: "Courier" }}>+ Yeni Tartışma</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
