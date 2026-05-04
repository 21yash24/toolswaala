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

    const checkAndInitPdfJs = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      }
    };

    let loadedCount = 0;
    scripts.forEach(src => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => {
          loadedCount++;
          if (loadedCount === scripts.length) checkAndInitPdfJs();
        };
        document.head.appendChild(s);
      } else {
        loadedCount++;
        if (loadedCount === scripts.length) checkAndInitPdfJs();
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 40 }}>
          <style>{`
            @media(min-width: 1024px) {
              .pdf-layout { grid-template-columns: 1fr 320px !important; }
            }
          `}</style>
          <div className="pdf-layout" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 40 }}>
            <main>
              <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <h1 style={{ fontSize: "clamp(24px, 5vw, 42px)", color: BRAND.text, marginBottom: 12, fontWeight: 900 }}>{title}</h1>
                  <div style={{ color: PDF_BRAND.accent, fontSize: 16, fontWeight: 600 }}>{hindi}</div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent(`Check out this free ${title} tool on ToolsWaala! 📄\n\n${window.location.href}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: "10px 18px", borderRadius: 12, border: "1px solid #25D366", background: "rgba(37,211,102,0.1)", color: "#25D366", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}
                  >
                    <span style={{ fontSize: 18 }}>📲</span> WhatsApp
                  </a>
                </div>
              </div>
              {children}

              {/* SEO FAQ Section — helps Google rank this page for long-tail queries */}
              <div style={{ marginTop: 60, padding: 32, borderRadius: 20, background: BRAND.surfaceCard, border: `1px solid ${BRAND.border}` }}>
                <h2 style={{ fontSize: 20, color: BRAND.text, marginBottom: 24 }}>❓ Frequently Asked Questions</h2>
                {[
                  { q: `Is this ${title} tool free?`, a: `Yes, ToolsWaala's ${title} is 100% free. No login, no limits, no hidden charges.` },
                  { q: `Is my file safe?`, a: `Your files are processed entirely in your browser using JavaScript. Nothing is uploaded to any server. Your data stays on your device.` },
                  { q: `Can I use this on mobile?`, a: `Yes! ToolsWaala works perfectly on Android, iPhone, tablets, and desktop browsers.` },
                  { q: `What is the file size limit?`, a: `Most tools support files up to 50MB. For larger files, try our Pro plan.` },
                ].map((faq, i) => (
                  <div key={i} style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 15, color: BRAND.text, marginBottom: 6 }}>{faq.q}</h3>
                    <p style={{ fontSize: 14, color: BRAND.textSecondary, lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </main>

            <aside className="no-print">
              <div style={{ background: BRAND.surfaceCard, borderRadius: 20, border: `1px solid ${BRAND.border}`, padding: 24, position: "sticky", top: 100 }}>
                <h3 style={{ color: BRAND.text, fontSize: 16, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: PDF_BRAND.accent }}>📄</span> Other PDF Tools
                </h3>
                <div style={{ display: "grid", gap: 12 }}>
                  {PDF_TOOLS.filter(t => t.path !== location.pathname).map(tool => (
                    <Link key={tool.id} to={tool.path} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: `1px solid ${BRAND.border}`, textDecoration: "none", transition: "border-color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = PDF_BRAND.accent + "40"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = BRAND.border}>
                      <span style={{ fontSize: 20 }}>{tool.icon}</span>
                      <div style={{ fontSize: 14, color: BRAND.text, fontWeight: 500 }}>{tool.name}</div>
                    </Link>
                  ))}
                </div>
                
                <div style={{ marginTop: 32, padding: 20, borderRadius: 16, background: `${PDF_BRAND.accent}08`, border: `1px solid ${PDF_BRAND.accent}20` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: PDF_BRAND.accent, marginBottom: 8 }}>⚡ Upgrade to Pro</div>
                  <p style={{ fontSize: 12, color: BRAND.textSecondary, margin: 0, lineHeight: 1.5 }}>Unlock batch processing, 100MB file limits, and ad-free experience.</p>
                  <button style={{ width: "100%", marginTop: 16, padding: "12px", borderRadius: 10, border: "none", background: PDF_BRAND.accent, color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform="scale(1.02)"} onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>Go Pro for ₹99/mo</button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
