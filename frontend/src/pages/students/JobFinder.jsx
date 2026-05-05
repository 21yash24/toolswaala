import { useState } from "react";
import { BRAND, STUDENT_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 20 };

const LATEST_JOBS = [
  { title: "SSC GD Constable 2024 Apply Online", post: "Constable", status: "Active", link: "https://ssc.nic.in/" },
  { title: "UPSC Civil Services (IAS) 2024 Prelims", post: "IAS/IFS", status: "Apply Now", link: "https://upsc.gov.in/" },
  { title: "Railway RRB ALP Recruitment 2024", post: "Loco Pilot", status: "5696 Posts", link: "https://indianrailways.gov.in/" },
  { title: "IBPS PO Phase II Exam Result", post: "PO", status: "Check Now", link: "https://ibps.in/" },
  { title: "SBI Clerk Mains Admit Card", post: "Clerk", status: "Download", link: "https://sbi.co.in/" },
  { title: "Indian Army Agniveer Rally 2024", post: "Agniveer", status: "Registration", link: "https://joinindianarmy.nic.in/" },
  { title: "SSC CGL 2024 Tier I Notification", post: "Group B/C", status: "Coming Soon", link: "https://ssc.nic.in/" },
  { title: "UPPSC PCS 2024 Application", post: "PCS", status: "Apply Online", link: "https://uppsc.up.nic.in/" },
];

const ADMIT_CARDS = [
  { title: "JEE Main 2024 Session 2", date: "Download Now", link: "https://jeemain.nta.ac.in/" },
  { title: "SSC CHSL Tier II Call Letter", date: "Out Now", link: "https://ssc.nic.in/" },
  { title: "UPSC CDS I 2024 Admit Card", date: "Download", link: "https://upsc.gov.in/" },
  { title: "CUET UG 2024 Admit Card", date: "Check Status", link: "https://cuet.samarth.ac.in/" },
];

const RESULTS = [
  { title: "CBSE Class 10th & 12th Result", date: "May 2024", link: "https://cbseresults.nic.in/" },
  { title: "SSC MTS 2023 Final Selection List", date: "Declared", link: "https://ssc.nic.in/" },
  { title: "GATE 2024 Final Score Card", date: "Out Now", link: "https://gate2024.iisc.ac.in/" },
  { title: "Bihar Board 12th Result 2024", date: "Declared", link: "http://biharboardonline.bihar.gov.in/" },
];

const PRIVATE_JOBS = [
  { title: "Software Engineer Intern", company: "Google", loc: "Bangalore", type: "Internship" },
  { title: "Frontend Developer (React)", company: "Zomato", loc: "Gurgaon", type: "Full-time" },
  { title: "Graduate Trainee Engineer", company: "Tata Motors", loc: "Pune", type: "Freshers" },
  { title: "UI/UX Designer", company: "Razorpay", loc: "Remote", type: "Full-time" },
];

export default function JobFinder() {
  const [tab, setTab] = useState("govt"); // govt | private

  return (
    <div className="fade-in">
      <div style={{ ...cs, marginBottom: 32, background: "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(124,58,237,0.1) 100%)", borderColor: "rgba(59,130,246,0.2)", textAlign: "center", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: BRAND.text, marginBottom: 12 }}>India's #1 Job & Exam Tracker 🇮🇳</h2>
        <p style={{ color: BRAND.textSecondary, maxWidth: 600, margin: "0 auto 32px" }}>Track latest Government jobs, admit cards, exam results and high-paying private internships in one place. No Login Required.</p>
        
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <button onClick={() => setTab("govt")} style={{ padding: "12px 24px", borderRadius: 12, border: "none", cursor: "pointer", background: tab === "govt" ? BRAND.primary : "rgba(255,255,255,0.05)", color: "white", fontWeight: 700, fontSize: 15, transition: "0.2s" }}>🏛️ Government Jobs (Sarkari)</button>
          <button onClick={() => setTab("private")} style={{ padding: "12px 24px", borderRadius: 12, border: "none", cursor: "pointer", background: tab === "private" ? BRAND.primary : "rgba(255,255,255,0.05)", color: "white", fontWeight: 700, fontSize: 15, transition: "0.2s" }}>💻 Private Jobs & Internships</button>
        </div>
      </div>

      {tab === "govt" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {/* Latest Jobs Column */}
          <div style={cs}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, borderBottom: `1px solid ${BRAND.border}`, paddingBottom: 12 }}>
              <span style={{ fontSize: 20 }}>🔥</span>
              <h3 style={{ fontSize: 18, color: BRAND.text }}>Latest Jobs</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {LATEST_JOBS.map((j, i) => (
                <a key={i} href={j.link} target="_blank" rel="noreferrer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderRadius: 10, background: "rgba(255,255,255,0.03)", textDecoration: "none", border: `1px solid ${BRAND.border}`, transition: "0.2s" }} className="hover-lift">
                  <div>
                    <div style={{ fontSize: 14, color: BRAND.text, fontWeight: 600, marginBottom: 4 }}>{j.title}</div>
                    <div style={{ fontSize: 11, color: BRAND.textSecondary }}>Post: {j.post}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: BRAND.primary, background: `${BRAND.primary}15`, padding: "4px 8px", borderRadius: 6 }}>{j.status}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Admit Card & Result Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={cs}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, borderBottom: `1px solid ${BRAND.border}`, paddingBottom: 12 }}>
                <span style={{ fontSize: 20 }}>🆔</span>
                <h3 style={{ fontSize: 18, color: BRAND.text }}>Admit Cards</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {ADMIT_CARDS.map((j, i) => (
                  <a key={i} href={j.link} target="_blank" rel="noreferrer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderRadius: 10, background: "rgba(255,255,255,0.03)", textDecoration: "none", border: `1px solid ${BRAND.border}` }} className="hover-lift">
                    <div style={{ fontSize: 14, color: BRAND.text, fontWeight: 600 }}>{j.title}</div>
                    <span style={{ fontSize: 11, color: "#10B981", fontWeight: 700 }}>{j.date}</span>
                  </a>
                ))}
              </div>
            </div>

            <div style={cs}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, borderBottom: `1px solid ${BRAND.border}`, paddingBottom: 12 }}>
                <span style={{ fontSize: 20 }}>🏆</span>
                <h3 style={{ fontSize: 18, color: BRAND.text }}>Exam Results</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {RESULTS.map((j, i) => (
                  <a key={i} href={j.link} target="_blank" rel="noreferrer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderRadius: 10, background: "rgba(255,255,255,0.03)", textDecoration: "none", border: `1px solid ${BRAND.border}` }} className="hover-lift">
                    <div style={{ fontSize: 14, color: BRAND.text, fontWeight: 600 }}>{j.title}</div>
                    <span style={{ fontSize: 11, color: "#3B82F6", fontWeight: 700 }}>{j.date}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {PRIVATE_JOBS.map((j, i) => (
            <div key={i} style={cs} className="hover-lift">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 18, color: BRAND.text, margin: 0 }}>{j.title}</h3>
                  <div style={{ fontSize: 14, color: BRAND.primary, fontWeight: 700, marginTop: 4 }}>{j.company}</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, color: BRAND.textSecondary }}>{j.type}</div>
              </div>
              <div style={{ display: "flex", gap: 12, color: BRAND.textSecondary, fontSize: 13, marginBottom: 20 }}>
                <span>📍 {j.loc}</span>
                <span>📅 Posted Today</span>
              </div>
              <button style={{ width: "100%", padding: "12px", borderRadius: 10, background: BRAND.primary, color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}>Apply on Company Site</button>
            </div>
          ))}
          <div style={{ ...cs, borderStyle: "dashed", background: "transparent", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🚀</div>
            <h4 style={{ color: BRAND.text }}>Hiring for your startup?</h4>
            <p style={{ fontSize: 12, color: BRAND.textSecondary, marginBottom: 16 }}>List your jobs here for free and reach 50k+ students.</p>
            <button style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${BRAND.primary}`, color: BRAND.primary, background: "none", fontWeight: 600 }}>Post a Job</button>
          </div>
        </div>
      )}

      <div style={{ ...cs, marginTop: 40, textAlign: "center", background: "rgba(255,255,255,0.03)" }}>
        <p style={{ margin: 0, color: BRAND.textSecondary, fontSize: 14 }}>
          <strong>Note:</strong> We do not provide direct employment. We only aggregate job notifications from official government websites and reputable company career pages. Always verify details on the official portals.
        </p>
      </div>
    </div>
  );
}
