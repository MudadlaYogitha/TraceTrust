const express = require('express');
const cors = require('cors'); 

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require("./routes/adminRoutes");
const errorHandler = require('./middlewares/errorHandler'); 

const app = express();


app.use(express.json()); 
app.use(cors()); 


const blockchainRoutes = require("./routes/blockchainRoutes");
app.use("/api", blockchainRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use("/api/admin", adminRoutes);



app.use(errorHandler);

module.exports = app;