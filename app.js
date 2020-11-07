const express = require('express');

app = express();
app.use(express.json());
app.use(routes);

app.listen(3000);