import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// Blog Data (Manual sync for now or we could import it if we use ESM in node)
const BLOG_POSTS = [
  { slug: "smart-student-bunking-guide-75-percent-attendance", title: "The Smart Student’s Guide to Bunking: How to Maintain 75% Attendance Like a Pro", metaDesc: "Calculated bunking for college students. Learn the 75% rule math and how to use our tracker to never get detained." },
  { slug: "top-fully-funded-scholarships-for-indian-students-2025", title: "Top 10 Fully Funded Scholarships for Indian Students to Study Abroad in 2024-25", metaDesc: "Complete list of fully funded scholarships for Indian students. Cover tuition and living costs for US, UK, and Europe. Apply now for 2025." },
  { slug: "cgpa-to-percentage-guide-2025", title: "CGPA to Percentage: Complete Guide for All Universities 2025", metaDesc: "Convert CGPA to percentage for Mumbai University, AKTU, CBSE and more. Learn the exact formulas for 2025 applications." },
  { slug: "75-percent-attendance-rule-guide", title: "75% Attendance Rule — How Many Classes Can You Miss?", metaDesc: "Calculate how many more classes you can skip to stay above the 75% attendance threshold. Complete guide for college students." },
  { slug: "how-to-make-bonafide-certificate-online", title: "How to Make a Bonafide Certificate Online Free", metaDesc: "Step-by-step guide to generating a bonafide certificate for students. Free online generator and PDF download." },
  { slug: "ats-resume-for-freshers-guide", title: "ATS Resume for Freshers: What Actually Gets You Shortlisted", metaDesc: "How to pass ATS filters with your first resume. Free tips and ATS-friendly resume templates for freshers." },
  { slug: "sop-writing-guide-ms-applications", title: "SOP Writing Guide for MS Applications to US/Canada/UK", metaDesc: "Learn how to write a winning Statement of Purpose for foreign universities. Free structure and AI draft generator." },
  { slug: "gst-invoice-format-india-2025", title: "GST Invoice Format India 2025 — Every Field Explained", metaDesc: "A complete guide to mandatory fields in a GST invoice for Indian SMBs. Stay compliant and ensure your customers get ITC." },
  { slug: "emi-calculator-india-loan-guide", title: "EMI Calculator India — Home, Car & Personal Loan", metaDesc: "Compare different types of loans in India and calculate your monthly EMI instantly with our free tool." },
  { slug: "new-tax-regime-vs-old-tax-regime-2025", title: "New Tax Regime vs Old Tax Regime 2025 — Which Saves More?", metaDesc: "Detailed comparison of Indian tax regimes for FY 2025-26. Find out which regime saves you more money." },
  { slug: "upi-payment-page-for-small-business", title: "UPI Payment Page for Small Business — Free Setup Guide", metaDesc: "Setup a professional payment link for your business. No fees, no gateway, direct bank transfer." },
  { slug: "rent-agreement-format-india-guide", title: "Rent Agreement Format India — What's Legally Required", metaDesc: "What to include in your rental contract. Free rent agreement format for Indian homeowners and tenants." },
  { slug: "compress-pdf-without-losing-quality", title: "Compress PDF Without Losing Quality — Free Online Guide", metaDesc: "How to reduce PDF size for email and portal uploads. Free browser-side tool for 100% privacy." },
  { slug: "convert-image-to-pdf-on-mobile", title: "How to Convert Image to PDF on Mobile — No App Needed", metaDesc: "Combine multiple JPG/PNG images into a single PDF. Free, fast and works on all mobile browsers." }
];

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
  { path: '/cgpa-calculator', title: 'CGPA to Percentage Calculator 2025 | ToolsWaala', desc: 'Calculate CGPA and convert to percentage for all Indian universities. Free SGPA calculator.' },
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
  { path: '/blog', title: 'ToolsWaala Blog — Expert Guides for Students & SMBs | ToolsWaala', desc: 'Learn how to master your digital workflow with expert guides on taxation, PDF management, and student life.' },
];

// Add Blog Posts to routes
BLOG_POSTS.forEach(post => {
  routes.push({
    path: `/blog/${post.slug}`,
    title: `${post.title} | ToolsWaala Blog`,
    desc: post.metaDesc
  });
});

// === SEO CONTENT GENERATION (must be defined before routes loop) ===

// FAQ data for rich snippets (Google shows these in search results)
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

function generateSeoContent(route) {
  const cleanTitle = route.title.replace(' | ToolsWaala', '').replace(' | ToolsWaala Blog', '');
  let breadcrumb = '<nav><a href="/">Home</a>';
  if (route.path.includes('/pdf-tools/')) breadcrumb += ' &gt; <a href="/pdf-tools">PDF Tools</a>';
  else if (route.path.includes('/blog/')) breadcrumb += ' &gt; <a href="/blog">Blog</a>';
  else if (['/cgpa-calculator','/attendance-calculator','/percentage-calculator','/pomodoro-timer','/resume-builder','/sop-generator','/scholarship-finder','/study-planner','/word-counter','/age-calculator','/youtube-thumbnail-downloader','/bonafide-certificate','/noc-generator','/job-finder'].includes(route.path)) breadcrumb += ' &gt; <a href="/students">Student Tools</a>';
  breadcrumb += ` &gt; ${cleanTitle}</nav>`;
  
  let extra = PAGE_CONTENT[route.path] || '';
  if (route.path.includes('/blog/')) {
    const blog = BLOG_POSTS.find(b => route.path.includes(b.slug));
    if (blog) extra = `<p>${blog.metaDesc}</p><p><a href="/blog">Browse all articles</a></p>`;
  } else if (route.path === '/blog') {
    extra = '<p>Expert guides for students and businesses.</p>';
    BLOG_POSTS.forEach(b => { extra += `<p><a href="/blog/${b.slug}">${b.title}</a></p>`; });
  }
  
  let faqSchema = '';
  let faqHtml = '';
  const faqs = PAGE_FAQS[route.path];
  if (faqs && faqs.length > 0) {
    const faqItems = faqs.map(f => `{"@type":"Question","name":"${f.q}","acceptedAnswer":{"@type":"Answer","text":"${f.a}"}}`).join(',');
    faqSchema = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[${faqItems}]}</script>`;
    faqHtml = '<h2>Frequently Asked Questions</h2>';
    faqs.forEach(f => { faqHtml += `<h3>${f.q}</h3><p>${f.a}</p>`; });
  }
  
  let bcItems = [{ name: 'Home', url: 'https://toolswaala.in/' }];
  if (route.path.includes('/pdf-tools/')) bcItems.push({ name: 'PDF Tools', url: 'https://toolswaala.in/pdf-tools' });
  else if (route.path.includes('/blog/')) bcItems.push({ name: 'Blog', url: 'https://toolswaala.in/blog' });
  bcItems.push({ name: cleanTitle, url: `https://toolswaala.in${route.path}` });
  const bcSchema = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[${bcItems.map((b,i) => `{"@type":"ListItem","position":${i+1},"name":"${b.name}","item":"${b.url}"}`).join(',')}]}</script>`;
  
  return `${faqSchema}${bcSchema}<div style="max-width:800px;margin:40px auto;padding:20px;font-family:system-ui,sans-serif">${breadcrumb}<h1>${cleanTitle}</h1><p>${route.desc}</p>${extra}${faqHtml}<p>Free tool by <a href="https://toolswaala.in">ToolsWaala</a> — India's free toolkit. No login required.</p></div>`;
}

// Pre-render meta tags AND body content for each route
routes.forEach(route => {
  const dir = path.join(distDir, route.path.slice(1));
  fs.mkdirSync(dir, { recursive: true });
  
  let html = indexHtml;
  html = html.replace(/<title>.*<\/title>/, `<title>${route.title}</title>`);
  html = html.replace(/<meta name="title" content="[^"]*"/, `<meta name="title" content="${route.title}"`);
  html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${route.desc}"`);
  html = html.replace(/<meta property="og:title" content="[^"]*"/g, `<meta property="og:title" content="${route.title}"`);
  html = html.replace(/<meta property="og:description" content="[^"]*"/g, `<meta property="og:description" content="${route.desc}"`);
  html = html.replace(/<meta property="twitter:title" content="[^"]*"/g, `<meta property="twitter:title" content="${route.title}"`);
  html = html.replace(/<meta property="twitter:description" content="[^"]*"/g, `<meta property="twitter:description" content="${route.desc}"`);
  // Add canonical
  html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="https://toolswaala.in${route.path}"`);
  
  // CRITICAL: Inject real content inside <div id="root"> so Googlebot sees text
  const seoContent = generateSeoContent(route);
  html = html.replace('<div id="root"></div>', `<div id="root">${seoContent}</div>`);
  
  fs.writeFileSync(path.join(dir, 'index.html'), html);
});

// Also inject content into the main index.html (homepage)
let homeHtml = indexHtml;
const homeContent = `
<div style="max-width:800px;margin:40px auto;padding:20px;font-family:system-ui,sans-serif">
  <h1>ToolsWaala — Free Online Tools for Indian Students & Small Businesses</h1>
  <p>ToolsWaala is India's most comprehensive free toolkit with 38+ online tools. No login required, no file uploads, 100% privacy. Built for college students, freelancers, and small business owners across India.</p>
  <h2>Free Student Tools</h2>
  <p>Whether you're preparing for semester exams or applying for jobs, these tools are designed for every Indian college student.</p>
  <ul>
    <li><a href="/cgpa-calculator">CGPA to Percentage Calculator</a> — Convert CGPA for Mumbai University, VTU, AKTU, Anna University, SPPU, CBSE and 20+ more</li>
    <li><a href="/attendance-calculator">Attendance & Bunk Calculator</a> — Track the 75% attendance rule mandated by UGC. Calculate safe bunks per subject</li>
    <li><a href="/percentage-calculator">Marks & Percentage Calculator</a> — Semester results, CBSE board grading, and target marks calculator</li>
    <li><a href="/resume-builder">Free Resume Builder for Freshers</a> — ATS-friendly resumes optimized for Naukri, LinkedIn, and campus placements</li>
    <li><a href="/sop-generator">SOP Generator</a> — AI-powered Statement of Purpose for MS, MBA, PhD, and scholarship applications</li>
    <li><a href="/scholarship-finder">Scholarship Finder India</a> — 35+ verified government and private scholarships with deadlines</li>
    <li><a href="/pomodoro-timer">Pomodoro Study Timer</a> — Focus timer with lofi beats, session tracking, and productivity history</li>
    <li><a href="/study-planner">Study Planner</a> — Exam countdown, weekly timetable, priority tasks, and study streak tracker</li>
    <li><a href="/word-counter">Word & Character Counter</a> — Count words, characters, sentences with readability score and keyword density</li>
    <li><a href="/age-calculator">Age Calculator</a> — Exact age in years, months, days with zodiac sign and birthday countdown</li>
    <li><a href="/youtube-thumbnail-downloader">YouTube Thumbnail Downloader</a> — Download HD thumbnails from any YouTube video</li>
    <li><a href="/bonafide-certificate">Bonafide Certificate Generator</a> — Print-ready bonafide certificates for college students</li>
    <li><a href="/noc-generator">NOC Letter Generator</a> — No Objection Certificates for internships and events</li>
    <li><a href="/job-finder">Job Finder</a> — Sarkari Naukri, private jobs, internships, admit cards, and exam results</li>
  </ul>
  <h2>Free Business & Finance Tools</h2>
  <p>Professional tools for freelancers, small business owners, and startups in India. Generate invoices, calculate taxes, and manage finances.</p>
  <ul>
    <li><a href="/gst-invoice">GST Invoice Generator</a> — Professional GST-compliant invoices with HSN codes and PDF export</li>
    <li><a href="/emi-calculator">EMI Calculator India</a> — Home loan, car loan, and personal loan EMI with amortization schedule</li>
    <li><a href="/tax-calculator">Income Tax Calculator 2025-26</a> — Compare Old vs New tax regime. See which saves you more money</li>
    <li><a href="/gst-calculator">GST Calculator</a> — Add or remove GST instantly. Supports all Indian GST slabs (5%, 12%, 18%, 28%)</li>
    <li><a href="/sip-calculator">SIP Calculator</a> — Mutual fund SIP return estimator with visual growth charts</li>
    <li><a href="/upi-payment">UPI Payment Page</a> — Create a shareable payment link with QR code for your business</li>
    <li><a href="/salary-slip">Salary Slip Generator</a> — CTC breakdown with PF, ESI, and New Tax Regime TDS</li>
    <li><a href="/fd-calculator">FD Calculator</a> — Fixed deposit maturity and interest calculator for SBI, HDFC, ICICI, and more</li>
    <li><a href="/hra-calculator">HRA Calculator</a> — House Rent Allowance tax exemption under Section 10(13A)</li>
    <li><a href="/legal-hub">Legal Agreement Generator</a> — Rent agreements, NDAs, and MSAs. No lawyer needed</li>
    <li><a href="/qr-generator">QR Code Generator</a> — Custom QR codes for URL, UPI, WhatsApp, WiFi and more</li>
  </ul>
  <h2>Free PDF Tools — 100% Private, No Upload</h2>
  <p>All PDF tools run entirely in your browser. Your files never leave your device. No server uploads, no data collection.</p>
  <ul>
    <li><a href="/pdf-tools/compress-pdf">Compress PDF</a> — Reduce PDF file size for email and portal uploads</li>
    <li><a href="/pdf-tools/image-to-pdf">Image to PDF</a> — Convert JPG, PNG images to professional PDF documents</li>
    <li><a href="/pdf-tools/merge-pdf">Merge PDF</a> — Combine multiple PDF files into one document</li>
    <li><a href="/pdf-tools/split-pdf">Split PDF</a> — Extract specific pages from PDF files</li>
    <li><a href="/pdf-tools/compress-image">Image Compressor</a> — Resize images for exam portal uploads (under 100KB/200KB)</li>
    <li><a href="/pdf-tools/word-to-pdf">Word to PDF</a> — Convert DOCX to PDF in browser</li>
  </ul>
  <h2>Why ToolsWaala?</h2>
  <p>Unlike other tool websites, ToolsWaala is built specifically for Indian users. All calculators use Indian tax rules, university grading systems, and financial regulations. Every tool is completely free, requires no login, and works offline after loading. Your privacy is guaranteed — no files are ever uploaded to any server.</p>
  <h2>Frequently Asked Questions</h2>
  <h3>Is ToolsWaala really free?</h3>
  <p>Yes, all 38+ tools on ToolsWaala are 100% free. No hidden charges, no premium tier, no login required.</p>
  <h3>Is my data safe?</h3>
  <p>Absolutely. All tools run entirely in your browser. PDF tools process files locally — nothing is uploaded to any server. Your data never leaves your device.</p>
  <h3>Who is ToolsWaala for?</h3>
  <p>ToolsWaala is designed for Indian college students, freelancers, small business owners, and anyone who needs quick digital tools without the hassle of downloading apps or creating accounts.</p>
</div>`;
homeHtml = homeHtml.replace('<div id="root"></div>', `<div id="root">${homeContent}</div>`);
fs.writeFileSync(path.join(distDir, 'index.html'), homeHtml);
// Generate sitemap.xml
const today = new Date().toISOString().split('T')[0];
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
sitemap += `  <url><loc>https://toolswaala.in/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>\n`;
routes.forEach(r => {
  let prio = '0.9';
  if (r.path.includes('pdf-tools/')) prio = '0.8';
  if (r.path.includes('/blog/')) prio = '0.7';
  if (r.path === '/blog' || r.path === '/students' || r.path === '/pdf-tools') prio = '0.9';
  
  sitemap += `  <url><loc>https://toolswaala.in${r.path}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${prio}</priority></url>\n`;
});
sitemap += `</urlset>`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);

console.log(`Prerendering complete: ${routes.length} routes + sitemap.xml generated.`);
