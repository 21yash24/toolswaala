import { useState } from "react";
import { Link } from "react-router-dom";
import { BRAND, STUDENT_BRAND, STUDENT_TOOLS } from "../../shared/constants";

export default function StudentHome() {
  const [search, setSearch] = useState("");
  const filtered = STUDENT_TOOLS.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }} className="fade-in">
      <div style={{ textAlign: "center", marginBottom: 80 }}>
        <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, background: `${STUDENT_BRAND.accent}15`, border: `1px solid ${STUDENT_BRAND.accent}30`, fontSize: 13, fontWeight: 600, color: STUDENT_BRAND.accent, marginBottom: 16 }}>
          🎓 Student Zone
        </div>
        <h1 style={{ fontSize: "clamp(32px, 8vw, 56px)", color: "white", marginBottom: 24, lineHeight: 1.1, fontWeight: 900 }}>
          Built for India's <span style={{ color: STUDENT_BRAND.accent }}>40 Crore</span> Students
        </h1>
        <p style={{ fontSize: "clamp(14px, 2vw, 18px)", color: BRAND.textSecondary, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
          भारत के 40 करोड़ छात्रों के लिए — Free CGPA calculators, attendance trackers, resume builders and more. Zero login, instant results.
        </p>

        <div style={{ maxWidth: 500, margin: "40px auto 0", display: "flex", gap: 12, background: "rgba(255,255,255,0.05)", padding: 8, borderRadius: 20, border: `1px solid ${BRAND.border}` }}>
          <div style={{ paddingLeft: 16, display: "flex", alignItems: "center", color: BRAND.textSecondary }}>🔍</div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tools — CGPA, Attendance, Resume..." style={{ flex: 1, background: "transparent", border: "none", color: "white", padding: "12px 0", fontSize: 15, outline: "none" }} />
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
                <h3 style={{ color: "white", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{tool.name}</h3>
                <span style={{ fontSize: 13, color: tool.color, fontWeight: 500 }}>{tool.hindi}</span>
              </div>
              <p style={{ fontSize: 14, color: BRAND.textSecondary, lineHeight: 1.5, margin: 0 }}>{tool.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Link to="/" style={{ color: BRAND.primary, textDecoration: "none", fontSize: 16, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 12, border: `1px solid ${BRAND.primary}30`, background: `${BRAND.primary}08` }}>
          🏢 Switch to Business Tools →
        </Link>
      </div>
    </div>
  );
}
