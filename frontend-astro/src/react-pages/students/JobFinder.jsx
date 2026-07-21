import { useState, useEffect, useMemo } from "react";
import { BRAND, STUDENT_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 20 };

// Fallback data if API fails
const FALLBACK_GOVT = [
  { title: "UPSC Civil Services (IAS) 2024 Prelims", post: "IAS/IFS", status: "Apply Now", link: "https://upsc.gov.in/" },
  { title: "Railway RRB ALP Recruitment 2024", post: "Loco Pilot", status: "5696 Posts", link: "https://indianrailways.gov.in/" },
  { title: "SSC GD Constable 2024 Apply Online", post: "Constable", status: "Active", link: "https://ssc.nic.in/" },
];

export default function JobFinder() {
  const [tab, setTab] = useState("govt"); // govt | private | internships
  const [govtJobs, setGovtJobs] = useState([]);
  const [privateJobs, setPrivateJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        // Fetch Live Govt Jobs from IndGovtJobs RSS via rss2json
        const govtRes = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://www.indgovtjobs.in/feeds/posts/default?alt=rss')}`);
        const govtData = await govtRes.json();
        
        if (govtData.status === 'ok') {
          setGovtJobs(govtData.items.map(item => ({
            title: item.title,
            link: item.link,
            date: new Date(item.pubDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            category: item.categories[0] || "Latest"
          })));
        } else {
          setGovtJobs(FALLBACK_GOVT);
        }

        // Fetch Live Private/Tech Jobs from Remotive API
        // Added some parameters to get a diverse set of jobs initially
        const privRes = await fetch('https://remotive.com/api/remote-jobs?limit=50');
        const privData = await privRes.json();
        if (privData.jobs) {
          setPrivateJobs(privData.jobs.map(j => ({
            title: j.title,
            company: j.company_name,
            loc: j.candidate_required_location || "Remote",
            type: j.job_type,
            category: j.category,
            link: j.url,
            logo: `https://logo.clearbit.com/${j.company_name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
          })));
        }
      } catch (err) {
        console.error("Job fetch error:", err);
        setGovtJobs(FALLBACK_GOVT);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const filteredPrivateJobs = useMemo(() => {
    if (filter === "All") return privateJobs;
    return privateJobs.filter(j => j.category && j.category.includes(filter));
  }, [privateJobs, filter]);

  const categories = ["All", "Software Development", "Data", "Design", "Marketing", "Sales"];

  return (
    <div className="fade-in">
      <div style={{ ...cs, marginBottom: 32, background: "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(124,58,237,0.1) 100%)", borderColor: "rgba(59,130,246,0.2)", textAlign: "center", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: BRAND.text, marginBottom: 12 }}>India's #1 Job & Internship Tracker 🇮🇳</h2>
        <p style={{ color: BRAND.textSecondary, maxWidth: 600, margin: "0 auto 32px", fontSize: 16 }}>Real-time Government notifications and High-paying Private jobs synced automatically from across the web. No Login. Just Jobs.</p>
        
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <button onClick={() => setTab("govt")} style={{ padding: "12px 24px", borderRadius: 12, border: "none", cursor: "pointer", background: tab === "govt" ? STUDENT_BRAND.accent : "rgba(255,255,255,0.05)", color: tab === "govt" ? "white" : BRAND.text, fontWeight: 700, fontSize: 15, transition: "0.2s", display: "flex", alignItems: "center", gap: 8 }}>🏛️ Govt Jobs (Sarkari)</button>
          <button onClick={() => setTab("private")} style={{ padding: "12px 24px", borderRadius: 12, border: "none", cursor: "pointer", background: tab === "private" ? STUDENT_BRAND.accent : "rgba(255,255,255,0.05)", color: tab === "private" ? "white" : BRAND.text, fontWeight: 700, fontSize: 15, transition: "0.2s", display: "flex", alignItems: "center", gap: 8 }}>💻 Private & Tech</button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div className="loader" style={{ margin: "0 auto 20px", width: 40, height: 40, border: `4px solid ${STUDENT_BRAND.accent}40`, borderTop: `4px solid ${STUDENT_BRAND.accent}`, borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
          <div style={{ color: BRAND.textSecondary, fontWeight: 600, fontSize: 16 }}>Fetching latest openings from across the web...</div>
        </div>
      ) : tab === "govt" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
          <div style={cs}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, borderBottom: `1px solid ${BRAND.border}`, paddingBottom: 16 }}>
              <span style={{ fontSize: 24 }}>🔥</span>
              <h3 style={{ fontSize: 20, color: BRAND.text, margin: 0 }}>Live Sarkari Alerts <span style={{ fontSize: 13, color: BRAND.textSecondary, fontWeight: 500 }}>(Updates Every Hour)</span></h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {govtJobs.map((j, i) => (
                <a key={i} href={j.link} target="_blank" rel="noreferrer" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "24px", borderRadius: 16, background: "rgba(255,255,255,0.02)", textDecoration: "none", border: `1px solid ${BRAND.border}`, transition: "0.2s", position: "relative", overflow: "hidden" }} className="hover-lift">
                  <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: STUDENT_BRAND.accent }}></div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: STUDENT_BRAND.accent, background: `${STUDENT_BRAND.accent}15`, padding: "4px 10px", borderRadius: 6, display: "inline-block" }}>{j.category || "Govt Alert"}</div>
                      <span style={{ fontSize: 12, color: BRAND.textSecondary, fontWeight: 600 }}>📅 {j.date}</span>
                    </div>
                    <div style={{ fontSize: 16, color: BRAND.text, fontWeight: 700, marginBottom: 16, lineHeight: 1.4 }}>{j.title}</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", borderTop: `1px solid ${BRAND.border}`, paddingTop: 16 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: STUDENT_BRAND.accent, display: "flex", alignItems: "center", gap: 4 }}>Apply Now <span style={{ fontSize: 16 }}>→</span></span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 16, marginBottom: 16, scrollbarWidth: "none" }}>
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{ padding: "8px 16px", borderRadius: 20, border: `1px solid ${filter === c ? STUDENT_BRAND.accent : BRAND.border}`, background: filter === c ? `${STUDENT_BRAND.accent}15` : "transparent", color: filter === c ? STUDENT_BRAND.accent : BRAND.textSecondary, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "0.2s" }}>
                {c}
              </button>
            ))}
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
            {filteredPrivateJobs.map((j, i) => (
              <a key={i} href={j.link} target="_blank" rel="noreferrer" style={{ ...cs, textDecoration: "none", transition: "all 0.2s ease", display: "flex", flexDirection: "column" }} className="hover-lift">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <img src={j.logo} alt={j.company} onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="%23333"/><text x="50%" y="50%" fill="white" font-family="Arial" font-size="20" text-anchor="middle" dy=".3em">' + j.company.charAt(0) + '</text></svg>'; }} style={{ width: 48, height: 48, borderRadius: 12, objectFit: "cover", border: `1px solid ${BRAND.border}` }} />
                    <div>
                      <h3 style={{ fontSize: 16, color: BRAND.text, margin: 0, lineHeight: 1.3 }}>{j.title}</h3>
                      <div style={{ fontSize: 14, color: BRAND.textSecondary, marginTop: 4 }}>{j.company}</div>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                  <span style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(255,255,255,0.05)", border: `1px solid ${BRAND.border}`, color: BRAND.textSecondary, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>📍 {j.loc}</span>
                  <span style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(255,255,255,0.05)", border: `1px solid ${BRAND.border}`, color: BRAND.textSecondary, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>💼 {j.type?.replace(/_/g, " ")}</span>
                  {j.category && <span style={{ padding: "4px 10px", borderRadius: 6, background: `${STUDENT_BRAND.accent}15`, color: STUDENT_BRAND.accent, fontSize: 11, fontWeight: 700 }}>{j.category}</span>}
                </div>
                
                <div style={{ marginTop: "auto" }}>
                  <div style={{ width: "100%", padding: "12px", borderRadius: 10, background: STUDENT_BRAND.accent, color: "white", textAlign: "center", fontWeight: 700, fontSize: 14, transition: "0.2s" }}>View Details & Apply</div>
                </div>
              </a>
            ))}
            {filteredPrivateJobs.length === 0 && (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40, background: "rgba(255,255,255,0.02)", borderRadius: 16, border: `1px dashed ${BRAND.border}` }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: BRAND.text, marginBottom: 8 }}>No jobs found in this category</div>
                <div style={{ color: BRAND.textSecondary }}>Try selecting a different filter.</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ ...cs, marginTop: 40, textAlign: "center", background: "rgba(255,255,255,0.02)" }}>
        <p style={{ margin: 0, color: BRAND.textSecondary, fontSize: 13, lineHeight: 1.5 }}>
          <strong style={{ color: BRAND.text }}>Real-Time Sync:</strong> Our systems scrape official government portals and major tech job boards every hour to bring you the freshest opportunities. ToolsWaala is a discovery platform and does not guarantee employment.
        </p>
      </div>
    </div>
  );
}
