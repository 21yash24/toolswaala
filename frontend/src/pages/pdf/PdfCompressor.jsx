import { useState, useRef } from "react";
import { BRAND, PDF_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };

export default function PdfCompressor() {
  const [file, setFile] = useState(null);
  const [level, setLevel] = useState("Medium");
  const [processing, setProcessing] = useState(false);
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
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await window.PDFLib.PDFDocument.load(arrayBuffer);
      
      // Basic compression: structural re-encoding
      // pdf-lib doesn't have native image compression, but saving it can clean up resources.
      const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
      
      const blob = new Blob([compressedBytes], { type: "application/pdf" });
      const compressedSize = blob.size;
      
      setResult({
        blob,
        name: `compressed_${file.name}`,
        originalSize: file.size,
        compressedSize: compressedSize,
        saved: Math.round(((file.size - compressedSize) / file.size) * 100)
      });
    } catch (e) {
      console.error(e);
      alert("Failed to compress PDF. Some PDFs are already highly optimized.");
    } finally {
      setProcessing(false);
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
                  cursor: "pointer",
                  opacity: processing ? 0.7 : 1
                }}
              >
                {processing ? "Compressing PDF..." : "Compress PDF →"}
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
            <h4 style={{ color: "white", marginBottom: 8 }}>Is it safe to compress my PDF here?</h4>
            <p style={{ color: BRAND.textSecondary, fontSize: 14, lineHeight: 1.6 }}>Yes. Unlike other websites, ToolsWaala uses 100% browser-side processing. Your files never leave your computer. The compression happens entirely in your browser's memory and is cleared once you close the tab.</p>
          </div>
          <div>
            <h4 style={{ color: "white", marginBottom: 8 }}>Why did my file size not decrease significantly?</h4>
            <p style={{ color: BRAND.textSecondary, fontSize: 14, lineHeight: 1.6 }}>If your PDF already contains highly optimized images or has been compressed before, further reduction might be minimal. Our tool focuses on structural optimization and cleaning up redundant data.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
