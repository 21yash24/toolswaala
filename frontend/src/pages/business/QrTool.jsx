import React, { useState, useEffect, useRef } from "react";
import { BRAND } from "../../shared/constants";

export default function QrTool() {
  const [input, setInput] = useState("https://toolswaala.in");
  const [options, setOptions] = useState({
    width: 300,
    height: 300,
    type: "svg",
    data: "https://toolswaala.in",
    margin: 10,
    qrOptions: { typeNumber: 0, mode: "Byte", errorCorrectionLevel: "Q" },
    imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 10, crossOrigin: "anonymous" },
    dotsOptions: { color: "#FF6B00", type: "rounded" },
    backgroundOptions: { color: "#ffffff" },
    cornersSquareOptions: { color: "#FF6B00", type: "extra-rounded" },
    cornersDotOptions: { color: "#FF6B00", type: "dot" }
  });
  const [qrCode, setQrCode] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (window.QRCodeStyling) {
      const qr = new window.QRCodeStyling(options);
      setQrCode(qr);
      if (ref.current) {
        qr.append(ref.current);
      }
    }
  }, []);

  useEffect(() => {
    if (!qrCode) return;
    qrCode.update({
      ...options,
      data: input || "https://toolswaala.in"
    });
  }, [input, options, qrCode]);

  const onDownload = () => {
    if (!qrCode) return;
    qrCode.download({ name: "toolswaala-qr", extension: "png" });
  };

  return (
    <div className="grid-2">
      <div className="glass-card">
        <div className="form-group">
          <label>QR Data (Link, UPI, etc.)</label>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="https://example.com" />
        </div>
        
        <div className="divider" style={{ margin: "16px 0" }}></div>
        
        <h3 style={{ fontSize: 14, marginBottom: 16 }}>Design Settings</h3>
        
        <div className="form-group">
          <label>Dot Style</label>
          <select value={options.dotsOptions.type} onChange={e => setOptions(p => ({ ...p, dotsOptions: { ...p.dotsOptions, type: e.target.value } }))}>
            <option value="square">Square</option>
            <option value="dots">Dots</option>
            <option value="rounded">Rounded</option>
            <option value="extra-rounded">Extra Rounded</option>
            <option value="classy">Classy</option>
            <option value="classy-rounded">Classy Rounded</option>
          </select>
        </div>

        <div className="grid-2" style={{ gap: 12 }}>
          <div className="form-group">
            <label>QR Color</label>
            <input type="color" value={options.dotsOptions.color} onChange={e => {
              const color = e.target.value;
              setOptions(p => ({ 
                ...p, 
                dotsOptions: { ...p.dotsOptions, color },
                cornersSquareOptions: { ...p.cornersSquareOptions, color },
                cornersDotOptions: { ...p.cornersDotOptions, color }
              }));
            }} />
          </div>
          <div className="form-group">
            <label>Background</label>
            <input type="color" value={options.backgroundOptions.color} onChange={e => setOptions(p => ({ ...p, backgroundOptions: { ...p.backgroundOptions, color: e.target.value } }))} />
          </div>
        </div>

        <div className="form-group">
          <label>Corner Shape</label>
          <select value={options.cornersSquareOptions.type} onChange={e => setOptions(p => ({ ...p, cornersSquareOptions: { ...p.cornersSquareOptions, type: e.target.value } }))}>
            <option value="square">Square</option>
            <option value="dot">Dot</option>
            <option value="extra-rounded">Rounded</option>
          </select>
        </div>

        <button className="btn-primary" style={{ width: "100%", marginTop: 10 }} onClick={onDownload}>Download PNG</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div className="glass-card" style={{ padding: 20, background: options.backgroundOptions.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div ref={ref} />
        </div>
        <p style={{ marginTop: 16, fontSize: 12, color: BRAND.textSecondary, textAlign: "center" }}>
          Scan to test scannability. <br/> Works with all QR readers.
        </p>
      </div>
    </div>
  );
}
