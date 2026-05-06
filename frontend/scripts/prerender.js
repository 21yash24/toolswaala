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

// Pre-render meta tags for each route
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
  
  fs.writeFileSync(path.join(dir, 'index.html'), html);
});

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
