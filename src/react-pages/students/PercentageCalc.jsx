import { useState } from "react";
import { BRAND, STUDENT_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };
const tabBtn = (active) => ({ padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, background: active ? STUDENT_BRAND.accent : "rgba(255,255,255,0.05)", color: active ? "white" : BRAND.textSecondary });

const CBSE_GRADES = [
  { min: 91, grade: "A1", gp: 10 }, { min: 81, grade: "A2", gp: 9 },
  { min: 71, grade: "B1", gp: 8 }, { min: 61, grade: "B2", gp: 7 },
  { min: 51, grade: "C1", gp: 6 }, { min: 41, grade: "C2", gp: 5 },
  { min: 33, grade: "D", gp: 4 }, { min: 0, grade: "E (Fail)", gp: 0 },
];

function getGrade(pct) { return CBSE_GRADES.find(g => pct >= g.min) || CBSE_GRADES[CBSE_GRADES.length - 1]; }

export default function PercentageCalc() {
  const [mode, setMode] = useState("semester");
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 32, overflowX: "auto" }}>
        <button style={tabBtn(mode === "semester")} onClick={() => setMode("semester")}>📝 Semester</button>
        <button style={tabBtn(mode === "target")} onClick={() => setMode("target")}>🎯 Target</button>
        <button style={tabBtn(mode === "cbse")} onClick={() => setMode("cbse")}>🏫 CBSE Board</button>
      </div>
      {mode === "semester" && <SemesterMode />}
      {mode === "target" && <TargetMode />}
      {mode === "cbse" && <CbseMode />}
    </div>
  );
}

function SemesterMode() {
  const [threshold, setThreshold] = useState(33);
  const [subjects, setSubjects] = useState([
    { name: "Mathematics", obtained: 72, max: 100 },
    { name: "Physics", obtained: 65, max: 100 },
    { name: "Chemistry", obtained: 48, max: 100 },
  ]);

  const addSub = () => setSubjects([...subjects, { name: `Subject ${subjects.length + 1}`, obtained: 0, max: 100 }]);
  const removeSub = (i) => setSubjects(subjects.filter((_, idx) => idx !== i));
  const update = (i, f, v) => { const n = [...subjects]; n[i][f] = v; setSubjects(n); };

  const totalObtained = subjects.reduce((s, sub) => s + sub.obtained, 0);
  const totalMax = subjects.reduce((s, sub) => s + sub.max, 0);
  const overallPct = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
  const failedCount = subjects.filter(s => s.max > 0 && (s.obtained / s.max) * 100 < threshold).length;
  const overallResult = failedCount === 0 ? "PASS ✅" : failedCount <= 2 ? "COMPARTMENT ⚠️" : "FAIL ❌";

  return (
    <div>
      <div style={cs}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <h3 style={{ color: BRAND.text, margin: 0 }}>Semester Result <span style={{ fontSize: 13, color: BRAND.textSecondary }}>सेमेस्टर रिजल्ट</span></h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: BRAND.textSecondary }}>Pass:</span>
            <select value={threshold} onChange={e => setThreshold(+e.target.value)} style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${BRAND.border}`, background: BRAND.surfaceCard, color: BRAND.text, fontSize: 13 }}>
              <option value={33}>33%</option><option value={35}>35%</option><option value={40}>40%</option>
            </select>
            <button onClick={addSub} style={{ background: STUDENT_BRAND.accent, color: "white", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ Add</button>
          </div>
        </div>
        {subjects.map((sub, i) => {
          const p = sub.max > 0 ? (sub.obtained / sub.max) * 100 : 0;
          const pass = p >= threshold;
          const grade = getGrade(p);
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 50px 50px 40px", gap: 8, marginBottom: 12, alignItems: "center" }}>
              <input value={sub.name} onChange={e => update(i, "name", e.target.value)} style={{ padding: 10, borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 14 }} />
              <input type="number" min="0" value={sub.obtained} onChange={e => update(i, "obtained", +e.target.value || 0)} style={{ padding: 10, borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 14, textAlign: "center" }} />
              <input type="number" min="1" value={sub.max} onChange={e => update(i, "max", +e.target.value || 1)} style={{ padding: 10, borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 14, textAlign: "center" }} />
              <span style={{ fontSize: 14, fontWeight: 700, textAlign: "center", color: pass ? "#4CAF50" : "#EF4444" }}>{p.toFixed(0)}%</span>
              <span style={{ fontSize: 12, textAlign: "center", color: BRAND.textSecondary }}>{grade.grade}</span>
              {subjects.length > 1 && <button onClick={() => removeSub(i)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 16 }}>✕</button>}
            </div>
          );
        })}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 50px 50px 40px", gap: 8, fontSize: 11, color: BRAND.textSecondary }}>
          <span>Subject</span><span style={{ textAlign: "center" }}>Got</span><span style={{ textAlign: "center" }}>Max</span><span style={{ textAlign: "center" }}>%</span><span style={{ textAlign: "center" }}>Grade</span><span></span>
        </div>
      </div>

      <div style={{ ...cs, marginTop: 24, textAlign: "center" }}>
        <div style={{ fontSize: 14, color: BRAND.textSecondary }}>Overall Percentage</div>
        <div style={{ fontSize: 64, fontWeight: 900, color: STUDENT_BRAND.accent }}>{overallPct.toFixed(1)}%</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: failedCount === 0 ? "#4CAF50" : "#EF4444", marginTop: 8 }}>{overallResult}</div>
        <div style={{ fontSize: 13, color: BRAND.textSecondary, marginTop: 4 }}>Grade: {getGrade(overallPct).grade} | {totalObtained}/{totalMax} marks</div>
      </div>
    </div>
  );
}

function TargetMode() {
  const [current, setCurrent] = useState(180);
  const [maxSoFar, setMaxSoFar] = useState(300);
  const [remaining, setRemaining] = useState(200);
  const [target, setTarget] = useState(75);

  const totalMax = maxSoFar + remaining;
  const needed = (target / 100) * totalMax - current;
  const neededPct = remaining > 0 ? (needed / remaining) * 100 : 0;

  return (
    <div>
      <div style={cs}>
        <h3 style={{ color: BRAND.text, margin: "0 0 20px" }}>Target Marks <span style={{ fontSize: 13, color: BRAND.textSecondary }}>लक्ष्य अंक</span></h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div><label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Marks Scored So Far</label><input type="number" min="0" value={current} onChange={e => setCurrent(+e.target.value || 0)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 16 }} /></div>
          <div><label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Max Marks So Far</label><input type="number" min="1" value={maxSoFar} onChange={e => setMaxSoFar(+e.target.value || 1)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 16 }} /></div>
          <div><label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Remaining Max Marks</label><input type="number" min="0" value={remaining} onChange={e => setRemaining(+e.target.value || 0)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 16 }} /></div>
          <div><label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Target % Overall</label><input type="number" min="0" max="100" value={target} onChange={e => setTarget(+e.target.value || 0)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 16 }} /></div>
        </div>
      </div>
      <div style={{ ...cs, marginTop: 24, textAlign: "center" }}>
        <div style={{ fontSize: 14, color: BRAND.textSecondary }}>You need to score</div>
        <div style={{ fontSize: 48, fontWeight: 900, color: needed <= 0 ? "#4CAF50" : neededPct <= 80 ? STUDENT_BRAND.accent : "#EF4444" }}>{needed <= 0 ? "Already there! ✅" : `${Math.ceil(needed)} / ${remaining}`}</div>
        {needed > 0 && <div style={{ fontSize: 16, color: BRAND.textSecondary, marginTop: 8 }}>That's {neededPct.toFixed(1)}% in remaining exams</div>}
      </div>
    </div>
  );
}

function CbseMode() {
  const [subjects, setSubjects] = useState([
    { name: "English", marks: 85 }, { name: "Mathematics", marks: 72 },
    { name: "Science", marks: 68 }, { name: "Social Studies", marks: 78 },
    { name: "Hindi", marks: 82 },
  ]);

  const update = (i, v) => { const n = [...subjects]; n[i].marks = v; setSubjects(n); };
  const total = subjects.reduce((s, sub) => s + sub.marks, 0);
  const pct = subjects.length > 0 ? total / subjects.length : 0;
  const cgpa = pct / 9.5;

  return (
    <div>
      <div style={cs}>
        <h3 style={{ color: BRAND.text, margin: "0 0 20px" }}>CBSE Board Result <span style={{ fontSize: 13, color: BRAND.textSecondary }}>सीबीएसई बोर्ड</span></h3>
        {subjects.map((sub, i) => {
          const grade = getGrade(sub.marks);
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 100px 60px", gap: 12, marginBottom: 12, alignItems: "center" }}>
              <input value={sub.name} onChange={e => { const n = [...subjects]; n[i].name = e.target.value; setSubjects(n); }} style={{ padding: 10, borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 14 }} />
              <input type="number" min="0" max="100" value={sub.marks} onChange={e => update(i, +e.target.value || 0)} style={{ padding: 10, borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 14, textAlign: "center" }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: sub.marks >= 33 ? "#4CAF50" : "#EF4444", textAlign: "center" }}>{grade.grade}</span>
            </div>
          );
        })}
      </div>
      <div style={{ ...cs, marginTop: 24, textAlign: "center" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div><div style={{ fontSize: 13, color: BRAND.textSecondary }}>Percentage</div><div style={{ fontSize: 36, fontWeight: 900, color: STUDENT_BRAND.accent }}>{pct.toFixed(1)}%</div></div>
          <div><div style={{ fontSize: 13, color: BRAND.textSecondary }}>CGPA</div><div style={{ fontSize: 36, fontWeight: 900, color: STUDENT_BRAND.accent }}>{cgpa.toFixed(1)}</div></div>
          <div><div style={{ fontSize: 13, color: BRAND.textSecondary }}>Grade</div><div style={{ fontSize: 36, fontWeight: 900, color: STUDENT_BRAND.accent }}>{getGrade(pct).grade}</div></div>
        </div>
      </div>
    </div>
  );
}
