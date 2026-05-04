import React, { useState } from "react";
import { BRAND, formatINR } from "../../shared/constants";

export default function SipCalculatorTool() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const i = rate / 12 / 100;
  const n = years * 12;
  const totalValue = monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const invested = monthly * n;
  const gains = totalValue - invested;

  return (
    <div className="grid-2 fade-in">
      <div className="glass-card">
        <div className="form-group">
          <label style={{ display: "flex", justifyContent: "space-between" }}><span>Monthly Investment</span> <span>{formatINR(monthly)}</span></label>
          <input type="range" min="500" max="100000" step="500" value={monthly} onChange={e => setMonthly(+e.target.value)} />
        </div>
        <div className="form-group">
          <label style={{ display: "flex", justifyContent: "space-between" }}><span>Expected Return (p.a)</span> <span>{rate}%</span></label>
          <input type="range" min="1" max="30" step="0.5" value={rate} onChange={e => setRate(+e.target.value)} />
        </div>
        <div className="form-group">
          <label style={{ display: "flex", justifyContent: "space-between" }}><span>Time Period (Years)</span> <span>{years}y</span></label>
          <input type="range" min="1" max="40" value={years} onChange={e => setYears(+e.target.value)} />
        </div>
      </div>
      <div className="result-box">
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 14, color: BRAND.textSecondary }}>Wealth Accumulated</div>
          <div style={{ fontSize: 42, fontWeight: 900, color: "#22c55e", margin: "16px 0" }}>{formatINR(totalValue)}</div>
          
          <div className="divider"></div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, textAlign: "left", marginTop: 24 }}>
            <div>
              <div style={{ fontSize: 11, color: BRAND.textSecondary }}>Invested Amount</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{formatINR(invested)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: BRAND.textSecondary }}>Wealth Gained</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#22c55e" }}>{formatINR(gains)}</div>
            </div>
          </div>
          
          <div style={{ marginTop: 24, fontSize: 12, color: BRAND.textSecondary }}>
            Compounding is the 8th wonder of the world. <br/> Start early, stay consistent.
          </div>
        </div>
      </div>
    </div>
  );
}
