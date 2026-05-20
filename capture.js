const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1872, height: 1404 });
  await page.goto(process.env.DASHBOARD_URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 10000)); // Let Looker finish rendering
  const screenshotBuffer = await page.screenshot({ type: 'png' });
  await fetch(process.env.TRMNL_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'image/png' },
    body: screenshotBuffer
  });
  await browser.close();
})();
