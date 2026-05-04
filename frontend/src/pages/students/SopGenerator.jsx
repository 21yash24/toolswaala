import { useState } from "react";
import { BRAND, STUDENT_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };

export default function SopGenerator() {
  const [form, setForm] = useState({
    purpose: "Masters Abroad (MS/MBA)",
    field: "",
    university: "",
    degree: "",
    cgpa: "",
    achievements: "",
    careerGoal: "",
    tone: "Professional",
  });

  const [loading, setLoading] = useState(false);
  const [sop, setSop] = useState("");

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const generateSop = async () => {
    if (!form.field || !form.degree) {
      alert("Please enter your field of study and current degree.");
      return;
    }
    setLoading(true);
    setSop("");

    // Simulated AI response for now since we're only building frontend
    // In a real scenario, this would call `${API_BASE_URL}/api/ai/sop`
    setTimeout(() => {
      const generatedSop = `Statement of Purpose: ${form.field}\n\nI am writing to express my strong interest in the ${form.purpose} program at ${form.university || "your esteemed university"}. My academic journey in ${form.degree} has been driven by a passion for technology and innovation.\n\nWith a CGPA of ${form.cgpa || "X"}, I have consistently demonstrated my academic capabilities. My key achievements include ${form.achievements || "working on various innovative projects"}.\n\nIn the long term, I aim to ${form.careerGoal || "become a leader in my field"}. I am confident that this program will provide me with the necessary tools to achieve my goals.\n\nThank you for considering my application.\n\nSincerely,\n[Your Name]`;
      setSop(generatedSop);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="fade-in">
      <div style={cs}>
        <h3 style={{ color: "white", marginBottom: 20 }}>SOP Details <span style={{ fontSize: 13, color: BRAND.textSecondary }}>एसओपी विवरण</span></h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Purpose / उद्देश्य</label>
            <select value={form.purpose} onChange={e => update("purpose", e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "#1a1a1a", color: "white" }}>
              <option>Masters Abroad (MS/MBA)</option>
              <option>Indian PG Admission</option>
              <option>Internship Application</option>
              <option>Scholarship Application</option>
              <option>PhD Statement</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Field / Program Applying For</label>
            <input value={form.field} onChange={e => update("field", e.target.value)} placeholder="e.g. Data Science" style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white" }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Target University (Optional)</label>
            <input value={form.university} onChange={e => update("university", e.target.value)} placeholder="e.g. Stanford University" style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white" }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Your Current Degree</label>
            <input value={form.degree} onChange={e => update("degree", e.target.value)} placeholder="e.g. B.Tech CS" style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white" }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Current CGPA / %</label>
            <input value={form.cgpa} onChange={e => update("cgpa", e.target.value)} placeholder="e.g. 8.5" style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white" }} />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Key Achievements (Comma separated)</label>
            <textarea value={form.achievements} onChange={e => update("achievements", e.target.value)} placeholder="e.g. Published a paper in IEEE, Won National Hackathon" style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", minHeight: 60 }} />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Short Term Career Goal</label>
            <input value={form.careerGoal} onChange={e => update("careerGoal", e.target.value)} placeholder="e.g. To work as an AI Researcher" style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white" }} />
          </div>
        </div>
        <button onClick={generateSop} disabled={loading} style={{ width: "100%", marginTop: 24, background: STUDENT_BRAND.accent, color: "white", border: "none", borderRadius: 12, padding: "16px 24px", cursor: "pointer", fontSize: 16, fontWeight: 700, opacity: loading ? 0.7 : 1 }}>
          {loading ? "AI is writing your SOP..." : "✨ Generate AI Statement of Purpose"}
        </button>
      </div>

      {sop && (
        <div style={{ ...cs, marginTop: 32 }} className="fade-in">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ color: "white", margin: 0 }}>Your Generated SOP</h3>
            <button onClick={() => { navigator.clipboard.writeText(sop); alert("Copied!"); }} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "rgba(255,255,255,0.1)", color: "white", cursor: "pointer", fontSize: 13 }}>📋 Copy Text</button>
          </div>
          <textarea value={sop} readOnly style={{ width: "100%", padding: 20, borderRadius: 12, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.2)", color: "white", minHeight: 400, fontSize: 15, lineHeight: 1.6, fontFamily: "serif" }} />
          <p style={{ fontSize: 12, color: BRAND.textSecondary, marginTop: 12 }}>Note: This is an AI-generated draft. Please review and personalize it before submitting.</p>
        </div>
      )}
    </div>
  );
}
