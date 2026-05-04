import { useState } from "react";
import { BRAND, PDF_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };

export default function WordToPdf() {
  const [textMode, setTextMode] = useState(false);
  const [content, setContent] = useState("");

  const downloadTextAsPdf = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(content, 180);
    doc.text(splitText, 15, 20);
    doc.save("document.pdf");
  };

  return (
    <div className="fade-in">
      {!textMode ? (
        <div style={{ display: "grid", gap: 24 }}>
          <div style={cs}>
            <h3 style={{ color: "white", marginBottom: 16 }}>Why no direct .docx upload?</h3>
            <p style={{ color: BRAND.textSecondary, fontSize: 14, lineHeight: 1.6 }}>
              Professional Word-to-PDF conversion requires high-power server processing to preserve fonts and layouts. To protect your privacy, we don't upload files to servers. 
            </p>
            <div style={{ marginTop: 24 }}>
              <button onClick={() => setTextMode(true)} style={{ padding: "12px 24px", borderRadius: 10, background: PDF_BRAND.accent, color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}>Paste Text to PDF →</button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            <GuideCard 
              title="Method 1: Windows / Office" 
              steps={["Open your file in Word", "Go to File > Save As", "Choose PDF from the list", "Click Save"]} 
              icon="🪟"
            />
            <GuideCard 
              title="Method 2: Google Docs" 
              steps={["Upload file to Google Drive", "Open with Google Docs", "File > Download > PDF", "Download complete"]} 
              icon="🌐"
            />
            <GuideCard 
              title="Method 3: Mobile (Android/iOS)" 
              steps={["Open file in any viewer", "Tap Share icon", "Select 'Print' option", "Choose 'Save as PDF'"]} 
              icon="📱"
            />
          </div>
        </div>
      ) : (
        <div style={cs}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ color: "white", margin: 0 }}>Text to PDF</h3>
            <button onClick={() => setTextMode(false)} style={{ background: "none", border: "none", color: BRAND.textSecondary, cursor: "pointer" }}>Back to Guide</button>
          </div>
          <textarea 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            placeholder="Paste your text content here to generate a clean PDF document..." 
            style={{ width: "100%", height: 300, padding: 16, borderRadius: 12, background: "rgba(0,0,0,0.2)", border: `1px solid ${BRAND.border}`, color: "white", fontSize: 14, outline: "none", resize: "none", marginBottom: 20 }}
          />
          <button onClick={downloadTextAsPdf} style={{ width: "100%", padding: 16, borderRadius: 12, background: "#4CAF50", color: "white", border: "none", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>Download as PDF ↓</button>
        </div>
      )}
    </div>
  );
}

function GuideCard({ title, steps, icon }) {
  return (
    <div style={{ ...cs, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 32 }}>{icon}</div>
      <h4 style={{ color: "white", margin: 0 }}>{title}</h4>
      <div style={{ display: "grid", gap: 12 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 12, fontSize: 13, color: BRAND.textSecondary }}>
            <span style={{ color: PDF_BRAND.accent, fontWeight: 900 }}>{i + 1}</span>
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
