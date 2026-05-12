import { useState, useEffect } from "react";
import { BRAND, STUDENT_BRAND } from "../../shared/constants";

const GRADES = [
  { label: "O (Outstanding)", value: 10 },
  { label: "A+ (Excellent)", value: 9 },
  { label: "A (Very Good)", value: 8 },
  { label: "B+ (Good)", value: 7 },
  { label: "B (Above Avg)", value: 6 },
  { label: "C (Average)", value: 5 },
  { label: "D (Pass)", value: 4 },
  { label: "F (Fail)", value: 0 },
];

const UNIVERSITIES = [
  { name: "Generic (×9.5)", formula: c => c * 9.5, reverse: p => p / 9.5 },
  { name: "Mumbai University", formula: c => (7.1 * c) + 11, reverse: p => (p - 11) / 7.1 },
  { name: "VTU (Karnataka)", formula: c => (c - 0.75) * 10, reverse: p => p / 10 + 0.75 },
  { name: "Anna University", formula: c => c * 10, reverse: p => p / 10 },
  { name: "AKTU (UPTU)", formula: c => (c - 0.75) * 10, reverse: p => p / 10 + 0.75 },
  { name: "KTU (Kerala)", formula: c => (c * 10) - 3.75, reverse: p => (p + 3.75) / 10 },
  { name: "SPPU (Pune Univ)", formula: c => (c >= 6.0) ? (c - 0.75) * 10 : c * 8.8, reverse: p => (p >= 52.5) ? p / 10 + 0.75 : p / 8.8 },
  { name: "Delhi University", formula: c => c * 9.5, reverse: p => p / 9.5 },
  { name: "CBSE / AICTE", formula: c => c * 9.5, reverse: p => p / 9.5 },
];

const tabStyle = (active) => ({
  padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
  background: active ? STUDENT_BRAND.accent : "rgba(124, 58, 237, 0.1)",
  color: active ? "white" : BRAND.text,
  transition: "all 0.2s",
});

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };
const inputStyle = { padding: 10, borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 14 };

export default function CgpaCalculator() {
  const [tab, setTab] = useState(() => parseInt(localStorage.getItem("tw_cgpa_tab") || "0", 10));
  const tabs = ["SGPA", "CGPA", "CGPA → %", "Target CGPA"];

  useEffect(() => { localStorage.setItem("tw_cgpa_tab", tab); }, [tab]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 32, overflowX: "auto", paddingBottom: 4 }}>
        {tabs.map((t, i) => <button key={i} style={tabStyle(tab === i)} onClick={() => setTab(i)}>{t}</button>)}
      </div>
      
      <div className="fade-in" style={{ ...cs, background: "rgba(124, 58, 237, 0.05)", border: `1px solid ${STUDENT_BRAND.accent}30`, marginBottom: 24, padding: "12px 24px" }}>
        <p style={{ margin: 0, fontSize: 13, color: STUDENT_BRAND.accent, fontWeight: 600 }}>💾 Auto-Saved: Your data is stored locally in your browser.</p>
      </div>

      {tab === 0 && <SgpaTab />}
      {tab === 1 && <CgpaTab />}
      {tab === 2 && <ConvertTab />}
      {tab === 3 && <TargetTab />}

      <div style={{ ...cs, marginTop: 40, background: "rgba(0,0,0,0.03)", border: `1px dashed ${BRAND.border}` }}>
        <h4 style={{ color: BRAND.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          🛡️ University Compliance Note
        </h4>
        <p style={{ fontSize: 13, color: BRAND.textSecondary, lineHeight: 1.6 }}>
          Our formulas are based on the **latest UGC & AICTE guidelines (NEP 2020)** and specific university notifications. 
          However, some autonomous colleges may use custom multipliers. **Rule of Thumb:** Check the back page of your official 
          mark sheet for the conversion formula before applying for government jobs or foreign universities.
        </p>
      </div>

      {/* SEO & AdSense Content Block */}
      <div style={{ marginTop: 40, padding: 24, background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, color: BRAND.textSecondary, lineHeight: 1.8 }}>
        <h2 style={{ color: BRAND.text, fontSize: 24, marginBottom: 16 }}>What is CGPA and How is it Calculated?</h2>
        <p style={{ marginBottom: 16 }}>
          Cumulative Grade Point Average (CGPA) is an educational grading system used in schools and colleges across India to measure overall academic performance. Instead of raw marks or percentages, students are awarded grades (like O, A+, A, B) which correspond to specific grade points (10, 9, 8, etc.). The CGPA is the average of Grade Points obtained in all subjects across all semesters, excluding additional subjects.
        </p>
        
        <h3 style={{ color: BRAND.text, fontSize: 20, marginTop: 24, marginBottom: 12 }}>How to convert CGPA to Percentage (The 9.5 Rule)</h3>
        <p style={{ marginBottom: 16 }}>
          For a long time, the Central Board of Secondary Education (CBSE) and AICTE established a standard multiplier of <strong>9.5</strong> to convert CGPA into an approximate percentage. The formula is simple:
          <br/><br/>
          <strong>Percentage (%) = CGPA × 9.5</strong>
          <br/><br/>
          For example, if a student secures a CGPA of 8.4, their estimated percentage would be 8.4 × 9.5 = 79.8%. However, with the National Education Policy (NEP) 2020 and autonomous universities, this multiplier can vary. Mumbai University uses a 7.1 multiplier with an addition of 11, while APJ Abdul Kalam Technical University (AKTU) uses a formula of (CGPA - 0.75) × 10. Our calculator automatically applies the correct university-specific formula for you.
        </p>

        <h3 style={{ color: BRAND.text, fontSize: 20, marginTop: 24, marginBottom: 12 }}>SGPA vs CGPA: What is the difference?</h3>
        <p style={{ marginBottom: 16 }}>
          <strong>SGPA (Semester Grade Point Average)</strong> is the academic performance of a student in a single semester. It is calculated by multiplying the grade points secured in each subject by the credits assigned to that subject, summing them up, and dividing by the total credits for that semester.
          <br/><br/>
          <strong>CGPA</strong> is the cumulative performance over the entire course. It is calculated by taking the weighted average of the SGPAs of all completed semesters.
        </p>

        <h3 style={{ color: BRAND.text, fontSize: 20, marginTop: 24, marginBottom: 12 }}>Frequently Asked Questions (FAQs)</h3>
        <div style={{ marginBottom: 16 }}>
          <strong style={{ color: BRAND.text }}>Q: Is 8.5 CGPA good for placements?</strong>
          <p>A: Yes, an 8.5 CGPA is considered excellent and easily clears the cutoff for almost all top-tier tech companies (like Google, Microsoft, Amazon) as well as mass recruiters (TCS, Infosys, Wipro). It also strengthens your profile for MS/PhD applications abroad.</p>
          
          <strong style={{ color: BRAND.text }}>Q: How do I improve my CGPA?</strong>
          <p>A: The best way to improve your CGPA is to focus on high-credit subjects (like core subjects and labs) rather than low-credit electives. Use our "Target CGPA Planner" tab to see exactly what SGPA you need in your upcoming semesters to hit your dream CGPA.</p>

          <strong style={{ color: BRAND.text }}>Q: Does backlogs affect CGPA?</strong>
          <p>A: When you fail a subject, it negatively impacts your SGPA for that semester. However, once you clear the backlog, the new grade replaces the old one (in most Indian universities), and your CGPA is recalculated. Check your specific university guidelines regarding asterisk (*) marks on transcripts.</p>
        </div>
      </div>
    </div>
  );
}

function SgpaTab() {
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem("tw_cgpa_subjects");
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [
      { name: "Subject 1", credits: 4, grade: 8 },
      { name: "Subject 2", credits: 3, grade: 7 },
      { name: "Subject 3", credits: 3, grade: 9 },
    ];
  });

  useEffect(() => { localStorage.setItem("tw_cgpa_subjects", JSON.stringify(subjects)); }, [subjects]);

  const totalCredits = subjects.reduce((s, sub) => s + sub.credits, 0);
  const weightedSum = subjects.reduce((s, sub) => s + sub.credits * sub.grade, 0);
  const sgpa = totalCredits > 0 ? weightedSum / totalCredits : 0;

  const addRow = () => setSubjects([...subjects, { name: `Subject ${subjects.length + 1}`, credits: 3, grade: 8 }]);
  const removeRow = (i) => setSubjects(subjects.filter((_, idx) => idx !== i));
  const update = (i, field, val) => { const n = [...subjects]; n[i][field] = val; setSubjects(n); };

  return (
    <div className="fade-in">
      <div style={cs}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: BRAND.text, margin: 0 }}>SGPA Calculator <span style={{ fontSize: 13, color: BRAND.textSecondary }}>एसजीपीए</span></h3>
          <button onClick={addRow} style={{ background: STUDENT_BRAND.accent, color: "white", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ Add Subject</button>
        </div>
        {subjects.map((sub, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr 40px", gap: 10, marginBottom: 12, alignItems: "center" }}>
            <input value={sub.name} onChange={e => update(i, "name", e.target.value)} placeholder="Subject" style={{ ...inputStyle }} />
            <input type="number" min="1" max="6" value={sub.credits} onChange={e => update(i, "credits", +e.target.value || 1)} style={{ ...inputStyle, textAlign: "center" }} />
            <select value={sub.grade} onChange={e => update(i, "grade", +e.target.value)} style={{ ...inputStyle }}>
              {GRADES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
            {subjects.length > 1 && <button onClick={() => removeRow(i)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 18 }}>✕</button>}
          </div>
        ))}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr 40px", gap: 10, fontSize: 12, color: BRAND.textSecondary, paddingLeft: 4, marginTop: 4 }}>
          <span>Subject Name</span><span style={{ textAlign: "center" }}>Credits</span><span>Grade</span><span></span>
        </div>
      </div>

      <div style={{ ...cs, marginTop: 24, textAlign: "center" }}>
        <div style={{ fontSize: 14, color: BRAND.textSecondary, marginBottom: 8 }}>Your SGPA</div>
        <div style={{ fontSize: 64, fontWeight: 900, color: STUDENT_BRAND.accent }}>{sgpa.toFixed(2)}</div>
        <div style={{ fontSize: 14, color: BRAND.textSecondary, marginTop: 8 }}>Total Credits: {totalCredits} | Weighted Points: {weightedSum}</div>
        
        <button onClick={() => { 
          const text = `🎓 My SGPA is ${sgpa.toFixed(2)}!\nTotal Credits: ${totalCredits}\n\nCalculate yours at: ${window.location.href}`;
          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
        }} style={{ width: "100%", marginTop: 24, background: "#25D366", color: "white", border: "none", borderRadius: 12, padding: "14px 24px", cursor: "pointer", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>📲</span> Share SGPA on WhatsApp
        </button>
      </div>
    </div>
  );
}

function CgpaTab() {
  const [semesters, setSemesters] = useState(() => {
    const saved = localStorage.getItem("tw_cgpa_semesters");
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [{ sgpa: 8.5, credits: 24 }, { sgpa: 7.8, credits: 22 }];
  });

  useEffect(() => { localStorage.setItem("tw_cgpa_semesters", JSON.stringify(semesters)); }, [semesters]);

  const totalCredits = semesters.reduce((s, sem) => s + sem.credits, 0);
  const weightedSum = semesters.reduce((s, sem) => s + sem.sgpa * sem.credits, 0);
  const cgpa = totalCredits > 0 ? weightedSum / totalCredits : 0;

  const addSem = () => setSemesters([...semesters, { sgpa: 7.0, credits: 22 }]);
  const removeSem = (i) => setSemesters(semesters.filter((_, idx) => idx !== i));
  const update = (i, f, v) => { const n = [...semesters]; n[i][f] = v; setSemesters(n); };

  return (
    <div className="fade-in">
      <div style={cs}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: BRAND.text, margin: 0 }}>CGPA Calculator <span style={{ fontSize: 13, color: BRAND.textSecondary }}>सीजीपीए</span></h3>
          <button onClick={addSem} style={{ background: STUDENT_BRAND.accent, color: "white", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ Add Semester</button>
        </div>
        {semesters.map((sem, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr 40px", gap: 12, marginBottom: 12, alignItems: "center" }}>
            <span style={{ color: BRAND.textSecondary, fontSize: 13, textAlign: "center" }}>Sem {i + 1}</span>
            <div>
              <label style={{ fontSize: 11, color: BRAND.textSecondary }}>SGPA</label>
              <input type="number" min="0" max="10" step="0.01" value={sem.sgpa} onChange={e => update(i, "sgpa", +e.target.value || 0)} style={{ ...inputStyle, width: "100%" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: BRAND.textSecondary }}>Credits</label>
              <input type="number" min="1" max="40" value={sem.credits} onChange={e => update(i, "credits", +e.target.value || 1)} style={{ ...inputStyle, width: "100%" }} />
            </div>
            {semesters.length > 1 && <button onClick={() => removeSem(i)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 18, alignSelf: "end", marginBottom: 4 }}>✕</button>}
          </div>
        ))}
      </div>

      <div style={{ ...cs, marginTop: 24, textAlign: "center" }}>
        <div style={{ fontSize: 14, color: BRAND.textSecondary }}>Cumulative CGPA</div>
        <div style={{ fontSize: 64, fontWeight: 900, color: STUDENT_BRAND.accent }}>{cgpa.toFixed(2)}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 16, flexWrap: "wrap" }}>
          {semesters.map((s, i) => (
            <div key={i} style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(0,0,0,0.02)", border: `1px solid ${BRAND.border}` }}>
              <div style={{ fontSize: 11, color: BRAND.textSecondary }}>Sem {i + 1}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: s.sgpa >= 8 ? "#4CAF50" : s.sgpa >= 6 ? "#FFC107" : "#EF4444" }}>{s.sgpa}</div>
            </div>
          ))}
        </div>
        
        <button onClick={() => { 
          const text = `🎓 My CGPA is ${cgpa.toFixed(2)}!\nCheck yours at: ${window.location.href}`;
          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
        }} style={{ width: "100%", marginTop: 24, background: "#25D366", color: "white", border: "none", borderRadius: 12, padding: "14px 24px", cursor: "pointer", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>📲</span> Share CGPA on WhatsApp
        </button>
      </div>

      <div style={{ ...cs, marginTop: 24, fontSize: 13, color: BRAND.textSecondary, lineHeight: 1.8 }}>
        <strong style={{ color: BRAND.text }}>Placement Cutoffs (Typical):</strong><br />
        🟢 8.0+ CGPA — Top tech companies (Google, Microsoft, Amazon)<br />
        🟡 7.5+ CGPA — Most mass recruiters & IT companies<br />
        🔴 6.0+ CGPA — Minimum for most on-campus drives<br />
        🎓 8.5+ CGPA — MS/PhD abroad (strong profile)
      </div>
    </div>
  );
}

function ConvertTab() {
  const [cgpa, setCgpa] = useState(() => parseFloat(localStorage.getItem("tw_cgpa_val") || "8.0"));
  const [uniIdx, setUniIdx] = useState(() => parseInt(localStorage.getItem("tw_cgpa_uni") || "0", 10));
  const [reverseMode, setReverseMode] = useState(() => localStorage.getItem("tw_cgpa_rev") === "true");
  const [pct, setPct] = useState(() => parseFloat(localStorage.getItem("tw_cgpa_pct") || "76"));

  useEffect(() => {
    localStorage.setItem("tw_cgpa_val", cgpa);
    localStorage.setItem("tw_cgpa_uni", uniIdx);
    localStorage.setItem("tw_cgpa_rev", reverseMode);
    localStorage.setItem("tw_cgpa_pct", pct);
  }, [cgpa, uniIdx, reverseMode, pct]);

  const uni = UNIVERSITIES[uniIdx];
  const result = reverseMode ? uni.reverse(pct) : uni.formula(cgpa);

  return (
    <div className="fade-in">
      <div style={cs}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <button onClick={() => setReverseMode(false)} style={tabStyle(!reverseMode)}>CGPA → %</button>
          <button onClick={() => setReverseMode(true)} style={tabStyle(reverseMode)}>% → CGPA</button>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>University</label>
          <select value={uniIdx} onChange={e => setUniIdx(+e.target.value)} style={{ ...inputStyle, width: "100%", padding: 12, fontSize: 14 }}>
            {UNIVERSITIES.map((u, i) => <option key={i} value={i}>{u.name}</option>)}
          </select>
        </div>
        {!reverseMode ? (
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Enter CGPA (0-10)</label>
            <input type="number" min="0" max="10" step="0.01" value={cgpa} onChange={e => setCgpa(+e.target.value || 0)} style={{ ...inputStyle, width: "100%", padding: 12, fontSize: 20, fontWeight: 700, textAlign: "center" }} />
          </div>
        ) : (
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Enter Percentage</label>
            <input type="number" min="0" max="100" step="0.1" value={pct} onChange={e => setPct(+e.target.value || 0)} style={{ ...inputStyle, width: "100%", padding: 12, fontSize: 20, fontWeight: 700, textAlign: "center" }} />
          </div>
        )}
      </div>

      <div style={{ ...cs, marginTop: 24, textAlign: "center" }}>
        <div style={{ fontSize: 14, color: BRAND.textSecondary }}>{reverseMode ? "Equivalent CGPA" : "Equivalent Percentage"}</div>
        <div style={{ fontSize: 64, fontWeight: 900, color: STUDENT_BRAND.accent }}>
          {reverseMode ? result.toFixed(2) : `${result.toFixed(1)}%`}
        </div>
        <div style={{ fontSize: 13, color: BRAND.textSecondary, marginTop: 8 }}>Formula: {uni.name}</div>
        
        <button onClick={() => { 
          const text = `🎓 CGPA to Percentage Conversion:\nMy ${reverseMode ? 'Percentage' : 'CGPA'} is ${reverseMode ? pct : cgpa}, which equals ${reverseMode ? result.toFixed(2) + ' CGPA' : result.toFixed(1) + '%'} (${uni.name}).\n\nConvert yours at: ${window.location.href}`;
          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
        }} style={{ width: "100%", marginTop: 24, background: "#25D366", color: "white", border: "none", borderRadius: 12, padding: "14px 24px", cursor: "pointer", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>📲</span> Share Result
        </button>
      </div>
    </div>
  );
}

function TargetTab() {
  const [currentCgpa, setCurrentCgpa] = useState(() => parseFloat(localStorage.getItem("tw_target_cur") || "7.2"));
  const [completedCredits, setCompletedCredits] = useState(() => parseInt(localStorage.getItem("tw_target_comp") || "96", 10));
  const [remainingCredits, setRemainingCredits] = useState(() => parseInt(localStorage.getItem("tw_target_rem") || "48", 10));
  const [targetCgpa, setTargetCgpa] = useState(() => parseFloat(localStorage.getItem("tw_target_tar") || "8.0"));

  useEffect(() => {
    localStorage.setItem("tw_target_cur", currentCgpa);
    localStorage.setItem("tw_target_comp", completedCredits);
    localStorage.setItem("tw_target_rem", remainingCredits);
    localStorage.setItem("tw_target_tar", targetCgpa);
  }, [currentCgpa, completedCredits, remainingCredits, targetCgpa]);

  const requiredSgpa = remainingCredits > 0
    ? (targetCgpa * (completedCredits + remainingCredits) - currentCgpa * completedCredits) / remainingCredits
    : 0;

  const status = requiredSgpa <= 0 ? "done" : requiredSgpa <= 8 ? "easy" : requiredSgpa <= 9.5 ? "hard" : requiredSgpa <= 10 ? "danger" : "impossible";
  const statusColors = { done: "#4CAF50", easy: "#4CAF50", hard: "#F59E0B", danger: "#EF4444", impossible: "#EF4444" };
  const statusLabels = {
    done: "✅ You've already achieved this!",
    easy: "🟢 Achievable — Keep it up!",
    hard: "🟡 Challenging — You need consistent A/A+ grades",
    danger: "🔴 Very Difficult — Needs near-perfect performance",
    impossible: "❌ Not possible with remaining credits",
  };

  return (
    <div className="fade-in">
      <div style={cs}>
        <h3 style={{ color: BRAND.text, margin: "0 0 20px" }}>Target CGPA Planner <span style={{ fontSize: 13, color: BRAND.textSecondary }}>लक्ष्य सीजीपीए</span></h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div><label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Current CGPA</label><input type="number" min="0" max="10" step="0.01" value={currentCgpa} onChange={e => setCurrentCgpa(+e.target.value || 0)} style={{ ...inputStyle, width: "100%", padding: 12, fontSize: 16 }} /></div>
          <div><label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Target CGPA</label><input type="number" min="0" max="10" step="0.01" value={targetCgpa} onChange={e => setTargetCgpa(+e.target.value || 0)} style={{ ...inputStyle, width: "100%", padding: 12, fontSize: 16 }} /></div>
          <div><label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Credits Completed</label><input type="number" min="0" value={completedCredits} onChange={e => setCompletedCredits(+e.target.value || 0)} style={{ ...inputStyle, width: "100%", padding: 12, fontSize: 16 }} /></div>
          <div><label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Credits Remaining</label><input type="number" min="0" value={remainingCredits} onChange={e => setRemainingCredits(+e.target.value || 0)} style={{ ...inputStyle, width: "100%", padding: 12, fontSize: 16 }} /></div>
        </div>
      </div>

      <div style={{ ...cs, marginTop: 24, textAlign: "center", borderLeft: `4px solid ${statusColors[status]}` }}>
        <div style={{ fontSize: 14, color: BRAND.textSecondary }}>Required SGPA in remaining semesters</div>
        <div style={{ fontSize: 64, fontWeight: 900, color: statusColors[status] }}>
          {status === "impossible" ? "N/A" : Math.max(0, requiredSgpa).toFixed(2)}
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, marginTop: 8, color: BRAND.text }}>{statusLabels[status]}</div>
        
        <button onClick={() => { 
          const text = `🎯 My Target CGPA Planner:\nI want to hit ${targetCgpa} CGPA.\nI need to score ${Math.max(0, requiredSgpa).toFixed(2)} SGPA in my remaining semesters!\n\nPlan yours at: ${window.location.href}`;
          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
        }} style={{ width: "100%", marginTop: 24, background: "#25D366", color: "white", border: "none", borderRadius: 12, padding: "14px 24px", cursor: "pointer", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>📲</span> Share Target on WhatsApp
        </button>
      </div>
    </div>
  );
}
