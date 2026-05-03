import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { Mail, Lock, ArrowLeft } from "lucide-react-native";
import authService from "../src/services/authService";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      setLoading(true);
      await authService.login({ email, password });
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Giriş Başarısız", error.message);
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
            <View className="mb-6">
              <Image 
                source={require('../assets/images/logo.png')} 
                style={{ width: 80, height: 80 }} 
                resizeMode="contain" 
              />
            </View>
            <Text className="text-charcoal text-2xl" style={{ fontFamily: "Courier" }}>Hoş Geldin</Text>
            <Text className="text-pencil text-sm mt-2" style={{ fontFamily: "System" }}>Tartışmaya devam etmek için giriş yap</Text>
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

            {/* Password Input */}
            <View className="mt-6">
              <Text className="text-pencil mb-2" style={{ fontFamily: "System" }}>Şifre</Text>
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
              <TouchableOpacity 
                onPress={() => router.push("/forgot-password")}
                className="mt-2 self-end"
              >
                <Text className="text-pencil text-xs underline" style={{ fontFamily: "System" }}>Şifremi Unuttum</Text>
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              onPress={handleLogin}
              disabled={loading}
              className={`mt-10 py-4 items-center rounded-sm border-2 border-charcoal ${loading ? 'bg-pencil' : 'bg-charcoal'}`}
              style={{ shadowColor: "#000", shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.15, shadowRadius: 0 }}
            >
              <Text className="text-paper text-lg font-bold" style={{ fontFamily: "Courier" }}>
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-border" />
              <Text className="mx-4 text-pencil text-xs" style={{ fontFamily: "System" }}>veya</Text>
              <View className="flex-1 h-px bg-border" />
            </View>

            {/* Register Link */}
            <TouchableOpacity 
              onPress={() => router.push("/register")}
              className="items-center"
            >
              <Text className="text-pencil text-sm" style={{ fontFamily: "System" }}>
                Hesabın yok mu? <Text className="text-charcoal underline">Kayıt Ol</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
