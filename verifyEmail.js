import  XLSX from 'xlsx'
import fetch from 'node-fetch'
// Read the Excel file
const workbook = XLSX.readFile('./updatedData.xlsx');

// Get the first sheet name
const sheetName = workbook.SheetNames[0];

// Get the worksheet
const worksheet = workbook.Sheets[sheetName];

// Convert the worksheet to JSON
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// const basicUrl = `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=c1b4b6a557ab5d539465133bc6054cc41ade1e09`

const isValid = [];
const score = [];

jsonData.forEach(async (row)=>{
    // row[6] => have the email address
    await fetch(`https://api.hunter.io/v2/email-verifier?email=${row[6]}&api_key=c1b4b6a557ab5d539465133bc6054cc41ade1e09`)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Handle the data
        console.log(`checking for...${row[6]}`)
        isValid.push(data.data.status);
        score.push(data.data.score);
        console.log('validity :',data.data.status)
        console.log('score:',data.data.score)
    })
    .catch(error => {
        // Handle any errors
        console.error('Error:', error);
    });
})

console.log()