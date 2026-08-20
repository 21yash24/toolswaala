import fs from 'fs';
import path from 'path';

const host = "www.toolswaala.in";
const key = "8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d";
const keyLocation = `https://${host}/${key}.txt`;

// Read sitemap XML
const sitemapPath = path.resolve('dist/sitemap-0.xml');
let urlList = [];

if (fs.existsSync(sitemapPath)) {
  const content = fs.readFileSync(sitemapPath, 'utf8');
  const matches = content.match(/<loc>(.*?)<\/loc>/g);
  if (matches) {
    urlList = matches.map(m => m.replace(/<\/?loc>/g, '').trim());
  }
}

if (urlList.length === 0) {
  urlList = [
    `https://${host}/`,
    `https://${host}/cgpa-calculator`,
    `https://${host}/attendance-calculator`,
    `https://${host}/gst-invoice`,
    `https://${host}/tax-calculator`,
    `https://${host}/legal-hub`,
    `https://${host}/pdf-tools`
  ];
}

console.log(`📡 Preparing IndexNow submission for ${urlList.length} URLs across www.toolswaala.in...`);

const payload = {
  host: host,
  key: key,
  keyLocation: keyLocation,
  urlList: urlList
};

fetch("https://www.bing.com/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload)
}).then(res => {
  console.log(`Bing IndexNow Response: ${res.status} ${res.statusText}`);
  if (res.status === 200 || res.status === 202) {
    console.log(`🚀 SUCCESS: ${urlList.length} URLs successfully submitted to Bing, Yandex, Seznam & Naver!`);
  }
}).catch(err => {
  console.error("IndexNow Submission Error:", err);
});
