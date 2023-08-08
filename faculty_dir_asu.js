const puppeteer = require("puppeteer");
const fs = require("fs");
const csvParser = require("csv-parser");
const { createObjectCsvWriter: createCsvWriter } = require("csv-writer");

async function scrapeEmailsWithDelay(urls, delay) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const results = [];

  for (const url of urls) {
    try {
      await page.goto(url);

      console.log('Delaying for 3 seconds...');
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const anchorSelector = 'a.email'; // Selector for the anchor tag
      const emailLink = await page.$(anchorSelector); // Get the anchor element

      if (emailLink) {
        const email = await emailLink.evaluate(element => element.innerText);
        console.log(email);
        results.push(email);

        // Write the data to emails.csv immediately after collecting the email
        const data = [
          {
            Professor_URL: url,
            Email: email,
          },
        ];

        const csvWriter = createCsvWriter({
          path: "emailsFacultyDirectory.csv",
          header: [
            { id: "Professor_URL", title: "Professor URL" },
            { id: "Domain", title: "Domain" },
            { id: "Professor_Name", title: "Professor Name" },
            { id: "Email", title: "Email" },
          ],
          append: true, // Append mode to add rows to the existing file
        });

        await csvWriter.writeRecords(data);
      } else {
        console.log("Not found");
        results.push("Not found");
        const data = [
          {
            Professor_URL: url,
            Email: "not found",
          },
        ];

        const csvWriter = createCsvWriter({
          path: "emailsFacultyDirectory.csv",
          header: [
            { id: "Professor_URL", title: "Professor URL" },
            { id: "Email", title: "Email" },
          ],
          append: true, // Append mode to add rows to the existing file
        });

        await csvWriter.writeRecords(data);
      }

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

  fs.createReadStream("BookstoreInstructorDataForFacultyDirectory.csv")
    .pipe(csvParser())
    .on("data", (row) => {
      names.push(row["Instructor"].trim());
      domains.push(row["Domain"].trim());
    })
    .on("end", async () => {
      const urls = [];
      for (let i = 0; i < names.length; i++) {
        // console.log(domains[i]);
        let nameParts = names[i].replace(".", "-");
        nameParts = nameParts.toLowerCase();
        nameParts = nameParts.split(" ")
        let name = nameParts.join("-")
        
        let domainParts = domains[i].split(".");
        domainParts = domainParts[0];
        // const url = `https://www.coursicle.com/${domainParts}/professors/${nameParts}/`;
        const url = `https://www.${domainParts}.edu/faculty-and-staff/${name}/`;
        // const url = `https://search.${domainParts}.edu/?search-tabs=web_dir_faculty_staff&q=${name}`
        urls.push(url);
      }
      console.log(urls);
      const delayBetweenRequests = 3000;
      const emails = await scrapeEmailsWithDelay(urls, delayBetweenRequests);

      // Writing to emails.csv is now done inside the scrapeEmailsWithDelay function
      console.log("Emails scraped and saved to emails.csv");
    });
})();
