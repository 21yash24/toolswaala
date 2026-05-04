import { useState, useRef } from "react";
import { BRAND, PDF_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };

export default function WordToPdf() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [htmlPreview, setHtmlPreview] = useState("");
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);

  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (f && (f.name.endsWith(".docx") || f.type.includes("wordprocessingml"))) {
      setFile(f);
      try {
        const arrayBuffer = await f.arrayBuffer();
        const result = await window.mammoth.convertToHtml({ arrayBuffer });
        setHtmlPreview(result.value);
      } catch (err) {
        console.error(err);
        alert("Could not read this Word file. Ensure it is a valid .docx format.");
        setFile(null);
      }
    } else {
      alert("Please upload a .docx file.");
    }
  };

  const convertToPdf = () => {
    if (!file || !htmlPreview) return;
    setProcessing(true);

    const element = previewRef.current;
    
    // Add some basic styling for the PDF output
    const opt = {
      margin:       15,
      filename:     file.name.replace(".docx", ".pdf"),
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    window.html2pdf().set(opt).from(element).save().then(() => {
      setProcessing(false);
    }).catch(err => {
      console.error(err);
      alert("Failed to generate PDF.");
      setProcessing(false);
    });
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
          <input type="file" ref={fileInputRef} onChange={handleFile} accept=".docx" style={{ display: "none" }} />
          <div style={{ fontSize: 32, marginBottom: 12 }}>📄</div>
          <h3 style={{ color: BRAND.text, marginBottom: 4 }}>{file ? file.name : "Upload Word Document (.docx)"}</h3>
          <p style={{ color: BRAND.textSecondary, fontSize: 13 }}>Convert Word documents to PDF locally</p>
        </div>

        {file && (
          <div style={{ marginTop: 32 }}>
            <div style={{ marginBottom: 24, padding: 16, background: "rgba(0,0,0,0.2)", borderRadius: 12, border: `1px solid ${BRAND.border}` }}>
              <div style={{ fontSize: 12, color: BRAND.textSecondary, marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
                <span>Document Preview (Formatting may vary)</span>
              </div>
              <div 
                ref={previewRef}
                style={{ background: "white", color: "black", padding: "40px", borderRadius: 8, maxHeight: "400px", overflowY: "auto", fontFamily: "Arial, sans-serif" }}
                dangerouslySetInnerHTML={{ __html: htmlPreview }}
              />
            </div>

            <button 
              onClick={convertToPdf} 
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
              {processing ? "Generating PDF..." : "Convert to PDF →"}
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: 40, padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.02)", border: `1px solid ${BRAND.border}` }}>
        <h4 style={{ color: BRAND.text, marginBottom: 12 }}>🔒 100% Secure Conversion</h4>
        <p style={{ color: BRAND.textSecondary, fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          Unlike other websites, we convert your Word document to PDF entirely in your browser using local rendering. Note: Complex layouts (like headers, footers, and complex tables) might look different than the original Word file.
        </p>
      </div>
    </div>
  );
}
