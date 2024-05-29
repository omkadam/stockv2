const mongoose = require('mongoose');
const express = require('express');
const app = express();

const mongoURI = "mongodb+srv://manthanbodkhe1:Indianarmy13@cluster0.piunjeh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define the schema and model
const stockDataSchema = new mongoose.Schema({
    symbol: String,
    eps: String,
    peratio: String,
    roe: String,
    opm: String,
    sales: String
});

const stock = mongoose.model("stock", stockDataSchema);

// Create the endpoint to fetch the filtered data
app.get('/api/performerstocks', async (req, res) => {
    try {
        const stocks = await stock.find({
            opm: { $gt: 15 },
            roe: { $gt: 15 },
            peratio: { $lt: 50 },
            eps: { $gt: 10 }
        });

        res.json(stocks);
    } catch (err) {
        console.error("Error fetching stocks:", err);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
const port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});