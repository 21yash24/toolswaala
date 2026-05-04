import { useState, useEffect, useRef, useCallback } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { StudentHome, CgpaCalculator, AttendanceCalc, PercentageCalc, PomodoroTimer, BonafideCertificate, NocGenerator, ResumeBuilder, SopGenerator, ScholarshipFinder, StudyPlanner } from "./pages/students";
import { PDF_TOOLS, STUDENT_TOOLS, BRAND } from "./shared/constants";
import StudentPageWrapper from "./shared/StudentPageWrapper";
import PdfPageWrapper from "./shared/PdfPageWrapper";
import { PdfHome, PdfCompressor, ImageToPdf, PdfToJpg, MergePdf, SplitPdf, ImageCompressor, WordToPdf, WatermarkPdf, PdfToWord } from "./pages/pdf";
import { 
  UpiPaymentTool, GstInvoiceTool, GstinVerifyTool, QrTool, EmiTool, 
  GstCalculatorTool, EstimateGeneratorTool, LegalHubTool, SalarySlipTool, 
  TaxCalculatorTool, ReceiptMakerTool, BusinessNameTool, SipCalculatorTool, 
  HraCalculatorTool, FdCalculatorTool 
} from "./pages/business";

const TOOLS = [
  { id: "upi", path: "/upi-payment", name: "UPI Payment Page", hindi: "यूपीआई पेमेंट पेज", icon: "📲", desc: "Shareable UPI payment page with QR code", color: "#4CAF50", category: "Finance" },
  { id: "gst-invoice", path: "/gst-invoice", name: "GST Invoice", hindi: "जीएसटी चालान", icon: "🧾", desc: "Professional GST invoice generator with PDF", color: "#FF6B00", category: "Business" },
  { id: "gstin-verify", path: "/gstin-verify", name: "GSTIN Verifier", hindi: "जीएसटीएन सत्यापन", icon: "🛡️", desc: "Instantly verify GST format & extract details", color: "#3F51B5", category: "Business" },
  { id: "qr", path: "/qr-generator", name: "QR Code Generator", hindi: "क्यूआर कोड", icon: "▣", desc: "Custom QR codes for URL, UPI, WhatsApp & more", color: "#2196F3", category: "Business" },
  { id: "emi", path: "/emi-calculator", name: "EMI Calculator", hindi: "ईएमआई कैलकुलेटर", icon: "🏦", desc: "Home, car, personal & business loan EMI", color: "#9C27B0", category: "Finance" },
  { id: "gst-calc", path: "/gst-calculator", name: "GST Calculator", hindi: "जीएसटी कैलकुलेटर", icon: "🧮", desc: "Add or remove GST instantly with HSN lookup", color: "#F44336", category: "Finance" },
  { id: "estimate", path: "/estimate-generator", name: "Estimate Generator", hindi: "अनुमान जनरेटर", icon: "📝", desc: "Create pre-sales quotations with discounts", color: "#4CAF50", category: "Business" },
  { id: "legal", path: "/legal-hub", name: "Legal Hub", hindi: "कानूनी हब", icon: "⚖️", desc: "Generate Rent Agreements, NDAs & MSAs", color: "#FF9800", category: "Legal" },
  { id: "salary", path: "/salary-slip", name: "Salary Slip Engine", hindi: "वेतन पर्ची इंजन", icon: "💼", desc: "Auto-CTC breakdown with New Tax Regime TDS", color: "#009688", category: "Finance" },
  { id: "tax", path: "/tax-calculator", name: "Income Tax Calculator", hindi: "आयकर कैलकुलेटर", icon: "⚖️", desc: "Compare Old vs New Tax Regimes instantly", color: "#E91E63", category: "Finance" },
  { id: "receipt", path: "/receipt-maker", name: "Receipt Maker", hindi: "रसीद जनरेटर", icon: "🧾", desc: "Professional payment receipts with PDF export", color: "#FFC107", category: "Finance" },
  { id: "bizname", path: "/business-name", name: "Business Name AI", hindi: "व्यापार नाम एआई", icon: "✨", desc: "AI-powered business name suggestions", color: "#3F51B5", category: "Business" },
  { id: "sip", path: "/sip-calculator", name: "SIP Calculator", hindi: "एसआईपी कैलकुलेटर", icon: "📈", desc: "Estimate mutual fund SIP returns with visual chart", color: "#00BCD4", category: "Finance" },
  { id: "hra", path: "/hra-calculator", name: "HRA Calculator", hindi: "एचआरए कैलकुलेटर", icon: "🏠", desc: "Calculate House Rent Allowance tax exemption", color: "#8BC34A", category: "Finance" },
  { id: "fd", path: "/fd-calculator", name: "FD Calculator", hindi: "एफडी कैलकुलेटर", icon: "🏦", desc: "Fixed Deposit maturity & interest calculator", color: "#FF5722", category: "Finance" },
];

const globalStyle = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --primary: #FF6B00; --primary-dark: #D45800; --surface: #F8FAFC; --surface-dark: #FFFFFF;
    --accent: #FFB347; --border: rgba(0, 0, 0, 0.08); --text: #0F172A; --text-secondary: #64748B;
    --success: #22C55E; --danger: #EF4444; --radius: 16px; --radius-sm: 8px;
    --shadow: 0 4px 20px -2px rgba(0,0,0,0.05); --app-bg: #F8FAFC; --app-surface: #FFFFFF;
  }

  .dark-mode {
    --surface: #0F172A; --surface-dark: #1E293B; --text: #F8FAFC; --text-secondary: #94A3B8;
    --border: rgba(255, 255, 255, 0.1); --app-bg: #020617; --app-surface: #0F172A;
    --shadow: 0 10px 40px -10px rgba(0,0,0,0.5);
  }

  body { font-family: 'Inter', 'Noto Sans Devanagari', sans-serif; background: var(--app-bg); color: var(--text); line-height: 1.5; transition: background 0.3s ease; }
  .glass-card { background: var(--app-surface); border-radius: var(--radius); border: 1px solid var(--border); box-shadow: var(--shadow); padding: 32px; transition: transform 0.2s, box-shadow 0.2s; }
  .btn-primary { background: var(--primary); color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .btn-primary:hover { background: var(--primary-dark); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(255, 107, 0, 0.3); }
  .btn-secondary { background: rgba(0,0,0,0.05); color: var(--text); border: 1px solid var(--border); padding: 10px 20px; border-radius: 12px; font-weight: 600; cursor: pointer; }
  .dark-mode .btn-secondary { background: rgba(255,255,255,0.05); }
  .form-group { margin-bottom: 20px; }
  .form-group label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 600; color: var(--text-secondary); }
  input, select, textarea { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid var(--border); background: var(--app-bg); color: var(--text); font-family: inherit; font-size: 15px; transition: border-color 0.2s; }
  input:focus { outline: none; border-color: var(--primary); }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
  .grid-4 { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 12px; }
  @media (max-width: 768px) { .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr !important; } }
  .result-box { padding: 32px; border-radius: var(--radius); border: 2px dashed var(--border); background: rgba(255, 107, 0, 0.03); }
  .fade-in { animation: fadeIn 0.4s ease-out; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .divider { height: 1px; background: var(--border); margin: 24px 0; }
  .printable { width: 210mm; min-height: 297mm; padding: 20mm; margin: 10mm auto; }
  @media print { .no-print { display: none !important; } body { background: white !important; } .printable { margin: 0; box-shadow: none; border: none; } }
`;

function Layout({ children, isDarkMode, setIsDarkMode }) {
  const navigate = useNavigate();
  return (
    <div className={isDarkMode ? "dark-mode" : ""}>
      <style>{globalStyle}</style>
      <nav className="no-print" style={{ background: "var(--app-surface)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(10px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: "var(--primary)", width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: 20 }}>T</div>
            <span style={{ fontSize: 22, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.03em" }}>ToolsWaala</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Link to="/students" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Students</Link>
            <Link to="/pdf-tools" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>PDF Tools</Link>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>{isDarkMode ? "🌙" : "☀️"}</button>
          </div>
        </div>
      </nav>
      {children}
      <footer className="no-print" style={{ padding: "80px 24px", borderTop: "1px solid var(--border)", marginTop: 80, background: "var(--app-surface)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: "var(--text)", marginBottom: 16 }}>ToolsWaala</div>
          <p style={{ color: "var(--text-secondary)", marginBottom: 40, maxWidth: 600, margin: "0 auto 40px" }}>Empowering Bharat's small businesses and students with free, professional tools. No login. No limits. Forever free.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, fontSize: 14, fontWeight: 600 }}>
            <Link to="/" style={{ color: "var(--text)", textDecoration: "none" }}>Business</Link>
            <Link to="/students" style={{ color: "var(--text)", textDecoration: "none" }}>Students</Link>
            <Link to="/pdf-tools" style={{ color: "var(--text)", textDecoration: "none" }}>PDF Tools</Link>
          </div>
          <div style={{ marginTop: 60, fontSize: 12, color: "var(--text-secondary)" }}>© 2026 ToolsWaala. Made with ❤️ for Bharat.</div>
        </div>
      </footer>
    </div>
  );
}

function PageWrapper({ children, title, hindi, color }) {
  useEffect(() => { window.scrollTo(0, 0); document.title = `${title} (${hindi}) | ToolsWaala`; }, [title, hindi]);
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 24px" }} className="fade-in">
      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, color: "var(--text)", letterSpacing: "-0.04em", marginBottom: 12 }}>{title}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 20, color, fontWeight: 600 }}>{hindi}</span>
          <div style={{ height: 4, width: 60, background: color, borderRadius: 2 }}></div>
        </div>
      </div>
      {children}
    </div>
  );
}

function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Business", "Finance", "Legal"];
  
  const filtered = TOOLS.filter(t => 
    (activeCategory === "All" || t.category === activeCategory) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.hindi.includes(search))
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 80 }}>
        <h1 style={{ fontSize: "clamp(40px, 8vw, 72px)", fontWeight: 900, color: "var(--text)", letterSpacing: "-0.05em", marginBottom: 24, lineHeight: 1.1 }}>
          The <span style={{ color: "var(--primary)" }}>Professional</span> Kit <br/> for Every Business
        </h1>
        <p style={{ fontSize: 20, color: "var(--text-secondary)", maxWidth: 600, margin: "0 auto 48px" }}>Free GST invoices, legal documents, and finance calculators for India's growing businesses.</p>
        
        <div style={{ maxWidth: 600, margin: "0 auto", position: "relative" }}>
          <input 
            style={{ height: 64, paddingLeft: 60, fontSize: 18, border: "2px solid var(--border)", boxShadow: "0 10px 30px -10px rgba(255,107,0,0.1)" }} 
            placeholder="Search for a tool (e.g. GST, Invoice, EMI...)" 
            value={search} onChange={e => setSearch(e.target.value)}
          />
          <span style={{ position: "absolute", left: 24, top: 20, fontSize: 24 }}>🔍</span>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 40, flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} 
              style={{ padding: "8px 24px", borderRadius: 100, border: activeCategory === cat ? "none" : "1px solid var(--border)", background: activeCategory === cat ? "var(--primary)" : "transparent", color: activeCategory === cat ? "white" : "var(--text-secondary)", fontWeight: 600, cursor: "pointer" }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
          {filtered.map(tool => (
            <Link key={tool.id} to={tool.path} style={{ textDecoration: "none" }}>
              <div className="glass-card" style={{ height: "100%", position: "relative", overflow: "hidden" }} 
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-8px)"} 
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={{ background: `${tool.color}15`, color: tool.color, width: 60, height: 60, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, marginBottom: 24 }}>{tool.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>{tool.name}</h3>
                <p style={{ color: tool.color, fontSize: 14, fontWeight: 600, marginBottom: 16 }}>{tool.hindi}</p>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>{tool.desc}</p>
                <div style={{ position: "absolute", top: 20, right: 20, fontSize: 10, fontWeight: 800, background: "rgba(0,0,0,0.05)", padding: "4px 8px", borderRadius: 4, color: "var(--text-secondary)" }}>{tool.category}</div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "100px 0" }}>
           <div style={{ fontSize: 64, marginBottom: 24 }}>😕</div>
           <h2 style={{ fontSize: 24, fontWeight: 800 }}>No tools found for "{search}"</h2>
           <p style={{ color: "var(--text-secondary)", marginTop: 12 }}>Try searching for "GST" or "EMI". <br/> Or suggest a tool you need!</p>
           <button className="btn-primary" style={{ marginTop: 32 }}>💡 Suggest a Tool</button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <BrowserRouter>
      <Layout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<StudentHome />} />
          <Route path="/pdf-tools" element={<PdfHome />} />
          
          {/* Business Routes */}
          <Route path="/upi-payment" element={<PageWrapper title="UPI Payment Page" hindi="यूपीआई पेमेंट पेज" color="#4CAF50"><UpiPaymentTool /></PageWrapper>} />
          <Route path="/gst-invoice" element={<PageWrapper title="GST Invoice" hindi="जीएसटी चालान" color="#FF6B00"><GstInvoiceTool /></PageWrapper>} />
          <Route path="/gstin-verify" element={<PageWrapper title="GSTIN Verifier" hindi="जीएसटीएन सत्यापन" color="#3F51B5"><GstinVerifyTool /></PageWrapper>} />
          <Route path="/qr-generator" element={<PageWrapper title="QR Code Generator" hindi="क्यूआर कोड" color="#2196F3"><QrTool /></PageWrapper>} />
          <Route path="/emi-calculator" element={<PageWrapper title="EMI Calculator" hindi="ईएमआई कैलकुलेटर" color="#9C27B0"><EmiTool /></PageWrapper>} />
          <Route path="/gst-calculator" element={<PageWrapper title="GST Calculator" hindi="जीएसटी कैलकुलेटर" color="#F44336"><GstCalculatorTool /></PageWrapper>} />
          <Route path="/estimate-generator" element={<PageWrapper title="Estimate Generator" hindi="अनुमान जनरेटर" color="#4CAF50"><EstimateGeneratorTool /></PageWrapper>} />
          <Route path="/legal-hub" element={<PageWrapper title="Legal Hub" hindi="कानूनी हब" color="#FF9800"><LegalHubTool /></PageWrapper>} />
          <Route path="/salary-slip" element={<PageWrapper title="Salary Slip Engine" hindi="वेतन पर्ची इंजन" color="#009688"><SalarySlipTool /></PageWrapper>} />
          <Route path="/tax-calculator" element={<PageWrapper title="Income Tax Calculator" hindi="आयकर कैलकुलेटर" color="#E91E63"><TaxCalculatorTool /></PageWrapper>} />
          <Route path="/receipt-maker" element={<PageWrapper title="Receipt Maker" hindi="रसीद जनरेटर" color="#FFC107"><ReceiptMakerTool /></PageWrapper>} />
          <Route path="/business-name" element={<PageWrapper title="Business Name AI" hindi="व्यापार नाम एआई" color="#3F51B5"><BusinessNameTool /></PageWrapper>} />
          <Route path="/sip-calculator" element={<PageWrapper title="SIP Calculator" hindi="एसआईपी कैलकुलेटर" color="#00BCD4"><SipCalculatorTool /></PageWrapper>} />
          <Route path="/hra-calculator" element={<PageWrapper title="HRA Calculator" hindi="एचआरए कैलकुलेटर" color="#8BC34A"><HraCalculatorTool /></PageWrapper>} />
          <Route path="/fd-calculator" element={<PageWrapper title="FD Calculator" hindi="एफडी कैलकुलेटर" color="#FF5722"><FdCalculatorTool /></PageWrapper>} />

          {/* Student Routes */}
          <Route path="/cgpa-calculator" element={<CgpaCalculator />} />
          <Route path="/attendance-calculator" element={<AttendanceCalc />} />
          <Route path="/percentage-calculator" element={<PercentageCalc />} />
          <Route path="/pomodoro-timer" element={<PomodoroTimer />} />
          <Route path="/bonafide-certificate" element={<BonafideCertificate />} />
          <Route path="/noc-generator" element={<NocGenerator />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/sop-generator" element={<SopGenerator />} />
          <Route path="/scholarship-finder" element={<ScholarshipFinder />} />
          <Route path="/study-planner" element={<StudyPlanner />} />

          {/* PDF Routes */}
          <Route path="/pdf-tools/compress-pdf" element={<PdfCompressor />} />
          <Route path="/pdf-tools/image-to-pdf" element={<ImageToPdf />} />
          <Route path="/pdf-tools/pdf-to-jpg" element={<PdfToJpg />} />
          <Route path="/pdf-tools/merge-pdf" element={<MergePdf />} />
          <Route path="/pdf-tools/split-pdf" element={<SplitPdf />} />
          <Route path="/pdf-tools/compress-image" element={<ImageCompressor />} />
          <Route path="/pdf-tools/word-to-pdf" element={<WordToPdf />} />
          <Route path="/pdf-tools/pdf-to-word" element={<PdfToWord />} />
          <Route path="/pdf-tools/watermark-pdf" element={<WatermarkPdf />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
