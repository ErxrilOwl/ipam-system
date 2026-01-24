require('dotenv').config();
const express = require('express');
const cors = require('cors');

const apiRouter = require('./routes/api');

const errorController = require('./controllers/error');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.use(errorController.get404);

app.listen(process.env.PORT, () => {
    console.log(`Gateware Service running on port ${process.env.PORT}`)
});