import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// CONSTANTS & HELPERS
// ============================================================
const BRAND = {
  primary: "#FF6B00",
  primaryDark: "#D45800",
  surface: "#09090B",
  surfaceCard: "#141414",
  text: "#FAFAFA",
  textSecondary: "#A1A1AA",
  accent: "#FFB347",
  border: "rgba(255, 255, 255, 0.08)",
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const GST_RATES = [0, 5, 12, 18, 28];

const LOAN_PRESETS = {
  "Home Loan": { amount: 3000000, rate: 8.5, tenure: 240 },
  "Car Loan": { amount: 800000, rate: 9.5, tenure: 60 },
  "Personal Loan": { amount: 300000, rate: 13.5, tenure: 36 },
  "Business Loan": { amount: 1000000, rate: 11, tenure: 48 },
};

const HSN_CODES = {
  1001: "Wheat and Meslin",
  1006: "Rice",
  2201: "Waters, including natural water",
  3004: "Medicaments",
  4901: "Printed books, brochures, pamphlets",
  6101: "Men's overcoats, car-coats",
  8471: "Automatic data processing machines (computers)",
  8517: "Telephone sets, mobile phones",
  8703: "Motor cars and passenger vehicles",
  9401: "Seats (other than garden seats)",
};

function formatINR(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);
}

function numberToWords(num) {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const inWords = (n) => {
    if ((n = n.toString()).length > 9) return 'overflow';
    let nArray = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!nArray) return '';
    let str = '';
    str += (nArray[1] != 0) ? (a[Number(nArray[1])] || b[nArray[1][0]] + ' ' + a[nArray[1][1]]) + 'Crore ' : '';
    str += (nArray[2] != 0) ? (a[Number(nArray[2])] || b[nArray[2][0]] + ' ' + a[nArray[2][1]]) + 'Lakh ' : '';
    str += (nArray[3] != 0) ? (a[Number(nArray[3])] || b[nArray[3][0]] + ' ' + a[nArray[3][1]]) + 'Thousand ' : '';
    str += (nArray[4] != 0) ? (a[Number(nArray[4])] || b[nArray[4][0]] + ' ' + a[nArray[4][1]]) + 'Hundred ' : '';
    str += (nArray[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(nArray[5])] || b[nArray[5][0]] + ' ' + a[nArray[5][1]]) : '';
    return str.trim() + ' Rupees Only';
  };
  return inWords(Math.floor(num));
}

function getInitials(name) {
  return (name || "TW")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function addMonths(dateStr, months) {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

// ============================================================
// STYLES (PREMIUM DARK MODE)
// ============================================================
const globalStyle = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --primary: #FF6B00;
    --primary-dark: #D45800;
    --surface: #09090B;
    --surface-dark: #141414;
    --accent: #FFB347;
    --border: rgba(255, 255, 255, 0.08);
    --text: #FAFAFA;
    --text-secondary: #A1A1AA;
    --success: #22C55E;
    --danger: #EF4444;
    --radius: 16px;
    --radius-sm: 8px;
    --shadow: 0 4px 20px -2px rgba(0,0,0,0.5);
    --shadow-hover: 0 8px 30px -4px rgba(255,107,0,0.2);
  }

  html, body, #root {
    width: 100vw !important;
    max-width: 100vw !important;
    min-height: 100vh !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: hidden;
    background: var(--surface);
    color: var(--text);
  }

  body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
  
  h1, h2, h3, h4 { font-weight: 800; letter-spacing: -0.02em; }
  
  .hindi-label {
    font-family: 'Noto Sans Devanagari', sans-serif;
    font-size: 11px;
    color: var(--text-secondary);
    opacity: 0.6;
    display: block;
    margin-top: 2px;
  }

  .btn-primary {
    background: var(--primary);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: var(--radius-sm);
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .btn-primary:hover { background: var(--primary-dark); transform: translateY(-2px); box-shadow: 0 10px 20px -10px rgba(255,107,0,0.5); }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    color: white;
    border: 1px solid var(--border);
    padding: 11px 24px;
    border-radius: var(--radius-sm);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .btn-secondary:hover { background: rgba(255, 255, 255, 0.1); border-color: var(--primary); }

  .btn-ghost {
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border);
    padding: 10px 20px;
    border-radius: var(--radius-sm);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .btn-ghost:hover { border-color: var(--primary); color: var(--primary); background: rgba(255,107,0,0.05); }

  .glass-card {
    background: var(--surface-dark);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    padding: 24px;
    transition: all 0.3s ease;
  }
  .glass-card:hover { border-color: rgba(255,107,0,0.3); box-shadow: var(--shadow-hover); }

  .form-group { margin-bottom: 20px; }
  .form-group label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 8px;
  }
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-family: inherit;
    font-size: 14px;
    color: var(--text);
    background: rgba(0,0,0,0.2);
    transition: all 0.2s;
    outline: none;
  }
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(255,107,0,0.2);
    background: rgba(0,0,0,0.3);
  }
  .form-group textarea { resize: vertical; min-height: 100px; }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }
  @media(max-width: 768px) {
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
  }

  .badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .badge-orange { background: rgba(255,107,0,0.15); color: var(--primary); }
  .badge-green { background: rgba(34,197,94,0.15); color: var(--success); }

  .divider { border: none; border-top: 1px solid var(--border); margin: 24px 0; }

  .result-box {
    background: linear-gradient(135deg, rgba(20,20,20,0.8) 0%, rgba(30,30,30,0.8) 100%);
    border: 1px solid rgba(255,107,0,0.3);
    border-radius: var(--radius);
    padding: 24px;
    backdrop-filter: blur(10px);
  }

  .stat-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 20px;
    text-align: center;
  }
  .stat-value { font-size: 24px; font-weight: 800; color: white; }
  .stat-label { font-size: 12px; color: var(--text-secondary); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }

  .table-container { overflow-x: auto; border-radius: 12px; border: 1px solid var(--border); }
  table { width: 100%; border-collapse: collapse; font-size: 14px; background: rgba(0,0,0,0.1); }
  table th {
    text-align: left;
    padding: 14px 16px;
    background: rgba(255,255,255,0.05);
    color: var(--text-secondary);
    font-weight: 600;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border-bottom: 1px solid var(--border);
  }
  table td { padding: 14px 16px; border-bottom: 1px solid var(--border); color: var(--text); }
  table tr:last-child td { border-bottom: none; }
  table tr:hover td { background: rgba(255,255,255,0.02); }

  @media print {
    .no-print { display: none !important; }
    body, html, #root { background: white !important; color: black !important; width: auto !important; height: auto !important; overflow: visible !important; }
    .glass-card { border: none !important; box-shadow: none !important; padding: 0 !important; background: transparent !important; }
    input, textarea, select { border: 1px solid #ddd !important; background: white !important; color: black !important; }
  }
`;

// ============================================================
// NAVIGATION
// ============================================================
const TOOLS = [
  { id: "upi", name: "UPI Payment Page", hindi: "यूपीआई पेमेंट पेज", icon: "📲", desc: "Shareable UPI payment page with QR code", color: "#4CAF50" },
  { id: "gst-invoice", name: "GST Invoice", hindi: "जीएसटी चालान", icon: "🧾", desc: "Professional GST invoice generator with PDF", color: "#FF6B00" },
  { id: "gstin-verify", name: "GSTIN Verifier", hindi: "जीएसटीएन सत्यापन", icon: "🛡️", desc: "Instantly verify GST format & extract details", color: "#3F51B5" },
  { id: "qr", name: "QR Code Generator", hindi: "क्यूआर कोड", icon: "▣", desc: "Custom QR codes for URL, UPI, WhatsApp & more", color: "#2196F3" },
  { id: "emi", name: "EMI Calculator", hindi: "ईएमआई कैलकुलेटर", icon: "🏦", desc: "Home, car, personal & business loan EMI", color: "#9C27B0" },
  { id: "gst-calc", name: "GST Calculator", hindi: "जीएसटी कैलकुलेटर", icon: "🧮", desc: "Add or remove GST instantly with HSN lookup", color: "#F44336" },
  { id: "estimate", name: "Estimate Generator", hindi: "अनुमान जनरेटर", icon: "📝", desc: "Create pre-sales quotations with discounts", color: "#4CAF50" },
  { id: "legal", name: "Legal Hub", hindi: "कानूनी हब", icon: "⚖️", desc: "Generate Rent Agreements, NDAs & MSAs", color: "#FF9800" },
  { id: "salary", name: "Salary Slip Engine", hindi: "वेतन पर्ची इंजन", icon: "💼", desc: "Auto-CTC breakdown with New Tax Regime TDS", color: "#009688" },
  { id: "bizname", name: "Business Name AI", hindi: "व्यापार नाम एआई", icon: "✨", desc: "AI-powered business name suggestions", color: "#E91E63" },
];

// In the head section of your HTML template:
// <title>ToolsWaala | Professional Business Kit for India</title>
// <meta name="description" content="Generate GST Invoices, Rent Agreements, Salary Slips, NDAs and verify GSTINs instantly with ToolsWaala." />
// <script src="https://unpkg.com/qr-code-styling@1.5.0/lib/qr-code-styling.js"></script>

function Navbar({ active, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{ background: "rgba(9, 9, 11, 0.8)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.05)", width: "100vw" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} onClick={() => setPage("home")}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ boxShadow: "0 0 20px rgba(255,107,0,0.4)", borderRadius: 10 }}>
            <rect width="40" height="40" rx="10" fill="url(#grad)" />
            <path d="M10 14H20M15 14V26" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 14L25 24L28 17L31 24L34 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FF6B00" />
                <stop offset="1" stopColor="#FFB347" />
              </linearGradient>
            </defs>
          </svg>
          <div>
            <div style={{ color: "white", fontWeight: 900, fontSize: 19, lineHeight: 1, letterSpacing: "-0.02em" }}>ToolsWaala</div>
            <div style={{ color: BRAND.accent, fontSize: 10, lineHeight: 1.4, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Business Kit</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 13 }} onClick={() => alert("Pro plan at ₹99/month — Integration coming soon!")}>⚡ PRO</button>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "white", width: 40, height: 40, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{menuOpen ? "✕" : "☰"}</button>
        </div>
      </div>
      {menuOpen && (
        <div style={{ background: "rgba(20, 20, 20, 0.95)", backdropFilter: "blur(30px)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "24px 0" }} className="fade-in">
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 8 }}>
            {TOOLS.map(t => (
              <button key={t.id} onClick={() => { setPage(t.id); setMenuOpen(false); }}
                style={{ background: active === t.id ? "rgba(255,107,0,0.1)" : "transparent", border: "1px solid", borderColor: active === t.id ? "rgba(255,107,0,0.2)" : "transparent", color: active === t.id ? BRAND.primary : BRAND.text, padding: "12px 16px", borderRadius: 12, cursor: "pointer", textAlign: "left", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>{t.icon}</span> {t.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ background: "#050505", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "80px 24px 40px", marginTop: "auto" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 60, marginBottom: 60 }}>
          <div>
            <div style={{ color: "white", fontWeight: 800, fontSize: 20, marginBottom: 20 }}>ToolsWaala</div>
            <p style={{ fontSize: 14, color: BRAND.textSecondary, lineHeight: 1.8 }}>Professional tools for Indian shopkeepers, freelancers, and small business owners.</p>
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 700, marginBottom: 24, fontSize: 14 }}>Popular Tools</div>
            <div style={{ display: "grid", gap: 12 }}>
              {TOOLS.slice(0, 5).map(t => (
                <button key={t.id} onClick={() => { setPage(t.id); window.scrollTo(0,0); }} style={{ background: "none", border: "none", color: BRAND.textSecondary, cursor: "pointer", fontSize: 14, textAlign: "left" }}>{t.name}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 700, marginBottom: 24, fontSize: 14 }}>Connect</div>
            <p style={{ fontSize: 14, color: BRAND.textSecondary }}>📧 hello@toolswaala.in</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function PageWrapper({ title, hindi, children, setPage }) {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }} className="fade-in">
      <div style={{ marginBottom: 40 }}>
        <button onClick={() => setPage("home")} className="btn-ghost" style={{ marginBottom: 24 }}>← Dashboard</button>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", color: "white" }}>{title}</h1>
          <span className="hindi-label" style={{ fontSize: 16, color: BRAND.primary }}>{hindi}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

// ============================================================
// HOME PAGE
// ============================================================
function HomePage({ setPage }) {
  const [search, setSearch] = useState("");
  const filtered = TOOLS.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div style={{ padding: "100px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(32px, 7vw, 64px)", marginBottom: 20 }}>Modernize Your <span style={{ color: BRAND.primary }}>Business</span></h1>
        <p style={{ color: BRAND.textSecondary, marginBottom: 40 }}>Professional-grade tools for Indian entrepreneurs. 100% Free.</p>
        <div style={{ maxWidth: 500, margin: "0 auto", display: "flex", gap: 12, background: "rgba(255,255,255,0.05)", padding: 8, borderRadius: 16 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tools..." style={{ flex: 1, background: "transparent", border: "none" }} />
          <button className="btn-primary">Search</button>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto 100px", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
        {filtered.map(tool => (
          <div key={tool.id} onClick={() => setPage(tool.id)} className="glass-card" style={{ cursor: "pointer" }}>
            <div style={{ fontSize: 40, marginBottom: 20 }}>{tool.icon}</div>
            <h3 style={{ marginBottom: 8 }}>{tool.name}</h3>
            <p className="hindi-label" style={{ marginBottom: 12, color: BRAND.primary }}>{tool.hindi}</p>
            <p style={{ fontSize: 14, color: BRAND.textSecondary, marginBottom: 20 }}>{tool.desc}</p>
            <span style={{ color: BRAND.primary, fontWeight: 800 }}>Start Now →</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// TOOLS (VERBATIM LOGIC FROM toolswaala.jsx)
// ============================================================

function UpiTool() {
  const [form, setForm] = useState({ name: "", upiId: "", description: "", amount: "", theme: "#FF6B00" });
  const [generated, setGenerated] = useState(false);
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const generate = () => { if (!form.name || !form.upiId) { alert("Please enter name and UPI ID"); return; } setGenerated(true); };
  const openPayment = (app) => {
    const payUrl = `upi://pay?pa=${form.upiId}&pn=${encodeURIComponent(form.name)}&am=${form.amount || ""}&cu=INR`;
    const deepLinks = { phonepe: `phonepe://pay?pa=${form.upiId}&pn=${form.name}&am=${form.amount || ""}`, gpay: `tez://upi/pay?pa=${form.upiId}&pn=${form.name}&am=${form.amount || ""}`, paytm: `paytmmp://upi/pay?pa=${form.upiId}&pn=${form.name}&am=${form.amount || ""}`, bhim: `upi://pay?pa=${form.upiId}&pn=${form.name}&am=${form.amount || ""}` };
    window.location.href = deepLinks[app] || payUrl;
  };
  return (
    <div className="grid-2">
      <div className="glass-card">
        <div className="form-group"><label>Display Name</label><input value={form.name} onChange={e => update("name", e.target.value)} /></div>
        <div className="form-group"><label>UPI ID</label><input value={form.upiId} onChange={e => update("upiId", e.target.value)} /></div>
        <div className="form-group"><label>Amount</label><input type="number" value={form.amount} onChange={e => update("amount", e.target.value)} /></div>
        <button className="btn-primary" style={{ width: "100%" }} onClick={generate}>Generate Page</button>
      </div>
      {generated && (
        <div className="result-box fade-in">
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: 12, background: BRAND.primary, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{getInitials(form.name)}</div>
            <h2>{form.name}</h2>
            <p>{form.upiId}</p>
            {form.amount && <div style={{ fontSize: 32, fontWeight: 900, margin: "20px 0" }}>{formatINR(form.amount)}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {["phonepe", "gpay", "paytm", "bhim"].map(app => <button key={app} onClick={() => openPayment(app)} className="btn-secondary">{app.toUpperCase()}</button>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GstInvoiceTool() {
  const [seller, setSeller] = useState({ name: "Your Business Name", gstin: "", address: "", state: "Maharashtra", bank: { name: "", acc: "", ifsc: "" } });
  const [buyer, setBuyer] = useState({ name: "", gstin: "", address: "", state: "Maharashtra" });
  const [invoice, setInvoice] = useState({ number: `INV-${new Date().getFullYear()}-01`, date: today(), terms: "1. Please pay within 15 days.\n2. GST will be extra as applicable." });
  const [items, setItems] = useState([{ desc: "", hsn: "", qty: 1, rate: "", gst: 18 }]);
  const [preview, setPreview] = useState(false);

  const addItem = () => setItems(p => [...p, { desc: "", hsn: "", qty: 1, rate: "", gst: 18 }]);
  const removeItem = (i) => setItems(p => p.filter((_, idx) => idx !== i));
  const updateItem = (i, k, v) => setItems(p => p.map((item, idx) => idx === i ? { ...item, [k]: v } : item));

  const isInterstate = seller.state !== buyer.state;

  const calculateTotals = () => {
    let subtotal = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    
    items.forEach(item => {
      const amount = (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
      subtotal += amount;
      const gstAmt = amount * (item.gst / 100);
      
      if (isInterstate) {
        igst += gstAmt;
      } else {
        cgst += gstAmt / 2;
        sgst += gstAmt / 2;
      }
    });
    
    return { subtotal, cgst, sgst, igst, total: subtotal + cgst + sgst + igst };
  };

  const totals = calculateTotals();

  return (
    <div>
      {!preview ? (
        <div className="fade-in">
          <div className="grid-2" style={{ marginBottom: 24 }}>
            <div className="glass-card">
              <h3>Your Business Details</h3>
              <div className="form-group"><label>Business Name</label><input value={seller.name} onChange={e => setSeller({...seller, name: e.target.value})} /></div>
              <div className="form-group"><label>GSTIN</label><input value={seller.gstin} onChange={e => setSeller({...seller, gstin: e.target.value})} placeholder="27XXXXX..." /></div>
              <div className="form-group"><label>Address</label><textarea value={seller.address} onChange={e => setSeller({...seller, address: e.target.value})} /></div>
              <div className="form-group">
                <label>State</label>
                <select value={seller.state} onChange={e => setSeller({...seller, state: e.target.value})}>
                  {["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat", "Haryana", "Uttar Pradesh"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 15 }}>
                <h4>Bank Details</h4>
                <div className="form-group"><label>Bank Name</label><input value={seller.bank.name} onChange={e => setSeller({...seller, bank: {...seller.bank, name: e.target.value}})} /></div>
                <div className="form-group"><label>Account Number</label><input value={seller.bank.acc} onChange={e => setSeller({...seller, bank: {...seller.bank, acc: e.target.value}})} /></div>
                <div className="form-group"><label>IFSC Code</label><input value={seller.bank.ifsc} onChange={e => setSeller({...seller, bank: {...seller.bank, ifsc: e.target.value}})} /></div>
              </div>
            </div>
            <div className="glass-card">
              <h3>Client Information</h3>
              <div className="form-group"><label>Client Name</label><input value={buyer.name} onChange={e => setBuyer({...buyer, name: e.target.value})} /></div>
              <div className="form-group"><label>Client GSTIN</label><input value={buyer.gstin} onChange={e => setBuyer({...buyer, gstin: e.target.value})} /></div>
              <div className="form-group"><label>Address</label><textarea value={buyer.address} onChange={e => setBuyer({...buyer, address: e.target.value})} /></div>
              <div className="form-group">
                <label>Place of Supply (State)</label>
                <select value={buyer.state} onChange={e => setBuyer({...buyer, state: e.target.value})}>
                  {["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat", "Haryana", "Uttar Pradesh"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 15 }}>
                <h4>Invoice Metadata</h4>
                <div className="form-group"><label>Invoice Number</label><input value={invoice.number} onChange={e => setInvoice({...invoice, number: e.target.value})} /></div>
                <div className="form-group"><label>Invoice Date</label><input type="date" value={invoice.date} onChange={e => setInvoice({...invoice, date: e.target.value})} /></div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ marginBottom: 24 }}>
            <h3>Line Items</h3>
            <div className="table-container">
              <table style={{ minWidth: 800 }}>
                <thead>
                  <tr>
                    <th style={{ width: "40%" }}>Description</th>
                    <th>HSN/SAC</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>GST %</th>
                    <th>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i}>
                      <td><input value={item.desc} onChange={e => updateItem(i, "desc", e.target.value)} placeholder="Product or Service" /></td>
                      <td><input value={item.hsn} onChange={e => updateItem(i, "hsn", e.target.value)} placeholder="Code" /></td>
                      <td><input type="number" value={item.qty} onChange={e => updateItem(i, "qty", e.target.value)} /></td>
                      <td><input type="number" value={item.rate} onChange={e => updateItem(i, "rate", e.target.value)} /></td>
                      <td>
                        <select value={item.gst} onChange={e => updateItem(i, "gst", +e.target.value)}>
                          {GST_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
                        </select>
                      </td>
                      <td style={{ textAlign: "right", paddingRight: 20 }}>{((parseFloat(item.qty)||0) * (parseFloat(item.rate)||0)).toFixed(2)}</td>
                      <td><button className="btn-ghost" onClick={() => removeItem(i)} style={{ color: BRAND.danger }}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="btn-ghost" onClick={addItem} style={{ marginTop: 16 }}>+ Add Line Item</button>
          </div>

          <div className="glass-card" style={{ marginBottom: 24 }}>
            <div className="grid-2">
              <div className="form-group">
                <label>Terms & Conditions</label>
                <textarea value={invoice.terms} onChange={e => setInvoice({...invoice, terms: e.target.value})} rows={4} />
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, color: BRAND.textSecondary, marginBottom: 8 }}>Subtotal: {formatINR(totals.subtotal)}</div>
                {isInterstate ? (
                  <div style={{ fontSize: 14, color: BRAND.textSecondary, marginBottom: 8 }}>IGST: {formatINR(totals.igst)}</div>
                ) : (
                  <>
                    <div style={{ fontSize: 14, color: BRAND.textSecondary, marginBottom: 8 }}>CGST: {formatINR(totals.cgst)}</div>
                    <div style={{ fontSize: 14, color: BRAND.textSecondary, marginBottom: 8 }}>SGST: {formatINR(totals.sgst)}</div>
                  </>
                )}
                <div style={{ fontSize: 28, fontWeight: 900, color: BRAND.primary }}>Total: {formatINR(totals.total)}</div>
              </div>
            </div>
          </div>

          <button className="btn-primary" style={{ width: "100%", height: 60, fontSize: 18 }} onClick={() => setPreview(true)}>Generate Professional Invoice</button>
        </div>
      ) : (
        <div className="fade-in">
          <button className="btn-secondary no-print" onClick={() => setPreview(false)} style={{ marginBottom: 20 }}>← Back to Editor</button>
          <button className="btn-primary no-print" onClick={() => window.print()} style={{ marginBottom: 20, marginLeft: 10 }}>Download / Print PDF</button>
          
          <div className="invoice-print" style={{ background: "white", color: "black", padding: 60, borderRadius: 8, boxShadow: "0 10px 40px rgba(0,0,0,0.5)", fontFamily: "serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #000", paddingBottom: 30, marginBottom: 30 }}>
              <div>
                <h1 style={{ fontSize: 32, margin: 0, color: "#000" }}>TAX INVOICE</h1>
                <p style={{ marginTop: 10 }}><strong>No:</strong> {invoice.number}</p>
                <p><strong>Date:</strong> {invoice.date}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <h2 style={{ margin: 0 }}>{seller.name}</h2>
                <p style={{ maxWidth: 250, whiteSpace: "pre-wrap" }}>{seller.address}</p>
                <p><strong>GSTIN:</strong> {seller.gstin}</p>
                <p><strong>State:</strong> {seller.state}</p>
              </div>
            </div>

            <div style={{ marginBottom: 40 }}>
              <h4 style={{ textDecoration: "underline", marginBottom: 10 }}>BILL TO:</h4>
              <h3 style={{ margin: 0 }}>{buyer.name}</h3>
              <p style={{ maxWidth: 300, whiteSpace: "pre-wrap" }}>{buyer.address}</p>
              <p><strong>GSTIN:</strong> {buyer.gstin}</p>
              <p><strong>State:</strong> {buyer.state}</p>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 30 }}>
              <thead>
                <tr style={{ background: "#f5f5f5", borderBottom: "2px solid #000" }}>
                  <th style={{ padding: 12, textAlign: "left" }}>Description</th>
                  <th style={{ padding: 12 }}>HSN</th>
                  <th style={{ padding: 12 }}>Qty</th>
                  <th style={{ padding: 12 }}>Rate</th>
                  <th style={{ padding: 12 }}>GST</th>
                  <th style={{ padding: 12, textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: 12 }}>{item.desc}</td>
                    <td style={{ padding: 12, textAlign: "center" }}>{item.hsn}</td>
                    <td style={{ padding: 12, textAlign: "center" }}>{item.qty}</td>
                    <td style={{ padding: 12, textAlign: "center" }}>{parseFloat(item.rate).toFixed(2)}</td>
                    <td style={{ padding: 12, textAlign: "center" }}>{item.gst}%</td>
                    <td style={{ padding: 12, textAlign: "right" }}>{((parseFloat(item.qty)||0) * (parseFloat(item.rate)||0)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 40 }}>
              <div>
                <p><strong>Amount in Words:</strong><br />{numberToWords(totals.total)}</p>
                <div style={{ marginTop: 20, padding: 15, background: "#f9f9f9", borderRadius: 4 }}>
                  <h5 style={{ margin: "0 0 5px" }}>BANK DETAILS</h5>
                  <p style={{ margin: 0, fontSize: 13 }}>Bank: {seller.bank.name}<br />A/c: {seller.bank.acc}<br />IFSC: {seller.bank.ifsc}</p>
                </div>
                <div style={{ marginTop: 20 }}>
                  <h5 style={{ margin: "0 0 5px" }}>TERMS & CONDITIONS</h5>
                  <p style={{ margin: 0, fontSize: 12, whiteSpace: "pre-wrap" }}>{invoice.terms}</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ borderBottom: "1px solid #eee", padding: "10px 0", display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal</span><span>{formatINR(totals.subtotal)}</span>
                </div>
                {isInterstate ? (
                  <div style={{ borderBottom: "1px solid #eee", padding: "10px 0", display: "flex", justifyContent: "space-between" }}>
                    <span>IGST</span><span>{formatINR(totals.igst)}</span>
                  </div>
                ) : (
                  <>
                    <div style={{ borderBottom: "1px solid #eee", padding: "10px 0", display: "flex", justifyContent: "space-between" }}>
                      <span>CGST</span><span>{formatINR(totals.cgst)}</span>
                    </div>
                    <div style={{ borderBottom: "1px solid #eee", padding: "10px 0", display: "flex", justifyContent: "space-between" }}>
                      <span>SGST</span><span>{formatINR(totals.sgst)}</span>
                    </div>
                  </>
                )}
                <div style={{ padding: "20px 0", display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: "bold" }}>
                  <span>TOTAL</span><span>{formatINR(totals.total)}</span>
                </div>
                <div style={{ marginTop: 60 }}>
                  <div style={{ borderBottom: "1px solid #000", width: "100%", marginBottom: 10 }}></div>
                  <p style={{ margin: 0 }}><strong>Authorized Signatory</strong></p>
                  <p style={{ margin: 0, fontSize: 12 }}>for {seller.name}</p>
                </div>
              </div>
            </div>
            
            <p style={{ textAlign: "center", marginTop: 80, fontSize: 10, color: "#999" }}>Generated by ToolsWaala.in - Professional Business Kit</p>
          </div>
        </div>
      )}
    </div>
  );
}

function EstimateTool() {
  const [seller, setSeller] = useState({ name: "Your Business Name", address: "", phone: "", email: "" });
  const [buyer, setBuyer] = useState({ name: "", address: "", phone: "", email: "" });
  const [estimate, setEstimate] = useState({ number: `EST-${new Date().getFullYear()}-01`, date: today(), expiry: today(), terms: "1. This estimate is valid until the Expiry Date.\n2. Pricing is subject to change thereafter." });
  const [items, setItems] = useState([{ desc: "", qty: 1, rate: "", discount: 0, gst: 18 }]);
  const [preview, setPreview] = useState(false);

  const addItem = () => setItems(p => [...p, { desc: "", qty: 1, rate: "", discount: 0, gst: 18 }]);
  const removeItem = (i) => setItems(p => p.filter((_, idx) => idx !== i));
  const updateItem = (i, k, v) => setItems(p => p.map((item, idx) => idx === i ? { ...item, [k]: v } : item));

  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalGst = 0;
    
    items.forEach(item => {
      const amount = (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
      const discountAmt = amount * ((parseFloat(item.discount) || 0) / 100);
      const baseAfterDiscount = amount - discountAmt;
      const gstAmt = baseAfterDiscount * (item.gst / 100);
      
      subtotal += amount;
      totalDiscount += discountAmt;
      totalGst += gstAmt;
    });
    
    const netAmount = subtotal - totalDiscount;
    return { subtotal, totalDiscount, netAmount, totalGst, total: netAmount + totalGst };
  };

  const totals = calculateTotals();

  return (
    <div>
      {!preview ? (
        <div className="fade-in">
          <div className="grid-2" style={{ marginBottom: 24 }}>
            <div className="glass-card">
              <h3>Your Business Details</h3>
              <div className="form-group"><label>Business Name</label><input value={seller.name} onChange={e => setSeller({...seller, name: e.target.value})} /></div>
              <div className="form-group"><label>Address</label><textarea value={seller.address} onChange={e => setSeller({...seller, address: e.target.value})} /></div>
              <div className="form-group"><label>Phone</label><input value={seller.phone} onChange={e => setSeller({...seller, phone: e.target.value})} /></div>
              <div className="form-group"><label>Email</label><input value={seller.email} onChange={e => setSeller({...seller, email: e.target.value})} /></div>
            </div>
            <div className="glass-card">
              <h3>Client Information</h3>
              <div className="form-group"><label>Client Name</label><input value={buyer.name} onChange={e => setBuyer({...buyer, name: e.target.value})} /></div>
              <div className="form-group"><label>Address</label><textarea value={buyer.address} onChange={e => setBuyer({...buyer, address: e.target.value})} /></div>
              <div className="form-group"><label>Phone</label><input value={buyer.phone} onChange={e => setBuyer({...buyer, phone: e.target.value})} /></div>
              <div className="form-group"><label>Email</label><input value={buyer.email} onChange={e => setBuyer({...buyer, email: e.target.value})} /></div>
              
              <div style={{ marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 15 }}>
                <h4>Estimate Metadata</h4>
                <div className="form-group"><label>Estimate Number</label><input value={estimate.number} onChange={e => setEstimate({...estimate, number: e.target.value})} /></div>
                <div className="grid-2">
                  <div className="form-group"><label>Date</label><input type="date" value={estimate.date} onChange={e => setEstimate({...estimate, date: e.target.value})} /></div>
                  <div className="form-group"><label>Expiry Date</label><input type="date" value={estimate.expiry} onChange={e => setEstimate({...estimate, expiry: e.target.value})} style={{ borderColor: BRAND.accent }} /></div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ marginBottom: 24 }}>
            <h3>Line Items</h3>
            <div className="table-container">
              <table style={{ minWidth: 800 }}>
                <thead>
                  <tr>
                    <th style={{ width: "35%" }}>Description</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Discount %</th>
                    <th>GST %</th>
                    <th>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i}>
                      <td><input value={item.desc} onChange={e => updateItem(i, "desc", e.target.value)} placeholder="Product or Service" /></td>
                      <td><input type="number" value={item.qty} onChange={e => updateItem(i, "qty", e.target.value)} /></td>
                      <td><input type="number" value={item.rate} onChange={e => updateItem(i, "rate", e.target.value)} /></td>
                      <td><input type="number" value={item.discount} onChange={e => updateItem(i, "discount", e.target.value)} style={{ color: BRAND.accent }} /></td>
                      <td>
                        <select value={item.gst} onChange={e => updateItem(i, "gst", +e.target.value)}>
                          {GST_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
                        </select>
                      </td>
                      <td style={{ textAlign: "right", paddingRight: 20 }}>{(((parseFloat(item.qty)||0) * (parseFloat(item.rate)||0)) * (1 - ((parseFloat(item.discount)||0)/100))).toFixed(2)}</td>
                      <td><button className="btn-ghost" onClick={() => removeItem(i)} style={{ color: BRAND.danger }}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="btn-ghost" onClick={addItem} style={{ marginTop: 16 }}>+ Add Line Item</button>
          </div>

          <div className="glass-card" style={{ marginBottom: 24 }}>
            <div className="grid-2">
              <div className="form-group">
                <label>Customer Notes & Terms</label>
                <textarea value={estimate.terms} onChange={e => setEstimate({...estimate, terms: e.target.value})} rows={4} />
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, color: BRAND.textSecondary, marginBottom: 8 }}>Subtotal: {formatINR(totals.subtotal)}</div>
                <div style={{ fontSize: 14, color: BRAND.accent, marginBottom: 8 }}>Discount: -{formatINR(totals.totalDiscount)}</div>
                <div style={{ fontSize: 14, color: BRAND.textSecondary, marginBottom: 8 }}>GST: {formatINR(totals.totalGst)}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: BRAND.primary }}>Total: {formatINR(totals.total)}</div>
              </div>
            </div>
          </div>

          <button className="btn-primary" style={{ width: "100%", height: 60, fontSize: 18 }} onClick={() => setPreview(true)}>Generate Professional Estimate</button>
        </div>
      ) : (
        <div className="fade-in">
          <button className="btn-secondary no-print" onClick={() => setPreview(false)} style={{ marginBottom: 20 }}>← Back to Editor</button>
          <button className="btn-primary no-print" onClick={() => window.print()} style={{ marginBottom: 20, marginLeft: 10 }}>Download / Print PDF</button>
          
          <div className="invoice-print" style={{ background: "white", color: "black", padding: 60, borderRadius: 8, boxShadow: "0 10px 40px rgba(0,0,0,0.5)", fontFamily: "serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #000", paddingBottom: 30, marginBottom: 30 }}>
              <div>
                <h1 style={{ fontSize: 32, margin: 0, color: "#000" }}>TAX ESTIMATE</h1>
                <p style={{ marginTop: 10 }}><strong>Estimate #:</strong> {estimate.number}</p>
                <p><strong>Estimate Date:</strong> {estimate.date}</p>
                <p style={{ color: "#d32f2f", fontWeight: "bold" }}><strong>Expiry Date:</strong> {estimate.expiry}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <h2 style={{ margin: 0 }}>{seller.name}</h2>
                <p style={{ maxWidth: 250, whiteSpace: "pre-wrap" }}>{seller.address}</p>
                {seller.phone && <p><strong>Phone:</strong> {seller.phone}</p>}
                {seller.email && <p><strong>Email:</strong> {seller.email}</p>}
              </div>
            </div>

            <div style={{ marginBottom: 40 }}>
              <h4 style={{ textDecoration: "underline", marginBottom: 10 }}>BILL TO:</h4>
              <h3 style={{ margin: 0 }}>{buyer.name}</h3>
              <p style={{ maxWidth: 300, whiteSpace: "pre-wrap" }}>{buyer.address}</p>
              {buyer.phone && <p><strong>Phone:</strong> {buyer.phone}</p>}
              {buyer.email && <p><strong>Email:</strong> {buyer.email}</p>}
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 30 }}>
              <thead>
                <tr style={{ background: "#f5f5f5", borderBottom: "2px solid #000" }}>
                  <th style={{ padding: 12, textAlign: "left" }}>Description</th>
                  <th style={{ padding: 12 }}>Qty</th>
                  <th style={{ padding: 12 }}>Rate</th>
                  <th style={{ padding: 12 }}>Discount</th>
                  <th style={{ padding: 12 }}>GST</th>
                  <th style={{ padding: 12, textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => {
                  const amount = (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
                  const discountAmt = amount * ((parseFloat(item.discount) || 0) / 100);
                  const baseAfterDiscount = amount - discountAmt;
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: 12 }}>{item.desc}</td>
                      <td style={{ padding: 12, textAlign: "center" }}>{item.qty}</td>
                      <td style={{ padding: 12, textAlign: "center" }}>{parseFloat(item.rate).toFixed(2)}</td>
                      <td style={{ padding: 12, textAlign: "center", color: "#d32f2f" }}>{item.discount > 0 ? `${item.discount}%` : '-'}</td>
                      <td style={{ padding: 12, textAlign: "center" }}>{item.gst}%</td>
                      <td style={{ padding: 12, textAlign: "right" }}>{baseAfterDiscount.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 40 }}>
              <div>
                <p><strong>Amount in Words:</strong><br />{numberToWords(totals.total)}</p>
                <div style={{ marginTop: 20 }}>
                  <h5 style={{ margin: "0 0 5px" }}>TERMS & CONDITIONS</h5>
                  <p style={{ margin: 0, fontSize: 12, whiteSpace: "pre-wrap" }}>{estimate.terms}</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ borderBottom: "1px solid #eee", padding: "10px 0", display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal</span><span>{formatINR(totals.subtotal)}</span>
                </div>
                {totals.totalDiscount > 0 && (
                  <div style={{ borderBottom: "1px solid #eee", padding: "10px 0", display: "flex", justifyContent: "space-between", color: "#d32f2f" }}>
                    <span>Discount</span><span>-{formatINR(totals.totalDiscount)}</span>
                  </div>
                )}
                <div style={{ borderBottom: "1px solid #eee", padding: "10px 0", display: "flex", justifyContent: "space-between" }}>
                  <span>Total GST</span><span>{formatINR(totals.totalGst)}</span>
                </div>
                <div style={{ padding: "20px 0", display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: "bold" }}>
                  <span>TOTAL ESTIMATE</span><span>{formatINR(totals.total)}</span>
                </div>
                <div style={{ marginTop: 60 }}>
                  <div style={{ borderBottom: "1px solid #000", width: "100%", marginBottom: 10 }}></div>
                  <p style={{ margin: 0 }}><strong>Authorized Signatory</strong></p>
                  <p style={{ margin: 0, fontSize: 12 }}>for {seller.name}</p>
                </div>
              </div>
            </div>
            
            <p style={{ textAlign: "center", marginTop: 80, fontSize: 10, color: "#999" }}>Generated by ToolsWaala.in - Professional Business Kit</p>
          </div>
        </div>
      )}
    </div>
  );
}

function GstinVerifyTool() {
  const [gstin, setGstin] = useState("");
  const [result, setResult] = useState(null);

  const validate = () => {
    if (!gstin) return;
    const input = gstin.trim().toUpperCase();
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    
    if (!regex.test(input)) {
      setResult({ valid: false, message: "Invalid GSTIN Format. Must be 15 characters (e.g., 22AAAAA0000A1Z5)" });
      return;
    }

    const stateCode = parseInt(input.substring(0, 2), 10);
    if (stateCode < 1 || stateCode > 38) {
      setResult({ valid: false, message: "Invalid State Code in GSTIN." });
      return;
    }

    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let hash = 0;
    for (let i = 0; i < 14; i++) {
      let val = chars.indexOf(input[i]);
      let multiplier = (i % 2 !== 0) ? 2 : 1; 
      let prod = val * multiplier;
      let quotient = Math.floor(prod / 36);
      let remainder = prod % 36;
      hash = hash + quotient + remainder;
    }
    let checkCode = (36 - (hash % 36)) % 36;
    let expectedChar = chars[checkCode];

    if (expectedChar !== input[14]) {
      setResult({ valid: false, message: `Checksum failed. Expected last character to be '${expectedChar}'.` });
      return;
    }

    const states = {
      1: "Jammu and Kashmir", 2: "Himachal Pradesh", 3: "Punjab", 4: "Chandigarh", 5: "Uttarakhand",
      6: "Haryana", 7: "Delhi", 8: "Rajasthan", 9: "Uttar Pradesh", 10: "Bihar", 11: "Sikkim",
      12: "Arunachal Pradesh", 13: "Nagaland", 14: "Manipur", 15: "Mizoram", 16: "Tripura",
      17: "Meghalaya", 18: "Assam", 19: "West Bengal", 20: "Jharkhand", 21: "Odisha", 22: "Chhattisgarh",
      23: "Madhya Pradesh", 24: "Gujarat", 25: "Daman and Diu", 26: "Dadra and Nagar Haveli",
      27: "Maharashtra", 28: "Andhra Pradesh (Old)", 29: "Karnataka", 30: "Goa", 31: "Lakshadweep",
      32: "Kerala", 33: "Tamil Nadu", 34: "Puducherry", 35: "Andaman and Nicobar Islands",
      36: "Telangana", 37: "Andhra Pradesh", 38: "Ladakh"
    };

    setResult({
      valid: true,
      state: states[stateCode] || "Unknown",
      pan: input.substring(2, 12),
      entityNum: input[12]
    });
  };

  return (
    <div className="grid-2">
      <div className="glass-card">
        <div className="form-group">
          <label>Enter GSTIN</label>
          <input 
            value={gstin} 
            onChange={e => setGstin(e.target.value.toUpperCase())} 
            placeholder="e.g. 27AADCB2230M1Z2" 
            maxLength={15}
          />
        </div>
        <button className="btn-primary" style={{ width: "100%" }} onClick={validate}>Verify GSTIN</button>
      </div>
      
      {result && (
        <div className="result-box fade-in">
          {result.valid ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(34,197,94,0.2)", color: BRAND.success, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✓</div>
                <div>
                  <h3 style={{ color: BRAND.success }}>Mathematically Valid</h3>
                  <div style={{ fontSize: 12, color: BRAND.textSecondary }}>Checksum verification passed</div>
                </div>
              </div>
              <div style={{ display: "grid", gap: 16 }}>
                <div style={{ background: "rgba(0,0,0,0.2)", padding: 12, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: BRAND.textSecondary, textTransform: "uppercase" }}>PAN Number</div>
                  <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1 }}>{result.pan}</div>
                </div>
                <div style={{ background: "rgba(0,0,0,0.2)", padding: 12, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: BRAND.textSecondary, textTransform: "uppercase" }}>Registered State</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{result.state}</div>
                </div>
                <div style={{ background: "rgba(0,0,0,0.2)", padding: 12, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: BRAND.textSecondary, textTransform: "uppercase" }}>Entity Number</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{result.entityNum} (Registration Count)</div>
                </div>
              </div>
              <div style={{ marginTop: 20, fontSize: 11, color: BRAND.textSecondary, textAlign: "center" }}>Note: This verifies the mathematical structure. To check active status, visit the official portal.</div>
            </div>
          ) : (
            <div style={{ textAlign: "center", color: BRAND.danger }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>⚠️</div>
              <h3>Invalid GSTIN</h3>
              <p style={{ marginTop: 10, fontSize: 14 }}>{result.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function QrTool() {
  const [input, setInput] = useState("https://toolswaala.in");
  const [options, setOptions] = useState({
    width: 300,
    height: 300,
    type: "svg",
    data: "https://toolswaala.in",
    margin: 10,
    qrOptions: { typeNumber: 0, mode: "Byte", errorCorrectionLevel: "Q" },
    imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 10, crossOrigin: "anonymous" },
    dotsOptions: { color: "#FF6B00", type: "rounded" },
    backgroundOptions: { color: "#ffffff" },
    cornersSquareOptions: { color: "#FF6B00", type: "extra-rounded" },
    cornersDotOptions: { color: "#FF6B00", type: "dot" }
  });
  const [qrCode, setQrCode] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (window.QRCodeStyling) {
      const qr = new window.QRCodeStyling(options);
      setQrCode(qr);
      if (ref.current) {
        qr.append(ref.current);
      }
    }
  }, []);

  useEffect(() => {
    if (!qrCode) return;
    qrCode.update({
      ...options,
      data: input || "https://toolswaala.in"
    });
  }, [input, options, qrCode]);

  const onDownload = () => {
    if (!qrCode) return;
    qrCode.download({ name: "toolswaala-qr", extension: "png" });
  };

  return (
    <div className="grid-2">
      <div className="glass-card">
        <div className="form-group">
          <label>QR Data (Link, UPI, etc.)</label>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="https://example.com" />
        </div>
        
        <div className="divider" style={{ margin: "16px 0" }}></div>
        
        <h3 style={{ fontSize: 14, marginBottom: 16 }}>Design Settings</h3>
        
        <div className="form-group">
          <label>Dot Style</label>
          <select value={options.dotsOptions.type} onChange={e => setOptions(p => ({ ...p, dotsOptions: { ...p.dotsOptions, type: e.target.value } }))}>
            <option value="square">Square</option>
            <option value="dots">Dots</option>
            <option value="rounded">Rounded</option>
            <option value="extra-rounded">Extra Rounded</option>
            <option value="classy">Classy</option>
            <option value="classy-rounded">Classy Rounded</option>
          </select>
        </div>

        <div className="grid-2" style={{ gap: 12 }}>
          <div className="form-group">
            <label>QR Color</label>
            <input type="color" value={options.dotsOptions.color} onChange={e => {
              const color = e.target.value;
              setOptions(p => ({ 
                ...p, 
                dotsOptions: { ...p.dotsOptions, color },
                cornersSquareOptions: { ...p.cornersSquareOptions, color },
                cornersDotOptions: { ...p.cornersDotOptions, color }
              }));
            }} />
          </div>
          <div className="form-group">
            <label>Background</label>
            <input type="color" value={options.backgroundOptions.color} onChange={e => setOptions(p => ({ ...p, backgroundOptions: { ...p.backgroundOptions, color: e.target.value } }))} />
          </div>
        </div>

        <div className="form-group">
          <label>Corner Shape</label>
          <select value={options.cornersSquareOptions.type} onChange={e => setOptions(p => ({ ...p, cornersSquareOptions: { ...p.cornersSquareOptions, type: e.target.value } }))}>
            <option value="square">Square</option>
            <option value="dot">Dot</option>
            <option value="extra-rounded">Rounded</option>
          </select>
        </div>

        <button className="btn-primary" style={{ width: "100%", marginTop: 10 }} onClick={onDownload}>Download PNG</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div className="glass-card" style={{ padding: 20, background: options.backgroundOptions.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div ref={ref} />
        </div>
        <p style={{ marginTop: 16, fontSize: 12, color: BRAND.textSecondary, textAlign: "center" }}>
          Scan to test scannability. <br/> Works with all QR readers.
        </p>
      </div>
    </div>
  );
}

function EmiTool() {
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(9.5);
  const [tenure, setTenure] = useState(60);
  const monthlyRate = rate / (12 * 100);
  const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
  return (
    <div className="grid-2">
      <div className="glass-card">
        <div className="form-group"><label>Amount: {formatINR(amount)}</label><input type="range" min="50000" max="10000000" step="50000" value={amount} onChange={e => setAmount(+e.target.value)} /></div>
        <div className="form-group"><label>Rate: {rate}%</label><input type="range" min="5" max="30" step="0.1" value={rate} onChange={e => setRate(+e.target.value)} /></div>
        <div className="form-group"><label>Tenure: {tenure} Mo</label><input type="range" min="6" max="360" value={tenure} onChange={e => setTenure(+e.target.value)} /></div>
      </div>
      <div className="result-box">
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 14 }}>Monthly EMI</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: BRAND.primary }}>{formatINR(emi)}</div>
        </div>
      </div>
    </div>
  );
}

function GstCalcTool() {
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState(18);
  const [mode, setMode] = useState("add");
  const numAmount = parseFloat(amount) || 0;
  const base = mode === "add" ? numAmount : numAmount / (1 + gstRate / 100);
  const gst = base * (gstRate / 100);
  return (
    <div className="grid-2">
      <div className="glass-card">
        <div className="form-group"><label>Amount</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} /></div>
        <div className="form-group"><label>Rate</label><div style={{ display: "flex", gap: 10 }}>{GST_RATES.map(r => <button key={r} onClick={() => setGstRate(r)} style={{ padding: 10, background: gstRate === r ? BRAND.primary : "transparent", border: "1px solid rgba(255,255,255,0.1)" }}>{r}%</button>)}</div></div>
        <div style={{ display: "flex", gap: 10 }}><button onClick={() => setMode("add")} className="btn-secondary">Add</button><button onClick={() => setMode("remove")} className="btn-secondary">Remove</button></div>
      </div>
      <div className="result-box"><div style={{ fontSize: 32 }}>Total: {formatINR(mode === "add" ? numAmount + gst : base)}</div><div style={{ fontSize: 14, marginTop: 10 }}>GST: {formatINR(gst)}</div></div>
    </div>
  );
}

function LegalHubTool() {
  const [docType, setDocType] = useState("rent");
  const [preview, setPreview] = useState(false);

  // Shared state for all forms
  const [party1, setParty1] = useState({ name: "", address: "" }); // Landlord / Disclosing Party / Client
  const [party2, setParty2] = useState({ name: "", address: "" }); // Tenant / Receiving Party / Agency
  const [details, setDetails] = useState({
    amount: "",
    duration: "11",
    state: "Maharashtra",
    date: today(),
    purpose: "", // For NDA/MSA
  });

  const renderForm = () => {
    return (
      <div className="fade-in">
        <div style={{ display: "flex", gap: 10, marginBottom: 24, overflowX: "auto", paddingBottom: 5 }}>
          <button onClick={() => setDocType("rent")} className={docType === "rent" ? "btn-primary" : "btn-secondary"}>🏠 Rent Agreement</button>
          <button onClick={() => setDocType("nda")} className={docType === "nda" ? "btn-primary" : "btn-secondary"}>🤫 Non-Disclosure (NDA)</button>
          <button onClick={() => setDocType("msa")} className={docType === "msa" ? "btn-primary" : "btn-secondary"}>🤝 Master Service (MSA)</button>
        </div>

        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="glass-card">
            <h3>{docType === "rent" ? "Landlord" : docType === "nda" ? "Disclosing Party" : "Client"}</h3>
            <div className="form-group"><label>Full Name / Company Name</label><input value={party1.name} onChange={e => setParty1({...party1, name: e.target.value})} /></div>
            <div className="form-group"><label>Address / Registered Office</label><textarea value={party1.address} onChange={e => setParty1({...party1, address: e.target.value})} /></div>
          </div>
          <div className="glass-card">
            <h3>{docType === "rent" ? "Tenant" : docType === "nda" ? "Receiving Party" : "Service Provider"}</h3>
            <div className="form-group"><label>Full Name / Company Name</label><input value={party2.name} onChange={e => setParty2({...party2, name: e.target.value})} /></div>
            <div className="form-group"><label>Address / Registered Office</label><textarea value={party2.address} onChange={e => setParty2({...party2, address: e.target.value})} /></div>
          </div>
        </div>

        <div className="glass-card" style={{ marginBottom: 24 }}>
          <h3>Agreement Specifics</h3>
          <div className="grid-2">
            <div className="form-group"><label>Execution Date</label><input type="date" value={details.date} onChange={e => setDetails({...details, date: e.target.value})} /></div>
            <div className="form-group"><label>Jurisdiction State</label><select value={details.state} onChange={e => setDetails({...details, state: e.target.value})}>{["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat", "Uttar Pradesh"].map(s => <option key={s}>{s}</option>)}</select></div>
            
            {docType === "rent" && (
              <>
                <div className="form-group"><label>Monthly Rent (₹)</label><input type="number" value={details.amount} onChange={e => setDetails({...details, amount: e.target.value})} /></div>
                <div className="form-group"><label>Duration (Months)</label><input type="number" value={details.duration} onChange={e => setDetails({...details, duration: e.target.value})} /></div>
              </>
            )}

            {(docType === "nda" || docType === "msa") && (
              <div className="form-group"><label>Purpose / Scope of Work</label><input value={details.purpose} onChange={e => setDetails({...details, purpose: e.target.value})} placeholder={docType === "nda" ? "e.g., Software Development Discussions" : "e.g., Web Design Services"} /></div>
            )}
            {docType === "msa" && (
               <div className="form-group"><label>Total Contract Value (₹)</label><input type="number" value={details.amount} onChange={e => setDetails({...details, amount: e.target.value})} /></div>
            )}
          </div>
        </div>

        <button className="btn-primary" style={{ width: "100%" }} onClick={() => setPreview(true)}>Generate Legal Draft</button>
      </div>
    );
  };

  const renderRent = () => (
    <>
      <h2 style={{ textAlign: "center", textDecoration: "underline", marginBottom: 30 }}>RENTAL AGREEMENT</h2>
      <p>This agreement is made and executed on <strong>{details.date}</strong> at <strong>{details.state}</strong>.</p>
      <p><strong>BETWEEN:</strong></p>
      <p><strong>{party1.name || "[Landlord Name]"}</strong>, residing at {party1.address || "[Address]"}, hereinafter referred to as the <strong>"Landlord"</strong>.</p>
      <p><strong>AND:</strong></p>
      <p><strong>{party2.name || "[Tenant Name]"}</strong>, residing at {party2.address || "[Address]"}, hereinafter referred to as the <strong>"Tenant"</strong>.</p>
      <h4 style={{ marginTop: 20 }}>1. PREMISES</h4>
      <p>The Landlord hereby agrees to let out and the Tenant agrees to take on rent the schedule property located at {party1.address || "[Property Address]"}.</p>
      <h4 style={{ marginTop: 20 }}>2. RENT AND DURATION</h4>
      <p>The monthly rent shall be <strong>₹{details.amount || "[Amount]"}</strong>, payable on or before the 5th day of each calendar month. The lease is granted for a period of <strong>{details.duration}</strong> months.</p>
      <h4 style={{ marginTop: 20 }}>3. GOVERNING LAW</h4>
      <p>This agreement shall be governed by the laws of India and subject to the jurisdiction of the courts in <strong>{details.state}</strong>.</p>
    </>
  );

  const renderNda = () => (
    <>
      <h2 style={{ textAlign: "center", textDecoration: "underline", marginBottom: 30 }}>NON-DISCLOSURE AGREEMENT</h2>
      <p>This Non-Disclosure Agreement (the "Agreement") is entered into on <strong>{details.date}</strong>.</p>
      <p><strong>BY AND BETWEEN:</strong></p>
      <p><strong>{party1.name || "[Disclosing Party]"}</strong>, having its registered office at {party1.address || "[Address]"}, hereinafter referred to as the <strong>"Disclosing Party"</strong>.</p>
      <p><strong>AND:</strong></p>
      <p><strong>{party2.name || "[Receiving Party]"}</strong>, having its registered office at {party2.address || "[Address]"}, hereinafter referred to as the <strong>"Receiving Party"</strong>.</p>
      <h4 style={{ marginTop: 20 }}>1. PURPOSE</h4>
      <p>The parties intend to explore a potential business relationship concerning <strong>{details.purpose || "[Purpose of Disclosure]"}</strong> (the "Purpose"). In connection with the Purpose, the Disclosing Party may disclose certain Confidential Information to the Receiving Party.</p>
      <h4 style={{ marginTop: 20 }}>2. OBLIGATIONS OF RECEIVING PARTY</h4>
      <p>The Receiving Party shall hold and maintain the Confidential Information in strictest confidence for the sole and exclusive benefit of the Disclosing Party. The Receiving Party shall restrict access to Confidential Information to employees, contractors, and third parties as is reasonably required.</p>
      <h4 style={{ marginTop: 20 }}>3. GOVERNING LAW AND JURISDICTION</h4>
      <p>This Agreement shall be governed in accordance with the Indian Contract Act, 1872, and subject to the exclusive jurisdiction of the courts in <strong>{details.state}</strong>.</p>
    </>
  );

  const renderMsa = () => (
    <>
      <h2 style={{ textAlign: "center", textDecoration: "underline", marginBottom: 30 }}>MASTER SERVICE AGREEMENT</h2>
      <p>This Master Service Agreement (the "Agreement") is executed on <strong>{details.date}</strong>.</p>
      <p><strong>BY AND BETWEEN:</strong></p>
      <p><strong>{party1.name || "[Client]"}</strong>, having its registered office at {party1.address || "[Address]"}, hereinafter referred to as the <strong>"Client"</strong>.</p>
      <p><strong>AND:</strong></p>
      <p><strong>{party2.name || "[Service Provider]"}</strong>, having its registered office at {party2.address || "[Address]"}, hereinafter referred to as the <strong>"Service Provider"</strong>.</p>
      <h4 style={{ marginTop: 20 }}>1. SCOPE OF SERVICES</h4>
      <p>The Service Provider agrees to perform and deliver the services relating to <strong>{details.purpose || "[Scope of Work]"}</strong> as requested by the Client.</p>
      <h4 style={{ marginTop: 20 }}>2. COMPENSATION AND PAYMENT TERMS</h4>
      <p>In consideration of the services, the Client shall pay the Service Provider a total sum of <strong>₹{details.amount || "[Amount]"}</strong>. All payments shall be subject to applicable statutory deductions including Tax Deducted at Source (TDS) under the Income Tax Act, 1961.</p>
      <h4 style={{ marginTop: 20 }}>3. INDEPENDENT CONTRACTOR</h4>
      <p>The relationship of the Service Provider to the Client is that of an independent contractor, and nothing contained in this Agreement shall be construed to give either party the power to direct and control the day-to-day activities of the other.</p>
      <h4 style={{ marginTop: 20 }}>4. DISPUTE RESOLUTION</h4>
      <p>Any disputes arising out of this Agreement shall be subject to the exclusive jurisdiction of the competent courts in <strong>{details.state}</strong>.</p>
    </>
  );

  return (
    <div>
      {!preview ? renderForm() : (
        <div className="fade-in">
          <button className="btn-secondary no-print" onClick={() => setPreview(false)} style={{ marginBottom: 20 }}>← Edit Details</button>
          <div style={{ background: "white", color: "black", padding: 60, minHeight: 800, fontFamily: "Times New Roman, serif", lineHeight: 1.6, borderRadius: 8 }}>
            {docType === "rent" ? renderRent() : docType === "nda" ? renderNda() : renderMsa()}
            
            <div style={{ marginTop: 100, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
              <div>
                <div style={{ borderBottom: "1px solid #000", width: "80%", marginBottom: 10 }}></div>
                <strong>{party1.name || (docType === "rent" ? "Landlord" : docType === "nda" ? "Disclosing Party" : "Client")}</strong>
                <div style={{ fontSize: 12, marginTop: 5 }}>Authorized Signatory</div>
              </div>
              <div>
                <div style={{ borderBottom: "1px solid #000", width: "80%", marginBottom: 10 }}></div>
                <strong>{party2.name || (docType === "rent" ? "Tenant" : docType === "nda" ? "Receiving Party" : "Service Provider")}</strong>
                <div style={{ fontSize: 12, marginTop: 5 }}>Authorized Signatory</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SalaryTool() {
  const [company, setCompany] = useState({ name: "Acme India Pvt Ltd" });
  const [emp, setEmp] = useState({ name: "", designation: "Software Engineer" });
  const [ctc, setCtc] = useState("600000");
  const [preview, setPreview] = useState(false);

  // Calculations based on Indian standard practices
  const numCtc = parseFloat(ctc) || 0;
  
  // CTC Breakdown (Yearly)
  const basicYearly = numCtc * 0.50; // Standard 50% basic
  const hraYearly = basicYearly * 0.40; // Non-metro 40%
  const employerPfYearly = Math.min(basicYearly * 0.12, 21600); // 12% of basic or capped at 1800/mo
  const specialYearly = Math.max(0, numCtc - basicYearly - hraYearly - employerPfYearly);
  
  const grossYearly = basicYearly + hraYearly + specialYearly;

  // Deductions (Yearly)
  const standardDeduction = 75000; // FY 24-25 New Regime
  const employeePfYearly = employerPfYearly; // Matching
  const ptYearly = 2400; // ₹200/mo typical

  // TDS Calculation (New Regime 24-25)
  const taxableIncome = Math.max(0, grossYearly - standardDeduction);
  let taxYearly = 0;
  
  if (taxableIncome > 300000) {
    if (taxableIncome <= 700000) taxYearly = (taxableIncome - 300000) * 0.05;
    else if (taxableIncome <= 1000000) taxYearly = 20000 + (taxableIncome - 700000) * 0.10;
    else if (taxableIncome <= 1200000) taxYearly = 50000 + (taxableIncome - 1000000) * 0.15;
    else if (taxableIncome <= 1500000) taxYearly = 80000 + (taxableIncome - 1200000) * 0.20;
    else taxYearly = 140000 + (taxableIncome - 1500000) * 0.30;
  }
  
  // Section 87A Rebate
  if (taxableIncome <= 700000) taxYearly = 0;
  else taxYearly = taxYearly * 1.04; // 4% Health & Education Cess

  // Monthly Values for Slip
  const basic = basicYearly / 12;
  const hra = hraYearly / 12;
  const special = specialYearly / 12;
  const gross = grossYearly / 12;
  const pf = employeePfYearly / 12;
  const pt = ptYearly / 12;
  const tds = taxYearly / 12;
  const totalDeductions = pf + pt + tds;
  const netPay = gross - totalDeductions;

  return (
    <div>
      {!preview ? (
        <div className="grid-2">
          <div className="glass-card">
            <h3>Employee Details</h3>
            <div className="form-group"><label>Company Name</label><input value={company.name} onChange={e => setCompany({...company, name: e.target.value})} /></div>
            <div className="form-group"><label>Employee Name</label><input value={emp.name} onChange={e => setEmp({...emp, name: e.target.value})} /></div>
            <div className="form-group"><label>Designation</label><input value={emp.designation} onChange={e => setEmp({...emp, designation: e.target.value})} /></div>
          </div>
          <div className="glass-card">
            <h3>CTC & Tax Settings</h3>
            <div className="form-group"><label>Yearly CTC (₹)</label><input type="number" value={ctc} onChange={e => setCtc(e.target.value)} /></div>
            <div style={{ background: "rgba(0,0,0,0.3)", padding: 16, borderRadius: 12, marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: BRAND.textSecondary, marginBottom: 12 }}>Tax Regime Settings</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
                <span>Standard Deduction</span>
                <span>₹75,000 (FY 24-25)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span>Rebate u/s 87A</span>
                <span>Up to ₹7L Income</span>
              </div>
            </div>
            <button className="btn-primary" style={{ width: "100%" }} onClick={() => setPreview(true)}>Generate Compliant Slip</button>
          </div>
        </div>
      ) : (
        <div className="fade-in">
          <button className="btn-secondary no-print" onClick={() => setPreview(false)} style={{ marginBottom: 20 }}>← Edit Details</button>
          <div style={{ background: "white", color: "black", padding: 60, borderRadius: 8 }}>
            <div style={{ textAlign: "center", marginBottom: 40, borderBottom: "2px solid #000", paddingBottom: 20 }}>
              <h1 style={{ fontSize: 24, margin: 0 }}>{company.name || "[Company Name]"}</h1>
              <p style={{ margin: "5px 0 0", color: "#555" }}>Payslip for the month of {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 40 }}>
              <div>
                <p><strong>Employee Name:</strong> {emp.name || "[Employee Name]"}</p>
                <p><strong>Designation:</strong> {emp.designation}</p>
              </div>
              <div>
                <p><strong>Working Days:</strong> 30</p>
                <p><strong>Paid Days:</strong> 30</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid #000" }}>
              {/* Earnings Column */}
              <div style={{ borderRight: "1px solid #000" }}>
                <div style={{ padding: "10px 15px", background: "#f5f5f5", borderBottom: "1px solid #000", fontWeight: "bold", display: "flex", justifyContent: "space-between" }}>
                  <span>Earnings</span><span>Amount (₹)</span>
                </div>
                <div style={{ padding: "10px 15px", display: "flex", justifyContent: "space-between" }}><span>Basic</span><span>{basic.toFixed(2)}</span></div>
                <div style={{ padding: "10px 15px", display: "flex", justifyContent: "space-between" }}><span>House Rent Allowance</span><span>{hra.toFixed(2)}</span></div>
                <div style={{ padding: "10px 15px", display: "flex", justifyContent: "space-between" }}><span>Special Allowance</span><span>{special.toFixed(2)}</span></div>
                <div style={{ padding: "10px 15px", borderTop: "1px solid #000", fontWeight: "bold", display: "flex", justifyContent: "space-between" }}>
                  <span>Gross Earnings (A)</span><span>{gross.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Deductions Column */}
              <div>
                <div style={{ padding: "10px 15px", background: "#f5f5f5", borderBottom: "1px solid #000", fontWeight: "bold", display: "flex", justifyContent: "space-between" }}>
                  <span>Deductions</span><span>Amount (₹)</span>
                </div>
                <div style={{ padding: "10px 15px", display: "flex", justifyContent: "space-between" }}><span>Provident Fund (PF)</span><span>{pf.toFixed(2)}</span></div>
                <div style={{ padding: "10px 15px", display: "flex", justifyContent: "space-between" }}><span>Professional Tax</span><span>{pt.toFixed(2)}</span></div>
                <div style={{ padding: "10px 15px", display: "flex", justifyContent: "space-between" }}><span>Income Tax (TDS)</span><span>{tds.toFixed(2)}</span></div>
                <div style={{ padding: "10px 15px", borderTop: "1px solid #000", fontWeight: "bold", display: "flex", justifyContent: "space-between" }}>
                  <span>Total Deductions (B)</span><span>{totalDeductions.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20, padding: 20, background: "#f9f9f9", border: "1px solid #000", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: "bold", fontSize: 18 }}>NET PAY (A - B)</div>
              <div style={{ fontWeight: "bold", fontSize: 24 }}>₹ {netPay.toFixed(2)}</div>
            </div>
            
            <p style={{ textAlign: "center", marginTop: 40, fontSize: 12, color: "#666" }}>This is a computer generated document and does not require a signature.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function GstCalcTool() {
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState(18);
  const [calcMode, setCalcMode] = useState("ADD"); // "ADD" or "REMOVE"

  const calculateGst = () => {
    const baseAmount = parseFloat(amount) || 0;
    const rate = parseFloat(gstRate) || 0;
    
    if (calcMode === "ADD") {
      const gstAmount = baseAmount * (rate / 100);
      const netAmount = baseAmount;
      const totalAmount = baseAmount + gstAmount;
      return { gstAmount, netAmount, totalAmount, cgst: gstAmount / 2, sgst: gstAmount / 2 };
    } else {
      const totalAmount = baseAmount;
      const netAmount = baseAmount / (1 + (rate / 100));
      const gstAmount = totalAmount - netAmount;
      return { gstAmount, netAmount, totalAmount, cgst: gstAmount / 2, sgst: gstAmount / 2 };
    }
  };

  const { gstAmount, netAmount, totalAmount, cgst, sgst } = calculateGst();

  return (
    <div className="grid-2">
      <div className="glass-card">
        <div style={{ display: "flex", gap: 10, marginBottom: 24, background: "rgba(255,255,255,0.05)", padding: 6, borderRadius: 12 }}>
          <button 
            style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: "bold", background: calcMode === "ADD" ? BRAND.primary : "transparent", color: calcMode === "ADD" ? "#fff" : BRAND.textSecondary }}
            onClick={() => setCalcMode("ADD")}
          >
            Add GST (Exclusive)
          </button>
          <button 
            style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: "bold", background: calcMode === "REMOVE" ? BRAND.primary : "transparent", color: calcMode === "REMOVE" ? "#fff" : BRAND.textSecondary }}
            onClick={() => setCalcMode("REMOVE")}
          >
            Remove GST (Inclusive)
          </button>
        </div>

        <div className="form-group">
          <label>Amount (₹)</label>
          <input 
            type="number" 
            placeholder="e.g. 10000" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            style={{ fontSize: 24, fontWeight: "bold", padding: "16px", textAlign: "right" }}
          />
        </div>

        <div className="form-group" style={{ marginTop: 24 }}>
          <label>GST Rate</label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
            {[3, 5, 12, 18, 28].map(rate => (
              <button
                key={rate}
                onClick={() => setGstRate(rate)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 20,
                  border: `1px solid ${gstRate === rate ? BRAND.primary : "rgba(255,255,255,0.1)"}`,
                  background: gstRate === rate ? "rgba(255,107,0,0.1)" : "transparent",
                  color: gstRate === rate ? BRAND.primary : BRAND.text,
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h3 style={{ textAlign: "center", marginBottom: 30, color: BRAND.textSecondary }}>Calculation Summary</h3>
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15, paddingBottom: 15, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontSize: 16, color: BRAND.textSecondary }}>Net Amount (Base)</span>
          <span style={{ fontSize: 18, fontWeight: "bold" }}>{formatINR(netAmount)}</span>
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
          <span style={{ fontSize: 16, color: BRAND.textSecondary }}>Total GST Amount</span>
          <span style={{ fontSize: 18, fontWeight: "bold" }}>{formatINR(gstAmount)}</span>
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, padding: "10px 15px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
          <div style={{ textAlign: "center", flex: 1, borderRight: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize: 12, color: BRAND.textSecondary, marginBottom: 4 }}>CGST ({(gstRate/2).toFixed(1)}%)</div>
            <div style={{ fontWeight: "bold" }}>{formatINR(cgst)}</div>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 12, color: BRAND.textSecondary, marginBottom: 4 }}>SGST ({(gstRate/2).toFixed(1)}%)</div>
            <div style={{ fontWeight: "bold" }}>{formatINR(sgst)}</div>
          </div>
        </div>

        <div style={{ marginTop: "auto", background: "rgba(255,107,0,0.1)", padding: 24, borderRadius: 12, textAlign: "center", border: `1px solid rgba(255,107,0,0.2)` }}>
          <div style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: BRAND.primary, marginBottom: 8 }}>Total Gross Amount</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#fff" }}>{formatINR(totalAmount)}</div>
        </div>
      </div>
    </div>
  );
}

function BizNameTool() {
  const [industry, setIndustry] = useState("");
  const [keywords, setKeywords] = useState("");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const generate = async () => {
    if (!industry || !keywords) return;
    setLoading(true);
    setResults([]);
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/business-names`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, keywords, language }),
      });
      const data = await response.json();
      setResults(data.names || []);
    } catch (e) {
      alert("Failed to generate names. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid-2">
      <div className="glass-card">
        <div className="form-group"><label>Industry</label><input value={industry} onChange={e => setIndustry(e.target.value)} /></div>
        <div className="form-group"><label>Keywords</label><textarea value={keywords} onChange={e => setKeywords(e.target.value)} /></div>
        <button className="btn-primary" style={{ width: "100%" }} onClick={generate} disabled={loading}>{loading ? "AI is generating..." : "Generate Names ✨"}</button>
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        {results.map((r, i) => (
          <div key={i} className="glass-card fade-in" style={{ borderLeft: `4px solid ${BRAND.primary}` }}>
            <h4>{r.name}</h4>
            <p style={{ fontSize: 12, color: BRAND.textSecondary }}>{r.tagline}</p>
          </div>
        ))}
        {loading && <div className="spinner" style={{ width: 40, height: 40, border: "4px solid rgba(255,107,0,0.1)", borderTopColor: BRAND.primary, borderRadius: "50%", margin: "40px auto" }} />}
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [page, setPage] = useState("home");
  const toolPages = { upi: { title: "UPI Payment Page", hindi: "पेमेंट पेज", component: <UpiTool /> }, "gst-invoice": { title: "GST Invoice", hindi: "चालान", component: <GstInvoiceTool /> }, estimate: { title: "Estimate Generator", hindi: "अनुमान", component: <EstimateTool /> }, "gstin-verify": { title: "GSTIN Verifier", hindi: "जीएसटीएन सत्यापन", component: <GstinVerifyTool /> }, qr: { title: "QR Generator", hindi: "क्यूआर", component: <QrTool /> }, emi: { title: "EMI Calculator", hindi: "ईएमआई", component: <EmiTool /> }, "gst-calc": { title: "GST Calculator", hindi: "जीएसटी", component: <GstCalcTool /> }, legal: { title: "Legal Hub", hindi: "कानूनी दस्तावेज़", component: <LegalHubTool /> }, salary: { title: "Payroll & Salary Engine", hindi: "वेतन पर्ची", component: <SalaryTool /> }, bizname: { title: "AI Business Names", hindi: "बिज़नेस नाम", component: <BizNameTool /> } };

  return (
    <>
      <style>{globalStyle}</style>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", width: "100vw", overflowX: "hidden" }}>
        <Navbar active={page} setPage={setPage} />
        <main style={{ flex: 1 }}>
          {page === "home" ? <HomePage setPage={setPage} /> : toolPages[page] ? <PageWrapper title={toolPages[page].title} hindi={toolPages[page].hindi} setPage={setPage}>{toolPages[page].component}</PageWrapper> : null}
        </main>
        <Footer setPage={setPage} />
      </div>
    </>
  );
}
