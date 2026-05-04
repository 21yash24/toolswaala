import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BRAND, STUDENT_BRAND, STUDENT_TOOLS } from "./constants";

export default function StudentPageWrapper({ title, hindi, children }) {
  useEffect(() => {
    const seoTitle = `${title} (${hindi}) | ToolsWaala Student Zone - Free Tools India`;
    const seoDesc = `Free ${title.toLowerCase()} for Indian students. Zero login, instant results. Made for Bharat's students.`;
    document.title = seoTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = seoDesc;

    const schema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: title,
      operatingSystem: "Web",
      applicationCategory: "EducationalApplication",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      url: window.location.href,
      description: seoDesc,
    };
    let script = document.getElementById("json-ld-schema");
    if (!script) {
      script = document.createElement("script");
      script.id = "json-ld-schema";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(schema);
  }, [title, hindi]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `ToolsWaala - ${title}`, text: `Check out this free ${title} for students!`, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }} className="fade-in">
      <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <Link to="/students" style={{ color: STUDENT_BRAND.accent, textDecoration: "none", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16, padding: "6px 14px", borderRadius: 8, border: `1px solid ${STUDENT_BRAND.accent}30`, background: `${STUDENT_BRAND.accent}10` }}>
            ← Student Zone
          </Link>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 48px)", color: "white", fontWeight: 900, letterSpacing: "-0.02em" }}>{title}</h1>
            <span style={{ fontSize: 18, color: STUDENT_BRAND.accent, fontWeight: 500 }}>{hindi}</span>
          </div>
        </div>
        <button onClick={handleShare} style={{ padding: "10px 20px", borderRadius: 12, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: BRAND.text, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
          🔗 Share
        </button>
      </div>

      {children}

      <div style={{ marginTop: 80, paddingTop: 40, borderTop: `1px solid ${BRAND.border}` }}>
        <h3 style={{ fontSize: 20, marginBottom: 24, color: "white" }}>More Student Tools</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {STUDENT_TOOLS.filter(t => t.name !== title).slice(0, 3).map(tool => (
            <Link key={tool.id} to={tool.path} style={{ textDecoration: "none" }}>
              <div style={{ padding: 20, display: "flex", alignItems: "center", gap: 16, background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, transition: "border-color 0.2s" }}>
                <div style={{ fontSize: 24 }}>{tool.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, color: "white", fontSize: 14 }}>{tool.name}</div>
                  <div style={{ fontSize: 12, color: BRAND.textSecondary }}>{tool.hindi}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
