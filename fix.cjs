const fs = require('fs');

let code = fs.readFileSync('/Users/yashjha/.gemini/antigravity/scratch/toolswaala/frontend/src/App.jsx', 'utf8');

// Export all components
const funcs = ['UpiTool','GstInvoiceTool','EstimateTool','GstinVerifyTool','QrTool','EmiTool','GstCalcTool','LegalHubTool','SalaryTool','TaxCalculatorTool','ReceiptTool','BizNameTool','SipCalcTool','HraCalcTool','FdCalcTool','StudentPageWrapper','PdfPageWrapper','HomePage','PageWrapper'];

for (const fn of funcs) {
  code = code.replace(new RegExp(`function ${fn}\\(`, 'g'), `export function ${fn}(`);
}

// Remove Link imports
code = code.replace(/import \{.*?Link.*?\} from [\'\"]react-router-dom[\'\"];?/g, '');
code = code.replace(/<Link/g, '<a');
code = code.replace(/<\/Link>/g, '</a>');
code = code.replace(/ to=/g, ' href=');

fs.writeFileSync('/Users/yashjha/.gemini/antigravity/scratch/toolswaala/frontend-astro/src/react-pages/BusinessTools.jsx', code);
