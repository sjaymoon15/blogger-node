// in puppeteer, Page represents one individual tab
const puppeteer = require('puppeteer');
let browser, page;

beforeEach(async () => {
  // browser represents a browser window
  browser = await puppeteer.launch({
    headless: false
  }); // puppeteer almost always async
  page = await browser.newPage();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await browser.close();
});

test('The header has the correct text', async () => {
  const logoText = await page.$eval('a.brand-logo', el => el.innerHTML);
  expect(logoText).toEqual('Blogster');
});

test('Clicking login starts oauth flow', async () => {
  await page.click('.right a');
  const url = await page.url();
  expect(url).toMatch(/accounts\.google.com/);
});
