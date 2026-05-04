// Shared constants and helpers for ToolsWaala
export const BRAND = {
  primary: "#FF6B00",
  primaryDark: "#D45800",
  surface: "var(--tw-surface)",
  surfaceCard: "var(--tw-surface-card)",
  text: "var(--tw-text)",
  textSecondary: "var(--tw-text-secondary)",
  accent: "#FFB347",
  border: "var(--tw-border)",
};

export const STUDENT_BRAND = {
  accent: "#7C3AED",
  accentDark: "#6D28D9",
  accentLight: "#EDE9FE",
  accentGlow: "rgba(124, 58, 237, 0.3)",
  surface: "var(--tw-surface)",
  surfaceCard: "var(--tw-surface-card)",
};

export const PDF_BRAND = {
  accent: "#1D6BE4",
  accentDark: "#1557B7",
  accentLight: "#E8F1FF",
  accentGlow: "rgba(29, 107, 228, 0.3)",
  surface: "var(--tw-surface)",
  surfaceCard: "var(--tw-surface-card)",
};

export function formatINR(n) {
  if (n === undefined || n === null || isNaN(n)) return "₹0";
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function today() {
  return new Date().toISOString().split("T")[0];
}

export const STUDENT_TOOLS = [
  { id: "cgpa", path: "/cgpa-calculator", name: "CGPA Calculator", hindi: "सीजीपीए कैलकुलेटर", icon: "🎓", desc: "SGPA, CGPA to Percentage with university presets", color: "#7C3AED" },
  { id: "attendance", path: "/attendance-calculator", name: "Attendance Calculator", hindi: "उपस्थिति कैलकुलेटर", icon: "📊", desc: "Track attendance, bunk count & 75% rule check", color: "#EC4899" },
  { id: "percentage", path: "/percentage-calculator", name: "Marks Calculator", hindi: "प्रतिशत कैलकुलेटर", icon: "📝", desc: "Semester results, target marks & CBSE grading", color: "#F59E0B" },
  { id: "pomodoro", path: "/pomodoro-timer", name: "Pomodoro Timer", hindi: "पोमोडोरो टाइमर", icon: "⏱️", desc: "Focus timer with sessions, stats & audio alerts", color: "#EF4444" },
  { id: "bonafide", path: "/bonafide-certificate", name: "Bonafide Certificate", hindi: "बोनाफाइड सर्टिफिकेट", icon: "📜", desc: "Generate print-ready bonafide certificates", color: "#10B981" },
  { id: "noc", path: "/noc-generator", name: "NOC Letter", hindi: "एनओसी लेटर", icon: "📄", desc: "No Objection Certificate for internships & events", color: "#06B6D4" },
  { id: "resume", path: "/resume-builder", name: "Resume Builder", hindi: "रिज्यूमे बनाएं", icon: "💼", desc: "ATS-friendly resume builder for freshers", color: "#8B5CF6" },
  { id: "sop", path: "/sop-generator", name: "SOP Generator", hindi: "एसओपी जेनरेटर", icon: "✍️", desc: "AI-powered Statement of Purpose writer", color: "#F97316" },
  { id: "scholarship", path: "/scholarship-finder", name: "Scholarship Finder", hindi: "छात्रवृत्ति खोजें", icon: "🏆", desc: "Search 35+ Indian scholarships with filters", color: "#14B8A6" },
  { id: "study-planner", path: "/study-planner", name: "Study Planner", hindi: "स्टडी प्लानर", icon: "📅", desc: "Exam countdown, schedule & daily checklist", color: "#6366F1" },
];

export const PDF_TOOLS = [
  { id: "pdf-compress", path: "/pdf-tools/compress-pdf", name: "Compress PDF", hindi: "पीडीएफ कम्प्रेस करें", icon: "📉", desc: "Reduce PDF size without losing quality", color: "#1D6BE4" },
  { id: "img-to-pdf", path: "/pdf-tools/image-to-pdf", name: "Image to PDF", hindi: "इमेज से पीडीएफ", icon: "🖼️", desc: "Convert JPG, PNG to professional PDF", color: "#1D6BE4" },
  { id: "pdf-to-img", path: "/pdf-tools/pdf-to-jpg", name: "PDF to JPG", hindi: "पीडीएफ से इमेज", icon: "📸", desc: "Extract pages as high-quality images", color: "#1D6BE4" },
  { id: "merge-pdf", path: "/pdf-tools/merge-pdf", name: "Merge PDF", hindi: "पीडीएफ मर्ज करें", icon: "📑", desc: "Combine multiple PDFs into one", color: "#1D6BE4" },
  { id: "split-pdf", path: "/pdf-tools/split-pdf", name: "Split PDF", hindi: "पीडीएफ स्प्लिट करें", icon: "✂️", desc: "Extract pages or split into separate files", color: "#1D6BE4" },
  { id: "img-compress", path: "/pdf-tools/compress-image", name: "Image Compressor", hindi: "इमेज कम्प्रेस करें", icon: "🖼️", desc: "Resize & compress for exam portals", color: "#1D6BE4" },
  { id: "word-to-pdf", path: "/pdf-tools/word-to-pdf", name: "Word to PDF", hindi: "वर्ड से पीडीएफ", icon: "📄", desc: "Convert docx to PDF entirely in browser", color: "#1D6BE4" },
  { id: "pdf-to-word", path: "/pdf-tools/pdf-to-word", name: "PDF to Word", hindi: "पीडीएफ से वर्ड", icon: "📝", desc: "Extract PDF text to Word document locally", color: "#1D6BE4" },
  { id: "watermark-pdf", path: "/pdf-tools/watermark-pdf", name: "Watermark PDF", hindi: "वाटरमार्क लगाएं", icon: "🖋️", desc: "Add text watermark to your PDF pages", color: "#1D6BE4" },
];
