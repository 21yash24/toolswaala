import React, { useState } from "react";
import { BRAND, formatINR } from "../../shared/constants";

export default function GstCalculatorTool() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState(18);
  const [isInclusive, setIsInclusive] = useState(false);

  const calculate = () => {
    const val = parseFloat(amount) || 0;
    let net, tax, total;
    if (isInclusive) {
      total = val;
      net = total / (1 + rate / 100);
      tax = total - net;
    } else {
      net = val;
      tax = (net * rate) / 100;
      total = net + tax;
    }
    return { net, tax, total };
  };

  const res = calculate();

  return (
    <div className="grid-2 fade-in">
      <div className="glass-card">
        <div className="form-group"><label>Amount (₹)</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" /></div>
        <div className="form-group">
          <label>GST Rate</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
            {[0, 5, 12, 18, 28].map(r => (
              <button key={r} onClick={() => setRate(r)} className={rate === r ? "btn-primary" : "btn-secondary"} style={{ padding: "10px 0" }}>{r}%</button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Calculation Type</label>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setIsInclusive(false)} className={!isInclusive ? "btn-primary" : "btn-secondary"} style={{ flex: 1 }}>Exclusive</button>
            <button onClick={() => setIsInclusive(true)} className={isInclusive ? "btn-primary" : "btn-secondary"} style={{ flex: 1 }}>Inclusive</button>
          </div>
        </div>
      </div>
      <div className="result-box" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 12, color: BRAND.textSecondary }}>GST Amount ({rate}%)</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: BRAND.primary, margin: "16px 0" }}>{formatINR(res.tax)}</div>
          
          <div className="divider"></div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, textAlign: "left", marginTop: 24 }}>
            <div>
              <div style={{ fontSize: 11, color: BRAND.textSecondary }}>Net Amount</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{formatINR(res.net)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: BRAND.textSecondary }}>Gross Total</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{formatINR(res.total)}</div>
            </div>
          </div>
          
          <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
             <div style={{ padding: 10, background: "rgba(0,0,0,0.1)", borderRadius: 8 }}>
               <div style={{ fontSize: 10, color: BRAND.textSecondary }}>CGST ({rate/2}%)</div>
               <div style={{ fontWeight: 700 }}>{formatINR(res.tax/2)}</div>
             </div>
             <div style={{ padding: 10, background: "rgba(0,0,0,0.1)", borderRadius: 8 }}>
               <div style={{ fontSize: 10, color: BRAND.textSecondary }}>SGST ({rate/2}%)</div>
               <div style={{ fontWeight: 700 }}>{formatINR(res.tax/2)}</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
