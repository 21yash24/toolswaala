import { useState, useRef } from "react";
import { BRAND, PDF_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };

export default function PdfCompressor() {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState("Fast");
  const [level, setLevel] = useState("Medium");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState("");
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f && f.type === "application/pdf") {
      if (f.size > 20 * 1024 * 1024) {
        alert("File size exceeds 20MB limit for free plan.");
        return;
      }
      setFile(f);
      setResult(null);
    }
  };

  const compressFast = async () => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await window.PDFLib.PDFDocument.load(arrayBuffer);
      const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
      return new Blob([compressedBytes], { type: "application/pdf" });
    } catch (e) {
      console.error(e);
      throw new Error("Fast compression failed.");
    }
  };

  const compressDeep = async () => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      const { jsPDF } = window.jspdf;
      const newPdf = new jsPDF("p", "mm", "a4");
      
      const scale = level === "Light" ? 2.0 : level === "Medium" ? 1.5 : 1.0;
      const imageQuality = level === "Light" ? 0.8 : level === "Medium" ? 0.6 : 0.4;

      for (let i = 1; i <= numPages; i++) {
        setProgress(`Compressing page ${i} of ${numPages}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        const imgData = canvas.toDataURL("image/jpeg", imageQuality);
        
        if (i > 1) newPdf.addPage();
        const pdfWidth = newPdf.internal.pageSize.getWidth();
        const pdfHeight = newPdf.internal.pageSize.getHeight();
        newPdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      }

      setProgress("Finalizing file...");
      return newPdf.output("blob");
    } catch (e) {
      console.error(e);
      throw new Error("Deep compression failed.");
    }
  };

  const compressPdf = async () => {
    if (!file) return;
    setProcessing(true);
    setProgress(mode === "Fast" ? "Optimizing PDF structure..." : "Loading document...");
    
    try {
      let blob;
      if (mode === "Fast") {
        blob = await compressFast();
      } else {
        blob = await compressDeep();
      }

      let compressedSize = blob.size;
      let finalBlob = blob;

      if (compressedSize >= file.size) {
        compressedSize = file.size;
        finalBlob = file;
        alert("This PDF is already highly optimized. Returning original file.");
      }
      
      setResult({
        blob: finalBlob,
        name: `compressed_${file.name}`,
        originalSize: file.size,
        compressedSize: compressedSize,
        saved: Math.max(0, Math.round(((file.size - compressedSize) / file.size) * 100))
      });
    } catch (e) {
      alert(e.message || "Failed to compress PDF. Some encrypted PDFs cannot be processed.");
    } finally {
      setProcessing(false);
      setProgress("");
    }
  };

  const download = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="fade-in">
      {!result ? (
        <div style={cs}>
          <div 
            onClick={() => fileInputRef.current.click()}
            style={{ 
              border: `2px dashed ${file ? PDF_BRAND.accent : BRAND.border}`, 
              borderRadius: 16, 
              padding: 60, 
              textAlign: "center", 
              cursor: "pointer",
              background: file ? `${PDF_BRAND.accent}05` : "transparent",
              transition: "all 0.2s"
            }}
          >
            <input type="file" ref={fileInputRef} onChange={handleFile} accept=".pdf" style={{ display: "none" }} />
            <div style={{ fontSize: 48, marginBottom: 16 }}>{file ? "📄" : "📥"}</div>
            <h3 style={{ color: BRAND.text, marginBottom: 8 }}>{file ? file.name : "Drop your PDF here or click to browse"}</h3>
            <p style={{ color: BRAND.textSecondary, fontSize: 14 }}>{file ? formatSize(file.size) : "Maximum file size: 20MB"}</p>
          </div>

          {file && (
            <div style={{ marginTop: 32 }}>
              <label style={{ display: "block", color: BRAND.textSecondary, fontSize: 13, marginBottom: 16 }}>Select Compression Engine</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                <button onClick={() => setMode("Fast")} style={{ padding: "16px", borderRadius: 12, border: `1px solid ${mode === "Fast" ? PDF_BRAND.accent : BRAND.border}`, background: mode === "Fast" ? `${PDF_BRAND.accent}15` : "rgba(255,255,255,0.02)", color: mode === "Fast" ? "white" : BRAND.textSecondary, cursor: "pointer", textAlign: "left" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>⚡ Fast Mode (Safe)</div>
                  <div style={{ fontSize: 11, lineHeight: 1.4 }}>Optimizes internal structure. Keeps text selectable. Best for text-heavy documents.</div>
                </button>
                <button onClick={() => setMode("Deep")} style={{ padding: "16px", borderRadius: 12, border: `1px solid ${mode === "Deep" ? PDF_BRAND.accent : BRAND.border}`, background: mode === "Deep" ? `${PDF_BRAND.accent}15` : "rgba(255,255,255,0.02)", color: mode === "Deep" ? "white" : BRAND.textSecondary, cursor: "pointer", textAlign: "left" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>🔥 Deep Mode (Aggressive)</div>
                  <div style={{ fontSize: 11, lineHeight: 1.4 }}>Flattens pages into compressed images. Text becomes unselectable. Best for scanned notes.</div>
                </button>
              </div>

              {mode === "Deep" && (
                <div className="fade-in" style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", color: BRAND.textSecondary, fontSize: 13, marginBottom: 16 }}>Deep Compression Level</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    {["Light", "Medium", "Strong"].map(l => (
                      <button key={l} onClick={() => setLevel(l)} 
                        style={{ padding: "12px", borderRadius: 10, border: `1px solid ${level === l ? PDF_BRAND.accent : BRAND.border}`, background: level === l ? `${PDF_BRAND.accent}15` : "rgba(255,255,255,0.02)", color: level === l ? "white" : BRAND.textSecondary, cursor: "pointer", textAlign: "center" }}>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{l}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={compressPdf} 
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
                  cursor: processing ? "not-allowed" : "pointer",
                  opacity: processing ? 0.7 : 1
                }}
              >
                {processing ? progress || "Compressing PDF..." : "Compress PDF →"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={cs} className="fade-in">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h3 style={{ color: BRAND.text, marginBottom: 8 }}>Compression Complete!</h3>
            <p style={{ color: BRAND.textSecondary }}>File processed locally — never uploaded to any server.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
            <div style={{ background: "rgba(0,0,0,0.02)", padding: 20, borderRadius: 16, textAlign: "center" }}>
              <div style={{ fontSize: 12, color: BRAND.textSecondary, marginBottom: 4 }}>Original</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: BRAND.text }}>{formatSize(result.originalSize)}</div>
            </div>
            <div style={{ background: `${PDF_BRAND.accent}10`, padding: 20, borderRadius: 16, textAlign: "center", border: `1px solid ${PDF_BRAND.accent}20` }}>
              <div style={{ fontSize: 12, color: PDF_BRAND.accent, marginBottom: 4 }}>Compressed ({result.saved}% saved)</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: BRAND.text }}>{formatSize(result.compressedSize)}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <button onClick={() => { setFile(null); setResult(null); }} style={{ padding: "16px", borderRadius: 12, border: `1px solid ${BRAND.border}`, background: "transparent", color: "white", fontWeight: 600, cursor: "pointer" }}>Compress Another</button>
            <button onClick={download} style={{ padding: "16px", borderRadius: 12, border: "none", background: "#4CAF50", color: "white", fontWeight: 800, cursor: "pointer" }}>Download PDF ↓</button>
          </div>
        </div>
      )}

      <div style={{ marginTop: 60 }}>
        <h2 style={{ color: BRAND.text, fontSize: 24, marginBottom: 24 }}>Frequently Asked Questions</h2>
        <div style={{ display: "grid", gap: 24 }}>
          <div>
            <h4 style={{ color: BRAND.text, marginBottom: 8 }}>Which mode should I choose?</h4>
            <p style={{ color: BRAND.textSecondary, fontSize: 14, lineHeight: 1.6 }}>Use <strong>Fast Mode</strong> for text documents (like resumes or essays) to keep them clear and selectable. Use <strong>Deep Mode</strong> for scanned documents, photos, or when Fast Mode doesn't reduce the file size enough.</p>
          </div>
          <div>
            <h4 style={{ color: BRAND.text, marginBottom: 8 }}>Is it safe to compress my PDF here?</h4>
            <p style={{ color: BRAND.textSecondary, fontSize: 14, lineHeight: 1.6 }}>Yes. Unlike other websites, ToolsWaala uses 100% browser-side processing. Your files never leave your computer.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
