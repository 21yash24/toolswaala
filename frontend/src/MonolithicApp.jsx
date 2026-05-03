import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// CONSTANTS & HELPERS
// ============================================================
const BRAND = {
  primary: "#FF6B00",
  primaryDark: "#D45800",
  navy: "#0D1B2A",
  navyLight: "#1A2F45",
  accent: "#FFB347",
  bg: "#FAFAF8",
  card: "#FFFFFF",
};

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
// STYLES
// ============================================================
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --primary: #FF6B00;
    --primary-dark: #D45800;
    --navy: #0D1B2A;
    --navy-light: #1A2F45;
    --accent: #FFB347;
    --bg: #FAFAF8;
    --card: #FFFFFF;
    --border: #E8E4DC;
    --text: #0D1B2A;
    --text-secondary: #5A6475;
    --success: #1DB954;
    --danger: #E24B4A;
    --radius: 12px;
    --radius-sm: 8px;
    --shadow: 0 1px 4px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05);
    --shadow-hover: 0 4px 16px rgba(255,107,0,0.15), 0 8px 32px rgba(0,0,0,0.08);
  }

  body { font-family: 'Sora', sans-serif; background: var(--bg); color: var(--text); font-size: 15px; line-height: 1.6; }
  
  h1, h2, h3, h4 { font-family: 'Sora', sans-serif; font-weight: 700; }
  
  .hindi-label {
    font-family: 'Noto Sans Devanagari', sans-serif;
    font-size: 11px;
    color: var(--text-secondary);
    display: block;
    margin-top: 2px;
  }

  .btn-primary {
    background: var(--primary);
    color: white;
    border: none;
    padding: 10px 22px;
    border-radius: var(--radius-sm);
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .btn-primary:hover { background: var(--primary-dark); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(255,107,0,0.35); }
  .btn-primary:active { transform: translateY(0); }

  .btn-secondary {
    background: transparent;
    color: var(--primary);
    border: 1.5px solid var(--primary);
    padding: 9px 22px;
    border-radius: var(--radius-sm);
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .btn-secondary:hover { background: rgba(255,107,0,0.06); }

  .btn-ghost {
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border);
    padding: 8px 16px;
    border-radius: var(--radius-sm);
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .btn-ghost:hover { border-color: var(--primary); color: var(--primary); background: rgba(255,107,0,0.04); }

  .card {
    background: var(--card);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    padding: 24px;
  }

  .form-group { margin-bottom: 18px; }
  .form-group label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--navy);
    margin-bottom: 6px;
  }
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    color: var(--text);
    background: #FCFCFB;
    transition: border-color 0.15s, box-shadow 0.15s;
    outline: none;
  }
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(255,107,0,0.1);
    background: white;
  }
  .form-group textarea { resize: vertical; min-height: 80px; }
  .form-group select { cursor: pointer; }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  @media(max-width: 600px) {
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
  }

  .badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.3px;
  }
  .badge-orange { background: rgba(255,107,0,0.12); color: var(--primary); }
  .badge-green { background: rgba(29,185,84,0.12); color: #0d8a3a; }
  .badge-blue { background: rgba(24,95,165,0.12); color: #185FA5; }

  .divider { border: none; border-top: 1px solid var(--border); margin: 20px 0; }

  .tag {
    display: inline-block;
    background: rgba(255,107,0,0.08);
    color: var(--primary);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }

  .result-box {
    background: linear-gradient(135deg, #FFF8F3 0%, #FFF4EC 100%);
    border: 1px solid rgba(255,107,0,0.2);
    border-radius: var(--radius);
    padding: 20px;
  }

  .stat-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 16px;
    text-align: center;
  }
  .stat-value { font-size: 22px; font-weight: 700; color: var(--navy); }
  .stat-label { font-size: 12px; color: var(--text-secondary); margin-top: 4px; }

  .table-container { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  table th {
    text-align: left;
    padding: 10px 12px;
    background: #F5F3EF;
    color: var(--navy);
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--border);
  }
  table td { padding: 10px 12px; border-bottom: 1px solid var(--border); color: var(--text); }
  table tr:last-child td { border-bottom: none; }
  table tr:hover td { background: #FAFAF8; }
  table tfoot td { font-weight: 700; background: #F5F3EF; }

  .pro-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: linear-gradient(135deg, #FF6B00, #FF8C42);
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .watermark-banner {
    background: repeating-linear-gradient(45deg, rgba(255,107,0,0.04), rgba(255,107,0,0.04) 10px, transparent 10px, transparent 20px);
    border: 1px dashed rgba(255,107,0,0.25);
    border-radius: var(--radius-sm);
    padding: 10px 16px;
    margin-top: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    font-size: 12px;
    color: var(--text-secondary);
  }

  .ad-slot {
    background: #F5F3EF;
    border: 1px dashed var(--border);
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    font-size: 11px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .ad-slot-banner { height: 60px; margin: 12px 0; }
  .ad-slot-sidebar { height: 250px; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .fade-in { animation: fadeIn 0.3s ease-out; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { animation: spin 0.7s linear infinite; }

  @media print {
    .no-print { display: none !important; }
    body { background: white; }
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
    <nav style={{ background: BRAND.navy, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPage("home")}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: BRAND.primary, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, color: "white" }}>TW</div>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 16, lineHeight: 1 }}>ToolsWaala</div>
            <div style={{ color: BRAND.accent, fontSize: 10, lineHeight: 1.3, fontFamily: "'Noto Sans Devanagari', sans-serif" }}>हर भारतीय बिज़नेस के लिए</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="btn-primary" style={{ padding: "7px 16px", fontSize: 13 }} onClick={() => alert("Pro plan at ₹99/month — Razorpay integration coming soon!")}>
            ⚡ Pro ₹99/mo
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "7px 10px", borderRadius: 8, cursor: "pointer", fontSize: 18 }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div style={{ background: BRAND.navyLight, borderTop: "1px solid rgba(255,255,255,0.08)", padding: "12px 0" }} className="fade-in">
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 4 }}>
            <div style={{ padding: "8px 12px", color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, gridColumn: "1/-1" }}>All Tools</div>
            {TOOLS.map(t => (
              <button key={t.id} onClick={() => { setPage(t.id); setMenuOpen(false); }}
                style={{ background: active === t.id ? "rgba(255,107,0,0.2)" : "transparent", border: "none", color: active === t.id ? BRAND.accent : "rgba(255,255,255,0.8)", padding: "8px 12px", borderRadius: 8, cursor: "pointer", textAlign: "left", fontSize: 13, display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s" }}>
                <span>{t.icon}</span> {t.name}
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
    <footer style={{ background: BRAND.navy, color: "rgba(255,255,255,0.6)", padding: "40px 16px 24px", marginTop: 60 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>ToolsWaala</div>
            <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 13, marginBottom: 12, color: BRAND.accent }}>हर भारतीय बिज़नेस के लिए</div>
            <p style={{ fontSize: 13, lineHeight: 1.7 }}>Free tools for Indian shopkeepers, freelancers & small business owners. Made with ❤️ in India.</p>
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Tools</div>
            {TOOLS.slice(0, 4).map(t => (
              <div key={t.id} style={{ marginBottom: 8 }}>
                <button onClick={() => setPage(t.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 13, padding: 0, textAlign: "left" }}>
                  {t.icon} {t.name}
                </button>
              </div>
            ))}
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 600, marginBottom: 12, fontSize: 14 }}>More Tools</div>
            {TOOLS.slice(4).map(t => (
              <div key={t.id} style={{ marginBottom: 8 }}>
                <button onClick={() => setPage(t.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 13, padding: 0, textAlign: "left" }}>
                  {t.icon} {t.name}
                </button>
              </div>
            ))}
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Contact</div>
            <p style={{ fontSize: 13, marginBottom: 8 }}>📧 hello@toolswaala.in</p>
            <p style={{ fontSize: 13, marginBottom: 16 }}>🌐 toolswaala.in</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.08)", padding: "6px 14px", borderRadius: 20, fontSize: 12 }}>
              🇮🇳 Made in India
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 12 }}>© 2025 ToolsWaala. All rights reserved.</span>
          <span style={{ fontSize: 12 }}>toolswaala.in — Free tools for every Indian business</span>
        </div>
      </div>
    </footer>
  );
}

function AdSlot({ type = "banner" }) {
  return (
    <div className={`ad-slot ad-slot-${type}`} style={{ fontSize: 11 }}>
      Advertisement • 728×90
    </div>
  );
}

function PageWrapper({ title, hindi, children, setPage }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 16px" }} className="fade-in">
      <div style={{ marginBottom: 24 }}>
        <button onClick={() => setPage("home")} className="btn-ghost" style={{ marginBottom: 16, fontSize: 12 }}>← Back to all tools</button>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: BRAND.navy }}>{title}</h1>
        <p style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", color: BRAND.primary, fontSize: 14, marginTop: 4 }}>{hindi}</p>
      </div>
      <AdSlot type="banner" />
      <div style={{ marginTop: 20 }}>{children}</div>
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
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.navyLight} 60%, #1F3A5C 100%)`, padding: "60px 16px 70px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,107,0,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -20, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,179,71,0.05)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,107,0,0.15)", border: "1px solid rgba(255,107,0,0.3)", color: BRAND.accent, padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 20 }}>
            🇮🇳 Free tools for every Indian business
          </div>
          <h1 style={{ color: "white", fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 700, lineHeight: 1.2, marginBottom: 12 }}>
            India's Free Business<br />
            <span style={{ color: BRAND.primary }}>Toolkit</span>
          </h1>
          <p style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", color: "rgba(255,255,255,0.65)", fontSize: 15, marginBottom: 28 }}>
            हर भारतीय दुकानदार, फ्रीलांसर और बिज़नेस के लिए मुफ्त टूल्स
          </p>
          <div style={{ display: "flex", gap: 10, maxWidth: 480, margin: "0 auto" }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tools... (GST, invoice, QR code...)"
              style={{ flex: 1, padding: "12px 18px", borderRadius: 10, border: "none", fontSize: 14, fontFamily: "'Sora', sans-serif", outline: "none", background: "rgba(255,255,255,0.12)", color: "white", backdropFilter: "blur(10px)" }}
            />
            <button className="btn-primary" style={{ padding: "12px 20px", borderRadius: 10, flexShrink: 0 }}>Search</button>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: BRAND.navy }}>
            {search ? `${filtered.length} tools found` : "All Tools"}
          </h2>
          <span style={{ fontSize: 12, color: BRAND.primary, fontWeight: 600 }}>{TOOLS.length} tools • 100% Free</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
          {filtered.map(tool => (
            <div key={tool.id}
              onClick={() => setPage(tool.id)}
              style={{ background: BRAND.card, border: "1px solid #E8E4DC", borderRadius: 14, padding: "22px", cursor: "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px rgba(255,107,0,0.12)`; e.currentTarget.style.borderColor = BRAND.primary; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = "#E8E4DC"; }}
            >
              <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, borderRadius: "0 14px 0 60px", background: `${tool.color}12`, pointerEvents: "none" }} />
              <div style={{ fontSize: 30, marginBottom: 12 }}>{tool.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: BRAND.navy, marginBottom: 4 }}>{tool.name}</h3>
              <p style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 11, color: BRAND.primary, marginBottom: 8 }}>{tool.hindi}</p>
              <p style={{ fontSize: 13, color: "#5A6475", lineHeight: 1.5, marginBottom: 14 }}>{tool.desc}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ background: `${tool.color}15`, color: tool.color, padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>Free</span>
                <span style={{ color: tool.color, fontSize: 18, fontWeight: 700 }}>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div style={{ marginTop: 60 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, textAlign: "center", color: BRAND.navy, marginBottom: 24 }}>
            Trusted by Indian Businesses 🇮🇳
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
            {[
              { name: "Rajesh Kumar", city: "Mumbai", role: "Shopkeeper", text: "GST invoice generate karna ab 2 minute ka kaam hai! Bahut helpful tool hai.", stars: 5 },
              { name: "Priya Sharma", city: "Delhi", role: "Freelancer", text: "Salary slip PDF feature is amazing. Clients ko professional slip bhej sakti hoon.", stars: 5 },
              { name: "Amit Patel", city: "Ahmedabad", role: "Small Business", text: "UPI payment page se customers easily pay karte hain. Highly recommended!", stars: 5 },
            ].map((t, i) => (
              <div key={i} className="card" style={{ padding: 20 }}>
                <div style={{ color: BRAND.primary, fontSize: 14, marginBottom: 8 }}>{"★".repeat(t.stars)}</div>
                <p style={{ fontSize: 13, color: "#5A6475", lineHeight: 1.7, marginBottom: 12, fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: BRAND.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 13 }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "#5A6475" }}>{t.role} • {t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pro CTA */}
        <div style={{ marginTop: 48, background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.navyLight})`, borderRadius: 16, padding: "36px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,107,0,0.1)", pointerEvents: "none" }} />
          <span style={{ background: "rgba(255,107,0,0.2)", color: BRAND.accent, padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 14, display: "inline-block" }}>Pro Plan</span>
          <h2 style={{ color: "white", fontSize: 24, marginBottom: 8 }}>Upgrade for ₹99/month</h2>
          <p style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", color: "rgba(255,255,255,0.6)", marginBottom: 20, fontSize: 14 }}>अनलिमिटेड इनवॉइस • कोई वॉटरमार्क नहीं • कस्टम थीम</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 24 }}>
            {["Unlimited invoices", "Remove watermarks", "Custom UPI themes", "Priority support", "GST reports"].map(f => (
              <span key={f} style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.9)", padding: "5px 14px", borderRadius: 20, fontSize: 12 }}>✓ {f}</span>
            ))}
          </div>
          <button className="btn-primary" style={{ padding: "12px 32px", fontSize: 15 }} onClick={() => alert("Razorpay payment integration — coming soon!")}>
            Get Pro — ₹99/month
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TOOL 1: UPI PAYMENT PAGE
// ============================================================
function UpiTool() {
  const [form, setForm] = useState({ name: "", upiId: "", description: "", amount: "", theme: "#FF6B00" });
  const [generated, setGenerated] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const payUrl = form.upiId ? `upi://pay?pa=${form.upiId}&pn=${encodeURIComponent(form.name)}&am=${form.amount || ""}&cu=INR` : "";

  const generate = () => {
    if (!form.name || !form.upiId) { alert("Please enter name and UPI ID"); return; }
    setGenerated(true);
    setQrGenerated(true);
  };

  const openPayment = (app) => {
    const deepLinks = {
      phonepe: `phonepe://pay?pa=${form.upiId}&pn=${form.name}&am=${form.amount || ""}`,
      gpay: `tez://upi/pay?pa=${form.upiId}&pn=${form.name}&am=${form.amount || ""}`,
      paytm: `paytmmp://upi/pay?pa=${form.upiId}&pn=${form.name}&am=${form.amount || ""}`,
      bhim: `upi://pay?pa=${form.upiId}&pn=${form.name}&am=${form.amount || ""}`,
    };
    window.location.href = deepLinks[app] || payUrl;
  };

  const shareableLink = `https://toolswaala.in/pay/${form.upiId?.replace("@", "-at-")}`;

  return (
    <div>
      <div className="grid-2" style={{ gap: 24 }}>
        <div className="card">
          <h3 style={{ marginBottom: 18, fontSize: 16, color: BRAND.navy }}>Setup Your Page • <span style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 13, color: BRAND.primary }}>पेज बनाएं</span></h3>
          <div className="form-group">
            <label>Your Name / Business Name <span className="hindi-label">आपका नाम / बिज़नेस नाम</span></label>
            <input value={form.name} onChange={e => update("name", e.target.value)} placeholder="e.g. Rajesh Kirana Store" />
          </div>
          <div className="form-group">
            <label>UPI ID <span className="hindi-label">यूपीआई आईडी</span></label>
            <input value={form.upiId} onChange={e => update("upiId", e.target.value)} placeholder="e.g. rajesh@paytm" />
          </div>
          <div className="form-group">
            <label>Description <span className="hindi-label">विवरण</span></label>
            <input value={form.description} onChange={e => update("description", e.target.value)} placeholder="e.g. Payment for groceries" />
          </div>
          <div className="form-group">
            <label>Fixed Amount (optional) <span className="hindi-label">निश्चित राशि (वैकल्पिक)</span></label>
            <input type="number" value={form.amount} onChange={e => update("amount", e.target.value)} placeholder="e.g. 500" />
          </div>
          <div className="form-group">
            <label>Theme Color <span className="hindi-label">थीम रंग</span></label>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {["#FF6B00", "#1DB954", "#2196F3", "#E91E63", "#9C27B0"].map(c => (
                <div key={c} onClick={() => update("theme", c)} style={{ width: 32, height: 32, borderRadius: "50%", background: c, cursor: "pointer", border: form.theme === c ? "3px solid #0D1B2A" : "2px solid transparent", transition: "border 0.15s" }} />
              ))}
              <input type="color" value={form.theme} onChange={e => update("theme", e.target.value)} style={{ width: 32, height: 32, border: "none", padding: 0, cursor: "pointer", borderRadius: "50%" }} />
            </div>
          </div>
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px" }} onClick={generate}>
            Generate Payment Page ✨
          </button>
        </div>

        {generated ? (
          <div className="fade-in">
            {/* Preview */}
            <div style={{ background: `linear-gradient(135deg, ${form.theme}20, ${form.theme}08)`, border: `2px solid ${form.theme}30`, borderRadius: 16, padding: 28, textAlign: "center", marginBottom: 16 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: form.theme, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 26, margin: "0 auto 14px" }}>
                {getInitials(form.name)}
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: BRAND.navy, marginBottom: 4 }}>{form.name}</h2>
              {form.description && <p style={{ fontSize: 13, color: "#5A6475", marginBottom: 16 }}>{form.description}</p>}
              {form.amount && (
                <div style={{ fontSize: 28, fontWeight: 700, color: form.theme, marginBottom: 16 }}>{formatINR(form.amount)}</div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                {[["phonepe", "📱 PhonePe", "#5F259F"], ["gpay", "G Pay", "#4285F4"], ["paytm", "Paytm", "#00B9F1"], ["bhim", "BHIM", "#00558C"]].map(([app, label, color]) => (
                  <button key={app} onClick={() => openPayment(app)}
                    style={{ background: color, color: "white", border: "none", padding: "10px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'Sora', sans-serif" }}>
                    {label}
                  </button>
                ))}
              </div>
              {/* Simple QR code placeholder */}
              <div style={{ background: "white", borderRadius: 10, padding: 12, display: "inline-block", marginBottom: 12 }}>
                <div style={{ width: 120, height: 120, background: "#f0f0f0", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4 }}>
                  <div style={{ fontSize: 32 }}>▣</div>
                  <div style={{ fontSize: 9, color: "#999", textAlign: "center" }}>QR for UPI</div>
                </div>
              </div>
            </div>
            <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: 14 }}>
              <p style={{ fontSize: 12, color: "#166534", marginBottom: 8, fontWeight: 600 }}>✅ Shareable Link</p>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input readOnly value={shareableLink} style={{ flex: 1, background: "white", border: "1px solid #BBF7D0", borderRadius: 6, padding: "7px 10px", fontSize: 12, color: "#166534", fontFamily: "monospace" }} />
                <button className="btn-primary" style={{ padding: "7px 12px", fontSize: 12, flexShrink: 0 }} onClick={() => { navigator.clipboard?.writeText(shareableLink); alert("Link copied!"); }}>Copy</button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, color: "#5A6475", textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>📲</div>
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Your Payment Page</p>
            <p style={{ fontSize: 13 }}>Fill the form and click Generate to preview</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// TOOL 2: GST INVOICE
// ============================================================
const defaultItem = { desc: "", qty: 1, rate: "", gst: 18 };

function GstInvoiceTool() {
  const [seller, setSeller] = useState({ name: "", gstin: "", address: "", state: "Maharashtra", phone: "" });
  const [buyer, setBuyer] = useState({ name: "", gstin: "", address: "", state: "Maharashtra", phone: "" });
  const [invoiceNo, setInvoiceNo] = useState(`INV-${new Date().getFullYear()}-001`);
  const [invoiceDate, setInvoiceDate] = useState(today());
  const [items, setItems] = useState([{ ...defaultItem }]);
  const [preview, setPreview] = useState(false);

  const addItem = () => setItems(p => [...p, { ...defaultItem }]);
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

  const printInvoice = () => {
    window.print();
  };

  return (
    <div>
      {!preview ? (
        <>
          <div className="grid-2" style={{ marginBottom: 20 }}>
            <div className="card">
              <h3 style={{ marginBottom: 16, fontSize: 15, color: BRAND.navy }}>Seller Details <span className="hindi-label">विक्रेता विवरण</span></h3>
              {[["name", "Business/Seller Name", "व्यवसाय का नाम"], ["gstin", "GSTIN", "जीएसटीआईएन"], ["address", "Address", "पता"], ["phone", "Phone", "फोन"]].map(([k, label, hl]) => (
                <div className="form-group" key={k}>
                  <label>{label} <span className="hindi-label">{hl}</span></label>
                  {k === "address" ? (
                    <textarea value={seller[k]} onChange={e => setSeller(p => ({ ...p, [k]: e.target.value }))} placeholder={`Seller ${label}`} style={{ minHeight: 60 }} />
                  ) : (
                    <input value={seller[k]} onChange={e => setSeller(p => ({ ...p, [k]: e.target.value }))} placeholder={`Seller ${label}`} />
                  )}
                </div>
              ))}
              <div className="form-group">
                <label>State <span className="hindi-label">राज्य</span></label>
                <select value={seller.state} onChange={e => setSeller(p => ({ ...p, state: e.target.value }))}>
                  {["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat", "Rajasthan", "Uttar Pradesh", "West Bengal", "Telangana", "Kerala"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="card">
              <h3 style={{ marginBottom: 16, fontSize: 15, color: BRAND.navy }}>Buyer Details <span className="hindi-label">खरीदार विवरण</span></h3>
              {[["name", "Business/Buyer Name", "खरीदार का नाम"], ["gstin", "GSTIN (optional)", "जीएसटीआईएन"], ["address", "Address", "पता"], ["phone", "Phone", "फोन"]].map(([k, label, hl]) => (
                <div className="form-group" key={k}>
                  <label>{label} <span className="hindi-label">{hl}</span></label>
                  {k === "address" ? (
                    <textarea value={buyer[k]} onChange={e => setBuyer(p => ({ ...p, [k]: e.target.value }))} placeholder={`Buyer ${label}`} style={{ minHeight: 60 }} />
                  ) : (
                    <input value={buyer[k]} onChange={e => setBuyer(p => ({ ...p, [k]: e.target.value }))} placeholder={`Buyer ${label}`} />
                  )}
                </div>
              ))}
              <div className="form-group">
                <label>State <span className="hindi-label">राज्य</span></label>
                <select value={buyer.state} onChange={e => setBuyer(p => ({ ...p, state: e.target.value }))}>
                  {["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat", "Rajasthan", "Uttar Pradesh", "West Bengal", "Telangana", "Kerala"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Invoice Number <span className="hindi-label">चालान संख्या</span></label>
                <input value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Invoice Date <span className="hindi-label">चालान तारीख</span></label>
                <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
              </div>
            </div>

            <h3 style={{ marginBottom: 14, fontSize: 15, color: BRAND.navy }}>Line Items <span style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 12, color: BRAND.primary }}>वस्तुएं/सेवाएं</span></h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th style={{ minWidth: 180 }}>Description</th>
                    <th style={{ minWidth: 70 }}>Qty</th>
                    <th style={{ minWidth: 100 }}>Rate (₹)</th>
                    <th style={{ minWidth: 80 }}>GST %</th>
                    <th style={{ minWidth: 80 }}>GST Amt</th>
                    <th style={{ minWidth: 100 }}>Total</th>
                    <th style={{ minWidth: 40 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => {
                    const { base, gstAmt, total } = calcItem(item);
                    return (
                      <tr key={i}>
                        <td><input value={item.desc} onChange={e => updateItem(i, "desc", e.target.value)} placeholder="Item/Service description" style={{ border: "1px solid #E8E4DC", borderRadius: 6, padding: "6px 8px", width: "100%", fontFamily: "'Sora', sans-serif", fontSize: 13 }} /></td>
                        <td><input type="number" value={item.qty} onChange={e => updateItem(i, "qty", e.target.value)} style={{ border: "1px solid #E8E4DC", borderRadius: 6, padding: "6px 8px", width: 60, fontFamily: "'Sora', sans-serif", fontSize: 13 }} /></td>
                        <td><input type="number" value={item.rate} onChange={e => updateItem(i, "rate", e.target.value)} placeholder="0" style={{ border: "1px solid #E8E4DC", borderRadius: 6, padding: "6px 8px", width: 90, fontFamily: "'Sora', sans-serif", fontSize: 13 }} /></td>
                        <td>
                          <select value={item.gst} onChange={e => updateItem(i, "gst", +e.target.value)} style={{ border: "1px solid #E8E4DC", borderRadius: 6, padding: "6px 4px", fontFamily: "'Sora', sans-serif", fontSize: 13 }}>
                            {GST_RATES.map(r => <option key={r}>{r}</option>)}
                          </select>
                        </td>
                        <td style={{ fontWeight: 600, color: BRAND.primary }}>₹{gstAmt.toFixed(2)}</td>
                        <td style={{ fontWeight: 700 }}>₹{total.toFixed(2)}</td>
                        <td><button onClick={() => removeItem(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#E24B4A", fontSize: 16, padding: 4 }}>✕</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
              <button className="btn-ghost" onClick={addItem}>+ Add Item</button>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, color: "#5A6475", marginBottom: 4 }}>Subtotal: <strong>{formatINR(totals.subtotal)}</strong></div>
                <div style={{ fontSize: 13, color: "#5A6475", marginBottom: 4 }}>
                  {isInterstate ? `IGST: ${formatINR(totals.gst)}` : `CGST: ${formatINR(totals.gst / 2)} | SGST: ${formatINR(totals.gst / 2)}`}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: BRAND.navy }}>Total: {formatINR(totals.total)}</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: 13 }} onClick={() => setPreview(true)}>
              Preview Invoice 👁
            </button>
          </div>
          <div className="watermark-banner">
            <span>⚡ Free plan: 5 invoices/month with watermark</span>
            <button className="btn-primary" style={{ padding: "5px 14px", fontSize: 12 }} onClick={() => alert("Go Pro for unlimited invoices!")}>Remove Watermark</button>
          </div>
        </>
      ) : (
        <div className="fade-in">
          {/* Print-ready invoice */}
          <div style={{ marginBottom: 16, display: "flex", gap: 10 }} className="no-print">
            <button className="btn-secondary" onClick={() => setPreview(false)}>← Edit</button>
            <button className="btn-primary" onClick={printInvoice}>🖨 Print / Save PDF</button>
          </div>
          <div style={{ background: "white", border: "1px solid #E8E4DC", borderRadius: 12, padding: 32, maxWidth: 720, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28, borderBottom: `3px solid ${BRAND.primary}`, paddingBottom: 20 }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: BRAND.primary, marginBottom: 4 }}>TAX INVOICE</div>
                <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", color: "#5A6475", fontSize: 13 }}>कर चालान</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: BRAND.navy }}>{seller.name || "Your Business"}</div>
                <div style={{ fontSize: 12, color: "#5A6475", lineHeight: 1.8 }}>
                  {seller.gstin && <div>GSTIN: {seller.gstin}</div>}
                  {seller.phone && <div>📞 +91 {seller.phone}</div>}
                </div>
              </div>
            </div>
            <div className="grid-2" style={{ marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#5A6475", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Bill To / बिल प्राप्तकर्ता</div>
                <div style={{ fontWeight: 700, color: BRAND.navy }}>{buyer.name || "Customer Name"}</div>
                {buyer.gstin && <div style={{ fontSize: 12, color: "#5A6475" }}>GSTIN: {buyer.gstin}</div>}
                <div style={{ fontSize: 12, color: "#5A6475", marginTop: 4 }}>{buyer.address}</div>
                <div style={{ fontSize: 12, color: "#5A6475" }}>{buyer.state}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: "#5A6475", textTransform: "uppercase", letterSpacing: 1 }}>Invoice No.</div>
                  <div style={{ fontWeight: 700, color: BRAND.navy }}>{invoiceNo}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#5A6475", textTransform: "uppercase", letterSpacing: 1 }}>Date</div>
                  <div style={{ fontWeight: 700, color: BRAND.navy }}>{invoiceDate}</div>
                </div>
              </div>
            </div>
            <table style={{ marginBottom: 16 }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Description / विवरण</th>
                  <th style={{ textAlign: "right" }}>Qty</th>
                  <th style={{ textAlign: "right" }}>Rate</th>
                  <th style={{ textAlign: "right" }}>GST%</th>
                  <th style={{ textAlign: "right" }}>GST Amt</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => {
                  const { base, gstAmt, total } = calcItem(item);
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{item.desc || "—"}</td>
                      <td style={{ textAlign: "right" }}>{item.qty}</td>
                      <td style={{ textAlign: "right" }}>₹{parseFloat(item.rate || 0).toFixed(2)}</td>
                      <td style={{ textAlign: "right" }}>{item.gst}%</td>
                      <td style={{ textAlign: "right" }}>₹{gstAmt.toFixed(2)}</td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>₹{total.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5} style={{ textAlign: "right", fontWeight: 700, background: "#F5F3EF" }}>Subtotal</td>
                  <td colSpan={2} style={{ textAlign: "right", fontWeight: 700, background: "#F5F3EF" }}>₹{totals.subtotal.toFixed(2)}</td>
                </tr>
                {!isInterstate ? (
                  <>
                    <tr>
                      <td colSpan={5} style={{ textAlign: "right", background: "#F5F3EF" }}>CGST</td>
                      <td colSpan={2} style={{ textAlign: "right", background: "#F5F3EF" }}>₹{(totals.gst / 2).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan={5} style={{ textAlign: "right", background: "#F5F3EF" }}>SGST</td>
                      <td colSpan={2} style={{ textAlign: "right", background: "#F5F3EF" }}>₹{(totals.gst / 2).toFixed(2)}</td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "right", background: "#F5F3EF" }}>IGST</td>
                    <td colSpan={2} style={{ textAlign: "right", background: "#F5F3EF" }}>₹{totals.gst.toFixed(2)}</td>
                  </tr>
                )}
                <tr>
                  <td colSpan={5} style={{ textAlign: "right", fontWeight: 700, fontSize: 15, background: BRAND.primary, color: "white" }}>TOTAL AMOUNT</td>
                  <td colSpan={2} style={{ textAlign: "right", fontWeight: 700, fontSize: 15, background: BRAND.primary, color: "white" }}>{formatINR(totals.total)}</td>
                </tr>
              </tfoot>
            </table>
            <div style={{ fontSize: 11, color: "#5A6475", borderTop: "1px solid #E8E4DC", paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
              <span>Generated by ToolsWaala.in — Free tools for every Indian business</span>
              <span>{isInterstate ? "Interstate Supply (IGST)" : "Intrastate Supply (CGST+SGST)"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// TOOL 3: QR CODE GENERATOR
// ============================================================
function QrTool() {
  const [type, setType] = useState("url");
  const [input, setInput] = useState("");
  const [size, setSize] = useState(300);
  const [fgColor, setFgColor] = useState("#0D1B2A");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [generated, setGenerated] = useState(false);

  const qrTypes = [
    { id: "url", label: "URL / Website", hindi: "वेबसाइट", placeholder: "https://toolswaala.in" },
    { id: "upi", label: "UPI ID", hindi: "यूपीआई", placeholder: "name@paytm" },
    { id: "whatsapp", label: "WhatsApp", hindi: "व्हाट्सऐप", placeholder: "+91 98765 43210" },
    { id: "text", label: "Plain Text", hindi: "टेक्स्ट", placeholder: "Any text..." },
    { id: "instagram", label: "Instagram", hindi: "इंस्टाग्राम", placeholder: "@username" },
  ];

  const getCurrentType = () => qrTypes.find(t => t.id === type);

  const getQrData = () => {
    switch (type) {
      case "upi": return `upi://pay?pa=${input}&cu=INR`;
      case "whatsapp": return `https://wa.me/${input.replace(/[^0-9]/g, "")}`;
      case "instagram": return `https://instagram.com/${input.replace("@", "")}`;
      default: return input;
    }
  };

  const qrUrl = input ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(getQrData())}&color=${fgColor.replace("#", "")}&bgcolor=${bgColor.replace("#", "")}` : "";

  const downloadQr = () => {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `toolswaala-qr-${type}.png`;
    a.click();
  };

  return (
    <div className="grid-2" style={{ gap: 24 }}>
      <div className="card">
        <h3 style={{ marginBottom: 18, fontSize: 15, color: BRAND.navy }}>QR Code Settings</h3>
        <div className="form-group">
          <label>QR Type <span className="hindi-label">क्यूआर प्रकार</span></label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {qrTypes.map(t => (
              <button key={t.id} onClick={() => { setType(t.id); setInput(""); }}
                style={{ padding: "9px 12px", border: `1.5px solid ${type === t.id ? BRAND.primary : "#E8E4DC"}`, borderRadius: 8, background: type === t.id ? "rgba(255,107,0,0.08)" : "white", color: type === t.id ? BRAND.primary : "#5A6475", cursor: "pointer", fontSize: 13, fontWeight: type === t.id ? 700 : 400, fontFamily: "'Sora', sans-serif", textAlign: "left" }}>
                {t.label}
                <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 10, color: type === t.id ? BRAND.primary : "#999", marginTop: 2 }}>{t.hindi}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>{getCurrentType()?.label} Input</label>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder={getCurrentType()?.placeholder} />
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label>Foreground <span className="hindi-label">रंग</span></label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} style={{ width: 40, height: 36, border: "1px solid #E8E4DC", borderRadius: 6, padding: 2, cursor: "pointer" }} />
              <span style={{ fontSize: 12, color: "#5A6475" }}>{fgColor}</span>
            </div>
          </div>
          <div className="form-group">
            <label>Background <span className="hindi-label">पृष्ठभूमि</span></label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width: 40, height: 36, border: "1px solid #E8E4DC", borderRadius: 6, padding: 2, cursor: "pointer" }} />
              <span style={{ fontSize: 12, color: "#5A6475" }}>{bgColor}</span>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>Size: {size}px <span className="hindi-label">आकार</span></label>
          <div style={{ display: "flex", gap: 8 }}>
            {[200, 300, 400, 600].map(s => (
              <button key={s} onClick={() => setSize(s)} style={{ padding: "6px 12px", border: `1.5px solid ${size === s ? BRAND.primary : "#E8E4DC"}`, borderRadius: 6, background: size === s ? "rgba(255,107,0,0.08)" : "white", color: size === s ? BRAND.primary : "#5A6475", cursor: "pointer", fontSize: 12, fontFamily: "'Sora', sans-serif", fontWeight: size === s ? 700 : 400 }}>
                {s}px
              </button>
            ))}
          </div>
        </div>
        <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: 12 }} onClick={() => setGenerated(true)} disabled={!input}>
          Generate QR Code ▣
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: generated && input ? "flex-start" : "center", gap: 16 }}>
        {generated && input ? (
          <div className="card fade-in" style={{ width: "100%", textAlign: "center" }}>
            <div style={{ background: bgColor, padding: 20, borderRadius: 10, display: "inline-block", marginBottom: 16, border: "1px solid #E8E4DC" }}>
              <img src={qrUrl} alt="QR Code" style={{ display: "block", width: Math.min(size, 280), height: Math.min(size, 280) }} />
            </div>
            <p style={{ fontSize: 12, color: "#5A6475", marginBottom: 14 }}>Scan to access: {type.toUpperCase()}</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={downloadQr}>⬇ Download PNG</button>
              <button className="btn-secondary" onClick={() => navigator.clipboard?.writeText(qrUrl).then(() => alert("QR URL copied!"))}>Copy URL</button>
            </div>
            <div style={{ marginTop: 14, padding: "10px 14px", background: "#F5F3EF", borderRadius: 8, fontSize: 12, color: "#5A6475", textAlign: "left", wordBreak: "break-all" }}>
              <strong>Data:</strong> {getQrData()}
            </div>
            <div className="watermark-banner" style={{ marginTop: 14 }}>
              <span>🔒 Pro: Add logo in center of QR</span>
              <button className="btn-primary" style={{ padding: "4px 10px", fontSize: 11 }} onClick={() => alert("Upgrade to Pro!")}>Upgrade</button>
            </div>
          </div>
        ) : (
          <div style={{ color: "#5A6475", textAlign: "center" }}>
            <div style={{ fontSize: 70, marginBottom: 12 }}>▣</div>
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Your QR Code</p>
            <p style={{ fontSize: 13 }}>Enter data and click Generate</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// TOOL 4: EMI CALCULATOR
// ============================================================
function EmiTool() {
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(9.5);
  const [tenure, setTenure] = useState(60);
  const [tenureUnit, setTenureUnit] = useState("months");
  const [showTable, setShowTable] = useState(false);

  const months = tenureUnit === "years" ? tenure * 12 : tenure;
  const monthlyRate = rate / (12 * 100);
  const emi = monthlyRate === 0 ? amount / months :
    (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - amount;

  const amortization = [];
  let balance = amount;
  for (let i = 1; i <= Math.min(months, 120); i++) {
    const interest = balance * monthlyRate;
    const principal = emi - interest;
    balance -= principal;
    amortization.push({ month: i, emi: emi.toFixed(2), principal: principal.toFixed(2), interest: interest.toFixed(2), balance: Math.max(0, balance).toFixed(2) });
  }

  const principalPct = Math.round((amount / totalPayment) * 100);

  return (
    <div>
      <div className="grid-2" style={{ gap: 24 }}>
        <div className="card">
          <h3 style={{ marginBottom: 18, fontSize: 15, color: BRAND.navy }}>Loan Details <span className="hindi-label">ऋण विवरण</span></h3>

          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {Object.entries(LOAN_PRESETS).map(([name, p]) => (
              <button key={name} className="btn-ghost" style={{ fontSize: 12, padding: "6px 12px" }}
                onClick={() => { setAmount(p.amount); setRate(p.rate); setTenure(p.tenure); setTenureUnit("months"); }}>
                {name}
              </button>
            ))}
          </div>

          <div className="form-group">
            <label>Loan Amount: {formatINR(amount)} <span className="hindi-label">ऋण राशि</span></label>
            <input type="range" min="50000" max="10000000" step="50000" value={amount} onChange={e => setAmount(+e.target.value)} style={{ width: "100%", margin: "8px 0" }} />
            <input type="number" value={amount} onChange={e => setAmount(+e.target.value)} />
          </div>
          <div className="form-group">
            <label>Annual Interest Rate: {rate}% <span className="hindi-label">वार्षिक ब्याज दर</span></label>
            <input type="range" min="4" max="36" step="0.1" value={rate} onChange={e => setRate(+e.target.value)} style={{ width: "100%", margin: "8px 0" }} />
            <input type="number" step="0.1" value={rate} onChange={e => setRate(+e.target.value)} />
          </div>
          <div className="form-group">
            <label>Tenure: {tenure} {tenureUnit} <span className="hindi-label">अवधि</span></label>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <button onClick={() => setTenureUnit("months")} style={{ padding: "5px 14px", border: `1.5px solid ${tenureUnit === "months" ? BRAND.primary : "#E8E4DC"}`, borderRadius: 6, background: tenureUnit === "months" ? "rgba(255,107,0,0.08)" : "white", color: tenureUnit === "months" ? BRAND.primary : "#5A6475", cursor: "pointer", fontSize: 12, fontFamily: "'Sora', sans-serif" }}>Months</button>
              <button onClick={() => setTenureUnit("years")} style={{ padding: "5px 14px", border: `1.5px solid ${tenureUnit === "years" ? BRAND.primary : "#E8E4DC"}`, borderRadius: 6, background: tenureUnit === "years" ? "rgba(255,107,0,0.08)" : "white", color: tenureUnit === "years" ? BRAND.primary : "#5A6475", cursor: "pointer", fontSize: 12, fontFamily: "'Sora', sans-serif" }}>Years</button>
            </div>
            <input type="range" min={tenureUnit === "months" ? 6 : 1} max={tenureUnit === "months" ? 360 : 30} value={tenure} onChange={e => setTenure(+e.target.value)} style={{ width: "100%", margin: "8px 0" }} />
            <input type="number" value={tenure} onChange={e => setTenure(+e.target.value)} />
          </div>
        </div>

        <div>
          <div className="result-box" style={{ marginBottom: 16 }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "#5A6475", marginBottom: 4 }}>Monthly EMI / मासिक ईएमआई</div>
              <div style={{ fontSize: 40, fontWeight: 700, color: BRAND.primary }}>{formatINR(emi)}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="stat-card">
                <div className="stat-value">{formatINR(amount)}</div>
                <div className="stat-label">Principal / मूलधन</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: "#E24B4A" }}>{formatINR(totalInterest)}</div>
                <div className="stat-label">Total Interest / कुल ब्याज</div>
              </div>
              <div className="stat-card" style={{ gridColumn: "1/-1" }}>
                <div className="stat-value">{formatINR(totalPayment)}</div>
                <div className="stat-label">Total Payment / कुल भुगतान</div>
              </div>
            </div>
          </div>

          {/* Simple visual breakdown */}
          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Principal vs Interest Breakdown</div>
            <div style={{ height: 18, background: "#F5F3EF", borderRadius: 9, overflow: "hidden", marginBottom: 10 }}>
              <div style={{ height: "100%", width: `${principalPct}%`, background: BRAND.primary, borderRadius: 9, transition: "width 0.5s" }} />
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: BRAND.primary }} />
                <span>Principal {principalPct}%</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: "#E8E4DC" }} />
                <span>Interest {100 - principalPct}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <button className="btn-ghost" onClick={() => setShowTable(!showTable)}>
          {showTable ? "▲ Hide" : "▼ Show"} Amortization Table / परिशोधन तालिका
        </button>
        {showTable && (
          <div className="table-container" style={{ marginTop: 14 }} className="fade-in">
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>EMI (₹)</th>
                  <th>Principal (₹)</th>
                  <th>Interest (₹)</th>
                  <th>Balance (₹)</th>
                </tr>
              </thead>
              <tbody>
                {amortization.map(row => (
                  <tr key={row.month}>
                    <td>{row.month}</td>
                    <td>{parseFloat(row.emi).toLocaleString("en-IN")}</td>
                    <td style={{ color: "#1D9E75" }}>{parseFloat(row.principal).toLocaleString("en-IN")}</td>
                    <td style={{ color: "#E24B4A" }}>{parseFloat(row.interest).toLocaleString("en-IN")}</td>
                    <td style={{ fontWeight: 600 }}>{parseFloat(row.balance).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {months > 120 && <p style={{ fontSize: 12, color: "#5A6475", padding: "10px 0", textAlign: "center" }}>Showing first 120 months of {months} total</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// TOOL 5: GST CALCULATOR
// ============================================================
function GstCalcTool() {
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState(18);
  const [mode, setMode] = useState("add"); // add | remove
  const [hsnSearch, setHsnSearch] = useState("");

  const numAmount = parseFloat(amount) || 0;
  const baseAmount = mode === "add" ? numAmount : numAmount / (1 + gstRate / 100);
  const gstAmount = baseAmount * (gstRate / 100);
  const finalAmount = baseAmount + gstAmount;
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  const hsnResults = hsnSearch.length > 1 ? Object.entries(HSN_CODES).filter(([code, desc]) => code.toString().includes(hsnSearch) || desc.toLowerCase().includes(hsnSearch.toLowerCase())) : [];

  return (
    <div className="grid-2" style={{ gap: 24 }}>
      <div className="card">
        <h3 style={{ marginBottom: 18, fontSize: 15, color: BRAND.navy }}>GST Calculator <span className="hindi-label">जीएसटी कैलकुलेटर</span></h3>

        <div className="form-group">
          <label>Calculation Mode <span className="hindi-label">गणना का तरीका</span></label>
          <div style={{ display: "flex", gap: 0, border: "1.5px solid #E8E4DC", borderRadius: 8, overflow: "hidden" }}>
            <button onClick={() => setMode("add")} style={{ flex: 1, padding: "10px", background: mode === "add" ? BRAND.primary : "white", color: mode === "add" ? "white" : "#5A6475", border: "none", cursor: "pointer", fontSize: 13, fontFamily: "'Sora', sans-serif", fontWeight: mode === "add" ? 700 : 400, transition: "all 0.15s" }}>
              + Add GST to price<br /><span style={{ fontSize: 10, fontFamily: "'Noto Sans Devanagari', sans-serif" }}>मूल्य पर जीएसटी जोड़ें</span>
            </button>
            <button onClick={() => setMode("remove")} style={{ flex: 1, padding: "10px", background: mode === "remove" ? BRAND.primary : "white", color: mode === "remove" ? "white" : "#5A6475", border: "none", borderLeft: "1px solid #E8E4DC", cursor: "pointer", fontSize: 13, fontFamily: "'Sora', sans-serif", fontWeight: mode === "remove" ? 700 : 400, transition: "all 0.15s" }}>
              - Remove GST from price<br /><span style={{ fontSize: 10, fontFamily: "'Noto Sans Devanagari', sans-serif" }}>मूल्य से जीएसटी हटाएं</span>
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>{mode === "add" ? "Price before GST (₹)" : "Price including GST (₹)"} <span className="hindi-label">राशि</span></label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 10000" style={{ fontSize: 18, fontWeight: 600 }} />
        </div>

        <div className="form-group">
          <label>GST Rate <span className="hindi-label">जीएसटी दर</span></label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {GST_RATES.map(r => (
              <button key={r} onClick={() => setGstRate(r)}
                style={{ padding: "8px 16px", border: `1.5px solid ${gstRate === r ? BRAND.primary : "#E8E4DC"}`, borderRadius: 8, background: gstRate === r ? BRAND.primary : "white", color: gstRate === r ? "white" : "#5A6475", cursor: "pointer", fontSize: 14, fontFamily: "'Sora', sans-serif", fontWeight: 700, transition: "all 0.15s" }}>
                {r}%
              </button>
            ))}
          </div>
        </div>

        <hr className="divider" />

        <div style={{ marginBottom: 12 }}>
          <h4 style={{ fontSize: 14, marginBottom: 4 }}>HSN Code Lookup <span style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 11, fontWeight: 400, color: "#5A6475" }}>एचएसएन कोड खोज</span></h4>
          <input value={hsnSearch} onChange={e => setHsnSearch(e.target.value)} placeholder="Search by code or item name..." />
          {hsnResults.length > 0 && (
            <div style={{ border: "1px solid #E8E4DC", borderRadius: 8, marginTop: 6, background: "white", maxHeight: 150, overflowY: "auto" }}>
              {hsnResults.map(([code, desc]) => (
                <div key={code} style={{ padding: "8px 12px", borderBottom: "1px solid #F5F3EF", display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}
                  onClick={() => { setHsnSearch(""); }}>
                  <span style={{ background: "rgba(255,107,0,0.1)", color: BRAND.primary, padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 700 }}>{code}</span>
                  <span style={{ fontSize: 13, color: "#5A6475" }}>{desc}</span>
                </div>
              ))}
            </div>
          )}
          {hsnSearch.length > 1 && hsnResults.length === 0 && (
            <div style={{ fontSize: 12, color: "#5A6475", padding: "8px 0" }}>No HSN codes found. Try different keywords.</div>
          )}
        </div>
      </div>

      <div>
        {numAmount > 0 ? (
          <div className="result-box fade-in">
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#5A6475", marginBottom: 4 }}>
                {mode === "add" ? "Final Price with GST" : "Base Price without GST"}
              </div>
              <div style={{ fontSize: 40, fontWeight: 700, color: BRAND.primary }}>
                {formatINR(mode === "add" ? finalAmount : baseAmount)}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Base Amount / मूल राशि", value: baseAmount, color: BRAND.navy, bold: true },
                { label: `CGST @ ${gstRate / 2}%`, value: cgst, color: "#5A6475" },
                { label: `SGST @ ${gstRate / 2}%`, value: sgst, color: "#5A6475" },
                { label: `IGST @ ${gstRate}% (interstate)`, value: gstAmount, color: "#5A6475" },
                { label: "Total GST Amount", value: gstAmount, color: BRAND.primary, bold: true },
                { label: "Final Amount / कुल राशि", value: finalAmount, color: BRAND.navy, bold: true },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "rgba(255,255,255,0.8)", borderRadius: 8, fontSize: 14 }}>
                  <span style={{ color: "#5A6475" }}>{row.label}</span>
                  <span style={{ fontWeight: row.bold ? 700 : 500, color: row.color }}>{formatINR(row.value)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, color: "#5A6475", textAlign: "center" }}>
            <div style={{ fontSize: 60, marginBottom: 12 }}>🧮</div>
            <p style={{ fontSize: 15, fontWeight: 600 }}>Enter an amount</p>
            <p style={{ fontSize: 13 }}>Results will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// TOOL 6: RENT AGREEMENT
// ============================================================
function RentTool() {
  const [landlord, setLandlord] = useState({ name: "", phone: "", address: "" });
  const [tenant, setTenant] = useState({ name: "", phone: "", address: "" });
  const [property, setProperty] = useState({ address: "", type: "1BHK", state: "Maharashtra" });
  const [terms, setTerms] = useState({ rent: "", deposit: "", start: today(), duration: 11 });
  const [preview, setPreview] = useState(false);

  const endDate = addMonths(terms.start, terms.duration);

  const stampDuty = {
    Maharashtra: "₹500 (Stamp duty for 11-month agreement under Maharashtra Stamp Act)",
    Delhi: "₹100 (Fixed stamp duty for rental agreements in Delhi)",
    Karnataka: "₹500 (Karnataka Stamp Act — registered with Sub-Registrar)",
    "Tamil Nadu": "₹500 (Tamil Nadu Stamp Act, Registration recommended)",
    "Uttar Pradesh": "₹200 (UP Stamp Act — notarized or registered)",
  };

  const clauses = [
    "The Tenant shall pay the monthly rent of ₹" + (terms.rent || "[AMOUNT]") + " on or before the 5th of each month.",
    "The security deposit of ₹" + (terms.deposit || "[DEPOSIT]") + " shall be refunded within 30 days of vacating the property, subject to deductions for damages.",
    "The Tenant shall not sub-let or assign the premises to any other person without the prior written consent of the Landlord.",
    "The Tenant shall maintain the property in good condition and shall be responsible for minor repairs.",
    "The Landlord reserves the right to visit the property with 24 hours prior notice.",
    "No structural changes shall be made to the property without the Landlord's written consent.",
    "This agreement shall be automatically terminated at the end of the tenure unless renewed by mutual consent.",
    "In case of breach of any terms, the non-defaulting party shall give 30 days written notice before termination.",
    "The Tenant shall pay electricity, water, and maintenance charges separately as per actual usage.",
    "This agreement shall be governed by the laws of " + property.state + ".",
  ];

  return (
    <div>
      {!preview ? (
        <>
          <div className="grid-2" style={{ gap: 20, marginBottom: 20 }}>
            <div className="card">
              <h3 style={{ marginBottom: 16, fontSize: 15, color: BRAND.navy }}>Landlord Details <span className="hindi-label">मकान मालिक</span></h3>
              {[["name", "Full Name", "पूरा नाम"], ["phone", "Mobile Number", "मोबाइल नंबर"], ["address", "Permanent Address", "स्थायी पता"]].map(([k, l, h]) => (
                <div className="form-group" key={k}>
                  <label>{l} <span className="hindi-label">{h}</span></label>
                  {k === "address" ? <textarea value={landlord[k]} onChange={e => setLandlord(p => ({ ...p, [k]: e.target.value }))} placeholder={l} style={{ minHeight: 60 }} /> : <input value={landlord[k]} onChange={e => setLandlord(p => ({ ...p, [k]: e.target.value }))} placeholder={l} />}
                </div>
              ))}
            </div>
            <div className="card">
              <h3 style={{ marginBottom: 16, fontSize: 15, color: BRAND.navy }}>Tenant Details <span className="hindi-label">किरायेदार</span></h3>
              {[["name", "Full Name", "पूरा नाम"], ["phone", "Mobile Number", "मोबाइल नंबर"], ["address", "Permanent Address", "स्थायी पता"]].map(([k, l, h]) => (
                <div className="form-group" key={k}>
                  <label>{l} <span className="hindi-label">{h}</span></label>
                  {k === "address" ? <textarea value={tenant[k]} onChange={e => setTenant(p => ({ ...p, [k]: e.target.value }))} placeholder={l} style={{ minHeight: 60 }} /> : <input value={tenant[k]} onChange={e => setTenant(p => ({ ...p, [k]: e.target.value }))} placeholder={l} />}
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 16, fontSize: 15, color: BRAND.navy }}>Property & Terms <span className="hindi-label">संपत्ति और शर्तें</span></h3>
            <div className="grid-2">
              <div className="form-group">
                <label>Property Type <span className="hindi-label">संपत्ति प्रकार</span></label>
                <select value={property.type} onChange={e => setProperty(p => ({ ...p, type: e.target.value }))}>
                  {["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "Shop/Commercial", "Flat", "Bungalow", "PG"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>State <span className="hindi-label">राज्य</span></label>
                <select value={property.state} onChange={e => setProperty(p => ({ ...p, state: e.target.value }))}>
                  {Object.keys(stampDuty).map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Property Address <span className="hindi-label">संपत्ति का पता</span></label>
              <textarea value={property.address} onChange={e => setProperty(p => ({ ...p, address: e.target.value }))} placeholder="Full address of the rental property" style={{ minHeight: 70 }} />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Monthly Rent (₹) <span className="hindi-label">मासिक किराया</span></label>
                <input type="number" value={terms.rent} onChange={e => setTerms(p => ({ ...p, rent: e.target.value }))} placeholder="e.g. 15000" />
              </div>
              <div className="form-group">
                <label>Security Deposit (₹) <span className="hindi-label">सिक्योरिटी डिपॉजिट</span></label>
                <input type="number" value={terms.deposit} onChange={e => setTerms(p => ({ ...p, deposit: e.target.value }))} placeholder="e.g. 45000" />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Start Date <span className="hindi-label">शुरुआत की तारीख</span></label>
                <input type="date" value={terms.start} onChange={e => setTerms(p => ({ ...p, start: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Duration (months) <span className="hindi-label">अवधि (महीने)</span></label>
                <select value={terms.duration} onChange={e => setTerms(p => ({ ...p, duration: +e.target.value }))}>
                  {[6, 11, 12, 24, 36].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Stamp duty info */}
            {stampDuty[property.state] && (
              <div style={{ background: "rgba(255,107,0,0.06)", border: "1px solid rgba(255,107,0,0.15)", borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: BRAND.primary, marginBottom: 4 }}>📜 Stamp Duty Info for {property.state}</div>
                <div style={{ fontSize: 13, color: "#5A6475" }}>{stampDuty[property.state]}</div>
              </div>
            )}
          </div>

          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: 13 }} onClick={() => setPreview(true)}>
            Generate Rent Agreement 📜
          </button>
        </>
      ) : (
        <div className="fade-in">
          <div style={{ marginBottom: 16, display: "flex", gap: 10 }} className="no-print">
            <button className="btn-secondary" onClick={() => setPreview(false)}>← Edit</button>
            <button className="btn-primary" onClick={() => window.print()}>🖨 Print / Save PDF</button>
          </div>
          <div style={{ background: "white", border: "1px solid #E8E4DC", borderRadius: 12, padding: 40, maxWidth: 720, margin: "0 auto", fontSize: 13, lineHeight: 1.8 }}>
            <div style={{ textAlign: "center", marginBottom: 28, borderBottom: `3px double ${BRAND.primary}`, paddingBottom: 20 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: BRAND.navy, marginBottom: 4 }}>RENTAL AGREEMENT</div>
              <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", color: BRAND.primary, fontSize: 16 }}>किराया समझौता</div>
              <div style={{ color: "#5A6475", fontSize: 12, marginTop: 8 }}>For Residential/Commercial premises — {terms.duration} Month Agreement</div>
            </div>

            <p style={{ marginBottom: 16 }}>
              This Rental Agreement is made and entered into on <strong>{terms.start}</strong> between:
            </p>

            <div style={{ background: "#F5F3EF", borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <strong>LANDLORD:</strong> {landlord.name || "___________"}<br />
              Address: {landlord.address || "___________"}<br />
              Mobile: +91 {landlord.phone || "___________"}
            </div>

            <div style={{ background: "#F5F3EF", borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <strong>TENANT:</strong> {tenant.name || "___________"}<br />
              Address: {tenant.address || "___________"}<br />
              Mobile: +91 {tenant.phone || "___________"}
            </div>

            <p style={{ marginBottom: 16 }}>
              <strong>PROPERTY:</strong> {property.type} at {property.address || "___________"}, {property.state}
            </p>

            <p style={{ marginBottom: 16 }}>
              The Landlord agrees to let, and the Tenant agrees to take on rent the above-mentioned property from <strong>{terms.start}</strong> to <strong>{endDate}</strong> ({terms.duration} months) under the following terms and conditions:
            </p>

            <ol style={{ paddingLeft: 20, marginBottom: 20 }}>
              {clauses.map((clause, i) => (
                <li key={i} style={{ marginBottom: 8, color: "#333" }}>{clause}</li>
              ))}
            </ol>

            <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
              <div>
                <div style={{ borderTop: "2px solid #0D1B2A", paddingTop: 8, fontSize: 12 }}>
                  Signature of Landlord<br />
                  <strong>{landlord.name || "___________"}</strong><br />
                  Date: ___________
                </div>
              </div>
              <div>
                <div style={{ borderTop: "2px solid #0D1B2A", paddingTop: 8, fontSize: 12 }}>
                  Signature of Tenant<br />
                  <strong>{tenant.name || "___________"}</strong><br />
                  Date: ___________
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20, fontSize: 11, color: "#5A6475", borderTop: "1px dashed #E8E4DC", paddingTop: 12 }}>
              Generated by ToolsWaala.in — This document is for reference only. Please consult a legal professional and get the agreement registered/notarized as per {property.state} laws.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// TOOL 7: SALARY SLIP
// ============================================================
function SalaryTool() {
  const [company, setCompany] = useState({ name: "", address: "", cin: "" });
  const [emp, setEmp] = useState({ name: "", id: "", designation: "", department: "", doj: "", pan: "", pfNo: "" });
  const [period, setPeriod] = useState({ month: new Date().toLocaleString("default", { month: "long" }), year: new Date().getFullYear().toString() });
  const [earnings, setEarnings] = useState({ basic: "", hra: "", da: "", ta: "", medical: "", special: "" });
  const [deductions, setDeductions] = useState({ pf: "", tax: "", professionalTax: "", esi: "", advance: "" });
  const [preview, setPreview] = useState(false);

  const totalEarnings = Object.values(earnings).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const totalDeductions = Object.values(deductions).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const netSalary = totalEarnings - totalDeductions;

  const autoCalcPF = () => {
    const basic = parseFloat(earnings.basic) || 0;
    const pf = Math.min(basic * 0.12, 1800);
    const hra = basic * 0.4;
    const pt = totalEarnings > 15000 ? 200 : 0;
    setDeductions(p => ({ ...p, pf: pf.toFixed(0), professionalTax: pt.toFixed(0) }));
    setEarnings(p => ({ ...p, hra: hra.toFixed(0) }));
  };

  return (
    <div>
      {!preview ? (
        <>
          <div className="grid-2" style={{ gap: 20, marginBottom: 20 }}>
            <div className="card">
              <h3 style={{ marginBottom: 16, fontSize: 15, color: BRAND.navy }}>Company Details <span className="hindi-label">कंपनी का विवरण</span></h3>
              {[["name", "Company Name", "कंपनी का नाम"], ["address", "Address", "पता"], ["cin", "CIN / Registration", "पंजीकरण"]].map(([k, l, h]) => (
                <div className="form-group" key={k}>
                  <label>{l} <span className="hindi-label">{h}</span></label>
                  {k === "address" ? <textarea value={company[k]} onChange={e => setCompany(p => ({ ...p, [k]: e.target.value }))} placeholder={l} style={{ minHeight: 60 }} /> : <input value={company[k]} onChange={e => setCompany(p => ({ ...p, [k]: e.target.value }))} placeholder={l} />}
                </div>
              ))}
            </div>
            <div className="card">
              <h3 style={{ marginBottom: 16, fontSize: 15, color: BRAND.navy }}>Employee Details <span className="hindi-label">कर्मचारी विवरण</span></h3>
              {[["name", "Employee Name", "कर्मचारी का नाम"], ["id", "Employee ID", "आईडी"], ["designation", "Designation", "पदनाम"], ["department", "Department", "विभाग"], ["pan", "PAN Number", "पैन नंबर"]].map(([k, l, h]) => (
                <div className="form-group" key={k}>
                  <label>{l} <span className="hindi-label">{h}</span></label>
                  <input value={emp[k]} onChange={e => setEmp(p => ({ ...p, [k]: e.target.value }))} placeholder={l} />
                </div>
              ))}
              <div className="grid-2">
                <div className="form-group">
                  <label>Month <span className="hindi-label">महीना</span></label>
                  <select value={period.month} onChange={e => setPeriod(p => ({ ...p, month: e.target.value }))}>
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Year <span className="hindi-label">वर्ष</span></label>
                  <input value={period.year} onChange={e => setPeriod(p => ({ ...p, year: e.target.value }))} placeholder="2025" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid-2" style={{ gap: 20, marginBottom: 20 }}>
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, color: BRAND.navy }}>Earnings <span className="hindi-label">आय</span></h3>
                <button className="btn-ghost" style={{ fontSize: 11 }} onClick={autoCalcPF}>Auto-calculate</button>
              </div>
              {[["basic", "Basic Salary", "मूल वेतन"], ["hra", "HRA", "एचआरए"], ["da", "DA (Dearness)", "महंगाई भत्ता"], ["ta", "Travel Allowance", "यात्रा भत्ता"], ["medical", "Medical Allowance", "चिकित्सा भत्ता"], ["special", "Special Allowance", "विशेष भत्ता"]].map(([k, l, h]) => (
                <div className="form-group" key={k}>
                  <label>{l} <span className="hindi-label">{h}</span></label>
                  <input type="number" value={earnings[k]} onChange={e => setEarnings(p => ({ ...p, [k]: e.target.value }))} placeholder="0" />
                </div>
              ))}
              <div style={{ textAlign: "right", fontWeight: 700, color: "#1D9E75", fontSize: 15 }}>Total: {formatINR(totalEarnings)}</div>
            </div>
            <div className="card">
              <h3 style={{ marginBottom: 16, fontSize: 15, color: BRAND.navy }}>Deductions <span className="hindi-label">कटौती</span></h3>
              {[["pf", "Provident Fund (PF)", "पीएफ"], ["tax", "Income Tax (TDS)", "आयकर"], ["professionalTax", "Professional Tax", "व्यावसायिक कर"], ["esi", "ESI", "ईएसआई"], ["advance", "Salary Advance", "अग्रिम वेतन"]].map(([k, l, h]) => (
                <div className="form-group" key={k}>
                  <label>{l} <span className="hindi-label">{h}</span></label>
                  <input type="number" value={deductions[k]} onChange={e => setDeductions(p => ({ ...p, [k]: e.target.value }))} placeholder="0" />
                </div>
              ))}
              <div style={{ textAlign: "right", fontWeight: 700, color: "#E24B4A", fontSize: 15 }}>Total: {formatINR(totalDeductions)}</div>
            </div>
          </div>

          <div className="result-box" style={{ marginBottom: 20, textAlign: "center" }}>
            <div style={{ fontSize: 13, color: "#5A6475", marginBottom: 6 }}>Net Take-Home Salary / शुद्ध वेतन</div>
            <div style={{ fontSize: 42, fontWeight: 700, color: BRAND.primary }}>{formatINR(netSalary)}</div>
          </div>

          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: 13 }} onClick={() => setPreview(true)}>
            Generate Salary Slip 💼
          </button>
        </>
      ) : (
        <div className="fade-in">
          <div style={{ marginBottom: 16, display: "flex", gap: 10 }} className="no-print">
            <button className="btn-secondary" onClick={() => setPreview(false)}>← Edit</button>
            <button className="btn-primary" onClick={() => window.print()}>🖨 Print / Save PDF</button>
          </div>
          <div style={{ background: "white", border: "1px solid #E8E4DC", borderRadius: 12, padding: 32, maxWidth: 720, margin: "0 auto", fontSize: 13 }}>
            {/* Header */}
            <div style={{ background: BRAND.navy, color: "white", borderRadius: 8, padding: "20px 24px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{company.name || "Company Name"}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>{company.address}</div>
                {company.cin && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>CIN: {company.cin}</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: BRAND.accent }}>SALARY SLIP</div>
                <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.65)" }}>वेतन पर्ची</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>{period.month} {period.year}</div>
              </div>
            </div>

            {/* Employee Info */}
            <div style={{ background: "#F5F3EF", borderRadius: 8, padding: 16, marginBottom: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[["Employee Name", emp.name], ["Employee ID", emp.id], ["Designation", emp.designation], ["Department", emp.department], ["PAN", emp.pan], ["Pay Period", `${period.month} ${period.year}`]].map(([l, v]) => v && (
                  <div key={l}>
                    <div style={{ fontSize: 10, color: "#5A6475", textTransform: "uppercase", letterSpacing: 0.5 }}>{l}</div>
                    <div style={{ fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Earnings & Deductions */}
            <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: BRAND.navy, marginBottom: 8, padding: "6px 10px", background: "rgba(29,185,84,0.1)", borderRadius: 6, borderLeft: `3px solid #1DB954` }}>EARNINGS / आय</div>
                {[["Basic Salary", earnings.basic], ["HRA", earnings.hra], ["Dearness Allowance", earnings.da], ["Travel Allowance", earnings.ta], ["Medical Allowance", earnings.medical], ["Special Allowance", earnings.special]].filter(([, v]) => v).map(([l, v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #F0EDE8" }}>
                    <span style={{ color: "#5A6475" }}>{l}</span>
                    <span style={{ fontWeight: 600 }}>{formatINR(parseFloat(v))}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontWeight: 700, borderTop: "2px solid #1DB954", marginTop: 4 }}>
                  <span>Total Earnings</span>
                  <span style={{ color: "#1DB954" }}>{formatINR(totalEarnings)}</span>
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: BRAND.navy, marginBottom: 8, padding: "6px 10px", background: "rgba(226,75,74,0.08)", borderRadius: 6, borderLeft: `3px solid #E24B4A` }}>DEDUCTIONS / कटौती</div>
                {[["PF", deductions.pf], ["Income Tax (TDS)", deductions.tax], ["Professional Tax", deductions.professionalTax], ["ESI", deductions.esi], ["Salary Advance", deductions.advance]].filter(([, v]) => v).map(([l, v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #F0EDE8" }}>
                    <span style={{ color: "#5A6475" }}>{l}</span>
                    <span style={{ fontWeight: 600, color: "#E24B4A" }}>{formatINR(parseFloat(v))}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontWeight: 700, borderTop: "2px solid #E24B4A", marginTop: 4 }}>
                  <span>Total Deductions</span>
                  <span style={{ color: "#E24B4A" }}>{formatINR(totalDeductions)}</span>
                </div>
              </div>
            </div>

            <div style={{ background: BRAND.navy, color: "white", borderRadius: 8, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.65)" }}>शुद्ध वेतन</div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>NET TAKE-HOME SALARY</div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: BRAND.accent }}>{formatINR(netSalary)}</div>
            </div>

            <div style={{ fontSize: 11, color: "#5A6475", display: "flex", justifyContent: "space-between", borderTop: "1px solid #E8E4DC", paddingTop: 12 }}>
              <span>This is a computer-generated salary slip and does not require a signature.</span>
              <span>Generated by ToolsWaala.in</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// TOOL 8: BUSINESS NAME AI
// ============================================================
function BizNameTool() {
  const [industry, setIndustry] = useState("");
  const [keywords, setKeywords] = useState("");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!industry || !keywords) { setError("Please fill in industry and keywords."); return; }
    setError("");
    setLoading(true);
    setResults([]);

    try {
      const prompt = `You are a creative Indian business naming expert. Generate exactly 10 unique business name suggestions for an Indian business.

Industry: ${industry}
Keywords/Ideas: ${keywords}
Preferred Language Style: ${language}

For each name, provide:
1. The business name
2. Meaning or rationale (1-2 sentences)
3. A catchy tagline
4. Domain hint (e.g., likely .in or .com domain)

Respond ONLY with a JSON array of 10 objects, no preamble, no markdown. Format:
[{"name":"...","meaning":"...","tagline":"...","domain":"..."}]

Make names creative, memorable, and suitable for the Indian market. Mix traditional and modern sounds. For Hinglish, blend Hindi and English naturally.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content?.map(c => c.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResults(parsed);
    } catch (e) {
      setError("Could not generate names. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const industries = ["Retail / Kirana Store", "Restaurant / Dhaba", "Clothing / Fashion", "Technology / IT", "Healthcare", "Education / Tuition", "Real Estate", "Logistics / Transport", "Beauty / Salon", "Jewellery", "Agriculture", "Finance / Loans", "Travel / Tourism", "Manufacturing"];

  return (
    <div>
      <div className="grid-2" style={{ gap: 24 }}>
        <div className="card">
          <div style={{ background: "linear-gradient(135deg, rgba(255,107,0,0.08), rgba(255,107,0,0.03))", borderRadius: 10, padding: "14px 16px", marginBottom: 18, display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 28 }}>✨</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: BRAND.navy }}>AI-Powered Name Generator</div>
              <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 12, color: BRAND.primary }}>एआई से अपने बिज़नेस का नाम खोजें</div>
            </div>
          </div>

          <div className="form-group">
            <label>Industry / Business Type <span className="hindi-label">उद्योग का प्रकार</span></label>
            <select value={industry} onChange={e => setIndustry(e.target.value)}>
              <option value="">Select industry...</option>
              {industries.map(i => <option key={i}>{i}</option>)}
            </select>
            <input value={industry} onChange={e => setIndustry(e.target.value)} placeholder="Or type your industry..." style={{ marginTop: 8 }} />
          </div>

          <div className="form-group">
            <label>Keywords / Ideas <span className="hindi-label">मुख्य विचार / कीवर्ड</span></label>
            <textarea value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="e.g. fresh, natural, quick delivery, premium, family" style={{ minHeight: 80 }} />
            <div style={{ fontSize: 11, color: "#5A6475", marginTop: 4 }}>Tip: Add 3-5 keywords that describe your business values</div>
          </div>

          <div className="form-group">
            <label>Language Style <span className="hindi-label">भाषा शैली</span></label>
            <div style={{ display: "flex", gap: 8 }}>
              {["English", "Hindi", "Hinglish"].map(l => (
                <button key={l} onClick={() => setLanguage(l)}
                  style={{ flex: 1, padding: "10px 0", border: `1.5px solid ${language === l ? BRAND.primary : "#E8E4DC"}`, borderRadius: 8, background: language === l ? BRAND.primary : "white", color: language === l ? "white" : "#5A6475", cursor: "pointer", fontSize: 13, fontFamily: "'Sora', sans-serif", fontWeight: language === l ? 700 : 400, transition: "all 0.15s" }}>
                  {l}
                  <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 9, marginTop: 2, opacity: 0.8 }}>
                    {l === "English" ? "अंग्रेज़ी" : l === "Hindi" ? "हिंदी" : "हिंग्लिश"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {error && <div style={{ color: "#E24B4A", fontSize: 13, marginBottom: 12, padding: "8px 12px", background: "rgba(226,75,74,0.06)", borderRadius: 8 }}>{error}</div>}

          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: 13, fontSize: 15 }} onClick={generate} disabled={loading}>
            {loading ? (
              <><span className="spinner" style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", marginRight: 8 }} />Generating names...</>
            ) : "✨ Generate 10 Business Names"}
          </button>
        </div>

        <div>
          {results.length > 0 ? (
            <div className="fade-in">
              <div style={{ marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: 15, color: BRAND.navy }}>10 Name Suggestions</h3>
                <button className="btn-ghost" style={{ fontSize: 12 }} onClick={generate}>Regenerate ↺</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {results.map((r, i) => (
                  <div key={i} style={{ background: "white", border: "1px solid #E8E4DC", borderRadius: 12, padding: 16, transition: "all 0.15s", cursor: "default" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND.primary; e.currentTarget.style.boxShadow = `0 4px 16px rgba(255,107,0,0.1)`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8E4DC"; e.currentTarget.style.boxShadow = ""; }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: `hsl(${i * 36}, 70%, 50%)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 17, fontWeight: 700, color: BRAND.navy, marginBottom: 3 }}>{r.name}</div>
                        <div style={{ fontSize: 12, color: BRAND.primary, fontStyle: "italic", marginBottom: 6 }}>{r.tagline}</div>
                        <div style={{ fontSize: 12, color: "#5A6475", marginBottom: 8 }}>{r.meaning}</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ background: "rgba(24,95,165,0.08)", color: "#185FA5", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600 }}>🌐 {r.domain}</span>
                          <button onClick={() => navigator.clipboard?.writeText(r.name).then(() => alert(`"${r.name}" copied!`))} className="btn-ghost" style={{ fontSize: 11, padding: "2px 8px" }}>Copy name</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300 }}>
              <div className="spinner" style={{ width: 48, height: 48, border: "3px solid rgba(255,107,0,0.15)", borderTop: `3px solid ${BRAND.primary}`, borderRadius: "50%", marginBottom: 16 }} />
              <p style={{ color: "#5A6475", fontSize: 14 }}>Claude AI is thinking of creative names...</p>
              <p style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", color: BRAND.primary, fontSize: 13, marginTop: 6 }}>एआई नाम सोच रहा है...</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, color: "#5A6475", textAlign: "center" }}>
              <div style={{ fontSize: 60, marginBottom: 12 }}>✨</div>
              <p style={{ fontSize: 15, fontWeight: 600 }}>AI Business Name Generator</p>
              <p style={{ fontSize: 13, marginTop: 6 }}>Fill in your details and generate 10 creative names</p>
              <p style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 12, color: BRAND.primary, marginTop: 8 }}>10 रचनात्मक नाम पाएं</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [page, setPage] = useState("home");

  const toolPages = {
    "upi": { title: "UPI Payment Page Generator", hindi: "यूपीआई पेमेंट पेज बनाएं", component: <UpiTool /> },
    "gst-invoice": { title: "GST Invoice Generator", hindi: "जीएसटी चालान बनाएं", component: <GstInvoiceTool /> },
    "qr": { title: "QR Code Generator", hindi: "क्यूआर कोड बनाएं", component: <QrTool /> },
    "emi": { title: "EMI Calculator", hindi: "ईएमआई कैलकुलेटर", component: <EmiTool /> },
    "gst-calc": { title: "GST Calculator", hindi: "जीएसटी कैलकुलेटर", component: <GstCalcTool /> },
    "rent": { title: "Rent Agreement Generator", hindi: "किराया समझौता बनाएं", component: <RentTool /> },
    "salary": { title: "Salary Slip Generator", hindi: "वेतन पर्ची बनाएं", component: <SalaryTool /> },
    "bizname": { title: "AI Business Name Generator", hindi: "एआई से बिज़नेस नाम", component: <BizNameTool /> },
  };

  return (
    <>
      <style>{globalStyle}</style>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar active={page} setPage={setPage} />
        <main style={{ flex: 1 }}>
          {page === "home" ? (
            <HomePage setPage={setPage} />
          ) : toolPages[page] ? (
            <PageWrapper title={toolPages[page].title} hindi={toolPages[page].hindi} setPage={setPage}>
              {toolPages[page].component}
            </PageWrapper>
          ) : (
            <div style={{ textAlign: "center", padding: 60 }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>🔍</div>
              <h2>Page not found</h2>
              <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => setPage("home")}>Go Home</button>
            </div>
          )}
        </main>
        <Footer setPage={setPage} />
      </div>
    </>
  );
}
