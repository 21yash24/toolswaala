import { useState } from "react";
import { Link } from "react-router-dom";
import { BRAND, PDF_BRAND, PDF_TOOLS, TOOLS, STUDENT_TOOLS } from "../../shared/constants";

export default function PdfHome() {
  const [search, setSearch] = useState("");
  const filtered = PDF_TOOLS.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.desc.toLowerCase().includes(search.toLowerCase()) ||
    (t.hindi && t.hindi.includes(search)) ||
    (t.keywords && t.keywords.some(k => k.toLowerCase().includes(search.toLowerCase())))
  );

  const crossTools = [
    { ...TOOLS.find(t => t.id === "gst-invoice"), label: "For Freelancers" },
    { ...STUDENT_TOOLS.find(t => t.id === "resume"), label: "For Job Seekers" },
    { ...STUDENT_TOOLS.find(t => t.id === "bonafide"), label: "For College Work" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }} className="fade-in">
      {/* Breadcrumb / Module Switcher */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, overflowX: "auto", whiteSpace: "nowrap", paddingBottom: 8 }}>
        <Link to="/" style={{ color: BRAND.textSecondary, textDecoration: "none", fontSize: 14 }}>All Tools</Link>
        <span style={{ color: BRAND.border }}>/</span>
        <span style={{ color: PDF_BRAND.accent, fontWeight: 700, fontSize: 14 }}>PDF & File Tools</span>
      </div>

      <div style={{ textAlign: "center", marginBottom: 80 }}>
        <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, background: `${PDF_BRAND.accent}15`, border: `1px solid ${PDF_BRAND.accent}30`, fontSize: 13, fontWeight: 600, color: PDF_BRAND.accent, marginBottom: 16 }}>
          📄 PDF & File Tools
        </div>
        <h1 style={{ fontSize: "clamp(32px, 8vw, 56px)", color: BRAND.text, marginBottom: 24, lineHeight: 1.1, fontWeight: 900 }}>
          Your Files, <span style={{ color: PDF_BRAND.accent }}>Your Privacy</span>
        </h1>
        <p style={{ fontSize: "clamp(14px, 2vw, 18px)", color: BRAND.textSecondary, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
          Compress, convert & edit files instantly in your browser. No uploads. No servers. 100% private.
        </p>

        <div style={{ maxWidth: 500, margin: "40px auto 0", display: "flex", gap: 12, background: "rgba(255,255,255,0.05)", padding: 8, borderRadius: 20, border: `1px solid ${BRAND.border}` }}>
          <div style={{ paddingLeft: 16, display: "flex", alignItems: "center", color: BRAND.textSecondary }}>🔍</div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search PDF tools — Compress, Merge, split..." style={{ flex: 1, background: "transparent", border: "none", color: BRAND.text, padding: "12px 0", fontSize: 15, outline: "none" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
        {filtered.map(tool => (
          <Link key={tool.id} to={tool.path} style={{ textDecoration: "none", display: "block" }}>
            <div style={{ background: BRAND.surfaceCard, borderRadius: 20, border: `1px solid ${BRAND.border}`, padding: 28, height: "100%", display: "flex", flexDirection: "column", gap: 20, transition: "border-color 0.2s, transform 0.2s", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = PDF_BRAND.accent + "60"; e.currentTarget.style.transform = "translateY(-4px)"; }}
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
                <span style={{ fontSize: 13, color: PDF_BRAND.accent, fontWeight: 500 }}>{tool.hindi}</span>
              </div>
              <p style={{ fontSize: 14, color: BRAND.textSecondary, lineHeight: 1.5, margin: 0 }}>{tool.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Cross-Module Recommendations */}
      <div style={{ marginTop: 100, padding: "48px 32px", borderRadius: 24, background: "rgba(255,255,255,0.02)", border: `1px solid ${BRAND.border}` }}>
        <h2 style={{ fontSize: 24, color: BRAND.text, marginBottom: 8, fontWeight: 800 }}>Business owners also use →</h2>
        <p style={{ color: BRAND.textSecondary, marginBottom: 32, fontSize: 15 }}>Manage your workflow with professional invoicing and student recruitment tools.</p>
        
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

      <div style={{ textAlign: "center", marginTop: 80, padding: 40, borderRadius: 24, background: "rgba(255,255,255,0.02)", border: `1px solid ${BRAND.border}` }}>
        <h2 style={{ color: BRAND.text, marginBottom: 16 }}>🔒 Why browser-side?</h2>
        <p style={{ color: BRAND.textSecondary, maxWidth: 800, margin: "0 auto", lineHeight: 1.6 }}>
          Standard online PDF tools upload your sensitive documents to their servers. We don't. All our PDF & File tools use advanced JavaScript to process your data right here in your browser tab. Your files never leave your device.
        </p>
      </div>
    </div>
  );
}

