import { useState, useEffect } from "react";
import { TOOLS, PDF_TOOLS, PDF_BRAND, STUDENT_TOOLS, STUDENT_BRAND, BRAND } from "../shared/constants";

export default function Navbar({ currentPath = "/" }) {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark-mode');
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  };

  const allAvailableTools = [
    ...TOOLS,
    ...STUDENT_TOOLS,
    ...PDF_TOOLS
  ];

  const filteredTools = search.length > 1 
    ? allAvailableTools.filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase()) || 
        t.hindi.includes(search) ||
        (t.keywords && t.keywords.some(k => k.toLowerCase().includes(search.toLowerCase())))
      )
    : [];

  return (
    <nav style={{ background: BRAND.surface, backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100, borderBottom: `1px solid ${BRAND.border}`, width: "100vw" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <a href="/" aria-label="ToolsWaala Homepage" style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textDecoration: "none" }}>
          <div style={{ position: "relative", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="44" height="44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M20 25H80M50 25V85" stroke="#FF6B00" strokeWidth="10" strokeLinecap="round" />
              <path d="M20 25L10 15M20 25L10 35" stroke="#FF6B00" strokeWidth="8" strokeLinecap="round" />
              <path d="M25 55L40 85L50 65L60 85L75 55" stroke="var(--app-text)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="nav-logo-text">
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ color: BRAND.text, fontWeight: 900, fontSize: 24, lineHeight: 1, letterSpacing: "-0.04em" }}>Tools</span>
              <span style={{ color: BRAND.primary, fontWeight: 900, fontSize: 24, lineHeight: 1, letterSpacing: "-0.04em" }}>Waala</span>
            </div>
          </div>
        </a>

        {/* Global Search Bar */}
        <div style={{ flex: 1, maxWidth: 400, margin: "0 20px", position: "relative" }} className="nav-search-container">
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", opacity: 0.5 }} aria-hidden="true">🔍</span>
            <input 
              type="text" 
              aria-label="Search 40+ free tools"
              placeholder="Search 40+ tools (e.g. CGPA, GST, PDF)..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "10px 14px 10px 40px", borderRadius: 12, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.05)", color: BRAND.text, fontSize: 13 }}
            />
          </div>
          {filteredTools.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: BRAND.surfaceCard, border: `1px solid ${BRAND.border}`, borderRadius: 12, marginTop: 8, boxShadow: "0 10px 30px rgba(0,0,0,0.3)", maxHeight: 300, overflowY: "auto", zIndex: 1000 }}>
              {filteredTools.map(t => (
                <a key={t.id} href={t.path} onClick={() => setSearch("")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", textDecoration: "none", borderBottom: `1px solid ${BRAND.border}` }}>
                  <span style={{ fontSize: 20 }}>{t.icon}</span>
                  <div>
                    <div style={{ color: BRAND.text, fontWeight: 600, fontSize: 13 }}>{t.name}</div>
                    <div style={{ color: BRAND.textSecondary, fontSize: 11 }}>{t.hindi}</div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={toggleDarkMode} aria-label="Toggle Dark Mode" style={{ background: "transparent", border: `1px solid ${BRAND.border}`, color: BRAND.text, width: 40, height: 40, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            {darkMode ? "☀️" : "🌙"}
          </button>
          <div className="nav-desktop-links" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href="/" style={{ padding: "8px 18px", fontSize: 13, borderRadius: 10, border: `1px solid ${BRAND.primary}40`, background: currentPath === "/" ? BRAND.primary : "transparent", color: currentPath === "/" ? "white" : BRAND.text, textDecoration: "none", fontWeight: 700 }}>💼 Business</a>
            <a href="/pdf-tools" style={{ padding: "8px 18px", fontSize: 13, borderRadius: 10, border: `1px solid ${PDF_BRAND.accent}40`, background: currentPath.includes("/pdf-tools") ? PDF_BRAND.accent : "transparent", color: currentPath.includes("/pdf-tools") ? "white" : BRAND.text, textDecoration: "none", fontWeight: 700 }}>📄 PDF Tools</a>
            <a href="/students" style={{ padding: "8px 18px", fontSize: 13, borderRadius: 10, border: `1px solid ${STUDENT_BRAND.accent}40`, background: currentPath.startsWith("/students") || ["/cgpa","/attendance","/percentage","/pomodoro"].some(p => currentPath.includes(p)) ? STUDENT_BRAND.accent : "transparent", color: currentPath.includes("/students") ? "white" : BRAND.text, textDecoration: "none", fontWeight: 700 }}>🎓 Students</a>
          </div>
          <button className="nav-mobile-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Navigation Menu" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${BRAND.border}`, color: BRAND.text, width: 40, height: 40, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{menuOpen ? "✕" : "☰"}</button>
        </div>
      </div>
      {menuOpen && (
        <div style={{ background: BRAND.surfaceCard, borderBottom: `1px solid ${BRAND.border}`, padding: "16px 0", maxHeight: "70vh", overflowY: "auto" }} className="fade-in">
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 8 }}>
              <a href="/" onClick={() => setMenuOpen(false)} style={{ padding: "10px 20px", fontSize: 14, borderRadius: 10, border: `1px solid ${BRAND.primary}40`, background: currentPath === "/" ? BRAND.primary : "transparent", color: currentPath === "/" ? "white" : BRAND.text, textDecoration: "none", fontWeight: 700, whiteSpace: "nowrap" }}>💼 Business</a>
              <a href="/pdf-tools" onClick={() => setMenuOpen(false)} style={{ padding: "10px 20px", fontSize: 14, borderRadius: 10, border: `1px solid ${PDF_BRAND.accent}40`, background: currentPath.includes("/pdf-tools") ? PDF_BRAND.accent : "transparent", color: currentPath.includes("/pdf-tools") ? "white" : BRAND.text, textDecoration: "none", fontWeight: 700, whiteSpace: "nowrap" }}>📄 PDF Tools</a>
              <a href="/students" onClick={() => setMenuOpen(false)} style={{ padding: "10px 20px", fontSize: 14, borderRadius: 10, border: `1px solid ${STUDENT_BRAND.accent}40`, background: currentPath.includes("/students") ? STUDENT_BRAND.accent : "transparent", color: currentPath.includes("/students") ? "white" : BRAND.text, textDecoration: "none", fontWeight: 700, whiteSpace: "nowrap" }}>🎓 Students</a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 6 }}>
              {TOOLS.map(t => (
                <a key={t.id} href={t.path} onClick={() => setMenuOpen(false)}
                  style={{ background: currentPath === t.path ? "rgba(255,107,0,0.1)" : "transparent", border: "1px solid", borderColor: currentPath === t.path ? "rgba(255,107,0,0.2)" : "transparent", color: currentPath === t.path ? BRAND.primary : BRAND.text, padding: "12px 14px", borderRadius: 10, cursor: "pointer", textAlign: "left", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                  <span style={{ fontSize: 18 }}>{t.icon}</span> {t.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
