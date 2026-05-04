import React, { useState } from "react";
import { BRAND, formatINR, today } from "../../shared/constants";

export default function ReceiptMakerTool() {
  const [data, setData] = useState({
    receiptNo: "TW-1001",
    date: today(),
    receivedFrom: "",
    amount: "",
    for: "",
    paymentMode: "UPI",
    receivedBy: ""
  });
  const [preview, setPreview] = useState(false);

  return (
    <div>
      {!preview ? (
        <div className="grid-2 fade-in">
          <div className="glass-card">
            <div className="form-group"><label>Receipt No</label><input value={data.receiptNo} onChange={e => setData({...data, receiptNo: e.target.value})} /></div>
            <div className="form-group"><label>Received From</label><input value={data.receivedFrom} onChange={e => setData({...data, receivedFrom: e.target.value})} placeholder="Customer Name" /></div>
            <div className="form-group"><label>Amount Received (₹)</label><input type="number" value={data.amount} onChange={e => setData({...data, amount: e.target.value})} /></div>
            <div className="form-group"><label>Payment Mode</label><select value={data.paymentMode} onChange={e => setData({...data, paymentMode: e.target.value})}><option>UPI</option><option>Cash</option><option>Bank Transfer</option><option>Cheque</option></select></div>
          </div>
          <div className="glass-card">
            <div className="form-group"><label>Being Payment For</label><input value={data.for} onChange={e => setData({...data, for: e.target.value})} placeholder="e.g. Website Development" /></div>
            <div className="form-group"><label>Received By</label><input value={data.receivedBy} onChange={e => setData({...data, receivedBy: e.target.value})} placeholder="Your Name/Company" /></div>
            <button className="btn-primary" style={{ width: "100%", marginTop: 24 }} onClick={() => setPreview(true)}>✨ Generate Receipt</button>
          </div>
        </div>
      ) : (
        <div className="fade-in">
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <button className="btn-secondary" onClick={() => setPreview(false)}>← Edit</button>
            <button className="btn-primary" onClick={() => window.print()}>🖨️ Print Receipt</button>
          </div>
          <div style={{ background: "white", color: "black", padding: 60, borderRadius: 8, maxWidth: 800, margin: "0 auto", border: "2px solid #333", position: "relative" }} className="printable">
             <div style={{ position: "absolute", top: 20, right: 20, fontSize: 12, color: "#999" }}>{data.receiptNo}</div>
             <h2 style={{ textAlign: "center", borderBottom: "2px solid #333", paddingBottom: 10 }}>PAYMENT RECEIPT</h2>
             <div style={{ marginTop: 40, fontSize: 18, lineHeight: 2.5 }}>
               Received with thanks from <strong>{data.receivedFrom || "_________________"}</strong>,<br/>
               the sum of <strong>{formatINR(data.amount) || "_________________"}</strong>,<br/>
               being payment for <strong>{data.for || "_________________"}</strong>,<br/>
               via <strong>{data.paymentMode}</strong>.
             </div>
             <div style={{ marginTop: 60, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
               <div>Date: <strong>{data.date}</strong></div>
               <div style={{ textAlign: "center" }}>
                 <div style={{ borderBottom: "1px solid #333", width: 150 }}></div>
                 <div style={{ fontSize: 14, marginTop: 5 }}>Authorised Signatory ({data.receivedBy})</div>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
