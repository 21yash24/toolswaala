import { useState, useRef, useEffect } from "react";
import { BRAND, PDF_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };

const PRESETS = [
  { name: "General", width: null, height: null, maxSize: 500, label: "Custom" },
  { name: "NEET/JEE Photo", width: 200, height: 230, maxSize: 40, label: "Passport (40KB)" },
  { name: "NEET/JEE Sign", width: 140, height: 60, maxSize: 30, label: "Signature (30KB)" },
  { name: "UPSC Photo", width: 350, height: 350, maxSize: 300, label: "UPSC (300KB)" },
  { name: "Passport Photo", width: 600, height: 600, maxSize: 100, label: "Standard (100KB)" },
];

export default function ImageCompressor() {
  const [file, setFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [compressedUrl, setCompressedUrl] = useState("");
  const [settings, setSettings] = useState({ quality: 0.8, width: null, height: null, targetSize: 50 });
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      setOriginalUrl(URL.createObjectURL(f));
      setResult(null);
    }
  };

  const compressImage = async () => {
    if (!file) return;
    
    const img = new Image();
    img.src = originalUrl;
    await new Promise(resolve => img.onload = resolve);

    const canvas = document.createElement("canvas");
    let width = settings.width || img.width;
    let height = settings.height || img.height;

    // Maintain aspect ratio if only one dimension is fixed
    if (settings.width && !settings.height) {
      height = (img.height * settings.width) / img.width;
    } else if (settings.height && !settings.width) {
      width = (img.width * settings.height) / img.height;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    // Iterative quality adjustment for target size
    let currentQuality = settings.quality;
    let blob = await new Promise(res => canvas.toBlob(res, "image/jpeg", currentQuality));
    
    // Simple iteration to hit target size if specified
    if (settings.targetSize) {
      const targetBytes = settings.targetSize * 1024;
      if (blob.size > targetBytes) {
        for (let q = currentQuality; q > 0.1; q -= 0.1) {
          blob = await new Promise(res => canvas.toBlob(res, "image/jpeg", q));
          if (blob.size <= targetBytes) {
            currentQuality = q;
            break;
          }
        }
      }
    }

    setCompressedUrl(URL.createObjectURL(blob));
    setResult({
      size: blob.size,
      width,
      height,
      blob
    });
  };

  const applyPreset = (p) => {
    setSettings({ ...settings, width: p.width, height: p.height, targetSize: p.maxSize });
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = compressedUrl;
    a.download = `compressed_${file.name.split(".")[0]}.jpg`;
    a.click();
  };

  return (
    <div className="fade-in">
      <div style={cs}>
        {!file ? (
          <div 
            onClick={() => fileInputRef.current.click()}
            style={{ border: `2px dashed ${BRAND.border}`, borderRadius: 16, padding: 60, textAlign: "center", cursor: "pointer" }}
          >
            <input type="file" ref={fileInputRef} onChange={handleFile} accept="image/*" style={{ display: "none" }} />
            <div style={{ fontSize: 48, marginBottom: 16 }}>🖼️</div>
            <h3 style={{ color: BRAND.text }}>Select Photo or Signature</h3>
            <p style={{ color: BRAND.textSecondary }}>Recommended for NEET, JEE, UPSC, and CUET portals</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: 32 }}>
            <div>
              <div style={{ display: "flex", gap: 12, overflowX: "auto", marginBottom: 24, paddingBottom: 8 }}>
                {PRESETS.map(p => (
                  <button key={p.name} onClick={() => applyPreset(p)} style={{ padding: "10px 16px", borderRadius: 10, background: settings.targetSize === p.maxSize ? PDF_BRAND.accent : "rgba(255,255,255,0.05)", color: "white", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{p.label}</button>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{ fontSize: 12, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Max Size (KB)</label>
                  <input type="number" value={settings.targetSize} onChange={e => setSettings({...settings, targetSize: parseInt(e.target.value)})} style={{ width: "100%", padding: 12, borderRadius: 8, background: BRAND.surfaceCard, border: `1px solid ${BRAND.border}`, color: BRAND.text }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Max Width (px)</label>
                  <input type="number" value={settings.width || ""} onChange={e => setSettings({...settings, width: parseInt(e.target.value) || null})} placeholder="Original" style={{ width: "100%", padding: 12, borderRadius: 8, background: BRAND.surfaceCard, border: `1px solid ${BRAND.border}`, color: BRAND.text }} />
                </div>
              </div>

              <button onClick={compressImage} style={{ width: "100%", padding: "16px", borderRadius: 12, background: PDF_BRAND.accent, color: "white", border: "none", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>Compress Image →</button>

              {result && (
                <div style={{ marginTop: 24, padding: 20, borderRadius: 12, background: "rgba(76, 175, 80, 0.1)", border: "1px solid rgba(76, 175, 80, 0.2)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#81C784" }}>Ready to Download</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: BRAND.text }}>{(result.size / 1024).toFixed(1)} KB</div>
                    </div>
                    <button onClick={download} style={{ padding: "10px 20px", borderRadius: 8, background: "#4CAF50", color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}>Download ↓</button>
                  </div>
                </div>
              )}
            </div>

            <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 16, padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 12, color: BRAND.textSecondary, marginBottom: 12 }}>Preview</div>
              <div style={{ position: "relative", display: "inline-block" }}>
                <img src={result ? compressedUrl : originalUrl} style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 4, border: "2px solid #333" }} />
                {result && <div style={{ position: "absolute", top: 8, right: 8, background: "#4CAF50", color: "white", fontSize: 10, padding: "4px 8px", borderRadius: 4, fontWeight: 700 }}>COMPRESSED</div>}
              </div>
              <div style={{ fontSize: 11, color: BRAND.textSecondary, marginTop: 12 }}>{result ? `${result.width} x ${result.height}` : "Original"}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
