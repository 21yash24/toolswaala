import { useState } from "react";
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
  { name: "VTU", formula: c => (c - 0.75) * 10, reverse: p => p / 10 + 0.75 },
  { name: "Mumbai University", formula: c => 7.25 * c + 11, reverse: p => (p - 11) / 7.25 },
  { name: "Anna University", formula: c => c * 10 - 7.5, reverse: p => (p + 7.5) / 10 },
  { name: "KTU (Kerala)", formula: c => 10 * c - 3.75, reverse: p => (p + 3.75) / 10 },
  { name: "AKTU", formula: c => (c - 0.75) * 10, reverse: p => p / 10 + 0.75 },
  { name: "CBSE (÷9.5)", formula: c => c * 9.5, reverse: p => p / 9.5 },
];

const tabStyle = (active) => ({
  padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
  background: active ? STUDENT_BRAND.accent : "rgba(255,255,255,0.05)",
  color: active ? "white" : BRAND.textSecondary,
  transition: "all 0.2s",
});

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };

export default function CgpaCalculator() {
  const [tab, setTab] = useState(0);
  const tabs = ["SGPA", "CGPA", "CGPA → %", "Target CGPA"];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 32, overflowX: "auto", paddingBottom: 4 }}>
        {tabs.map((t, i) => <button key={i} style={tabStyle(tab === i)} onClick={() => setTab(i)}>{t}</button>)}
      </div>
      {tab === 0 && <SgpaTab />}
      {tab === 1 && <CgpaTab />}
      {tab === 2 && <ConvertTab />}
      {tab === 3 && <TargetTab />}
    </div>
  );
}

function SgpaTab() {
  const [subjects, setSubjects] = useState([
    { name: "Subject 1", credits: 4, grade: 8 },
    { name: "Subject 2", credits: 3, grade: 7 },
    { name: "Subject 3", credits: 3, grade: 9 },
  ]);

  const totalCredits = subjects.reduce((s, sub) => s + sub.credits, 0);
  const weightedSum = subjects.reduce((s, sub) => s + sub.credits * sub.grade, 0);
  const sgpa = totalCredits > 0 ? weightedSum / totalCredits : 0;

  const addRow = () => setSubjects([...subjects, { name: `Subject ${subjects.length + 1}`, credits: 3, grade: 8 }]);
  const removeRow = (i) => setSubjects(subjects.filter((_, idx) => idx !== i));
  const update = (i, field, val) => { const n = [...subjects]; n[i][field] = val; setSubjects(n); };

  return (
    <div>
      <div style={cs}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: "white", margin: 0 }}>SGPA Calculator <span style={{ fontSize: 13, color: BRAND.textSecondary }}>एसजीपीए</span></h3>
          <button onClick={addRow} style={{ background: STUDENT_BRAND.accent, color: "white", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ Add Subject</button>
        </div>
        {subjects.map((sub, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr 40px", gap: 10, marginBottom: 12, alignItems: "center" }}>
            <input value={sub.name} onChange={e => update(i, "name", e.target.value)} placeholder="Subject" style={{ padding: 10, borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 14 }} />
            <input type="number" min="1" max="6" value={sub.credits} onChange={e => update(i, "credits", +e.target.value || 1)} style={{ padding: 10, borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 14, textAlign: "center" }} />
            <select value={sub.grade} onChange={e => update(i, "grade", +e.target.value)} style={{ padding: 10, borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "#1a1a1a", color: "white", fontSize: 14 }}>
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
        <button onClick={() => { navigator.clipboard.writeText(`📊 My SGPA: ${sgpa.toFixed(2)}\nCredits: ${totalCredits}\n\nCalculate yours: ${window.location.href}`); alert("Copied!"); }} style={{ marginTop: 16, background: STUDENT_BRAND.accent, color: "white", border: "none", borderRadius: 10, padding: "10px 24px", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>📋 Copy Result</button>
      </div>
    </div>
  );
}

function CgpaTab() {
  const [semesters, setSemesters] = useState([
    { sgpa: 8.5, credits: 24 },
    { sgpa: 7.8, credits: 22 },
  ]);

  const totalCredits = semesters.reduce((s, sem) => s + sem.credits, 0);
  const weightedSum = semesters.reduce((s, sem) => s + sem.sgpa * sem.credits, 0);
  const cgpa = totalCredits > 0 ? weightedSum / totalCredits : 0;

  const addSem = () => setSemesters([...semesters, { sgpa: 7.0, credits: 22 }]);
  const removeSem = (i) => setSemesters(semesters.filter((_, idx) => idx !== i));
  const update = (i, f, v) => { const n = [...semesters]; n[i][f] = v; setSemesters(n); };

  return (
    <div>
      <div style={cs}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: "white", margin: 0 }}>CGPA Calculator <span style={{ fontSize: 13, color: BRAND.textSecondary }}>सीजीपीए</span></h3>
          <button onClick={addSem} style={{ background: STUDENT_BRAND.accent, color: "white", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ Add Semester</button>
        </div>
        {semesters.map((sem, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr 40px", gap: 12, marginBottom: 12, alignItems: "center" }}>
            <span style={{ color: BRAND.textSecondary, fontSize: 13, textAlign: "center" }}>Sem {i + 1}</span>
            <div>
              <label style={{ fontSize: 11, color: BRAND.textSecondary }}>SGPA</label>
              <input type="number" min="0" max="10" step="0.01" value={sem.sgpa} onChange={e => update(i, "sgpa", +e.target.value || 0)} style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 14 }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: BRAND.textSecondary }}>Credits</label>
              <input type="number" min="1" max="40" value={sem.credits} onChange={e => update(i, "credits", +e.target.value || 1)} style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 14 }} />
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
            <div key={i} style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: `1px solid ${BRAND.border}` }}>
              <div style={{ fontSize: 11, color: BRAND.textSecondary }}>Sem {i + 1}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: s.sgpa >= 8 ? "#4CAF50" : s.sgpa >= 6 ? "#FFC107" : "#EF4444" }}>{s.sgpa}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...cs, marginTop: 24, fontSize: 13, color: BRAND.textSecondary, lineHeight: 1.8 }}>
        <strong style={{ color: "white" }}>Placement Cutoffs (Typical):</strong><br />
        🟢 8.0+ CGPA — Top tech companies (Google, Microsoft, Amazon)<br />
        🟡 7.5+ CGPA — Most mass recruiters & IT companies<br />
        🔴 6.0+ CGPA — Minimum for most on-campus drives<br />
        🎓 8.5+ CGPA — MS/PhD abroad (strong profile)
      </div>
    </div>
  );
}

function ConvertTab() {
  const [cgpa, setCgpa] = useState(8.0);
  const [uniIdx, setUniIdx] = useState(0);
  const [reverseMode, setReverseMode] = useState(false);
  const [pct, setPct] = useState(76);

  const uni = UNIVERSITIES[uniIdx];
  const result = reverseMode ? uni.reverse(pct) : uni.formula(cgpa);

  return (
    <div>
      <div style={cs}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <button onClick={() => setReverseMode(false)} style={tabStyle(!reverseMode)}>CGPA → %</button>
          <button onClick={() => setReverseMode(true)} style={tabStyle(reverseMode)}>% → CGPA</button>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>University</label>
          <select value={uniIdx} onChange={e => setUniIdx(+e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "#1a1a1a", color: "white", fontSize: 14 }}>
            {UNIVERSITIES.map((u, i) => <option key={i} value={i}>{u.name}</option>)}
          </select>
        </div>
        {!reverseMode ? (
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Enter CGPA (0-10)</label>
            <input type="number" min="0" max="10" step="0.01" value={cgpa} onChange={e => setCgpa(+e.target.value || 0)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 20, fontWeight: 700, textAlign: "center" }} />
          </div>
        ) : (
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Enter Percentage</label>
            <input type="number" min="0" max="100" step="0.1" value={pct} onChange={e => setPct(+e.target.value || 0)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 20, fontWeight: 700, textAlign: "center" }} />
          </div>
        )}
      </div>

      <div style={{ ...cs, marginTop: 24, textAlign: "center" }}>
        <div style={{ fontSize: 14, color: BRAND.textSecondary }}>{reverseMode ? "Equivalent CGPA" : "Equivalent Percentage"}</div>
        <div style={{ fontSize: 64, fontWeight: 900, color: STUDENT_BRAND.accent }}>
          {reverseMode ? result.toFixed(2) : `${result.toFixed(1)}%`}
        </div>
        <div style={{ fontSize: 13, color: BRAND.textSecondary, marginTop: 8 }}>Formula: {uni.name}</div>
      </div>
    </div>
  );
}

function TargetTab() {
  const [currentCgpa, setCurrentCgpa] = useState(7.2);
  const [completedCredits, setCompletedCredits] = useState(96);
  const [remainingCredits, setRemainingCredits] = useState(48);
  const [targetCgpa, setTargetCgpa] = useState(8.0);

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
    <div>
      <div style={cs}>
        <h3 style={{ color: "white", margin: "0 0 20px" }}>Target CGPA Planner <span style={{ fontSize: 13, color: BRAND.textSecondary }}>लक्ष्य सीजीपीए</span></h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div><label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Current CGPA</label><input type="number" min="0" max="10" step="0.01" value={currentCgpa} onChange={e => setCurrentCgpa(+e.target.value || 0)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 16 }} /></div>
          <div><label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Target CGPA</label><input type="number" min="0" max="10" step="0.01" value={targetCgpa} onChange={e => setTargetCgpa(+e.target.value || 0)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 16 }} /></div>
          <div><label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Credits Completed</label><input type="number" min="0" value={completedCredits} onChange={e => setCompletedCredits(+e.target.value || 0)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 16 }} /></div>
          <div><label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Credits Remaining</label><input type="number" min="0" value={remainingCredits} onChange={e => setRemainingCredits(+e.target.value || 0)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 16 }} /></div>
        </div>
      </div>

      <div style={{ ...cs, marginTop: 24, textAlign: "center", borderLeft: `4px solid ${statusColors[status]}` }}>
        <div style={{ fontSize: 14, color: BRAND.textSecondary }}>Required SGPA in remaining semesters</div>
        <div style={{ fontSize: 64, fontWeight: 900, color: statusColors[status] }}>
          {status === "impossible" ? "N/A" : Math.max(0, requiredSgpa).toFixed(2)}
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, marginTop: 8 }}>{statusLabels[status]}</div>
      </div>
    </div>
  );
}
