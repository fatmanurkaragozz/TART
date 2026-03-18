import { motion } from "motion/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

// Development navigation panel for easy page switching during design phase
export function DevNav() {
  const [isOpen, setIsOpen] = useState(false);

  const pages = [
    { name: "Landing", path: "/" },
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
    { name: "Home Feed", path: "/home" },
    { name: "Create Topic", path: "/create-topic" },
    { name: "Topic Detail", path: "/topic/1" },
    { name: "Notifications", path: "/notifications" },
    { name: "Profile", path: "/profile" },
    { name: "Manifesto", path: "/manifesto" },
  ];

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] p-3"
        style={{
          background: "#2C2C28",
          color: "#F5F5F0",
          border: "2px solid #2C2C28",
          borderRadius: "50%",
          boxShadow: "4px 4px 12px rgba(0, 0, 0, 0.2)",
          cursor: "pointer",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </motion.button>

      {/* Panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed bottom-24 right-6 z-[100] p-4"
          style={{
            background: "#FFFEF5",
            border: "2px solid #6B6B5F",
            borderRadius: "4px",
            boxShadow: "6px 6px 16px rgba(0, 0, 0, 0.3)",
            minWidth: "200px",
          }}
        >
          <div
            className="mb-3 pb-2 typewriter"
            style={{
              fontSize: "0.85rem",
              color: "#6B6B5F",
              borderBottom: "1px solid #D4D2C8",
            }}
          >
            🔧 Dev Navigation
          </div>

          <div className="space-y-1.5">
            {pages.map((page) => (
              <button
                key={page.path}
                onClick={() => {
                  window.location.href = page.path;
                }}
                className="block w-full text-left px-3 py-2 handwritten transition-all"
                style={{
                  fontSize: "0.85rem",
                  color: "#2C2C28",
                  background:
                    window.location.pathname === page.path
                      ? "#E8E6E0"
                      : "transparent",
                  borderRadius: "2px",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (window.location.pathname !== page.path) {
                    e.currentTarget.style.background =
                      "#F5F5F0";
                  }
                }}
                onMouseLeave={(e) => {
                  if (window.location.pathname !== page.path) {
                    e.currentTarget.style.background =
                      "transparent";
                  }
                }}
              >
                {page.name}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}