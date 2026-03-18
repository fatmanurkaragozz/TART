import { motion } from "motion/react";
import { ArrowLeft, Scale } from "lucide-react";
import { DevNav } from "../components/DevNav";

export default function Manifesto() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#F0EDE5", position: "relative" }}
    >
      {/* Aged paper texture */}
      <div
        className="fixed inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1723220217596-45d4b51e2804?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kd3JpdHRlbiUyMG5vdGVzJTIwcGFwZXJ8ZW58MXx8fHwxNzY3NzE5OTMyfDA&ixlib=rb-4.1.0&q=80&w=1080")`,
          backgroundSize: "cover",
          filter: "sepia(20%)",
        }}
      />

      <div className="max-w-[800px] mx-auto px-6 py-12 relative z-10">
        {/* Back Button */}
        <motion.a
          href="/home"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 mb-8 text-sm handwritten transition-colors"
          style={{ color: "#6B6B5F" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#2C2C28")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#6B6B5F")}
        >
          <ArrowLeft className="w-4 h-4" />
          Ana sayfaya dön
        </motion.a>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-10"
          style={{
            background: "#FFFEF5",
            border: "3px solid #6B6B5F",
            borderRadius: "2px",
            boxShadow: "6px 6px 0px rgba(107, 107, 95, 0.3)",
          }}
        >
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-10">
            <Scale className="w-12 h-12 mb-4" style={{ color: "#2C2C28" }} />
            <h1
              className="mb-3 typewriter text-center"
              style={{
                fontSize: "2rem",
                color: "#2C2C28",
                fontWeight: 400,
                letterSpacing: "0.02em",
              }}
            >
              TART Manifestosu
            </h1>
            <div
              className="h-px w-32"
              style={{ background: "#6B6B5F", opacity: 0.4 }}
            />
          </div>

          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <p
              className="handwritten text-center mb-6"
              style={{
                color: "#6B6B5F",
                fontSize: "1.05rem",
                lineHeight: 1.8,
                fontStyle: "italic",
              }}
            >
              Eleştiri, bastırılacak bir şey değil, gelişim için bir araçtır.
              TART, bu kültürü yaygınlaştırmak için kuruldu.
            </p>
          </motion.div>

          {/* Principles */}
          <div className="space-y-8 mb-10">
            {[
              {
                number: "I",
                title: "Eleştiri susturulmaz",
                content:
                  "Fikirler, sistemler ve yapılar sorgulanabilir. Eleştiri özgürlüğü temel haktır. Hiçbir fikir, eleştiriden muaf değildir. TART, tüm düşüncelerin tartışılabileceği, sorgulanabileceği açık bir alan sağlar.",
                color: "#4A90E2",
              },
              {
                number: "II",
                title: "Eleştiri gelişim içindir",
                content:
                  "Yapıcı eleştiri sayesinde kendimizi, fikirlerimizi ve sistemlerimizi geliştirebiliriz. Eleştiri, yıkmak için değil, daha iyisini inşa etmek için vardır. Her eleştiri, bir öğrenme fırsatıdır.",
                color: "#E85D4E",
              },
              {
                number: "III",
                title: "Eleştiri saygıyla yapılır",
                content:
                  "Saygılı ve düşünceli eleştiri, sağlıklı tartışma kültürünün temelidir. Kişilere değil, fikirlere odaklanırız. TART topluluğu, farklı görüşlere açık, hoşgörülü ve yapıcı bir ortam sunar.",
                color: "#8B9B7A",
              },
            ].map((principle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.15 }}
                className="relative"
              >
                {/* Number Badge */}
                <div className="flex items-start gap-6">
                  <div
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center typewriter"
                    style={{
                      background: "transparent",
                      border: `2px solid ${principle.color}`,
                      borderRadius: "2px",
                      color: principle.color,
                      fontSize: "1.25rem",
                      fontWeight: 400,
                    }}
                  >
                    {principle.number}
                  </div>

                  <div className="flex-1">
                    <h2
                      className="mb-3 typewriter"
                      style={{
                        fontSize: "1.35rem",
                        color: "#2C2C28",
                        fontWeight: 400,
                      }}
                    >
                      {principle.title}
                    </h2>
                    <p
                      className="handwritten"
                      style={{
                        color: "#6B6B5F",
                        fontSize: "1rem",
                        lineHeight: 1.8,
                      }}
                    >
                      {principle.content}
                    </p>

                    {/* Color accent underline */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.6 + index * 0.15,
                      }}
                      className="h-0.5 mt-4"
                      style={{
                        background: principle.color,
                        transformOrigin: "left",
                        opacity: 0.3,
                        width: "60%",
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Closing */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="pt-8"
            style={{ borderTop: "1px dashed #D4D2C8" }}
          >
            <p
              className="text-center handwritten"
              style={{
                color: "#6B6B5F",
                fontSize: "0.95rem",
                lineHeight: 1.8,
              }}
            >
              TART, Türkiye'deki üniversite öğrencileri için sağlıklı bir
              eleştiri kültürü oluşturmayı hedefler. Düşün, tartış, geliş.
            </p>
          </motion.div>

          {/* Signature */}
          <motion.div
            initial={{ opacity: 0, rotate: -2 }}
            animate={{ opacity: 1, rotate: -2 }}
            transition={{ delay: 1.4 }}
            className="mt-8 text-right"
          >
            <p
              className="handwritten"
              style={{
                color: "#9B9B8F",
                fontSize: "0.85rem",
                fontStyle: "italic",
              }}
            >
              — TART Topluluğu
            </p>
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="mt-8 text-center"
        >
          <a
            href="/home"
            className="inline-block px-8 py-3 typewriter transition-all"
            style={{
              background: "#2C2C28",
              color: "#F5F5F0",
              border: "2px solid #2C2C28",
              borderRadius: "2px",
              fontSize: "0.95rem",
              boxShadow: "3px 3px 0px rgba(107, 107, 95, 0.3)",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "4px 4px 0px rgba(107, 107, 95, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "3px 3px 0px rgba(107, 107, 95, 0.3)";
            }}
          >
            Tartışmalara Katıl
          </a>
        </motion.div>
      </div>

      {/* Dev Navigation */}
      <DevNav />
    </div>
  );
}