# Flight Scraper

A Node.js typescript based web scraper that extracts detailed flight information including airlines, routes, timings, durations, stops, prices, and classes directly from travel websites

Perfect for building flight comparison apps or for research purposes

---

## Description

Flight Scraper efficiently parses HTML content to deliver structured JSON data with the following details:
- Airline Name
- Flight Route (Source and Destination Airports)
- Departure and Arrival Times
- Duration of Flight
- Stops Information
- Price and Class Details
- Available Seats (Static/Dynamic)

---

## Features (In Progress)

- ✅ Extracts detailed flight information  
- ✅ Provides structured JSON output for easy API integration  
- ⏳ Dynamic seat availability parsing (Coming Soon)  
- ⏳ Support for multiple travel websites  
- ⏳ Error handling and retry mechanisms  
- ⏳ Proxy integration to bypass request limits (Planned)  
- ⏳ Captcha solver integration (Planned)  
- ⏳ Upgrade to support POST API requests  
- ❌ Currently using direct URLs from the website, including source and destination parameters  
- ❌ Airport code shortcuts (e.g., DEL, BLR) not implemented yet  


---

## Installation

Just copy paste the code
```bash
git clone https://github.com/GVAmaresh/AeroScraper
cd AeroScraper
npm install
npm run dev
```

## How to Run
Open the Postman and make a GET request for below URL:
```
http://localhost:3000/visit
```
This will give the scraper in json format of  the extracted flight 
