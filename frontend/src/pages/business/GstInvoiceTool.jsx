import React, { useState } from "react";
import { BRAND, formatINR, today } from "../../shared/constants";

export default function GstInvoiceTool() {
  const [items, setItems] = useState([{ desc: "", qty: 1, rate: 0, gst: 18 }]);
  const [seller, setSeller] = useState({ name: "", address: "", gst: "" });
  const [buyer, setBuyer] = useState({ name: "", address: "", gst: "" });
  const [invoiceNo, setInvoiceNo] = useState("TW-" + Math.floor(Math.random()*9000+1000));
  const [preview, setPreview] = useState(false);

  const addItem = () => setItems([...items, { desc: "", qty: 1, rate: 0, gst: 18 }]);
  
  const calculateTotal = () => {
    let subtotal = 0, tax = 0;
    items.forEach(item => {
      const lineTotal = item.qty * item.rate;
      subtotal += lineTotal;
      tax += (lineTotal * item.gst) / 100;
    });
    return { subtotal, tax, total: subtotal + tax };
  };

  const totals = calculateTotal();

  return (
    <div>
      {!preview ? (
        <div className="fade-in">
          <div className="grid-2" style={{ marginBottom: 24 }}>
            <div className="glass-card">
              <h3>Seller Details (From)</h3>
              <div className="form-group"><label>Business Name</label><input value={seller.name} onChange={e => setSeller({...seller, name: e.target.value})} /></div>
              <div className="form-group"><label>GSTIN</label><input value={seller.gst} onChange={e => setSeller({...seller, gst: e.target.value.toUpperCase()})} /></div>
              <div className="form-group"><label>Address</label><textarea value={seller.address} onChange={e => setSeller({...seller, address: e.target.value})} /></div>
            </div>
            <div className="glass-card">
              <h3>Buyer Details (To)</h3>
              <div className="form-group"><label>Customer Name</label><input value={buyer.name} onChange={e => setBuyer({...buyer, name: e.target.value})} /></div>
              <div className="form-group"><label>Customer GSTIN (Optional)</label><input value={buyer.gst} onChange={e => setBuyer({...buyer, gst: e.target.value.toUpperCase()})} /></div>
              <div className="form-group"><label>Billing Address</label><textarea value={buyer.address} onChange={e => setBuyer({...buyer, address: e.target.value})} /></div>
            </div>
          </div>

          <div className="glass-card" style={{ marginBottom: 24 }}>
             <h3>Invoice Items</h3>
             {items.map((item, idx) => (
               <div key={idx} className="grid-4" style={{ gap: 10, marginBottom: 12 }}>
                 <div className="form-group" style={{ gridColumn: "span 2" }}><input placeholder="Item Description" value={item.desc} onChange={e => {
                   const newItems = [...items];
                   newItems[idx].desc = e.target.value;
                   setItems(newItems);
                 }} /></div>
                 <div className="form-group"><input type="number" placeholder="Rate" value={item.rate} onChange={e => {
                   const newItems = [...items];
                   newItems[idx].rate = +e.target.value;
                   setItems(newItems);
                 }} /></div>
                 <div className="form-group"><select value={item.gst} onChange={e => {
                   const newItems = [...items];
                   newItems[idx].gst = +e.target.value;
                   setItems(newItems);
                 }}><option value="0">0%</option><option value="5">5%</option><option value="12">12%</option><option value="18">18%</option><option value="28">28%</option></select></div>
               </div>
             ))}
             <button onClick={addItem} className="btn-secondary" style={{ marginTop: 10 }}>+ Add Another Item</button>
          </div>

          <button className="btn-primary" style={{ width: "100%", padding: 16, fontSize: 16 }} onClick={() => setPreview(true)}>✨ Generate Professional Invoice</button>
        </div>
      ) : (
        <div className="fade-in">
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <button className="btn-secondary" onClick={() => setPreview(false)}>← Back to Edit</button>
            <button className="btn-primary" onClick={() => window.print()}>🖨️ Download / Print PDF</button>
          </div>
          
          <div style={{ background: "white", color: "black", padding: 60, borderRadius: 8, boxShadow: "0 10px 40px rgba(0,0,0,0.2)", maxWidth: 900, margin: "0 auto" }} className="printable">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 60 }}>
               <div>
                 <h1 style={{ fontSize: 42, color: "#333", margin: 0 }}>TAX INVOICE</h1>
                 <p style={{ color: "#666" }}>#{invoiceNo}</p>
               </div>
               <div style={{ textAlign: "right" }}>
                 <div style={{ fontSize: 24, fontWeight: 900, color: BRAND.primary }}>ToolsWaala</div>
                 <p style={{ margin: 0 }}>Date: {today()}</p>
               </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, marginBottom: 60 }}>
               <div>
                 <p style={{ color: "#999", textTransform: "uppercase", fontSize: 12, fontWeight: 700, margin: "0 0 10px 0" }}>Billed By</p>
                 <div style={{ fontWeight: 800, fontSize: 18 }}>{seller.name || "Your Company Name"}</div>
                 <p style={{ margin: "5px 0" }}>{seller.address || "Your Address"}</p>
                 <p style={{ fontWeight: 700 }}>GSTIN: {seller.gst || "NOT PROVIDED"}</p>
               </div>
               <div>
                 <p style={{ color: "#999", textTransform: "uppercase", fontSize: 12, fontWeight: 700, margin: "0 0 10px 0" }}>Billed To</p>
                 <div style={{ fontWeight: 800, fontSize: 18 }}>{buyer.name || "Customer Name"}</div>
                 <p style={{ margin: "5px 0" }}>{buyer.address || "Customer Address"}</p>
                 <p style={{ fontWeight: 700 }}>GSTIN: {buyer.gst || "NOT PROVIDED"}</p>
               </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 40 }}>
               <thead>
                 <tr style={{ background: "#f8f8f8", borderBottom: "2px solid #eee" }}>
                   <th style={{ textAlign: "left", padding: 15 }}>Description</th>
                   <th style={{ textAlign: "right", padding: 15 }}>Qty</th>
                   <th style={{ textAlign: "right", padding: 15 }}>Rate</th>
                   <th style={{ textAlign: "right", padding: 15 }}>GST</th>
                   <th style={{ textAlign: "right", padding: 15 }}>Total</th>
                 </tr>
               </thead>
               <tbody>
                 {items.map((item, i) => (
                   <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                     <td style={{ padding: 15 }}>{item.desc || "Item Description"}</td>
                     <td style={{ textAlign: "right", padding: 15 }}>{item.qty}</td>
                     <td style={{ textAlign: "right", padding: 15 }}>{formatINR(item.rate)}</td>
                     <td style={{ textAlign: "right", padding: 15 }}>{item.gst}%</td>
                     <td style={{ textAlign: "right", padding: 15 }}>{formatINR(item.qty * item.rate * (1 + item.gst/100))}</td>
                   </tr>
                 ))}
               </tbody>
            </table>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
               <div style={{ width: 300 }}>
                 <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                   <span>Subtotal</span>
                   <span>{formatINR(totals.subtotal)}</span>
                 </div>
                 <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                   <span>GST Amount</span>
                   <span>{formatINR(totals.tax)}</span>
                 </div>
                 <div style={{ display: "flex", justifyContent: "space-between", padding: "15px 0", borderTop: "2px solid #333", fontWeight: 900, fontSize: 20 }}>
                   <span>Grand Total</span>
                   <span>{formatINR(totals.total)}</span>
                 </div>
               </div>
            </div>

            <div style={{ marginTop: 80, fontSize: 11, color: "#999", textAlign: "center", borderTop: "1px solid #eee", paddingTop: 20 }}>
               Generated via ToolsWaala.in - Your free business toolkit.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
