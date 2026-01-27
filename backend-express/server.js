const express = require('express');
const app = express();
const router = require('./routes/routes');
const port = 5000;
app.use(express.json());
app.use('routes', router);
app.listen(port, () => {
    console.log('serveur demarrer sur $router');
})

