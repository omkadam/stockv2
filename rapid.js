const axios = require('axios');
const cors = require('cors');
const express = require('express');
const { response } = require('express');
const mongoose = require('mongoose')


const apiKey = 'AHWNG05CHF73W0IQ';

const balancesheet = `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=IBM&apikey=Y0CWZF3N7VYIA2X1`;
const apiUrl = `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=IBM&apikey=Y0CWZF3N7VYIA2X1`
const overview = 'https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=Y0CWZF3N7VYIA2X1'


const app = express();
app.use(cors());
// Mongodb connection
const mongoURI = "mongodb+srv://manthanbodkhe1:Indianarmy13@cluster0.piunjeh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// creating a schema

const stockData = new mongoose.Schema({
    symbol: String,
    eps: String,
    peratio: String,
    roe: String,
    opm:String,
    sales: String
})

const stock = mongoose.model("stock", stockData)


// this axios request is to get the income data of the company
axios
    .get(apiUrl)
    // .then((response) => {
    //     const data = response.data;
    //     console.log(data);
    // })
    // this below "then" block is givving us only ebit of company
    .then((response) => {
        const reports = response.data.annualReports.length
        for (let i = 0; i < reports; i++) {
            const netincome = response.data.annualReports[i].netIncome
            console.log(`Net profit is : ${netincome}`)
        }
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });

// this axios request is for company overview api

axios
    .get(overview)
    .then((response) => {
        const eps = response.data.EPS
        const pe = response.data.PERatio
        const roe = response.data.ReturnOnEquityTTM * 100
        const opm = response.data.OperatingMarginTTM * 100
        const marketcap = response.data.MarketCapitalization
        const pricetosales = response.data.PriceToSalesRatioTTM
        const sales = marketcap / pricetosales
        const symbol = response.data.Symbol
        const error = []   
        stock.find({symbol:symbol}).then(result => {
            if(result.length>0){
                error.push("eps is already exsist")
            } else {
                const addStock = new stock({
                    symbol:symbol,
                    eps: eps,
                    peratio: pe,
                    roe: roe,
                    opm:opm,
                    sales: sales
                })
                return addStock.save()
            }
        })
        console.log(`EPS is: ${eps}%`, `PEratio is: ${pe}`, `ROE is: ${roe}%`, `OPM is: ${opm}%`, `Sales is: ${sales}`)
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });

// this axios request is for balancesheet of the company
let totalshareholderequity = []
axios
    .get(balancesheet)
    .then((response) => {
        const count = response.data.annualReports.length
        let arr = []

        for (let i = 0; i < count; i++) {

            const totaldebt = response.data.annualReports[i].shortLongTermDebtTotal
            const totalequity = response.data.annualReports[i].totalShareholderEquity
            const debtToEquity = (totaldebt / totalequity)
            arr.push(debtToEquity)
            totalshareholderequity.push(response.data.annualReports[i].totalShareholderEquity)

        }
        let sum = arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        let length = arr.length
        console.log(`Total Debt to Equity Ratio is: ${ Math.floor((sum / length)) }`)


    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });

    // Endpoint to get all data from MongoDB
    app.get('/api/data', async (req, res) => {
        try {
            const reactdata = await stock.find({});
            res.json(reactdata);
        } catch (error) {
            console.error('Error fetching data from MongoDB:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    app.listen(2000, () => {
        console.log(`Server running on port 2000`);
    });