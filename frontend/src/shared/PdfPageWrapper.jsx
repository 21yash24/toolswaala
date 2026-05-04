import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BRAND, PDF_BRAND, PDF_TOOLS } from "./constants";

export default function PdfPageWrapper({ children, title, hindi }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Add external scripts for PDF processing
    const scripts = [
      "https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js",
      "https://unpkg.com/docx@8.5.0/build/index.umd.js"
    ];

    scripts.forEach(src => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        document.head.appendChild(s);
      }
    });
  }, []);

  return (
    <div className="fade-in">
      {/* Privacy Banner */}
      <div style={{ background: `${PDF_BRAND.accent}10`, borderBottom: `1px solid ${PDF_BRAND.accent}20`, padding: "12px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 13, color: PDF_BRAND.accent, fontWeight: 600 }}>
          <span>🔒 Privacy First: Your files are processed entirely in your browser. No file is ever uploaded to our servers.</span>
        </div>
        <div style={{ fontSize: 11, color: BRAND.textSecondary, marginTop: 2 }}>आपकी फाइलें हमारे सर्वर पर अपलोड नहीं होतीं। पूरी तरह सुरक्षित।</div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        {/* Breadcrumbs */}
        <div style={{ display: "flex", gap: 8, fontSize: 13, marginBottom: 32 }}>
          <Link to="/" style={{ color: BRAND.textSecondary, textDecoration: "none" }}>Home</Link>
          <span style={{ color: BRAND.textSecondary }}>/</span>
          <Link to="/pdf-tools" style={{ color: PDF_BRAND.accent, textDecoration: "none", fontWeight: 600 }}>PDF Tools</Link>
          <span style={{ color: BRAND.textSecondary }}>/</span>
          <span style={{ color: BRAND.text }}>{title}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 40 }}>
          <main>
            <div style={{ marginBottom: 40 }}>
              <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", color: "white", marginBottom: 12, fontWeight: 900 }}>{title}</h1>
              <div style={{ color: PDF_BRAND.accent, fontSize: 18, fontWeight: 600 }}>{hindi}</div>
            </div>
            {children}
          </main>

          <aside className="no-print">
            <div style={{ background: BRAND.surfaceCard, borderRadius: 20, border: `1px solid ${BRAND.border}`, padding: 24, position: "sticky", top: 100 }}>
              <h3 style={{ color: "white", fontSize: 16, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: PDF_BRAND.accent }}>📄</span> Other PDF Tools
              </h3>
              <div style={{ display: "grid", gap: 12 }}>
                {PDF_TOOLS.filter(t => t.path !== location.pathname).map(tool => (
                  <Link key={tool.id} to={tool.path} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: `1px solid ${BRAND.border}`, textDecoration: "none", transition: "border-color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = PDF_BRAND.accent + "40"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = BRAND.border}>
                    <span style={{ fontSize: 20 }}>{tool.icon}</span>
                    <div style={{ fontSize: 14, color: "white", fontWeight: 500 }}>{tool.name}</div>
                  </Link>
                ))}
              </div>
              
              <div style={{ marginTop: 32, padding: 20, borderRadius: 16, background: `${PDF_BRAND.accent}08`, border: `1px solid ${PDF_BRAND.accent}20` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: PDF_BRAND.accent, marginBottom: 8 }}>⚡ Upgrade to Pro</div>
                <p style={{ fontSize: 12, color: BRAND.textSecondary, margin: 0, lineHeight: 1.5 }}>Unlock batch processing, 100MB file limits, and ad-free experience.</p>
                <button style={{ width: "100%", marginTop: 16, padding: "10px", borderRadius: 8, border: "none", background: PDF_BRAND.accent, color: "white", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Go Pro for ₹99/mo</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
