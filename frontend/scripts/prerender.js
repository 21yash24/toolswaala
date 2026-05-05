import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

const routes = [
  { path: '/pomodoro-timer', title: 'Pomodoro Timer & Lofi Player | ToolsWaala', desc: 'Free online Pomodoro timer for students. Boost your focus with lofi beats, track your study sessions, and stay motivated.' },
  { path: '/cgpa-calculator', title: 'CGPA to Percentage Calculator | ToolsWaala', desc: 'Calculate your CGPA and convert it to percentage instantly for Indian universities.' },
  { path: '/attendance-calculator', title: 'Attendance & Bunk Calculator | ToolsWaala', desc: 'Track attendance, bunk count & 75% rule check.' },
  { path: '/gst-invoice', title: 'Free GST Invoice Maker | ToolsWaala', desc: 'Generate free, professional GST invoices in seconds with UPI QR codes.' },
  { path: '/legal', title: 'Legal Agreement Hub | ToolsWaala', desc: 'Draft rent agreements, NDA, and employment contracts instantly online.' },
  { path: '/salary', title: 'Free Salary Slip Generator | ToolsWaala', desc: 'Create professional salary slips for your employees in 1 minute.' },
  { path: '/scholarship-finder', title: 'Best Scholarship Finder India | ToolsWaala', desc: 'Find and apply for 30+ latest government and private scholarships with verified deadlines.' },
  { path: '/word-counter', title: 'Free Word & Character Counter | ToolsWaala', desc: 'Count words, characters and reading time instantly in your browser.' },
  { path: '/age-calculator', title: 'Exact Age Calculator | ToolsWaala', desc: 'Calculate your exact age in years, months, and days instantly.' },
  { path: '/youtube-thumbnail-downloader', title: 'YouTube HD Thumbnail Downloader | ToolsWaala', desc: 'Download high-quality YouTube video thumbnails instantly for free.' },
  { path: '/job-finder', title: 'Latest Govt & Private Jobs India | ToolsWaala', desc: 'Track Sarkari Naukri, Admit Cards, Exam Results, and Private Jobs/Internships for freshers in one place.' },
  { path: '/pdf-tools/compress-pdf', title: 'Compress PDF Free | ToolsWaala', desc: 'Reduce PDF file size without losing quality entirely in your browser.' },
  { path: '/pdf-tools/merge-pdf', title: 'Merge PDF Files | ToolsWaala', desc: 'Combine multiple PDF documents into one.' }
];

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
  
  fs.writeFileSync(path.join(dir, 'index.html'), html);
});
console.log('Prerendering meta tags complete.');
