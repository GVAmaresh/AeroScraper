const express = require('express');
const { firefox } = require('playwright');

const app = express();
const PORT = 3000;
const cheerio = require('cheerio')

app.get('/visit', async (req, res) => {
  let browser;
  try {
    browser = await firefox.launch();
    const page = await browser.newPage();
    await page.goto("https://www.google.com/travel/flights");
    
    await page.waitForSelector('input[aria-label="Where from?"]', { timeout: 10000 });
    await page.fill('input[aria-label="Where from?"]', 'Bengaluru');

    await page.waitForSelector('input[aria-label="Where to? "]', { timeout: 10000 });
    await page.fill('input[aria-label="Where to? "]', 'Mumbai');

    await page.waitForSelector('input[placeholder="Departure"]', { timeout: 10000 });
    await page.fill('input[placeholder="Departure"]', 'Thu 15 May');

    await page.waitForSelector('input[placeholder="Return"]', { timeout: 10000 });
    await page.fill('input[placeholder="Return"]', 'Thu 17 May');

    await page.click('button[aria-label="Explore destinations"]');

    await page.waitForTimeout(5000);
    const mainContent = await page.$eval('main.Dy1Pdc.rcycge', el => el.outerHTML);

    const $ = cheerio.load(mainContent);

    // const liTags = $('ol li').map((i, el) => $(el).html()).get();
    const liTags = $('ol li').map((i, el) => {
      const destination = $(el).find('h3.W6bZuc.YMlIz').text();
      const timeToReach = $(el).find('span.Xq1DAb').text();
      const price = $(el).find('span[aria-label]').text().trim();
      const nextPageUrl = $(el).find('a').attr('href'); 

      return {
        destination,
        timeToReach,
        price,
        nextPageUrl
      };
    }).get();

    await browser.close();
    res.json({ success: true, message: 'Visited https://www.google.com/travel/flights with Firefox', liTags});
  } catch (error) {
    if (browser) await browser.close();
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
