import { useState, useRef } from "react";
import { BRAND, PDF_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };

export default function WatermarkPdf() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [settings, setSettings] = useState({ text: "CONFIDENTIAL", color: "#333333", opacity: 0.3, size: 50 });
  const fileInputRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f && f.type === "application/pdf") {
      setFile(f);
    }
  };

  const addWatermark = async () => {
    if (!file || !settings.text) return;
    setProcessing(true);

    try {
      const { PDFDocument, rgb, StandardFonts, degrees } = window.PDFLib;
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      // Convert hex color to rgb
      const hex = settings.color.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.drawText(settings.text, {
          x: width / 2 - (settings.text.length * settings.size) / 4,
          y: height / 2,
          size: settings.size,
          font,
          color: rgb(r, g, b),
          opacity: settings.opacity,
          rotate: degrees(45),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `watermarked_${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Failed to add watermark.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fade-in">
      <div style={cs}>
        <div 
          onClick={() => fileInputRef.current.click()}
          style={{ 
            border: `2px dashed ${file ? PDF_BRAND.accent : BRAND.border}`, 
            borderRadius: 16, 
            padding: 40, 
            textAlign: "center", 
            cursor: "pointer",
            background: file ? `${PDF_BRAND.accent}05` : "transparent"
          }}
        >
          <input type="file" ref={fileInputRef} onChange={handleFile} accept=".pdf" style={{ display: "none" }} />
          <div style={{ fontSize: 32, marginBottom: 12 }}>🖋️</div>
          <h3 style={{ color: BRAND.text }}>{file ? file.name : "Select PDF for Watermark"}</h3>
        </div>

        {file && (
          <div style={{ marginTop: 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ fontSize: 12, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Watermark Text</label>
                <input value={settings.text} onChange={e => setSettings({...settings, text: e.target.value})} style={{ width: "100%", padding: 12, borderRadius: 8, background: BRAND.surfaceCard, border: `1px solid ${BRAND.border}`, color: BRAND.text }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Font Color</label>
                <input type="color" value={settings.color} onChange={e => setSettings({...settings, color: e.target.value})} style={{ width: "100%", height: 42, padding: 4, borderRadius: 8, background: BRAND.surfaceCard, border: `1px solid ${BRAND.border}` }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Opacity ({Math.round(settings.opacity * 100)}%)</label>
                <input type="range" min="0.1" max="0.8" step="0.1" value={settings.opacity} onChange={e => setSettings({...settings, opacity: parseFloat(e.target.value)})} style={{ width: "100%", marginTop: 10 }} />
              </div>
            </div>

            <button onClick={addWatermark} disabled={processing} style={{ width: "100%", padding: "16px", borderRadius: 12, background: PDF_BRAND.accent, color: "white", border: "none", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>{processing ? "Adding Watermark..." : "Apply Watermark →"}</button>
          </div>
        )}
      </div>
    </div>
  );
}
