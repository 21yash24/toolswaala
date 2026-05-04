import React, { useState } from "react";
import { BRAND } from "../../shared/constants";

export default function BusinessNameTool() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  const generate = () => {
    if (!keyword) return;
    const suffixes = ["Waala", "Hub", "Kit", "Core", "Prime", "Next", "Flow", "Sync", "Grid", "Base"];
    const prefixes = ["Go", "Quick", "Pro", "Smart", "Easy", "My", "The", "i", "Total", "Ultra"];
    const names = [];
    suffixes.forEach(s => names.push(keyword + s));
    prefixes.forEach(p => names.push(p + keyword));
    setResults(names.sort(() => 0.5 - Math.random()).slice(0, 12));
  };

  return (
    <div className="fade-in">
      <div className="glass-card" style={{ maxWidth: 600, margin: "0 auto 40px" }}>
        <div className="form-group">
          <label>What is your business about? (Keyword)</label>
          <div style={{ display: "flex", gap: 12 }}>
            <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="e.g. Chai, Code, Tech..." />
            <button className="btn-primary" onClick={generate}>Generate</button>
          </div>
        </div>
      </div>
      
      {results.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {results.map(name => (
            <div key={name} className="result-box" style={{ textAlign: "center", padding: "32px 16px", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
              <div style={{ fontSize: 20, fontWeight: 800, color: BRAND.primary }}>{name}</div>
              <div style={{ fontSize: 10, color: BRAND.textSecondary, marginTop: 8 }}>AVAILABLE</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
