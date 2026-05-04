import React, { useState } from "react";
import { BRAND, formatINR } from "../../shared/constants";

export default function EmiTool() {
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(9.5);
  const [tenure, setTenure] = useState(60);
  
  const monthlyRate = rate / (12 * 100);
  const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
  const totalPayment = emi * tenure;
  const totalInterest = totalPayment - amount;

  return (
    <div className="grid-2">
      <div className="glass-card">
        <div className="form-group">
          <label style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Principal Amount</span>
            <span style={{ color: BRAND.primary, fontWeight: 700 }}>{formatINR(amount)}</span>
          </label>
          <input type="range" min="50000" max="10000000" step="50000" value={amount} onChange={e => setAmount(+e.target.value)} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: BRAND.textSecondary, marginTop: 4 }}>
            <span>50K</span>
            <span>1 Cr</span>
          </div>
        </div>

        <div className="form-group">
          <label style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Interest Rate (p.a)</span>
            <span style={{ color: BRAND.primary, fontWeight: 700 }}>{rate}%</span>
          </label>
          <input type="range" min="5" max="30" step="0.1" value={rate} onChange={e => setRate(+e.target.value)} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: BRAND.textSecondary, marginTop: 4 }}>
            <span>5%</span>
            <span>30%</span>
          </div>
        </div>

        <div className="form-group">
          <label style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Tenure (Months)</span>
            <span style={{ color: BRAND.primary, fontWeight: 700 }}>{tenure} Mo ({Math.floor(tenure/12)}y {tenure%12}m)</span>
          </label>
          <input type="range" min="6" max="360" value={tenure} onChange={e => setTenure(+e.target.value)} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: BRAND.textSecondary, marginTop: 4 }}>
            <span>6m</span>
            <span>30y</span>
          </div>
        </div>
      </div>

      <div className="result-box" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 14, color: BRAND.textSecondary, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Monthly EMI</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: BRAND.primary, marginBottom: 24 }}>{formatINR(emi)}</div>
          
          <div className="divider"></div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, textAlign: "left", marginTop: 24 }}>
            <div className="stat-card" style={{ padding: 12 }}>
              <div style={{ fontSize: 10, color: BRAND.textSecondary }}>Total Interest</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: BRAND.text }}>{formatINR(totalInterest)}</div>
            </div>
            <div className="stat-card" style={{ padding: 12 }}>
              <div style={{ fontSize: 10, color: BRAND.textSecondary }}>Total Payable</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: BRAND.text }}>{formatINR(totalPayment)}</div>
            </div>
          </div>

          <button 
            onClick={() => {
              const text = `🏦 Loan EMI Calculation:\n\nPrincipal: ${formatINR(amount)}\nInterest: ${rate}%\nTenure: ${tenure} Months\n---\nMonthly EMI: ${formatINR(emi)}\nTotal Interest: ${formatINR(totalInterest)}\nTotal Payable: ${formatINR(totalPayment)}\n\nCheck yours at: ${window.location.href}`;
              navigator.clipboard.writeText(text);
              alert("Summary copied to clipboard!");
            }}
            className="btn-primary" 
            style={{ width: "100%", marginTop: 24 }}
          >
            📋 Copy Summary
          </button>
        </div>
      </div>
    </div>
  );
}
