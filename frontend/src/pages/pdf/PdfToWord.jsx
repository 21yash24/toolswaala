import { useState, useRef } from "react";
import { BRAND, PDF_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };

export default function PdfToWord() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f && f.type === "application/pdf") {
      setFile(f);
    } else {
      alert("Please upload a .pdf file.");
    }
  };

  const convertToWord = async () => {
    if (!file) return;
    setProcessing(true);
    setProgress("Reading PDF...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      let fullText = "";

      for (let i = 1; i <= numPages; i++) {
        setProgress(`Extracting text from page ${i} of ${numPages}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Simple extraction: join text items.
        // It loses complex layout, but grabs the raw text accurately.
        const pageText = textContent.items.map(item => item.str).join(" ");
        fullText += pageText + "\n\n";
      }

      setProgress("Generating Word document...");
      
      const { Document, Packer, Paragraph, TextRun } = window.docx;
      
      const paragraphs = fullText.split("\n").map(line => {
        return new Paragraph({
          children: [new TextRun(line)]
        });
      });

      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs,
        }],
      });

      const blob = await Packer.toBlob(doc);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(".pdf", ".docx");
      a.click();
      URL.revokeObjectURL(url);
      
      setProgress("Conversion Complete!");
    } catch (err) {
      console.error(err);
      alert("Failed to convert PDF. It might be password protected or consist only of images (requires OCR).");
      setProgress("Failed.");
    } finally {
      setTimeout(() => setProcessing(false), 2000);
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
          <div style={{ fontSize: 32, marginBottom: 12 }}>📝</div>
          <h3 style={{ color: BRAND.text, marginBottom: 4 }}>{file ? file.name : "Upload PDF File"}</h3>
          <p style={{ color: BRAND.textSecondary, fontSize: 13 }}>Extract text to a Word document</p>
        </div>

        {file && (
          <div style={{ marginTop: 32 }}>
            <button 
              onClick={convertToWord} 
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
              {processing ? progress : "Convert to Word (Text Only) →"}
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: 40, padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.02)", border: `1px solid ${BRAND.border}` }}>
        <h4 style={{ color: BRAND.text, marginBottom: 12 }}>🔒 100% Private (Text Extraction)</h4>
        <p style={{ color: BRAND.textSecondary, fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          Most PDF to Word converters upload your file to their server. We process the file completely inside your browser. Because of this, we perform a "Text Extraction" which grabs all text data but does not preserve complex layouts, images, or tables. Perfect for getting raw text quickly and securely!
        </p>
      </div>
    </div>
  );
}
