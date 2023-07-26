const url = `https://hunter.io/v2/domains-suggestion?query=Lake Washington Institute of Technology University College`
// FETCH(url)
const axios = require('axios');
// Replace with your URL

const fetchData = async () => {
    await axios.get(url)
      .then((response) => {
        const jsonData = response.data;
        console.log(jsonData.data[0].domain);
        // Process the JSON data here
      })
      .catch((error) => {
        console.error('Error:', error.message);
      });
      
}

fetchData(url)