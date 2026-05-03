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
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@300;400;500;600;700&display=swap');

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
  { id: "qr", name: "QR Code Generator", hindi: "क्यूआर कोड", icon: "▣", desc: "Custom QR codes for URL, UPI, WhatsApp & more", color: "#2196F3" },
  { id: "emi", name: "EMI Calculator", hindi: "ईएमआई कैलकुलेटर", icon: "🏦", desc: "Home, car, personal & business loan EMI", color: "#9C27B0" },
  { id: "gst-calc", name: "GST Calculator", hindi: "जीएसटी कैलकुलेटर", icon: "🧮", desc: "Add or remove GST instantly with HSN lookup", color: "#F44336" },
  { id: "rent", name: "Rent Agreement", hindi: "किराया समझौता", icon: "🏠", desc: "11-month rent agreement PDF generator", color: "#FF9800" },
  { id: "salary", name: "Salary Slip", hindi: "वेतन पर्ची", icon: "💼", desc: "Professional Indian format salary slip PDF", color: "#009688" },
  { id: "bizname", name: "Business Name AI", hindi: "व्यापार नाम एआई", icon: "✨", desc: "AI-powered business name suggestions", color: "#E91E63" },
];

function Navbar({ active, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{ background: "rgba(9, 9, 11, 0.8)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.05)", width: "100vw" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} onClick={() => setPage("home")}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: BRAND.primary, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color: "white", boxShadow: "0 0 20px rgba(255,107,0,0.3)" }}>TW</div>
          <div>
            <div style={{ color: "white", fontWeight: 800, fontSize: 18, lineHeight: 1, letterSpacing: "-0.02em" }}>ToolsWaala</div>
            <div style={{ color: BRAND.accent, fontSize: 10, lineHeight: 1.3, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Business Kit</div>
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
  const [seller, setSeller] = useState({ name: "", gstin: "", address: "", state: "Maharashtra", phone: "" });
  const [buyer, setBuyer] = useState({ name: "", gstin: "", address: "", state: "Maharashtra", phone: "" });
  const [invoiceNo, setInvoiceNo] = useState(`INV-${new Date().getFullYear()}-001`);
  const [invoiceDate, setInvoiceDate] = useState(today());
  const [items, setItems] = useState([{ desc: "", qty: 1, rate: "", gst: 18 }]);
  const [preview, setPreview] = useState(false);
  const addItem = () => setItems(p => [...p, { desc: "", qty: 1, rate: "", gst: 18 }]);
  const removeItem = (i) => setItems(p => p.filter((_, idx) => idx !== i));
  const updateItem = (i, k, v) => setItems(p => p.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  const isInterstate = seller.state !== buyer.state;
  const calcItem = (item) => {
    const base = (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
    const gstAmt = base * (item.gst / 100);
    return { base, gstAmt, total: base + gstAmt };
  };
  const totals = items.reduce((acc, item) => {
    const { base, gstAmt, total } = calcItem(item);
    acc.subtotal += base;
    acc.gst += gstAmt;
    acc.total += total;
    return acc;
  }, { subtotal: 0, gst: 0, total: 0 });

  return (
    <div>
      {!preview ? (
        <>
          <div className="grid-2" style={{ marginBottom: 24 }}>
            <div className="glass-card">
              <h3>Seller Information</h3>
              <div className="form-group"><label>Business Name</label><input value={seller.name} onChange={e => setSeller({...seller, name: e.target.value})} /></div>
              <div className="form-group"><label>GSTIN</label><input value={seller.gstin} onChange={e => setSeller({...seller, gstin: e.target.value})} /></div>
              <div className="form-group"><label>Address</label><textarea value={seller.address} onChange={e => setSeller({...seller, address: e.target.value})} /></div>
              <div className="form-group"><label>State</label><select value={seller.state} onChange={e => setSeller({...seller, state: e.target.value})}>{["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat"].map(s => <option key={s}>{s}</option>)}</select></div>
            </div>
            <div className="glass-card">
              <h3>Buyer Information</h3>
              <div className="form-group"><label>Customer Name</label><input value={buyer.name} onChange={e => setBuyer({...buyer, name: e.target.value})} /></div>
              <div className="form-group"><label>GSTIN</label><input value={buyer.gstin} onChange={e => setBuyer({...buyer, gstin: e.target.value})} /></div>
              <div className="form-group"><label>Address</label><textarea value={buyer.address} onChange={e => setBuyer({...buyer, address: e.target.value})} /></div>
              <div className="form-group"><label>State</label><select value={buyer.state} onChange={e => setBuyer({...buyer, state: e.target.value})}>{["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat"].map(s => <option key={s}>{s}</option>)}</select></div>
            </div>
          </div>
          <div className="glass-card" style={{ marginBottom: 24 }}>
            <div className="table-container">
              <table>
                <thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>GST %</th><th>Total</th><th></th></tr></thead>
                <tbody>{items.map((item, i) => (
                  <tr key={i}>
                    <td><input value={item.desc} onChange={e => updateItem(i, "desc", e.target.value)} /></td>
                    <td><input type="number" value={item.qty} onChange={e => updateItem(i, "qty", e.target.value)} /></td>
                    <td><input type="number" value={item.rate} onChange={e => updateItem(i, "rate", e.target.value)} /></td>
                    <td><select value={item.gst} onChange={e => updateItem(i, "gst", +e.target.value)}>{GST_RATES.map(r => <option key={r} value={r}>{r}%</option>)}</select></td>
                    <td>{formatINR(calcItem(item).total)}</td>
                    <td><button onClick={() => removeItem(i)}>✕</button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <button className="btn-ghost" onClick={addItem} style={{ marginTop: 16 }}>+ Add Item</button>
            <div style={{ textAlign: "right", marginTop: 20 }}>
              <div style={{ fontSize: 24, fontWeight: 900 }}>Total: {formatINR(totals.total)}</div>
            </div>
          </div>
          <button className="btn-primary" style={{ width: "100%" }} onClick={() => setPreview(true)}>Generate Invoice</button>
        </>
      ) : (
        <div className="fade-in">
          <button className="btn-secondary no-print" onClick={() => setPreview(false)}>← Edit</button>
          <div style={{ background: "white", color: "black", padding: 60, marginTop: 20 }}>
            <h1>INVOICE</h1>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "40px 0" }}>
              <div><strong>From:</strong><br />{seller.name}<br />{seller.gstin}</div>
              <div style={{ textAlign: "right" }}><strong>To:</strong><br />{buyer.name}<br />{buyer.gstin}</div>
            </div>
            <table style={{ width: "100%" }}>
              <tr style={{ background: "#eee" }}><th>Description</th><th>Qty</th><th>Rate</th><th>Total</th></tr>
              {items.map((item, i) => <tr key={i}><td>{item.desc}</td><td>{item.qty}</td><td>{item.rate}</td><td>{calcItem(item).total.toFixed(2)}</td></tr>)}
            </table>
            <div style={{ textAlign: "right", marginTop: 40 }}><strong>GRAND TOTAL: {formatINR(totals.total)}</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}

function QrTool() {
  const [type, setType] = useState("url");
  const [input, setInput] = useState("");
  const [generated, setGenerated] = useState(false);
  const getQrData = () => { if (type === "upi") return `upi://pay?pa=${input}&cu=INR`; if (type === "whatsapp") return `https://wa.me/${input.replace(/[^0-9]/g, "")}`; return input; };
  const qrUrl = input ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(getQrData())}` : "";
  return (
    <div className="grid-2">
      <div className="glass-card">
        <div className="form-group"><label>Type</label><select value={type} onChange={e => setType(e.target.value)}><option value="url">URL</option><option value="upi">UPI</option><option value="whatsapp">WhatsApp</option></select></div>
        <div className="form-group"><label>Value</label><input value={input} onChange={e => setInput(e.target.value)} /></div>
        <button className="btn-primary" style={{ width: "100%" }} onClick={() => setGenerated(true)}>Generate QR</button>
      </div>
      {generated && input && <div className="glass-card fade-in" style={{ textAlign: "center" }}><img src={qrUrl} alt="QR" style={{ background: "white", padding: 10, width: 200 }} /><br /><button className="btn-ghost" style={{ marginTop: 10 }} onClick={() => window.open(qrUrl)}>Download</button></div>}
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

function RentTool() {
  const [landlord, setLandlord] = useState({ name: "", phone: "", address: "" });
  const [tenant, setTenant] = useState({ name: "", phone: "", address: "" });
  const [property, setProperty] = useState({ address: "", type: "1BHK", state: "Maharashtra" });
  const [terms, setTerms] = useState({ rent: "", deposit: "", start: today(), duration: 11 });
  const [preview, setPreview] = useState(false);

  const stampDuty = { Maharashtra: "₹500", Delhi: "₹100", Karnataka: "₹500", "Tamil Nadu": "₹500", "Uttar Pradesh": "₹200" };
  const clauses = [
    "The Tenant shall pay the monthly rent on or before the 5th of each month.",
    "The security deposit shall be refunded within 30 days of vacating the property.",
    "The Tenant shall not sub-let the premises without the Landlord's consent.",
    "The Tenant shall pay electricity and water charges separately."
  ];

  return (
    <div>
      {!preview ? (
        <div className="fade-in">
          <div className="grid-2" style={{ marginBottom: 24 }}>
            <div className="glass-card">
              <h3>Parties</h3>
              <div className="form-group"><label>Landlord</label><input value={landlord.name} onChange={e => setLandlord({...landlord, name: e.target.value})} /></div>
              <div className="form-group"><label>Tenant</label><input value={tenant.name} onChange={e => setTenant({...tenant, name: e.target.value})} /></div>
            </div>
            <div className="glass-card">
              <h3>Property & Terms</h3>
              <div className="form-group"><label>Rent</label><input type="number" value={terms.rent} onChange={e => setTerms({...terms, rent: e.target.value})} /></div>
              <div className="form-group"><label>Address</label><textarea value={property.address} onChange={e => setProperty({...property, address: e.target.value})} /></div>
            </div>
          </div>
          <button className="btn-primary" style={{ width: "100%" }} onClick={() => setPreview(true)}>Generate Agreement Draft</button>
        </div>
      ) : (
        <div className="fade-in">
          <button className="btn-secondary no-print" onClick={() => setPreview(false)}>← Edit</button>
          <div style={{ background: "white", color: "black", padding: 60, marginTop: 20 }}>
            <h1 style={{ textAlign: "center" }}>RENTAL AGREEMENT</h1>
            <p>This agreement is made on {terms.start} between {landlord.name} (Landlord) and {tenant.name} (Tenant).</p>
            <p>Property Address: {property.address}</p>
            <p>Rent: {formatINR(terms.rent)} | Deposit: {formatINR(terms.deposit)} | Tenure: {terms.duration} Months</p>
            <h3>Terms:</h3>
            <ul>{clauses.map((c, i) => <li key={i}>{c}</li>)}</ul>
            <div style={{ marginTop: 60, display: "flex", justifyContent: "space-between" }}><div>Landlord Signature</div><div>Tenant Signature</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

function SalaryTool() {
  const [company, setCompany] = useState({ name: "", address: "" });
  const [emp, setEmp] = useState({ name: "", id: "", designation: "" });
  const [earnings, setEarnings] = useState({ basic: "", hra: "", special: "" });
  const [deductions, setDeductions] = useState({ pf: "", tax: "" });
  const [preview, setPreview] = useState(false);

  const totalEarn = (parseFloat(earnings.basic)||0) + (parseFloat(earnings.hra)||0) + (parseFloat(earnings.special)||0);
  const totalDed = (parseFloat(deductions.pf)||0) + (parseFloat(deductions.tax)||0);

  return (
    <div>
      {!preview ? (
        <div className="grid-2">
          <div className="glass-card">
            <h3>Company & Employee</h3>
            <div className="form-group"><label>Company Name</label><input value={company.name} onChange={e => setCompany({...company, name: e.target.value})} /></div>
            <div className="form-group"><label>Employee Name</label><input value={emp.name} onChange={e => setEmp({...emp, name: e.target.value})} /></div>
          </div>
          <div className="glass-card">
            <h3>Salary Details</h3>
            <div className="form-group"><label>Basic Salary</label><input type="number" value={earnings.basic} onChange={e => setEarnings({...earnings, basic: e.target.value})} /></div>
            <div className="form-group"><label>Income Tax</label><input type="number" value={deductions.tax} onChange={e => setDeductions({...deductions, tax: e.target.value})} /></div>
            <button className="btn-primary" style={{ width: "100%", marginTop: 20 }} onClick={() => setPreview(true)}>Generate Slip</button>
          </div>
        </div>
      ) : (
        <div className="fade-in">
          <button className="btn-secondary no-print" onClick={() => setPreview(false)}>Edit</button>
          <div style={{ background: "white", color: "black", padding: 40, marginTop: 20 }}>
            <h2 style={{ textAlign: "center" }}>SALARY SLIP</h2>
            <div style={{ margin: "20px 0" }}><strong>Company:</strong> {company.name}<br /><strong>Employee:</strong> {emp.name}</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div><strong>Earnings:</strong> {formatINR(totalEarn)}</div>
              <div><strong>Deductions:</strong> {formatINR(totalDed)}</div>
            </div>
            <div style={{ marginTop: 20, fontSize: 24, fontWeight: 900 }}>NET PAY: {formatINR(totalEarn - totalDed)}</div>
          </div>
        </div>
      )}
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
  const toolPages = { upi: { title: "UPI Payment Page", hindi: "पेमेंट पेज", component: <UpiTool /> }, "gst-invoice": { title: "GST Invoice", hindi: "चालान", component: <GstInvoiceTool /> }, qr: { title: "QR Generator", hindi: "क्यूआर", component: <QrTool /> }, emi: { title: "EMI Calculator", hindi: "ईएमआई", component: <EmiTool /> }, "gst-calc": { title: "GST Calculator", hindi: "जीएसटी", component: <GstCalcTool /> }, rent: { title: "Rent Agreement", hindi: "किराया", component: <RentTool /> }, salary: { title: "Salary Slip", hindi: "वेतन पर्ची", component: <SalaryTool /> }, bizname: { title: "AI Business Names", hindi: "बिज़नेस नाम", component: <BizNameTool /> } };

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
