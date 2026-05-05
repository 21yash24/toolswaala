// Shared constants and helpers for ToolsWaala
export const BRAND = {
  primary: "#FF6B00",
  primaryDark: "#D45800",
  surface: "var(--app-surface)",
  surfaceCard: "var(--app-surface-card)",
  text: "var(--app-text)",
  textSecondary: "var(--app-text-secondary)",
  accent: "#FFB347",
  border: "var(--app-border)",
};

export const STUDENT_BRAND = {
  accent: "#7C3AED",
  accentDark: "#6D28D9",
  accentLight: "#EDE9FE",
  accentGlow: "rgba(124, 58, 237, 0.3)",
  surface: "var(--app-surface)",
  surfaceCard: "var(--app-surface-card)",
};

export const PDF_BRAND = {
  accent: "#1D6BE4",
  accentDark: "#1557B7",
  accentLight: "#E8F1FF",
  accentGlow: "rgba(29, 107, 228, 0.3)",
  surface: "var(--app-surface)",
  surfaceCard: "var(--app-surface-card)",
};

export function formatINR(n) {
  if (n === undefined || n === null || isNaN(n)) return "₹0";
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function today() {
  return new Date().toISOString().split("T")[0];
}

export const STUDENT_TOOLS = [
  { id: "cgpa", path: "/cgpa-calculator", name: "CGPA Calculator", hindi: "सीजीपीए कैलकुलेटर", icon: "🎓", desc: "SGPA, CGPA to Percentage with university presets", color: "#7C3AED", keywords: ["marks", "grade", "gpa", "percentage", "university", "result"] },
  { id: "attendance", path: "/attendance-calculator", name: "Attendance Calculator", hindi: "उपस्थिति कैलकुलेटर", icon: "📊", desc: "Track attendance, bunk count & 75% rule check", color: "#EC4899", keywords: ["bunk", "present", "absent", "college", "75", "track"] },
  { id: "percentage", path: "/percentage-calculator", name: "Marks Calculator", hindi: "प्रतिशत कैलकुलेटर", icon: "📝", desc: "Semester results, target marks & CBSE grading", color: "#F59E0B", keywords: ["exam", "marks", "grade", "percentage", "result"] },
  { id: "pomodoro", path: "/pomodoro-timer", name: "Pomodoro Timer", hindi: "पोमोडोरो टाइमर", icon: "⏱️", desc: "Focus timer with sessions, stats & audio alerts", color: "#EF4444", keywords: ["pomo", "focus", "study", "timer", "clock", "productivity"] },
  { id: "bonafide", path: "/bonafide-certificate", name: "Bonafide Certificate", hindi: "बोनाफाइड सर्टिफिकेट", icon: "📜", desc: "Generate print-ready bonafide certificates", color: "#10B981", keywords: ["letter", "college", "certificate", "document", "print"] },
  { id: "noc", path: "/noc-generator", name: "NOC Letter", hindi: "एनओसी लेटर", icon: "📄", desc: "No Objection Certificate for internships & events", color: "#06B6D4", keywords: ["letter", "noc", "internship", "permission", "document"] },
  { id: "resume", path: "/resume-builder", name: "Resume Builder", hindi: "रिज्यूमे बनाएं", icon: "💼", desc: "ATS-friendly resume builder for freshers", color: "#8B5CF6", keywords: ["cv", "job", "career", "ats", "builder", "freshers"] },
  { id: "sop", path: "/sop-generator", name: "SOP Generator", hindi: "एसओपी जेनरेटर", icon: "✍️", desc: "AI-powered Statement of Purpose writer", color: "#F97316", keywords: ["admission", "essay", "college", "writing", "ai", "study abroad"] },
  { id: "scholarship", path: "/scholarship-finder", name: "Scholarship Finder", hindi: "छात्रवृत्ति खोजें", icon: "🏆", desc: "Search 35+ Indian scholarships with filters", color: "#14B8A6", keywords: ["money", "funding", "college", "free", "india", "abroad"] },
  { id: "study-planner", path: "/study-planner", name: "Study Planner", hindi: "स्टडी प्लानर", icon: "📅", desc: "Exam countdown, schedule & daily checklist", color: "#6366F1", keywords: ["schedule", "time table", "exams", "todo", "planner"] },
  { id: "word-counter", path: "/word-counter", name: "Word Counter", hindi: "वर्ड काउंटर", icon: "📝", desc: "Count words, characters, and reading time", color: "#F43F5E", keywords: ["text", "essay", "words", "count", "length"] },
  { id: "age-calculator", path: "/age-calculator", name: "Age Calculator", hindi: "आयु कैलकुलेटर", icon: "🎂", desc: "Calculate exact age in years, months, and days", color: "#8B5CF6", keywords: ["birthday", "date", "exact", "years", "days"] },
  { id: "yt-thumbnail", path: "/youtube-thumbnail-downloader", name: "YT Thumbnail Downloader", hindi: "थंबनेल डाउनलोडर", icon: "▶️", desc: "Download high-quality YouTube video thumbnails", color: "#EF4444", keywords: ["yt", "image", "download", "thumbnail", "video"] },
  { id: "jobs", path: "/job-finder", name: "Job Finder", hindi: "जॉब फाइंडर", icon: "💼", desc: "Latest Sarkari Naukri, Private Jobs & Internships", color: "#3B82F6", keywords: ["career", "employment", "naukri", "private", "govt", "work"] },
];

export const TOOLS = [
  { id: "upi", path: "/upi-payment", name: "UPI Payment Page", hindi: "यूपीआई पेमेंट पेज", icon: "📲", desc: "Shareable UPI payment page with QR code", color: "#4CAF50", keywords: ["pay", "money", "transfer", "business", "india"] },
  { id: "gst-invoice", path: "/gst-invoice", name: "GST Invoice", hindi: "जीएसटी चालान", icon: "🧾", desc: "Professional GST invoice generator with PDF", color: "#FF6B00", keywords: ["bill", "tax", "b2b", "gst", "invoice", "print"] },
  { id: "gstin-verify", path: "/gstin-verify", name: "GSTIN Verifier", hindi: "जीएसटीएन सत्यापन", icon: "🛡️", desc: "Instantly verify GST format & extract details", color: "#3F51B5", keywords: ["tax", "gstin", "lookup", "verification", "business"] },
  { id: "qr", path: "/qr-generator", name: "QR Code Generator", hindi: "क्यूआर कोड", icon: "▣", desc: "Custom QR codes for URL, UPI, WhatsApp & more", color: "#2196F3", keywords: ["code", "scan", "link", "upi", "qr", "generator"] },
  { id: "emi", path: "/emi-calculator", name: "EMI Calculator", hindi: "ईएमआई कैलकुलेटर", icon: "🏦", desc: "Home, car, personal & business loan EMI", color: "#9C27B0", keywords: ["loan", "bank", "interest", "mortgage", "finance"] },
  { id: "gst-calc", path: "/gst-calculator", name: "GST Calculator", hindi: "जीएसटी कैलकुलेटर", icon: "🧮", desc: "Add or remove GST instantly with HSN lookup", color: "#F44336", keywords: ["tax", "percent", "gst", "hsn", "math"] },
  { id: "estimate", path: "/estimate-generator", name: "Estimate Generator", hindi: "अनुमान जनरेटर", icon: "📝", desc: "Create pre-sales quotations with discounts", color: "#4CAF50", keywords: ["quote", "sales", "bill", "invoice", "business"] },
  { id: "legal", path: "/legal-hub", name: "Legal Hub", hindi: "कानूनी हब", icon: "⚖️", desc: "Generate Rent Agreements, NDAs & MSAs", color: "#FF9800", keywords: ["contract", "agreement", "law", "document", "rent", "nda"] },
  { id: "salary", path: "/salary-slip", name: "Salary Slip Engine", hindi: "वेतन पर्ची इंजन", icon: "💼", desc: "Auto-CTC breakdown with New Tax Regime TDS", color: "#009688", keywords: ["payroll", "payslip", "employee", "salary", "hr"] },
  { id: "tax", path: "/tax-calculator", name: "Income Tax Calculator", hindi: "आयकर कैलकुलेटर", icon: "⚖️", desc: "Compare Old vs New Tax Regimes instantly", color: "#E91E63", keywords: ["income", "it", "tax", "india", "savings"] },
  { id: "receipt", path: "/receipt-maker", name: "Receipt Maker", hindi: "रसीद जनरेटर", icon: "🧾", desc: "Professional payment receipts with PDF export", color: "#FFC107", keywords: ["bill", "payment", "proof", "print", "cash"] },
  { id: "bizname", path: "/business-name", name: "Business Name AI", hindi: "व्यापार नाम एआई", icon: "✨", desc: "AI-powered business name suggestions", color: "#3F51B5", keywords: ["startup", "brand", "ai", "idea", "naming"] },
  { id: "sip", path: "/sip-calculator", name: "SIP Calculator", hindi: "एसआईपी कैलकुलेटर", icon: "📈", desc: "Estimate mutual fund SIP returns with visual chart", color: "#00BCD4", keywords: ["investment", "mf", "returns", "money", "mutual fund"] },
  { id: "hra", path: "/hra-calculator", name: "HRA Calculator", hindi: "एचआरए कैलकुलेटर", icon: "🏠", desc: "Calculate House Rent Allowance tax exemption", color: "#8BC34A", keywords: ["rent", "tax", "allowance", "savings", "salary"] },
  { id: "fd", path: "/fd-calculator", name: "FD Calculator", hindi: "एफडी कैलकुलेटर", icon: "🏦", desc: "Fixed Deposit maturity & interest calculator", color: "#FF5722", keywords: ["savings", "bank", "interest", "fixed", "money"] },
];

export const PDF_TOOLS = [
  { id: "pdf-compress", path: "/pdf-tools/compress-pdf", name: "Compress PDF", hindi: "पीडीएफ कम्प्रेस करें", icon: "📉", desc: "Reduce PDF size without losing quality", color: "#1D6BE4", keywords: ["size", "mb", "reduce", "small", "files"] },
  { id: "img-to-pdf", path: "/pdf-tools/image-to-pdf", name: "Image to PDF", hindi: "इमेज से पीडीएफ", icon: "🖼️", desc: "Convert JPG, PNG to professional PDF", color: "#1D6BE4", keywords: ["jpg", "png", "convert", "combine"] },
  { id: "pdf-to-img", path: "/pdf-tools/pdf-to-jpg", name: "PDF to JPG", hindi: "पीडीएफ से इमेज", icon: "📸", desc: "Extract pages as high-quality images", color: "#1D6BE4", keywords: ["extract", "images", "convert", "pages"] },
  { id: "merge-pdf", path: "/pdf-tools/merge-pdf", name: "Merge PDF", hindi: "पीडीएफ मर्ज करें", icon: "📑", desc: "Combine multiple PDFs into one", color: "#1D6BE4", keywords: ["combine", "join", "files", "together"] },
  { id: "split-pdf", path: "/pdf-tools/split-pdf", name: "Split PDF", hindi: "पीडीएफ स्प्लिट करें", icon: "✂️", desc: "Extract pages or split into separate files", color: "#1D6BE4", keywords: ["extract", "cut", "separate", "pages"] },
  { id: "img-compress", path: "/pdf-tools/compress-image", name: "Image Compressor", hindi: "इमेज कम्प्रेस करें", icon: "🖼️", desc: "Resize & compress for exam portals", color: "#1D6BE4", keywords: ["size", "jpg", "png", "reduce", "mb", "kb"] },
  { id: "word-to-pdf", path: "/pdf-tools/word-to-pdf", name: "Word to PDF", hindi: "वर्ड से पीडीएफ", icon: "📄", desc: "Convert docx to PDF entirely in browser", color: "#1D6BE4", keywords: ["convert", "docx", "doc", "office"] },
  { id: "pdf-to-word", path: "/pdf-tools/pdf-to-word", name: "PDF to Word", hindi: "पीडीएफ से वर्ड", icon: "📝", desc: "Extract PDF text to Word document locally", color: "#1D6BE4", keywords: ["convert", "docx", "doc", "extract"] },
  { id: "watermark-pdf", path: "/pdf-tools/watermark-pdf", name: "Watermark PDF", hindi: "वाटरमार्क लगाएं", icon: "🖋️", desc: "Add text watermark to your PDF pages", color: "#1D6BE4", keywords: ["protect", "text", "stamp", "draft", "copy"] },
];
