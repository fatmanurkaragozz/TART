import { NavLink } from "./NavLink";

export function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "#FFFEF5",
        borderBottom: "1.5px solid #D4D2C8",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 transition-opacity hover:opacity-70">
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 8L20 32" stroke="#2C2C28" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 32L28 32" stroke="#2C2C28" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="10" cy="16" r="5" stroke="#6B6B5F" strokeWidth="1.5" fill="none"/>
              <circle cx="30" cy="16" r="5" stroke="#6B6B5F" strokeWidth="1.5" fill="none"/>
              <path d="M10 16L20 12L30 16" stroke="#2C2C28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span
              className="typewriter"
              style={{ fontSize: "1.25rem", color: "#2C2C28", fontWeight: 400 }}
            >
              TART
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 handwritten">
            <a
              href="#nedir"
              className="transition-colors"
              style={{ color: "#6B6B5F", fontSize: "0.95rem" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#2C2C28"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#6B6B5F"}
            >
              Nedir?
            </a>
            <a
              href="#manifesto"
              className="transition-colors"
              style={{ color: "#6B6B5F", fontSize: "0.95rem" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#2C2C28"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#6B6B5F"}
            >
              Manifesto
            </a>
            <NavLink
              to="/register"
              className="transition-colors"
              style={{ color: "#6B6B5F", fontSize: "0.95rem" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#2C2C28"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#6B6B5F"}
            >
              Katıl
            </NavLink>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3 typewriter">
            <NavLink
              to="/login"
              className="px-5 py-2 transition-colors"
              style={{ color: "#6B6B5F", fontSize: "0.9rem" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#2C2C28"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#6B6B5F"}
            >
              Giriş Yap
            </NavLink>
            <NavLink
              to="/register"
              className="px-5 py-2 transition-all"
              style={{
                background: "#2C2C28",
                color: "#F5F5F0",
                border: "2px solid #2C2C28",
                borderRadius: "2px",
                fontSize: "0.9rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "3px 3px 0px rgba(107, 107, 95, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Kayıt Ol
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}