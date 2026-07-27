import { BRAND, PDF_TOOLS } from "../shared/constants";

export default function Footer() {
  const fs = { fontSize: 13, color: BRAND.textSecondary, textDecoration: "none", display: "block", marginBottom: 10 };
  return (
    <footer style={{ background: BRAND.surfaceCard, borderTop: `1px solid ${BRAND.border}`, padding: "80px 24px 40px", marginTop: "auto" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, marginBottom: 60 }}>
          <div>
            <div style={{ color: BRAND.text, fontWeight: 800, fontSize: 20, marginBottom: 16 }}>ToolsWaala</div>
            <p style={{ fontSize: 13, color: BRAND.textSecondary, lineHeight: 1.7, marginBottom: 16 }}>Bharat ka Digital Toolkit. Free tools for students, businesses, and professionals. No login. No data stored. Ever.</p>
            <p style={{ fontSize: 12, color: BRAND.textSecondary, marginBottom: 16 }}>📧 hello@toolswaala.in</p>
            
            {/* Social Media Links — Resolves SEO Audit Red Flags */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <a href="https://x.com/toolswaala" target="_blank" rel="noopener noreferrer" aria-label="ToolsWaala on X Twitter" style={{ color: BRAND.textSecondary, fontSize: 18, textDecoration: "none" }}>𝕏</a>
              <a href="https://linkedin.com/company/toolswaala" target="_blank" rel="noopener noreferrer" aria-label="ToolsWaala on LinkedIn" style={{ color: BRAND.textSecondary, fontSize: 18, textDecoration: "none" }}>💼</a>
              <a href="https://youtube.com/@toolswaala" target="_blank" rel="noopener noreferrer" aria-label="ToolsWaala on YouTube" style={{ color: BRAND.textSecondary, fontSize: 18, textDecoration: "none" }}>▶️</a>
              <a href="https://instagram.com/toolswaala" target="_blank" rel="noopener noreferrer" aria-label="ToolsWaala on Instagram" style={{ color: BRAND.textSecondary, fontSize: 18, textDecoration: "none" }}>📸</a>
              <a href="https://facebook.com/toolswaala" target="_blank" rel="noopener noreferrer" aria-label="ToolsWaala on Facebook" style={{ color: BRAND.textSecondary, fontSize: 18, textDecoration: "none" }}>📘</a>
              <a href="https://github.com/21yash24/toolswaala" target="_blank" rel="noopener noreferrer" aria-label="ToolsWaala on GitHub" style={{ color: BRAND.textSecondary, fontSize: 18, textDecoration: "none" }}>🐙</a>
            </div>
          </div>
          <div>
            <div style={{ color: BRAND.text, fontWeight: 700, marginBottom: 20, fontSize: 13 }}>💼 Business Tools</div>
            {[{n:"GST Invoice",p:"/gst-invoice"},{n:"EMI Calculator",p:"/emi-calculator"},{n:"Income Tax",p:"/tax-calculator"},{n:"Salary Slip",p:"/salary-slip"},{n:"Legal Hub",p:"/legal-hub"},{n:"SIP Calculator",p:"/sip-calculator"}].map(t=>(
              <a key={t.p} href={t.p} style={fs}>{t.n}</a>
            ))}
          </div>
          <div>
            <div style={{ color: BRAND.text, fontWeight: 700, marginBottom: 20, fontSize: 13 }}>🎓 Student Tools</div>
            {[{n:"CGPA Calculator",p:"/cgpa-calculator"},{n:"Attendance Calc",p:"/attendance-calculator"},{n:"Resume Builder",p:"/resume-builder"},{n:"Scholarship Finder",p:"/scholarship-finder"},{n:"Job Finder",p:"/job-finder"},{n:"Pomodoro Timer",p:"/pomodoro-timer"}].map(t=>(
              <a key={t.p} href={t.p} style={fs}>{t.n}</a>
            ))}
          </div>
          <div>
            <div style={{ color: BRAND.text, fontWeight: 700, marginBottom: 20, fontSize: 13 }}>📄 PDF Tools</div>
            {PDF_TOOLS.map(t=>(
              <a key={t.id} href={t.path} style={fs}>{t.name}</a>
            ))}
          </div>
          <div>
            <div style={{ color: BRAND.text, fontWeight: 700, marginBottom: 20, fontSize: 13 }}>📰 Guides & Articles</div>
            {[{n:"All Blog Articles",p:"/blog"},{n:"75% Attendance Rule",p:"/blog/75-percent-attendance-rule-guide"},{n:"Fresher ATS Resume",p:"/blog/ats-resume-for-freshers-guide"},{n:"GST Invoice Format",p:"/blog/gst-invoice-format-india-2025"},{n:"CGPA to Percentage",p:"/blog/cgpa-to-percentage-guide-2025"},{n:"Tax Regime 2025",p:"/blog/new-tax-regime-vs-old-tax-regime-2025"}].map(t=>(
              <a key={t.p} href={t.p} style={fs}>{t.n}</a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${BRAND.border}`, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 12, color: BRAND.textSecondary, margin: "0 0 8px 0" }}>Made with ❤️ in India | © {new Date().getFullYear()} ToolsWaala</p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a href="/privacy" style={{ fontSize: 12, color: BRAND.textSecondary, textDecoration: "none" }}>Privacy Policy</a>
              <a href="/terms" style={{ fontSize: 12, color: BRAND.textSecondary, textDecoration: "none" }}>Terms of Service</a>
              <a href="/disclaimer" style={{ fontSize: 12, color: BRAND.textSecondary, textDecoration: "none" }}>Disclaimer</a>
              <a href="/contact" style={{ fontSize: 12, color: BRAND.textSecondary, textDecoration: "none" }}>Contact Us</a>
            </div>
          </div>
          <p style={{ fontSize: 11, color: BRAND.textSecondary, margin: 0, opacity: 0.7 }}>🔒 No data stored. No login. No uploads to server. 100% Private.</p>
        </div>
      </div>
    </footer>
  );
}
