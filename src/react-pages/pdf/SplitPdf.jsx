import { useState, useRef } from "react";
import { BRAND, PDF_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };

export default function SplitPdf() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [mode, setMode] = useState("Extract");
  const [range, setRange] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (f && f.type === "application/pdf") {
      setFile(f);
      const arrayBuffer = await f.arrayBuffer();
      const pdfDoc = await window.PDFLib.PDFDocument.load(arrayBuffer);
      setPageCount(pdfDoc.getPageCount());
      setRange(`1-${pdfDoc.getPageCount()}`);
    }
  };

  const splitPdf = async () => {
    if (!file) return;
    setProcessing(true);

    try {
      const { PDFDocument } = window.PDFLib;
      const arrayBuffer = await file.arrayBuffer();
      const donorPdf = await PDFDocument.load(arrayBuffer);
      const zip = new window.JSZip();

      if (mode === "Extract") {
        const ranges = range.split(",").map(r => r.trim());
        const newPdf = await PDFDocument.create();
        
        for (const r of ranges) {
          if (r.includes("-")) {
            const [start, end] = r.split("-").map(n => parseInt(n));
            const indices = Array.from({length: end - start + 1}, (_, i) => start + i - 1);
            const copiedPages = await newPdf.copyPages(donorPdf, indices);
            copiedPages.forEach(p => newPdf.addPage(p));
          } else {
            const idx = parseInt(r) - 1;
            const [copiedPage] = await newPdf.copyPages(donorPdf, [idx]);
            newPdf.addPage(copiedPage);
          }
        }
        
        const bytes = await newPdf.save();
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `extracted_${file.name}`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (mode === "Individual") {
        for (let i = 0; i < pageCount; i++) {
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(donorPdf, [i]);
          newPdf.addPage(copiedPage);
          const bytes = await newPdf.save();
          zip.file(`page_${i + 1}.pdf`, bytes);
        }
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `split_${file.name.replace(".pdf", "")}.zip`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error(e);
      alert("Split failed. Check your range format (e.g. 1-3, 5).");
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
          <div style={{ fontSize: 32, marginBottom: 12 }}>✂️</div>
          <h3 style={{ color: BRAND.text, marginBottom: 4 }}>{file ? file.name : "Select PDF File"}</h3>
          <p style={{ color: BRAND.textSecondary, fontSize: 13 }}>{pageCount ? `${pageCount} Total Pages` : "Split your PDF into parts"}</p>
        </div>

        {file && (
          <div style={{ marginTop: 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              {["Extract", "Individual"].map(m => (
                <button key={m} onClick={() => setMode(m)} 
                  style={{ 
                    padding: "16px", 
                    borderRadius: 12, 
                    border: `1px solid ${mode === m ? PDF_BRAND.accent : BRAND.border}`, 
                    background: mode === m ? `${PDF_BRAND.accent}15` : "rgba(255,255,255,0.02)", 
                    color: mode === m ? "white" : BRAND.textSecondary,
                    cursor: "pointer"
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{m === "Extract" ? "Custom Range" : "All Individual"}</div>
                  <div style={{ fontSize: 11 }}>{m === "Extract" ? "Choose specific pages" : "Each page as a file"}</div>
                </button>
              ))}
            </div>

            {mode === "Extract" && (
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", color: BRAND.textSecondary, fontSize: 13, marginBottom: 8 }}>Enter Page Range / पेज रेंज चुनें</label>
                <input value={range} onChange={e => setRange(e.target.value)} placeholder="e.g. 1-3, 5, 8-10" style={{ width: "100%", padding: "12px", borderRadius: 10, background: "rgba(0,0,0,0.02)", border: `1px solid ${BRAND.border}`, color: BRAND.text, outline: "none" }} />
                <div style={{ fontSize: 11, color: BRAND.textSecondary, marginTop: 6 }}>Format: 1-3, 5 (for pages 1, 2, 3 and 5)</div>
              </div>
            )}

            <button 
              onClick={splitPdf} 
              disabled={processing}
              style={{ 
                width: "100%", 
                padding: "18px", 
                borderRadius: 12, 
                background: PDF_BRAND.accent, 
                color: "white", 
                border: "none", 
                fontWeight: 800, 
                fontSize: 16,
                cursor: "pointer"
              }}
            >
              {processing ? "Processing..." : mode === "Extract" ? "Extract Specified Pages →" : "Split into All Individual Pages →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
