const axios = require('axios');


// Define the API URL
const apiUrl = `https://eodhd.com/api/eod/RELIANCE.NSE?fmt=json&api_token=6545e88b34aac9.67172754`;


// Make the GET request using axios
axios.get(apiUrl)
    .then((response) => {
        // Handle the response data
        const fundamentalsData = response.data;
        console.log('Fundamentals Data:', fundamentalsData);
    })
    .catch((error) => {
        // Handle errors
        console.error('Error fetching fundamentals data:', error);
    });