const express = require('express');
const routes = require('./src/routes');
const db = require('./src/db/connection');

app = express();
app.use(express.json());
app.use(routes);

app.listen(3000);