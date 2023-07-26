const fs = require('fs');
const XLSX = require('xlsx');

const axios = require('axios');
// Replace with your URL

const fetchData = async (url) => {
    await axios.get(url)
      .then((response) => {
        const jsonData = response.data;
        console.log(jsonData.data[0].domain);
        // Process the JSON data here
        return jsonData.data[0].domain
      })
      .catch((error) => {
        console.error('Error:', error.message);
      });
      
}

// Function to process and update the values
async function processString(input) {
  if (input) {
    // Check if the string contains "Campus"
    if (input.includes('Campus')) {
      input = input.replace('Campus', '');
    }

    // Check if the string contains "Store"
    if (input.includes('Store')) {
      input = input.replace('Store', '');
    }

    // Check if the string contains "Bookstore"
    if (input.includes('Bookstore')) {
      input = input.replace('Bookstore', '');
    }

    // Trim any leading or trailing whitespace
    input = input.trim();

    // Check if the string contains "University"
    if (!input.includes('University') && !input.includes('College')) {
      input += ' University';
      input += ' College';
    }
  }
  const fullQuery = `https://hunter.io/v2/domains-suggestion?query=${input}`
  console.log(fullQuery)
  const result  = await fetchData(fullQuery)
  return result
}

// Read the Excel file
const workbook = XLSX.readFile('./input.xlsx');

// Get the first sheet name
const sheetName = workbook.SheetNames[0];

// Get the worksheet
const worksheet = workbook.Sheets[sheetName];

// Convert the worksheet to JSON
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Access column data by header
const storeDisplaynameColumnIndex = jsonData[0].indexOf('storedisplayname');

let updatedNames = [];

jsonData.forEach((row, rowIndex) => {
  if (rowIndex !== 0) {
    const storeDisplayname = row[storeDisplaynameColumnIndex];
    const updatedName = processString(storeDisplayname);
    row.push(updatedName);
    updatedNames.push(updatedName);
  }
});

// Update the header row with the new column name
jsonData[0].push('Updated Name');

console.log(updatedNames);

// Convert the updated JSON data back to a worksheet
const updatedWorksheet = XLSX.utils.json_to_sheet(jsonData);

// Update the workbook with the modified worksheet
workbook.Sheets[sheetName] = updatedWorksheet;

// Save the updated workbook to the Excel file
XLSX.writeFile(workbook, './output.xlsx');




