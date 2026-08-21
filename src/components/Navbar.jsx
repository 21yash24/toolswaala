import { useState, useEffect } from "react";
import { TOOLS, PDF_TOOLS, PDF_BRAND, STUDENT_TOOLS, STUDENT_BRAND, BRAND } from "../shared/constants";

export default function Navbar({ currentPath = "/" }) {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = storedTheme === 'dark' || (!storedTheme && systemDark) || document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.remove('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const allAvailableTools = [
    ...STUDENT_TOOLS,
    ...TOOLS,
    ...PDF_TOOLS
  ];

  const filteredTools = search.length > 0 
    ? allAvailableTools.filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase()) || 
        (t.hindi && t.hindi.includes(search)) ||
        (t.desc && t.desc.toLowerCase().includes(search.toLowerCase())) ||
        (t.keywords && t.keywords.some(k => k.toLowerCase().includes(search.toLowerCase())))
      )
    : allAvailableTools.slice(0, 10);

  return (
    <>
      <header style={{ 
        position: "sticky", 
        top: 0, 
        zIndex: 100, 
        width: "100%",
        background: "var(--app-surface)",
        borderBottom: "1px solid var(--app-border)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)"
      }}>
        {/* Top Main Navigation Bar */}
        <div style={{ 
          maxWidth: 1280, 
          margin: "0 auto", 
          padding: "0 16px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          height: 62,
          gap: 10
        }}>
          
          {/* Logo & Brand Identity */}
          <a href="/" aria-label="ToolsWaala Homepage" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <img 
              src="/logo.png" 
              alt="ToolsWaala Logo" 
              width="36" 
              height="36" 
              style={{ 
                width: 36, 
                height: 36, 
                borderRadius: 10, 
                objectFit: "cover",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                flexShrink: 0
              }} 
            />
            <div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ color: "var(--app-text)", fontWeight: 900, fontSize: 19, lineHeight: 1, letterSpacing: "-0.03em" }}>Tools</span>
                <span style={{ color: "#FF6B00", fontWeight: 900, fontSize: 19, lineHeight: 1, letterSpacing: "-0.03em" }}>Waala</span>
              </div>
              <div style={{ fontSize: 9, fontWeight: 700, color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 2 }}>
                🇮🇳 Bharat Toolkit
              </div>
            </div>
          </a>

          {/* Desktop Search Pill (Hidden on Mobile) */}
          <button 
            onClick={() => setSearchOpen(true)}
            aria-label="Search 44+ Free Tools"
            className="hidden md:flex"
            style={{ 
              flex: 1, 
              maxWidth: 340, 
              alignItems: "center", 
              justifyContent: "space-between",
              padding: "7px 14px", 
              borderRadius: 12, 
              border: "1px solid var(--app-border)", 
              background: "rgba(255, 255, 255, 0.04)", 
              color: "var(--app-text-secondary)", 
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>🔍</span>
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Search 44+ tools...</span>
            </div>
            <kbd style={{ 
              background: "rgba(255,255,255,0.08)", 
              border: "1px solid var(--app-border)", 
              color: "var(--app-text-secondary)", 
              padding: "2px 6px", 
              borderRadius: 6, 
              fontSize: 10, 
              fontWeight: 700 
            }}>⌘K</kbd>
          </button>

          {/* Desktop Category Navigation */}
          <nav className="hidden lg:flex" style={{ alignItems: "center", gap: 6 }}>
            <a href="/" style={{ 
              padding: "6px 12px", 
              fontSize: 13, 
              borderRadius: 10, 
              fontWeight: 700,
              textDecoration: "none",
              background: currentPath === "/" ? "rgba(255, 107, 0, 0.12)" : "transparent",
              color: currentPath === "/" ? "#FF6B00" : "var(--app-text)",
              border: currentPath === "/" ? "1px solid rgba(255, 107, 0, 0.3)" : "1px solid transparent"
            }}>💼 Business</a>

            <a href="/students" style={{ 
              padding: "6px 12px", 
              fontSize: 13, 
              borderRadius: 10, 
              fontWeight: 700,
              textDecoration: "none",
              background: currentPath.includes("/students") || ["/cgpa","/attendance","/percentage","/pomodoro"].some(p => currentPath.includes(p)) ? "rgba(124, 58, 237, 0.12)" : "transparent",
              color: currentPath.includes("/students") ? "#7C3AED" : "var(--app-text)",
              border: currentPath.includes("/students") ? "1px solid rgba(124, 58, 237, 0.3)" : "1px solid transparent"
            }}>🎓 Students</a>

            <a href="/pdf-tools" style={{ 
              padding: "6px 12px", 
              fontSize: 13, 
              borderRadius: 10, 
              fontWeight: 700,
              textDecoration: "none",
              background: currentPath.includes("/pdf-tools") ? "rgba(29, 107, 228, 0.12)" : "transparent",
              color: currentPath.includes("/pdf-tools") ? "#1D6BE4" : "var(--app-text)",
              border: currentPath.includes("/pdf-tools") ? "1px solid rgba(29, 107, 228, 0.3)" : "1px solid transparent"
            }}>📄 PDF Suite</a>

            <a href="/legal-hub" style={{ 
              padding: "6px 12px", 
              fontSize: 13, 
              borderRadius: 10, 
              fontWeight: 700,
              textDecoration: "none",
              background: currentPath.includes("/legal") ? "rgba(245, 158, 11, 0.12)" : "transparent",
              color: currentPath.includes("/legal") ? "#F59E0B" : "var(--app-text)",
              border: currentPath.includes("/legal") ? "1px solid rgba(245, 158, 11, 0.3)" : "1px solid transparent"
            }}>⚖️ Legal Hub</a>

            <a href="/blog" style={{ 
              padding: "6px 12px", 
              fontSize: 13, 
              borderRadius: 10, 
              fontWeight: 700,
              textDecoration: "none",
              color: "var(--app-text)"
            }}>📰 Blog</a>
          </nav>

          {/* Action Icons Row (Desktop & Mobile) */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            
            {/* Mobile Search Icon Button (Visible only on small screens) */}
            <button 
              onClick={() => setSearchOpen(true)}
              aria-label="Search Tools"
              className="flex md:hidden"
              style={{ 
                background: "rgba(255, 255, 255, 0.05)", 
                border: "1px solid var(--app-border)", 
                color: "var(--app-text)", 
                width: 36, 
                height: 36, 
                borderRadius: 10, 
                cursor: "pointer", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: 15 
              }}
            >
              🔍
            </button>

            {/* Dark/Light Mode Toggle (Always Visible & Accessible!) */}
            <button 
              onClick={toggleDarkMode} 
              aria-label="Toggle Dark / Light Mode" 
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              style={{ 
                background: "rgba(255, 255, 255, 0.05)", 
                border: "1px solid var(--app-border)", 
                color: "var(--app-text)", 
                width: 36, 
                height: 36, 
                borderRadius: 10, 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: 16 
              }}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* Mobile Hamburger Drawer Trigger */}
            <button 
              className="flex lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)} 
              aria-label="Toggle Navigation Menu" 
              aria-expanded={menuOpen}
              style={{ 
                background: menuOpen ? "rgba(255, 107, 0, 0.15)" : "rgba(255, 255, 255, 0.05)", 
                border: menuOpen ? "1px solid #FF6B00" : "1px solid var(--app-border)", 
                color: menuOpen ? "#FF6B00" : "var(--app-text)", 
                width: 36, 
                height: 36, 
                borderRadius: 10, 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: 18,
                fontWeight: 800 
              }}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>

        </div>

        {/* Horizontal Sub-Category Pill Bar (Swipeable on Mobile & Desktop) */}
        <div style={{ 
          background: "rgba(0, 0, 0, 0.02)", 
          borderTop: "1px solid var(--app-border)",
          padding: "6px 12px",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          display: "flex",
          alignItems: "center",
          gap: 6,
          scrollbarWidth: "none"
        }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 6, width: "100%" }}>
            <a href="/" style={{ padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", background: currentPath === "/" ? "#FF6B00" : "rgba(255, 255, 255, 0.05)", color: currentPath === "/" ? "#ffffff" : "var(--app-text)", border: "1px solid var(--app-border)" }}>🔥 All 44+</a>
            <a href="/cgpa-calculator" style={{ padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", background: currentPath.includes("cgpa") ? "#7C3AED" : "rgba(255, 255, 255, 0.05)", color: currentPath.includes("cgpa") ? "#ffffff" : "var(--app-text)", border: "1px solid var(--app-border)" }}>🎓 CGPA</a>
            <a href="/attendance-calculator" style={{ padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", background: currentPath.includes("attendance") ? "#EC4899" : "rgba(255, 255, 255, 0.05)", color: currentPath.includes("attendance") ? "#ffffff" : "var(--app-text)", border: "1px solid var(--app-border)" }}>📊 75% Bunk</a>
            <a href="/gst-invoice" style={{ padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", background: currentPath.includes("gst-invoice") ? "#FF6B00" : "rgba(255, 255, 255, 0.05)", color: currentPath.includes("gst-invoice") ? "#ffffff" : "var(--app-text)", border: "1px solid var(--app-border)" }}>🧾 GST Invoice</a>
            <a href="/tax-calculator" style={{ padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", background: currentPath.includes("tax") ? "#10B981" : "rgba(255, 255, 255, 0.05)", color: currentPath.includes("tax") ? "#ffffff" : "var(--app-text)", border: "1px solid var(--app-border)" }}>⚖️ Tax 2026</a>
            <a href="/pdf-tools" style={{ padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", background: currentPath.includes("pdf") ? "#1D6BE4" : "rgba(255, 255, 255, 0.05)", color: currentPath.includes("pdf") ? "#ffffff" : "var(--app-text)", border: "1px solid var(--app-border)" }}>📄 PDF Tools</a>
            <a href="/resume-builder" style={{ padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", background: currentPath.includes("resume") ? "#8B5CF6" : "rgba(255, 255, 255, 0.05)", color: currentPath.includes("resume") ? "#ffffff" : "var(--app-text)", border: "1px solid var(--app-border)" }}>💼 Resume</a>
            <a href="/legal-hub" style={{ padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", background: currentPath.includes("legal") ? "#F59E0B" : "rgba(255, 255, 255, 0.05)", color: currentPath.includes("legal") ? "#ffffff" : "var(--app-text)", border: "1px solid var(--app-border)" }}>📜 Rent &amp; NDA</a>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu Overlay */}
      {menuOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          top: 96,
          zIndex: 99,
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          overflowY: "auto"
        }}>
          <div style={{ 
            background: "var(--app-surface)", 
            borderBottom: "1px solid var(--app-border)", 
            padding: "16px 16px 32px",
            maxWidth: 640,
            margin: "0 auto",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
          }}>
            
            {/* Quick Theme Switch Banner inside Drawer */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 14px",
              background: "var(--app-surface-card)",
              border: "1px solid var(--app-border)",
              borderRadius: 12,
              marginBottom: 16
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: "var(--app-text)" }}>
                <span>{darkMode ? "🌙 Dark Theme" : "☀️ Light Theme"}</span>
              </div>
              <button 
                onClick={toggleDarkMode}
                style={{
                  background: darkMode ? "#3b82f6" : "#f59e0b",
                  color: "#ffffff",
                  border: "none",
                  padding: "4px 12px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Switch to {darkMode ? "Light" : "Dark"}
              </button>
            </div>

            {/* Student Tools Category */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#7C3AED", letterSpacing: "0.05em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span>🎓</span> <span>College &amp; Exam Tools</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
                {STUDENT_TOOLS.map(t => (
                  <a 
                    key={t.id} 
                    href={t.path} 
                    onClick={() => setMenuOpen(false)}
                    style={{ 
                      background: currentPath === t.path ? "rgba(124, 58, 237, 0.15)" : "var(--app-surface-card)", 
                      border: currentPath === t.path ? "1px solid #7C3AED" : "1px solid var(--app-border)", 
                      color: "var(--app-text)", 
                      padding: "8px 10px", 
                      borderRadius: 10, 
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 11,
                      fontWeight: 600
                    }}
                  >
                    <span style={{ fontSize: 15 }}>{t.icon}</span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Business & Finance Tools */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#FF6B00", letterSpacing: "0.05em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span>💼</span> <span>Business, Tax &amp; Finance</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
                {TOOLS.map(t => (
                  <a 
                    key={t.id} 
                    href={t.path} 
                    onClick={() => setMenuOpen(false)}
                    style={{ 
                      background: currentPath === t.path ? "rgba(255, 107, 0, 0.15)" : "var(--app-surface-card)", 
                      border: currentPath === t.path ? "1px solid #FF6B00" : "1px solid var(--app-border)", 
                      color: "var(--app-text)", 
                      padding: "8px 10px", 
                      borderRadius: 10, 
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 11,
                      fontWeight: 600
                    }}
                  >
                    <span style={{ fontSize: 15 }}>{t.icon}</span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* PDF Suite */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#1D6BE4", letterSpacing: "0.05em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span>📄</span> <span>100% Private PDF Suite</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
                {PDF_TOOLS.map(t => (
                  <a 
                    key={t.id} 
                    href={t.path} 
                    onClick={() => setMenuOpen(false)}
                    style={{ 
                      background: currentPath === t.path ? "rgba(29, 107, 228, 0.15)" : "var(--app-surface-card)", 
                      border: currentPath === t.path ? "1px solid #1D6BE4" : "1px solid var(--app-border)", 
                      color: "var(--app-text)", 
                      padding: "8px 10px", 
                      borderRadius: 10, 
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 11,
                      fontWeight: 600
                    }}
                  >
                    <span style={{ fontSize: 15 }}>{t.icon}</span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</span>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Quick Search Modal Overlay */}
      {searchOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "70px 16px 20px"
        }} onClick={() => setSearchOpen(false)}>
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--app-surface)",
              border: "1px solid var(--app-border)",
              borderRadius: 16,
              width: "100%",
              maxWidth: 540,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              overflow: "hidden"
            }}
          >
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--app-border)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>🔍</span>
              <input 
                type="text"
                autoFocus
                placeholder="Search any tool (e.g. CGPA, GST, Tax, Rent, PDF)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 15,
                  color: "var(--app-text)",
                  fontFamily: "inherit"
                }}
              />
              <button onClick={() => setSearchOpen(false)} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "var(--app-text-secondary)", padding: "4px 8px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>✕</button>
            </div>

            <div style={{ maxHeight: 360, overflowY: "auto", padding: "8px" }}>
              {filteredTools.map(t => (
                <a 
                  key={t.id} 
                  href={t.path} 
                  onClick={() => { setSearchOpen(false); setSearch(""); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 10,
                    textDecoration: "none",
                    transition: "background 0.15s ease",
                    borderBottom: "1px solid rgba(255,255,255,0.03)"
                  }}
                  className="hover:bg-slate-500/10"
                >
                  <span style={{ fontSize: 20 }}>{t.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "var(--app-text)", fontWeight: 700, fontSize: 13 }}>{t.name}</div>
                    <div style={{ color: "var(--app-text-secondary)", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.desc}</div>
                  </div>
                  <span style={{ fontSize: 12, color: "#FF6B00", fontWeight: 700 }}>Open →</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
