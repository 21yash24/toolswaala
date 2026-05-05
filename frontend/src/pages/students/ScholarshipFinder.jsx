import { useState, useMemo } from "react";
import { BRAND, STUDENT_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24, display: "flex", flexDirection: "column" };

const getDeadline = (daysAhead) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
};

const SCHOLARSHIPS = [
  // Existing India Scholarships
  { name: "NSP Post-Matric Scholarship", provider: "Central Govt", amount: "Up to ₹1.2L/yr", eligibility: "SC/ST/OBC/Minority students", level: "UG/PG", target: "Reserved", link: "https://scholarships.gov.in/", days: 15, verified: true },
  { name: "Pragati Scholarship", provider: "AICTE", amount: "₹50,000/year", eligibility: "Girls pursuing Technical Degree", level: "UG", target: "Women", link: "https://www.aicte-india.org/", days: 45, verified: true },
  { name: "INSPIRE Scholarship", provider: "DST Govt", amount: "₹80,000/year", eligibility: "Top 1% in Class 12 Science", level: "UG/PG", target: "All", link: "https://online-inspire.gov.in/", days: 8, verified: true },
  { name: "Kotak Kanya Scholarship", provider: "Kotak Foundation", amount: "₹1.5L/year", eligibility: "Girls from low-income families", level: "UG", target: "Women", link: "https://kotakeducation.org/", days: 22, verified: true },
  { name: "SBIF Asha Scholarship", provider: "SBI Foundation", amount: "₹15,000", eligibility: "Class 6-12 students", level: "School", target: "All", link: "https://www.sbifoundation.in/", days: 5, verified: true },
  { name: "HDFC Badhte Kadam", provider: "HDFC Bank", amount: "Up to ₹1L", eligibility: "Merit-cum-means, Crisis hit families", level: "School/UG", target: "All", link: "https://www.buddy4study.com/", days: 30, verified: true },
  { name: "Reliance Foundation", provider: "Reliance", amount: "Up to ₹2L", eligibility: "Merit-cum-means (Income < 15L)", level: "UG", target: "All", link: "https://www.reliancefoundation.org/", days: 60, verified: true },
  
  // New Study Abroad Scholarships
  { name: "Chevening Scholarships", provider: "UK Government", amount: "Fully Funded", eligibility: "Mid-career professionals to study in UK", level: "Study Abroad (PG)", target: "All", link: "https://www.chevening.org/", days: 90, verified: true },
  { name: "Fulbright-Nehru Master's", provider: "USIEF", amount: "Fully Funded", eligibility: "Indian students for Master's in US", level: "Study Abroad (PG)", target: "All", link: "https://www.usief.org.in/", days: 45, verified: true },
  { name: "Erasmus Mundus", provider: "European Union", amount: "€1000/month + Tuition", eligibility: "Joint Master's degrees in Europe", level: "Study Abroad (PG)", target: "All", link: "https://erasmus-plus.ec.europa.eu/", days: 120, verified: true },
  { name: "Inlaks Shivdasani", provider: "Inlaks Foundation", amount: "Up to $100,000", eligibility: "Study at top US/European universities", level: "Study Abroad (PG)", target: "All", link: "https://www.inlaksfoundation.org/", days: 20, verified: true },
  { name: "Felix Scholarships", provider: "Felix Trust", amount: "100% Tuition + Living", eligibility: "Underprivileged students for Oxford/Reading", level: "Study Abroad (PG)", target: "All", link: "https://www.felixscholarship.org/", days: 35, verified: true }
].sort((a, b) => a.days - b.days);

export default function ScholarshipFinder() {
  const [levelFilter, setLevelFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filtered = useMemo(() => {
    return SCHOLARSHIPS.filter(s => {
      let matchLevel = false;
      if (levelFilter === "All") matchLevel = true;
      else if (levelFilter === "Study Abroad") matchLevel = s.level.includes("Abroad");
      else matchLevel = s.level.includes(levelFilter) && !s.level.includes("Abroad"); // Only show Indian scholarships for UG/PG/School
      
      const matchCat = categoryFilter === "All" || s.target === "All" || s.target === categoryFilter;
      return matchLevel && matchCat;
    });
  }, [levelFilter, categoryFilter]);

  return (
    <div className="fade-in">
      <div style={{ ...cs, marginBottom: 32, background: "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(20,184,166,0.1) 100%)", borderColor: "rgba(16,185,129,0.2)", textAlign: "center", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: BRAND.text, marginBottom: 12 }}>Find Your Perfect Scholarship 🏆</h2>
        <p style={{ color: BRAND.textSecondary, maxWidth: 600, margin: "0 auto", fontSize: 16 }}>Discover fully-funded government, private, and international study abroad scholarships tailored for Indian students.</p>
      </div>

      <div style={{ ...cs, padding: 20, marginBottom: 32, flexDirection: "row", flexWrap: "wrap", gap: 32, alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 13, color: BRAND.textSecondary, marginBottom: 12, fontWeight: 700 }}>📚 EDUCATION LEVEL</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["All", "School", "UG", "PG", "Study Abroad"].map(l => (
              <button key={l} onClick={() => setLevelFilter(l)} style={{ padding: "8px 16px", borderRadius: 10, border: `1px solid ${levelFilter === l ? STUDENT_BRAND.accent : BRAND.border}`, cursor: "pointer", background: levelFilter === l ? `${STUDENT_BRAND.accent}20` : "transparent", color: levelFilter === l ? STUDENT_BRAND.accent : BRAND.text, fontSize: 13, fontWeight: 600, transition: "0.2s" }}>{l === "Study Abroad" ? "✈️ Study Abroad" : l}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13, color: BRAND.textSecondary, marginBottom: 12, fontWeight: 700 }}>👤 CATEGORY / GENDER</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["All", "Women", "Reserved"].map(c => (
              <button key={c} onClick={() => setCategoryFilter(c)} style={{ padding: "8px 16px", borderRadius: 10, border: `1px solid ${categoryFilter === c ? STUDENT_BRAND.accent : BRAND.border}`, cursor: "pointer", background: categoryFilter === c ? `${STUDENT_BRAND.accent}20` : "transparent", color: categoryFilter === c ? STUDENT_BRAND.accent : BRAND.text, fontSize: 13, fontWeight: 600, transition: "0.2s" }}>{c === "Reserved" ? "SC/ST/OBC/Minority" : c}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
        {filtered.map((s, i) => (
          <div key={i} style={{ ...cs, display: "flex", flexDirection: "column", padding: 24 }} className="hover-lift">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, color: BRAND.text, margin: 0, lineHeight: 1.4 }}>{s.name}</h3>
              {s.verified && <div title="Verified Scholarship" style={{ background: "rgba(16,185,129,0.1)", color: "#10B981", padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 800, whiteSpace: "nowrap", marginLeft: 12 }}>✓ VERIFIED</div>}
            </div>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              <span style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(255,255,255,0.05)", border: `1px solid ${BRAND.border}`, color: BRAND.textSecondary, fontSize: 12, fontWeight: 600 }}>🏢 {s.provider}</span>
              <span style={{ padding: "4px 10px", borderRadius: 6, background: s.level.includes("Abroad") ? "rgba(124, 58, 237, 0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${s.level.includes("Abroad") ? "rgba(124, 58, 237, 0.3)" : BRAND.border}`, color: s.level.includes("Abroad") ? STUDENT_BRAND.accent : BRAND.textSecondary, fontSize: 12, fontWeight: 700 }}>{s.level.includes("Abroad") ? "✈️ Study Abroad" : `🎓 ${s.level}`}</span>
            </div>

            <div style={{ background: "rgba(0,0,0,0.2)", border: `1px solid ${BRAND.border}`, padding: 16, borderRadius: 12, marginBottom: 20, flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: BRAND.textSecondary }}>Reward Amount</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#4CAF50" }}>{s.amount}</span>
              </div>
              <div style={{ fontSize: 13, color: BRAND.textSecondary, lineHeight: 1.5 }}>
                <strong style={{ color: BRAND.text }}>Eligibility:</strong> {s.eligibility}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: s.days <= 10 ? "#EF4444" : BRAND.textSecondary, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16 }}>⏱️</span> {s.days <= 10 ? `Expires in ${s.days} days!` : `Deadline: ${getDeadline(s.days)}`}
              </div>
              <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ padding: "10px 20px", borderRadius: 10, background: STUDENT_BRAND.accent, color: "white", textDecoration: "none", fontWeight: 700, fontSize: 13, transition: "0.2s" }}>
                Apply Now →
              </a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ ...cs, textAlign: "center", padding: 60, border: `1px dashed ${BRAND.border}` }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h3 style={{ color: BRAND.text, marginBottom: 8, fontSize: 20 }}>No matches found</h3>
          <p style={{ color: BRAND.textSecondary }}>Try adjusting your filters to see more scholarships.</p>
          <button onClick={() => { setLevelFilter("All"); setCategoryFilter("All"); }} style={{ marginTop: 16, padding: "10px 20px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: `1px solid ${BRAND.border}`, color: BRAND.text, cursor: "pointer", fontWeight: 600 }}>Clear Filters</button>
        </div>
      )}
    </div>
  );
}
