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

stock.find({
    opm: { $gt: 15 },
    roe: { $gt: 15 },
    peratio: { $lt: 50 },
    eps: { $gt: 10 }
})
.then(stocks => {
    console.log("Stocks matching the conditions are:");
    console.log(stocks);
})
.catch(err => {
    console.error("Error fetching stocks:", err);
});