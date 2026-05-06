import logo from "../../assets/logo.png";

export function Footer() {
  return (
    <footer className="py-12" style={{ borderTop: "1.5px solid #D4D2C8", background: "#F5F5F0" }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="TART Logo" className="w-10 h-10 object-contain" />
              <span className="typewriter" style={{ color: "#2C2C28", fontSize: "1.1rem", fontWeight: 400 }}>
                TART
              </span>
            </div>
            <p className="text-sm max-w-xs handwritten" style={{ color: "#6B6B5F", lineHeight: 1.7 }}>
              Genç bireylerin fikirlerini özgürce eleştirdiği, sistemleri sorguladığı ve düşünerek geliştiği güvenli tartışma platformu.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="typewriter mb-3" style={{ color: "#2C2C28", fontSize: "0.95rem", fontWeight: 400 }}>
              Platform
            </h4>
            <div className="flex flex-col gap-2 handwritten">
              <a href="#nedir" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#6B6B5F" }}>
                Nedir?
              </a>
              <a href="#nasil-calisir" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#6B6B5F" }}>
                Nasıl Çalışır?
              </a>
              <a href="#neden-tart" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#6B6B5F" }}>
                Neden TART?
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="typewriter mb-3" style={{ color: "#2C2C28", fontSize: "0.95rem", fontWeight: 400 }}>
              Hukuki
            </h4>
            <div className="flex flex-col gap-2 handwritten">
              <a href="/privacy" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#6B6B5F" }}>
                Gizlilik Politikası
              </a>
              <a href="/terms" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#6B6B5F" }}>
                Kullanım Koşulları
              </a>
              <a href="/guidelines" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#6B6B5F" }}>
                Topluluk Kuralları
              </a>
              <a href="/contact" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#6B6B5F" }}>
                İletişim
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 handwritten" style={{ borderTop: "1px solid #D4D2C8" }}>
          <p className="text-sm text-center md:text-left flex flex-col md:flex-row md:gap-2" style={{ color: "#6B6B5F" }}>
            <span>© 2026 TART. Tüm hakları saklıdır.</span>
            <span className="hidden md:inline">|</span>
            <span>Fatma Nur Karagöz</span>
          </p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/mind_of_dev1/" target="_blank" rel="noopener noreferrer" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#6B6B5F" }}>
              Instagram
            </a>
            <a href="https://www.linkedin.com/in/fatma-nur-karag%C3%B6z-78678a294/" target="_blank" rel="noopener noreferrer" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#6B6B5F" }}>
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}