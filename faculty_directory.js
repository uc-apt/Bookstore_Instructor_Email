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

      // here the a => anchor tag and .hiddenemail is the class name
      const emailLink = await page.$("a.hiddenemail");

      if (emailLink) {
        const email = await page.evaluate((el) => el.textContent, emailLink);
        console.log(email);
        results.push(email);

        // Write the data to emails.csv immediately after collecting the email
        const data = [
          {
            Professor_URL: url,
            Domain: getDomainFromURL(url),
            Professor_Name: getNameFromURL(url),
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
            Domain: getDomainFromURL(url),
            Professor_Name: getNameFromURL(url),
            Email: "not found",
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

function getDomainFromURL(url) {
  const matches = url.match(
    /https:\/\/www\.coursicle\.com\/([^/]+)\/professors/
  );
  return matches ? matches[1] : "Unknown";
}

function getNameFromURL(url) {
  const matches = url.match(/\/professors\/(.+)$/);
  return matches ? matches[1].replace("+", " ") : "Unknown";
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
        let nameParts = names[i].toLowerCase().replace(".", "-");
        nameParts = nameParts.split(" ").reverse();
        console.log(nameParts)
        const nameRev = nameParts.join("-");

        // console.log(nameParts);
        // // Split the name into parts
        // const nameParts = names[i].split(" ");
        // const firstNameInitial = nameParts[0][0];
        // const lastName = nameParts[1];

        // // Create the pattern
        // const pattern = `${firstNameInitial}.+${lastName}`;

        let domainParts = domains[i].split(".");
        domainParts = domainParts[0];
        //https://www.uwsuper.edu/about/faculty-staff-directory/lebard-rankila-kim/
        const url = `https://www.${domainParts}.edu/about/faculty-staff-directory/${nameRev}/`;
        urls.push(url);
      }
      console.log(urls);
      const delayBetweenRequests = 5000;
      const emails = await scrapeEmailsWithDelay(urls, delayBetweenRequests);

      // Writing to emails.csv is now done inside the scrapeEmailsWithDelay function
      console.log("Emails scraped and saved to emails.csv");
    });
})();
