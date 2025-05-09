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
    await page.goto(
      "https://www.kayak.co.in/flights/DEL-BLR/2025-05-12/2025-05-14?ucs=4vjsiq&sort=bestflight_a"
    );
    await page.waitForTimeout(5000);
    console.log("New URL:", page.url());
    const html = await page.content();
    const $ = cheerio.load(html);
    const divs = [];

    $(
      "div.yuAt.yuAt-pres-rounded.yuAt-mod-box-shadow.yuAt-mod-responsive-margins"
    ).each((i, el) => {
      const childrenHtml = $(el)
      .children()
      .map((j, child) => $(child).html().trim())
      .get();
      if (childrenHtml.length == 1) {
        divs.push(...childrenHtml);
      }
    });

    await browser.close();
    res.json({ count: divs.length, divs });
  } catch (error) {
    if (browser) await browser.close();
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
