import { useState, useEffect, useRef, useCallback } from "react";
import { BRAND, STUDENT_BRAND } from "../../shared/constants";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };

const MOTIVATIONAL_QUOTES = [
  "Focus on being productive instead of busy.",
  "The secret of getting ahead is getting started.",
  "Don't stop when you're tired. Stop when you're done.",
  "Small daily improvements are the key to staggering long-term results.",
  "Discipline is choosing between what you want now and what you want most."
];

const BREAK_QUOTES = [
  "Take a deep breath. You're doing great.",
  "Stretch, hydrate, and relax your eyes.",
  "A good break makes for better focus."
];

export default function PomodoroTimer() {
  const savedState = JSON.parse(localStorage.getItem("pomo_current_state") || "null");
  const now = Date.now();
  let initialSecondsLeft = 25 * 60;
  let initialIsRunning = false;
  
  if (savedState) {
    initialSecondsLeft = savedState.secondsLeft;
    initialIsRunning = savedState.isRunning;
    // If it was running, subtract the time elapsed while the page was closed
    if (initialIsRunning && savedState.lastUpdated) {
      const elapsedSeconds = Math.floor((now - savedState.lastUpdated) / 1000);
      initialSecondsLeft = Math.max(0, initialSecondsLeft - elapsedSeconds);
    }
  }

  const [focusMin, setFocusMin] = useState(savedState?.focusMin || 25);
  const [breakMin, setBreakMin] = useState(savedState?.breakMin || 5);
  const [longBreakMin, setLongBreakMin] = useState(savedState?.longBreakMin || 15);
  const [secondsLeft, setSecondsLeft] = useState(initialSecondsLeft);
  const [isRunning, setIsRunning] = useState(initialIsRunning);
  const [phase, setPhase] = useState(savedState?.phase || "focus"); // focus | break | longBreak
  const [sessionCount, setSessionCount] = useState(savedState?.sessionCount || 0);
  const [task, setTask] = useState(savedState?.task || "");
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pomo_history") || "[]"); } catch { return []; }
  });
  
  const [todayStats, setTodayStats] = useState(() => {
    const todayDate = new Date().toDateString();
    try {
      const h = JSON.parse(localStorage.getItem("pomo_history") || "[]");
      const today = h.find(d => d.date === todayDate);
      return today || { date: todayDate, pomos: 0, minutes: 0 };
    } catch { return { date: todayDate, pomos: 0, minutes: 0 }; }
  });
  const [showLofi, setShowLofi] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  useEffect(() => {
    const quotes = phase === "focus" ? MOTIVATIONAL_QUOTES : BREAK_QUOTES;
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [phase, isRunning]);

  // Persist current timer state
  useEffect(() => {
    const stateToSave = { focusMin, breakMin, longBreakMin, secondsLeft, isRunning, phase, sessionCount, task, lastUpdated: Date.now() };
    localStorage.setItem("pomo_current_state", JSON.stringify(stateToSave));
  }, [focusMin, breakMin, longBreakMin, secondsLeft, isRunning, phase, sessionCount, task]);

  const intervalRef = useRef(null);
  const audioCtxRef = useRef(null);

  const totalSeconds = phase === "focus" ? focusMin * 60 : phase === "break" ? breakMin * 60 : longBreakMin * 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const playBeep = useCallback(() => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = "sine";
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2); gain2.connect(ctx.destination);
        osc2.frequency.value = 1000; osc2.type = "sine"; gain2.gain.value = 0.3;
        osc2.start(); osc2.stop(ctx.currentTime + 0.5);
      }, 400);
    } catch (e) { /* audio not supported */ }
  }, []);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    } else if (secondsLeft === 0 && isRunning) {
      playBeep();
      setIsRunning(false);
      if (phase === "focus") {
        const newCount = sessionCount + 1;
        setSessionCount(newCount);
        
        const todayDate = new Date().toDateString();
        const newStats = { ...todayStats, pomos: todayStats.pomos + 1, minutes: todayStats.minutes + focusMin };
        setTodayStats(newStats);
        
        setHistory(prev => {
          const filtered = prev.filter(d => d.date !== todayDate);
          const newHistory = [...filtered, newStats].slice(-7); // Keep last 7 active days
          localStorage.setItem("pomo_history", JSON.stringify(newHistory));
          return newHistory;
        });

        if (newCount % 4 === 0) { setPhase("longBreak"); setSecondsLeft(longBreakMin * 60); }
        else { setPhase("break"); setSecondsLeft(breakMin * 60); }
      } else {
        setPhase("focus");
        setSecondsLeft(focusMin * 60);
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, secondsLeft, phase, sessionCount, focusMin, breakMin, longBreakMin, playBeep, todayStats]);

  const reset = () => { setIsRunning(false); setPhase("focus"); setSecondsLeft(focusMin * 60); setSessionCount(0); };

  const phaseColors = { focus: "#EF4444", break: "#4CAF50", longBreak: "#3B82F6" };
  const phaseLabels = { focus: "Focus Time 🎯", break: "Short Break ☕", longBreak: "Long Break 🌿" };
  const currentColor = phaseColors[phase];

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const chartData = {
    labels: history.length > 0 ? history.map(d => { const dt = new Date(d.date); return `${dt.getDate()}/${dt.getMonth()+1}`; }) : [new Date().getDate() + "/" + (new Date().getMonth()+1)],
    datasets: [{
      label: 'Focus Minutes',
      data: history.length > 0 ? history.map(d => d.minutes) : [todayStats.minutes],
      backgroundColor: STUDENT_BRAND.accent,
      borderRadius: 6,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" } }, x: { grid: { display: false } } }
  };

  return (
    <div>
      <div style={{ ...cs, textAlign: "center", marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <input value={task} onChange={e => setTask(e.target.value)} placeholder="What are you studying? / क्या पढ़ रहे हो?" style={{ width: "100%", maxWidth: 400, padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 15, textAlign: "center" }} />
        </div>

        <div style={{ fontSize: 16, fontWeight: 700, color: currentColor, marginBottom: 24 }}>{phaseLabels[phase]}</div>

        <div style={{ position: "relative", width: 280, height: 280, margin: "0 auto 32px" }}>
          <svg width="280" height="280" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="140" cy="140" r="120" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle cx="140" cy="140" r="120" fill="none" stroke={currentColor} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} style={{ transition: "stroke-dashoffset 1s linear" }} />
          </svg>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
            <div style={{ fontSize: 64, fontWeight: 900, color: BRAND.text, fontFamily: "monospace", letterSpacing: 4 }}>
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
            {task && <div style={{ fontSize: 13, color: BRAND.textSecondary, marginTop: 8, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task}</div>}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          <button onClick={() => setIsRunning(!isRunning)} style={{ padding: "14px 40px", borderRadius: 14, border: "none", cursor: "pointer", fontSize: 18, fontWeight: 800, background: isRunning ? "rgba(255,255,255,0.1)" : currentColor, color: "white", minWidth: 140 }}>
            {isRunning ? "⏸ Pause" : "▶ Start"}
          </button>
          <button onClick={reset} style={{ padding: "14px 24px", borderRadius: 14, border: `1px solid ${BRAND.border}`, cursor: "pointer", fontSize: 16, background: "none", color: BRAND.textSecondary }}>↻ Reset</button>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} style={{ width: 12, height: 12, borderRadius: "50%", background: sessionCount % 4 >= n ? currentColor : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />
          ))}
          <span style={{ fontSize: 12, color: BRAND.textSecondary, marginLeft: 8 }}>Session {sessionCount + 1}</span>
        </div>
        
        <div style={{ marginTop: 24, fontStyle: "italic", color: BRAND.textSecondary, fontSize: 14 }}>
          "{currentQuote}"
        </div>
      </div>

      <div style={{ ...cs, marginBottom: 24, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: BRAND.text }}>🎧 Lofi Study Beats</div>
          <div style={{ fontSize: 12, color: BRAND.textSecondary }}>Play background music to boost focus</div>
        </div>
        <button onClick={() => setShowLofi(!showLofi)} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${BRAND.primary}40`, background: showLofi ? BRAND.primary : "transparent", color: showLofi ? "white" : BRAND.primary, cursor: "pointer", fontWeight: 600 }}>
          {showLofi ? "Close Player" : "Open Player"}
        </button>
      </div>

      {showLofi && (
        <div style={{ marginBottom: 24, borderRadius: 16, overflow: "hidden", border: `1px solid ${BRAND.border}` }}>
          <iframe 
            width="100%" 
            height="160" 
            src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1" 
            title="Lofi Girl Radio" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen>
          </iframe>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={{ ...cs, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: BRAND.textSecondary, marginBottom: 4 }}>🍅 Today's Pomodoros</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: STUDENT_BRAND.accent }}>{todayStats.pomos}</div>
        </div>
        <div style={{ ...cs, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: BRAND.textSecondary, marginBottom: 4 }}>⏱️ Focus Time Today</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: STUDENT_BRAND.accent }}>{todayStats.minutes}m</div>
        </div>
      </div>

      <div style={{ ...cs, marginBottom: 24 }}>
        <h4 style={{ color: BRAND.text, margin: "0 0 16px" }}>📈 Your Focus History (Last 7 Days)</h4>
        <div style={{ height: 200, width: "100%" }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      <div style={cs}>
        <h4 style={{ color: BRAND.text, margin: "0 0 16px" }}>⚙️ Settings</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div><label style={{ fontSize: 12, color: BRAND.textSecondary }}>Focus (min)</label><input type="number" min="1" max="90" value={focusMin} onChange={e => { setFocusMin(+e.target.value || 25); if (!isRunning && phase === "focus") setSecondsLeft((+e.target.value || 25) * 60); }} style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 16, textAlign: "center" }} /></div>
          <div><label style={{ fontSize: 12, color: BRAND.textSecondary }}>Break (min)</label><input type="number" min="1" max="30" value={breakMin} onChange={e => { setBreakMin(+e.target.value || 5); if (!isRunning && phase === "break") setSecondsLeft((+e.target.value || 5) * 60); }} style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 16, textAlign: "center" }} /></div>
          <div><label style={{ fontSize: 12, color: BRAND.textSecondary }}>Long Break</label><input type="number" min="1" max="60" value={longBreakMin} onChange={e => { setLongBreakMin(+e.target.value || 15); if (!isRunning && phase === "longBreak") setSecondsLeft((+e.target.value || 15) * 60); }} style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 16, textAlign: "center" }} /></div>
        </div>
      </div>

      {/* SEO & AdSense Content Block */}
      <div style={{ marginTop: 40, padding: 24, background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, color: BRAND.textSecondary, lineHeight: 1.8 }}>
        <h2 style={{ color: BRAND.text, fontSize: 24, marginBottom: 16 }}>What is the Pomodoro Technique?</h2>
        <p style={{ marginBottom: 16 }}>
          The Pomodoro Technique is a highly effective time management method developed by Francesco Cirillo in the late 1980s. The technique uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks. Each interval is known as a <em>pomodoro</em>, from the Italian word for 'tomato', after the tomato-shaped kitchen timer that Cirillo used as a university student.
        </p>
        
        <h3 style={{ color: BRAND.text, fontSize: 20, marginTop: 24, marginBottom: 12 }}>How to use this Pomodoro Timer</h3>
        <ol style={{ marginBottom: 16, paddingLeft: 20 }}>
          <li style={{ marginBottom: 8 }}><strong>Decide on the task:</strong> Enter your current study topic or work task in the text box.</li>
          <li style={{ marginBottom: 8 }}><strong>Start the Timer:</strong> Click start to begin your 25-minute focus session. Do not switch tabs or check your phone.</li>
          <li style={{ marginBottom: 8 }}><strong>Take a Short Break:</strong> When the timer rings, take a 5-minute break. Stand up, stretch, and grab a glass of water.</li>
          <li style={{ marginBottom: 8 }}><strong>Take a Long Break:</strong> After completing four consecutive pomodoros, the timer will automatically trigger a 15-minute long break to let your brain rest and consolidate information.</li>
        </ol>

        <h3 style={{ color: BRAND.text, fontSize: 20, marginTop: 24, marginBottom: 12 }}>Why does Pomodoro work for students?</h3>
        <p style={{ marginBottom: 16 }}>
          Human attention spans are naturally limited. Attempting to study for 4 hours straight usually results in diminishing returns, brain fog, and burnout. The Pomodoro method forces you to take breaks <em>before</em> you get tired, ensuring that your focus remains at peak levels. It also creates a sense of urgency—knowing you only have 25 minutes makes you less likely to procrastinate on Instagram or Reddit.
        </p>

        <h3 style={{ color: BRAND.text, fontSize: 20, marginTop: 24, marginBottom: 12 }}>Frequently Asked Questions (FAQs)</h3>
        <div style={{ marginBottom: 16 }}>
          <strong style={{ color: BRAND.text }}>Q: Can I change the 25-minute timer?</strong>
          <p>A: Yes! Use the Settings section below the chart to customize your Focus, Short Break, and Long Break durations. Some students prefer the "50/10" method (50 minutes focus, 10 minutes break) for deeper subjects like Mathematics or Coding.</p>
          
          <strong style={{ color: BRAND.text }}>Q: Does the timer run in the background?</strong>
          <p>A: Yes, our tool uses a timestamp-based system. If you accidentally close the tab or switch to another app, the timer will calculate the missed seconds and update automatically when you return.</p>

          <strong style={{ color: BRAND.text }}>Q: Why Lofi Music?</strong>
          <p>A: Lofi (Low Fidelity) hip-hop beats lack sudden tempo changes and distracting lyrics. Research shows that listening to ambient or lofi music masks background noise and stimulates the brain's focus centers without demanding active attention.</p>
        </div>
      </div>
    </div>
  );
}
