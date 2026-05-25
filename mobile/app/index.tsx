import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions, Linking } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { ArrowRight, Scale, BookOpen, Shield, Target, Lightbulb, Mail, TrendingUp } from "lucide-react-native";
import authService from "../src/services/authService";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Defter çizgilerini View ile simüle eden yardımcı bileşen
const NotebookLines = ({ count = 20, color = "#6B6B5F", opacity = 0.07, spacing = 40 }: { count?: number; color?: string; opacity?: number; spacing?: number }) => (
  <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity }}>
    {Array.from({ length: count }).map((_, i) => (
      <View
        key={i}
        style={{
          position: "absolute",
          top: i * spacing + 20,
          left: 0,
          right: 0,
          height: 0.8,
          backgroundColor: color,
        }}
      />
    ))}
    {/* Kırmızı kenar çizgisi */}
    <View style={{ position: "absolute", top: 0, bottom: 0, left: 60, width: 1, backgroundColor: "#C44536", opacity: 0.3 }} />
  </View>
);

export default function LandingScreen() {
  const scrollRef = useRef<any>(null);
  const router = useRouter();

  // Her bölüm için View ref'leri
  const nedenTartRef = useRef<any>(null);
  const nasilCalisirRef = useRef<any>(null);
  const manifestoRef = useRef<any>(null);

  function scrollTo(section: string) {
    const refMap: Record<string, React.RefObject<any>> = {
      nedenTart: nedenTartRef,
      nasilCalisir: nasilCalisirRef,
      manifesto: manifestoRef,
    };
    const targetRef = refMap[section];
    if (targetRef?.current && scrollRef.current) {
      targetRef.current.measureLayout(
        scrollRef.current,
        (_x: number, y: number) => {
          if (typeof scrollRef.current?.scrollTo === "function") {
            scrollRef.current.scrollTo({ y, animated: true });
          }
        },
        () => {}
      );
    }
  }

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await authService.getToken();
    if (token) {
      router.replace("/(tabs)");
    }
  };

  const features = [
    {
      icon: Lightbulb,
      title: "Eleştiri Kültürü",
      description: "Eleştiri, bastırılacak bir şey değil, gelişim için bir araçtır.",
    },
    {
      icon: Shield,
      title: "Güvenli Alan",
      description: "Saygılı ve yapıcı tartışmalar için modere edilen güvenli ortam.",
    },
    {
      icon: Target,
      title: "Düşünerek Geliş",
      description: "Sorgula, tartış, öğren ve eleştirel düşünme becerini geliştir.",
    },
  ];

  const principles = [
    {
      title: "Eleştiri susturulmaz.",
      description: "Fikirler, sistemler ve yapılar sorgulanabilir. Eleştiri özgürlüğü temel haktır.",
    },
    {
      title: "Eleştiri gelişim içindir.",
      description: "Yapıcı eleştiri sayesinde kendimizi, fikirlerimizi geliştirebiliriz.",
    },
    {
      title: "Eleştiri saygıyla yapılır.",
      description: "Saygılı ve düşünceli eleştiri, sağlıklı tartışma kültürünün temelidir.",
    },
  ];

  return (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1, backgroundColor: "#F5F5F0" }}
      showsVerticalScrollIndicator={false}
    >
      {/* ───── HERO SECTION ───── */}
      <View style={{ backgroundColor: "#F5F5F0", position: "relative", overflow: "hidden" }}>

        {/* Notebook lines background */}
        <NotebookLines count={25} spacing={40} opacity={0.07} />

        <View style={{ paddingHorizontal: 24, paddingTop: 64, paddingBottom: 40 }}>
          {/* Logo + TART başlığı yan yana */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Image
              source={require('../assets/images/logo.png')}
              style={{ width: 48, height: 48 }}
              resizeMode="contain"
            />
            <Text style={{ fontFamily: "Courier", fontSize: 22, color: "#2C2C28", letterSpacing: 2 }}>
              TART
            </Text>
          </View>

          {/* Badge */}
          <View
            style={{
              alignSelf: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderWidth: 1,
              borderColor: "#6B6B5F",
              borderRadius: 2,
              marginBottom: 24,
            }}
          >
            <Scale size={14} color="#6B6B5F" />
            <Text style={{ fontFamily: "System", fontSize: 11, color: "#6B6B5F" }}>
              Eleştiri kültürünü birlikte inşa ediyoruz
            </Text>
          </View>

          {/* Main headline */}
          <Text
            style={{
              fontFamily: "Courier",
              fontSize: 30,
              color: "#2C2C28",
              lineHeight: 40,
              letterSpacing: 0.5,
              marginBottom: 16,
            }}
          >
            Eleştirmeyi öğrenmeden gelişemeyiz.
          </Text>

          {/* Underline accent */}
          <View
            style={{
              height: 1.5,
              width: 120,
              backgroundColor: "#6B6B5F",
              opacity: 0.4,
              marginBottom: 20,
            }}
          />

          {/* Subtitle */}
          <Text
            style={{
              fontFamily: "System",
              fontSize: 16,
              color: "#6B6B5F",
              lineHeight: 26,
              marginBottom: 28,
            }}
          >
            TART, fikirlerin dengeli biçimde tartışıldığı, eleştirinin gelişime dönüştüğü bir alan.
          </Text>

          {/* Trust indicators */}
          <View style={{ marginBottom: 32, gap: 8 }}>
            {["Saygılı tartışma", "Açık fikirli topluluk", "Eleştiri kültürü"].map((label) => (
              <View key={label} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ color: "#8B9B7A", fontSize: 14 }}>✓</Text>
                <Text style={{ fontFamily: "System", fontSize: 13, color: "#6B6B5F" }}>{label}</Text>
              </View>
            ))}
          </View>

          {/* CTA Buttons */}
          <View style={{ gap: 12, marginBottom: 36 }}>
            <TouchableOpacity
              onPress={() => router.push("/register")}
              style={{
                backgroundColor: "#2C2C28",
                paddingVertical: 16,
                paddingHorizontal: 24,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: 2,
                borderWidth: 2,
                borderColor: "#2C2C28",
                shadowColor: "#000",
                shadowOffset: { width: 4, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 0,
                elevation: 4,
              }}
            >
              <Text style={{ fontFamily: "Courier", fontSize: 16, color: "#F5F5F0" }}>
                TART'a Katıl
              </Text>
              <ArrowRight size={20} color="#F5F5F0" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/login")}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 24,
                alignItems: "center",
                borderRadius: 2,
                borderWidth: 2,
                borderColor: "#6B6B5F",
              }}
            >
              <Text style={{ fontFamily: "Courier", fontSize: 16, color: "#2C2C28" }}>
                Zaten Hesabım Var
              </Text>
            </TouchableOpacity>
          </View>

          {/* Hero images — layered, paper style */}
          <View style={{ position: "relative", marginBottom: 16 }}>
            {/* Back image — slightly rotated */}
            <View
              style={{
                transform: [{ rotate: "-2deg" }],
                shadowColor: "#6B6B5F",
                shadowOffset: { width: 4, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 0,
                elevation: 3,
                marginBottom: 8,
              }}
            >
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1761834520785-ca17a0275f6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" }}
                style={{
                  width: "100%",
                  height: 200,
                  borderWidth: 1,
                  borderColor: "#D4D2C8",
                  borderRadius: 2,
                }}
                resizeMode="cover"
              />
              {/* Grayscale tint overlay */}
              <View
                style={{
                  ...StyleSheet_absolute,
                  backgroundColor: "rgba(245,245,240,0.35)",
                  borderRadius: 2,
                }}
              />
            </View>

            {/* Front image — local asset, offset + rotated */}
            <View
              style={{
                marginTop: -60,
                marginLeft: 32,
                transform: [{ rotate: "1.5deg" }],
                shadowColor: "#6B6B5F",
                shadowOffset: { width: 6, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 0,
                elevation: 6,
                alignSelf: "flex-start",
                width: "72%",
              }}
            >
              <Image
                source={require('../assets/images/acilisGorseli.jpeg')}
                style={{
                  width: "100%",
                  height: 170,
                  borderWidth: 2,
                  borderColor: "#6B6B5F",
                  borderRadius: 2,
                }}
                resizeMode="cover"
              />
              {/* Grayscale tint overlay */}
              <View
                style={{
                  ...StyleSheet_absolute,
                  backgroundColor: "rgba(245,245,240,0.30)",
                  borderRadius: 2,
                }}
              />

              {/* Handwritten note tag */}
              <View
                style={{
                  position: "absolute",
                  bottom: -12,
                  right: -10,
                  backgroundColor: "#FFFEF5",
                  borderWidth: 1,
                  borderColor: "#6B6B5F",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  transform: [{ rotate: "-3deg" }],
                  shadowColor: "#000",
                  shadowOffset: { width: 2, height: 2 },
                  shadowOpacity: 0.12,
                  shadowRadius: 2,
                }}
              >
                <Text style={{ fontFamily: "System", fontSize: 10, color: "#6B6B5F", fontStyle: "italic" }}>
                  düşünmek, yazmak, eleştirmek
                </Text>
              </View>
            </View>

            {/* Floating stat chip */}
            <View
              style={{
                position: "absolute",
                top: 12,
                right: 0,
                backgroundColor: "#FFFEF5",
                borderWidth: 1.5,
                borderColor: "#6B6B5F",
                paddingHorizontal: 12,
                paddingVertical: 6,
                shadowColor: "#6B6B5F",
                shadowOffset: { width: 3, height: 3 },
                shadowOpacity: 0.3,
                shadowRadius: 0,
              }}
            >
              <Text style={{ fontFamily: "System", fontSize: 11, color: "#6B6B5F", fontStyle: "italic" }}>
                gençler için
              </Text>
            </View>
          </View>
        </View>

        {/* Paper tear transition — jagged bottom edge */}
        <View style={{ backgroundColor: "#E8E6E0", height: 24, marginTop: 8 }}>
          <View style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: 24, backgroundColor: "#F5F5F0",
            borderBottomLeftRadius: 999, borderBottomRightRadius: 999,
          }} />
        </View>
      </View>

      {/* ───── NEDEN TART — Chalkboard section ───── */}
      <View ref={nedenTartRef} style={{ backgroundColor: "#E8E6E0", paddingHorizontal: 24, paddingVertical: 40 }}>
        <Text
          style={{
            fontFamily: "Courier",
            fontSize: 22,
            color: "#2C2C28",
            letterSpacing: 0.5,
            textAlign: "center",
            marginBottom: 6,
          }}
        >
          Neden TART?
        </Text>
        <View style={{ height: 1, width: 64, backgroundColor: "#6B6B5F", opacity: 0.4, alignSelf: "center", marginBottom: 28 }} />

        <View style={{ gap: 16 }}>
          {features.map((f, i) => (
            <View
              key={i}
              style={{
                backgroundColor: "#FFFEF5",
                borderWidth: 1.5,
                borderColor: "#D4D2C8",
                borderLeftWidth: 4,
                borderLeftColor: "#6B6B5F",
                borderRadius: 2,
                padding: 20,
                shadowColor: "#6B6B5F",
                shadowOffset: { width: 3, height: 3 },
                shadowOpacity: 0.12,
                shadowRadius: 0,
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 16,
              }}
            >
              <f.icon size={22} color="#6B6B5F" />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: "Courier", fontSize: 15, color: "#2C2C28", marginBottom: 4 }}>
                  {f.title}
                </Text>
                <Text style={{ fontFamily: "System", fontSize: 13, color: "#6B6B5F", lineHeight: 20 }}>
                  {f.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* ───── NASIL ÇALIŞIR — Lined paper section ───── */}
      <View ref={nasilCalisirRef} style={{ backgroundColor: "#F0EDE5", position: "relative", paddingHorizontal: 24, paddingVertical: 40 }}>
        {/* Faint notebook lines */}
        <NotebookLines count={25} spacing={30} opacity={0.04} />

        <Text style={{ fontFamily: "Courier", fontSize: 22, color: "#2C2C28", textAlign: "center", marginBottom: 6 }}>
          Nasıl Çalışır?
        </Text>
        <View style={{ height: 1, width: 64, backgroundColor: "#6B6B5F", opacity: 0.4, alignSelf: "center", marginBottom: 28 }} />

        <View style={{ gap: 20 }}>
          {[
            { n: 1, icon: Mail, t: "E-postanla kayıt ol", d: "Herhangi bir e-posta adresiyle hızlıca hesap oluştur." },
            { n: 2, icon: BookOpen, t: "Konuları oku, eleştir", d: "İlgi alanlarına göre tartışmaları keşfet, yapıcı eleştirilerini paylaş." },
            { n: 3, icon: TrendingUp, t: "Tartış ve geliş", d: "Saygı çerçevesinde tartış, öğren ve eleştirel düşünme becerinizi geliştir." },
          ].map((s) => (
            <View
              key={s.n}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 16,
                backgroundColor: "#FFFEF5",
                borderWidth: 1,
                borderColor: "#D4D2C8",
                borderRadius: 2,
                padding: 18,
                shadowColor: "#000",
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 0,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderWidth: 1.5,
                  borderColor: "#6B6B5F",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                }}
              >
                <Text style={{ fontFamily: "Courier", fontSize: 14, color: "#2C2C28" }}>{s.n}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: "Courier", fontSize: 14, color: "#2C2C28", marginBottom: 4 }}>{s.t}</Text>
                <Text style={{ fontFamily: "System", fontSize: 12, color: "#6B6B5F", lineHeight: 18 }}>{s.d}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* ───── MANİFESTO — Old paper section ───── */}
      <View ref={manifestoRef} style={{ backgroundColor: "#D4D2C8", paddingHorizontal: 24, paddingVertical: 40 }}>
        {/* Dashed border badge */}
        <View style={{ alignSelf: "center", borderWidth: 1, borderColor: "#6B6B5F", borderStyle: "dashed", paddingHorizontal: 12, paddingVertical: 4, marginBottom: 12 }}>
          <Text style={{ fontFamily: "System", fontSize: 11, color: "#6B6B5F", fontStyle: "italic" }}>Manifestomuz</Text>
        </View>

        <Text style={{ fontFamily: "Courier", fontSize: 20, color: "#2C2C28", textAlign: "center", marginBottom: 28 }}>
          TART'ın Temel İlkeleri
        </Text>

        <View style={{ gap: 16 }}>
          {principles.map((p, i) => (
            <View
              key={i}
              style={{
                backgroundColor: "#FFFEF5",
                borderWidth: 2,
                borderColor: "#6B6B5F",
                borderRadius: 2,
                padding: 20,
                shadowColor: "#6B6B5F",
                shadowOffset: { width: 4, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 0,
                alignItems: "center",
              }}
            >
              <Text style={{ fontFamily: "Courier", fontSize: 15, color: "#2C2C28", textAlign: "center", marginBottom: 8 }}>
                "{p.title}"
              </Text>
              <Text style={{ fontFamily: "System", fontSize: 12, color: "#6B6B5F", textAlign: "center", lineHeight: 18 }}>
                {p.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ───── FINAL CTA ───── */}
      <View style={{ backgroundColor: "#FAFAF5", paddingHorizontal: 24, paddingVertical: 48, alignItems: "center" }}>
        <Text style={{ fontFamily: "Courier", fontSize: 22, color: "#2C2C28", textAlign: "center", marginBottom: 12 }}>
          Sessiz kalma. Tartış.
        </Text>
        <View style={{ height: 1, width: 100, backgroundColor: "#6B6B5F", opacity: 0.4, marginBottom: 16 }} />
        <Text style={{ fontFamily: "System", fontSize: 14, color: "#6B6B5F", textAlign: "center", lineHeight: 22, marginBottom: 28 }}>
          TART topluluğuna katıl, düşüncelerini özgürce ifade et ve eleştirel düşünme kültürüne katkıda bulun.
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/register")}
          style={{
            backgroundColor: "#2C2C28",
            paddingVertical: 16,
            paddingHorizontal: 32,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            borderRadius: 2,
            borderWidth: 2,
            borderColor: "#2C2C28",
            shadowColor: "#6B6B5F",
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 0,
            elevation: 4,
          }}
        >
          <Text style={{ fontFamily: "Courier", fontSize: 16, color: "#F5F5F0" }}>TART'a Katıl</Text>
          <ArrowRight size={18} color="#F5F5F0" />
        </TouchableOpacity>

        <Text style={{ fontFamily: "System", fontSize: 11, color: "#9B9B8F", marginTop: 16, fontStyle: "italic" }}>
          E-posta ile hızlı kayıt • Ücretsiz ve açık erişim
        </Text>
      </View>

      {/* ───── FOOTER ───── */}
      <View
        style={{
          backgroundColor: "#F5F5F0",
          borderTopWidth: 1.5,
          borderTopColor: "#D4D2C8",
          paddingHorizontal: 24,
          paddingTop: 32,
          paddingBottom: 24,
        }}
      >
        {/* Logo + açıklama */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <Image
            source={require('../assets/images/logo.png')}
            style={{ width: 36, height: 36 }}
            resizeMode="contain"
          />
          <Text style={{ fontFamily: "Courier", fontSize: 16, color: "#2C2C28", letterSpacing: 1 }}>TART</Text>
        </View>
        <Text style={{ fontFamily: "System", fontSize: 12, color: "#6B6B5F", lineHeight: 19, marginBottom: 24 }}>
          Genç bireylerin fikirlerini özgürce eleştirdiği, sistemleri sorguladığı ve düşünerek geliştiği güvenli tartışma platformu.
        </Text>

        {/* Platform + Hukuki kolonlar */}
        <View style={{ flexDirection: "row", gap: 40, marginBottom: 24 }}>
          {/* Platform */}
          <View>
            <Text style={{ fontFamily: "Courier", fontSize: 13, color: "#2C2C28", marginBottom: 10 }}>Platform</Text>
            {[
              { label: "Neden TART?", action: () => scrollTo("nedenTart") },
              { label: "Nasıl Çalışır?", action: () => scrollTo("nasilCalisir") },
              { label: "Manifesto", action: () => scrollTo("manifesto") },
            ].map(({ label, action }) => (
              <TouchableOpacity key={label} onPress={action} style={{ marginBottom: 8 }}>
                <Text style={{ fontFamily: "System", fontSize: 12, color: "#6B6B5F" }}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Hukuki */}
          <View>
            <Text style={{ fontFamily: "Courier", fontSize: 13, color: "#2C2C28", marginBottom: 10 }}>Hukuki</Text>
            {[
              { label: "Gizlilik Politikası", type: "privacy" },
              { label: "Kullanım Koşulları", type: "terms" },
              { label: "Topluluk Kuralları", type: "guidelines" },
              { label: "İletişim", type: "contact" },
            ].map(({ label, type }) => (
              <TouchableOpacity
                key={label}
                onPress={() => router.push(`/legal?type=${type}`)}
                style={{ marginBottom: 8 }}
              >
                <Text style={{ fontFamily: "System", fontSize: 12, color: "#6B6B5F" }}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Ayraç */}
        <View style={{ height: 1, backgroundColor: "#D4D2C8", marginBottom: 16 }} />

        {/* Telif + Sosyal */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <View>
            <Text style={{ fontFamily: "System", fontSize: 11, color: "#6B6B5F" }}>© 2026 TART. Tüm hakları saklıdır.</Text>
            <Text style={{ fontFamily: "System", fontSize: 11, color: "#9B9B8F", marginTop: 2 }}>Fatma Nur Karagöz</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <TouchableOpacity onPress={() => openLink("https://www.instagram.com/mind_of_dev1/")}>
              <Text style={{ fontFamily: "System", fontSize: 12, color: "#6B6B5F" }}>Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink("https://www.linkedin.com/in/fatma-nur-karag%C3%B6z-78678a294/")}>
              <Text style={{ fontFamily: "System", fontSize: 12, color: "#6B6B5F" }}>LinkedIn</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// Inline style helper for absolutely positioned overlays
const StyleSheet_absolute = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};
