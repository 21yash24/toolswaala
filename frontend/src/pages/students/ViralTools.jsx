import { useState } from "react";
import { BRAND, STUDENT_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };

export function WordCounter() {
  const [text, setText] = useState("");
  
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const readingTime = Math.ceil(words / 200); // avg 200 words per min

  return (
    <div>
      <div style={{ ...cs, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, color: BRAND.text }}>Text Analyzer</h3>
        <textarea 
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type or paste your text here to count words, characters, and estimate reading time..."
          style={{ width: "100%", height: 250, padding: 16, borderRadius: 12, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", color: BRAND.text, fontSize: 16, resize: "vertical", outline: "none", fontFamily: "inherit" }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <button onClick={() => setText("")} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "rgba(239,68,68,0.1)", color: "#EF4444", cursor: "pointer", fontWeight: 600 }}>Clear Text</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 32 }}>
        <div style={{ ...cs, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: BRAND.textSecondary, textTransform: "uppercase", letterSpacing: 1 }}>Words</div>
          <div style={{ fontSize: 42, fontWeight: 900, color: STUDENT_BRAND.accent }}>{words}</div>
        </div>
        <div style={{ ...cs, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: BRAND.textSecondary, textTransform: "uppercase", letterSpacing: 1 }}>Characters</div>
          <div style={{ fontSize: 42, fontWeight: 900, color: "#F43F5E" }}>{chars}</div>
        </div>
        <div style={{ ...cs, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: BRAND.textSecondary, textTransform: "uppercase", letterSpacing: 1 }}>No Spaces</div>
          <div style={{ fontSize: 42, fontWeight: 900, color: "#10B981" }}>{charsNoSpaces}</div>
        </div>
        <div style={{ ...cs, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: BRAND.textSecondary, textTransform: "uppercase", letterSpacing: 1 }}>Reading Time</div>
          <div style={{ fontSize: 42, fontWeight: 900, color: "#3B82F6" }}>{readingTime}<span style={{ fontSize: 16 }}>m</span></div>
        </div>
      </div>

      <div style={cs}>
        <h3 style={{ marginBottom: 16 }}>Why use a Word Counter?</h3>
        <p style={{ color: BRAND.textSecondary, lineHeight: 1.6, fontSize: 14 }}>
          Whether you are a student writing an essay with a strict word limit, a professional drafting an important email, or a social media manager crafting the perfect tweet, our free online word counter helps you track your text metrics instantly in your browser. It automatically calculates total words, characters (with and without spaces), and estimates the average reading time.
        </p>
      </div>
    </div>
  );
}

export function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [age, setAge] = useState(null);

  const calculateAge = () => {
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    setAge({ years, months, days });
  };

  return (
    <div>
      <div className="grid-2">
        <div style={cs}>
          <h3 style={{ marginBottom: 24 }}>Enter Date of Birth</h3>
          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} max={new Date().toISOString().split("T")[0]} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}` }} />
          </div>
          <button className="btn-primary" onClick={calculateAge} style={{ width: "100%", marginTop: 16 }}>Calculate Age</button>
        </div>

        <div style={{ ...cs, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          {age ? (
            <>
              <div style={{ fontSize: 14, color: BRAND.textSecondary, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Your Exact Age Is</div>
              <div style={{ fontSize: 56, fontWeight: 900, color: "#8B5CF6", lineHeight: 1 }}>{age.years}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: BRAND.text, marginBottom: 24 }}>Years</div>
              
              <div style={{ display: "flex", gap: 24 }}>
                <div><div style={{ fontSize: 28, fontWeight: 800 }}>{age.months}</div><div style={{ fontSize: 12, color: BRAND.textSecondary }}>Months</div></div>
                <div><div style={{ fontSize: 28, fontWeight: 800 }}>{age.days}</div><div style={{ fontSize: 12, color: BRAND.textSecondary }}>Days</div></div>
              </div>
            </>
          ) : (
            <div style={{ color: BRAND.textSecondary }}>Enter your date of birth to see your exact age.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function YtThumbnailDownloader() {
  const [url, setUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [error, setError] = useState("");

  const extractVideoId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
  };

  const getThumbnail = () => {
    setError("");
    setThumbnailUrl(null);
    if (!url.trim()) return;
    
    const videoId = extractVideoId(url);
    if (videoId) {
      // maxresdefault is the highest quality thumbnail YouTube generates
      setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
    } else {
      setError("Invalid YouTube URL. Please paste a valid video link.");
    }
  };

  return (
    <div>
      <div style={{ ...cs, marginBottom: 24, textAlign: "center" }}>
        <h3 style={{ marginBottom: 16 }}>YouTube Thumbnail Extractor</h3>
        <p style={{ color: BRAND.textSecondary, marginBottom: 24, fontSize: 14 }}>Paste any YouTube video link below to download its high-resolution (HD) thumbnail instantly.</p>
        
        <div style={{ display: "flex", gap: 12, maxWidth: 600, margin: "0 auto" }}>
          <input 
            type="text" 
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            style={{ flex: 1, padding: "16px 20px", borderRadius: 12, border: `1px solid ${BRAND.border}`, background: "rgba(0,0,0,0.02)", fontSize: 16 }}
          />
          <button className="btn-primary" onClick={getThumbnail} style={{ padding: "0 32px" }}>Get Image</button>
        </div>
        {error && <div style={{ color: "#EF4444", marginTop: 12, fontSize: 14 }}>{error}</div>}
      </div>

      {thumbnailUrl && (
        <div className="fade-in" style={{ ...cs, textAlign: "center" }}>
          <h4 style={{ marginBottom: 16, color: BRAND.success }}>✅ Thumbnail Extracted Successfully!</h4>
          <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${BRAND.border}`, marginBottom: 24 }}>
            <img src={thumbnailUrl} alt="YouTube Thumbnail" style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            <a href={thumbnailUrl} target="_blank" rel="noreferrer" style={{ padding: "12px 24px", borderRadius: 10, background: "#EF4444", color: "white", textDecoration: "none", fontWeight: 700, display: "inline-block" }}>
              ⬇️ Download Full HD (1080p)
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
