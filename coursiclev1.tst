// const puppeteer = require("puppeteer");
// const Excel = require("exceljs");

// // Function to scrape emails from the URLs with a delay between each request
// async function scrapeEmailsWithDelay(urls, delay) {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   const results = [];

//   for (const url of urls) {
//     try {
//       await page.goto(url);

//       const emailLink = await page.$("a.professorEmailLink");
//       if (emailLink) {
//         const email = await page.evaluate((el) => el.textContent, emailLink);
//         console.log(email);
//         results.push(email);
//       } else {
//         results.push("Not found");
//       }

//       // Add a delay between requests
//       await page.waitForTimeout(delay);
//     } catch (error) {
//       console.error(`Error while scraping ${url}: ${error.message}`);
//       results.push("Error");
//     }
//   }

//   await browser.close();
//   return results;
// }

// // Example usage with a delay of 3 seconds between each request
// (async () => {
//   const names = [
//     "John Karabelas",
//     "Peter Mitchell",
//     "Sarah Moore",
//     "Sarah Morath",
//     "Adam Ames",
//     "Adrien Halliez",
//     "Ahmad Obiedat",
//     "Angela King",
//     "Anthony Parent",
//     "Arnav Bhandari",
//     "Betina Wilkinson",
//     "Brenda Gibson",
//     "Catherine Harnois",
//     "Charles Mansfield",
//     "Christine Coughlin",
//     "Christopher Smith",
//     "Cynthia Day",
//     "David Robertson",
//     "Derrick Boone",
//     "Eleni Caldwell",
//     "Elisabeth Whitehead",
//     "Elizabeth Ricks",
//     "Emily Oor",
//     "Ged King",
//     "Jamie Crockett",
//     "Jennifer Rogers",
//     "Jesalyn Bolduc",
//     "Jill Crainshaw",
//     "Joanne Inkman",
//     "John Lukesh",
//     "Jonathan Pinder",
//     "Justin Esarey",
//     "Kathleen Bettencourt",
//     "Kenneth Hoglund",
//     "Kyle Allison",
//     "Mark Welker",
//     "Matthew Garite",
//     "Megan Francisco",
//     "Melissa Maffeo",
//     "Mireille Clough",
//     "Nicholas Kortessis",
//     "Nikki Elston",
//     "Paul Jones",
//     "Peter Santago",
//     "Rebecca Gill",
//     "Remi Lanzoni",
//     "Robert Breckenridge",
//     "Roger Beahm",
//     "S. Beets",
//     "Santiago Suarez",
//     "Sarah Garrison",
//     "Stacie Petter",
//     "Stanley Thomas",
//     "Steve Nickles",
//     "Timothy Davis",
//     "Ulrich Bierbach",
//     "Victor Pauca",
//     "Wei.chin Lee",
//     "Woodrow Hood",
//   ];
//   const urls = [];
//   const domain = "wfu";
//   names.forEach((name) => {
//     let nameParts = name.replace(".", "-");
//     // console.log(nameParts);
//     nameParts = nameParts.split(" ");
//     nameParts = nameParts.join("+");
//     const url = `https://www.coursicle.com/${domain}/professors/${nameParts}`;
//     urls.push(url);
//   });
//   //   console.log(urls);

//   const delayBetweenRequests = 5000; // 3 seconds (3000 milliseconds)

//   const emails = await scrapeEmailsWithDelay(urls, delayBetweenRequests);

//   // Write results to an Excel sheet
//   const workbook = new Excel.Workbook();
//   const worksheet = workbook.addWorksheet("Emails");

//   worksheet.columns = [
//     { header: "Professor Name", key: "name" },
//     { header: "Email", key: "email" },
//   ];

//   for (let i = 0; i < urls.length; i++) {
//     worksheet.addRow({ name: urls[i], email: emails[i] });
//   }

//   await workbook.xlsx.writeFile("emails.xlsx");
//   console.log("Emails scraped and saved to emails.xlsx");
// })();
