import { useState, useRef } from "react";
import { BRAND, PDF_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };

export default function ImageToPdf() {
  const [images, setImages] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [options, setOptions] = useState({ pageSize: "a4", orientation: "p", margin: 10 });
  const fileInputRef = useRef(null);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (rev) => {
        setImages(prev => [...prev, { name: file.name, src: rev.target.result, id: Date.now() + Math.random() }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id) => setImages(p => p.filter(img => img.id !== id));

  const convertToPdf = async () => {
    if (images.length === 0) return;
    setProcessing(true);

    try {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF(options.orientation, "mm", options.pageSize);
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = options.margin;

      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage();
        
        const img = new Image();
        img.src = images[i].src;
        await new Promise(resolve => img.onload = resolve);

        let imgWidth = pageWidth - (margin * 2);
        let imgHeight = (img.height * imgWidth) / img.width;

        if (imgHeight > pageHeight - (margin * 2)) {
          imgHeight = pageHeight - (margin * 2);
          imgWidth = (img.width * imgHeight) / img.height;
        }

        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        pdf.addImage(img, "JPEG", x, y, imgWidth, imgHeight);
      }

      pdf.save("converted_images.pdf");
    } catch (e) {
      console.error(e);
      alert("Failed to create PDF. Please try again.");
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
            border: `2px dashed ${images.length > 0 ? PDF_BRAND.accent : BRAND.border}`, 
            borderRadius: 16, 
            padding: 40, 
            textAlign: "center", 
            cursor: "pointer",
            background: images.length > 0 ? `${PDF_BRAND.accent}05` : "transparent"
          }}
        >
          <input type="file" ref={fileInputRef} onChange={handleFiles} accept="image/*" multiple style={{ display: "none" }} />
          <div style={{ fontSize: 32, marginBottom: 12 }}>🖼️</div>
          <h3 style={{ color: "white", marginBottom: 4 }}>Add Images</h3>
          <p style={{ color: BRAND.textSecondary, fontSize: 13 }}>Perfect for scanning documents, IDs, or assignments</p>
        </div>

        {images.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 12, marginBottom: 32 }}>
              {images.map((img, idx) => (
                <div key={img.id} style={{ position: "relative", aspectRatio: "1/1", borderRadius: 8, overflow: "hidden", border: `1px solid ${BRAND.border}` }}>
                  <img src={img.src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.6)", color: "white", fontSize: 10, padding: 4, textAlign: "center" }}>Page {idx + 1}</div>
                  <button onClick={(e) => { e.stopPropagation(); removeImage(img.id); }} style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.8)", border: "none", color: "white", width: 20, height: 20, borderRadius: "50%", cursor: "pointer", fontSize: 12 }}>✕</button>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 32 }}>
              <div>
                <label style={{ fontSize: 12, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Page Size</label>
                <select value={options.pageSize} onChange={e => setOptions({...options, pageSize: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, background: "#1a1a1a", color: "white", border: `1px solid ${BRAND.border}` }}>
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Orientation</label>
                <select value={options.orientation} onChange={e => setOptions({...options, orientation: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, background: "#1a1a1a", color: "white", border: `1px solid ${BRAND.border}` }}>
                  <option value="p">Portrait</option>
                  <option value="l">Landscape</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Margin (mm)</label>
                <select value={options.margin} onChange={e => setOptions({...options, margin: parseInt(e.target.value)})} style={{ width: "100%", padding: 10, borderRadius: 8, background: "#1a1a1a", color: "white", border: `1px solid ${BRAND.border}` }}>
                  <option value="0">None</option>
                  <option value="5">Small (5mm)</option>
                  <option value="10">Normal (10mm)</option>
                </select>
              </div>
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
                cursor: "pointer"
              }}
            >
              {processing ? "Generating PDF..." : `Convert ${images.length} Images to PDF →`}
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: 40, padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.02)", border: `1px solid ${BRAND.border}` }}>
        <h4 style={{ color: "white", marginBottom: 12 }}>💡 Student Tip</h4>
        <p style={{ color: BRAND.textSecondary, fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          Perfect for submitting scanned documents, mark sheets, ID proof, or phone-clicked assignments to college portals. Use "Normal" margin for a professional look.
        </p>
      </div>
    </div>
  );
}
