const XLSX = require('xlsx');
// Read the Excel file
const workbook = XLSX.readFile('./data.xlsx');

// Get the first sheet name
const sheetName = workbook.SheetNames[0];

// Get the worksheet
const worksheet = workbook.Sheets[sheetName];

// Convert the worksheet to JSON
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const emailAddrs = [];

jsonData.forEach((row, rowIndex) => {
  const wrdsArr = row[2].split(" ");
  let email = "";
  
  // if (wrdsArr.length === 1) {
  //   email = wrdsArr[0].toLowerCase() + "@" + row[5];
  // } else if (wrdsArr.length === 2) {
  //   email = wrdsArr[0].toLowerCase() + "." + wrdsArr[1].toLowerCase() + "@" + row[5];
  // } else if (wrdsArr.length === 3) {
  //   email = wrdsArr[0].toLowerCase() + "." + wrdsArr[1].toLowerCase() + '.' + wrdsArr[2].toLowerCase() + "@" + row[5];
  // } else {
  //   email = wrdsArr[0].toLowerCase() + "." + wrdsArr[wrdsArr.length - 1].toLowerCase() + "@" + row[5];
  // }
  
  email = wrdsArr[0].toLowerCase() + '@' + row[4];

  emailAddrs.push(email);
  
  // Add the email address to the worksheet in a new column
  const emailColumn = XLSX.utils.encode_cell({ r: rowIndex, c: jsonData[0].length });
  worksheet[emailColumn] = { v: email };
});

// Update the range of the worksheet to accommodate the new column
worksheet['!ref'] = XLSX.utils.encode_range({
  s: { c: 0, r: 0 },
  e: { c: jsonData[0].length, r: jsonData.length }
});

// Write the updated workbook to a new file
XLSX.writeFile(workbook, 'updatedData.xlsx');

console.log(emailAddrs);



