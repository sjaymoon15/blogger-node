// in puppeteer, Page represents one individual tab
const puppeteer = require('puppeteer');

test('We can launch a browser', async () => {
  // browser represents a browser window
  const browser = await puppeteer.launch({
    headless: false
  }); // puppeteer almost always async
  const page = await browser.newPage();
});
