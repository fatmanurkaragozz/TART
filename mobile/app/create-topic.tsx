import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Tag as TagIcon } from 'lucide-react-native';
import discussionService from '../src/services/discussionService';

const availableTags = [
  "Eğitim",
  "Sistem Eleştirisi",
  "Özgürlük",
  "Tartışma Kültürü",
  "Akademik Hayat",
  "Sosyal Sorunlar",
  "Teknoloji",
  "Politika",
];

export default function CreateTopicScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : prev.tags.length < 3 ? [...prev.tags, tag] : prev.tags,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      Alert.alert("Hata", "Lütfen başlık ve içerik alanlarını doldurun.");
      return;
    }

    setLoading(true);
    try {
      await discussionService.createDiscussion(formData);
      router.back();
    } catch (err: any) {
      Alert.alert("Hata", err.message || "Tartışma oluşturulurken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity 
          onPress={() => router.back()}
          className="flex-row items-center mb-8 mt-4"
        >
          <ArrowLeft size={16} color="#6B6B5F" />
          <Text className="text-pencil ml-2" style={{ fontFamily: "System" }}>İptal</Text>
        </TouchableOpacity>

        {/* Main Card */}
        <View 
          className="bg-paper p-6 border-2 border-pencil rounded-sm mb-6"
          style={{ shadowColor: "#000", shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.15, shadowRadius: 0 }}
        >
          {/* Header */}
          <Text className="text-charcoal text-2xl mb-2" style={{ fontFamily: "Courier" }}>Yeni Tartışma Başlat</Text>
          <Text className="text-pencil text-sm mb-6" style={{ fontFamily: "System" }}>
            Düşünceni paylaş, topluluğu tartışmaya davet et
          </Text>

          {/* Form */}
          <View className="space-y-6">
            
            {/* Title */}
            <View>
              <Text className="text-pencil mb-2" style={{ fontFamily: "System" }}>Başlık</Text>
              <TextInput
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                placeholder="Tartışma konunu özetleyen bir başlık..."
                placeholderTextColor="#9B9B8F"
                className="py-3 text-charcoal text-base"
                style={{
                  fontFamily: "Courier",
                  borderBottomWidth: 2,
                  borderBottomColor: focusedInput === "title" ? "#2C2C28" : "#D4D2C8",
                }}
                onFocus={() => setFocusedInput("title")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            {/* Content */}
            <View className="mt-6">
              <Text className="text-pencil mb-2" style={{ fontFamily: "System" }}>İçerik</Text>
              <TextInput
                multiline
                numberOfLines={8}
                value={formData.content}
                onChangeText={(text) => setFormData({ ...formData, content: text })}
                placeholder="Düşüncelerini detaylıca açıkla, sorularını sor..."
                placeholderTextColor="#9B9B8F"
                className="p-4 border text-charcoal rounded-sm"
                style={{
                  fontFamily: "System",
                  minHeight: 150,
                  textAlignVertical: "top",
                  borderColor: focusedInput === "content" ? "#2C2C28" : "#D4D2C8",
                }}
                onFocus={() => setFocusedInput("content")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            {/* Tags */}
            <View className="mt-6">
              <View className="flex-row items-center mb-3">
                <TagIcon size={14} color="#6B6B5F" />
                <Text className="text-pencil text-sm ml-2" style={{ fontFamily: "System" }}>Etiketler (en fazla 3)</Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isSelected = formData.tags.includes(tag);
                  const disabled = !isSelected && formData.tags.length >= 3;
                  return (
                    <TouchableOpacity
                      key={tag}
                      onPress={() => !disabled && toggleTag(tag)}
                      activeOpacity={disabled ? 1 : 0.7}
                      className={`px-3 py-1.5 border rounded-sm ${isSelected ? 'bg-charcoal' : 'bg-transparent'}`}
                      style={{
                        borderColor: isSelected ? "#2C2C28" : "#D4D2C8",
                        opacity: disabled ? 0.4 : 1,
                      }}
                    >
                      <Text 
                        className="text-xs" 
                        style={{ fontFamily: "System", color: isSelected ? "#F5F5F0" : "#6B6B5F" }}
                      >
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className={`mt-8 py-4 items-center rounded-sm border-2 border-charcoal ${loading ? 'bg-pencil' : 'bg-charcoal'}`}
              style={{ shadowColor: "#000", shadowOffset: { width: 3, height: 3 }, shadowOpacity: 0.15, shadowRadius: 0 }}
            >
              <Text className="text-paper text-lg font-bold" style={{ fontFamily: "Courier" }}>
                {loading ? "Yayınlanıyor..." : "Tartışmayı Yayınla"}
              </Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
