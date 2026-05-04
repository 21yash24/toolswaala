import React, { useState, useEffect, useRef } from "react";
import { BRAND, formatINR } from "../../shared/constants";

export default function UpiPaymentTool() {
  const [data, setData] = useState({
    vpa: "",
    name: "",
    amount: "",
    note: ""
  });
  const [showPage, setShowPage] = useState(false);
  const qrRef = useRef(null);

  useEffect(() => {
    if (showPage && window.QRCodeStyling) {
      const upiUrl = `upi://pay?pa=${data.vpa}&pn=${encodeURIComponent(data.name)}&am=${data.amount}&tn=${encodeURIComponent(data.note)}&cu=INR`;
      const qr = new window.QRCodeStyling({
        width: 240,
        height: 240,
        data: upiUrl,
        dotsOptions: { color: "#4CAF50", type: "rounded" },
        cornersSquareOptions: { type: "extra-rounded" },
        backgroundOptions: { color: "#ffffff" }
      });
      if (qrRef.current) {
        qrRef.current.innerHTML = "";
        qr.append(qrRef.current);
      }
    }
  }, [showPage, data]);

  return (
    <div className="fade-in">
      {!showPage ? (
        <div className="glass-card" style={{ maxWidth: 500, margin: "0 auto" }}>
          <div className="form-group"><label>Your UPI ID (VPA)</label><input value={data.vpa} onChange={e => setData({...data, vpa: e.target.value})} placeholder="e.g. yourname@okaxis" /></div>
          <div className="form-group"><label>Display Name</label><input value={data.name} onChange={e => setData({...data, name: e.target.value})} placeholder="Your Name or Business" /></div>
          <div className="form-group"><label>Default Amount (Optional)</label><input type="number" value={data.amount} onChange={e => setData({...data, amount: e.target.value})} /></div>
          <div className="form-group"><label>Purpose/Note (Optional)</label><input value={data.note} onChange={e => setData({...data, note: e.target.value})} placeholder="e.g. Consulting Fees" /></div>
          <button className="btn-primary" style={{ width: "100%", marginTop: 10 }} onClick={() => setShowPage(true)}>🚀 Create Payment Page</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "60vh", justifyContent: "center" }}>
          <button className="btn-secondary" style={{ marginBottom: 40 }} onClick={() => setShowPage(false)}>← Back to Setup</button>
          
          <div className="glass-card" style={{ width: "100%", maxWidth: 360, padding: 32, textAlign: "center", background: "white", color: "black" }}>
             <div style={{ fontWeight: 800, fontSize: 14, color: "#666", marginBottom: 20 }}>SCAN TO PAY</div>
             <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
               <div ref={qrRef} />
             </div>
             <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>{formatINR(data.amount)}</div>
             <div style={{ fontSize: 16, fontWeight: 700 }}>{data.name}</div>
             <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{data.vpa}</div>
             
             <div style={{ marginTop: 32, display: "flex", justifyContent: "center", gap: 12 }}>
               <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" height="20" alt="UPI" />
             </div>
          </div>
          
          <div style={{ marginTop: 40, textAlign: "center" }}>
            <button className="btn-primary" onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied! Send this to your clients.");
            }}>🔗 Copy Shareable Link</button>
          </div>
        </div>
      )}
    </div>
  );
}
