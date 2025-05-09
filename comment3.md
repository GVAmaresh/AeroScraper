const express = require("express");
const { firefox } = require("playwright");

const app = express();
const PORT = 3000;
const cheerio = require("cheerio");

app.get("/visit", async (req, res) => {
  let browser;
  try {
    browser = await firefox.launch();
    const page = await browser.newPage();
    await page.goto("https://www.google.com/travel/flights");

    await page.waitForSelector('input[aria-label="Where from?"]', {
      timeout: 10000,
    });
    await page.fill('input[aria-label="Where from?"]', "Mumbai");
    const fromValue = await page.inputValue('input[aria-label="Where from?"]');

    // await page.waitForSelector('input[aria-label="Where to? "]', {
    //   timeout: 10000,
    // });
    // await page.fill('input[aria-label="Where to? "]', "Mumbai");
    // const toValue = await page.inputValue('input[aria-label="Where to? "]');

    // "Where to?"
    // await page.waitForSelector('input[placeholder="Where to?"]', {
    //   timeout: 10000,
    // });
    // await page.fill('input[placeholder="Where to?"]', "Bengaluru");
    // const toValue = await page.inputValue('input[placeholder="Where to?"]');

    await page.waitForSelector('input[placeholder="Departure"]', {
      timeout: 10000,
    });
    await page.fill('input[placeholder="Departure"]', "Thu 15 May");
    const departureValue = await page.inputValue(
      'input[placeholder="Departure"]'
    );

    await page.waitForSelector('input[placeholder="Return"]', {
      timeout: 10000,
    });
    await page.fill('input[placeholder="Return"]', "Sat 17 May");
    const returnValue = await page.inputValue('input[placeholder="Return"]');
    console.log("Return:", fromValue, departureValue, returnValue);

    await page.click(
      "button.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-Bz112c-M1Soyc.nCP5yc.AjY5Oe.LQeN7.TUT4y.zlyfOd"
    );

    await page.waitForTimeout(5000);

    await page.waitForSelector('input[placeholder="Where to?"]', {
      timeout: 10000,
    });
  await page.click('input[placeholder="Where to?"]')
    // await page.fill('input[placeholder="Where to?"]', "Mumbai");
    
    // await page.waitForSelector('input.II2One.j0Ppje.zmMKJ.LbIaRd.VfPpkd-ksKsZd-mWPk3d-OWXEXe-AHe6Kc-XpnDCe"]', {
    //   timeout: 10000,
    // });
    await page.fill('input.II2One.j0Ppje.zmMKJ.LbIaRd.VfPpkd-ksKsZd-mWPk3d-OWXEXe-AHe6Kc-XpnDCe', "Bengaluru");
    await page.fill('input[placeholder="Where to?"]', "Bengaluru");

    const toValue2 = await page.inputValue('input[placeholder="Where to?"]');


    // await page.waitForURL(url => url.includes("/flights/search"), { timeout: 15000 });
    // await page.waitForURL(url => url.toString().includes("/flights/search"), { timeout: 15000 });
    // await Promise.all([
    //   page.waitForNavigation(),
    //   page.click('button#submit')
    // ]);
    // await page.waitForURL('**/flights/search*')
    console.log(toValue2)
    await page.waitForTimeout(5000);
    console.log("New URL:", page.url());

    await page.waitForSelector("div[jscontroller] .YMlIz", { timeout: 15000 });

    const flights = await page.evaluate(() => {
      const rows = document.querySelectorAll("ul.Rk10dc li");
      return Array.from(rows).map((row) => {
        const getText = (selector) => {
          const el = row.querySelector(selector);
          return el ? el.textContent.trim() : "";
        };
        return {
          price: getText(".YMlIz.FpEdX"),
          departureTime: getText(".YMlIz.ogfYpf.XeyHJ"),
          arrivalTime: getText(".YMlIz.ogfYpf.h7Rse"),
          airline: getText(".zD7ybd"),
          duration: getText(".ogfYpf"),
        };
      });
    });

    await browser.close();
    res.json({ success: true, flights });
    
  } catch (error) {
    if (browser) await browser.close();
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
