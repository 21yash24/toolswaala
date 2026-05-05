import { useState, useMemo } from "react";
import { BRAND, STUDENT_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24, display: "flex", flexDirection: "column" };

const getDeadline = (daysAhead) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
};

const SCHOLARSHIPS = [
  { name: "NSP Post-Matric Scholarship", provider: "Central Govt", amount: "Up to ₹1.2L/yr", eligibility: "SC/ST/OBC/Minority students", level: "UG/PG", target: "Reserved", link: "https://scholarships.gov.in/", days: 15, verified: true },
  { name: "Pragati Scholarship", provider: "AICTE", amount: "₹50,000/year", eligibility: "Girls pursuing Technical Degree", level: "UG", target: "Women", link: "https://www.aicte-india.org/", days: 45, verified: true },
  { name: "INSPIRE Scholarship", provider: "DST Govt", amount: "₹80,000/year", eligibility: "Top 1% in Class 12 Science", level: "UG/PG", target: "All", link: "https://online-inspire.gov.in/", days: 8, verified: true },
  { name: "Kotak Kanya Scholarship", provider: "Kotak Foundation", amount: "₹1.5L/year", eligibility: "Girls from low-income families", level: "UG", target: "Women", link: "https://kotakeducation.org/", days: 22, verified: true },
  { name: "SBIF Asha Scholarship", provider: "SBI Foundation", amount: "₹15,000", eligibility: "Class 6-12 students", level: "School", target: "All", link: "https://www.sbifoundation.in/", days: 5, verified: true },
  { name: "HDFC Badhte Kadam", provider: "HDFC Bank", amount: "Up to ₹1L", eligibility: "Merit-cum-means, Crisis hit families", level: "School/UG", target: "All", link: "https://www.buddy4study.com/", days: 30, verified: true },
  { name: "Reliance Foundation", provider: "Reliance", amount: "Up to ₹2L", eligibility: "Merit-cum-means (Income < 15L)", level: "UG", target: "All", link: "https://www.reliancefoundation.org/", days: 60, verified: true },
  { name: "Vidyasaarathi Portal", provider: "NSDL CSR", amount: "Varies", eligibility: "Corporate CSR Scholarships", level: "All", target: "All", link: "https://www.vidyasaarathi.co.in/", days: 12, verified: true },
  { name: "UP Post Matric", provider: "UP Govt", amount: "Varies", eligibility: "UP Residents, Income < 2L", level: "UG/PG", target: "All", link: "https://scholarship.up.gov.in/", days: 18, verified: true },
  { name: "MahaDBT Scholarship", provider: "Maharashtra Govt", amount: "100% Tuition Fee", eligibility: "Maharashtra Domicile", level: "All", target: "All", link: "https://mahadbt.maharashtra.gov.in/", days: 25, verified: true },
  { name: "L'Oréal India For Women", provider: "L'Oréal", amount: "₹2.5L total", eligibility: "Girls in Science (PCM/PCB)", level: "UG", target: "Women", link: "https://www.loreal.com/", days: 4, verified: true },
  { name: "ONGC Foundation", provider: "ONGC", amount: "₹48,000/year", eligibility: "SC/ST/OBC pursuing Engg/MBBS", level: "UG/PG", target: "Reserved", link: "https://www.ongcscholar.org/", days: 35, verified: true },
  { name: "OASIS Scholarship", provider: "West Bengal Govt", amount: "Varies", eligibility: "SC/ST/OBC of West Bengal", level: "UG/PG", target: "Reserved", link: "https://oasis.gov.in/", days: 10, verified: true },
  { name: "PM Yasasvi", provider: "MoSJE", amount: "Up to ₹1.25L", eligibility: "OBC/EBC/DNT Class 9-12", level: "School", target: "Reserved", link: "https://yet.nta.ac.in/", days: 40, verified: true }
].sort((a, b) => a.days - b.days);

export default function ScholarshipFinder() {
  const [levelFilter, setLevelFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filtered = useMemo(() => {
    return SCHOLARSHIPS.filter(s => {
      const matchLevel = levelFilter === "All" || s.level.includes(levelFilter) || s.level === "All" || (levelFilter === "School" && s.level.includes("School"));
      const matchCat = categoryFilter === "All" || s.target === "All" || s.target === categoryFilter;
      return matchLevel && matchCat;
    });
  }, [levelFilter, categoryFilter]);

  return (
    <div className="fade-in">
      <div style={{ ...cs, padding: 20, marginBottom: 32, flexDirection: "row", flexWrap: "wrap", gap: 24 }}>
        <div>
          <div style={{ fontSize: 13, color: BRAND.textSecondary, marginBottom: 8, fontWeight: 600 }}>EDUCATION LEVEL</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["All", "School", "UG", "PG"].map(l => (
              <button key={l} onClick={() => setLevelFilter(l)} style={{ padding: "8px 16px", borderRadius: 10, border: `1px solid ${levelFilter === l ? STUDENT_BRAND.accent : BRAND.border}`, cursor: "pointer", background: levelFilter === l ? `${STUDENT_BRAND.accent}20` : "transparent", color: levelFilter === l ? STUDENT_BRAND.accent : BRAND.text, fontSize: 13, fontWeight: 600, transition: "0.2s" }}>{l}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13, color: BRAND.textSecondary, marginBottom: 8, fontWeight: 600 }}>CATEGORY / GENDER</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["All", "Women", "Reserved"].map(c => (
              <button key={c} onClick={() => setCategoryFilter(c)} style={{ padding: "8px 16px", borderRadius: 10, border: `1px solid ${categoryFilter === c ? STUDENT_BRAND.accent : BRAND.border}`, cursor: "pointer", background: categoryFilter === c ? `${STUDENT_BRAND.accent}20` : "transparent", color: categoryFilter === c ? STUDENT_BRAND.accent : BRAND.text, fontSize: 13, fontWeight: 600, transition: "0.2s" }}>{c === "Reserved" ? "SC/ST/OBC/Minority" : c}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
        {filtered.map((s, i) => (
          <div key={i} style={cs} className="hover-lift">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <h3 style={{ fontSize: 18, color: BRAND.text, margin: 0, lineHeight: 1.3 }}>{s.name}</h3>
              {s.verified && <div title="Verified Scholarship" style={{ background: "rgba(16,185,129,0.1)", color: "#10B981", padding: "4px 8px", borderRadius: 20, fontSize: 11, fontWeight: 800 }}>✓ VERIFIED</div>}
            </div>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              <span style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(255,255,255,0.05)", border: `1px solid ${BRAND.border}`, color: BRAND.textSecondary, fontSize: 12, fontWeight: 600 }}>🏢 {s.provider}</span>
              <span style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(255,255,255,0.05)", border: `1px solid ${BRAND.border}`, color: BRAND.textSecondary, fontSize: 12, fontWeight: 600 }}>🎓 {s.level}</span>
            </div>

            <div style={{ background: "rgba(0,0,0,0.2)", border: `1px solid ${BRAND.border}`, padding: 16, borderRadius: 12, marginBottom: 20, flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: BRAND.textSecondary }}>Reward Amount</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: "#4CAF50" }}>{s.amount}</span>
              </div>
              <div style={{ fontSize: 13, color: BRAND.textSecondary, lineHeight: 1.5 }}>
                <strong style={{ color: BRAND.text }}>Eligibility:</strong> {s.eligibility}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: s.days <= 10 ? "#EF4444" : BRAND.textSecondary, display: "flex", alignItems: "center", gap: 4 }}>
                ⏱️ {s.days <= 10 ? `Expires in ${s.days} days!` : `Deadline: ${getDeadline(s.days)}`}
              </div>
              <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ padding: "10px 20px", borderRadius: 10, background: STUDENT_BRAND.accent, color: "white", textDecoration: "none", fontWeight: 700, fontSize: 13, transition: "0.2s" }}>
                Apply Now →
              </a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ ...cs, textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
          <h3 style={{ color: BRAND.text, marginBottom: 8 }}>No matches found</h3>
          <p style={{ color: BRAND.textSecondary }}>Try adjusting your filters to see more scholarships.</p>
          <button onClick={() => { setLevelFilter("All"); setCategoryFilter("All"); }} style={{ marginTop: 16, padding: "8px 16px", borderRadius: 8, background: "none", border: `1px solid ${BRAND.border}`, color: BRAND.text, cursor: "pointer" }}>Clear Filters</button>
        </div>
      )}
    </div>
  );
}
