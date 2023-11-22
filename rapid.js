const axios = require('axios');
const { response } = require('express');

const apiKey = 'AHWNG05CHF73W0IQ';

const balancesheet = `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=IBM&apikey=LU5FGMOPNPX2JUKC`;
const apiUrl = `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=IBM&apikey=LU5FGMOPNPX2JUKC`
const overview = 'https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=LU5FGMOPNPX2JUKC'



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
        const roe = response.data.ReturnOnEquityTTM
        const opm = response.data.OperatingMarginTTM
        const marketcap = response.data.MarketCapitalization
        const pricetosales = response.data.PriceToSalesRatioTTM
        const sales = marketcap / pricetosales
        console.log(`EPS is: ${eps}`, `PEratio is: ${pe}`, `ROE is: ${roe}`, `OPM is: ${opm}`, `Sales is: ${sales}`)
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });

// this axios request is for balancesheet of the company

axios
    .get(balancesheet)
    .then((response) => {
        const count = response.data.annualReports.length
        for (let i = 0; i < count; i++) {
            const totaldebt = response.data.annualReports[i].shortLongTermDebtTotal
            const totalequity = response.data.annualReports[i].totalShareholderEquity
            const debtToEquity = totaldebt / totalequity
            console.log(`Debt to Equity is : ${debtToEquity}`)

        }
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });