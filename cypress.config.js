const { defineConfig } = require("cypress");
const puppeteer = require("puppeteer-core");
const fetch = require("node-fetch");
let debugPort;
let puppeteerInstance;
let address;
let mnemonic;
module.exports = defineConfig({
  e2e: {
    baseUrl: "https://app.aave.com/",
    chromeWebSecurity: true,
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        // supply the absolute path to an unpacked extension's folder
        // NOTE: extensions cannot be loaded in headless Chrome
        launchOptions.args.push("--disable-background-timer-throttling");
        launchOptions.args.push("--disable-backgrounding-occluded-windows");
        launchOptions.args.push("--disable-renderer-backgrounding");
        launchOptions.extensions.push('/home/yasin/work/polkaWallet/cypress/resources/polkadot--js--extension');
        debugPort = launchOptions.args.find(item => item.includes("--remote-debugging-port"));
        debugPort = debugPort.slice(debugPort.indexOf("=")+1);
        return launchOptions;
      });
      on('task', {
        initPuppeteer: async () => {
          puppeteerInstance = await puppeteer.connect({
            browserURL: `http://localhost:${debugPort}`,
            ignoreHTTPSErrors: true,
            defaultViewport: null,
          });
          return puppeteerInstance.isConnected();
        },

        approveWallet: async () => {
          const walletTab = await puppeteerInstance.newPage();
          await walletTab.goto(`chrome-extension://dacijmefdoijcjffojcedddmjnnnimig/index.html#/ `, { waitUntil: 'load' });
          await walletTab.waitForTimeout(2000);
          await walletTab.click("button");
          await walletTab.waitForTimeout(2000);
          await walletTab.click(".image path");
          await walletTab.waitForTimeout(2000);
          await walletTab.waitForSelector('.addressDisplay');
          let element = await walletTab.$('.addressDisplay');
          address = await walletTab.evaluate(el => el.textContent, element);
          address = address.slice(0, -12);
          console.log(address);
          await walletTab.waitForSelector('textarea');
          let seed = await walletTab.$('textarea');
          mnemonic = await walletTab.evaluate(el=> el.textContent, seed);
          let checkbox = await walletTab.$x('//div/label/span');
          await checkbox[0].click();
          await walletTab.waitForTimeout(2000);
          await walletTab.click('.children');
        },

        initializeWallet : async() => {
          const walletTab = await puppeteerInstance.newPage();
          await walletTab.goto(`chrome-extension://dacijmefdoijcjffojcedddmjnnnimig/index.html#/ `, { waitUntil: 'load' });
          await walletTab.waitForTimeout(2000);
          await walletTab.click("button");
          await walletTab.waitForSelector(".popupMenus path");
          await walletTab.click(".popupMenus path");
          await walletTab.waitForSelector("a[href$='seed']");
          await walletTab.click("a[href$='seed']");
          await walletTab.waitForSelector("textarea");
          let inputArea = await walletTab.$("textarea");
          await walletTab.type("textarea", "word chef mind pig scrap pupil biology model soon need brush caution");
          await walletTab.click("button");
          await walletTab.waitForSelector("input");
          await walletTab.type("input", "Test Wallet");
          let passField = await walletTab.$x("//label[contains(text(),'password')]/../input");
          await passField[0].type("0213202");
          passField = await walletTab.$x("//label[contains( text(), 'Repeat') ]/../input");
          await passField[0].type("0213202");
          await walletTab.click(".NextStepButton-sc-26dpu8-0");
          await walletTab.waitForTimeout(2000);
          await walletTab.close();
          return true;
        },
        authorizePablo: async() => {
          const walletTab = await puppeteerInstance.newPage();
          await walletTab.goto(`chrome-extension://dacijmefdoijcjffojcedddmjnnnimig/index.html#/ `, { waitUntil: 'load' });
          return true;
        },
      });
    },
  }
});
