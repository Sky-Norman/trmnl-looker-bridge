const puppeteer = require('puppeteer');
const sharp = require('sharp'); // Add the image processor

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1872, height: 1404 });
  await page.goto(process.env.DASHBOARD_URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 10000)); 
  
  // 1. Capture original full-color screenshot
  const rawBuffer = await page.screenshot({ type: 'png' });

  // 2. Process into 4-bit (16-level) Grayscale
  console.log('Converting to 4-bit grayscale...');
  const processedBuffer = await sharp(rawBuffer)
    .grayscale()
    .png({ palette: true, colors: 16 }) 
    .toBuffer();

  // 3. Push the validated image
  console.log('Pushing payload to TRMNL...');
  const response = await fetch(process.env.TRMNL_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'image/png' },
    body: processedBuffer
  });

  console.log(response.ok ? 'Success!' : `Error: ${response.status}`);
  await browser.close();
})();
