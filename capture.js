const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set viewport to TRMNL X resolution
  await page.setViewport({ width: 1872, height: 1404 });
  
  await page.goto(process.env.DASHBOARD_URL, { waitUntil: 'networkidle2' });
  
  // Wait for Looker widgets to render (adjust selector or timeout as needed)
  await new Promise(r => setTimeout(r, 5000)); 
  
  await page.screenshot({ path: 'raw.png' });

  await browser.close();
}

run().catch(error => {
  console.error("FATAL EXTRACTION ERROR:", error);
  process.exit(1); 
});
