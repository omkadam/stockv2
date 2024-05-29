const axios = require('axios');
const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://manthanbodkhe1:Indianarmy13@cluster0.piunjeh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const stockData = new mongoose.Schema({
    symbol: String,
    eps: String,
    peratio: String,
    roe: String,
    opm:String,
    sales: String
})
const stock = mongoose.model("stock", stockData)

async function fetchDataAndStore(symbol){
    const apiKey = 'Y0CWZF3N7VYIA2X1'; // Your Alpha Vantage API key
    const apiUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`;
    try {
        // Fetch data from Alpha Vantage API
        const response = await axios.get(apiUrl);
        const responseData = response.data;

        // Store data in MongoDB
        const addStock = new stock({
            symbol: responseData.Symbol,
            eps: responseData.EPS,
            peratio: responseData.PERatio,
            roe: responseData.ReturnOnEquityTTM * 100,
            opm: responseData.OperatingMarginTTM * 100,
            sales: responseData.MarketCapitalization/responseData.PriceToSalesRatioTTM
        });
        await addStock.save();

        console.log(`Data for symbol ${symbol} fetched and stored successfully`);
    } catch (error) {
        console.error(`Error fetching data for symbol ${symbol}:`, error);
    }
}

const symbols = [
    'IBM', 'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'FB', 'NFLX', 'NVDA', 'INTC',
    'CSCO', 'ADBE', 'PYPL', 'QCOM', 'CMCSA', 'PEP', 'COST', 'TMUS', 'AVGO', 'TXN',
    'GILD', 'SBUX', 'COST', 'MDLZ', 'MNST', 'EBAY', 'AMGN', 'BIIB', 'ADP', 'REGN',
    'WBA', 'BKNG', 'FISV', 'MCHP', 'ILMN', 'LRCX', 'ADI', 'VRTX', 'BIDU', 'MAR',
    'ROST', 'DXCM', 'WDAY', 'IDXX', 'CDNS', 'NTES', 'MTCH', 'SNPS', 'EXC', 'ADI',
    'MRVL', 'EA', 'CTSH', 'CTXS', 'WLTW', 'DISH', 'ZM', 'ANSS', 'CPRT', 'CTAS',
    'FAST', 'CERN', 'MXIM', 'PTON', 'KLAC', 'CDW', 'CDW', 'FANG', 'MELI', 'VRSN',
    'DOCU', 'ULTA', 'CHKP', 'SPLK', 'OKTA', 'LULU', 'ASML', 'DLTR', 'TEAM', 'PAYX',
    'SGEN', 'DXCM', 'KDP', 'AMD', 'SWKS', 'PDD', 'PDD', 'TCOM', 'PTON', 'FOXA',
    'BMRN', 'INCY', 'MXIM', 'MXIM', 'FOXF', 'KLAC', 'ZS', 'WDC', 'LBTYA', 'CHKP',
    'VRSK', 'INCY', 'MTCH', 'AMAT', 'JBHT', 'XEL', 'XLNX', 'MCHP', 'SWKS', 'EXPE'
];


async function fetchAllData() {
    for (const symbol of symbols) {
        await fetchDataAndStore(symbol);
    }
}

// running the script

fetchAllData()
    .then(() => {
        console.log('All data fetched and stored successfully');
        mongoose.disconnect(); // Close MongoDB connection when done
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        mongoose.disconnect(); // Close MongoDB connection on error
    });