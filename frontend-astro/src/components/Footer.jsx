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
            <p style={{ fontSize: 12, color: BRAND.textSecondary }}>📧 hello@toolswaala.in</p>
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
