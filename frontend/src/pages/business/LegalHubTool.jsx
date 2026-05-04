import React, { useState } from "react";
import { BRAND, today } from "../../shared/constants";

export default function LegalHubTool() {
  const [docType, setDocType] = useState("rent");
  const [preview, setPreview] = useState(false);

  // Shared state for all forms
  const [party1, setParty1] = useState({ name: "", address: "" }); // Landlord / Disclosing Party / Client
  const [party2, setParty2] = useState({ name: "", address: "" }); // Tenant / Receiving Party / Agency
  const [details, setDetails] = useState({
    amount: "",
    duration: "11",
    state: "Maharashtra",
    date: today(),
    purpose: "", // For NDA/MSA
  });

  const renderForm = () => {
    return (
      <div className="fade-in">
        <div style={{ display: "flex", gap: 10, marginBottom: 24, overflowX: "auto", paddingBottom: 5 }}>
          <button onClick={() => setDocType("rent")} className={docType === "rent" ? "btn-primary" : "btn-secondary"}>🏠 Rent Agreement</button>
          <button onClick={() => setDocType("nda")} className={docType === "nda" ? "btn-primary" : "btn-secondary"}>🤫 Non-Disclosure (NDA)</button>
          <button onClick={() => setDocType("msa")} className={docType === "msa" ? "btn-primary" : "btn-secondary"}>🤝 Master Service (MSA)</button>
        </div>

        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="glass-card">
            <h3 style={{ fontSize: 16, marginBottom: 20 }}>{docType === "rent" ? "Landlord" : docType === "nda" ? "Disclosing Party" : "Client"}</h3>
            <div className="form-group"><label>Full Name / Company Name</label><input value={party1.name} onChange={e => setParty1({...party1, name: e.target.value})} placeholder="Full legal name" /></div>
            <div className="form-group"><label>Address / Registered Office</label><textarea value={party1.address} onChange={e => setParty1({...party1, address: e.target.value})} placeholder="Complete address with PIN" /></div>
          </div>
          <div className="glass-card">
            <h3 style={{ fontSize: 16, marginBottom: 20 }}>{docType === "rent" ? "Tenant" : docType === "nda" ? "Receiving Party" : "Service Provider"}</h3>
            <div className="form-group"><label>Full Name / Company Name</label><input value={party2.name} onChange={e => setParty2({...party2, name: e.target.value})} placeholder="Full legal name" /></div>
            <div className="form-group"><label>Address / Registered Office</label><textarea value={party2.address} onChange={e => setParty2({...party2, address: e.target.value})} placeholder="Complete address with PIN" /></div>
          </div>
        </div>

        <div className="glass-card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, marginBottom: 20 }}>Agreement Details</h3>
          <div className="grid-3">
            <div className="form-group"><label>Execution Date</label><input type="date" value={details.date} onChange={e => setDetails({...details, date: e.target.value})} /></div>
            {docType === "rent" && (
              <>
                <div className="form-group"><label>Monthly Rent (₹)</label><input type="number" value={details.amount} onChange={e => setDetails({...details, amount: e.target.value})} /></div>
                <div className="form-group"><label>Duration (Months)</label><input type="number" value={details.duration} onChange={e => setDetails({...details, duration: e.target.value})} /></div>
              </>
            )}
            {(docType === "nda" || docType === "msa") && (
              <div className="form-group" style={{ gridColumn: "span 2" }}><label>Purpose of Engagement</label><input value={details.purpose} onChange={e => setDetails({...details, purpose: e.target.value})} placeholder="e.g. Discussing project partnership" /></div>
            )}
          </div>
        </div>

        <button className="btn-primary" style={{ width: "100%", padding: 16, fontSize: 16 }} onClick={() => setPreview(true)}>✨ Generate Document Preview</button>
      </div>
    );
  };

  return (
    <div>
      {!preview ? renderForm() : (
        <div className="fade-in">
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <button className="btn-secondary" onClick={() => setPreview(false)}>← Back to Edit</button>
            <button className="btn-primary" onClick={() => window.print()}>🖨️ Print / Save as PDF</button>
          </div>
          <div style={{ background: "white", color: "black", padding: "60px 80px", borderRadius: 8, boxShadow: "0 10px 40px rgba(0,0,0,0.2)", fontFamily: "serif", lineHeight: 1.8, maxWidth: 800, margin: "0 auto" }} className="printable">
            <h1 style={{ textAlign: "center", textTransform: "uppercase", marginBottom: 40, textDecoration: "underline" }}>
              {docType === "rent" ? "Rent Agreement" : docType === "nda" ? "Non-Disclosure Agreement" : "Master Service Agreement"}
            </h1>
            <p>This AGREEMENT is entered into on this <strong>{details.date}</strong> at <strong>{details.state}</strong>.</p>
            
            <p><strong>BETWEEN:</strong></p>
            <p><strong>{party1.name || "[Party 1 Name]"}</strong>, residing at {party1.address || "[Party 1 Address]"}, hereinafter referred to as the FIRST PARTY.</p>
            
            <p><strong>AND:</strong></p>
            <p><strong>{party2.name || "[Party 2 Name]"}</strong>, residing at {party2.address || "[Party 2 Address]"}, hereinafter referred to as the SECOND PARTY.</p>

            <h3 style={{ marginTop: 30 }}>WHEREAS:</h3>
            {docType === "rent" ? (
              <p>The First Party is the absolute owner of the premises and the Second Party has approached the First Party to take the premises on rent for a period of {details.duration} months at a monthly rent of ₹{details.amount}.</p>
            ) : (
              <p>The parties wish to explore a business relationship and in connection with such relationship, the Disclosing Party may disclose certain Confidential Information to the Receiving Party for the purpose of {details.purpose || "business evaluation"}.</p>
            )}

            <h3 style={{ marginTop: 30 }}>TERMS AND CONDITIONS:</h3>
            <ol style={{ paddingLeft: 20 }}>
              <li>The parties shall abide by all local laws and regulations.</li>
              <li>Any disputes arising from this agreement shall be subject to local jurisdiction.</li>
              <li>This document serves as a draft and should be reviewed by legal counsel before formal execution.</li>
            </ol>

            <div style={{ marginTop: 100, display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ borderTop: "1px solid black", width: 200, marginTop: 40 }}></div>
                <p>(Signature of First Party)</p>
              </div>
              <div>
                <div style={{ borderTop: "1px solid black", width: 200, marginTop: 40 }}></div>
                <p>(Signature of Second Party)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
