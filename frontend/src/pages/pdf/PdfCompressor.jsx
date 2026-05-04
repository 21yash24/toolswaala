import { useState, useRef } from "react";
import { BRAND, PDF_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };

export default function PdfCompressor() {
  const [file, setFile] = useState(null);
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

  const compressPdf = async () => {
    if (!file) return;
    setProcessing(true);
    setProgress("Loading document...");
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      const { jsPDF } = window.jspdf;
      const newPdf = new jsPDF("p", "mm", "a4");
      
      // Determine scale based on level
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
      const blob = newPdf.output("blob");
      
      let compressedSize = blob.size;
      let finalBlob = blob;

      // Fallback: if somehow it's larger (rare with flattening), just use original
      if (compressedSize > file.size) {
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
      console.error(e);
      alert("Failed to compress PDF. Some encrypted PDFs cannot be processed.");
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
            <h3 style={{ color: "white", marginBottom: 8 }}>{file ? file.name : "Drop your PDF here or click to browse"}</h3>
            <p style={{ color: BRAND.textSecondary, fontSize: 14 }}>{file ? formatSize(file.size) : "Maximum file size: 20MB"}</p>
          </div>

          {file && (
            <div style={{ marginTop: 32 }}>
              <div style={{ padding: 12, borderRadius: 8, background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", marginBottom: 20 }}>
                <span style={{ fontSize: 12, color: "#EF4444" }}>⚠️ Note: This aggressively compresses the file by converting pages to images. Selectable text will be flattened.</span>
              </div>
              <label style={{ display: "block", color: BRAND.textSecondary, fontSize: 13, marginBottom: 16 }}>Compression Level / कम्प्रेशन लेवल</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
                {["Light", "Medium", "Strong"].map(l => (
                  <button key={l} onClick={() => setLevel(l)} 
                    style={{ 
                      padding: "16px", 
                      borderRadius: 12, 
                      border: `1px solid ${level === l ? PDF_BRAND.accent : BRAND.border}`, 
                      background: level === l ? `${PDF_BRAND.accent}15` : "rgba(255,255,255,0.02)", 
                      color: level === l ? "white" : BRAND.textSecondary,
                      cursor: "pointer",
                      textAlign: "center"
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{l}</div>
                    <div style={{ fontSize: 11 }}>{l === "Light" ? "Best Quality" : l === "Medium" ? "Balanced" : "Smallest Size"}</div>
                  </button>
                ))}
              </div>

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
            <h3 style={{ color: "white", marginBottom: 8 }}>Compression Complete!</h3>
            <p style={{ color: BRAND.textSecondary }}>File processed locally — never uploaded to any server.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", padding: 20, borderRadius: 16, textAlign: "center" }}>
              <div style={{ fontSize: 12, color: BRAND.textSecondary, marginBottom: 4 }}>Original</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "white" }}>{formatSize(result.originalSize)}</div>
            </div>
            <div style={{ background: `${PDF_BRAND.accent}10`, padding: 20, borderRadius: 16, textAlign: "center", border: `1px solid ${PDF_BRAND.accent}20` }}>
              <div style={{ fontSize: 12, color: PDF_BRAND.accent, marginBottom: 4 }}>Compressed ({result.saved}% saved)</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "white" }}>{formatSize(result.compressedSize)}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <button onClick={() => { setFile(null); setResult(null); }} style={{ padding: "16px", borderRadius: 12, border: `1px solid ${BRAND.border}`, background: "transparent", color: "white", fontWeight: 600, cursor: "pointer" }}>Compress Another</button>
            <button onClick={download} style={{ padding: "16px", borderRadius: 12, border: "none", background: "#4CAF50", color: "white", fontWeight: 800, cursor: "pointer" }}>Download PDF ↓</button>
          </div>
        </div>
      )}

      {/* SEO & FAQ */}
      <div style={{ marginTop: 60 }}>
        <h2 style={{ color: "white", fontSize: 24, marginBottom: 24 }}>Frequently Asked Questions</h2>
        <div style={{ display: "grid", gap: 24 }}>
          <div>
            <h4 style={{ color: "white", marginBottom: 8 }}>How does this aggressive compression work?</h4>
            <p style={{ color: BRAND.textSecondary, fontSize: 14, lineHeight: 1.6 }}>Unlike our old compressor, this tool actually flattens your PDF pages into high-efficiency JPEG images before rebuilding the PDF. This guarantees massive file size reductions, especially for documents containing many large photos or complex graphics.</p>
          </div>
          <div>
            <h4 style={{ color: "white", marginBottom: 8 }}>Will I lose selectable text?</h4>
            <p style={{ color: BRAND.textSecondary, fontSize: 14, lineHeight: 1.6 }}>Yes. Because we flatten the PDF to ensure the smallest possible file size (vital for exam portal uploads), any selectable text will become an image. If you need to edit the text later, keep your original file.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
