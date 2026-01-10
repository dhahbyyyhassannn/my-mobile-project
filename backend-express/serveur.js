const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(require('cors'));

app.listen(3000, () => {
    console.log("API NAV en écoute sur http://localhost:3000");
});
