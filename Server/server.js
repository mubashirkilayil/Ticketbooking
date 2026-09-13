require('dotenv').config();

const express = require('express');
const cors = require('cors');

require('./db');
const routes = require('./Routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Ticket Booking API is running',
  });
});

app.use('/api', routes);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Ticket booking server is running @http://localhost:${PORT}`);
});
