export function Footer() {
  return (
    <footer className="py-12" style={{ borderTop: "1.5px solid #D4D2C8", background: "#F5F5F0" }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 8L20 32" stroke="#2C2C28" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 32L28 32" stroke="#2C2C28" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="10" cy="16" r="5" stroke="#6B6B5F" strokeWidth="1.5" fill="none"/>
                <circle cx="30" cy="16" r="5" stroke="#6B6B5F" strokeWidth="1.5" fill="none"/>
                <path d="M10 16L20 12L30 16" stroke="#2C2C28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
              <a href="#" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#6B6B5F" }}>
                Gizlilik Politikası
              </a>
              <a href="#" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#6B6B5F" }}>
                Kullanım Koşulları
              </a>
              <a href="#" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#6B6B5F" }}>
                Topluluk Kuralları
              </a>
              <a href="#" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#6B6B5F" }}>
                İletişim
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 handwritten" style={{ borderTop: "1px solid #D4D2C8" }}>
          <p className="text-sm" style={{ color: "#6B6B5F" }}>
            © 2026 TART. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#6B6B5F" }}>
              Twitter
            </a>
            <a href="#" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#6B6B5F" }}>
              Instagram
            </a>
            <a href="#" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#6B6B5F" }}>
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}