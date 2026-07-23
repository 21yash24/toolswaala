import { TOOLS, BRAND } from "../shared/constants";

export default function PageWrapper({ title, hindi, children }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `ToolsWaala - ${title}`,
        text: `Check out this free ${title} I found on ToolsWaala!`,
        url: typeof window !== 'undefined' ? window.location.href : 'https://toolswaala.in',
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }} className="fade-in">
      <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <a href="/" className="btn-ghost" style={{ marginBottom: 24, display: "inline-block" }}>← Dashboard</a>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 48px)", color: BRAND.text, fontWeight: 900, letterSpacing: "-0.02em" }}>{title}</h1>
            <span className="hindi-label" style={{ fontSize: 18, color: BRAND.primary, fontWeight: 500 }}>{hindi}</span>
          </div>
        </div>
        <button onClick={handleShare} className="btn-ghost" style={{ padding: "10px 20px", borderRadius: 12, border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
          <span>🔗</span> Share Tool
        </button>
      </div>
      {children}

      <div style={{ marginTop: 80, paddingTop: 40, borderTop: `1px solid ${BRAND.border}` }}>
        <h3 style={{ fontSize: 20, marginBottom: 24, color: BRAND.text }}>Other Useful Tools</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {TOOLS.filter(t => t.name !== title).slice(0, 3).map(tool => (
            <a key={tool.id} href={tool.path} style={{ textDecoration: "none" }}>
              <div className="glass-card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 16, height: "100%" }}>
                <div style={{ fontSize: 24 }}>{tool.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, color: BRAND.text, fontSize: 14 }}>{tool.name}</div>
                  <div style={{ fontSize: 12, color: BRAND.textSecondary }}>{tool.hindi}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
