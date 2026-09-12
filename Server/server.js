const express = require('express');
const cors = require('cors');
const routes = require('./Routes');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('Public'));

app.use('/api', routes);

app.listen(6000, () => {
  console.log('Ticket booking server is running @http://localhost:6000');
});
