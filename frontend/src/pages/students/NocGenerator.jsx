import { useState } from "react";
import { BRAND, STUDENT_BRAND } from "../../shared/constants";

const cs = { background: BRAND.surfaceCard, borderRadius: 16, border: `1px solid ${BRAND.border}`, padding: 24 };

export default function NocGenerator() {
  const [form, setForm] = useState({
    collegeName: "Government Engineering College",
    collegeAddress: "Main Road, City, State - 400001",
    principalName: "Dr. A.K. Sharma",
    studentName: "",
    rollNo: "",
    course: "",
    year: "3rd Year",
    semester: "5th Semester",
    orgName: "",
    orgAddress: "",
    purposeType: "Internship",
    duration: "2 Months",
    startDate: "2024-06-01",
    endDate: "2024-07-31",
  });

  const [preview, setPreview] = useState(false);
  const update = (f, v) => setForm((p) => ({ ...p, [f]: v }));

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
            padding: 60px;
            min-height: 800px;
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
            <h2 style={{ textDecoration: "underline", fontSize: 22, fontWeight: 700 }}>NO OBJECTION CERTIFICATE</h2>
          </div>

          <div style={{ fontSize: 18, textAlign: "justify", marginBottom: 80 }}>
            <p>
              This is to certify that <strong>Mr./Ms. {form.studentName || "[Full Name]"}</strong>, 
              Roll No. <strong>{form.rollNo || "[Roll Number]"}</strong> is a bonafide student of 
              <strong> {form.collegeName}</strong>, currently studying in <strong>{form.year} ({form.semester})</strong> of 
              <strong> {form.course || "[Course Name]"}</strong>.
            </p>
            <p style={{ marginTop: 25 }}>
              The College has <strong>No Objection</strong> in his/her pursuing the 
              <strong> {form.purposeType}</strong> at <strong>{form.orgName || "[Organization Name]"}</strong>, 
              located at {form.orgAddress || "[Organization Address]"} for a period of 
              <strong> {form.duration}</strong> starting from <strong>{form.startDate}</strong> to <strong>{form.endDate}</strong>.
            </p>
            <p style={{ marginTop: 25 }}>
              The student will not miss any critical academic activities during this period, and his/her attendance will be monitored as per university regulations.
            </p>
            <p style={{ marginTop: 25 }}>
              We wish him/her all the best for this endeavor.
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
        <h3 style={{ color: "white", margin: "0 0 24px" }}>College & Student Info</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Full Name</label>
            <input value={form.studentName} onChange={(e) => update("studentName", e.target.value)} placeholder="Full Name" style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 15 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Roll No</label>
            <input value={form.rollNo} onChange={(e) => update("rollNo", e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 15 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Course</label>
            <input value={form.course} onChange={(e) => update("course", e.target.value)} placeholder="e.g. B.E. IT" style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 15 }} />
          </div>
        </div>
      </div>

      <div style={{ ...cs, marginTop: 24 }}>
        <h3 style={{ color: "white", margin: "0 0 24px" }}>Organization & Purpose</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Organization Name</label>
            <input value={form.orgName} onChange={(e) => update("orgName", e.target.value)} placeholder="Company / University Name" style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 15 }} />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Organization Address</label>
            <input value={form.orgAddress} onChange={(e) => update("orgAddress", e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 15 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Purpose</label>
            <select value={form.purposeType} onChange={(e) => update("purposeType", e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "#1a1a1a", color: "white", fontSize: 15 }}>
              <option>Internship</option><option>Conference</option><option>Competition</option><option>Research Project</option><option>Other</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Duration</label>
            <input value={form.duration} onChange={(e) => update("duration", e.target.value)} placeholder="e.g. 6 Months" style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 15 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>Start Date</label>
            <input type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 15 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: BRAND.textSecondary, display: "block", marginBottom: 6 }}>End Date</label>
            <input type="date" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${BRAND.border}`, background: "rgba(255,255,255,0.03)", color: "white", fontSize: 15 }} />
          </div>
        </div>
      </div>

      <button onClick={() => setPreview(true)} style={{ width: "100%", marginTop: 32, background: STUDENT_BRAND.accent, color: "white", border: "none", borderRadius: 12, padding: "16px 24px", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>📄 Generate NOC Letter</button>
    </div>
  );
}
