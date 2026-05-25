import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import { User, Edit2, MessageSquare, Clock, LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import userService from '../../src/services/userService';
import authService from '../../src/services/authService';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getMyProfile();
      setProfile(response.data);
      setFullName(response.data.fullName || "");
    } catch (err: any) {
      Alert.alert("Hata", err.message || "Profil bilgileri yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      await userService.updateProfile({ fullName });
      await fetchProfile();
      setIsEditing(false);
      Alert.alert("Başarılı", "Profil güncellendi.");
    } catch (err: any) {
      Alert.alert("Hata", err.message || "Profil güncellenemedi");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#6B6B5F" />
        <Text className="text-pencil mt-4" style={{ fontFamily: "System" }}>Profil yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20 }}>
      {/* Profile Card */}
      <View 
        className="bg-paper p-6 border-2 border-pencil rounded-sm mb-8"
        style={{ shadowColor: "#000", shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.15, shadowRadius: 0 }}
      >
        <View className="flex-row mb-6">
          {/* Avatar */}
          <View className="w-20 h-20 bg-border border-2 border-border items-center justify-center rounded-sm mr-5">
            <Text className="text-charcoal text-2xl" style={{ fontFamily: "Courier" }}>
              {(profile?.fullName || profile?.username || "??").substring(0, 2).toUpperCase()}
            </Text>
          </View>
          
          <View className="flex-1 justify-center">
            {isEditing ? (
              <View className="mb-4">
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="İsim Soyisim"
                  className="p-2 border-b border-pencil text-charcoal"
                  style={{ fontFamily: "System" }}
                />
                <View className="flex-row gap-2 mt-3">
                  <TouchableOpacity 
                    onPress={handleUpdateProfile}
                    disabled={saving}
                    className="bg-charcoal px-4 py-2 rounded-sm"
                  >
                    <Text className="text-paper text-xs" style={{ fontFamily: "Courier" }}>
                      {saving ? "..." : "Kaydet"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setIsEditing(false)}
                    className="border border-border px-4 py-2 rounded-sm"
                  >
                    <Text className="text-pencil text-xs" style={{ fontFamily: "Courier" }}>İptal</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <Text className="text-charcoal text-2xl mb-1" style={{ fontFamily: "Courier" }}>
                  {profile?.fullName || profile?.username || "Misafir"}
                </Text>
                <Text className="text-pencil text-sm mb-3" style={{ fontFamily: "System" }}>
                  @{profile?.username || "guest"} · Tartışmalarım
                </Text>

                <TouchableOpacity 
                  onPress={() => setIsEditing(true)}
                  className="self-start flex-row items-center border border-pencil px-3 py-1.5 rounded-sm"
                >
                  <Edit2 size={14} color="#6B6B5F" />
                  <Text className="text-pencil text-xs ml-2" style={{ fontFamily: "Courier" }}>Profili Düzenle</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row justify-between mb-6">
          <View className="items-center">
            <Text className="text-charcoal text-2xl" style={{ fontFamily: "Courier" }}>{profile?._count?.discussions || 0}</Text>
            <Text className="text-pencil text-[10px] uppercase" style={{ fontFamily: "System" }}>Tartışma</Text>
          </View>
          <View className="items-center">
            <Text className="text-3xl" style={{ fontFamily: "Courier", color: "#4A90E2" }}>{profile?._count?.followedBy || 0}</Text>
            <Text className="text-pencil text-[10px] uppercase" style={{ fontFamily: "System" }}>Takipçi</Text>
          </View>
          <View className="items-center">
            <Text className="text-3xl" style={{ fontFamily: "Courier", color: "#8B9B7A" }}>{profile?._count?.following || 0}</Text>
            <Text className="text-pencil text-[10px] uppercase" style={{ fontFamily: "System" }}>Takip</Text>
          </View>
          <View className="items-center">
            <Text className="text-charcoal text-2xl" style={{ fontFamily: "Courier" }}>{profile?._count?.comments || 0}</Text>
            <Text className="text-pencil text-[10px] uppercase" style={{ fontFamily: "System" }}>Yanıt</Text>
          </View>
        </View>

        <View className="border-t border-dashed border-border pt-4">
          <Text className="text-sage text-sm italic" style={{ fontFamily: "System", color: "#8B9B7A" }}>
            "Eleştiri özgürlüğü, düşünce özgürlüğünün temelidir."
          </Text>
        </View>
      </View>

      {/* My Topics */}
      <View className="mb-6">
        <Text className="text-charcoal text-xl mb-4" style={{ fontFamily: "Courier" }}>Tartışmalarım</Text>

        {profile?.discussions?.length > 0 ? (
          profile.discussions.map((topic: any, index: number) => (
            <TouchableOpacity 
              key={topic.id}
              onPress={() => router.push({ pathname: "/modal", params: { id: topic.id } })}
              className="bg-paper p-5 border border-border rounded-sm mb-3"
              style={{ shadowColor: "#000", shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.1, shadowRadius: 0 }}
            >
              <Text className="text-charcoal text-base mb-3" style={{ fontFamily: "Courier" }}>
                {topic.title}
              </Text>
              
              <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-1.5">
                  <MessageSquare size={14} color="#6B6B5F" />
                  <Text className="text-pencil text-xs" style={{ fontFamily: "System" }}>
                    {topic._count?.comments || 0} yanıt
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Clock size={14} color="#9B9B8F" />
                  <Text className="text-xs" style={{ fontFamily: "System", color: "#9B9B8F" }}>
                    {new Date(topic.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text className="text-pencil text-center py-8" style={{ fontFamily: "System" }}>
            Henüz bir tartışma başlatmadınız.
          </Text>
        )}
      </View>
      
      {/* Logout */}
      <TouchableOpacity 
        className="flex-row items-center justify-center p-4 border border-red-400 rounded-sm mt-4 mb-8 bg-white"
        style={{ shadowColor: "#000", shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.1, shadowRadius: 0 }}
        onPress={() => {
          Alert.alert(
            "Çıkış Yap",
            "Hesabınızdan çıkış yapmak istediğinize emin misiniz?",
            [
              { text: "Vazgeç", style: "cancel" },
              { 
                text: "Çıkış Yap", 
                style: "destructive",
                onPress: async () => {
                  try {
                    await authService.logout();
                    // Token temizlendi, açılış sayfasına yönlendir
                    setTimeout(() => {
                      try { router.dismissAll(); } catch (_) {}
                      router.replace("/");
                    }, 300);
                  } catch (err) {
                    Alert.alert("Hata", "Çıkış yapılırken bir hata oluştu.");
                  }
                }
              }
            ]
          );
        }}
      >
        <LogOut size={16} color="#C44536" />
        <Text className="text-crimson font-bold ml-2" style={{ fontFamily: "Courier", color: "#C44536" }}>Çıkış Yap</Text>
      </TouchableOpacity>
      
    </ScrollView>
  );
}
