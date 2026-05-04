// Shared constants and helpers for ToolsWaala
export const BRAND = {
  primary: "#FF6B00",
  primaryDark: "#D45800",
  surface: "#09090B",
  surfaceCard: "#141414",
  text: "#FAFAFA",
  textSecondary: "#A1A1AA",
  accent: "#FFB347",
  border: "rgba(255, 255, 255, 0.08)",
};

export const STUDENT_BRAND = {
  accent: "#7C3AED",
  accentDark: "#6D28D9",
  accentLight: "#EDE9FE",
  accentGlow: "rgba(124, 58, 237, 0.3)",
  surface: "#09090B",
  surfaceCard: "#141414",
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
