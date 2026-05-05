import { useState } from "react";
import { Link } from "react-router-dom";
import { BRAND, STUDENT_BRAND, STUDENT_TOOLS, TOOLS, PDF_TOOLS } from "../../shared/constants";

export default function StudentHome() {
  const [search, setSearch] = useState("");
  const filtered = STUDENT_TOOLS.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.desc.toLowerCase().includes(search.toLowerCase()) ||
    (t.hindi && t.hindi.includes(search)) ||
    (t.keywords && t.keywords.some(k => k.toLowerCase().includes(search.toLowerCase())))
  );

  const crossTools = [
    { ...TOOLS.find(t => t.id === "emi"), label: "For Education Loans" },
    { ...TOOLS.find(t => t.id === "tax"), label: "For your first job" },
    { ...PDF_TOOLS.find(t => t.id === "pdf-compress"), label: "For exam uploads" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }} className="fade-in">
      {/* Breadcrumb / Module Switcher */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, overflowX: "auto", whiteSpace: "nowrap", paddingBottom: 8 }}>
        <Link to="/" style={{ color: BRAND.textSecondary, textDecoration: "none", fontSize: 14 }}>All Tools</Link>
        <span style={{ color: BRAND.border }}>/</span>
        <span style={{ color: STUDENT_BRAND.accent, fontWeight: 700, fontSize: 14 }}>Student Zone</span>
      </div>

      <div style={{ textAlign: "center", marginBottom: 80 }}>
        <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, background: `${STUDENT_BRAND.accent}15`, border: `1px solid ${STUDENT_BRAND.accent}30`, fontSize: 13, fontWeight: 600, color: STUDENT_BRAND.accent, marginBottom: 16 }}>
          🎓 Student Zone
        </div>
        <h1 style={{ fontSize: "clamp(32px, 8vw, 56px)", color: BRAND.text, marginBottom: 24, lineHeight: 1.1, fontWeight: 900 }}>
          Built for India's <span style={{ color: STUDENT_BRAND.accent }}>40 Crore</span> Students
        </h1>
        <p style={{ fontSize: "clamp(14px, 2vw, 18px)", color: BRAND.textSecondary, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
          भारत के 40 करोड़ छात्रों के लिए — Free CGPA calculators, attendance trackers, resume builders and more. Zero login, instant results.
        </p>

        <div style={{ maxWidth: 500, margin: "40px auto 0", display: "flex", gap: 12, background: "rgba(255,255,255,0.05)", padding: 8, borderRadius: 20, border: `1px solid ${BRAND.border}` }}>
          <div style={{ paddingLeft: 16, display: "flex", alignItems: "center", color: BRAND.textSecondary }}>🔍</div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tools — CGPA, Attendance, Resume..." style={{ flex: 1, background: "transparent", border: "none", color: BRAND.text, padding: "12px 0", fontSize: 15, outline: "none" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
        {filtered.map(tool => (
          <Link key={tool.id} to={tool.path} style={{ textDecoration: "none", display: "block" }}>
            <div style={{ background: BRAND.surfaceCard, borderRadius: 20, border: `1px solid ${BRAND.border}`, padding: 28, height: "100%", display: "flex", flexDirection: "column", gap: 20, transition: "border-color 0.2s, transform 0.2s", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = tool.color + "60"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BRAND.border; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ width: 56, height: 56, background: `${tool.color}15`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, border: `1px solid ${tool.color}30` }}>
                  {tool.icon}
                </div>
                <span style={{ fontSize: 20, color: BRAND.textSecondary }}>→</span>
              </div>
              <div>
                <h3 style={{ color: BRAND.text, fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{tool.name}</h3>
                <span style={{ fontSize: 13, color: tool.color, fontWeight: 500 }}>{tool.hindi}</span>
              </div>
              <p style={{ fontSize: 14, color: BRAND.textSecondary, lineHeight: 1.5, margin: 0 }}>{tool.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Cross-Module Recommendations */}
      <div style={{ marginTop: 100, padding: "48px 32px", borderRadius: 24, background: "rgba(255,255,255,0.02)", border: `1px solid ${BRAND.border}` }}>
        <h2 style={{ fontSize: 24, color: BRAND.text, marginBottom: 8, fontWeight: 800 }}>Students also use these Business tools →</h2>
        <p style={{ color: BRAND.textSecondary, marginBottom: 32, fontSize: 15 }}>Complement your studies with professional financial and document tools.</p>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {crossTools.map(tool => (
            <Link key={tool.id} to={tool.path} style={{ textDecoration: "none" }}>
              <div className="glass-card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 16, border: `1px solid ${BRAND.border}` }}>
                <div style={{ fontSize: 24 }}>{tool.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, color: BRAND.text, fontSize: 14 }}>{tool.name}</div>
                  <div style={{ fontSize: 12, color: BRAND.primary }}>{tool.label}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 60 }}>
        <Link to="/" style={{ color: BRAND.textSecondary, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
          ← Back to All Tools
        </Link>
      </div>
    </div>
  );
}

