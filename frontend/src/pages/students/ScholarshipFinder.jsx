import { useState } from "react";
import { BRAND, STUDENT_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };

const SCHOLARSHIPS = [
  { name: "NSP Post-Matric Scholarship (SC/ST/OBC)", body: "Central Govt", amount: "Up to ₹1.2L/year", eligibility: "SC/ST/OBC students", level: "UG/PG", link: "https://scholarships.gov.in/" },
  { name: "Pragati Scholarship (Girls)", body: "AICTE", amount: "₹50,000/year", eligibility: "Girls in technical degree", level: "UG/Diploma", link: "https://www.aicte-india.org/" },
  { name: "INSPIRE Scholarship", body: "DST", amount: "₹80,000/year", eligibility: "Top 1% in Class 12 (Science)", level: "UG/PG", link: "https://online-inspire.gov.in/" },
  { name: "Saksham Scholarship (Divyangjan)", body: "AICTE", amount: "₹50,000/year", eligibility: "Specially-abled students", level: "UG/Diploma", link: "https://www.aicte-india.org/" },
  { name: "Ishan Uday Special Scholarship", body: "UGC", amount: "Up to ₹7.8K/month", eligibility: "Students from North East India", level: "UG", link: "https://www.ugc.ac.in/" },
  { name: "PM Scholarship Scheme", body: "Central Govt", amount: "₹2.5K - 3K/month", eligibility: "Wards of Ex-servicemen/CAPF", level: "UG/PG", link: "https://ksb.gov.in/" },
  { name: "HDFC Badhte Kadam Scholarship", body: "HDFC Bank", amount: "Up to ₹1L", eligibility: "Merit-based / Need-based", level: "Class 11 - UG", link: "https://www.buddy4study.com/" },
  { name: "Reliance Foundation Scholarship", body: "Reliance", amount: "Up to ₹2L", eligibility: "Merit-cum-means", level: "UG", link: "https://www.reliancefoundation.org/" },
  { name: "Swami Vivekanand Single Girl Child", body: "UGC", amount: "₹31,000/month", eligibility: "Single girl child (Social Science)", level: "PhD", link: "https://www.ugc.ac.in/" },
  { name: "Begum Hazrat Mahal National", body: "MAEF", amount: "₹5K - 6K/year", eligibility: "Minority Girls", level: "Class 9-12", link: "https://www.maef.nic.in/" },
  { name: "UP Post Matric Scholarship", body: "UP Govt", amount: "Varies", eligibility: "Residents of Uttar Pradesh", level: "UG/PG", link: "https://scholarship.up.gov.in/" },
  { name: "MahaDBT Scholarship", body: "Maharashtra Govt", amount: "Varies", eligibility: "Residents of Maharashtra", level: "All levels", link: "https://mahadbt.maharashtra.gov.in/" },
  { name: "L'Oréal India For Young Women", body: "L'Oréal", amount: "₹2.5L total", eligibility: "Girls in Science", level: "UG", link: "https://www.loreal.com/" },
  { name: "TATA Trust Scholarship", body: "Tata Trusts", amount: "Varies", eligibility: "Merit-based", level: "UG/PG", link: "https://www.tatatrusts.org/" },
];

export default function ScholarshipFinder() {
  const [filter, setFilter] = useState("All");

  const levels = ["All", "UG", "PG", "PhD", "Class 9-12"];
  const filtered = filter === "All" ? SCHOLARSHIPS : SCHOLARSHIPS.filter(s => s.level.includes(filter));

  return (
    <div className="fade-in">
      <div style={{ display: "flex", gap: 8, marginBottom: 32, overflowX: "auto", paddingBottom: 4 }}>
        {levels.map(l => (
          <button key={l} onClick={() => setFilter(l)} style={{ padding: "8px 16px", borderRadius: 10, border: "none", cursor: "pointer", background: filter === l ? STUDENT_BRAND.accent : "rgba(255,255,255,0.05)", color: "white", fontSize: 13, fontWeight: 600 }}>{l}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 20 }}>
        {filtered.map((s, i) => (
          <div key={i} style={cs}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, color: "white", margin: 0, maxWidth: "80%" }}>{s.name}</h3>
              <div style={{ fontSize: 24 }}>🏆</div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              <span style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(124,58,237,0.1)", color: STUDENT_BRAND.accent, fontSize: 11, fontWeight: 700 }}>{s.body}</span>
              <span style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(255,255,255,0.05)", color: BRAND.textSecondary, fontSize: 11 }}>{s.level}</span>
            </div>
            <div style={{ background: "rgba(0,0,0,0.2)", padding: 16, borderRadius: 12, marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: BRAND.textSecondary, marginBottom: 4 }}>Scholarship Amount</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#4CAF50" }}>{s.amount}</div>
              <div style={{ fontSize: 12, color: BRAND.textSecondary, marginTop: 12 }}><strong>Eligibility:</strong> {s.eligibility}</div>
            </div>
            <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", padding: "12px", borderRadius: 10, background: STUDENT_BRAND.accent, color: "white", textDecoration: "none", fontWeight: 700, fontSize: 14 }}>Apply on Official Site →</a>
          </div>
        ))}
      </div>

      <div style={{ ...cs, marginTop: 40, textAlign: "center", background: "rgba(124,58,237,0.05)", borderColor: STUDENT_BRAND.accent + "30" }}>
        <p style={{ margin: 0, color: BRAND.textSecondary }}>Looking for more? New scholarships are added weekly. Keep checking back!</p>
      </div>
    </div>
  );
}
