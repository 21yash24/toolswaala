import { useState, useEffect } from "react";
import { TOOLS, STUDENT_TOOLS, PDF_TOOLS, BRAND } from "../shared/constants";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const allTools = [...TOOLS, ...STUDENT_TOOLS, ...PDF_TOOLS];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filtered = query.length > 0
    ? allTools.filter(t => 
        t.name.toLowerCase().includes(query.toLowerCase()) || 
        t.hindi.includes(query) ||
        (t.keywords && t.keywords.some(k => k.toLowerCase().includes(query.toLowerCase())))
      )
    : allTools.slice(0, 8);

  if (!open) return null;

  return (
    <div 
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "15vh"
      }}
      onClick={() => setOpen(false)}
    >
      <div 
        style={{
          width: "90%",
          maxWidth: 600,
          background: "#18181B",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 20,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
        className="fade-in"
      >
        <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <span style={{ fontSize: 20, opacity: 0.6, marginRight: 12 }}>🔍</span>
          <input 
            type="text"
            autoFocus
            aria-label="Search tools in command palette"
            placeholder="Search 38+ free tools (Press ESC to close)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "#F8FAFC",
              fontSize: 16,
              outline: "none",
              fontWeight: 500
            }}
          />
          <kbd style={{ background: "rgba(255,255,255,0.1)", color: "#94A3B8", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>ESC</kbd>
        </div>

        <div style={{ maxHeight: 380, overflowY: "auto", padding: "8px 0" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: "#94A3B8", fontSize: 14 }}>No matching tools found for "{query}"</div>
          ) : (
            filtered.map((t) => (
              <a 
                key={t.id}
                href={t.path}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 20px",
                  textDecoration: "none",
                  transition: "background 0.15s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,107,0,0.12)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${t.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                    {t.icon}
                  </div>
                  <div>
                    <div style={{ color: "#F8FAFC", fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: "#94A3B8", fontSize: 12 }}>{t.hindi}</div>
                  </div>
                </div>
                <span style={{ color: "#FF6B00", fontWeight: 700, fontSize: 12 }}>OPEN ➔</span>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
