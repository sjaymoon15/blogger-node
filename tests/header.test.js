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
  // await browser.close();
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

test.only('When signed in, shows logout button', async () => {
  const id = '5d5c0dbbaea52a1cd56f8600';

  const Buffer = require('safe-buffer').Buffer;
  const sessionObject = {
    passport: {
      user: id
    }
  };
  const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString(
    'base64'
  );
  const Keygrip = require('keygrip');
  const keys = require('../config/keys');
  const keygrip = new Keygrip([keys.cookieKey]);
  const sig = keygrip.sign('session=' + sessionString);

  await page.setCookie({ name: 'session', value: sessionString });
  await page.setCookie({ name: 'session.sig', value: sig });

  await page.goto('localhost:3000'); // refreshes the page. mimicking sign in.

  await page.waitFor('a[href="/auth/logout"]');
  const logoutText = await page.$eval(
    'a[href="/auth/logout"]',
    el => el.innerHTML
  );
  expect(logoutText).toEqual('Logout');
});
