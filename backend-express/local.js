const db = require('./db');

function getLocalFromId(id) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM inventaire');
    })
}