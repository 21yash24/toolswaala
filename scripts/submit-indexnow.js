import fs from 'fs';

const host = "toolswaala.in";
const key = "8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d";
const keyLocation = `https://${host}/${key}.txt`;

const pages = [
  "/", "/cgpa-calculator", "/attendance-calculator", "/percentage-calculator", "/pomodoro-timer",
  "/bonafide-certificate", "/noc-generator", "/resume-builder", "/sop-generator", "/scholarship-finder",
  "/study-planner", "/word-counter", "/age-calculator", "/youtube-thumbnail-downloader", "/job-finder",
  "/upi-payment", "/gst-invoice", "/gstin-verify", "/qr-generator", "/emi-calculator",
  "/gst-calculator", "/estimate-generator", "/legal-hub", "/salary-slip", "/tax-calculator",
  "/receipt-maker", "/business-name", "/sip-calculator", "/hra-calculator", "/fd-calculator",
  "/pdf-tools", "/pdf-tools/compress-pdf", "/pdf-tools/image-to-pdf", "/pdf-tools/pdf-to-jpg",
  "/pdf-tools/merge-pdf", "/pdf-tools/split-pdf", "/pdf-tools/compress-image", "/pdf-tools/word-to-pdf",
  "/pdf-tools/pdf-to-word", "/pdf-tools/watermark-pdf", "/mumbai-university-cgpa-calculator",
  "/vtu-cgpa-calculator", "/anna-university-cgpa-calculator", "/aktu-cgpa-calculator",
  "/ktu-cgpa-calculator", "/sppu-cgpa-calculator", "/delhi-university-cgpa-calculator",
  "/cbse-cgpa-calculator", "/students"
];

const urlList = pages.map(p => `https://${host}${p}`);

const payload = {
  host: host,
  key: key,
  keyLocation: keyLocation,
  urlList: urlList
};

console.log(`Submitting ${urlList.length} URLs to IndexNow (Bing / Yandex)...`);

fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload)
}).then(res => {
  console.log(`IndexNow Submission Status: ${res.status} ${res.statusText}`);
  if (res.status === 200 || res.status === 202) {
    console.log("✅ Successfully pushed all 49 URLs to Bing, Yandex, and IndexNow search engines!");
  }
}).catch(err => {
  console.error("IndexNow error:", err);
});
