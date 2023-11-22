const https = require('https');

var request = require('request');

//------------this is for financial data of the company and this api is working--------------

const options = {
    hostname: 'financialmodelingprep.com',
    port: 443,
    // path: 'https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=n6Tq6lLmtNwUlN4JB5JyGkrTRlZBsu4h',
    path: "wss://crypto.financialmodelingprep.com&apikey=n6Tq6lLmtNwUlN4JB5JyGkrTRlZBsu4h",
    method: 'GET'
}

const req = https.request(options, (res) => {
    res.on('data', (d) => {
        process.stdout.write(d)
    })
})

req.on('error', (error) => {
    console.error(error)
})

req.end()

//--------------here this financial data api ends---------------



// replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
// var url = 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=INR&apikey=AHWNG05CHF73W0IQ';

// request.get({
//     url: url,
//     json: true,
//     headers: { 'User-Agent': 'request' }
// }, (err, res, data) => {
//     if (err) {
//         console.log('Error:', err);
//     } else if (res.statusCode !== 200) {
//         console.log('Status:', res.statusCode);
//     } else {
//         // data is successfully parsed as a JSON object:
//         console.log(data);
//     }
// });