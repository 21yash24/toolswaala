import { useState, useEffect, useMemo } from "react";
import { BRAND, STUDENT_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };
const tabBtn = (active) => ({ padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, background: active ? STUDENT_BRAND.accent : "rgba(255,255,255,0.05)", color: active ? "white" : BRAND.textSecondary, transition: "0.2s" });

const MOODS = [
  { min: 90, emoji: "🔥", label: "Legend", msg: "Topper vibes! Professor's favourite! 😎", color: "#10B981" },
  { min: 75, emoji: "😎", label: "Safe Zone", msg: "Chill hai bhai, bunk maar le thode! 🎉", color: "#4CAF50" },
  { min: 65, emoji: "😰", label: "Danger Zone", msg: "Bhai sambhal ja, proxy lagwa! ⚠️", color: "#F59E0B" },
  { min: 50, emoji: "💀", label: "Critical", msg: "Detention loading... 🚨", color: "#EF4444" },
  { min: 0, emoji: "☠️", label: "Game Over", msg: "Year back confirmed! 😭", color: "#DC2626" },
];

const getMood = (pct) => MOODS.find(m => pct >= m.min) || MOODS[MOODS.length - 1];

function CircularProgress({ pct, size = 180 }) {
  const r = (size - 16) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(pct, 100) / 100) * c;
  const mood = getMood(pct);
  return (
    <svg width={size} height={size} style={{ display: "block", margin: "0 auto" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={12} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={mood.color} strokeWidth={12} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      <text x="50%" y="42%" textAnchor="middle" fill={mood.color} fontSize={size * 0.22} fontWeight="900">{pct.toFixed(1)}%</text>
      <text x="50%" y="60%" textAnchor="middle" fill={BRAND.textSecondary} fontSize={14}>{mood.label}</text>
      <text x="50%" y="75%" textAnchor="middle" fontSize={28}>{mood.emoji}</text>
    </svg>
  );
}

function StreakBadge({ streak }) {
  const tier = streak >= 30 ? { label: "Diamond 💎", bg: "#7C3AED" } : streak >= 14 ? { label: "Gold 🥇", bg: "#F59E0B" } : streak >= 7 ? { label: "Silver 🥈", bg: "#9CA3AF" } : { label: "Bronze 🥉", bg: "#CD7F32" };
  return (
    <div style={{ ...cs, textAlign: "center", background: `${tier.bg}15`, borderColor: `${tier.bg}40` }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>🔥</div>
      <div style={{ fontSize: 48, fontWeight: 900, color: tier.bg }}>{streak}</div>
      <div style={{ fontSize: 13, color: BRAND.textSecondary }}>Day Streak</div>
      <div style={{ marginTop: 8, padding: "4px 12px", borderRadius: 20, background: `${tier.bg}20`, color: tier.bg, fontSize: 12, fontWeight: 700, display: "inline-block" }}>{tier.label}</div>
    </div>
  );
}

function MiniCalendar({ logs }) {
  const today = new Date();
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const log = logs[key];
    days.push({ key, day: d.getDate(), weekday: d.toLocaleDateString("en", { weekday: "short" }), status: log || null });
  }
  return (
    <div style={cs}>
      <h4 style={{ color: BRAND.text, margin: "0 0 16px", fontSize: 15 }}>📅 Last 30 Days</h4>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 4 }}>
        {days.map(d => (
          <div key={d.key} title={`${d.key}: ${d.status || "No log"}`} style={{ width: "100%", aspectRatio: "1", borderRadius: 6, background: d.status === "present" ? "#4CAF5040" : d.status === "absent" ? "#EF444440" : d.status === "holiday" ? "#F59E0B30" : "rgba(255,255,255,0.03)", border: `1px solid ${d.status === "present" ? "#4CAF5060" : d.status === "absent" ? "#EF444460" : "transparent"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: BRAND.textSecondary, fontWeight: 600 }}>
            {d.day}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 12, justifyContent: "center" }}>
        <span style={{ fontSize: 11, color: BRAND.textSecondary }}>🟢 Present</span>
        <span style={{ fontSize: 11, color: BRAND.textSecondary }}>🔴 Absent</span>
        <span style={{ fontSize: 11, color: BRAND.textSecondary }}>🟡 Holiday</span>
      </div>
    </div>
  );
}

export default function AttendanceCalc() {
  const [mode, setMode] = useState(() => localStorage.getItem("tw_att_mode") || "daily");
  useEffect(() => { localStorage.setItem("tw_att_mode", mode); }, [mode]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
        <button style={tabBtn(mode === "daily")} onClick={() => setMode("daily")}>📅 Daily Log</button>
        <button style={tabBtn(mode === "overall")} onClick={() => setMode("overall")}>📊 Quick Calc</button>
        <button style={tabBtn(mode === "subject")} onClick={() => setMode("subject")}>📚 Subject-wise</button>
      </div>
      {mode === "daily" ? <DailyMode /> : mode === "overall" ? <OverallMode /> : <SubjectMode />}

      {/* SEO & AdSense Content Block */}
      <div style={{ marginTop: 40, padding: 24, background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, color: BRAND.textSecondary, lineHeight: 1.8 }}>
        <h2 style={{ color: BRAND.text, fontSize: 24, marginBottom: 16 }}>The 75% Attendance Rule Explained</h2>
        <p style={{ marginBottom: 16 }}>
          In most Indian universities, engineering colleges, and medical schools, the University Grants Commission (UGC) mandates a minimum of <strong>75% attendance</strong> to be eligible to sit for end-semester examinations. Falling below this threshold often results in being detained or debarred from exams, leading to a year-back or summer semester.
        </p>
        
        <h3 style={{ color: BRAND.text, fontSize: 20, marginTop: 24, marginBottom: 12 }}>How to Calculate Safe Bunks</h3>
        <p style={{ marginBottom: 16 }}>
          A "safe bunk" is a class you can skip without your overall attendance dropping below the required 75%. To calculate this manually, you need to know your total conducted classes and your total attended classes. The mathematical formula is:
          <br/><br/>
          <strong>Safe Bunks = (Total Attended - (0.75 × Total Conducted)) / 0.75</strong>
          <br/><br/>
          If this number is negative, it means you are already in the danger zone and must attend the next few classes consecutively to bring your percentage up. Our Attendance Bunk Calculator automates this math for you instantly.
        </p>

        <h3 style={{ color: BRAND.text, fontSize: 20, marginTop: 24, marginBottom: 12 }}>Why tracking Subject-wise is crucial</h3>
        <p style={{ marginBottom: 16 }}>
          Many students make the mistake of only tracking their <em>overall</em> aggregate attendance. However, most strict autonomous universities (like VIT, SRM, Manipal) and state boards (like AKTU, VTU) require a minimum of 75% attendance in <strong>each individual subject</strong>. Bunking too many math classes while attending all your lab sessions might keep your overall average high, but you will still be detained in math. Use our "Subject-wise" tab to prevent this.
        </p>

        <h3 style={{ color: BRAND.text, fontSize: 20, marginTop: 24, marginBottom: 12 }}>Frequently Asked Questions (FAQs)</h3>
        <div style={{ marginBottom: 16 }}>
          <strong style={{ color: BRAND.text }}>Q: Are medical leaves counted as present?</strong>
          <p>A: In most colleges, submitting a valid medical certificate gives you a relaxation of up to 10-15%, meaning your required cutoff drops from 75% to 65% or 60%. However, these days are still technically marked as "Absent" on the official portal.</p>
          
          <strong style={{ color: BRAND.text }}>Q: Does proxy attendance actually work?</strong>
          <p>A: While a "proxy" (having a friend mark you present) might temporarily boost your numbers, biometric attendance and randomized roll calls have made this risky. If caught, professors often cancel the attendance of the entire class or issue a disciplinary warning. It's better to bunk mathematically!</p>

          <strong style={{ color: BRAND.text }}>Q: How does the Daily Streak work?</strong>
          <p>A: Our tool rewards consistency. By attending college consecutively, you build an attendance streak. Hitting higher tiers (Bronze, Silver, Gold, Diamond) acts as a psychological buffer, so when you actually need to take a day off for an interview, hackathon, or illness, you don't have to stress about the 75% rule.</p>
        </div>
      </div>
    </div>
  );
}

function DailyMode() {
  const [logs, setLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tw_att_daily") || "{}"); } catch { return {}; }
  });
  const [subjects, setSubjects] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tw_att_daily_subs") || '["Maths","Physics","Chemistry","English","CS"]'); } catch { return ["Maths","Physics","Chemistry"]; }
  });
  const [newSub, setNewSub] = useState("");

  useEffect(() => { localStorage.setItem("tw_att_daily", JSON.stringify(logs)); }, [logs]);
  useEffect(() => { localStorage.setItem("tw_att_daily_subs", JSON.stringify(subjects)); }, [subjects]);

  const todayKey = new Date().toISOString().split("T")[0];

  const markToday = (status) => {
    setLogs(prev => ({ ...prev, [todayKey]: status }));
  };

  const streak = useMemo(() => {
    let count = 0;
    const d = new Date();
    for (let i = 0; i < 365; i++) {
      const key = d.toISOString().split("T")[0];
      if (logs[key] === "present") { count++; d.setDate(d.getDate() - 1); }
      else if (logs[key] === "holiday") { d.setDate(d.getDate() - 1); }
      else break;
    }
    return count;
  }, [logs]);

  const stats = useMemo(() => {
    const vals = Object.values(logs);
    const present = vals.filter(v => v === "present").length;
    const absent = vals.filter(v => v === "absent").length;
    const total = present + absent;
    const pct = total > 0 ? (present / total) * 100 : 0;
    return { present, absent, total, pct };
  }, [logs]);

  const canBunk = stats.total > 0 ? Math.floor((stats.present - 0.75 * stats.total) / 0.75) : 0;
  const mood = getMood(stats.pct);

  const addSubject = () => {
    if (newSub.trim() && !subjects.includes(newSub.trim())) {
      setSubjects([...subjects, newSub.trim()]);
      setNewSub("");
    }
  };

  return (
    <div className="fade-in">
      <div style={{ ...cs, background: `${mood.color}08`, borderColor: `${mood.color}30`, marginBottom: 24, textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 16, color: BRAND.textSecondary, marginBottom: 16 }}>Today: {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</div>
        
        {logs[todayKey] ? (
          <div>
            <div style={{ fontSize: 48, marginBottom: 8 }}>{logs[todayKey] === "present" ? "✅" : logs[todayKey] === "absent" ? "❌" : "🏖️"}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: BRAND.text, marginBottom: 8 }}>
              Marked: {logs[todayKey].charAt(0).toUpperCase() + logs[todayKey].slice(1)}
            </div>
            <button onClick={() => { const newLogs = {...logs}; delete newLogs[todayKey]; setLogs(newLogs); }} style={{ padding: "8px 16px", borderRadius: 8, background: "none", border: `1px solid ${BRAND.border}`, color: BRAND.textSecondary, cursor: "pointer", fontSize: 13 }}>Change</button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: BRAND.text, marginBottom: 20 }}>Did you attend college today? / आज कॉलेज गए?</div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => markToday("present")} style={{ padding: "14px 32px", borderRadius: 12, border: "none", background: "#4CAF50", color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>✅ Present / गया</button>
              <button onClick={() => markToday("absent")} style={{ padding: "14px 32px", borderRadius: 12, border: "none", background: "#EF4444", color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>❌ Absent / नहीं गया</button>
              <button onClick={() => markToday("holiday")} style={{ padding: "14px 28px", borderRadius: 12, border: "none", background: "#F59E0B", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>🏖️ Holiday</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 24 }}>
        <StreakBadge streak={streak} />
        <div style={{ ...cs, textAlign: "center" }}>
          <CircularProgress pct={stats.pct} size={140} />
          <div style={{ fontSize: 13, color: mood.color, fontWeight: 600, marginTop: 8 }}>{mood.msg}</div>
        </div>
        <div style={{ ...cs, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: BRAND.textSecondary, marginBottom: 8 }}>🎉 Safe Bunks Left</div>
          <div style={{ fontSize: 56, fontWeight: 900, color: canBunk > 0 ? "#4CAF50" : "#EF4444" }}>{Math.max(0, canBunk)}</div>
          <div style={{ fontSize: 12, color: BRAND.textSecondary }}>...and stay above 75%</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16, marginBottom: 24 }}>
        <MiniCalendar logs={logs} />
        <div style={cs}>
          <h4 style={{ color: BRAND.text, margin: "0 0 16px", fontSize: 15 }}>📊 Semester Stats</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ textAlign: "center", padding: 16, borderRadius: 12, background: "rgba(76,175,80,0.08)" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#4CAF50" }}>{stats.present}</div>
              <div style={{ fontSize: 12, color: BRAND.textSecondary }}>Days Present</div>
            </div>
            <div style={{ textAlign: "center", padding: 16, borderRadius: 12, background: "rgba(239,68,68,0.08)" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#EF4444" }}>{stats.absent}</div>
              <div style={{ fontSize: 12, color: BRAND.textSecondary }}>Days Absent</div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <h5 style={{ color: BRAND.text, margin: "0 0 8px", fontSize: 13 }}>Your Subjects</h5>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              {subjects.map((s, i) => (
                <span key={i} style={{ padding: "4px 10px", borderRadius: 8, background: `${STUDENT_BRAND.accent}15`, color: STUDENT_BRAND.accent, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                  {s}
                  <button onClick={() => setSubjects(subjects.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 12, padding: 0 }}>×</button>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={newSub} onChange={e => setNewSub(e.target.value)} onKeyDown={e => e.key === "Enter" && addSubject()} placeholder="Add subject..." style={{ flex: 1, padding: 8, borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: BRAND.text, fontSize: 13 }} />
              <button onClick={addSubject} style={{ padding: "8px 14px", borderRadius: 8, background: STUDENT_BRAND.accent, color: "white", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+</button>
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => {
        const text = `🔥 My Attendance Streak: ${streak} days!\n📊 Overall: ${stats.pct.toFixed(1)}%\n${canBunk > 0 ? `😎 Can still bunk ${canBunk} classes!` : `💀 Need to attend more classes!`}\n\nTrack yours free: ${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
      }} style={{ width: "100%", background: "#25D366", color: "white", border: "none", borderRadius: 12, padding: "14px 24px", cursor: "pointer", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <span style={{ fontSize: 20 }}>📲</span> Share Streak on WhatsApp
      </button>
    </div>
  );
}

function OverallMode() {
  const [total, setTotal] = useState(() => parseInt(localStorage.getItem("tw_att_total") || "120", 10));
  const [attended, setAttended] = useState(() => parseInt(localStorage.getItem("tw_att_attended") || "85", 10));
  useEffect(() => { localStorage.setItem("tw_att_total", total); localStorage.setItem("tw_att_attended", attended); }, [total, attended]);

  const pct = total > 0 ? (attended / total) * 100 : 0;
  const canBunk = total > 0 ? Math.floor((attended - 0.75 * total) / 0.75) : 0;
  const mustAttend = total > 0 && pct < 75 ? Math.ceil((0.75 * total - attended) / 0.25) : 0;
  const mood = getMood(pct);

  return (
    <div className="fade-in">
      <div style={{ ...cs, background: "rgba(124, 58, 237, 0.05)", border: `1px solid ${STUDENT_BRAND.accent}30`, marginBottom: 24, padding: "12px 24px" }}>
        <p style={{ margin: 0, fontSize: 13, color: STUDENT_BRAND.accent, fontWeight: 600 }}>💾 Auto-Saved locally in your browser.</p>
      </div>
      <div style={cs}>
        <h3 style={{ color: BRAND.text, margin: "0 0 20px" }}>Quick Calculator <span style={{ fontSize: 13, color: BRAND.textSecondary }}>कुल उपस्थिति</span></h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Total Classes / कुल कक्षाएं</label>
            <input type="number" min="0" value={total} onChange={e => setTotal(+e.target.value || 0)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: BRAND.text, fontSize: 18, fontWeight: 700 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Attended / उपस्थित</label>
            <input type="number" min="0" value={attended} onChange={e => setAttended(+e.target.value || 0)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: BRAND.text, fontSize: 18, fontWeight: 700 }} />
          </div>
        </div>
      </div>

      <div style={{ ...cs, marginTop: 24, textAlign: "center" }}>
        <CircularProgress pct={pct} />
        <div style={{ fontSize: 16, fontWeight: 600, marginTop: 12, color: mood.color }}>{mood.msg}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
        <div style={{ ...cs, textAlign: "center", borderTop: `3px solid ${pct >= 75 ? "#4CAF50" : BRAND.border}` }}>
          <div style={{ fontSize: 13, color: BRAND.textSecondary, marginBottom: 8 }}>🎉 Classes You Can Bunk</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: canBunk > 0 ? "#4CAF50" : BRAND.textSecondary }}>{Math.max(0, canBunk)}</div>
        </div>
        <div style={{ ...cs, textAlign: "center", borderTop: `3px solid ${pct < 75 ? "#EF4444" : BRAND.border}` }}>
          <div style={{ fontSize: 13, color: BRAND.textSecondary, marginBottom: 8 }}>📚 Must Attend for 75%</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: mustAttend > 0 ? "#EF4444" : "#4CAF50" }}>{mustAttend > 0 ? mustAttend : "—"}</div>
        </div>
      </div>

      <button onClick={() => {
        const text = `🚨 Bunk Status 🚨\nAttendance: ${pct.toFixed(1)}%\n${canBunk > 0 ? `😎 Can bunk ${canBunk} more!` : `💀 Need ${mustAttend} more classes.`}\n\nCheck yours: ${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
      }} style={{ width: "100%", marginTop: 24, background: "#25D366", color: "white", border: "none", borderRadius: 12, padding: "14px 24px", cursor: "pointer", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <span style={{ fontSize: 20 }}>📲</span> Share on WhatsApp
      </button>
    </div>
  );
}

function SubjectMode() {
  const [subjects, setSubjects] = useState(() => {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem("tw_att_subjects")); } catch {}
    return saved || [
      { name: "Maths", total: 30, attended: 25 },
      { name: "Physics", total: 28, attended: 20 },
      { name: "Chemistry", total: 25, attended: 22 },
    ];
  });

  useEffect(() => { localStorage.setItem("tw_att_subjects", JSON.stringify(subjects)); }, [subjects]);

  const addSub = () => setSubjects([...subjects, { name: `Subject ${subjects.length + 1}`, total: 30, attended: 20 }]);
  const removeSub = (i) => setSubjects(subjects.filter((_, idx) => idx !== i));
  const update = (i, f, v) => { const n = [...subjects]; n[i][f] = v; setSubjects(n); };

  const totalAll = subjects.reduce((s, sub) => s + sub.total, 0);
  const attendedAll = subjects.reduce((s, sub) => s + sub.attended, 0);
  const overallPct = totalAll > 0 ? (attendedAll / totalAll) * 100 : 0;

  return (
    <div className="fade-in">
      <div style={cs}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: BRAND.text, margin: 0 }}>Subject Tracker <span style={{ fontSize: 13, color: BRAND.textSecondary }}>विषय-वार</span></h3>
          <button onClick={addSub} style={{ background: STUDENT_BRAND.accent, color: "white", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ Add</button>
        </div>
        {subjects.map((sub, i) => {
          const p = sub.total > 0 ? (sub.attended / sub.total) * 100 : 0;
          const mood = getMood(p);
          return (
            <div key={i} style={{ marginBottom: 16, padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.02)", border: `1px solid ${BRAND.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <input value={sub.name} onChange={e => update(i, "name", e.target.value)} style={{ padding: 6, borderRadius: 6, border: `1px solid ${BRAND.border}`, background: "transparent", color: BRAND.text, fontSize: 15, fontWeight: 700, flex: 1 }} />
                <span style={{ fontSize: 20, fontWeight: 900, color: mood.color, marginLeft: 12 }}>{p.toFixed(0)}%</span>
                {subjects.length > 1 && <button onClick={() => removeSub(i)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 16, marginLeft: 8 }}>✕</button>}
              </div>
              <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.05)", overflow: "hidden", marginBottom: 8 }}>
                <div style={{ height: "100%", width: `${Math.min(p, 100)}%`, background: mood.color, borderRadius: 4, transition: "width 0.5s" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                  <label style={{ fontSize: 11, color: BRAND.textSecondary }}>Total</label>
                  <input type="number" min="0" value={sub.total} onChange={e => update(i, "total", +e.target.value || 0)} style={{ width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: BRAND.text, fontSize: 14, textAlign: "center" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: BRAND.textSecondary }}>Present</label>
                  <input type="number" min="0" value={sub.attended} onChange={e => update(i, "attended", +e.target.value || 0)} style={{ width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: BRAND.text, fontSize: 14, textAlign: "center" }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ ...cs, marginTop: 24, textAlign: "center" }}>
        <CircularProgress pct={overallPct} size={160} />
        <div style={{ fontSize: 14, color: BRAND.textSecondary, marginTop: 8 }}>{attendedAll} / {totalAll} classes</div>
      </div>

      <button onClick={() => {
        const text = `📊 Subject Attendance\n${subjects.map(s => `${s.name}: ${s.total > 0 ? ((s.attended/s.total)*100).toFixed(0) : 0}%`).join("\n")}\nOverall: ${overallPct.toFixed(1)}%\n\nTrack yours: ${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
      }} style={{ width: "100%", marginTop: 24, background: "#25D366", color: "white", border: "none", borderRadius: 12, padding: "14px 24px", cursor: "pointer", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <span style={{ fontSize: 20 }}>📲</span> Share Subject Stats
      </button>
    </div>
  );
}
