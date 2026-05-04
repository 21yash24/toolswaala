import React, { useState } from "react";
import { BRAND, formatINR } from "../../shared/constants";

export default function FdCalculatorTool() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);

  // Compound interest formula: A = P(1 + r/n)^nt
  // Assuming quarterly compounding (n=4) as per Indian banks standard
  const n = 4;
  const t = years;
  const r = rate / 100;
  const maturityValue = amount * Math.pow(1 + r / n, n * t);
  const interest = maturityValue - amount;

  return (
    <div className="grid-2 fade-in">
      <div className="glass-card">
        <div className="form-group"><label>Principal Amount (₹)</label><input type="number" value={amount} onChange={e => setAmount(+e.target.value)} /></div>
        <div className="form-group"><label>Interest Rate (% p.a)</label><input type="number" value={rate} onChange={e => setRate(+e.target.value)} step="0.1" /></div>
        <div className="form-group"><label>Tenure (Years)</label><input type="number" value={years} onChange={e => setYears(+e.target.value)} /></div>
      </div>
      <div className="result-box" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 12, color: BRAND.textSecondary }}>Maturity Value</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: BRAND.primary, margin: "12px 0" }}>{formatINR(maturityValue)}</div>
          
          <div className="divider"></div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, textAlign: "left", marginTop: 24 }}>
            <div>
              <div style={{ fontSize: 11, color: BRAND.textSecondary }}>Total Interest</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{formatINR(interest)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: BRAND.textSecondary }}>Principal</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{formatINR(amount)}</div>
            </div>
          </div>
          
          <p style={{ marginTop: 24, fontSize: 11, color: BRAND.textSecondary }}>Note: Calculation assumes quarterly compounding as per standard bank FD policies.</p>
        </div>
      </div>
    </div>
  );
}
