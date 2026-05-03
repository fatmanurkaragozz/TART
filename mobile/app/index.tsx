import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { ArrowRight, BookOpen, Shield, TrendingUp } from "lucide-react-native";

export default function LandingScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Paper texture base */}
      <View className="px-6 py-20 flex-1 justify-center min-h-screen">
        
        {/* Logo */}
        <View className="mb-6">
          <Image 
            source={require('../assets/images/logo.png')} 
            style={{ width: 60, height: 60 }} 
            resizeMode="contain" 
          />
        </View>

        {/* Badge */}
        <View 
          className="self-start px-3 py-1 mb-6 rounded-sm border"
          style={{ borderColor: "#6B6B5F" }}
        >
          <Text className="text-pencil text-xs" style={{ fontFamily: "System" }}>
            Eleştiri kültürünü birlikte inşa ediyoruz
          </Text>
        </View>

        {/* Hero Title */}
        <Text 
          className="text-charcoal text-4xl mb-6"
          style={{ fontFamily: "Courier", lineHeight: 48, letterSpacing: 0.5 }}
        >
          Eleştirmeyi öğrenmeden gelişemeyiz.
        </Text>

        {/* Separator line */}
        <View className="h-0.5 w-32 bg-pencil mb-6 opacity-40" />

        {/* Subtitle */}
        <Text 
          className="text-pencil text-lg mb-10"
          style={{ fontFamily: "System", lineHeight: 28 }}
        >
          TART, fikirlerin dengeli biçimde tartışıldığı, eleştirinin gelişime dönüştüğü bir alan.
        </Text>

        {/* Actions */}
        <View className="space-y-4 mb-16">
          <TouchableOpacity 
            onPress={() => router.push("/register")}
            className="bg-charcoal py-4 px-6 flex-row items-center justify-between rounded-sm"
            style={{ shadowColor: "#000", shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.15, shadowRadius: 0 }}
          >
            <Text className="text-paper text-lg font-bold" style={{ fontFamily: "Courier" }}>TART'a Katıl</Text>
            <ArrowRight size={20} color="#F5F5F0" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push("/login")}
            className="py-4 px-6 items-center rounded-sm border-2 border-pencil"
          >
            <Text className="text-charcoal text-lg font-bold" style={{ fontFamily: "Courier" }}>Zaten Hesabım Var</Text>
          </TouchableOpacity>
        </View>

        {/* Trust Indicators / Features */}
        <View className="mt-8 space-y-6">
          <Text className="text-charcoal text-xl mb-4" style={{ fontFamily: "Courier" }}>Neden TART?</Text>
          
          <View className="flex-row items-start space-x-4">
            <BookOpen size={24} color="#6B6B5F" />
            <View className="flex-1 ml-4">
              <Text className="text-charcoal text-lg" style={{ fontFamily: "Courier" }}>Eleştiri Kültürü</Text>
              <Text className="text-pencil text-sm mt-1">Eleştiri, bastırılacak bir şey değil, gelişim için bir araçtır.</Text>
            </View>
          </View>

          <View className="flex-row items-start space-x-4">
            <Shield size={24} color="#6B6B5F" />
            <View className="flex-1 ml-4">
              <Text className="text-charcoal text-lg" style={{ fontFamily: "Courier" }}>Güvenli Alan</Text>
              <Text className="text-pencil text-sm mt-1">Saygılı ve yapıcı tartışmalar için modere edilen güvenli ortam.</Text>
            </View>
          </View>

          <View className="flex-row items-start space-x-4">
            <TrendingUp size={24} color="#6B6B5F" />
            <View className="flex-1 ml-4">
              <Text className="text-charcoal text-lg" style={{ fontFamily: "Courier" }}>Düşünerek Geliş</Text>
              <Text className="text-pencil text-sm mt-1">Sorgula, tartış, öğren ve eleştirel düşünme becerini geliştir.</Text>
            </View>
          </View>
        </View>
        
        {/* Bottom space */}
        <View className="h-20" />
      </View>
    </ScrollView>
  );
}
