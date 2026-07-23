const fs = require('fs');
const path = require('path');

const PAGE_FAQS = {
  '/cgpa-calculator': [
    { q: 'How to convert CGPA to percentage?', a: 'Multiply your CGPA by 9.5 for CBSE boards. For universities like Mumbai University, VTU, AKTU, Anna University, and SPPU, use the specific multiplier set by your university. Our calculator supports 20+ Indian universities.' },
    { q: 'What is a good CGPA for placements?', a: 'Most companies require a minimum CGPA of 6.0-7.0 (57%-66.5%) for campus placements. Top companies like Google, Microsoft, and Amazon typically look for 7.5+ CGPA.' },
    { q: 'What is the difference between SGPA and CGPA?', a: 'SGPA is your GPA for a single semester. CGPA is the average of all your SGPAs across all semesters.' },
  ],
  '/attendance-calculator': [
    { q: 'How many classes can I bunk with 75% attendance?', a: 'Use the formula: Safe Bunks = (Attended - 0.75 x Total) / 0.75. Our calculator does this math instantly for you.' },
    { q: 'What happens if attendance falls below 75%?', a: 'Most Indian universities will debar you from end-semester exams. This can lead to a year-back or supplementary exams.' },
    { q: 'Is 75% attendance mandatory in all colleges?', a: 'The UGC mandates 75% for central universities. Autonomous colleges like VIT, SRM, Manipal follow this strictly.' },
  ],
  '/emi-calculator': [
    { q: 'How is EMI calculated?', a: 'EMI = [P x R x (1+R)^N] / [(1+R)^N - 1], where P is principal, R is monthly interest rate, N is number of installments.' },
    { q: 'What is a good EMI to salary ratio?', a: 'Banks recommend total EMI should not exceed 40-50% of your monthly take-home salary.' },
  ],
  '/tax-calculator': [
    { q: 'Which is better - Old or New Tax Regime?', a: 'The New Regime is better if your total deductions are less than 3.75 lakh. Use our calculator to compare both instantly.' },
    { q: 'What is the tax-free income limit in 2025?', a: 'Under the New Regime for FY 2025-26, income up to 12 lakh is effectively tax-free.' },
  ],
  '/resume-builder': [
    { q: 'What is ATS and why does it matter?', a: 'ATS (Applicant Tracking System) is software used by companies to filter resumes. Our builder creates ATS-compatible resumes.' },
    { q: 'Should freshers have a one-page resume?', a: 'Yes. For freshers with less than 2 years experience, a single-page resume is ideal.' },
  ],
  '/pomodoro-timer': [
    { q: 'What is the Pomodoro Technique?', a: 'Study for 25 minutes, take a 5-minute break. After 4 cycles, take a 15-minute long break. Prevents burnout and maintains focus.' },
    { q: 'Can I change the timer duration?', a: 'Yes! Customize focus time (1-90 min), short break (1-30 min), and long break (1-60 min).' },
  ],
  '/sop-generator': [
    { q: 'How long should an SOP be?', a: 'Most universities expect 800-1000 words (1.5-2 pages). Our generator creates drafts within this range.' },
    { q: 'What should I include in my SOP?', a: 'Motivation, academic background, why this university, career goals, and what you will contribute.' },
  ],
  '/gst-invoice': [
    { q: 'What are the mandatory fields in a GST invoice?', a: 'GSTIN, invoice number, date, buyer details, HSN/SAC codes, taxable value, GST rate and amount, and total.' },
    { q: 'Do I need GST registration for invoicing?', a: 'GST registration is mandatory if turnover exceeds 40 lakh (20 lakh for services).' },
  ],
  '/scholarship-finder': [
    { q: 'What are the best scholarships for Indian students?', a: 'INSPIRE, Post Matric Scholarship, KVPY, Fulbright-Nehru, Commonwealth, Aga Khan Foundation, AICTE Pragati/Saksham.' },
    { q: 'Can I get a full scholarship to study abroad?', a: 'Yes! Fulbright, Chevening, DAAD, and Erasmus Mundus cover tuition, living expenses, and travel.' },
  ],
  '/pdf-tools/compress-pdf': [
    { q: 'How to compress PDF below 1MB?', a: 'Our compressor reduces size by 50-80% by optimizing images and removing metadata. Works entirely in your browser.' },
    { q: 'Does compressing PDF reduce quality?', a: 'Our smart compression keeps text sharp. Image-heavy PDFs may have slight quality reduction.' },
  ],
  '/job-finder': [
    { q: 'How to find the latest Sarkari Naukri?', a: 'Our Job Finder is updated daily with the latest government jobs, SSC, UPSC, and Bank PO vacancies.' },
    { q: 'Are these jobs verified?', a: 'Yes, we only list jobs from official government portals and verified company career pages.' }
  ],
  '/word-counter': [
    { q: 'Does this word counter include spaces?', a: 'Our word counter provides character counts both with and without spaces, making it perfect for essays and social media.' },
    { q: 'What is a good readability score?', a: 'A Flesch-Kincaid score between 60 and 70 is considered standard and easily understood by 13- to 15-year-old students.' }
  ],
  '/age-calculator': [
    { q: 'How accurate is the age calculator?', a: 'It calculates your exact age down to the days, weeks, and hours based on your date of birth.' },
    { q: 'Can I find my exact age for government exams?', a: 'Yes, government exams often require your exact age as of a specific cut-off date. You can calculate that here.' }
  ],
};

const PAGE_CONTENT = {
  '/students': '<p>Explore 15+ free tools for Indian college students. CGPA calculators for 20+ universities, ATS resume builders, and more.</p><ul><li><a href="/cgpa-calculator">CGPA Calculator</a></li><li><a href="/attendance-calculator">Attendance Calculator</a></li><li><a href="/resume-builder">Resume Builder</a></li><li><a href="/scholarship-finder">Scholarship Finder</a></li><li><a href="/pomodoro-timer">Pomodoro Timer</a></li><li><a href="/job-finder">Job Finder</a></li></ul>',
  '/pdf-tools': '<p>9 free PDF tools, 100% browser-based. No uploads.</p><ul><li><a href="/pdf-tools/compress-pdf">Compress PDF</a></li><li><a href="/pdf-tools/image-to-pdf">Image to PDF</a></li><li><a href="/pdf-tools/merge-pdf">Merge PDF</a></li><li><a href="/pdf-tools/split-pdf">Split PDF</a></li></ul>',
  '/cgpa-calculator': '<h2>CGPA to Percentage Conversion</h2><p>Supports Mumbai University, VTU, Anna University, AKTU, SPPU, CBSE, ICSE, GTU, JNTUH, and more.</p><ul><li><strong>CBSE:</strong> Percentage = CGPA x 9.5</li><li><strong>Mumbai University:</strong> Percentage = (CGPA - 0.5) x 10</li><li><strong>VTU:</strong> Percentage = (CGPA - 0.75) x 10</li></ul><p>Related: <a href="/percentage-calculator">Marks Calculator</a> | <a href="/attendance-calculator">Attendance Calculator</a></p>',
  '/attendance-calculator': '<h2>College Attendance Tracker</h2><p>Track the UGC 75% mandate. Daily log, subject-wise monitoring, safe bunk calculator.</p><p>Related: <a href="/cgpa-calculator">CGPA Calculator</a> | <a href="/study-planner">Study Planner</a></p>',
  '/resume-builder': '<h2>ATS Resume Builder for Freshers</h2><p>85% of companies use ATS to filter resumes. Our builder creates compatible formats for Naukri and LinkedIn.</p><p>Related: <a href="/sop-generator">SOP Generator</a> | <a href="/job-finder">Job Finder</a></p>',
  '/scholarship-finder': '<h2>35+ Verified Scholarships</h2><p>Government, private, and study abroad scholarships. INSPIRE, Fulbright, Chevening, DAAD, and more.</p><p>Related: <a href="/sop-generator">SOP Generator</a> | <a href="/cgpa-calculator">CGPA Calculator</a></p>',
  '/job-finder': '<h2>Latest Jobs India 2025</h2><p>SSC, UPSC, Railway, Banking, TCS, Infosys, Wipro. Internships for engineering and MBA students.</p><p>Related: <a href="/resume-builder">Resume Builder</a> | <a href="/scholarship-finder">Scholarship Finder</a></p>',
  '/pomodoro-timer': '<h2>Pomodoro Study Timer</h2><p>25-minute focus sessions with lofi music, productivity tracking, and customizable durations.</p><p>Related: <a href="/study-planner">Study Planner</a> | <a href="/attendance-calculator">Attendance Calculator</a></p>',
  '/study-planner': '<h2>Study Planner with Exam Countdown</h2><p>Priority tasks, weekly timetable, exam countdown, study streak tracker.</p><p>Related: <a href="/pomodoro-timer">Pomodoro Timer</a> | <a href="/cgpa-calculator">CGPA Calculator</a></p>',
  '/word-counter': '<h2>Word Counter with Readability Score</h2><p>Count words, characters, sentences. Flesch-Kincaid readability, keyword density, character limits for Twitter, Instagram, essays.</p><p>Related: <a href="/sop-generator">SOP Generator</a> | <a href="/resume-builder">Resume Builder</a></p>',
  '/age-calculator': '<h2>Exact Age Calculator</h2><p>Age in years, months, days, weeks, hours. Zodiac sign, birthday countdown, generation identifier.</p>',
  '/sop-generator': '<h2>AI SOP Generator</h2><p>For MS/MBA, PhD, Indian PG, scholarships, internships. Editable output with live word counter.</p><p>Related: <a href="/scholarship-finder">Scholarship Finder</a> | <a href="/resume-builder">Resume Builder</a></p>',
  '/percentage-calculator': '<h2>Marks Calculator</h2><p>Semester results, CBSE grading, target marks calculator. Custom pass thresholds.</p><p>Related: <a href="/cgpa-calculator">CGPA Calculator</a></p>',
  '/emi-calculator': '<h2>EMI Calculator India</h2><p>Home, car, personal, education loans. Full amortization schedule. SBI, HDFC, ICICI rates.</p><p>Related: <a href="/sip-calculator">SIP Calculator</a> | <a href="/fd-calculator">FD Calculator</a></p>',
  '/tax-calculator': '<h2>Income Tax Calculator FY 2025-26</h2><p>Old vs New Regime comparison. 80C, 80D, HRA deductions. Updated for Budget 2025.</p><p>Related: <a href="/hra-calculator">HRA Calculator</a> | <a href="/salary-slip">Salary Slip</a></p>',
  '/gst-invoice': '<h2>GST Invoice Generator</h2><p>GSTIN, HSN codes, CGST/SGST/IGST breakdown. PDF export. B2B and B2C.</p><p>Related: <a href="/gst-calculator">GST Calculator</a> | <a href="/receipt-maker">Receipt Maker</a></p>',
  '/gst-calculator': '<h2>GST Calculator</h2><p>Add or remove GST. All slabs: 5%, 12%, 18%, 28%. HSN code lookup.</p><p>Related: <a href="/gst-invoice">GST Invoice</a></p>',
  '/sip-calculator': '<h2>SIP Calculator</h2><p>Mutual fund SIP returns with growth charts. Step-up SIP calculations.</p><p>Related: <a href="/fd-calculator">FD Calculator</a> | <a href="/emi-calculator">EMI Calculator</a></p>',
  '/upi-payment': '<h2>UPI Payment Page</h2><p>Shareable payment link with QR. PhonePe, GPay, Paytm. No gateway fees.</p><p>Related: <a href="/qr-generator">QR Code Generator</a></p>',
};

const routes = [
  // Business Tools
  { path: '/upi-payment', title: 'Free UPI Payment Page Generator | ToolsWaala', desc: 'Create a shareable UPI payment page with QR code. No app needed. Works with PhonePe, GPay, Paytm.' },
  { path: '/gst-invoice', title: 'Free GST Invoice Generator India | ToolsWaala', desc: 'Generate professional GST invoices with HSN codes and PDF export. Zero login required.' },
  { path: '/emi-calculator', title: 'EMI Calculator India — Home, Car & Personal Loan | ToolsWaala', desc: 'Calculate EMI for home loan, car loan, personal loan instantly with amortization schedule.' },
  { path: '/gst-calculator', title: 'GST Calculator Online — Add or Remove GST | ToolsWaala', desc: 'Calculate GST inclusive and exclusive amounts instantly with HSN code lookup.' },
  { path: '/tax-calculator', title: 'Income Tax Calculator 2025 — Old vs New Regime | ToolsWaala', desc: 'Compare old and new tax regimes instantly. Free income tax calculator for salaried individuals.' },
  { path: '/salary-slip', title: 'Free Salary Slip Generator India | ToolsWaala', desc: 'Create professional salary slips with CTC breakdown and TDS calculation.' },
  { path: '/legal-hub', title: 'Free Legal Agreement Generator — Rent, NDA, MSA | ToolsWaala', desc: 'Draft rent agreements, NDAs, and service contracts instantly online. No lawyer needed.' },
  { path: '/sip-calculator', title: 'SIP Calculator India — Mutual Fund Returns | ToolsWaala', desc: 'Estimate mutual fund SIP returns with visual charts. Free SIP investment calculator.' },
  { path: '/hra-calculator', title: 'HRA Calculator — Tax Exemption Calculator | ToolsWaala', desc: 'Calculate House Rent Allowance tax exemption under Section 10(13A).' },
  { path: '/fd-calculator', title: 'FD Calculator — Fixed Deposit Interest Calculator | ToolsWaala', desc: 'Calculate fixed deposit maturity amount and interest for all major Indian banks.' },
  { path: '/receipt-maker', title: 'Free Receipt Maker — Payment Receipt Generator | ToolsWaala', desc: 'Generate professional payment receipts with PDF export. No login required.' },
  { path: '/estimate-generator', title: 'Free Estimate Generator — Quotation Maker | ToolsWaala', desc: 'Create pre-sales quotations and estimates with discounts and PDF export.' },
  { path: '/business-name', title: 'Business Name Generator AI | ToolsWaala', desc: 'AI-powered business name suggestions for your startup or brand.' },
  { path: '/gstin-verify', title: 'GSTIN Verifier — Verify GST Number Online | ToolsWaala', desc: 'Instantly verify GST format and extract business details from GSTIN.' },
  { path: '/qr-generator', title: 'QR Code Generator — Custom QR Codes Free | ToolsWaala', desc: 'Create custom QR codes for URL, UPI, WhatsApp and more. Free download.' },
  // Student Tools
  { path: '/attendance-calculator', title: 'Attendance & Bunk Calculator — 75% Rule | ToolsWaala', desc: 'Track attendance, calculate bunk count and check 75% rule. Free for students.' },
  { path: '/percentage-calculator', title: 'Marks & Percentage Calculator | ToolsWaala', desc: 'Calculate semester results, target marks and CBSE grading instantly.' },
  { path: '/pomodoro-timer', title: 'Pomodoro Timer & Lofi Player | ToolsWaala', desc: 'Free Pomodoro timer with lofi beats, focus tracking, and productivity history.' },
  { path: '/bonafide-certificate', title: 'Bonafide Certificate Generator Free | ToolsWaala', desc: 'Generate print-ready bonafide certificates online. No login needed.' },
  { path: '/noc-generator', title: 'NOC Letter Generator — No Objection Certificate | ToolsWaala', desc: 'Create No Objection Certificates for internships and events instantly.' },
  { path: '/resume-builder', title: 'Free Resume Builder for Freshers — ATS Friendly | ToolsWaala', desc: 'Build ATS-friendly resumes for freshers. Free download as PDF. No login.' },
  { path: '/sop-generator', title: 'SOP Generator — Statement of Purpose Writer | ToolsWaala', desc: 'AI-powered Statement of Purpose writer for MS, MBA, and PhD applications.' },
  { path: '/scholarship-finder', title: 'Best Scholarship Finder India 2025 | ToolsWaala', desc: 'Find and apply for 30+ latest government and private scholarships with verified deadlines.' },
  { path: '/study-planner', title: 'Study Planner — Exam Countdown & Schedule | ToolsWaala', desc: 'Plan your study schedule with exam countdown and daily checklist.' },
  { path: '/word-counter', title: 'Free Word & Character Counter Online | ToolsWaala', desc: 'Count words, characters and estimate reading time instantly. Free online tool.' },
  { path: '/age-calculator', title: 'Exact Age Calculator — Years, Months, Days | ToolsWaala', desc: 'Calculate your exact age in years, months, and days instantly.' },
  { path: '/youtube-thumbnail-downloader', title: 'YouTube Thumbnail Downloader HD | ToolsWaala', desc: 'Download high-quality YouTube video thumbnails in full HD instantly for free.' },
  { path: '/job-finder', title: 'Latest Govt & Private Jobs India 2025 | ToolsWaala', desc: 'Track Sarkari Naukri, admit cards, exam results, and private jobs for freshers.' },
  // PDF Tools
  { path: '/pdf-tools/compress-pdf', title: 'Compress PDF Free Online — No Upload | ToolsWaala', desc: 'Reduce PDF file size without losing quality. 100% browser-based, no file uploads.' },
  { path: '/pdf-tools/image-to-pdf', title: 'Image to PDF Converter Free | ToolsWaala', desc: 'Convert JPG, PNG images to professional PDF. No upload, 100% private.' },
  { path: '/pdf-tools/pdf-to-jpg', title: 'PDF to JPG Converter Free | ToolsWaala', desc: 'Extract PDF pages as high-quality JPG images. Works in your browser.' },
  { path: '/pdf-tools/merge-pdf', title: 'Merge PDF Files Free Online | ToolsWaala', desc: 'Combine multiple PDF documents into one. No signup, no upload.' },
  { path: '/pdf-tools/split-pdf', title: 'Split PDF Free — Extract Pages | ToolsWaala', desc: 'Extract pages or split PDF into separate files. 100% browser-based.' },
  { path: '/pdf-tools/compress-image', title: 'Image Compressor — Resize for Exam Portals | ToolsWaala', desc: 'Resize and compress images for exam portal uploads. Free online tool.' },
  { path: '/pdf-tools/word-to-pdf', title: 'Word to PDF Converter Free | ToolsWaala', desc: 'Convert DOCX to PDF entirely in your browser. No upload needed.' },
  { path: '/pdf-tools/pdf-to-word', title: 'PDF to Word Converter Free | ToolsWaala', desc: 'Extract PDF text to Word document locally. No server upload.' },
  { path: '/pdf-tools/watermark-pdf', title: 'Add Watermark to PDF Free | ToolsWaala', desc: 'Add text watermark to your PDF pages. Free online watermark tool.' },
  // Module pages
  { path: '/students', title: 'Free Student Tools India — CGPA, Resume, Scholarship | ToolsWaala', desc: '15+ free tools for Indian students. CGPA calculator, resume builder, scholarship finder, and more.' },
  { path: '/pdf-tools', title: 'Free PDF Tools Online — No Upload, 100% Private | ToolsWaala', desc: '9 free PDF tools. Compress, merge, split, convert. Your files never leave your browser.' },
];

const COMPONENT_MAP = {
  // Business
  '/upi-payment': { c: 'UpiTool', f: '../react-pages/BusinessTools', wrap: 'PageWrapper', hindi: 'पेमेंट पेज' },
  '/gst-invoice': { c: 'GstInvoiceTool', f: '../react-pages/BusinessTools', wrap: 'PageWrapper', hindi: 'चालान' },
  '/emi-calculator': { c: 'EmiTool', f: '../react-pages/BusinessTools', wrap: 'PageWrapper', hindi: 'ईएमआई' },
  '/gst-calculator': { c: 'GstCalcTool', f: '../react-pages/BusinessTools', wrap: 'PageWrapper', hindi: 'जीएसटी' },
  '/tax-calculator': { c: 'TaxCalculatorTool', f: '../react-pages/BusinessTools', wrap: 'PageWrapper', hindi: 'आयकर' },
  '/salary-slip': { c: 'SalaryTool', f: '../react-pages/BusinessTools', wrap: 'PageWrapper', hindi: 'वेतन पर्ची' },
  '/legal-hub': { c: 'LegalHubTool', f: '../react-pages/BusinessTools', wrap: 'PageWrapper', hindi: 'कानूनी दस्तावेज़' },
  '/sip-calculator': { c: 'SipCalcTool', f: '../react-pages/BusinessTools', wrap: 'PageWrapper', hindi: 'एसआईपी कैलकुलेटर' },
  '/hra-calculator': { c: 'HraCalcTool', f: '../react-pages/BusinessTools', wrap: 'PageWrapper', hindi: 'एचआरए कैलकुलेटर' },
  '/fd-calculator': { c: 'FdCalcTool', f: '../react-pages/BusinessTools', wrap: 'PageWrapper', hindi: 'एफडी कैलकुलेटर' },
  '/receipt-maker': { c: 'ReceiptTool', f: '../react-pages/BusinessTools', wrap: 'PageWrapper', hindi: 'रसीद' },
  '/estimate-generator': { c: 'EstimateTool', f: '../react-pages/BusinessTools', wrap: 'PageWrapper', hindi: 'अनुमान' },
  '/business-name': { c: 'BizNameTool', f: '../react-pages/BusinessTools', wrap: 'PageWrapper', hindi: 'बिज़नेस नाम' },
  '/gstin-verify': { c: 'GstinVerifyTool', f: '../react-pages/BusinessTools', wrap: 'PageWrapper', hindi: 'जीएसटीएन सत्यापन' },
  '/qr-generator': { c: 'QrTool', f: '../react-pages/BusinessTools', wrap: 'PageWrapper', hindi: 'क्यूआर' },

  // Students (skip cgpa-calculator as already done)
  '/attendance-calculator': { c: 'AttendanceCalc', f: '../react-pages/students', wrap: 'PageWrapper', hindi: 'उपस्थिति कैलकुलेटर' },
  '/percentage-calculator': { c: 'PercentageCalc', f: '../react-pages/students', wrap: 'PageWrapper', hindi: 'प्रतिशत कैलकुलेटर' },
  '/pomodoro-timer': { c: 'PomodoroTimer', f: '../react-pages/students', wrap: 'PageWrapper', hindi: 'पोमोडोरो टाइमर' },
  '/bonafide-certificate': { c: 'BonafideCertificate', f: '../react-pages/students', wrap: 'PageWrapper', hindi: 'बोनाफाइड सर्टिफिकेट' },
  '/noc-generator': { c: 'NocGenerator', f: '../react-pages/students', wrap: 'PageWrapper', hindi: 'एनओसी लेटर' },
  '/resume-builder': { c: 'ResumeBuilder', f: '../react-pages/students', wrap: 'PageWrapper', hindi: 'रिज्यूमे बनाएं' },
  '/sop-generator': { c: 'SopGenerator', f: '../react-pages/students', wrap: 'PageWrapper', hindi: 'एसओपी जेनरेटर' },
  '/scholarship-finder': { c: 'ScholarshipFinder', f: '../react-pages/students', wrap: 'PageWrapper', hindi: 'छात्रवृत्ति खोजें' },
  '/study-planner': { c: 'StudyPlanner', f: '../react-pages/students', wrap: 'PageWrapper', hindi: 'स्टडी प्लानर' },
  '/word-counter': { c: 'WordCounter', f: '../react-pages/students', wrap: 'PageWrapper', hindi: 'वर्ड काउंटर' },
  '/age-calculator': { c: 'AgeCalculator', f: '../react-pages/students', wrap: 'PageWrapper', hindi: 'आयु कैलकुलेटर' },
  '/youtube-thumbnail-downloader': { c: 'YtThumbnailDownloader', f: '../react-pages/students', wrap: 'PageWrapper', hindi: 'थंबनेल डाउनलोडर' },
  '/job-finder': { c: 'JobFinder', f: '../react-pages/students', wrap: 'PageWrapper', hindi: 'जॉब फाइंडर' },

  // PDF Tools
  '/pdf-tools/compress-pdf': { c: 'PdfCompressor', f: '../../react-pages/pdf', wrap: 'PdfPageWrapper', hindi: 'पीडीएफ कम्प्रेस करें' },
  '/pdf-tools/image-to-pdf': { c: 'ImageToPdf', f: '../../react-pages/pdf', wrap: 'PdfPageWrapper', hindi: 'इमेज से पीडीएफ' },
  '/pdf-tools/pdf-to-jpg': { c: 'PdfToJpg', f: '../../react-pages/pdf', wrap: 'PdfPageWrapper', hindi: 'पीडीएफ से इमेज' },
  '/pdf-tools/merge-pdf': { c: 'MergePdf', f: '../../react-pages/pdf', wrap: 'PdfPageWrapper', hindi: 'पीडीएफ मर्ज करें' },
  '/pdf-tools/split-pdf': { c: 'SplitPdf', f: '../../react-pages/pdf', wrap: 'PdfPageWrapper', hindi: 'पीडीएफ स्प्लिट करें' },
  '/pdf-tools/compress-image': { c: 'ImageCompressor', f: '../../react-pages/pdf', wrap: 'PdfPageWrapper', hindi: 'इमेज कम्प्रेस करें' },
  '/pdf-tools/word-to-pdf': { c: 'WordToPdf', f: '../../react-pages/pdf', wrap: 'PdfPageWrapper', hindi: 'वर्ड से पीडीएफ' },
  '/pdf-tools/pdf-to-word': { c: 'PdfToWord', f: '../../react-pages/pdf', wrap: 'PdfPageWrapper', hindi: 'पीडीएफ से वर्ड' },
  '/pdf-tools/watermark-pdf': { c: 'WatermarkPdf', f: '../../react-pages/pdf', wrap: 'PdfPageWrapper', hindi: 'वाटरमार्क लगाएं' },

  // Core Pages
  '/students': { c: 'StudentHome', f: '../react-pages/students', wrap: 'None' },
  '/pdf-tools': { c: 'PdfHome', f: '../react-pages/pdf', wrap: 'None' },
};

function generateAstroFiles() {
  const pagesDir = path.join(__dirname, 'src', 'pages');

  routes.forEach(route => {
    if (route.path === '/cgpa-calculator' || route.path === '/') return;
    
    const mapping = COMPONENT_MAP[route.path];
    if (!mapping) {
      console.log('Skipping', route.path);
      return;
    }

    const cleanTitle = route.title.replace(' | ToolsWaala', '');
    let breadcrumb = '<nav><a href="/">Home</a>';
    if (route.path.includes('/pdf-tools/')) breadcrumb += ' &gt; <a href="/pdf-tools">PDF Tools</a>';
    else if (route.path.includes('/blog/')) breadcrumb += ' &gt; <a href="/blog">Blog</a>';
    else if (['/cgpa-calculator','/attendance-calculator','/percentage-calculator','/pomodoro-timer','/resume-builder','/sop-generator','/scholarship-finder','/study-planner','/word-counter','/age-calculator','/youtube-thumbnail-downloader','/bonafide-certificate','/noc-generator','/job-finder'].includes(route.path)) breadcrumb += ' &gt; <a href="/students">Student Tools</a>';
    breadcrumb += ` &gt; ${cleanTitle}</nav>`;

    let extra = PAGE_CONTENT[route.path] || '';
    
    let faqSchemaStr = '';
    let faqHtml = '';
    const faqs = PAGE_FAQS[route.path];
    if (faqs && faqs.length > 0) {
      const faqItems = faqs.map(f => `{"@type":"Question","name":"${f.q}","acceptedAnswer":{"@type":"Answer","text":"${f.a}"}}`).join(',');
      faqSchemaStr = `<script type="application/ld+json" is:inline>{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[${faqItems}]}</script>\n`;
      faqHtml = '<h2>Frequently Asked Questions</h2>';
      faqs.forEach(f => { faqHtml += `<h3>${f.q}</h3><p>${f.a}</p>`; });
    }

    let bcItems = [{ name: 'Home', url: 'https://toolswaala.in/' }];
    if (route.path.includes('/pdf-tools/')) bcItems.push({ name: 'PDF Tools', url: 'https://toolswaala.in/pdf-tools' });
    bcItems.push({ name: cleanTitle, url: `https://toolswaala.in${route.path}` });
    const bcSchema = `<script type="application/ld+json" is:inline>{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[${bcItems.map((b,i) => `{"@type":"ListItem","position":${i+1},"name":"${b.name}","item":"${b.url}"}`).join(',')}]}</script>\n`;

    const depthPrefix = route.path.includes('/pdf-tools/') ? '../' : '';
    const layoutPath = depthPrefix + '../layouts/Layout.astro';
    
    let imports = `import Layout from '${layoutPath}';\n`;
    if (mapping.wrap === 'PageWrapper') {
      imports += `import PageWrapper from '${depthPrefix}../components/PageWrapper';\n`;
    } else if (mapping.wrap === 'PdfPageWrapper') {
      imports += `import { PdfPageWrapper } from '${depthPrefix}../react-pages/BusinessTools';\n`; // It's exported from BusinessTools
    }
    
    imports += `import { ${mapping.c} } from '${mapping.f}';\n`;

    let template = `---
${imports}
const title = ${JSON.stringify(cleanTitle)};
const description = ${JSON.stringify(route.desc)};
---

<Layout title={\`\${title} | ToolsWaala\`} description={description} currentPath="${route.path}">
  ${faqSchemaStr}${bcSchema}
`;

    if (mapping.wrap === 'PageWrapper') {
      template += `  <PageWrapper title={title} hindi="${mapping.hindi}" client:load>\n    <${mapping.c} client:only="react" />\n  </PageWrapper>\n`;
    } else if (mapping.wrap === 'PdfPageWrapper') {
      template += `  <PdfPageWrapper title={title} hindi="${mapping.hindi}" client:load>\n    <${mapping.c} client:only="react" />\n  </PdfPageWrapper>\n`;
    } else {
      template += `  <${mapping.c} client:only="react" />\n`;
    }

    template += `
  <div style="max-width:800px;margin:40px auto;padding:20px;font-family:system-ui,sans-serif">
    ${breadcrumb}
    <h1>{title}</h1>
    <p>{description}</p>
    ${extra}
    ${faqHtml}
    <p>Free tool by <a href="https://toolswaala.in">ToolsWaala</a> — India's free toolkit. No login required.</p>
  </div>
</Layout>`;

    const destPath = path.join(pagesDir, route.path + '.astro');
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    fs.writeFileSync(destPath, template);
    console.log('Created', destPath);
  });
}

generateAstroFiles();
