const puppeteer = require("puppeteer");
const fs = require("fs");
const csvParser = require("csv-parser");
const { createObjectCsvWriter: createCsvWriter } = require("csv-writer");

async function scrapeEmailsWithDelay(names, delay) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const results = [];
  await page.goto("https://directory.webster.edu/");

  console.log('Delaying for 5 seconds...');
  await new Promise((resolve) => setTimeout(resolve, 5000));

  for (const name of names) {
    try {

      // saerch box
    //   const searchInput = await page.$("input[type='search']");
    //   await searchInput.type(name);
        const nameField = await page.$('#searchDirectoryList');
        await nameField.click();
        await page.type('#searchDirectoryList', name);

      console.log('Delaying for 3 seconds...');
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const emailElement = await page.$("#FacultyEmail"); // Select the element with class "email"
      console.log(emailElement);
        if (emailElement[0]) {
        const emailText = await emailElement[0].evaluate(element => element.textContent); // Get the text content of the element
        const emailAddress = emailText.trim(); // Trim any leading/trailing whitespace
        console.log(emailAddress); // Output the extracted email address
        const data = [
            {
                Professor_name: name,
              Email: emailAddress,
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
          await page.type('#searchDirectoryList', "");
        } else {
        console.log("Email element not found.");
        const data = [
            {
              Professor_name: name,
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
          await page.type('#searchDirectoryList', "");
        }
    } catch (error) {
      console.error(`Error while scraping ${url}: ${error.message}`);
      results.push("Error");
      await page.type('#searchDirectoryList', "");
    }
  }

  await browser.close();
  return results;
}

(async () => {
  const names = [];

  fs.createReadStream("BookstoreInstructorDataForFacultyDirectory.csv")
    .pipe(csvParser())
    .on("data", (row) => {
      names.push(row["Instructor"].trim());
    })
    .on("end", async () => {
    const name2 = [];
      for (let i = 0; i < names.length; i++) {
        // console.log(domains[i]);
        let nameParts = names[i].replace(".", "-");
        nameParts = names[i].split(" ")
        nameParts.join("+")
        // const nameRev = nameParts.join(" ");

        // console.log(nameParts);
        // // Split the name into parts
        // const nameParts = names[i].split(" ");
        // const firstNameInitial = nameParts[0][0];
        // const lastName = nameParts[1];

        // // Create the pattern
        // const pattern = `${firstNameInitial}.+${lastName}`;

        // let domainParts = domains[i].split(".");
        // domainParts = domainParts[0];
        //https://www.uwsuper.edu/about/faculty-staff-directory/lebard-rankila-kim/
        // const url = `https://www.wcmo.edu/fac-staff/directory.html`;
        // urls.push(url);
        name2.push(nameParts)
      }
      console.log(name2);
      const delayBetweenRequests = 5000;
      const emails = await scrapeEmailsWithDelay(name2, delayBetweenRequests);

      // Writing to emails.csv is now done inside the scrapeEmailsWithDelay function
      console.log("Emails scraped and saved to emails.csv");
    });
})();
