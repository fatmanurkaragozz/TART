import { useState, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ArrowLeft, Shield, FileText, Users, Mail, Send } from "lucide-react-native";
import authService from "../src/services/authService";
import contactService from "../src/services/contactService";
import userService from "../src/services/userService";

const LEGAL_CONTENT: Record<string, { title: string; icon: any; iconColor: string; paragraphs: string[] }> = {
  privacy: {
    title: "Gizlilik Politikası",
    icon: Shield,
    iconColor: "#4A90E2",
    paragraphs: [
      "TART olarak gizliliğinize önem veriyoruz. Bu politika, verilerinizin nasıl işlendiğini açıklar.",
      "1. Veri Toplama: Sadece platformun işleyişi için gerekli olan e-posta ve kullanıcı adı bilgilerini topluyoruz.",
      "2. Veri Kullanımı: Verileriniz, profilinizi oluşturmak ve platform içi bildirimler göndermek amacıyla kullanılır.",
      "3. Veri Güvenliği: Şifreleriniz modern hashleme yöntemleri ile korunmaktadır.",
      "4. Üçüncü Taraflar: Verileriniz asla reklam veya başka amaçlarla üçüncü taraflarla paylaşılmaz.",
    ],
  },
  terms: {
    title: "Kullanım Koşulları",
    icon: FileText,
    iconColor: "#E85D4E",
    paragraphs: [
      "TART platformunu kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.",
      "1. Sorumluluk: Paylaşılan içeriklerin sorumluluğu tamamen kullanıcıya aittir.",
      "2. Uygunluk: Diğer kullanıcılara hakaret, küfür veya tehdit içeren paylaşımlar yasaktır.",
      "3. Hesap Güvenliği: Hesabınızın güvenliğini sağlamak sizin sorumluluğunuzdadır.",
      "4. Hizmet Değişikliği: TART, önceden haber vermeksizin hizmet özelliklerini değiştirme hakkını saklı tutar.",
    ],
  },
  guidelines: {
    title: "Topluluk Kuralları",
    icon: Users,
    iconColor: "#8B9B7A",
    paragraphs: [
      "Sağlıklı bir tartışma ortamı için aşağıdaki kurallara uyulması zorunludur.",
      "1. Fikirlere Odaklanın: Tartışmalarda kişileri değil, düşünceleri eleştirin.",
      "2. Saygı: Farklı görüşlere sahip kullanıcılara karşı her zaman saygılı olun.",
      "3. Kanıt ve Mantık: Eleştirilerinizi mümkün olduğunca mantıklı temellere oturtun.",
      "4. Spam ve Taciz: Platformun huzurunu kaçıracak spam veya taciz edici davranışlar yasaktır.",
    ],
  },
  contact: {
    title: "İletişim",
    icon: FileText,
    iconColor: "#6B6B5F",
    paragraphs: [
      "TART ekibiyle iletişime geçmek için aşağıdaki kanalları kullanabilirsiniz.",
      "E-posta: tart.platform4@gmail.com",
      "Instagram: @mind_of_dev1",
      "LinkedIn: Fatma Nur Karagöz",
      "Tüm geri bildirim ve önerilerinizi bekliyoruz. Eleştiriye her zaman açığız!",
    ],
  },
};

export default function LegalScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    message: ""
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await authService.getToken();
      if (token) {
        setIsLoggedIn(true);
      }
    } catch (e) {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.subject.trim() || !formData.message.trim()) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      setSubmitting(true);
      // Not: Backend tarafında auth check yapıldığı için user bilgisini oradan alacak.
      // Frontend'de sadece gerekli alanları gönderiyoruz.
      // Ancak Prisma modelinde name ve email de zorunlu olabilir (schema'ya bakmalıyım)
      // Evet, schema'da zorunlu. User bilgisini çekip eklemeliyiz.
      
      const meRes = await userService.getMyProfile();
      const me = meRes?.data;
      
      await contactService.sendMessage({
        ...formData,
        name: me.fullName || me.username,
        email: me.email
      });
      
      Alert.alert("Başarılı", "Mesajınız iletildi.");
      setFormData({ subject: "", message: "" });
    } catch (error: any) {
      Alert.alert("Hata", error.message || "Mesaj gönderilemedi.");
    } finally {
      setSubmitting(false);
    }
  };

  const content = LEGAL_CONTENT[type ?? "privacy"] ?? LEGAL_CONTENT.privacy;
  const IconComponent = content.icon;

  return (
    <>
      <Stack.Screen options={{ title: "Hukuki", headerStyle: { backgroundColor: "#F5F5F0" }, headerTintColor: "#2C2C28", headerTitleStyle: { fontFamily: "Courier" } }} />
      <ScrollView
        style={{ flex: 1, backgroundColor: "#F5F5F0" }}
        contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
      {/* Geri Butonu */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 28 }}
      >
        <ArrowLeft size={16} color="#6B6B5F" />
        <Text style={{ fontFamily: "System", fontSize: 13, color: "#6B6B5F", marginLeft: 6 }}>
          Geri Dön
        </Text>
      </TouchableOpacity>

      {/* Ana Kart */}
      <View
        style={{
          backgroundColor: "#FFFEF5",
          borderWidth: 2,
          borderColor: "#6B6B5F",
          borderRadius: 2,
          padding: 28,
          shadowColor: "#6B6B5F",
          shadowOffset: { width: 6, height: 6 },
          shadowOpacity: 0.18,
          shadowRadius: 0,
          elevation: 4,
        }}
      >
        {/* İkon + Başlık */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <IconComponent size={44} color={content.iconColor} />
          <Text
            style={{
              fontFamily: "Courier",
              fontSize: 22,
              color: "#2C2C28",
              marginTop: 12,
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            {content.title}
          </Text>
          <View style={{ height: 1, width: 80, backgroundColor: "#6B6B5F", opacity: 0.3 }} />
        </View>

        {/* Paragraflar */}
        <View style={{ gap: 16 }}>
          {content.paragraphs.map((p, i) => (
            <Text
              key={i}
              style={{
                fontFamily: "System",
                fontSize: 14,
                color: "#6B6B5F",
                lineHeight: 22,
                borderLeftWidth: i === 0 ? 0 : 2,
                borderLeftColor: "#D4D2C8",
                paddingLeft: i === 0 ? 0 : 12,
              }}
            >
              {p}
            </Text>
          ))}
        </View>

        {/* İletişim Formu / Giriş Uyarısı (Sadece iletişim tipindeyse) */}
        {type === "contact" && (
          <View style={{ marginTop: 32, paddingTop: 24, borderTopWidth: 1, borderTopColor: "#D4D2C8" }}>
            {loading ? (
              <ActivityIndicator color="#6B6B5F" />
            ) : !isLoggedIn ? (
              <View style={{ backgroundColor: "#F5F5F0", padding: 20, borderRadius: 2, borderWidth: 1, borderColor: "#D4D2C8", borderStyle: "dashed", alignItems: "center" }}>
                <Users size={32} color="#6B6B5F" style={{ marginBottom: 12 }} />
                <Text style={{ fontFamily: "Courier", fontSize: 16, color: "#2C2C28", marginBottom: 8, textAlign: "center" }}>Giriş Yapmalısınız</Text>
                <Text style={{ fontFamily: "System", fontSize: 12, color: "#6B6B5F", textAlign: "center", marginBottom: 16, lineHeight: 18 }}>
                  Mesaj gönderebilmek için lütfen giriş yapın veya kayıt olun.
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/login")}
                  style={{ backgroundColor: "#2C2C28", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 2 }}
                >
                  <Text style={{ fontFamily: "Courier", fontSize: 13, color: "#F5F5F0" }}>Giriş Yap</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ gap: 16 }}>
                <Text style={{ fontFamily: "Courier", fontSize: 16, color: "#2C2C28", marginBottom: 4 }}>Bize Yazın</Text>
                
                <View>
                  <Text style={{ fontFamily: "System", fontSize: 12, color: "#6B6B5F", marginBottom: 6 }}>Konu</Text>
                  <TextInput
                    value={formData.subject}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, subject: text }))}
                    placeholder="Konu başlığı..."
                    placeholderTextColor="#9B9B8F"
                    style={{ backgroundColor: "#F5F5F0", padding: 12, borderRadius: 2, borderWidth: 1, borderColor: "#D4D2C8", fontFamily: "System", fontSize: 14 }}
                  />
                </View>

                <View>
                  <Text style={{ fontFamily: "System", fontSize: 12, color: "#6B6B5F", marginBottom: 6 }}>Mesajınız</Text>
                  <TextInput
                    multiline
                    numberOfLines={5}
                    value={formData.message}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, message: text }))}
                    placeholder="Düşüncelerinizi buraya yazın..."
                    placeholderTextColor="#9B9B8F"
                    style={{ backgroundColor: "#F5F5F0", padding: 12, borderRadius: 2, borderWidth: 1, borderColor: "#D4D2C8", fontFamily: "System", fontSize: 14, minHeight: 100, textAlignVertical: "top" }}
                  />
                </View>

                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={submitting}
                  style={{ 
                    backgroundColor: "#2C2C28", 
                    paddingVertical: 14, 
                    borderRadius: 2, 
                    flexDirection: "row", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    gap: 10,
                    opacity: submitting ? 0.7 : 1
                  }}
                >
                  <Send size={18} color="#F5F5F0" />
                  <Text style={{ fontFamily: "Courier", fontSize: 14, color: "#F5F5F0" }}>
                    {submitting ? "Gönderiliyor..." : "Mesajı Gönder"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Alt Not */}
        <View
          style={{
            marginTop: 28,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: "#D4D2C8",
            borderStyle: "dashed",
            alignItems: "center",
          }}
        >
          <Text style={{ fontFamily: "System", fontSize: 11, color: "#9B9B8F", fontStyle: "italic" }}>
            Son güncelleme: 6 Mayıs 2026
          </Text>
        </View>
      </View>
      </ScrollView>
    </>
  );
}
