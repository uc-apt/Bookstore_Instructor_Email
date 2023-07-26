const puppeteer = require("puppeteer");
const fs = require("fs");
const csvParser = require("csv-parser");

// Function to scrape emails from the URLs with a delay between each request
async function scrapeEmailsWithDelay(urls, delay) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];

  for (const url of urls) {
    try {
      await page.goto(url);

      const emailLink = await page.$("a.professorEmailLink");
      if (emailLink) {
        const email = await page.evaluate((el) => el.textContent, emailLink);
        console.log(email);
        results.push(email);
      } else {
        console.log("Not found");
        results.push("Not found");
      }

      // Add a delay between requests
      await page.waitForTimeout(delay);
    } catch (error) {
      console.error(`Error while scraping ${url}: ${error.message}`);
      results.push("Error");
    }
  }

  await browser.close();
  return results;
}

(async () => {
  const names = [];
  const domains = [];

  fs.createReadStream("BookstoreInstructorData.csv")
    .pipe(csvParser())
    .on("data", (row) => {
      names.push(row["Instructor"].trim());
      domains.push(row["Domain"].trim());
    })
    .on("end", async () => {
      const urls = [];
      for (let i = 0; i < names.length; i++) {
        let nameParts = names[i].replace(".", "-");
        nameParts = nameParts.split(" ").join("+");
        let domainParts = domains[i].split(".");
        domainParts = domainParts[0];
        // console.log(domainParts);
        const url = `https://www.coursicle.com/${domainParts}/professors/${nameParts}`;
        urls.push(url);
      }
      // console.log(urls);

      const delayBetweenRequests = 5000; // 5 seconds (5000 milliseconds)

      const emails = await scrapeEmailsWithDelay(urls, delayBetweenRequests);

      // Write results to a CSV file
      const resultsArray = urls.map((url, i) => ({
        Professor_URL: url,
        Domain: domains[i],
        Professor_Name: names[i],
        Email: emails[i],
      }));

      const csvWriter = createCsvWriter({
        path: "emails.csv",
        header: [
          { id: "Professor_Name", title: "Professor Name" },
          { id: "Email", title: "Email" },
        ],
      });

      csvWriter.writeRecords(resultsArray).then(() => {
        console.log("Emails scraped and saved to emails.csv");
      });
    });
})();
