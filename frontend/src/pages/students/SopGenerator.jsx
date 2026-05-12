import { useState } from "react";
import { BRAND, STUDENT_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };
const inputStyle = { width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 14 };

const TEMPLATES = {
  "Masters Abroad (MS/MBA)": (f) => `Statement of Purpose

Dear Admissions Committee,

I am writing to express my keen interest in pursuing a ${f.field} program at ${f.university || "your esteemed university"}. With a strong foundation built through my ${f.degree} education and a deep-seated passion for ${f.field.toLowerCase()}, I am confident that this program represents the ideal next step in my academic and professional journey.

Academic Background and Motivation

Throughout my undergraduate studies in ${f.degree}, where I achieved a CGPA/percentage of ${f.cgpa || "[Your Score]"}, I developed a rigorous analytical framework and a genuine enthusiasm for ${f.field.toLowerCase()}. The curriculum exposed me to both theoretical concepts and practical applications, igniting a desire to delve deeper into specialized areas of study. My academic performance reflects not just my aptitude for the subject but also my commitment to intellectual growth and disciplined work ethic.

Key Achievements and Research Experience

${f.achievements ? f.achievements.split(",").map(a => `• ${a.trim()}`).join("\n") : "• [List your key achievements, research projects, publications, or competition wins here]\n• [Include any relevant internships, workshops, or certifications]\n• [Mention leadership roles or extracurricular activities that demonstrate your skills]"}

Why ${f.university || "This University"}?

${f.university ? `I have carefully researched ${f.university}'s ${f.field} program and am particularly drawn to its emphasis on [specific research areas/faculty/labs/curriculum features]. The opportunity to work alongside leading researchers in the field, combined with the university's collaborative and innovative environment, makes it the perfect fit for my academic goals.` : "I am drawn to your university's renowned program in this field, its cutting-edge research facilities, and the opportunity to learn from distinguished faculty members. The collaborative academic environment and diverse student community further strengthen my conviction that this is where I can make the most meaningful contributions to my field."}

Career Goals and Future Vision

In the short term, ${f.careerGoal || "I aim to leverage the knowledge and skills gained from this program to contribute meaningfully to the industry through innovative research and practical applications"}. In the long term, I envision myself as a thought leader in ${f.field.toLowerCase()}, bridging the gap between academic research and real-world implementation, particularly in the context of India's growing technology ecosystem.

I am confident that the ${f.field} program at ${f.university || "your university"} will provide me with the intellectual rigor, practical exposure, and global perspective necessary to achieve these goals. I look forward to contributing to the academic community and making a lasting impact through my work.

Thank you for considering my application.

Sincerely,
[Your Name]`,

  "Indian PG Admission": (f) => `Statement of Purpose

Respected Members of the Selection Committee,

I, [Your Name], am applying for admission to the postgraduate program in ${f.field} at ${f.university || "your esteemed institution"}. Having completed my ${f.degree} with a CGPA/percentage of ${f.cgpa || "[Your Score]"}, I am eager to pursue advanced studies in this discipline.

My undergraduate education provided me with a strong foundation in ${f.field.toLowerCase()}, and I am keen to build upon this knowledge through specialized coursework and research at the postgraduate level.

Key Achievements:
${f.achievements ? f.achievements.split(",").map(a => `• ${a.trim()}`).join("\n") : "• [Your achievements here]"}

My career goal is to ${f.careerGoal || "establish myself as an expert in my chosen field and contribute to India's academic and industrial growth"}. I believe that a postgraduate degree from ${f.university || "your institution"} will equip me with the necessary skills and knowledge to achieve this objective.

I assure you of my dedication and hard work throughout the program.

Respectfully,
[Your Name]`,

  "Scholarship Application": (f) => `Statement of Purpose — Scholarship Application

Dear Scholarship Committee,

I am writing to apply for the [Scholarship Name] to support my pursuit of a ${f.field} degree at ${f.university || "[University Name]"}. As a student from India with a strong academic record (${f.cgpa || "[CGPA]"} in ${f.degree}), I believe I am a strong candidate for this prestigious award.

Academic Excellence and Achievements:
${f.achievements ? f.achievements.split(",").map(a => `• ${a.trim()}`).join("\n") : "• [Your achievements here]"}

Financial support through this scholarship would enable me to focus entirely on my academic and research goals without the burden of financial constraints. My career aspiration is to ${f.careerGoal || "become a leader in my field and give back to my community"}.

I am committed to making the most of this opportunity and becoming an ambassador for the values this scholarship represents.

Gratefully,
[Your Name]`,

  "Internship Application": (f) => `Cover Letter — Internship Application

Dear Hiring Manager,

I am a ${f.degree} student with a CGPA of ${f.cgpa || "[Score]"}, writing to express my strong interest in the ${f.field} internship at ${f.university || "[Company Name]"}.

During my academic journey, I have developed practical skills through:
${f.achievements ? f.achievements.split(",").map(a => `• ${a.trim()}`).join("\n") : "• [Your projects and skills here]"}

I am eager to apply my technical knowledge in a real-world setting and contribute meaningfully to your team. My goal is to ${f.careerGoal || "gain hands-on experience and grow as a professional in this field"}.

I would welcome the opportunity to discuss how I can add value to your organization.

Best regards,
[Your Name]`,

  "PhD Statement": (f) => `Statement of Purpose — PhD Application

Dear Doctoral Admissions Committee,

I am applying to the PhD program in ${f.field} at ${f.university || "your university"}, driven by a deep intellectual curiosity and a desire to contribute original research to the field.

My academic background in ${f.degree} (CGPA: ${f.cgpa || "[Score]"}) has provided me with the theoretical and methodological foundations necessary for doctoral-level research.

Research Experience and Achievements:
${f.achievements ? f.achievements.split(",").map(a => `• ${a.trim()}`).join("\n") : "• [Publications, research projects, conference presentations]"}

My research interests lie at the intersection of [specific areas], and I am particularly keen to work with [specific faculty/lab] at ${f.university || "your university"} whose work on [specific topic] aligns closely with my own research vision.

Long-term, I aspire to ${f.careerGoal || "pursue a career in academia and contribute to advancing knowledge in my field through teaching and research"}.

Sincerely,
[Your Name]`,
};

export default function SopGenerator() {
  const [form, setForm] = useState({
    purpose: "Masters Abroad (MS/MBA)",
    field: "", university: "", degree: "", cgpa: "",
    achievements: "", careerGoal: "", tone: "Professional",
  });
  const [loading, setLoading] = useState(false);
  const [sop, setSop] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const generateSop = () => {
    if (!form.field || !form.degree) { alert("Please enter your field of study and current degree."); return; }
    setLoading(true); setSop("");
    setTimeout(() => {
      const template = TEMPLATES[form.purpose] || TEMPLATES["Masters Abroad (MS/MBA)"];
      const generated = template(form);
      setSop(generated);
      setWordCount(generated.trim().split(/\s+/).length);
      setLoading(false);
    }, 1500);
  };

  const handleSopChange = (val) => {
    setSop(val);
    setWordCount(val.trim() ? val.trim().split(/\s+/).length : 0);
  };

  return (
    <div className="fade-in">
      <div style={{ ...cs, background: `${STUDENT_BRAND.accent}08`, border: `1px solid ${STUDENT_BRAND.accent}30`, marginBottom: 24, padding: "14px 24px" }}>
        <p style={{ margin: 0, fontSize: 13, color: STUDENT_BRAND.accent, fontWeight: 600 }}>✨ AI generates a personalized SOP draft based on your inputs. Edit freely after generation — your changes are preserved.</p>
      </div>

      <div style={cs}>
        <h3 style={{ color: BRAND.text, marginBottom: 20 }}>SOP Details <span style={{ fontSize: 13, color: BRAND.textSecondary }}>एसओपी विवरण</span></h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Purpose / उद्देश्य</label>
            <select value={form.purpose} onChange={e => update("purpose", e.target.value)} style={{ ...inputStyle, background: BRAND.surfaceCard }}>
              {Object.keys(TEMPLATES).map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Field / Program</label>
            <input value={form.field} onChange={e => update("field", e.target.value)} placeholder="e.g. Data Science, MBA Finance" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Target University / Company</label>
            <input value={form.university} onChange={e => update("university", e.target.value)} placeholder="e.g. Stanford, IIM Ahmedabad" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Your Current Degree</label>
            <input value={form.degree} onChange={e => update("degree", e.target.value)} placeholder="e.g. B.Tech Computer Science" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>CGPA / Percentage</label>
            <input value={form.cgpa} onChange={e => update("cgpa", e.target.value)} placeholder="e.g. 8.5 CGPA or 85%" style={inputStyle} />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Key Achievements (comma separated)</label>
            <textarea value={form.achievements} onChange={e => update("achievements", e.target.value)} placeholder="e.g. Published paper in IEEE, Won Smart India Hackathon, Dean's List 3 semesters" style={{ ...inputStyle, minHeight: 60 }} />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Career Goal</label>
            <input value={form.careerGoal} onChange={e => update("careerGoal", e.target.value)} placeholder="e.g. To lead AI research at a top tech company" style={inputStyle} />
          </div>
        </div>
        <button onClick={generateSop} disabled={loading} style={{ width: "100%", marginTop: 24, background: STUDENT_BRAND.accent, color: "white", border: "none", borderRadius: 12, padding: "16px 24px", cursor: "pointer", fontSize: 16, fontWeight: 700, opacity: loading ? 0.7 : 1 }}>
          {loading ? "✨ AI is crafting your SOP..." : "✨ Generate Statement of Purpose"}
        </button>
      </div>

      {sop && (
        <div style={{ ...cs, marginTop: 32 }} className="fade-in">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <h3 style={{ color: BRAND.text, margin: 0 }}>Your SOP Draft</h3>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: wordCount > 800 && wordCount < 1200 ? "#10B981" : "#F59E0B", fontWeight: 600 }}>{wordCount} words {wordCount > 800 && wordCount < 1200 ? "✅" : wordCount > 1200 ? "⚠️ Too long" : "⚠️ Too short"}</span>
              <button onClick={() => { navigator.clipboard.writeText(sop); alert("SOP copied to clipboard!"); }} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: `${STUDENT_BRAND.accent}15`, color: STUDENT_BRAND.accent, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>📋 Copy</button>
            </div>
          </div>
          <textarea value={sop} onChange={e => handleSopChange(e.target.value)} style={{ width: "100%", padding: 20, borderRadius: 12, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, minHeight: 500, fontSize: 15, lineHeight: 1.7, fontFamily: "Georgia, serif" }} />
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <div style={{ flex: 1, padding: 12, borderRadius: 8, background: "rgba(16,185,129,0.08)", fontSize: 12, color: "#10B981" }}>
              💡 <strong>Tip:</strong> Most universities expect 800-1000 words. Edit the brackets [...] with your specific details before submitting.
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 32, padding: 24, background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, color: BRAND.textSecondary, lineHeight: 1.8 }}>
        <h2 style={{ color: BRAND.text, fontSize: 22, marginBottom: 12 }}>How to Write a Strong Statement of Purpose (SOP)</h2>
        <p>A Statement of Purpose is one of the most critical components of your graduate school application. It tells the admissions committee who you are, what motivates you, and why you're a good fit for their program. Our AI SOP Generator creates a personalized first draft based on your academic background, achievements, and career goals. It supports multiple formats including MS/MBA applications, PhD statements, scholarship essays, and internship cover letters. Always remember to edit and personalize the generated draft before submitting—admissions committees value authenticity above all else.</p>
      </div>
    </div>
  );
}
