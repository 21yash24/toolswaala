import React, { useState } from "react";
import { BRAND } from "../../shared/constants";

export default function GstinVerifyTool() {
  const [gstin, setGstin] = useState("");
  const [result, setResult] = useState(null);

  const validate = () => {
    if (!gstin) return;
    const input = gstin.trim().toUpperCase();
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    
    if (!regex.test(input)) {
      setResult({ valid: false, message: "Invalid GSTIN Format. Must be 15 characters (e.g., 22AAAAA0000A1Z5)" });
      return;
    }

    const stateCode = parseInt(input.substring(0, 2), 10);
    if (stateCode < 1 || stateCode > 38) {
      setResult({ valid: false, message: "Invalid State Code in GSTIN." });
      return;
    }

    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let hash = 0;
    for (let i = 0; i < 14; i++) {
      let val = chars.indexOf(input[i]);
      let multiplier = (i % 2 !== 0) ? 2 : 1; 
      let prod = val * multiplier;
      let quotient = Math.floor(prod / 36);
      let remainder = prod % 36;
      hash = hash + quotient + remainder;
    }
    let checkCode = (36 - (hash % 36)) % 36;
    let expectedChar = chars[checkCode];

    if (expectedChar !== input[14]) {
      setResult({ valid: false, message: `Checksum failed. Expected last character to be '${expectedChar}'.` });
      return;
    }

    const states = {
      1: "Jammu and Kashmir", 2: "Himachal Pradesh", 3: "Punjab", 4: "Chandigarh", 5: "Uttarakhand",
      6: "Haryana", 7: "Delhi", 8: "Rajasthan", 9: "Uttar Pradesh", 10: "Bihar", 11: "Sikkim",
      12: "Arunachal Pradesh", 13: "Nagaland", 14: "Manipur", 15: "Mizoram", 16: "Tripura",
      17: "Meghalaya", 18: "Assam", 19: "West Bengal", 20: "Jharkhand", 21: "Odisha", 22: "Chhattisgarh",
      23: "Madhya Pradesh", 24: "Gujarat", 25: "Daman and Diu", 26: "Dadra and Nagar Haveli",
      27: "Maharashtra", 28: "Andhra Pradesh (Old)", 29: "Karnataka", 30: "Goa", 31: "Lakshadweep",
      32: "Kerala", 33: "Tamil Nadu", 34: "Puducherry", 35: "Andaman and Nicobar Islands",
      36: "Telangana", 37: "Andhra Pradesh", 38: "Ladakh"
    };

    setResult({
      valid: true,
      state: states[stateCode] || "Unknown",
      pan: input.substring(2, 12),
      entityNum: input[12]
    });
  };

  return (
    <div className="grid-2">
      <div className="glass-card">
        <div className="form-group">
          <label>Enter GSTIN</label>
          <input 
            value={gstin} 
            onChange={e => setGstin(e.target.value.toUpperCase())} 
            placeholder="e.g. 27AADCB2230M1Z2" 
            maxLength={15}
          />
        </div>
        <button className="btn-primary" style={{ width: "100%" }} onClick={validate}>Verify GSTIN</button>
      </div>
      
      {result && (
        <div className="result-box fade-in">
          {result.valid ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(34,197,94,0.2)", color: BRAND.success, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✓</div>
                <div>
                  <h3 style={{ color: BRAND.success }}>Mathematically Valid</h3>
                  <div style={{ fontSize: 12, color: BRAND.textSecondary }}>Checksum verification passed</div>
                </div>
              </div>
              <div style={{ display: "grid", gap: 16 }}>
                <div style={{ background: "rgba(0,0,0,0.1)", padding: 12, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: BRAND.textSecondary, textTransform: "uppercase" }}>PAN Number</div>
                  <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1 }}>{result.pan}</div>
                </div>
                <div style={{ background: "rgba(0,0,0,0.1)", padding: 12, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: BRAND.textSecondary, textTransform: "uppercase" }}>Registered State</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{result.state}</div>
                </div>
                <div style={{ background: "rgba(0,0,0,0.1)", padding: 12, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: BRAND.textSecondary, textTransform: "uppercase" }}>Entity Number</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{result.entityNum} (Registration Count)</div>
                </div>
              </div>
              <div style={{ marginTop: 20, fontSize: 11, color: BRAND.textSecondary, textAlign: "center" }}>Note: This verifies the mathematical structure. To check active status, visit the official portal.</div>
            </div>
          ) : (
            <div style={{ textAlign: "center", color: BRAND.danger }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>⚠️</div>
              <h3>Invalid GSTIN</h3>
              <p style={{ marginTop: 10, fontSize: 14 }}>{result.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
