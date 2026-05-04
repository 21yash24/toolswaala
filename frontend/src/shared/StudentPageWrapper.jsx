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
            <h1 style={{ fontSize: "clamp(24px, 4vw, 48px)", color: BRAND.text, fontWeight: 900, letterSpacing: "-0.02em" }}>{title}</h1>
            <span style={{ fontSize: 18, color: STUDENT_BRAND.accent, fontWeight: 500 }}>{hindi}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a 
            href={`https://wa.me/?text=${encodeURIComponent(`Check out this free ${title} on ToolsWaala! 🎓\n\n${window.location.href}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ padding: "10px 18px", borderRadius: 12, border: "1px solid #25D366", background: "rgba(37,211,102,0.1)", color: "#25D366", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}
          >
            <span style={{ fontSize: 18 }}>📲</span> WhatsApp
          </a>
          <button onClick={handleShare} style={{ padding: "10px 18px", borderRadius: 12, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: BRAND.text, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500 }}>
            🔗 Share
          </button>
        </div>
      </div>

      {children}

      {/* SEO FAQ Section */}
      <div style={{ marginTop: 60, padding: 32, borderRadius: 20, background: BRAND.surfaceCard, border: `1px solid ${BRAND.border}` }}>
        <h2 style={{ fontSize: 20, color: BRAND.text, marginBottom: 24 }}>❓ Frequently Asked Questions</h2>
        {[
          { q: `Is this ${title} free to use?`, a: `Yes! ToolsWaala's ${title} is 100% free. No login, no signup, no hidden charges. Made for Indian students.` },
          { q: `Does this tool work on mobile?`, a: `Yes! ToolsWaala is fully responsive and works perfectly on Android phones, iPhones, tablets and desktops.` },
          { q: `Is my data saved?`, a: `Yes, your data is automatically saved in your browser's local storage. It will be there when you come back tomorrow!` },
          { q: `Can I share my results?`, a: `Yes! Use the WhatsApp share button to share your results with friends and classmates.` },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, color: BRAND.text, marginBottom: 6 }}>{faq.q}</h3>
            <p style={{ fontSize: 14, color: BRAND.textSecondary, lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40, paddingTop: 40, borderTop: `1px solid ${BRAND.border}` }}>
        <h3 style={{ fontSize: 20, marginBottom: 24, color: BRAND.text }}>More Student Tools</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {STUDENT_TOOLS.filter(t => t.name !== title).slice(0, 3).map(tool => (
            <Link key={tool.id} to={tool.path} style={{ textDecoration: "none" }}>
              <div style={{ padding: 20, display: "flex", alignItems: "center", gap: 16, background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, transition: "border-color 0.2s" }}>
                <div style={{ fontSize: 24 }}>{tool.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, color: BRAND.text, fontSize: 14 }}>{tool.name}</div>
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
