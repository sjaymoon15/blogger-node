// in puppeteer, Page represents one individual tab
const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await page.close();
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
  await page.login();
  const logoutText = await page.$eval(
    'a[href="/auth/logout"]',
    el => el.innerHTML
  );
  expect(logoutText).toEqual('Logout');
});
