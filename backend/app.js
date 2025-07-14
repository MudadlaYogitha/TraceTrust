const express = require('express');
const cors = require('cors'); 

const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const adminRoutes = require("./src/routes/adminRoutes");
const errorHandler = require('./src/middlewares/errorHandler'); 

const app = express();


app.use(express.json()); 
app.use(cors()); 


const blockchainRoutes = require("./src/routes/blockchainRoutes");
app.use("/api", blockchainRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use("/api/admin", adminRoutes);



app.use(errorHandler);

module.exports = app;