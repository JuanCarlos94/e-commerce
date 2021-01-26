require('dotenv-safe').config();
const express = require('express');
const routes = require('./src/routes');
const db = require('./src/db/connection');


app = express();

/**
 * Enable json data format
 */
app.use(express.json());

/**
 * Add routes
 */
app.use(routes);

app.listen(3000);

module.exports = app;