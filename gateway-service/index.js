require('dotenv').config()
const express = require('express');
const cors = require('cors');

const authServiceRoutes = require('./routes/auth-service');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authServiceRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Gateware Service running on port ${process.env.PORT}`)
});