import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Lock, ArrowLeft, CheckCircle2 } from "lucide-react-native";
import authService from "../../src/services/authService";

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler uyuşmuyor.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Hata", "Şifre en az 6 karakter olmalıdır.");
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword(token as string, { password });
      Alert.alert(
        "Başarılı", 
        "Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.",
        [{ text: "Giriş Yap", onPress: () => router.replace("/login") }]
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
              <Lock size={32} color="#2C2C28" />
            </View>
            <Text className="text-charcoal text-2xl font-bold" style={{ fontFamily: "Courier" }}>Yeni Şifre</Text>
            <Text className="text-pencil text-sm mt-2 text-center" style={{ fontFamily: "System" }}>
              Lütfen yeni şifrenizi belirleyin.
            </Text>
          </View>

          <View className="space-y-6">
            {/* Password Input */}
            <View>
              <Text className="text-pencil mb-2" style={{ fontFamily: "System" }}>Yeni Şifre</Text>
              <View className="flex-row items-center relative">
                <View className="absolute left-3 z-10">
                  <Lock size={18} color="#6B6B5F" />
                </View>
                <TextInput
                  className="flex-1 pl-10 pr-4 py-3 text-charcoal"
                  style={{
                    fontFamily: "Courier",
                    fontSize: 16,
                    borderBottomWidth: 2,
                    borderBottomColor: focusedInput === "password" ? "#2C2C28" : "#6B6B5F",
                  }}
                  placeholder="••••••••"
                  placeholderTextColor="#9B9B8F"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Confirm Password Input */}
            <View className="mt-6">
              <Text className="text-pencil mb-2" style={{ fontFamily: "System" }}>Şifre Tekrar</Text>
              <View className="flex-row items-center relative">
                <View className="absolute left-3 z-10">
                  <Lock size={18} color="#6B6B5F" />
                </View>
                <TextInput
                  className="flex-1 pl-10 pr-4 py-3 text-charcoal"
                  style={{
                    fontFamily: "Courier",
                    fontSize: 16,
                    borderBottomWidth: 2,
                    borderBottomColor: focusedInput === "confirmPassword" ? "#2C2C28" : "#6B6B5F",
                  }}
                  placeholder="••••••••"
                  placeholderTextColor="#9B9B8F"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  onFocus={() => setFocusedInput("confirmPassword")}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              onPress={handleResetPassword}
              disabled={loading}
              className={`mt-10 py-4 items-center rounded-sm border-2 border-charcoal flex-row justify-center ${loading ? 'bg-pencil' : 'bg-charcoal'}`}
              style={{ shadowColor: "#000", shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.15, shadowRadius: 0 }}
            >
              {!loading && <CheckCircle2 size={18} color="white" className="mr-2" style={{marginRight: 10}} />}
              <Text className="text-paper text-lg font-bold" style={{ fontFamily: "Courier" }}>
                {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
