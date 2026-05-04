import { useState } from "react";
import { BRAND, STUDENT_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };
const tabBtn = (active) => ({ padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, background: active ? STUDENT_BRAND.accent : "rgba(255,255,255,0.05)", color: active ? "white" : BRAND.textSecondary });

export default function AttendanceCalc() {
  const [mode, setMode] = useState("overall");
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
        <button style={tabBtn(mode === "overall")} onClick={() => setMode("overall")}>📊 Overall</button>
        <button style={tabBtn(mode === "subject")} onClick={() => setMode("subject")}>📚 Subject-wise</button>
      </div>
      {mode === "overall" ? <OverallMode /> : <SubjectMode />}
    </div>
  );
}

function OverallMode() {
  const [total, setTotal] = useState(120);
  const [attended, setAttended] = useState(85);

  const pct = total > 0 ? (attended / total) * 100 : 0;
  const canBunk = total > 0 ? Math.floor((attended - 0.75 * total) / 0.75) : 0;
  const mustAttend = total > 0 && pct < 75 ? Math.ceil((0.75 * total - attended) / 0.25) : 0;
  const status = pct >= 75 ? "safe" : pct >= 65 ? "warning" : "danger";
  const colors = { safe: "#4CAF50", warning: "#F59E0B", danger: "#EF4444" };
  const labels = { safe: "Safe ✅ / सुरक्षित", warning: "Below Required ⚠️ / कम उपस्थिति", danger: "DETAINED RISK 🚨 / डिटेन होने का खतरा" };

  return (
    <div>
      <div style={cs}>
        <h3 style={{ color: "white", margin: "0 0 20px" }}>Overall Attendance <span style={{ fontSize: 13, color: BRAND.textSecondary }}>कुल उपस्थिति</span></h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Total Classes Held / कुल कक्षाएं</label>
            <input type="number" min="0" value={total} onChange={e => setTotal(+e.target.value || 0)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 18, fontWeight: 700 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Classes Attended / उपस्थित</label>
            <input type="number" min="0" value={attended} onChange={e => setAttended(+e.target.value || 0)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 18, fontWeight: 700 }} />
          </div>
        </div>
      </div>

      <div style={{ ...cs, marginTop: 24, textAlign: "center", borderLeft: `4px solid ${colors[status]}` }}>
        <div style={{ fontSize: 14, color: BRAND.textSecondary }}>Attendance Percentage</div>
        <div style={{ fontSize: 72, fontWeight: 900, color: colors[status] }}>{pct.toFixed(1)}%</div>
        <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4, color: colors[status] }}>{labels[status]}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
        <div style={{ ...cs, textAlign: "center", borderTop: `3px solid ${pct >= 75 ? "#4CAF50" : BRAND.border}` }}>
          <div style={{ fontSize: 13, color: BRAND.textSecondary, marginBottom: 8 }}>🎉 Classes You Can Bunk</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: canBunk > 0 ? "#4CAF50" : BRAND.textSecondary }}>{Math.max(0, canBunk)}</div>
          <div style={{ fontSize: 12, color: BRAND.textSecondary }}>...and still stay above 75%</div>
        </div>
        <div style={{ ...cs, textAlign: "center", borderTop: `3px solid ${pct < 75 ? "#EF4444" : BRAND.border}` }}>
          <div style={{ fontSize: 13, color: BRAND.textSecondary, marginBottom: 8 }}>📚 Must Attend to Reach 75%</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: mustAttend > 0 ? "#EF4444" : "#4CAF50" }}>{mustAttend > 0 ? mustAttend : "—"}</div>
          <div style={{ fontSize: 12, color: BRAND.textSecondary }}>{mustAttend > 0 ? "consecutive classes needed" : "You're already above 75%!"}</div>
        </div>
      </div>

      {pct < 65 && (
        <div style={{ ...cs, marginTop: 24, background: "rgba(239,68,68,0.05)", borderColor: "#EF4444", textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>⚠️</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#EF4444" }}>भाई, अब मत बुनकना!</div>
          <div style={{ fontSize: 14, color: BRAND.textSecondary }}>प्रोफेसर को देख के जाओ! 😅</div>
        </div>
      )}

      <button onClick={() => { navigator.clipboard.writeText(`📊 My Attendance: ${pct.toFixed(1)}%\nAttended: ${attended}/${total}\n${canBunk > 0 ? `Can bunk ${canBunk} more!` : `Need ${mustAttend} more classes for 75%`}\n\nCheck yours: ${window.location.href}`); alert("Copied!"); }} style={{ width: "100%", marginTop: 24, background: STUDENT_BRAND.accent, color: "white", border: "none", borderRadius: 12, padding: "14px 24px", cursor: "pointer", fontSize: 15, fontWeight: 700 }}>📋 Copy & Share on WhatsApp</button>
    </div>
  );
}

function SubjectMode() {
  const [subjects, setSubjects] = useState([
    { name: "Maths", total: 30, attended: 25 },
    { name: "Physics", total: 28, attended: 20 },
    { name: "Chemistry", total: 25, attended: 22 },
  ]);

  const addSub = () => setSubjects([...subjects, { name: `Subject ${subjects.length + 1}`, total: 30, attended: 20 }]);
  const removeSub = (i) => setSubjects(subjects.filter((_, idx) => idx !== i));
  const update = (i, f, v) => { const n = [...subjects]; n[i][f] = v; setSubjects(n); };

  const totalAll = subjects.reduce((s, sub) => s + sub.total, 0);
  const attendedAll = subjects.reduce((s, sub) => s + sub.attended, 0);
  const overallPct = totalAll > 0 ? (attendedAll / totalAll) * 100 : 0;

  return (
    <div>
      <div style={cs}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: "white", margin: 0 }}>Subject Tracker <span style={{ fontSize: 13, color: BRAND.textSecondary }}>विषय-वार</span></h3>
          <button onClick={addSub} style={{ background: STUDENT_BRAND.accent, color: "white", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ Add</button>
        </div>
        {subjects.map((sub, i) => {
          const p = sub.total > 0 ? (sub.attended / sub.total) * 100 : 0;
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 60px 40px", gap: 10, marginBottom: 12, alignItems: "center" }}>
              <input value={sub.name} onChange={e => update(i, "name", e.target.value)} style={{ padding: 10, borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 14 }} />
              <input type="number" min="0" value={sub.total} onChange={e => update(i, "total", +e.target.value || 0)} placeholder="Total" style={{ padding: 10, borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 14, textAlign: "center" }} />
              <input type="number" min="0" value={sub.attended} onChange={e => update(i, "attended", +e.target.value || 0)} placeholder="Present" style={{ padding: 10, borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 14, textAlign: "center" }} />
              <span style={{ fontSize: 16, fontWeight: 700, textAlign: "center", color: p >= 75 ? "#4CAF50" : p >= 65 ? "#F59E0B" : "#EF4444" }}>{p.toFixed(0)}%</span>
              {subjects.length > 1 && <button onClick={() => removeSub(i)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 16 }}>✕</button>}
            </div>
          );
        })}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 60px 40px", gap: 10, fontSize: 11, color: BRAND.textSecondary, marginTop: 4 }}>
          <span>Subject</span><span style={{ textAlign: "center" }}>Total</span><span style={{ textAlign: "center" }}>Present</span><span style={{ textAlign: "center" }}>%</span><span></span>
        </div>
      </div>

      <div style={{ ...cs, marginTop: 24, textAlign: "center" }}>
        <div style={{ fontSize: 14, color: BRAND.textSecondary }}>Overall Aggregate</div>
        <div style={{ fontSize: 48, fontWeight: 900, color: overallPct >= 75 ? "#4CAF50" : "#EF4444" }}>{overallPct.toFixed(1)}%</div>
        <div style={{ fontSize: 13, color: BRAND.textSecondary }}>{attendedAll} / {totalAll} classes attended</div>
      </div>
    </div>
  );
}
