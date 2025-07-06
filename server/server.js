const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const featureRoutes =  require('./Routes/featureRoutes');

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());


const PORT = process.env.PORT || 5000;

app.get('/', (req,res)=>{
    res.send('Hello from AdSnap Server');
})

app.use('/features',featureRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})