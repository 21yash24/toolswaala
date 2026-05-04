import { useState } from "react";
import { BRAND, STUDENT_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };

export default function BonafideCertificate() {
  const [form, setForm] = useState({
    collegeName: "Government Engineering College",
    collegeAddress: "Main Road, City, State - 400001",
    principalName: "Dr. A.K. Sharma",
    studentName: "",
    rollNo: "",
    course: "",
    year: "3rd Year",
    semester: "5th Semester",
    admissionYear: "2022",
    purpose: "Internship Application",
    customPurpose: "",
  });

  const [preview, setPreview] = useState(false);

  const update = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const purposes = [
    "Internship Application",
    "Bank Account Opening",
    "Passport Application",
    "Railway Concession",
    "Scholarship Application",
    "Visa/Study Abroad",
    "General Purpose",
    "Other",
  ];

  const handlePrint = () => {
    window.print();
  };

  if (preview) {
    return (
      <div className="fade-in">
        <style>{`
          @media print {
            body * { visibility: hidden; }
            #printable-area, #printable-area * { visibility: visible; }
            #printable-area { position: absolute; left: 0; top: 0; width: 100%; color: black !important; }
            .no-print { display: none !important; }
          }
          #printable-area {
            background: white;
            color: #1a1a1a;
            padding: 50px;
            min-height: 800px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border: 1px solid #eee;
            font-family: "Times New Roman", serif;
            line-height: 1.6;
          }
        `}</style>

        <div style={{ display: "flex", gap: 12, marginBottom: 24 }} className="no-print">
          <button onClick={() => setPreview(false)} style={{ padding: "10px 20px", borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.05)", color: BRAND.text, cursor: "pointer" }}>← Edit Details</button>
          <button onClick={handlePrint} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: STUDENT_BRAND.accent, color: "white", cursor: "pointer", fontWeight: 700 }}>🖨️ Print / Save PDF</button>
        </div>

        <div id="printable-area">
          <div style={{ textAlign: "center", borderBottom: "2px solid #333", paddingBottom: 20, marginBottom: 40 }}>
            <h1 style={{ margin: 0, textTransform: "uppercase", fontSize: 28 }}>{form.collegeName}</h1>
            <p style={{ margin: "5px 0", fontSize: 14 }}>{form.collegeAddress}</p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 40 }}>
            <div>Ref No: ______________</div>
            <div>Date: {new Date().toLocaleDateString("en-GB")}</div>
          </div>

          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ textDecoration: "underline", fontSize: 22, fontWeight: 700 }}>TO WHOMSOEVER IT MAY CONCERN</h2>
          </div>

          <div style={{ fontSize: 18, textAlign: "justify", marginBottom: 80 }}>
            <p>
              This is to certify that <strong>Mr./Ms. {form.studentName || "[Full Name]"}</strong>, 
              Roll No. <strong>{form.rollNo || "[Roll Number]"}</strong> is a bonafide student of 
              <strong> {form.collegeName}</strong>. 
            </p>
            <p style={{ marginTop: 20 }}>
              He/She is currently studying in <strong>{form.year} ({form.semester})</strong> of the 
              <strong> {form.course || "[Course Name]"}</strong> course. He/She was admitted to this college in the academic year <strong>{form.admissionYear}</strong>.
            </p>
            <p style={{ marginTop: 20 }}>
              This certificate is being issued at the request of the student for the purpose of 
              <strong> {form.purpose === "Other" ? form.customPurpose : form.purpose}</strong>.
            </p>
            <p style={{ marginTop: 20 }}>
              His/Her conduct during the course of study has been found to be Good.
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 100 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ marginBottom: 60 }}>(College Seal)</div>
              <div style={{ borderTop: "1px solid #333", paddingTop: 5, minWidth: 200 }}>
                <strong>Principal / HOD</strong><br />
                {form.principalName}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={cs}>
        <h3 style={{ color: "white", margin: "0 0 24px" }}>College Details <span style={{ fontSize: 13, color: BRAND.textSecondary }}>कॉलेज विवरण</span></h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>College Name / कॉलेज का नाम</label>
            <input value={form.collegeName} onChange={(e) => update("collegeName", e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 15 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>College Address / कॉलेज का पता</label>
            <input value={form.collegeAddress} onChange={(e) => update("collegeAddress", e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 15 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Principal/HOD Name</label>
            <input value={form.principalName} onChange={(e) => update("principalName", e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 15 }} />
          </div>
        </div>
      </div>

      <div style={{ ...cs, marginTop: 24 }}>
        <h3 style={{ color: "white", margin: "0 0 24px" }}>Student Details <span style={{ fontSize: 13, color: BRAND.textSecondary }}>छात्र विवरण</span></h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Full Name / पूरा नाम</label>
            <input value={form.studentName} onChange={(e) => update("studentName", e.target.value)} placeholder="Enter your full name" style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 15 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Roll/Enrollment No.</label>
            <input value={form.rollNo} onChange={(e) => update("rollNo", e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 15 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Course & Branch</label>
            <input value={form.course} onChange={(e) => update("course", e.target.value)} placeholder="e.g. B.Tech CS" style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 15 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Current Year</label>
            <select value={form.year} onChange={(e) => update("year", e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "#1a1a1a", color: "white", fontSize: 15 }}>
              <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option><option>5th Year</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Current Semester</label>
            <input value={form.semester} onChange={(e) => update("semester", e.target.value)} placeholder="e.g. 5th Sem" style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 15 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Admission Year</label>
            <input value={form.admissionYear} onChange={(e) => update("admissionYear", e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 15 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Purpose / उद्देश्य</label>
            <select value={form.purpose} onChange={(e) => update("purpose", e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "#1a1a1a", color: "white", fontSize: 15 }}>
              {purposes.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          {form.purpose === "Other" && (
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Specify Purpose</label>
              <input value={form.customPurpose} onChange={(e) => update("customPurpose", e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 15 }} />
            </div>
          )}
        </div>
      </div>

      <button onClick={() => { if(!form.studentName) { alert("Please enter Student Name"); return; } setPreview(true); }} style={{ width: "100%", marginTop: 32, background: STUDENT_BRAND.accent, color: "white", border: "none", borderRadius: 12, padding: "16px 24px", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>🚀 Generate Preview</button>
    </div>
  );
}
