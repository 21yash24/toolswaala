import { useState, useEffect, useMemo } from "react";
import { BRAND, STUDENT_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };
const tabBtn = (active) => ({ padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, background: active ? STUDENT_BRAND.accent : "rgba(255,255,255,0.05)", color: active ? "white" : BRAND.textSecondary, transition: "0.2s" });
const inputStyle = { padding: 10, borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 14 };

const PRIORITIES = [
  { label: "🔴 High", value: "high", color: "#EF4444" },
  { label: "🟡 Medium", value: "medium", color: "#F59E0B" },
  { label: "🟢 Low", value: "low", color: "#10B981" },
];

const MOTIVATIONAL = [
  "The secret of getting ahead is getting started.",
  "It always seems impossible until it's done.",
  "Don't watch the clock; do what it does. Keep going.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Believe you can and you're halfway there.",
  "A little progress each day adds up to big results.",
];

export default function StudyPlanner() {
  const [tab, setTab] = useState("planner");

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
        <button style={tabBtn(tab === "planner")} onClick={() => setTab("planner")}>📅 Planner</button>
        <button style={tabBtn(tab === "exams")} onClick={() => setTab("exams")}>⏱️ Exam Countdown</button>
        <button style={tabBtn(tab === "timetable")} onClick={() => setTab("timetable")}>📋 Timetable</button>
        <button style={tabBtn(tab === "stats")} onClick={() => setTab("stats")}>📊 Stats</button>
      </div>
      {tab === "planner" && <PlannerTab />}
      {tab === "exams" && <ExamTab />}
      {tab === "timetable" && <TimetableTab />}
      {tab === "stats" && <StatsTab />}

      <div style={{ marginTop: 40, padding: 24, background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, color: BRAND.textSecondary, lineHeight: 1.8 }}>
        <h2 style={{ color: BRAND.text, fontSize: 22, marginBottom: 12 }}>How to Use This Study Planner Effectively</h2>
        <p>Organize your study sessions by creating daily tasks with priorities. Use the Exam Countdown to never miss a deadline, and the Weekly Timetable to build a consistent routine. The Stats tab shows your productivity over time so you can identify patterns and improve your study habits. All data is auto-saved in your browser—no login required.</p>
      </div>
    </div>
  );
}

function PlannerTab() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sp_tasks") || "[]"); } catch { return []; }
  });
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newSubject, setNewSubject] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => { localStorage.setItem("sp_tasks", JSON.stringify(tasks)); }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(p => [...p, { id: Date.now(), text: newTask.trim(), subject: newSubject.trim(), priority: newPriority, done: false, createdAt: new Date().toISOString() }]);
    setNewTask(""); setNewSubject("");
  };

  const toggleTask = (id) => setTasks(p => p.map(t => t.id === id ? { ...t, done: !t.done, completedAt: !t.done ? new Date().toISOString() : null } : t));
  const removeTask = (id) => setTasks(p => p.filter(t => t.id !== id));
  const clearDone = () => setTasks(p => p.filter(t => !t.done));

  const filtered = filter === "all" ? tasks : filter === "done" ? tasks.filter(t => t.done) : tasks.filter(t => !t.done && t.priority === filter);
  const doneCount = tasks.filter(t => t.done).length;
  const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  const quote = useMemo(() => MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)], []);

  return (
    <div className="fade-in">
      <div style={{ ...cs, background: `linear-gradient(135deg, ${STUDENT_BRAND.accent}15, ${STUDENT_BRAND.accent}05)`, border: `1px solid ${STUDENT_BRAND.accent}30`, marginBottom: 24, textAlign: "center", padding: 20 }}>
        <div style={{ fontSize: 14, fontStyle: "italic", color: BRAND.textSecondary }}>💡 "{quote}"</div>
      </div>

      {tasks.length > 0 && (
        <div style={{ ...cs, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: BRAND.textSecondary }}>{doneCount}/{tasks.length} completed</span>
            <span style={{ fontSize: 20, fontWeight: 900, color: STUDENT_BRAND.accent }}>{progress}%</span>
          </div>
          <div style={{ height: 10, borderRadius: 5, background: "rgba(0,0,0,0.05)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${STUDENT_BRAND.accent}, #EC4899)`, borderRadius: 5, transition: "width 0.5s ease" }} />
          </div>
        </div>
      )}

      <div style={cs}>
        <h3 style={{ color: BRAND.text, marginBottom: 16 }}>Add Study Task</h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} placeholder="e.g. Revise Chapter 5 Thermodynamics" style={{ ...inputStyle, flex: 2, minWidth: 200 }} />
          <input value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Subject" style={{ ...inputStyle, flex: 1, minWidth: 100 }} />
          <select value={newPriority} onChange={e => setNewPriority(e.target.value)} style={{ ...inputStyle, minWidth: 120 }}>
            {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <button onClick={addTask} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: STUDENT_BRAND.accent, color: "white", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>+ Add</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 20, marginBottom: 16, flexWrap: "wrap" }}>
        {[{ label: "All", value: "all" }, { label: "Pending", value: "pending" }, { label: "Done", value: "done" }, ...PRIORITIES.map(p => ({ label: p.label, value: p.value }))].map(f => (
          <button key={f.value} onClick={() => setFilter(f.value === filter ? "all" : f.value)} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${filter === f.value ? STUDENT_BRAND.accent : BRAND.border}`, background: filter === f.value ? `${STUDENT_BRAND.accent}20` : "transparent", color: filter === f.value ? STUDENT_BRAND.accent : BRAND.textSecondary, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{f.label}</button>
        ))}
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {filtered.map(t => {
          const pr = PRIORITIES.find(p => p.value === t.priority);
          return (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 12, background: t.done ? "transparent" : "rgba(255,255,255,0.03)", border: `1px solid ${BRAND.border}`, borderLeft: `4px solid ${pr?.color || BRAND.border}`, opacity: t.done ? 0.5 : 1, transition: "all 0.2s" }}>
              <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} style={{ width: 20, height: 20, cursor: "pointer", accentColor: STUDENT_BRAND.accent }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: BRAND.text, textDecoration: t.done ? "line-through" : "none", fontWeight: 500 }}>{t.text}</div>
                {t.subject && <span style={{ fontSize: 11, color: STUDENT_BRAND.accent, background: `${STUDENT_BRAND.accent}15`, padding: "2px 8px", borderRadius: 4, marginTop: 4, display: "inline-block" }}>{t.subject}</span>}
              </div>
              <button onClick={() => removeTask(t.id)} style={{ background: "none", border: "none", color: BRAND.textSecondary, cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
          );
        })}
        {filtered.length === 0 && <div style={{ textAlign: "center", color: BRAND.textSecondary, padding: 40, fontSize: 14 }}>{filter === "all" ? "No tasks yet. Start adding!" : "No tasks match this filter."}</div>}
      </div>

      {doneCount > 0 && (
        <button onClick={clearDone} style={{ marginTop: 16, padding: "10px 20px", borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "transparent", color: BRAND.textSecondary, cursor: "pointer", fontSize: 13 }}>🗑️ Clear {doneCount} completed tasks</button>
      )}
    </div>
  );
}

function ExamTab() {
  const [exams, setExams] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sp_exams") || "[]"); } catch { return []; }
  });
  const [newExam, setNewExam] = useState({ name: "", date: "", subject: "" });

  useEffect(() => { localStorage.setItem("sp_exams", JSON.stringify(exams)); }, [exams]);

  const addExam = () => {
    if (!newExam.name || !newExam.date) return;
    setExams(p => [...p, { ...newExam, id: Date.now() }].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setNewExam({ name: "", date: "", subject: "" });
  };

  const removeExam = (id) => setExams(p => p.filter(e => e.id !== id));

  const getDaysLeft = (date) => {
    const diff = new Date(date).setHours(0,0,0,0) - new Date().setHours(0,0,0,0);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getUrgencyColor = (days) => days <= 0 ? "#DC2626" : days <= 3 ? "#EF4444" : days <= 7 ? "#F59E0B" : days <= 14 ? "#3B82F6" : "#10B981";
  const getUrgencyLabel = (days) => days <= 0 ? "TODAY / PAST" : days === 1 ? "TOMORROW!" : days <= 3 ? "URGENT" : days <= 7 ? "THIS WEEK" : `${days} DAYS`;

  return (
    <div className="fade-in">
      <div style={cs}>
        <h3 style={{ color: BRAND.text, marginBottom: 16 }}>Add Exam / Deadline</h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input value={newExam.name} onChange={e => setNewExam({ ...newExam, name: e.target.value })} placeholder="Exam Name" style={{ ...inputStyle, flex: 2, minWidth: 160 }} />
          <input value={newExam.subject} onChange={e => setNewExam({ ...newExam, subject: e.target.value })} placeholder="Subject" style={{ ...inputStyle, flex: 1, minWidth: 100 }} />
          <input type="date" value={newExam.date} onChange={e => setNewExam({ ...newExam, date: e.target.value })} style={{ ...inputStyle, minWidth: 140 }} />
          <button onClick={addExam} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: STUDENT_BRAND.accent, color: "white", cursor: "pointer", fontWeight: 700 }}>Add</button>
        </div>
      </div>

      <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
        {exams.map(e => {
          const days = getDaysLeft(e.date);
          const color = getUrgencyColor(days);
          const pctLeft = Math.max(0, Math.min(100, (days / 30) * 100));
          return (
            <div key={e.id} style={{ ...cs, display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `4px solid ${color}`, padding: "16px 20px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: BRAND.text, fontSize: 16 }}>{e.name}</div>
                <div style={{ display: "flex", gap: 12, marginTop: 4, alignItems: "center" }}>
                  {e.subject && <span style={{ fontSize: 12, color: STUDENT_BRAND.accent, background: `${STUDENT_BRAND.accent}15`, padding: "2px 8px", borderRadius: 4 }}>{e.subject}</span>}
                  <span style={{ fontSize: 12, color: BRAND.textSecondary }}>{new Date(e.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: "rgba(0,0,0,0.05)", marginTop: 10, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pctLeft}%`, background: color, borderRadius: 2, transition: "width 0.5s" }} />
                </div>
              </div>
              <div style={{ textAlign: "center", marginLeft: 20 }}>
                <div style={{ fontSize: 32, fontWeight: 900, color, lineHeight: 1 }}>{Math.max(0, days)}</div>
                <div style={{ fontSize: 10, color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{getUrgencyLabel(days)}</div>
              </div>
              <button onClick={() => removeExam(e.id)} style={{ background: "none", border: "none", color: BRAND.textSecondary, cursor: "pointer", fontSize: 16, marginLeft: 12 }}>✕</button>
            </div>
          );
        })}
        {exams.length === 0 && <div style={{ textAlign: "center", color: BRAND.textSecondary, padding: 40 }}>No exams added. Add your upcoming exams to start the countdown! ⏱️</div>}
      </div>
    </div>
  );
}

function TimetableTab() {
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const SLOTS = ["8-9 AM", "9-10 AM", "10-11 AM", "11-12 PM", "12-1 PM", "2-3 PM", "3-4 PM", "4-5 PM"];

  const [timetable, setTimetable] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sp_timetable") || "{}"); } catch { return {}; }
  });
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState("");

  useEffect(() => { localStorage.setItem("sp_timetable", JSON.stringify(timetable)); }, [timetable]);

  const getKey = (day, slot) => `${day}_${slot}`;
  const setCell = (day, slot, val) => {
    setTimetable(p => ({ ...p, [getKey(day, slot)]: val }));
    setEditing(null);
  };

  const COLORS = ["#7C3AED", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#EF4444", "#06B6D4", "#8B5CF6"];
  const subjectColors = useMemo(() => {
    const map = {};
    let ci = 0;
    Object.values(timetable).forEach(v => {
      if (v && !map[v.toLowerCase()]) { map[v.toLowerCase()] = COLORS[ci % COLORS.length]; ci++; }
    });
    return map;
  }, [timetable]);

  return (
    <div className="fade-in">
      <div style={{ ...cs, overflowX: "auto" }}>
        <h3 style={{ color: BRAND.text, marginBottom: 16 }}>Weekly Timetable</h3>
        <p style={{ fontSize: 13, color: BRAND.textSecondary, marginBottom: 16 }}>Click any cell to add a subject. Your timetable is saved automatically.</p>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
          <thead>
            <tr>
              <th style={{ padding: 10, fontSize: 12, color: BRAND.textSecondary, textAlign: "left", borderBottom: `1px solid ${BRAND.border}` }}>Time</th>
              {DAYS.map(d => <th key={d} style={{ padding: 10, fontSize: 12, color: BRAND.textSecondary, textAlign: "center", borderBottom: `1px solid ${BRAND.border}` }}>{d.slice(0, 3)}</th>)}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map(slot => (
              <tr key={slot}>
                <td style={{ padding: 8, fontSize: 12, color: BRAND.textSecondary, whiteSpace: "nowrap" }}>{slot}</td>
                {DAYS.map(day => {
                  const key = getKey(day, slot);
                  const val = timetable[key] || "";
                  const isEditing = editing === key;
                  const bg = val ? (subjectColors[val.toLowerCase()] || STUDENT_BRAND.accent) : "transparent";
                  return (
                    <td key={day} style={{ padding: 4, textAlign: "center" }}>
                      {isEditing ? (
                        <input autoFocus value={editVal} onChange={e => setEditVal(e.target.value)} onBlur={() => setCell(day, slot, editVal)} onKeyDown={e => e.key === "Enter" && setCell(day, slot, editVal)} style={{ ...inputStyle, width: "100%", textAlign: "center", fontSize: 11, padding: 6 }} />
                      ) : (
                        <div onClick={() => { setEditing(key); setEditVal(val); }} style={{ padding: "8px 4px", borderRadius: 6, background: val ? `${bg}20` : "rgba(0,0,0,0.02)", color: val ? bg : BRAND.textSecondary, cursor: "pointer", fontSize: 11, fontWeight: val ? 700 : 400, minHeight: 32, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${val ? `${bg}30` : "transparent"}`, transition: "all 0.2s" }}>
                          {val || "—"}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatsTab() {
  const tasks = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("sp_tasks") || "[]"); } catch { return []; }
  }, []);

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.done).length;
  const highDone = tasks.filter(t => t.done && t.priority === "high").length;
  const highTotal = tasks.filter(t => t.priority === "high").length;

  const subjectBreakdown = useMemo(() => {
    const map = {};
    tasks.forEach(t => {
      const s = t.subject || "Untagged";
      if (!map[s]) map[s] = { total: 0, done: 0 };
      map[s].total++;
      if (t.done) map[s].done++;
    });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, [tasks]);

  const streakDays = useMemo(() => {
    const completedDates = new Set(tasks.filter(t => t.done && t.completedAt).map(t => new Date(t.completedAt).toDateString()));
    let streak = 0;
    const d = new Date();
    for (let i = 0; i < 365; i++) {
      if (completedDates.has(d.toDateString())) { streak++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return streak;
  }, [tasks]);

  return (
    <div className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Tasks", value: totalTasks, color: STUDENT_BRAND.accent, icon: "📋" },
          { label: "Completed", value: doneTasks, color: "#10B981", icon: "✅" },
          { label: "Completion %", value: totalTasks > 0 ? `${Math.round((doneTasks / totalTasks) * 100)}%` : "0%", color: "#3B82F6", icon: "📊" },
          { label: "Study Streak", value: `${streakDays}d`, color: "#EF4444", icon: "🔥" },
        ].map((s, i) => (
          <div key={i} style={{ ...cs, textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: BRAND.textSecondary, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {highTotal > 0 && (
        <div style={{ ...cs, marginBottom: 24 }}>
          <h4 style={{ color: BRAND.text, marginBottom: 12 }}>🔴 High Priority Progress</h4>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 12, borderRadius: 6, background: "rgba(0,0,0,0.05)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${highTotal > 0 ? (highDone / highTotal) * 100 : 0}%`, background: "#EF4444", borderRadius: 6 }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#EF4444" }}>{highDone}/{highTotal}</span>
          </div>
        </div>
      )}

      {subjectBreakdown.length > 0 && (
        <div style={cs}>
          <h4 style={{ color: BRAND.text, marginBottom: 16 }}>📚 Subject Breakdown</h4>
          {subjectBreakdown.map(([subject, data]) => {
            const pct = data.total > 0 ? Math.round((data.done / data.total) * 100) : 0;
            return (
              <div key={subject} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: BRAND.text, fontWeight: 600 }}>{subject}</span>
                  <span style={{ color: BRAND.textSecondary }}>{data.done}/{data.total} ({pct}%)</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "rgba(0,0,0,0.05)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: STUDENT_BRAND.accent, borderRadius: 4, transition: "width 0.5s" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalTasks === 0 && <div style={{ textAlign: "center", color: BRAND.textSecondary, padding: 40 }}>Add some tasks in the Planner tab to see your stats here! 📊</div>}
    </div>
  );
}
