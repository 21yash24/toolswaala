import { useState, useEffect } from "react";
import { TOOLS, STUDENT_TOOLS, PDF_TOOLS, BRAND } from "../shared/constants";

export function HomePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [animCount, setAnimCount] = useState(0);
  
  const BADGE_MAP = {
    "bizname": "AI", "sop": "AI", "jobs": "NEW",
    "pomodoro": "HOT", "gst-invoice": "HOT", "pdf-compress": "HOT", "cgpa": "HOT", "emi": "HOT",
    "word-counter": "NEW", "age-calculator": "NEW", "yt-thumbnail": "NEW",
  };
  const BADGE_STYLES = {
    "AI": { bg: "#7C3AED20", color: "#7C3AED", label: "AI ✨" },
    "HOT": { bg: "#FF6B0020", color: "#FF6B00", label: "🔥 HOT" },
    "NEW": { bg: "#10B98120", color: "#10B981", label: "NEW" },
  };

  const allTools = [
    ...TOOLS.map(t => ({ ...t, module: "business" })),
    ...STUDENT_TOOLS.map(t => ({ ...t, module: "students" })),
    ...PDF_TOOLS.map(t => ({ ...t, module: "pdf" })),
  ];
  const totalCount = allTools.length;

  useEffect(() => {
    let n = 0;
    const iv = setInterval(() => { n += 1247; if (n >= 50000) { n = 50000; clearInterval(iv); } setAnimCount(n); }, 30);
    return () => clearInterval(iv);
  }, []);

  const filtered = allTools.filter(t => {
    const matchCat = category === "all" || t.module === category;
    const matchSearch = !search || 
      t.name.toLowerCase().includes(search.toLowerCase()) || 
      t.desc.toLowerCase().includes(search.toLowerCase()) || 
      t.hindi.includes(search) ||
      (t.keywords && t.keywords.some(k => k.toLowerCase().includes(search.toLowerCase())));
    return matchCat && matchSearch;
  });

  const cats = [
    { key: "all", label: "All Tools", color: BRAND.primary, count: allTools.length },
    { key: "business", label: "Business", color: "#FF6B00", count: TOOLS.length },
    { key: "students", label: "Students", color: "#7C3AED", count: STUDENT_TOOLS.length },
    { key: "pdf", label: "PDF & Files", color: "#1D6BE4", count: PDF_TOOLS.length },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }} className="fade-in">
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div className="badge badge-orange" style={{ marginBottom: 16 }}>Bharat's Digital Toolkit 🇮🇳</div>
        <h1 style={{ fontSize: "clamp(32px, 8vw, 64px)", color: BRAND.text, marginBottom: 24, lineHeight: 1.1, fontWeight: 900 }}>
          Every tool you need.<br/> <span style={{ color: BRAND.primary }}>Zero Login.</span> No Limits.
        </h1>
        <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: BRAND.textSecondary, maxWidth: 700, margin: "0 auto", lineHeight: 1.6 }}>
          Professional tools for Students and SMBs. Create invoices, process PDFs, and calculate CGPA instantly.
        </p>
        <div style={{ maxWidth: 650, margin: "40px auto 0", display: "flex", gap: 12, background: "rgba(255,255,255,0.05)", padding: "12px 16px", borderRadius: 24, border: "2px solid var(--border)", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", color: BRAND.textSecondary, fontSize: 24 }}>🔍</div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${totalCount}+ tools (e.g. CGPA, Invoice, बोनाफाइड)...`} style={{ flex: 1, background: "transparent", border: "none", color: BRAND.text, padding: "12px 0", fontSize: 18, outline: "none", fontWeight: 500 }} />
        </div>
      </div>

      {/* Stats Strip */}
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "16px 40px", marginBottom: 48, padding: "20px 0", borderTop: `1px solid ${BRAND.border}`, borderBottom: `1px solid ${BRAND.border}` }}>
        {[
          { val: `${totalCount}+`, label: "Free Tools" },
          { val: "0", label: "Signups Required" },
          { val: animCount.toLocaleString("en-IN") + "+", label: "Indians Trust Us" },
          { val: "🇮🇳", label: "Made in India" },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: BRAND.primary }}>{s.val}</div>
            <div style={{ fontSize: 12, color: BRAND.textSecondary, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category Filter Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 32, overflowX: "auto", paddingBottom: 4 }}>
        {cats.map(c => (
          <button key={c.key} onClick={() => setCategory(c.key)} style={{ padding: "10px 20px", borderRadius: 12, border: `2px solid ${category === c.key ? c.color : BRAND.border}`, cursor: "pointer", background: category === c.key ? `${c.color}15` : "transparent", color: category === c.key ? c.color : BRAND.text, fontWeight: 700, fontSize: 14, transition: "0.2s", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 8 }}>
            {c.label} <span style={{ background: category === c.key ? c.color : "rgba(255,255,255,0.1)", color: category === c.key ? "white" : BRAND.textSecondary, padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 800 }}>{c.count}</span>
          </button>
        ))}
      </div>

      {/* Tool Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {filtered.map((tool) => (
          <a key={tool.id} href={tool.path} style={{ textDecoration: "none", display: "block" }}>
            <div className="glass-card" style={{ height: "100%", display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ width: 56, height: 56, background: `${tool.color}15`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, border: `1px solid ${tool.color}30` }}>
                  {tool.icon}
                </div>
                {BADGE_MAP[tool.id] && <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 800, background: BADGE_STYLES[BADGE_MAP[tool.id]].bg, color: BADGE_STYLES[BADGE_MAP[tool.id]].color }}>{BADGE_STYLES[BADGE_MAP[tool.id]].label}</span>}
              </div>
              <div>
                <h3 style={{ fontSize: 20, color: BRAND.text, marginBottom: 4 }}>{tool.name}</h3>
                <span className="hindi-label" style={{ marginBottom: 12 }}>{tool.hindi}</span>
                <p style={{ fontSize: 14, color: BRAND.textSecondary, lineHeight: 1.5 }}>{tool.desc}</p>
              </div>
              <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 8, color: tool.color, fontWeight: 700, fontSize: 13 }}>
                GET STARTED 
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
