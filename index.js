const express = require('express');
const app = express();
const route = require('./route/route');

app.use('/api', route);

const port = 3000;
app.listen(port, () => {
    console.log("Server is listening");
})