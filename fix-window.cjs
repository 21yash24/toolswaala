const fs = require('fs');
function fix(file) {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');
  // Replace window.location.href inside JSX template strings with safe check
  code = code.replace(/\$\{window\.location\.href\}/g, "${typeof window !== 'undefined' ? window.location.href : 'https://www.toolswaala.in'}");
  
  // also fix window.location.href outside template strings
  code = code.replace(/url\:\s*window\.location\.href/g, "url: typeof window !== 'undefined' ? window.location.href : 'https://www.toolswaala.in'");
  
  fs.writeFileSync(file, code);
  console.log('Fixed window in', file);
}
fix('/Users/yashjha/.gemini/antigravity/scratch/toolswaala/frontend-astro/src/shared/PdfPageWrapper.jsx');
fix('/Users/yashjha/.gemini/antigravity/scratch/toolswaala/frontend-astro/src/shared/StudentPageWrapper.jsx');
fix('/Users/yashjha/.gemini/antigravity/scratch/toolswaala/frontend-astro/src/components/PageWrapper.jsx');
