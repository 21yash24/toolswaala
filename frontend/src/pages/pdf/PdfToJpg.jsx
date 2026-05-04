import { useState, useRef } from "react";
import { BRAND, PDF_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };

export default function PdfToJpg() {
  const [file, setFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [quality, setQuality] = useState(2); // DPI Scale: 1=72, 2=150, 3=300
  const fileInputRef = useRef(null);

  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (f && f.type === "application/pdf") {
      setFile(f);
      const reader = new FileReader();
      reader.onload = async (rev) => {
        const loadingTask = window.pdfjsLib.getDocument(rev.target.result);
        const doc = await loadingTask.promise;
        setPdfDoc(doc);
      };
      reader.readAsArrayBuffer(f);
    }
  };

  const convertToImages = async () => {
    if (!pdfDoc) return;
    setProcessing(true);

    try {
      const zip = new window.JSZip();
      
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: quality });
        
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
        
        const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", 0.9));
        zip.file(`page_${i}.jpg`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace(".pdf", "")}_images.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Conversion failed. Some PDFs have restricted access.");
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
          <div style={{ fontSize: 32, marginBottom: 12 }}>📸</div>
          <h3 style={{ color: "white", marginBottom: 4 }}>{file ? file.name : "Select PDF File"}</h3>
          <p style={{ color: BRAND.textSecondary, fontSize: 13 }}>{pdfDoc ? `${pdfDoc.numPages} Pages Found` : "Extract each page as an image"}</p>
        </div>

        {file && pdfDoc && (
          <div style={{ marginTop: 32 }}>
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", color: BRAND.textSecondary, fontSize: 13, marginBottom: 16 }}>Image Quality (DPI)</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[
                  { val: 1, label: "Web (72 DPI)", desc: "Small File" },
                  { val: 2, label: "Print (150 DPI)", desc: "Standard" },
                  { val: 4, label: "High (300 DPI)", desc: "Best Quality" }
                ].map(q => (
                  <button key={q.val} onClick={() => setQuality(q.val)} 
                    style={{ 
                      padding: "16px", 
                      borderRadius: 12, 
                      border: `1px solid ${quality === q.val ? PDF_BRAND.accent : BRAND.border}`, 
                      background: quality === q.val ? `${PDF_BRAND.accent}15` : "rgba(255,255,255,0.02)", 
                      color: quality === q.val ? "white" : BRAND.textSecondary,
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{q.label}</div>
                    <div style={{ fontSize: 10 }}>{q.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={convertToImages} 
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
              {processing ? "Converting Pages..." : `Convert ${pdfDoc.numPages} Pages to JPG →`}
            </button>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: 40, padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.02)", border: `1px solid ${BRAND.border}` }}>
        <h4 style={{ color: "white", marginBottom: 12 }}>🔒 100% Secure</h4>
        <p style={{ color: BRAND.textSecondary, fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          Your PDF is rendered directly in your browser. We never see your content. Once processed, you'll get a ZIP file containing all pages as individual JPG images.
        </p>
      </div>
    </div>
  );
}
