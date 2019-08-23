// in puppeteer, Page represents one individual tab
const puppeteer = require('puppeteer');
const sesstionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');
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

test('When signed in, shows logout button', async () => {
  const user = await userFactory(); //userFactory returns a Promise.
  const { session, sig } = sesstionFactory(user);

  await page.setCookie({ name: 'session', value: session });
  await page.setCookie({ name: 'session.sig', value: sig });
  await page.goto('localhost:3000'); // refreshes the page. mimicking sign in.
  await page.waitFor('a[href="/auth/logout"]');

  const logoutText = await page.$eval(
    'a[href="/auth/logout"]',
    el => el.innerHTML
  );
  expect(logoutText).toEqual('Logout');
});
