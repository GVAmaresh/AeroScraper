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
    await page.fill('input[aria-label="Where from?"]', "Bengaluru");
    const fromValue = await page.inputValue('input[aria-label="Where from?"]');

    await page.waitForSelector('input[aria-label="Where to? "]', {
      timeout: 10000,
    });
    await page.fill('input[aria-label="Where to? "]', "Mumbai");
    const toValue = await page.inputValue('input[aria-label="Where to? "]');

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
    await page.fill('input[placeholder="Return"]', "Thu 17 May");
    const returnValue = await page.inputValue('input[placeholder="Return"]');
    console.log("Return:", fromValue, toValue, departureValue, returnValue);

    await page.click(
      "button.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-Bz112c-M1Soyc.nCP5yc.AjY5Oe.LQeN7.TUT4y.zlyfOd"
    );

    await page.waitForTimeout(5000);
    const html = await page.content();

    const $ = cheerio.load(html);

    const flights = [];
    $("ul.Rk10dc li").each((index, element) => {
      const flight = {
        price: $(element).find(".YMlIz.FpEdX").text().trim(),
        departureTime: $(element).find(".YMlIz.ogfYpf.XeyHJ").text().trim(),
        arrivalTime: $(element).find(".YMlIz.ogfYpf.h7Rse").text().trim(),
        airline: $(element).find(".zD7ybd").text().trim(),
        duration: $(element).find(".ogfYpf").text().trim(),
      };
      flights.push(flight);
    });

    await browser.close();
    // res.json({
    //   success: true,
    //   message: "Visited https://www.google.com/travel/flights with Firefox",
    //   flights,
    // });
    res.send(html);
  } catch (error) {
    if (browser) await browser.close();
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
