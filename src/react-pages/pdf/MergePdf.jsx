import { useState, useRef } from "react";
import { BRAND, PDF_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };

export default function MergePdf() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files).filter(f => f.type === "application/pdf");
    setFiles(prev => [...prev, ...newFiles.map(f => ({ file: f, id: Date.now() + Math.random() }))]);
  };

  const removeFile = (id) => setFiles(p => p.filter(f => f.id !== id));

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setProcessing(true);

    try {
      const { PDFDocument } = window.PDFLib;
      const mergedPdf = await PDFDocument.create();

      for (const fObj of files) {
        const arrayBuffer = await fObj.file.arrayBuffer();
        const donorPdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(donorPdf, donorPdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged_documents.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Failed to merge PDFs. Please ensure none of the files are password protected.");
    } finally {
      setProcessing(false);
    }
  };

  const move = (idx, dir) => {
    const newFiles = [...files];
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= newFiles.length) return;
    [newFiles[idx], newFiles[targetIdx]] = [newFiles[targetIdx], newFiles[idx]];
    setFiles(newFiles);
  };

  return (
    <div className="fade-in">
      <div style={cs}>
        <div 
          onClick={() => fileInputRef.current.click()}
          style={{ 
            border: `2px dashed ${files.length > 0 ? PDF_BRAND.accent : BRAND.border}`, 
            borderRadius: 16, 
            padding: 40, 
            textAlign: "center", 
            cursor: "pointer",
            background: files.length > 0 ? `${PDF_BRAND.accent}05` : "transparent"
          }}
        >
          <input type="file" ref={fileInputRef} onChange={handleFiles} accept=".pdf" multiple style={{ display: "none" }} />
          <div style={{ fontSize: 32, marginBottom: 12 }}>📑</div>
          <h3 style={{ color: BRAND.text, marginBottom: 4 }}>Add PDF Files</h3>
          <p style={{ color: BRAND.textSecondary, fontSize: 13 }}>Combine marksheets, certificates, or NOCs into one file</p>
        </div>

        {files.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <div style={{ display: "grid", gap: 10, marginBottom: 32 }}>
              {files.map((f, idx) => (
                <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px", borderRadius: 12, background: "rgba(0,0,0,0.02)", border: `1px solid ${BRAND.border}` }}>
                  <div style={{ fontSize: 20 }}>📄</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: BRAND.text, fontSize: 14, fontWeight: 600 }}>{f.file.name}</div>
                    <div style={{ color: BRAND.textSecondary, fontSize: 12 }}>{(f.file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => move(idx, -1)} disabled={idx === 0} style={{ padding: "8px", borderRadius: 6, border: "none", background: "rgba(0,0,0,0.03)", color: "white", cursor: "pointer", opacity: idx === 0 ? 0.3 : 1 }}>↑</button>
                    <button onClick={() => move(idx, 1)} disabled={idx === files.length - 1} style={{ padding: "8px", borderRadius: 6, border: "none", background: "rgba(0,0,0,0.03)", color: "white", cursor: "pointer", opacity: idx === files.length - 1 ? 0.3 : 1 }}>↓</button>
                    <button onClick={() => removeFile(f.id)} style={{ padding: "8px", borderRadius: 6, border: "none", background: "rgba(239,68,68,0.1)", color: "#EF4444", cursor: "pointer" }}>✕</button>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={mergePdfs} 
              disabled={processing || files.length < 2}
              style={{ 
                width: "100%", 
                padding: "18px", 
                borderRadius: 12, 
                background: files.length >= 2 ? PDF_BRAND.accent : BRAND.border, 
                color: "white", 
                border: "none", 
                fontWeight: 800, 
                fontSize: 16,
                cursor: files.length >= 2 ? "pointer" : "not-allowed"
              }}
            >
              {processing ? "Merging Files..." : files.length < 2 ? "Add at least 2 files" : `Merge ${files.length} PDFs →`}
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: 40, padding: 24, borderRadius: 16, background: `${PDF_BRAND.accent}05`, border: `1px solid ${PDF_BRAND.accent}20` }}>
        <h4 style={{ color: BRAND.text, marginBottom: 12 }}>🔒 Privacy Guaranteed</h4>
        <p style={{ color: BRAND.textSecondary, fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          Unlike other tools, ToolsWaala never uploads your PDFs. The merging process happens entirely in your RAM using pdf-lib. No server ever sees your files.
        </p>
      </div>
    </div>
  );
}
