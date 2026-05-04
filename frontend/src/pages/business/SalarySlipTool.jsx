import React, { useState } from "react";
import { BRAND, formatINR } from "../../shared/constants";

export default function SalarySlipTool() {
  const [basic, setBasic] = useState(50000);
  const [hra, setHra] = useState(20000);
  const [allowance, setAllowance] = useState(10000);
  const [deductions, setDeductions] = useState(5000);
  const [preview, setPreview] = useState(false);

  const totalEarnings = basic + hra + allowance;
  const netSalary = totalEarnings - deductions;

  return (
    <div>
      {!preview ? (
        <div className="grid-2 fade-in">
          <div className="glass-card">
            <h3>Earnings</h3>
            <div className="form-group"><label>Basic Pay (₹)</label><input type="number" value={basic} onChange={e => setBasic(+e.target.value)} /></div>
            <div className="form-group"><label>HRA (₹)</label><input type="number" value={hra} onChange={e => setHra(+e.target.value)} /></div>
            <div className="form-group"><label>Other Allowances (₹)</label><input type="number" value={allowance} onChange={e => setAllowance(+e.target.value)} /></div>
          </div>
          <div className="glass-card">
            <h3>Deductions</h3>
            <div className="form-group"><label>Total Deductions (PF, PT, Tax)</label><input type="number" value={deductions} onChange={e => setDeductions(+e.target.value)} /></div>
            <div className="result-box" style={{ marginTop: 24 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, color: BRAND.textSecondary }}>Net Take-Home</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: BRAND.success }}>{formatINR(netSalary)}</div>
              </div>
            </div>
            <button className="btn-primary" style={{ width: "100%", marginTop: 24 }} onClick={() => setPreview(true)}>🖨️ View Salary Slip</button>
          </div>
        </div>
      ) : (
        <div className="fade-in">
          <button className="btn-secondary" style={{ marginBottom: 20 }} onClick={() => setPreview(false)}>← Back to Edit</button>
          <div style={{ background: "white", color: "black", padding: 40, borderRadius: 8, maxWidth: 800, margin: "0 auto", border: "1px solid #ddd" }} className="printable">
            <h2 style={{ textAlign: "center", borderBottom: "2px solid #333", paddingBottom: 10 }}>SALARY SLIP</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 20 }}>
              <div>
                <p><strong>Earnings</strong></p>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Basic</span> <span>{formatINR(basic)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>HRA</span> <span>{formatINR(hra)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Allowances</span> <span>{formatINR(allowance)}</span></div>
                <div style={{ borderTop: "1px solid #ddd", marginTop: 10, paddingTop: 10, fontWeight: "bold", display: "flex", justifyContent: "space-between" }}>
                  <span>Total Earnings</span> <span>{formatINR(totalEarnings)}</span>
                </div>
              </div>
              <div>
                <p><strong>Deductions</strong></p>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Deductions</span> <span>{formatINR(deductions)}</span></div>
                <div style={{ borderTop: "1px solid #ddd", marginTop: 10, paddingTop: 10, fontWeight: "bold", display: "flex", justifyContent: "space-between" }}>
                  <span>Net Salary</span> <span>{formatINR(netSalary)}</span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 40, textAlign: "center", fontSize: 12, color: "#666" }}>This is a computer generated salary slip and does not require a signature.</div>
          </div>
        </div>
      )}
    </div>
  );
}
