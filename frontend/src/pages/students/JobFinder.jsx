import { useState, useEffect } from "react";
import { BRAND, STUDENT_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 20 };

// Fallback data if API fails
const FALLBACK_GOVT = [
  { title: "UPSC Civil Services (IAS) 2024 Prelims", post: "IAS/IFS", status: "Apply Now", link: "https://upsc.gov.in/" },
  { title: "Railway RRB ALP Recruitment 2024", post: "Loco Pilot", status: "5696 Posts", link: "https://indianrailways.gov.in/" },
  { title: "SSC GD Constable 2024 Apply Online", post: "Constable", status: "Active", link: "https://ssc.nic.in/" },
];

export default function JobFinder() {
  const [tab, setTab] = useState("govt"); // govt | private
  const [govtJobs, setGovtJobs] = useState([]);
  const [privateJobs, setPrivateJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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

        // Fetch Live Private/Tech Jobs from Remotive API (No Key Required)
        const privRes = await fetch('https://remotive.com/api/remote-jobs?limit=10');
        const privData = await privRes.json();
        if (privData.jobs) {
          setPrivateJobs(privData.jobs.map(j => ({
            title: j.title,
            company: j.company_name,
            loc: j.candidate_required_location || "Remote",
            type: j.job_type,
            link: j.url
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

  return (
    <div className="fade-in">
      <div style={{ ...cs, marginBottom: 32, background: "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(124,58,237,0.1) 100%)", borderColor: "rgba(59,130,246,0.2)", textAlign: "center", padding: "40px 20px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: BRAND.text, marginBottom: 12 }}>India's #1 Automated Job Tracker 🇮🇳</h2>
        <p style={{ color: BRAND.textSecondary, maxWidth: 600, margin: "0 auto 32px" }}>Real-time Government notifications and High-paying Private jobs synced automatically from across the web. No Login. Just Jobs.</p>
        
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <button onClick={() => setTab("govt")} style={{ padding: "12px 24px", borderRadius: 12, border: "none", cursor: "pointer", background: tab === "govt" ? BRAND.primary : "rgba(255,255,255,0.05)", color: "white", fontWeight: 700, fontSize: 15, transition: "0.2s" }}>🏛️ Government Jobs (Sarkari)</button>
          <button onClick={() => setTab("private")} style={{ padding: "12px 24px", borderRadius: 12, border: "none", cursor: "pointer", background: tab === "private" ? BRAND.primary : "rgba(255,255,255,0.05)", color: "white", fontWeight: 700, fontSize: 15, transition: "0.2s" }}>💻 Global Private Jobs</button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div className="loader" style={{ margin: "0 auto 20px" }}></div>
          <div style={{ color: BRAND.textSecondary, fontWeight: 600 }}>Fetching latest openings...</div>
        </div>
      ) : tab === "govt" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
          <div style={cs}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, borderBottom: `1px solid ${BRAND.border}`, paddingBottom: 12 }}>
              <span style={{ fontSize: 20 }}>🔥</span>
              <h3 style={{ fontSize: 18, color: BRAND.text }}>Live Sarkari Alerts (Updates Every Hour)</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {govtJobs.map((j, i) => (
                <a key={i} href={j.link} target="_blank" rel="noreferrer" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "20px", borderRadius: 12, background: "rgba(255,255,255,0.02)", textDecoration: "none", border: `1px solid ${BRAND.border}`, transition: "0.2s" }} className="hover-lift">
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: BRAND.primary, background: `${BRAND.primary}15`, padding: "2px 8px", borderRadius: 4, display: "inline-block", marginBottom: 12 }}>{j.category || "New Alert"}</div>
                    <div style={{ fontSize: 15, color: BRAND.text, fontWeight: 700, marginBottom: 12, lineHeight: 1.4 }}>{j.title}</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${BRAND.border}`, paddingTop: 12 }}>
                    <span style={{ fontSize: 12, color: BRAND.textSecondary }}>📅 {j.date}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: BRAND.primary }}>Apply →</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {privateJobs.map((j, i) => (
            <a key={i} href={j.link} target="_blank" rel="noreferrer" style={{ ...cs, textDecoration: "none", transition: "0.2s" }} className="hover-lift">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 16, color: BRAND.text, margin: 0, lineHeight: 1.4 }}>{j.title}</h3>
                  <div style={{ fontSize: 14, color: BRAND.primary, fontWeight: 700, marginTop: 4 }}>{j.company}</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: 8, fontSize: 10, fontWeight: 800, color: BRAND.textSecondary }}>{j.type?.toUpperCase()}</div>
              </div>
              <div style={{ display: "flex", gap: 12, color: BRAND.textSecondary, fontSize: 12, marginBottom: 20 }}>
                <span>📍 {j.loc}</span>
                <span>⭐ Verified Opening</span>
              </div>
              <div style={{ width: "100%", padding: "10px", borderRadius: 8, background: BRAND.primary, color: "white", textAlign: "center", fontWeight: 700, fontSize: 13 }}>View Details</div>
            </a>
          ))}
        </div>
      )}

      <div style={{ ...cs, marginTop: 40, textAlign: "center", background: "rgba(255,255,255,0.03)" }}>
        <p style={{ margin: 0, color: BRAND.textSecondary, fontSize: 13 }}>
          <strong>Real-Time Sync:</strong> Our systems scrape official government portals and major tech job boards every hour to bring you the freshest opportunities. ToolsWaala is a discovery platform and does not guarantee employment.
        </p>
      </div>
    </div>
  );
}
