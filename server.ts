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
const flights = [];
    $("div.yuAt.yuAt-pres-rounded.yuAt-mod-box-shadow.yuAt-mod-responsive-margins").each((i, el) => {
  const childrenHtml = $(el)
    .children()
    .map((j, child) => $(child).html().trim())
    .get();

  if (childrenHtml.length === 1) {
    const childHtml = childrenHtml[0];
    const inner$ = cheerio.load(childHtml);

    const airline = inner$("div.J0g6-operator-text").text().trim();
    const priceText = inner$("div.e2GB-price-text").text().trim();
    const price = priceText.replace(/[^\d]/g, "");
    const flightClass = inner$("div.DOum-name").text().trim();
    const seatsAvailable = inner$("div.M_JD-num-sites-label").text().trim();

    const flightDetails = [];

    inner$("ol.hJSA-list > li.hJSA-item").each((i, new_el) => {
      const routeContainer = inner$(new_el);

      const departureTime = routeContainer.find("div.VY2U .vmXl span").first().text().trim();
      const arrivalTime = routeContainer.find("div.VY2U .vmXl span").last().text().trim();

      const airports = routeContainer.find("span.jLhY-airport-info span")
        .map((i, el) => inner$(el).text().trim())
        .get();

      const fromAirportCode = airports[0] || "N/A";
      const fromAirportName = airports[1] || "N/A";
      const toAirportCode = airports[2] || "N/A";
      const toAirportName = airports[3] || "N/A";

      const duration = routeContainer.find("div.xdW8 .vmXl").text().trim() || "N/A";
      const stops = routeContainer.find("span.JWEO-stops-text").text().trim() || "N/A";

      flightDetails.push({
        Airline: airline,
        "Flight Route": `${fromAirportCode} (${fromAirportName}) → ${toAirportCode} (${toAirportName})`,
        Departure: departureTime,
        Arrival: arrivalTime,
        Duration: duration,
        Stops: stops,
      });
    });

    flights.push({
      flights: flightDetails,
      airLine: airline,
      Price: `₹${price}`,
      class: flightClass,
      seats: seatsAvailable,
    });
    // flights.push(childrenHtml[0])
  }
});

    await browser.close();
    res.json({ count: flights.length, flights });
  } catch (error) {
    if (browser) await browser.close();
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
