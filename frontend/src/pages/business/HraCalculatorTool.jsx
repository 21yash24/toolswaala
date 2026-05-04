import React, { useState } from "react";
import { BRAND, formatINR } from "../../shared/constants";

export default function HraCalculatorTool() {
  const [basic, setBasic] = useState(50000);
  const [da, setDa] = useState(0);
  const [hraReceived, setHraReceived] = useState(20000);
  const [rentPaid, setRentPaid] = useState(15000);
  const [isMetro, setIsMetro] = useState(true);

  const salary = basic + da;
  const cond1 = hraReceived;
  const cond2 = Math.max(0, rentPaid - (0.1 * salary));
  const cond3 = isMetro ? (0.5 * salary) : (0.4 * salary);
  
  const exemptHra = Math.min(cond1, cond2, cond3);
  const taxableHra = Math.max(0, hraReceived - exemptHra);

  return (
    <div className="grid-2 fade-in">
      <div className="glass-card">
        <div className="form-group"><label>Monthly Basic Salary (₹)</label><input type="number" value={basic} onChange={e => setBasic(+e.target.value)} /></div>
        <div className="form-group"><label>Monthly HRA Received (₹)</label><input type="number" value={hraReceived} onChange={e => setHraReceived(+e.target.value)} /></div>
        <div className="form-group"><label>Monthly Rent Paid (₹)</label><input type="number" value={rentPaid} onChange={e => setRentPaid(+e.target.value)} /></div>
        <div className="form-group">
          <label>City Category</label>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setIsMetro(true)} className={isMetro ? "btn-primary" : "btn-secondary"} style={{ flex: 1 }}>Metro</button>
            <button onClick={() => setIsMetro(false)} className={!isMetro ? "btn-primary" : "btn-secondary"} style={{ flex: 1 }}>Non-Metro</button>
          </div>
          <p style={{ fontSize: 10, color: BRAND.textSecondary, marginTop: 8 }}>Metro: Delhi, Mumbai, Kolkata, Chennai</p>
        </div>
      </div>
      <div className="result-box" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 12, color: BRAND.textSecondary, textTransform: "uppercase" }}>Exempt HRA (Tax Free)</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: BRAND.success, margin: "12px 0" }}>{formatINR(exemptHra)}</div>
          
          <div className="divider"></div>
          
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 12, color: BRAND.textSecondary }}>Taxable HRA Component</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: BRAND.danger }}>{formatINR(taxableHra)}</div>
          </div>
          
          <div style={{ marginTop: 24, padding: 12, background: "rgba(0,0,0,0.1)", borderRadius: 8, fontSize: 11, textAlign: "left" }}>
            <p style={{ margin: "4px 0" }}>• Actual HRA: {formatINR(cond1)}</p>
            <p style={{ margin: "4px 0" }}>• Rent - 10% Salary: {formatINR(cond2)}</p>
            <p style={{ margin: "4px 0" }}>• {isMetro ? "50%" : "40%"} of Salary: {formatINR(cond3)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
