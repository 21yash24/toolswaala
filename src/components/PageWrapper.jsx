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
        <div style={{ display: "flex", gap: 10 }}>
          <a 
            href={`https://wa.me/?text=${encodeURIComponent(`Check out this free ${title} on ToolsWaala! 💼\n\n${typeof window !== 'undefined' ? window.location.href : 'https://toolswaala.in'}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ padding: "10px 18px", borderRadius: 12, border: "1px solid #25D366", background: "rgba(37,211,102,0.1)", color: "#25D366", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}
          >
            <span style={{ fontSize: 18 }}>📲</span> WhatsApp
          </a>
          <button onClick={handleShare} className="btn-ghost" style={{ padding: "10px 20px", borderRadius: 12, border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
            <span>🔗</span> Share Tool
          </button>
        </div>
      </div>
      {children}

      {/* E-E-A-T Author Attribution & Verification Box */}
      <div style={{ marginTop: 40, padding: "20px 24px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: `1px solid ${BRAND.border}`, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: BRAND.primary, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, flexShrink: 0 }}>TW</div>
        <div>
          <div style={{ fontSize: 13, color: BRAND.text, fontWeight: 700 }}>Verified & Maintained by ToolsWaala Engineering & Business Team</div>
          <div style={{ fontSize: 12, color: BRAND.textSecondary, lineHeight: 1.4, marginTop: 2 }}>Audited for GST tax compliance & client-side privacy. 100% browser-based calculations. Updated July 2025.</div>
        </div>
      </div>
    </div>
  );
}

