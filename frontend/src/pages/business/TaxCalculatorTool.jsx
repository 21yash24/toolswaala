import React, { useState } from "react";
import { BRAND, formatINR } from "../../shared/constants";

export default function TaxCalculatorTool() {
  const [income, setIncome] = useState(1200000);
  const [deductions, setDeductions] = useState(150000);

  const calculateNewRegime = (totalIncome) => {
    let tax = 0;
    if (totalIncome <= 300000) return 0;
    if (totalIncome > 300000) tax += Math.min(300000, totalIncome - 300000) * 0.05;
    if (totalIncome > 600000) tax += Math.min(300000, totalIncome - 600000) * 0.10;
    if (totalIncome > 900000) tax += Math.min(300000, totalIncome - 900000) * 0.15;
    if (totalIncome > 1200000) tax += Math.min(300000, totalIncome - 1200000) * 0.20;
    if (totalIncome > 1500000) tax += (totalIncome - 1500000) * 0.30;
    return tax;
  };

  const calculateOldRegime = (totalIncome, d) => {
    const taxable = Math.max(0, totalIncome - d - 50000); // Standard deduction 50k
    let tax = 0;
    if (taxable <= 250000) return 0;
    if (taxable > 250000) tax += Math.min(250000, taxable - 250000) * 0.05;
    if (taxable > 500000) tax += Math.min(500000, taxable - 500000) * 0.20;
    if (taxable > 1000000) tax += (taxable - 1000000) * 0.30;
    return tax;
  };

  const newTax = calculateNewRegime(income);
  const oldTax = calculateOldRegime(income, deductions);

  return (
    <div className="grid-2 fade-in">
      <div className="glass-card">
        <div className="form-group"><label>Annual Gross Income (₹)</label><input type="number" value={income} onChange={e => setIncome(+e.target.value)} /></div>
        <div className="form-group"><label>Total Deductions (80C, 80D, etc. - for Old Regime)</label><input type="number" value={deductions} onChange={e => setDeductions(+e.target.value)} /></div>
        <div style={{ marginTop: 24, padding: 16, background: "rgba(255,107,0,0.05)", borderRadius: 12, border: "1px solid rgba(255,107,0,0.2)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.primary }}>💡 Tip</div>
          <div style={{ fontSize: 12, color: BRAND.textSecondary }}>New Tax Regime (FY 2024-25) now includes a standard deduction of ₹75,000.</div>
        </div>
      </div>
      <div className="grid-2" style={{ gap: 16 }}>
        <div className="result-box" style={{ borderColor: newTax <= oldTax ? BRAND.success : BRAND.border }}>
          <div style={{ fontSize: 12, color: BRAND.textSecondary }}>New Regime</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: BRAND.text }}>{formatINR(newTax)}</div>
          {newTax <= oldTax && <div className="badge-green" style={{ marginTop: 8, display: "inline-block" }}>Cheaper</div>}
        </div>
        <div className="result-box" style={{ borderColor: oldTax < newTax ? BRAND.success : BRAND.border }}>
          <div style={{ fontSize: 12, color: BRAND.textSecondary }}>Old Regime</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: BRAND.text }}>{formatINR(oldTax)}</div>
          {oldTax < newTax && <div className="badge-green" style={{ marginTop: 8, display: "inline-block" }}>Cheaper</div>}
        </div>
      </div>
    </div>
  );
}
