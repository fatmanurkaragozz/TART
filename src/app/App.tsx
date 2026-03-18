import { motion, useScroll, useTransform } from "motion/react";
import {
  BookOpen,
  Users,
  MessageSquare,
  Award,
  TrendingUp,
  Scale,
  Lightbulb,
  Shield,
  Globe,
  Target,
  Mail,
  ChevronRight
} from "lucide-react";
import { NavLink } from "./components/NavLink";
import { Navbar } from "./components/Navbar";
import { FeatureCard } from "./components/FeatureCard";
import { StatChip } from "./components/StatChip";
import { StepCard } from "./components/StepCard";
import { Footer } from "./components/Footer";
import { DevNav } from "./components/DevNav";
import { useRef } from "react";

export default function App() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 0.5], ["0%", "30%"]);
  const y2 = useTransform(scrollYProgress, [0, 0.5], ["0%", "15%"]);
  const y3 = useTransform(scrollYProgress, [0, 0.5], ["0%", "5%"]);

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF5", position: "relative" }}>
      <Navbar />
      <DevNav />

      {/* Hero Section - Layered Notebook/Paper Composition */}
      <section 
        ref={heroRef}
        className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden"
        style={{
          background: "#F5F5F0",
          position: "relative",
        }}
      >
        {/* Paper Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          }}
        />

        {/* Back Layer - Crumpled Paper */}
        <motion.div
          style={{ y: y1 }}
          className="absolute inset-0 opacity-20"
        >
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1723220217596-45d4b51e2804?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kd3JpdHRlbiUyMG5vdGVzJTIwcGFwZXJ8ZW58MXx8fHwxNzY3NzE5OTMyfDA&ixlib=rb-4.1.0&q=80&w=1080")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "grayscale(100%) contrast(0.8)",
            }}
          />
        </motion.div>

        {/* Middle Layer - Notebook Lines */}
        <motion.div
          style={{ y: y2 }}
          className="absolute left-0 right-0 top-20 bottom-0 opacity-10"
        >
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 30 }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={i * 40 + 20}
                x2="100%"
                y2={i * 40 + 20}
                stroke="#6B6B5F"
                strokeWidth="0.5"
                opacity="0.3"
              />
            ))}
            {/* Red margin line */}
            <line
              x1="80"
              y1="0"
              x2="80"
              y2="100%"
              stroke="#C44536"
              strokeWidth="1"
              opacity="0.2"
            />
          </svg>
        </motion.div>

        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Small badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 mb-6"
                style={{ 
                  background: "transparent",
                  border: "1px solid #6B6B5F",
                  borderRadius: "2px",
                }}
              >
                <Scale className="w-4 h-4" style={{ color: "#6B6B5F" }} />
                <span className="text-xs" style={{ color: "#6B6B5F" }}>
                  Eleştiri kültürünü birlikte inşa ediyoruz
                </span>
              </motion.div>

              {/* Main Headline - Typewriter style */}
              <h1 
                className="mb-8 leading-tight typewriter"
                style={{ 
                  fontSize: "clamp(2.25rem, 5vw, 3.25rem)",
                  fontWeight: 400,
                  color: "#2C2C28",
                  lineHeight: 1.2,
                  letterSpacing: "0.02em",
                }}
              >
                Eleştirmeyi öğrenmeden gelişemeyiz.
              </h1>
              
              {/* Underline accent - hand-drawn style */}
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-0.5 w-48 mb-6"
                style={{ 
                  background: "#6B6B5F",
                  transformOrigin: "left",
                  opacity: 0.4
                }}
              />
              
              <p 
                className="text-lg mb-8 max-w-xl handwritten"
                style={{ color: "#6B6B5F", lineHeight: 1.8 }}
              >
                TART, fikirlerin dengeli biçimde tartışıldığı, eleştirinin gelişime dönüştüğü bir alan.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <NavLink to="/register">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98, y: 0 }}
                    className="px-8 py-4 flex items-center justify-center gap-2 shadow-sm typewriter"
                    style={{
                      background: "#2C2C28",
                      color: "#F5F5F0",
                      border: "2px solid #2C2C28",
                      borderRadius: "2px",
                      fontSize: "0.95rem",
                      fontWeight: 400,
                      transition: "all 0.2s ease",
                    }}
                  >
                    TART'a Katıl
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                </NavLink>
                
                <motion.a
                  href="#nasil-calisir"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  className="px-8 py-4 typewriter"
                  style={{
                    background: "transparent",
                    color: "#2C2C28",
                    border: "2px solid #6B6B5F",
                    borderRadius: "2px",
                    fontSize: "0.95rem",
                    fontWeight: 400,
                    transition: "all 0.2s ease",
                  }}
                >
                  Nasıl Çalışır?
                </motion.a>
              </div>

              {/* Trust indicators - checkmarks */}
              <div className="flex flex-col gap-2">
                {[
                  "Saygılı tartışma",
                  "Açık fikirli topluluk",
                  "Eleştiri kültürü"
                ].map((label, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-2 text-sm handwritten" 
                    style={{ color: "#6B6B5F" }}
                  >
                    <span style={{ color: "#8B9B7A" }}>✓</span>
                    {label}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Side - Layered University Imagery */}
            <motion.div
              style={{ y: y3 }}
              className="relative"
            >
              {/* Back image - library/study */}
              <motion.div
                initial={{ opacity: 0, rotate: -2 }}
                animate={{ opacity: 1, rotate: -2 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative mb-6"
                style={{
                  boxShadow: "4px 4px 0px rgba(107, 107, 95, 0.2)",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1761834520785-ca17a0275f6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwc3R1ZHklMjBzaGFkb3dzfGVufDF8fHx8MTc2NzcxOTkyOXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Study environment"
                  className="w-full h-auto"
                  style={{
                    filter: "grayscale(60%) contrast(1.1)",
                    border: "1px solid #D4D2C8",
                  }}
                />
              </motion.div>

              {/* Front image - desk/notebook - slightly offset */}
              <motion.div
                initial={{ opacity: 0, rotate: 1, y: 20 }}
                animate={{ opacity: 1, rotate: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="relative -mt-32 ml-12"
                style={{
                  boxShadow: "6px 6px 0px rgba(107, 107, 95, 0.3)",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1579389082289-3d6922d506c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwZGVzayUyMG5vdGVib29rfGVufDF8fHx8MTc2NzcxOTkyOXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="University desk"
                  className="w-4/5 h-auto"
                  style={{
                    filter: "grayscale(50%) contrast(1.1)",
                    border: "2px solid #6B6B5F",
                  }}
                />
                
                {/* Handwritten note overlay */}
                <div 
                  className="absolute -bottom-3 -right-3 px-4 py-2 handwritten"
                  style={{
                    background: "#FFFEF5",
                    border: "1px solid #6B6B5F",
                    transform: "rotate(-3deg)",
                    fontSize: "0.75rem",
                    color: "#6B6B5F",
                    boxShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  düşünmek, yazmak, eletirmek
                </div>
              </motion.div>

              {/* Floating stat - pencil sketch style */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 -left-6 px-4 py-3"
                style={{
                  background: "#FFFEF5",
                  border: "1.5px solid #6B6B5F",
                  boxShadow: "3px 3px 0px rgba(107, 107, 95, 0.3)",
                }}
              >
                <div className="text-sm handwritten" style={{ color: "#6B6B5F" }}>
                  5K+ öğrenci
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Paper tear transition */}
        <div className="absolute bottom-0 left-0 right-0 h-16">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path 
              d="M0,30 L20,28 L40,32 L60,27 L80,33 L100,29 L120,31 L140,28 L160,34 L180,30 L200,29 L220,32 L240,28 L260,31 L280,33 L300,29 L320,30 L340,32 L360,28 L380,31 L400,29 L420,33 L440,30 L460,28 L480,32 L500,29 L520,31 L540,33 L560,28 L580,30 L600,32 L620,29 L640,31 L660,28 L680,33 L700,30 L720,29 L740,32 L760,28 L780,31 L800,33 L820,29 L840,30 L860,32 L880,28 L900,31 L920,29 L940,33 L960,30 L980,28 L1000,32 L1020,29 L1040,31 L1060,33 L1080,28 L1100,30 L1120,32 L1140,29 L1160,31 L1180,28 L1200,33 L1220,30 L1240,29 L1260,32 L1280,28 L1300,31 L1320,33 L1340,29 L1360,30 L1380,32 L1400,28 L1420,31 L1440,30 L1440,60 L0,60 Z" 
              fill="#FAFAF5"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section - Simple lined paper */}
      <section className="py-16" style={{ background: "#FAFAF5" }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatChip value="5K+" label="Aktif Kullanıcı" delay={0} />
            <StatChip value="200+" label="Günlük Tartışma" delay={0.1} />
            <StatChip value="50+" label="Farklı Konu" delay={0.2} />
            <StatChip value="95%" label="Memnuniyet" delay={0.3} />
          </div>
        </div>
      </section>

      {/* Why TART Section - Chalkboard texture */}
      <section 
        id="neden-tart"
        className="py-20 lg:py-32 relative"
        style={{
          background: "#E8E6E0",
        }}
      >
        {/* Chalk dust texture */}
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1564144006388-615f4f4abb6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBjaGFsa2JvYXJkJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc2NzcxOTkzMnww&ixlib=rb-4.1.0&q=80&w=1080")`,
            backgroundSize: "cover",
            filter: "grayscale(100%)",
          }}
        />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 
              id="nedir"
              className="mb-4 typewriter text-center"
              style={{ 
                fontSize: "clamp(2rem, 4vw, 2.5rem)",
                fontWeight: 400,
                color: "#2C2C28",
                letterSpacing: "0.03em",
              }}
            >
              Neden TART?
            </h2>
            <div className="flex justify-center">
              <div className="h-px w-32" style={{ background: "#6B6B5F", opacity: 0.4 }} />
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Lightbulb}
              title="Eleştiri Kültürü"
              description="Eleştiri, bastırılacak bir şey değil, gelişim için bir araçtır. TART bu kültürü yaygınlaştırır."
              delay={0}
            />
            <FeatureCard
              icon={Shield}
              title="Güvenli Alan"
              description="Moderasyon ve topluluk kuralları ile saygılı ve yapıcı tartışmalar için güvenli bir ortam."
              delay={0.1}
            />
            <FeatureCard
              icon={Globe}
              title="Açık Katılım"
              description="Kendi e-postanla hemen kayıt ol. Kurumsal engel yok, herkes katılabilir."
              delay={0.2}
            />
            <FeatureCard
              icon={Target}
              title="Düşünerek Geliş"
              description="Sorgula, tartış, öğren ve geliş. TART eleştirel düşünme becerinizi geliştirir."
              delay={0.3}
            />
          </div>
        </div>

        {/* Page turn transition */}
        <div className="absolute bottom-0 left-0 right-0 h-20">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path 
              d="M0,0 C240,60 480,20 720,40 C960,60 1200,20 1440,40 L1440,80 L0,80 Z" 
              fill="#F0EDE5"
            />
          </svg>
        </div>
      </section>

      {/* How It Works Section - Lined paper */}
      <section 
        id="nasil-calisir"
        className="py-20 lg:py-32 relative"
        style={{
          background: "#F0EDE5",
        }}
      >
        {/* Notebook lines background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 40 }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={i * 30 + 15}
                x2="100%"
                y2={i * 30 + 15}
                stroke="#6B6B5F"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 
              className="mb-4 typewriter text-center"
              style={{ 
                fontSize: "clamp(2rem, 4vw, 2.5rem)",
                fontWeight: 400,
                color: "#2C2C28",
                letterSpacing: "0.03em",
              }}
            >
              Nasıl Çalışır?
            </h2>
            <div className="flex justify-center">
              <div className="h-px w-32" style={{ background: "#6B6B5F", opacity: 0.4 }} />
            </div>
          </motion.div>

          <div className="max-w-2xl mx-auto space-y-12">
            <StepCard
              number={1}
              icon={Mail}
              title="Kendi e-postanla kolayca kayıt ol"
              description="Herhangi bir e-posta adresiyle hızlıca hesap oluştur. Kurumsal e-posta gerekmez."
              delay={0}
            />
            <StepCard
              number={2}
              icon={BookOpen}
              title="Konuları oku, fikirleri eleştir"
              description="İlgi alanlarına göre tartışmaları keşfet, fikirleri oku ve yapıcı eleştirilerini paylaş."
              delay={0.1}
            />
            <StepCard
              number={3}
              icon={TrendingUp}
              title="Saygı çerçevesinde tartış ve geliş"
              description="Topluluk kurallarına uygun şekilde tartış, öğren ve eleştirel düşünme becerinizi geliştir."
              delay={0.2}
            />
          </div>
        </div>

        {/* Organic wave transition */}
        <div className="absolute bottom-0 left-0 right-0 h-20">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path 
              d="M0,40 Q360,10 720,40 T1440,40 L1440,80 L0,80 Z" 
              fill="#D4D2C8"
            />
          </svg>
        </div>
      </section>

      {/* Manifesto Section - Old paper */}
      <section 
        id="manifesto"
        className="py-20 lg:py-32 relative overflow-hidden"
        style={{ 
          background: "#D4D2C8",
        }}
      >
        {/* Aged paper texture */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1723220217596-45d4b51e2804?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kd3JpdHRlbiUyMG5vdGVzJTIwcGFwZXJ8ZW58MXx8fHwxNzY3NzE5OTMyfDA&ixlib=rb-4.1.0&q=80&w=1080")`,
            backgroundSize: "cover",
            filter: "sepia(20%)",
          }}
        />
        
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4">
              <div 
                className="px-4 py-1 handwritten"
                style={{ 
                  background: "transparent",
                  border: "1px dashed #6B6B5F",
                  color: "#6B6B5F",
                  fontSize: "0.8rem",
                }}
              >
                Manifestomuz
              </div>
            </div>
            <h2 
              className="mb-6 typewriter"
              style={{ 
                fontSize: "clamp(2rem, 4vw, 2.5rem)",
                fontWeight: 400,
                color: "#2C2C28",
                letterSpacing: "0.03em",
              }}
            >
              TART'ın Temel İlkeleri
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              {
                title: "Eleştiri susturulmaz.",
                description: "Fikirler, sistemler ve yapılar sorgulanabilir. Eleştiri özgürlüğü temel haktır.",
                delay: 0,
              },
              {
                title: "Eleştiri gelişim içindir.",
                description: "Yapıcı eleştiri sayesinde kendimizi, fikirlerimizi ve sistemlerimizi geliştirebiliriz.",
                delay: 0.1,
              },
              {
                title: "Eleştiri saygıyla yapılır.",
                description: "Saygılı ve düşünceli eleştiri, sağlıklı tartışma kültürünün temelidir.",
                delay: 0.2,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: item.delay }}
                className="text-center p-8"
                style={{ 
                  background: "#FFFEF5",
                  border: "2px solid #6B6B5F",
                  borderRadius: "2px",
                  boxShadow: "4px 4px 0px rgba(107, 107, 95, 0.2)",
                }}
              >
                <h3 
                  className="mb-4 typewriter"
                  style={{ 
                    fontSize: "1.35rem",
                    fontWeight: 400,
                    color: "#2C2C28",
                    lineHeight: 1.4,
                  }}
                >
                  "{item.title}"
                </h3>
                <p className="text-sm handwritten" style={{ color: "#6B6B5F", lineHeight: 1.7 }}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Paper edge transition */}
        <div className="absolute bottom-0 left-0 right-0 h-16">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path 
              d="M0,30 L15,28 L30,32 L45,27 L60,33 L75,29 L90,31 L105,28 L120,34 L135,30 L150,29 L165,32 L180,28 L195,31 L210,33 L225,29 L240,30 L255,32 L270,28 L285,31 L300,29 L315,33 L330,30 L345,28 L360,32 L375,29 L390,31 L405,33 L420,28 L435,30 L450,32 L465,29 L480,31 L495,28 L510,33 L525,30 L540,29 L555,32 L570,28 L585,31 L600,33 L615,29 L630,30 L645,32 L660,28 L675,31 L690,29 L705,33 L720,30 L735,28 L750,32 L765,29 L780,31 L795,33 L810,28 L825,30 L840,32 L855,29 L870,31 L885,28 L900,33 L915,30 L930,29 L945,32 L960,28 L975,31 L990,33 L1005,29 L1020,30 L1035,32 L1050,28 L1065,31 L1080,29 L1095,33 L1110,30 L1125,28 L1140,32 L1155,29 L1170,31 L1185,33 L1200,28 L1215,30 L1230,32 L1245,29 L1260,31 L1275,28 L1290,33 L1305,30 L1320,29 L1335,32 L1350,28 L1365,31 L1380,33 L1395,29 L1410,30 L1425,32 L1440,30 L1440,60 L0,60 Z" 
              fill="#FAFAF5"
            />
          </svg>
        </div>
      </section>

      {/* Final CTA Section - Clean paper */}
      <section className="py-20 lg:py-32 relative" style={{ background: "#FAFAF5" }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 
              className="mb-6 typewriter"
              style={{ 
                fontSize: "clamp(2rem, 4vw, 2.5rem)",
                fontWeight: 400,
                color: "#2C2C28",
                letterSpacing: "0.03em",
              }}
            >
              Sessiz kalma. Tartış.
            </h2>
            
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-0.5 w-64 mx-auto mb-8"
              style={{ 
                background: "#6B6B5F",
                transformOrigin: "center",
                opacity: 0.4
              }}
            />

            <p className="text-lg mb-10 handwritten" style={{ color: "#6B6B5F", lineHeight: 1.8 }}>
              TART topluluğuna katıl, düşüncelerini özgürce ifade et ve eleştirel düşünme kültürüne katkıda bulun.\n            </p>
            
            <NavLink to="/register">
              <motion.div
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97, y: 0 }}
                className="inline-flex items-center gap-3 px-10 py-5 typewriter"
                style={{
                  background: "#2C2C28",
                  color: "#F5F5F0",
                  border: "2px solid #2C2C28",
                  borderRadius: "2px",
                  fontSize: "1rem",
                  boxShadow: "4px 4px 0px rgba(107, 107, 95, 0.3)",
                  transition: "all 0.2s ease",
                }}
              >
                Ücretsiz Kayıt Ol
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </NavLink>
            
            <p className="text-sm mt-6 handwritten" style={{ color: "#6B6B5F" }}>
              E-posta ile hızlı kayıt • Ücretsiz ve açık erişim
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}