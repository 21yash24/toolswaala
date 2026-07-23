import { useState, useEffect } from "react";
import { BRAND, STUDENT_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };

// Mock AI function to improve bullet points
const improveDescription = (text) => {
  if (!text || text.length < 5) return text;
  const verbs = ["Spearheaded", "Engineered", "Developed", "Optimized", "Architected", "Implemented", "Designed"];
  const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
  
  if (text.toLowerCase().includes("made ") || text.toLowerCase().includes("built ")) {
    return text.replace(/made |built /i, `${randomVerb} `);
  }
  
  return `• ${randomVerb} ${text}\n• Improved efficiency by 20%\n• Collaborated with cross-functional teams`;
};

export default function ResumeBuilder() {
  const [step, setStep] = useState(() => parseInt(localStorage.getItem("tw_res_step") || "1", 10));
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("tw_res_form");
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return {
      personal: { name: "", email: "", phone: "", linkedin: "", github: "", location: "" },
      education: [{ institution: "", degree: "", year: "", score: "" }],
      projects: [{ name: "", tech: "", description: "", bullets: [] }],
      experience: [{ company: "", role: "", duration: "", description: "", bullets: [] }],
      skills: { technical: "", soft: "" },
    };
  });

  useEffect(() => {
    localStorage.setItem("tw_res_step", step);
    localStorage.setItem("tw_res_form", JSON.stringify(form));
  }, [step, form]);

  const updatePersonal = (f, v) => setForm(p => ({ ...p, personal: { ...p.personal, [f]: v } }));

  const addEdu = () => setForm(p => ({ ...p, education: [...p.education, { institution: "", degree: "", year: "", score: "" }] }));
  const updateEdu = (i, f, v) => {
    const newEdu = [...form.education];
    newEdu[i][f] = v;
    setForm(p => ({ ...p, education: newEdu }));
  };

  const addProject = () => setForm(p => ({ ...p, projects: [...p.projects, { name: "", tech: "", description: "", bullets: [] }] }));
  const updateProject = (i, f, v) => {
    const newProj = [...form.projects];
    newProj[i][f] = v;
    setForm(p => ({ ...p, projects: newProj }));
  };
  const aiImproveProject = (i) => {
    const newProj = [...form.projects];
    newProj[i].description = improveDescription(newProj[i].description);
    setForm(p => ({ ...p, projects: newProj }));
  };

  const addExp = () => setForm(p => ({ ...p, experience: [...p.experience, { company: "", role: "", duration: "", description: "", bullets: [] }] }));
  const updateExp = (i, f, v) => {
    const newExp = [...form.experience];
    newExp[i][f] = v;
    setForm(p => ({ ...p, experience: newExp }));
  };
  const aiImproveExp = (i) => {
    const newExp = [...form.experience];
    newExp[i].description = improveDescription(newExp[i].description);
    setForm(p => ({ ...p, experience: newExp }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: BRAND.textSecondary }}>
          <span>Step {step} of 5</span>
          <span>{Math.round((step / 5) * 100)}% Complete</span>
        </div>
        <div style={{ height: 6, background: "rgba(0,0,0,0.05)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(step / 5) * 100}%`, background: STUDENT_BRAND.accent, transition: "width 0.3s" }} />
        </div>
      </div>
      
      <div style={{ ...cs, background: "rgba(124, 58, 237, 0.05)", border: `1px solid ${STUDENT_BRAND.accent}30`, marginBottom: 24, padding: "12px 24px" }} className="no-print">
        <p style={{ margin: 0, fontSize: 13, color: STUDENT_BRAND.accent, fontWeight: 600 }}>💾 Auto-Saved: Your progress is stored securely in your browser. You will not lose your data.</p>
      </div>

      <div className="no-print">
        {step === 1 && <Step1 form={form.personal} update={updatePersonal} />}
        {step === 2 && <Step2 education={form.education} update={updateEdu} add={addEdu} />}
        {step === 3 && <Step3 projects={form.projects} update={updateProject} add={addProject} aiImprove={aiImproveProject} />}
        {step === 4 && <Step4 experience={form.experience} update={updateExp} add={addExp} aiImprove={aiImproveExp} skills={form.skills} setSkills={(s) => setForm(p => ({ ...p, skills: s }))} />}
        {step === 5 && <Step5 form={form} />}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }} className="no-print">
        <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} style={{ padding: "12px 24px", borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, cursor: step === 1 ? "not-allowed" : "pointer", opacity: step === 1 ? 0.5 : 1, fontWeight: 600 }}>Back</button>
        {step < 5 ? (
          <button onClick={() => setStep(s => Math.min(5, s + 1))} style={{ padding: "12px 32px", borderRadius: 10, border: "none", background: STUDENT_BRAND.accent, color: "white", cursor: "pointer", fontWeight: 700, transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform="scale(1.02)"} onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>Next Step →</button>
        ) : (
          <button onClick={handlePrint} style={{ padding: "12px 32px", borderRadius: 10, border: "none", background: "#25D366", color: "white", cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", gap: 8, transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform="scale(1.02)"} onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>
             <span style={{ fontSize: 20 }}>🖨️</span> Save ATS Resume as PDF
          </button>
        )}
      </div>

      {step === 5 && <ResumePreview form={form} />}
    </div>
  );
}

const inputStyle = { padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 14 };

function Step1({ form, update }) {
  return (
    <div style={cs} className="fade-in">
      <h3 style={{ color: BRAND.text, marginBottom: 20 }}>Personal Information</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ gridColumn: "span 2" }}>
          <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Full Name</label>
          <input value={form.name} onChange={e => update("name", e.target.value)} placeholder="John Doe" style={{ ...inputStyle, width: "100%" }} />
        </div>
        <div>
          <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Email</label>
          <input value={form.email} onChange={e => update("email", e.target.value)} placeholder="john@example.com" style={{ ...inputStyle, width: "100%" }} />
        </div>
        <div>
          <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Phone</label>
          <input value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+91 98765 43210" style={{ ...inputStyle, width: "100%" }} />
        </div>
        <div>
          <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>LinkedIn URL</label>
          <input value={form.linkedin} onChange={e => update("linkedin", e.target.value)} placeholder="linkedin.com/in/johndoe" style={{ ...inputStyle, width: "100%" }} />
        </div>
        <div>
          <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>GitHub URL</label>
          <input value={form.github} onChange={e => update("github", e.target.value)} placeholder="github.com/johndoe" style={{ ...inputStyle, width: "100%" }} />
        </div>
      </div>
    </div>
  );
}

function Step2({ education, update, add }) {
  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ color: BRAND.text, margin: 0 }}>Education</h3>
        <button onClick={add} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${STUDENT_BRAND.accent}40`, background: `${STUDENT_BRAND.accent}15`, color: STUDENT_BRAND.accent, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ Add Education</button>
      </div>
      {education.map((edu, i) => (
        <div key={i} style={{ ...cs, marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Institution / College</label>
              <input value={edu.institution} onChange={e => update(i, "institution", e.target.value)} placeholder="IIT Bombay" style={{ ...inputStyle, width: "100%" }} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Degree / Class</label>
              <input value={edu.degree} onChange={e => update(i, "degree", e.target.value)} placeholder="B.Tech Computer Science" style={{ ...inputStyle, width: "100%" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Passing Year</label>
                <input value={edu.year} onChange={e => update(i, "year", e.target.value)} placeholder="2024" style={{ ...inputStyle, width: "100%" }} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Score (CGPA/%)</label>
                <input value={edu.score} onChange={e => update(i, "score", e.target.value)} placeholder="8.5 or 85%" style={{ ...inputStyle, width: "100%" }} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Step3({ projects, update, add, aiImprove }) {
  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ color: BRAND.text, margin: 0 }}>Projects</h3>
        <button onClick={add} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${STUDENT_BRAND.accent}40`, background: `${STUDENT_BRAND.accent}15`, color: STUDENT_BRAND.accent, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ Add Project</button>
      </div>
      {projects.map((proj, i) => (
        <div key={i} style={{ ...cs, marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Project Name</label>
              <input value={proj.name} onChange={e => update(i, "name", e.target.value)} placeholder="E-commerce Web App" style={{ ...inputStyle, width: "100%" }} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Tech Stack</label>
              <input value={proj.tech} onChange={e => update(i, "tech", e.target.value)} placeholder="React, Node.js, MongoDB" style={{ ...inputStyle, width: "100%" }} />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Short Description</label>
              <div style={{ display: "flex", gap: 10 }}>
                <textarea value={proj.description} onChange={e => update(i, "description", e.target.value)} placeholder="What did you build? Bullet points are best." style={{ ...inputStyle, flex: 1, minHeight: 80 }} />
                <button onClick={() => aiImprove(i)} title="Auto-Format with Action Verbs" style={{ padding: "0 16px", borderRadius: 10, border: "none", background: STUDENT_BRAND.accent, color: "white", cursor: "pointer", fontSize: 20, transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform="scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>✨</button>
              </div>
              <div style={{ fontSize: 11, color: BRAND.textSecondary, marginTop: 4 }}>Tip: Type a simple description and click ✨ to auto-format with professional Action Verbs.</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Step4({ experience, update, add, aiImprove, skills, setSkills }) {
  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ color: BRAND.text, margin: 0 }}>Internships / Experience</h3>
        <button onClick={add} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${STUDENT_BRAND.accent}40`, background: `${STUDENT_BRAND.accent}15`, color: STUDENT_BRAND.accent, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ Add Experience</button>
      </div>
      {experience.map((exp, i) => (
        <div key={i} style={{ ...cs, marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Company Name</label>
              <input value={exp.company} onChange={e => update(i, "company", e.target.value)} placeholder="TCS / Google" style={{ ...inputStyle, width: "100%" }} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Role / Position</label>
              <input value={exp.role} onChange={e => update(i, "role", e.target.value)} placeholder="SDE Intern" style={{ ...inputStyle, width: "100%" }} />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Brief Description</label>
              <div style={{ display: "flex", gap: 10 }}>
                <textarea value={exp.description} onChange={e => update(i, "description", e.target.value)} style={{ ...inputStyle, flex: 1, minHeight: 80 }} />
                <button onClick={() => aiImprove(i)} title="Auto-Format with Action Verbs" style={{ padding: "0 16px", borderRadius: 10, border: "none", background: STUDENT_BRAND.accent, color: "white", cursor: "pointer", fontSize: 20, transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform="scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>✨</button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div style={{ ...cs, marginTop: 24 }}>
        <h3 style={{ color: BRAND.text, marginBottom: 20 }}>Skills</h3>
        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Technical Skills (comma separated)</label>
            <input value={skills.technical} onChange={e => setSkills({ ...skills, technical: e.target.value })} placeholder="Java, Python, React, SQL" style={{ ...inputStyle, width: "100%" }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Soft Skills / Others</label>
            <input value={skills.soft} onChange={e => setSkills({ ...skills, soft: e.target.value })} placeholder="Leadership, Communication, Teamwork" style={{ ...inputStyle, width: "100%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Step5() {
  return (
    <div style={{ ...cs, textAlign: "center" }} className="fade-in">
      <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
      <h3 style={{ color: BRAND.text, marginBottom: 8 }}>Ready to Download!</h3>
      <p style={{ color: BRAND.textSecondary, marginBottom: 24 }}>Preview your resume below. Use the Print button to save as an ATS-Compliant PDF.</p>
    </div>
  );
}

function ResumePreview({ form }) {
  return (
    <div id="printable-area" style={{ background: "white", color: "#000", padding: "40px", marginTop: 40, minHeight: "800px", fontFamily: "Times New Roman, Times, serif", border: "1px solid #ddd", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-area, #printable-area * { visibility: visible; }
          #printable-area { position: absolute; left: 0; top: 0; width: 100%; border: none; box-shadow: none; padding: 0; }
        }
        .resume-section { margin-bottom: 20px; }
        .resume-header { border-bottom: 1px solid #000; padding-bottom: 12px; margin-bottom: 16px; text-align: center; }
        .section-title { font-size: 16px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 10px; color: #000; }
        .item-header { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 2px; font-size: 14px; }
        .item-sub { display: flex; justify-content: space-between; font-size: 14px; font-style: italic; margin-bottom: 4px; }
        .item-desc { font-size: 14px; color: #000; white-space: pre-wrap; line-height: 1.4; }
      `}</style>

      <div className="resume-header">
        <h1 style={{ margin: "0 0 8px", fontSize: 24, textTransform: "uppercase" }}>{form.personal.name || "YOUR NAME"}</h1>
        <div style={{ fontSize: 13, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          {form.personal.email && <span>{form.personal.email}</span>}
          {form.personal.phone && <span>• {form.personal.phone}</span>}
          {form.personal.location && <span>• {form.personal.location}</span>}
        </div>
        <div style={{ fontSize: 13, marginTop: 4, display: "flex", justifyContent: "center", gap: 12 }}>
          {form.personal.linkedin && <span>LinkedIn: {form.personal.linkedin}</span>}
          {form.personal.github && <span>• GitHub: {form.personal.github}</span>}
        </div>
      </div>

      <div className="resume-section">
        <div className="section-title">Education</div>
        {form.education.map((edu, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div className="item-header">
              <span>{edu.institution || "INSTITUTION NAME"}</span>
              <span>{edu.year || "2024"}</span>
            </div>
            <div className="item-sub">
              <span>{edu.degree || "Degree Name"}</span>
              <span>Score: {edu.score || "—"}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="resume-section">
        <div className="section-title">Projects</div>
        {form.projects.map((proj, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div className="item-header">
              <span>{proj.name || "Project Name"} <span style={{ fontWeight: "normal", fontStyle: "italic", fontSize: 13 }}>| {proj.tech}</span></span>
            </div>
            <div className="item-desc">{proj.description}</div>
          </div>
        ))}
      </div>

      {form.experience.some(e => e.company) && (
        <div className="resume-section">
          <div className="section-title">Experience</div>
          {form.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div className="item-header">
                <span>{exp.company}</span>
                <span>{exp.duration}</span>
              </div>
              <div className="item-sub">
                <span>{exp.role}</span>
              </div>
              <div className="item-desc">{exp.description}</div>
            </div>
          ))}
        </div>
      )}

      <div className="resume-section">
        <div className="section-title">Skills</div>
        <div style={{ fontSize: 14 }}>
          <strong>Technical:</strong> {form.skills.technical || "Add skills"}<br />
          <strong>Core Competencies:</strong> {form.skills.soft || "Add skills"}
        </div>
      </div>
    </div>
  );
}
