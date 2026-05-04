import React, { useState } from "react";
import { BRAND, formatINR, today } from "../../shared/constants";

export default function EstimateGeneratorTool() {
  const [items, setItems] = useState([{ desc: "", qty: 1, rate: 0 }]);
  const [client, setClient] = useState({ name: "", email: "" });
  const [preview, setPreview] = useState(false);

  const addItem = () => setItems([...items, { desc: "", qty: 1, rate: 0 }]);
  
  const total = items.reduce((sum, item) => sum + (item.qty * item.rate), 0);

  return (
    <div>
      {!preview ? (
        <div className="fade-in">
          <div className="glass-card" style={{ marginBottom: 24 }}>
            <h3>Client Details</h3>
            <div className="grid-2">
              <div className="form-group"><label>Client Name</label><input value={client.name} onChange={e => setClient({...client, name: e.target.value})} /></div>
              <div className="form-group"><label>Client Email / Contact</label><input value={client.email} onChange={e => setClient({...client, email: e.target.value})} /></div>
            </div>
          </div>

          <div className="glass-card" style={{ marginBottom: 24 }}>
             <h3>Service / Product Details</h3>
             {items.map((item, idx) => (
               <div key={idx} className="grid-3" style={{ gap: 10, marginBottom: 12 }}>
                 <div className="form-group" style={{ gridColumn: "span 1" }}><input placeholder="Description" value={item.desc} onChange={e => {
                   const newItems = [...items];
                   newItems[idx].desc = e.target.value;
                   setItems(newItems);
                 }} /></div>
                 <div className="form-group"><input type="number" placeholder="Qty" value={item.qty} onChange={e => {
                   const newItems = [...items];
                   newItems[idx].qty = +e.target.value;
                   setItems(newItems);
                 }} /></div>
                 <div className="form-group"><input type="number" placeholder="Rate" value={item.rate} onChange={e => {
                   const newItems = [...items];
                   newItems[idx].rate = +e.target.value;
                   setItems(newItems);
                 }} /></div>
               </div>
             ))}
             <button onClick={addItem} className="btn-secondary" style={{ marginTop: 10 }}>+ Add Line</button>
             
             <div className="result-box" style={{ marginTop: 32, textAlign: "right" }}>
                <div style={{ fontSize: 12, color: BRAND.textSecondary }}>Total Estimate</div>
                <div style={{ fontSize: 32, fontWeight: 900 }}>{formatINR(total)}</div>
             </div>
          </div>

          <button className="btn-primary" style={{ width: "100%", padding: 16 }} onClick={() => setPreview(true)}>✨ Generate Quotation</button>
        </div>
      ) : (
        <div className="fade-in">
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <button className="btn-secondary" onClick={() => setPreview(false)}>← Edit</button>
            <button className="btn-primary" onClick={() => window.print()}>🖨️ Save as PDF</button>
          </div>
          <div style={{ background: "white", color: "black", padding: 60, borderRadius: 8, maxWidth: 800, margin: "0 auto", border: "1px solid #ddd" }} className="printable">
             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 60 }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: BRAND.primary }}>ToolsWaala</div>
                <div style={{ textAlign: "right" }}>
                   <h2 style={{ margin: 0 }}>QUOTATION</h2>
                   <p style={{ color: "#666" }}>Date: {today()}</p>
                </div>
             </div>
             
             <div style={{ marginBottom: 40 }}>
                <p style={{ color: "#999", textTransform: "uppercase", fontSize: 11, fontWeight: 700 }}>Prepared For</p>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{client.name || "Valued Client"}</div>
                <div>{client.email}</div>
             </div>

             <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 40 }}>
                <thead>
                   <tr style={{ borderBottom: "2px solid #333" }}>
                      <th style={{ textAlign: "left", padding: "10px 0" }}>Description</th>
                      <th style={{ textAlign: "right" }}>Qty</th>
                      <th style={{ textAlign: "right" }}>Rate</th>
                      <th style={{ textAlign: "right" }}>Total</th>
                   </tr>
                </thead>
                <tbody>
                   {items.map((item, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                         <td style={{ padding: "15px 0" }}>{item.desc || "Service/Product"}</td>
                         <td style={{ textAlign: "right" }}>{item.qty}</td>
                         <td style={{ textAlign: "right" }}>{formatINR(item.rate)}</td>
                         <td style={{ textAlign: "right" }}>{formatINR(item.qty * item.rate)}</td>
                      </tr>
                   ))}
                </tbody>
             </table>

             <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "2px solid #333", paddingTop: 20 }}>
                <div style={{ textAlign: "right" }}>
                   <div style={{ fontSize: 12, color: "#666" }}>Grand Total</div>
                   <div style={{ fontSize: 28, fontWeight: 900 }}>{formatINR(total)}</div>
                </div>
             </div>

             <div style={{ marginTop: 60, fontSize: 12, color: "#666" }}>
                <p><strong>Terms:</strong></p>
                <ul style={{ paddingLeft: 15 }}>
                   <li>Validity: 15 days from the date of issue.</li>
                   <li>Payment: 50% advance, balance on completion.</li>
                </ul>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
