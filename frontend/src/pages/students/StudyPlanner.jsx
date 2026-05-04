import { useState, useEffect } from "react";
import { BRAND, STUDENT_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };

export default function StudyPlanner() {
  const [exams, setExams] = useState(() => JSON.parse(localStorage.getItem("study_exams") || "[]"));
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("study_tasks") || "[]"));

  const [newExam, setNewExam] = useState({ name: "", date: "" });
  const [newTask, setNewTask] = useState("");

  useEffect(() => { localStorage.setItem("study_exams", JSON.stringify(exams)); }, [exams]);
  useEffect(() => { localStorage.setItem("study_tasks", JSON.stringify(tasks)); }, [tasks]);

  const addExam = () => {
    if (!newExam.name || !newExam.date) return;
    setExams(p => [...p, { ...newExam, id: Date.now() }].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setNewExam({ name: "", date: "" });
  };

  const removeExam = (id) => setExams(p => p.filter(e => e.id !== id));

  const addTask = () => {
    if (!newTask) return;
    setTasks(p => [...p, { text: newTask, done: false, id: Date.now() }]);
    setNewTask("");
  };

  const toggleTask = (id) => setTasks(p => p.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const removeTask = (id) => setTasks(p => p.filter(t => t.id !== id));

  const getDaysLeft = (date) => {
    const diff = new Date(date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        <div style={cs}>
          <h3 style={{ color: BRAND.text, marginBottom: 20 }}>Exam Countdown ⏱️</h3>
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            <input value={newExam.name} onChange={e => setNewExam({ ...newExam, name: e.target.value })} placeholder="Exam Name" style={{ flex: 1, padding: 10, borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 14 }} />
            <input type="date" value={newExam.date} onChange={e => setNewExam({ ...newExam, date: e.target.value })} style={{ width: 130, padding: 10, borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 14 }} />
            <button onClick={addExam} style={{ padding: "0 16px", borderRadius: 8, border: "none", background: STUDENT_BRAND.accent, color: "white", cursor: "pointer", fontWeight: 700 }}>Add</button>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {exams.map(e => {
              const days = getDaysLeft(e.date);
              const color = days <= 3 ? "#EF4444" : days <= 7 ? "#F59E0B" : "#4CAF50";
              return (
                <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.02)", border: `1px solid ${BRAND.border}` }}>
                  <div>
                    <div style={{ fontWeight: 600, color: BRAND.text }}>{e.name}</div>
                    <div style={{ fontSize: 12, color: BRAND.textSecondary }}>{new Date(e.date).toLocaleDateString()}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 20, fontWeight: 900, color }}>{days}</div>
                      <div style={{ fontSize: 10, color: BRAND.textSecondary, textTransform: "uppercase" }}>Days Left</div>
                    </div>
                    <button onClick={() => removeExam(e.id)} style={{ background: "none", border: "none", color: BRAND.textSecondary, cursor: "pointer", fontSize: 16 }}>✕</button>
                  </div>
                </div>
              );
            })}
            {exams.length === 0 && <div style={{ textAlign: "center", color: BRAND.textSecondary, fontSize: 13, padding: 20 }}>No exams added yet.</div>}
          </div>
        </div>

        <div style={cs}>
          <h3 style={{ color: BRAND.text, marginBottom: 20 }}>Study Checklist ✅</h3>
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} placeholder="Add a topic to study..." style={{ flex: 1, padding: 10, borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 14 }} />
            <button onClick={addTask} style={{ padding: "0 16px", borderRadius: 8, border: "none", background: STUDENT_BRAND.accent, color: "white", cursor: "pointer", fontWeight: 700 }}>Add</button>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {tasks.map(t => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, background: t.done ? "transparent" : "rgba(255,255,255,0.03)", border: `1px solid ${BRAND.border}`, opacity: t.done ? 0.5 : 1 }}>
                <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} style={{ width: 18, height: 18, cursor: "pointer" }} />
                <span style={{ flex: 1, fontSize: 14, color: BRAND.text, textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
                <button onClick={() => removeTask(t.id)} style={{ background: "none", border: "none", color: BRAND.textSecondary, cursor: "pointer", fontSize: 14 }}>✕</button>
              </div>
            ))}
            {tasks.length === 0 && <div style={{ textAlign: "center", color: BRAND.textSecondary, fontSize: 13, padding: 20 }}>Your study list is empty.</div>}
          </div>
        </div>
      </div>

      <div style={{ ...cs, marginTop: 24, textAlign: "center", background: "linear-gradient(90deg, rgba(124,58,237,0.1) 0%, rgba(239,68,68,0.1) 100%)" }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>💡</div>
        <p style={{ margin: 0, color: BRAND.text, fontWeight: 600 }}>"The best way to predict your future is to create it." — Abraham Lincoln</p>
      </div>
    </div>
  );
}
