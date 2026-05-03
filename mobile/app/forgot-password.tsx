import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Mail, ArrowLeft, Send } from "lucide-react-native";
import authService from "../src/services/authService";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const router = useRouter();

  const handleResetRequest = async () => {
    if (!email) {
      Alert.alert("Hata", "Lütfen e-posta adresinizi girin.");
      return;
    }

    try {
      setLoading(true);
      await authService.forgotPassword(email);
      Alert.alert(
        "Başarılı", 
        "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.",
        [{ text: "Tamam", onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert("İşlem Başarısız", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="px-6 py-12">
        
        {/* Back Button */}
        <TouchableOpacity 
          onPress={() => router.back()}
          className="absolute top-12 left-6 flex-row items-center"
        >
          <ArrowLeft size={20} color="#6B6B5F" />
          <Text className="text-pencil ml-2" style={{ fontFamily: "System" }}>Geri</Text>
        </TouchableOpacity>

        <View 
          className="bg-paper p-8 border-2 border-pencil rounded-sm mt-12"
          style={{ shadowColor: "#000", shadowOffset: { width: 6, height: 6 }, shadowOpacity: 0.15, shadowRadius: 0 }}
        >
          {/* Header */}
          <View className="mb-8 items-center">
            <View className="bg-charcoal/5 p-4 rounded-full mb-4">
              <Mail size={32} color="#2C2C28" />
            </View>
            <Text className="text-charcoal text-2xl font-bold" style={{ fontFamily: "Courier" }}>Şifremi Unuttum</Text>
            <Text className="text-pencil text-sm mt-2 text-center" style={{ fontFamily: "System" }}>
              E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
            </Text>
          </View>

          <View className="space-y-6">
            {/* Email Input */}
            <View>
              <Text className="text-pencil mb-2" style={{ fontFamily: "System" }}>E-posta</Text>
              <View className="flex-row items-center relative">
                <View className="absolute left-3 z-10">
                  <Mail size={18} color="#6B6B5F" />
                </View>
                <TextInput
                  className="flex-1 pl-10 pr-4 py-3 text-charcoal"
                  style={{
                    fontFamily: "Courier",
                    fontSize: 16,
                    borderBottomWidth: 2,
                    borderBottomColor: focusedInput === "email" ? "#2C2C28" : "#6B6B5F",
                  }}
                  placeholder="ornek@mail.com"
                  placeholderTextColor="#9B9B8F"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              onPress={handleResetRequest}
              disabled={loading}
              className={`mt-10 py-4 items-center rounded-sm border-2 border-charcoal flex-row justify-center ${loading ? 'bg-pencil' : 'bg-charcoal'}`}
              style={{ shadowColor: "#000", shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.15, shadowRadius: 0 }}
            >
              {!loading && <Send size={18} color="white" className="mr-2" style={{marginRight: 10}} />}
              <Text className="text-paper text-lg font-bold" style={{ fontFamily: "Courier" }}>
                {loading ? "Gönderiliyor..." : "Bağlantı Gönder"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.back()}
              className="mt-6 items-center"
            >
              <Text className="text-pencil text-sm" style={{ fontFamily: "System" }}>
                Giriş ekranına dön
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
