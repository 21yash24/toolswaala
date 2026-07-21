import { useState, useMemo } from "react";
import { BRAND, STUDENT_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };

export function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
    const readingTime = Math.ceil(words / 200);
    const speakingTime = Math.ceil(words / 130);

    // Keyword density
    const wordList = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(w => w.length > 3);
    const freq = {};
    wordList.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
    const topWords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8);

    // Readability (Flesch-Kincaid approximation)
    const syllables = text.toLowerCase().replace(/[^a-z]/g, " ").split(/\s+/).reduce((sum, w) => {
      let s = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").match(/[aeiouy]{1,2}/g);
      return sum + (s ? s.length : 1);
    }, 0);
    const fk = words > 0 && sentences > 0 ? 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words) : 0;
    const readability = fk > 80 ? "Very Easy" : fk > 60 ? "Easy" : fk > 40 ? "Moderate" : fk > 20 ? "Difficult" : "Very Hard";
    const readabilityColor = fk > 60 ? "#10B981" : fk > 40 ? "#F59E0B" : "#EF4444";

    return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime, speakingTime, topWords, readability, readabilityColor, fkScore: Math.round(fk) };
  }, [text]);

  const limits = [
    { label: "Twitter/X", max: 280, field: "chars" },
    { label: "Instagram Caption", max: 2200, field: "chars" },
    { label: "College Essay (250w)", max: 250, field: "words" },
    { label: "SOP (1000w)", max: 1000, field: "words" },
  ];

  return (
    <div>
      <div style={{ ...cs, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ color: BRAND.text, margin: 0 }}>Text Analyzer</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => navigator.clipboard.readText().then(t => setText(t)).catch(() => {})} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${BRAND.border}`, background: "transparent", color: BRAND.textSecondary, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>📋 Paste</button>
            <button onClick={() => setText("")} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "rgba(239,68,68,0.1)", color: "#EF4444", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Clear</button>
          </div>
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Type or paste your essay, SOP, assignment, or any text here..." style={{ width: "100%", height: 220, padding: 16, borderRadius: 12, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 15, resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.6 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Words", value: stats.words, color: STUDENT_BRAND.accent, icon: "📝" },
          { label: "Characters", value: stats.chars, color: "#F43F5E", icon: "🔤" },
          { label: "No Spaces", value: stats.charsNoSpaces, color: "#10B981", icon: "📏" },
          { label: "Sentences", value: stats.sentences, color: "#3B82F6", icon: "💬" },
          { label: "Paragraphs", value: stats.paragraphs, color: "#F59E0B", icon: "📄" },
          { label: "Reading", value: `${stats.readingTime}m`, color: "#8B5CF6", icon: "⏱️" },
          { label: "Speaking", value: `${stats.speakingTime}m`, color: "#06B6D4", icon: "🎤" },
        ].map((s, i) => (
          <div key={i} style={{ ...cs, textAlign: "center", padding: 16 }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: BRAND.textSecondary, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {text.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16, marginBottom: 24 }}>
          <div style={cs}>
            <h4 style={{ color: BRAND.text, marginBottom: 12 }}>📊 Readability Score</h4>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: stats.readabilityColor }}>{stats.fkScore}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: stats.readabilityColor }}>{stats.readability}</div>
                <div style={{ fontSize: 12, color: BRAND.textSecondary }}>Flesch-Kincaid Score</div>
              </div>
            </div>
          </div>

          <div style={cs}>
            <h4 style={{ color: BRAND.text, marginBottom: 12 }}>🔑 Top Keywords</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {stats.topWords.map(([word, count]) => (
                <span key={word} style={{ padding: "4px 10px", borderRadius: 6, background: `${STUDENT_BRAND.accent}15`, color: STUDENT_BRAND.accent, fontSize: 12, fontWeight: 600 }}>{word} ({count})</span>
              ))}
              {stats.topWords.length === 0 && <span style={{ color: BRAND.textSecondary, fontSize: 13 }}>Type more text to see keywords</span>}
            </div>
          </div>
        </div>
      )}

      <div style={cs}>
        <h4 style={{ color: BRAND.text, marginBottom: 12 }}>📐 Character Limits</h4>
        {limits.map(l => {
          const current = l.field === "chars" ? stats.chars : stats.words;
          const pct = Math.min(100, (current / l.max) * 100);
          const over = current > l.max;
          return (
            <div key={l.label} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span style={{ color: BRAND.text }}>{l.label}</span>
                <span style={{ color: over ? "#EF4444" : BRAND.textSecondary, fontWeight: over ? 700 : 400 }}>{current}/{l.max} {l.field === "chars" ? "chars" : "words"} {over ? "⚠️ OVER" : ""}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: "rgba(0,0,0,0.05)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: over ? "#EF4444" : pct > 80 ? "#F59E0B" : "#10B981", borderRadius: 3, transition: "width 0.3s" }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 32, padding: 24, background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, color: BRAND.textSecondary, lineHeight: 1.8 }}>
        <h2 style={{ color: BRAND.text, fontSize: 22, marginBottom: 12 }}>Free Online Word Counter for Students</h2>
        <p>Whether you're writing a college essay with a strict 250-word limit, drafting a Statement of Purpose for MS applications, or composing the perfect Instagram caption, this free tool gives you instant feedback. It counts words, characters, sentences, paragraphs, and even estimates reading and speaking time. The Readability Score helps you ensure your writing is clear enough for your audience, and the Keyword Density tracker is useful for SEO-focused writing.</p>
      </div>
    </div>
  );
}

export function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [age, setAge] = useState(null);

  const ZODIAC = [
    { sign: "Capricorn", symbol: "♑", start: [1, 1], end: [1, 19] }, { sign: "Aquarius", symbol: "♒", start: [1, 20], end: [2, 18] },
    { sign: "Pisces", symbol: "♓", start: [2, 19], end: [3, 20] }, { sign: "Aries", symbol: "♈", start: [3, 21], end: [4, 19] },
    { sign: "Taurus", symbol: "♉", start: [4, 20], end: [5, 20] }, { sign: "Gemini", symbol: "♊", start: [5, 21], end: [6, 20] },
    { sign: "Cancer", symbol: "♋", start: [6, 21], end: [7, 22] }, { sign: "Leo", symbol: "♌", start: [7, 23], end: [8, 22] },
    { sign: "Virgo", symbol: "♍", start: [8, 23], end: [9, 22] }, { sign: "Libra", symbol: "♎", start: [9, 23], end: [10, 22] },
    { sign: "Scorpio", symbol: "♏", start: [10, 23], end: [11, 21] }, { sign: "Sagittarius", symbol: "♐", start: [11, 22], end: [12, 21] },
    { sign: "Capricorn", symbol: "♑", start: [12, 22], end: [12, 31] },
  ];

  const calculateAge = () => {
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    if (days < 0) { months--; days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }

    const totalDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;

    // Next birthday
    const nextBday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBday <= today) nextBday.setFullYear(nextBday.getFullYear() + 1);
    const daysToNextBday = Math.ceil((nextBday - today) / (1000 * 60 * 60 * 24));

    // Zodiac
    const m = birthDate.getMonth() + 1;
    const d = birthDate.getDate();
    const zodiac = ZODIAC.find(z => (m === z.start[0] && d >= z.start[1]) || (m === z.end[0] && d <= z.end[1])) || ZODIAC[0];

    // Day of birth
    const dayOfBirth = birthDate.toLocaleDateString("en-IN", { weekday: "long" });

    // Generation
    const birthYear = birthDate.getFullYear();
    const generation = birthYear >= 2013 ? "Gen Alpha" : birthYear >= 1997 ? "Gen Z" : birthYear >= 1981 ? "Millennial" : birthYear >= 1965 ? "Gen X" : "Boomer";

    setAge({ years, months, days, totalDays, totalWeeks, totalHours, daysToNextBday, zodiac, dayOfBirth, generation });
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
        <div style={cs}>
          <h3 style={{ color: BRAND.text, marginBottom: 20 }}>Enter Date of Birth / जन्मतिथि</h3>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Date of Birth</label>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} max={new Date().toISOString().split("T")[0]} style={{ width: "100%", padding: 14, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 16 }} />
          </div>
          <button onClick={calculateAge} style={{ width: "100%", padding: "14px 24px", borderRadius: 12, border: "none", background: STUDENT_BRAND.accent, color: "white", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>Calculate My Age</button>
        </div>

        <div style={{ ...cs, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          {age ? (
            <>
              <div style={{ fontSize: 14, color: BRAND.textSecondary, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Your Exact Age</div>
              <div style={{ fontSize: 64, fontWeight: 900, color: STUDENT_BRAND.accent, lineHeight: 1 }}>{age.years}</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: BRAND.text, marginBottom: 16 }}>Years, {age.months} Months, {age.days} Days</div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
                <div style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(124,58,237,0.1)" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: STUDENT_BRAND.accent }}>{age.totalDays.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: BRAND.textSecondary }}>TOTAL DAYS</div>
                </div>
                <div style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(16,185,129,0.1)" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#10B981" }}>{age.totalWeeks.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: BRAND.textSecondary }}>WEEKS</div>
                </div>
                <div style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(59,130,246,0.1)" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#3B82F6" }}>{age.totalHours.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: BRAND.textSecondary }}>HOURS</div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ color: BRAND.textSecondary, padding: 20 }}>Enter your date of birth to see your exact age with fun facts! 🎂</div>
          )}
        </div>
      </div>

      {age && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginTop: 24 }}>
          <div style={{ ...cs, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🎂</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: age.daysToNextBday <= 7 ? "#EF4444" : "#F59E0B" }}>{age.daysToNextBday}</div>
            <div style={{ fontSize: 13, color: BRAND.textSecondary }}>Days until next birthday</div>
            {age.daysToNextBday <= 7 && <div style={{ fontSize: 12, color: "#EF4444", fontWeight: 700, marginTop: 4 }}>🎉 Almost here!</div>}
          </div>

          <div style={{ ...cs, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>{age.zodiac.symbol}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: STUDENT_BRAND.accent }}>{age.zodiac.sign}</div>
            <div style={{ fontSize: 13, color: BRAND.textSecondary }}>Zodiac Sign</div>
          </div>

          <div style={{ ...cs, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>📅</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: BRAND.text }}>{age.dayOfBirth}</div>
            <div style={{ fontSize: 13, color: BRAND.textSecondary }}>Born on a</div>
          </div>

          <div style={{ ...cs, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>👤</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: BRAND.text }}>{age.generation}</div>
            <div style={{ fontSize: 13, color: BRAND.textSecondary }}>Generation</div>
          </div>
        </div>
      )}

      {age && (
        <button onClick={() => {
          const text = `🎂 I'm exactly ${age.years} years, ${age.months} months and ${age.days} days old!\n${age.zodiac.symbol} ${age.zodiac.sign} | Born on ${age.dayOfBirth}\n🎉 Next birthday in ${age.daysToNextBday} days!\n\nCalculate yours: ${window.location.href}`;
          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
        }} style={{ width: "100%", marginTop: 24, background: "#25D366", color: "white", border: "none", borderRadius: 12, padding: "14px 24px", cursor: "pointer", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>📲</span> Share on WhatsApp
        </button>
      )}

      <div style={{ marginTop: 32, padding: 24, background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, color: BRAND.textSecondary, lineHeight: 1.8 }}>
        <h2 style={{ color: BRAND.text, fontSize: 22, marginBottom: 12 }}>Free Online Age Calculator</h2>
        <p>Calculate your exact age in years, months, days, weeks, and even hours. Find out what day of the week you were born, your zodiac sign, which generation you belong to, and how many days until your next birthday. Useful for government form applications, competitive exam registrations, and Aadhaar/PAN card updates where exact age is required.</p>
      </div>
    </div>
  );
}

export function YtThumbnailDownloader() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [error, setError] = useState("");

  const extractVideoId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
  };

  const getThumbnail = () => {
    setError("");
    setVideoId(null);
    if (!url.trim()) return;
    const id = extractVideoId(url);
    if (id) { setVideoId(id); } else { setError("Invalid YouTube URL. Please paste a valid video link."); }
  };

  const qualities = [
    { label: "Max Resolution (1280×720)", suffix: "maxresdefault", tag: "HD" },
    { label: "High Quality (480×360)", suffix: "hqdefault", tag: "HQ" },
    { label: "Medium Quality (320×180)", suffix: "mqdefault", tag: "MQ" },
    { label: "Standard (120×90)", suffix: "default", tag: "SD" },
  ];

  return (
    <div>
      <div style={{ ...cs, marginBottom: 24, textAlign: "center" }}>
        <h3 style={{ marginBottom: 8, color: BRAND.text }}>YouTube Thumbnail Downloader</h3>
        <p style={{ color: BRAND.textSecondary, marginBottom: 20, fontSize: 14 }}>Paste any YouTube video URL to download its thumbnail in multiple resolutions.</p>
        <div style={{ display: "flex", gap: 12, maxWidth: 600, margin: "0 auto" }}>
          <input type="text" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && getThumbnail()} placeholder="https://www.youtube.com/watch?v=..." style={{ flex: 1, padding: "14px 20px", borderRadius: 12, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 15 }} />
          <button onClick={getThumbnail} style={{ padding: "0 28px", borderRadius: 12, border: "none", background: "#EF4444", color: "white", cursor: "pointer", fontWeight: 700, fontSize: 15 }}>Get</button>
        </div>
        {error && <div style={{ color: "#EF4444", marginTop: 12, fontSize: 14 }}>{error}</div>}
      </div>

      {videoId && (
        <div className="fade-in">
          <div style={{ ...cs, textAlign: "center", marginBottom: 24 }}>
            <h4 style={{ color: "#10B981", marginBottom: 16 }}>✅ Thumbnail Found!</h4>
            <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${BRAND.border}`, marginBottom: 16 }}>
              <img src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} alt="YouTube Thumbnail" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {qualities.map(q => (
              <a key={q.suffix} href={`https://img.youtube.com/vi/${videoId}/${q.suffix}.jpg`} target="_blank" rel="noreferrer" style={{ ...cs, textAlign: "center", textDecoration: "none", cursor: "pointer", transition: "transform 0.2s", display: "block" }}>
                <div style={{ padding: "4px 12px", borderRadius: 6, background: "#EF444420", color: "#EF4444", fontSize: 11, fontWeight: 700, display: "inline-block", marginBottom: 8 }}>{q.tag}</div>
                <div style={{ fontSize: 13, color: BRAND.text, fontWeight: 600 }}>{q.label}</div>
                <div style={{ fontSize: 12, color: "#EF4444", marginTop: 8, fontWeight: 600 }}>⬇️ Download</div>
              </a>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 32, padding: 24, background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, color: BRAND.textSecondary, lineHeight: 1.8 }}>
        <h2 style={{ color: BRAND.text, fontSize: 22, marginBottom: 12 }}>Free YouTube Thumbnail Downloader</h2>
        <p>Download YouTube video thumbnails in HD, HQ, MQ, and standard quality. Useful for creating reaction videos, blog post cover images, college presentations, or social media posts. Simply paste the YouTube URL and click download—no login or software needed. Works on mobile and desktop browsers.</p>
      </div>
    </div>
  );
}
